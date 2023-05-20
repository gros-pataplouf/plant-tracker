from datetime import datetime
import json, re

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

from ..models import Plant, Location, ActivationUUID, ResetUUID, PlantImage, LocationImage
from .serializers import UserSerializer, PlantSerializer, LocationSerializer, LocationImageSerializer, RegisterUserSerializer, ActivationUUIDSerializer, PlantImageSerializer, ResetUUIDSerializer
from .permissions import IsAuthorOrReadOnly
from .throttles import AnonBurstRateThrottle, AnonSustainedRateThrottle

JWT_authenticator = JWTAuthentication()

class PlantList(generics.ListCreateAPIView):
    queryset = Plant.objects.all()
    serializer_class = PlantSerializer
    permission_classes = [ AllowAny ]

class PlantDetail(generics.RetrieveAPIView):
    queryset = Plant.objects.all()
    serializer_class = PlantSerializer
    permission_classes = [ IsAuthenticatedOrReadOnly ]

class MyAccount(generics.RetrieveUpdateDestroyAPIView):
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
        if request.data.get('password'):
            user = self.get_object()
            user.set_password(request.data.get('password'))
            user.save()
            return Response(data="Password successfully reset", status=status.HTTP_204_NO_CONTENT)
        elif request.data.get('email'):
            users = User.objects.filter(email=request.data.get('email'))
            # Check whether email already in use for other user
            filtered = list(filter(lambda user: user != self.get_object(), list(users)))
            if len(filtered) > 0:
                return Response("This email cannot be associated with your account", status=status.HTTP_403_FORBIDDEN)
        return self.update(request, *args, **kwargs)
    

class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserList(generics.ListAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()

class LocationList(generics.ListCreateAPIView):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    permission_classes = [ IsAuthenticatedOrReadOnly ]
    parser_classes = [ MultiPartParser, FormParser ]
    def get_queryset(self):
        query = self.request.GET
        return Location.objects.filter(**query.dict())

    def post(self, request, format=None):
        auth_data = JWT_authenticator.authenticate(request)
        if auth_data is not None:
            [user, token] = auth_data
            #make multipart query set mutable in order to add author
            setattr(request.data, '_mutable', True)
            request.data['author'] = token.payload['user_id']

            location_serializer = LocationSerializer(data=request.data)
            if location_serializer.is_valid():
                location_serializer.save()
                #step 2 : now get the id of the new location object and save the images
                location_id = location_serializer.data['id']
                print(location_id)
                if request.FILES:
                    for lst in dict(request.FILES).values():
                        for file in lst:
                            location_img_serializer = LocationImageSerializer(data={'location': location_id, 'image': file})
                            if (location_img_serializer.is_valid()):
                                location_img_serializer.save()
                            else:
                                return Response("Data submitted are invalid or incomplete.", status=status.HTTP_400_BAD_REQUEST)
                return Response(location_id, status=status.HTTP_201_CREATED)
            else: 
                print(location_serializer.errors)
                return Response("Data submitted are invalid or incomplete.", status=status.HTTP_400_BAD_REQUEST)
        return Response("Unauthorized", status=status.HTTP_401_UNAUTHORIZED)

class LocationDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    permission_classes = [ IsAuthenticatedOrReadOnly ]

class UserCreate(generics.ListCreateAPIView):
    throttle_classes = [AnonBurstRateThrottle, AnonSustainedRateThrottle]
    permission_classes = [ AllowAny ]
    def post(self, request):
        uuid=""
        pwd = request.data['password']
        # \W any non alphanumeric character \d decimal [a-z] [A-Z]
        if len(pwd) < 8 or not re.search('[A-Z]', pwd) or not re.search('[a-z]', pwd)  or not re.search('[0-9]', pwd)  or not re.search('[\W]', pwd) :
            return Response("Your password does not meet the requirements.", status=status.HTTP_400_BAD_REQUEST)
        existing_users = User.objects.filter(username=request.data['username']) | User.objects.filter(email=request.data['email'])
        if bool(existing_users.values()):
            error = "Something went wrong, please try again. If the issue persists, you may want to choose another username."
            return Response(error, status=status.HTTP_403_FORBIDDEN)
        reg_serializer = RegisterUserSerializer(data=request.data)
        if reg_serializer.is_valid():
            uuid_serializer = ActivationUUIDSerializer(data={"email": request.data["email"]})
            if uuid_serializer.is_valid():
                uuid_serializer.save()
                uuid = uuid_serializer.data['id']
            newuser = reg_serializer.save()
            user_instance = User.objects.get(email=request.data["email"])
            user_instance.is_active = False
            user_instance.save()
            if newuser:
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
                    return Response("An error occured while sending the activation mail. This may be due to an invalid email address.", status=status.HTTP_500_INTERNAL_SERVER_ERROR)                
            return Response("Your account has been created. An email with an activation code has been sent.", status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)

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
                return Response("Your account has been activated.", status=status.HTTP_204_NO_CONTENT)
        return Response("Something went wrong, request another activation token.", status=status.HTTP_404_NOT_FOUND)

class AuthTest(generics.GenericAPIView):
    permission_classes = [ IsAuthenticated ]
    authentication_classes = [ JWTAuthentication ]
    queryset = Plant.objects.all()
    def get(self, request):
        auth_data = JWT_authenticator.authenticate(request)
        if auth_data is not None:
            [user, token] = auth_data
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

class PlantImages(generics.ListAPIView):
    queryset = PlantImage.objects.all()
    serializer_class = PlantImageSerializer

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
                return Response("Your password has been reset.", status=status.HTTP_204_NO_CONTENT)
        return Response("Something went wrong, please try again later.", status=status.HTTP_404_NOT_FOUND)



class LocationImages(generics.ListCreateAPIView):
    serializer_class = LocationImageSerializer
    def get_queryset(self):
        query = self.request.GET
        return LocationImage.objects.filter(**query.dict())

