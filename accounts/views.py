import json, re, uuid
from datetime import datetime
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.shortcuts import get_object_or_404
from rest_framework.throttling import AnonRateThrottle
from rest_framework.response import Response
from rest_framework import generics, status
from rest_framework.decorators import permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny, IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from .models import ActivationUUID, ResetUUID
from .serializers import UserSerializer, ActivationUUIDSerializer, ResetUUIDSerializer
from core.throttles import AnonBurstRateThrottle, AnonSustainedRateThrottle

User = get_user_model()
JWT_authenticator = JWTAuthentication()


class MyAccount(generics.RetrieveUpdateDestroyAPIView):
    """
    Account management view for authenticated non staff users. 
    Retrieve, update, (soft-) delete.
    """
    permission_classes = [ IsAuthenticated ]
    authentication_classes = [ JWTAuthentication ]
    serializer_class = UserSerializer
    queryset = User.objects.all()
    def get_object(self):
        token = None
        valid_auth_data = JWT_authenticator.authenticate(self.request)
        if valid_auth_data:
            [user, token] = valid_auth_data
        else:
            return Response({"failure": "user not authorized, please log in to continue"}, status=status.HTTP_401_UNAUTHORIZED)
        return get_object_or_404(User, pk=token.payload['user_id'])

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        user = self.get_object()
        user_serializer = UserSerializer(user, data=request.data, partial=True)
        if user_serializer.is_valid(raise_exception=True):
            if request.data.get('password'):
                user.set_password(request.data.get('password'))
                user.save()
                return Response({"success": "Password reset successful"}, status=status.HTTP_200_OK)
            return self.update(request, *args, **kwargs)
        return Response(status=status.HTTP_400_BAD_REQUEST)
    def destroy(self, request, *args, **kwargs):
        """
        soft delete feature:
        scramble username and email, set user inactive
        """
        user = self.get_object()
        user.username = uuid.uuid4()
        user.email = f'{uuid.uuid4()}@deleted.com'
        user.is_active = False
        user.save()
        return Response({"success": "Account successfully deleted."}, status=status.HTTP_204_NO_CONTENT)
    
class UserList(generics.CreateAPIView):
    """Endpoint for anonymous user for account creation"""
    throttle_classes = [ AnonBurstRateThrottle, AnonSustainedRateThrottle ]
    permission_classes = [ AllowAny ]
    def create(self, request):
        """when creating a new user from the frontend:
        - an activation uuid is created
        - the user is by default set to inactive (until he clicks the link in the activation link
        - the activation link is sent by email
        """
        user_serializer = UserSerializer(data=request.data)
        uuid = None
        if user_serializer.is_valid():
            user_instance = user_serializer.save()
            user_instance.is_active = False
            user_instance.save()
            uuid_serializer = ActivationUUIDSerializer(data={"user": user_instance.id})
            if uuid_serializer.is_valid():
                uuid_serializer.save()
                uuid = uuid_serializer.data['id']
            try:
                send_mail(
                'Welcome to the Planttracker Project',
                f"Please click on the following link to activate your account:\
                localhost:5173/activate?{uuid}",
                'planttrackerapp@gmx.de',
                [request.data['email']],
                fail_silently=False,
                )
            except Exception as err:
                return Response({"email": "An error occured while sending the activation mail. This may be due to an invalid email address."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)                
            return Response({"success": "Your account has been created. An email with an activation code has been sent."}, status=status.HTTP_201_CREATED)
        else:
            return Response(user_serializer.errors, status=status.HTTP_403_FORBIDDEN)
        return Response({error: "An unknown error has occured"}, status=status.HTTP_400_BAD_REQUEST)

class UserActivate(generics.RetrieveAPIView):
    queryset = ActivationUUID.objects.all()
    throttle_classes = [ AnonBurstRateThrottle, AnonSustainedRateThrottle ]
    permission_classes = [ AllowAny ]
    def retrieve(self, request, id):
        uuid_instance = get_object_or_404(ActivationUUID, id=id)
        if uuid_instance:
            if datetime.now() < uuid_instance.expiry_time.replace(tzinfo=None):
                uuid_instance.delete()
                user_instance = uuid_instance.user
                user_instance.is_active = True
                user_instance.save()               
                return Response({"success": "Your account has been activated."}, status=status.HTTP_204_NO_CONTENT)
        return Response({"error": "Something went wrong, request another activation token."}, status=status.HTTP_404_NOT_FOUND)


class CreateResetLink(generics.CreateAPIView):
    throttle_classes = [AnonBurstRateThrottle, AnonSustainedRateThrottle]
    permission_classes = [ AllowAny ]
    def post(self, request):
        email = request.data['email']
        requested_user = get_object_or_404(User, email=request.data['email'])
        uuid_serializer = ResetUUIDSerializer(data={"user": requested_user.id})
        if uuid_serializer.is_valid():
            uuid_serializer.save()
            uuid = uuid_serializer.data['id']
            print(uuid)
            try:
                send_mail(
                'You have requested a reset link',
                f"Please click on the following link to activate your account:\
                localhost:5173/#/reset?{uuid}",
                'planttrackerapp@gmx.de',
                [email],
                fail_silently=False,
                )
            except Exception as err:
                return Response("An error occured while sending the reset mail. This may be due to an invalid email address.", status=status.HTTP_500_INTERNAL_SERVER_ERROR)                
        return Response("Please open your mailbox, we have sent you an password reset link.", status=status.HTTP_201_CREATED)


class ResetPassword(generics.UpdateAPIView):
    """
    allows anonymous user with existing account credentials to reset password through url containing uuid
    """
    throttle_classes = [ AnonBurstRateThrottle, AnonSustainedRateThrottle ]
    permission_classes = [ AllowAny ]
    def put(self, request, pk):
        print("hello", pk)
        uuid_instance = get_object_or_404(ResetUUID, id=pk)
        user_instance = uuid_instance.user        
        if uuid_instance:
            print(uuid_instance)
            if datetime.now() < uuid_instance.expiry_time.replace(tzinfo=None):
                user_serializer = UserSerializer(user_instance, data=request.data, partial=True)
                if user_serializer.is_valid(raise_exception=True):
                    user_instance.set_password(request.data['password'])
                    user_instance.save()
                    uuid_instance.delete()
                    return Response({"success":"Your password has been reset."}, status=status.HTTP_204_NO_CONTENT)
                else:
                    return Response({"error": "Something went wrong, please try again."}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"error": "Something went wrong, please request another reset link."}, status=status.HTTP_200_OK)
