import uuid
from django.shortcuts import render
from django.core.exceptions import ValidationError


# Create your views here.
from datetime import datetime
import json, re
from django.contrib.auth import get_user_model


from django.core.mail import send_mail
from django.shortcuts import get_object_or_404
from django.core import serializers
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.models import User

from rest_framework.throttling import AnonRateThrottle
from rest_framework.response import Response
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.decorators import permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.views import TokenBlacklistView

from .models import ActivationUUID, ResetUUID
from .serializers import UserSerializer, ActivationUUIDSerializer, ResetUUIDSerializer, UserSerializer
from core.throttles import AnonBurstRateThrottle, AnonSustainedRateThrottle
from core.settings import AUTH_PASSWORD_VALIDATORS
from django.contrib.auth.password_validation import validate_password

User = get_user_model()

JWT_authenticator = JWTAuthentication()


class MyAccount(generics.RetrieveUpdateDestroyAPIView):
    """
    Account management view for non staff users. 
    Allows to retrieve account data and to soft-delete the account.
    """
    serializer_class = UserSerializer
    queryset = User.objects.all()
    def get_object(self):
        token = None
        valid_auth_data = JWT_authenticator.authenticate(self.request)
        if valid_auth_data:
            [user, token] = valid_auth_data
        return get_object_or_404(User, pk=token.payload['user_id'])
    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        user = self.get_object()
        user_serializer = UserSerializer(user, data=request.data, partial=True)
        if user_serializer.is_valid(raise_exception=True):
            if request.data.get('password'):
                user.set_password(request.data.get('password'))
                user.save()
                return Response(status=status.HTTP_200_OK)
            return self.update(request, *args, **kwargs)
        return Response(status=status.HTTP_400_BAD_REQUEST)
    def delete(self, request, *args, **kwargs):
        """
        soft delete feature:
        scramble username and email, set user inactive
        """
        user = self.get_object()
        user.username = uuid.uuid4()
        user.email = f'{uuid.uuid4()}@deleted.com'
        user.is_active = False
        user.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

class UserList(generics.ListCreateAPIView):
    # throttle_classes = [AnonBurstRateThrottle, AnonSustainedRateThrottle]
    permission_classes = [ AllowAny ]
    def post(self, request):
        """when creating a new user from the frontend:
        - an activation uuid is created
        - the user is by default set to inactive (until he clicks the link in the activation link
        - the activation link is sent by email
        """
        user_serializer = UserSerializer(data=request.data)
        uuid = None
        if user_serializer.is_valid():
            uuid_serializer = ActivationUUIDSerializer(data={"email": request.data["email"]})
            if uuid_serializer.is_valid():
                uuid_serializer.save()
                uuid = uuid_serializer.data['id']
            user_instance = user_serializer.save()
            user_instance.is_active = False
            user_instance.save()
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

class SendResetLink(generics.CreateAPIView):
    throttle_classes = [AnonBurstRateThrottle, AnonSustainedRateThrottle]
    permission_classes = [ AllowAny ]
    def post(self, request):
        email = request.data['email']
        existing_users = User.objects.filter(email=request.data['email'])
        if not bool(existing_users.values()):
            #if email not in database, send email to self to prevent attacks
            email = 'kraeuterblog@gmx.net'
        uuid_serializer = ResetUUIDSerializer(data={"email": email})
        if uuid_serializer.is_valid():
            uuid_serializer.save()
            uuid = uuid_serializer.data['id']
            try:
                send_mail(
                'You have requested a reset link',
                f"Please click on the following link to activate your account:\
                localhost:5173/reset?{uuid}",
                'planttrackerapp@gmx.de',
                [email],
                fail_silently=False,
                )
            except Exception as err:
                return Response("An error occured while sending the reset mail. This may be due to an invalid email address.", status=status.HTTP_500_INTERNAL_SERVER_ERROR)                
        return Response("Please open your mailbox, we have sent you an password reset link.", status=status.HTTP_201_CREATED)

class UserActivate(generics.RetrieveAPIView):
    queryset = ActivationUUID.objects.all()
    throttle_classes = [ AnonBurstRateThrottle, AnonSustainedRateThrottle ]
    permission_classes = [ AllowAny ]
    def get(self, request, id):
        uuid_instance = get_object_or_404(ActivationUUID, id=id)
        if uuid_instance:
            if datetime.now() < uuid_instance.expiry_time.replace(tzinfo=None):
                uuid_instance.delete()
                user_instance = get_object_or_404(User, email=uuid_instance.email)
                user_instance.is_active = True
                user_instance.save()               
                return Response({"success": "Your account has been activated."}, status=status.HTTP_204_NO_CONTENT)
        return Response({"error": "Something went wrong, request another activation token."}, status=status.HTTP_404_NOT_FOUND)

class ResetPassword(generics.RetrieveAPIView):
    queryset = ResetUUID.objects.all()
    throttle_classes = [ AnonBurstRateThrottle, AnonSustainedRateThrottle ]
    permission_classes = [ AllowAny ]
    def post(self, request, id):
        uuid_instance = get_object_or_404(ResetUUID, id=id)
        print(uuid_instance, request.data['password'])
        if uuid_instance:
            if datetime.now() < uuid_instance.expiry_time.replace(tzinfo=None):
                uuid_instance.delete()
                user_instance = get_object_or_404(User, email=uuid_instance.email)
                user_instance.set_password(request.data['password'])
                user_instance.save()
                return Response({"success":"Your password has been reset."}, status=status.HTTP_204_NO_CONTENT)
        return Response({"error": "Something went wrong, please try again later."}, status=status.HTTP_404_NOT_FOUND)



class AuthTest(generics.GenericAPIView):
    permission_classes = [ IsAuthenticated ]
    authentication_classes = [ JWTAuthentication ]
    def get(self, request):
        auth_data = JWT_authenticator.authenticate(request)
        if auth_data is not None:
            [user, token] = auth_data
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
