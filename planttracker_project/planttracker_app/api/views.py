from datetime import datetime
import json
from django.core.mail import send_mail
from django.shortcuts import get_object_or_404


from rest_framework.throttling import AnonRateThrottle
from rest_framework.response import Response
from rest_framework import generics, status

from rest_framework.decorators import permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from planttracker_app.api.throttles import AnonBurstRateThrottle, AnonSustainedRateThrottle

from django.contrib.auth.models import User
from ..models import Tag, Plant, Location, ActivationUUID
from .serializers import UserSerializer, TagSerializer, PlantSerializer, LocationSerializer, RegisterUserSerializer, ActivationUUIDSerializer
from .permissions import IsAuthorOrReadOnly

from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.views import TokenBlacklistView

JWT_authenticator = JWTAuthentication()

class PlantList(generics.ListAPIView):
    queryset = Plant.objects.all()
    serializer_class = PlantSerializer
    permission_classes = [ IsAuthenticatedOrReadOnly ]


class PlantDetail(generics.RetrieveAPIView):
    queryset = Plant.objects.all()
    serializer_class = PlantSerializer
    permission_classes = [ IsAuthenticatedOrReadOnly ]

class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = "username"

class LocationList(generics.ListCreateAPIView):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    permission_classes = [ IsAuthenticatedOrReadOnly ]
    parser_classes = [ MultiPartParser, FormParser ]
    def post(self, request, format=None):
        auth_data = JWT_authenticator.authenticate(request)
        if auth_data is not None:
            [user, token] = auth_data
            #make multipart query set mutable in order to add author
            setattr(request.data, '_mutable', True)
            request.data['author'] = token.payload['user_id']
            serializer = LocationSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response("Submission successful", status=status.HTTP_201_CREATED)
            else: 
                print(serializer.errors)
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
        reg_serializer = RegisterUserSerializer(data=request.data)
        existing_users = User.objects.filter(username=request.data['username']) | User.objects.filter(email=request.data['email'])
        if bool(existing_users.values()):
            error = "Something went wrong, please try again. If the issue persists, you may want to choose another username."
            return Response(error, status=status.HTTP_403_FORBIDDEN)
        if reg_serializer.is_valid():
            uuid_serializer = ActivationUUIDSerializer(data={"email": request.data["email"]})
            if uuid_serializer.is_valid():
                uuid_serializer.save()
                uuid = ActivationUUID.objects.filter(email=request.data["email"]).values()[0]["id"]
            newuser = reg_serializer.save()
            user_instance = User.objects.get(email=request.data["email"])
            user_instance.is_active = False
            user_instance.save()
            if newuser:
                send_mail(
                    'Welcome to the Planttracker Project',
                    f"Please click on the following link to activate your account:\
                    localhost:5173/activate?{uuid}",
                    'planttrackerapp@gmx.de',
                    [request.data['email']],
                    fail_silently=False,
                )                
            return Response("Your account has been created. An email with an activation code has been sent.", status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)

class UserActivate(generics.RetrieveAPIView):
    queryset = ActivationUUID.objects.all()
    throttle_classes = [ AnonBurstRateThrottle, AnonSustainedRateThrottle ]
    permission_classes = [ AllowAny ]
    def get(self, request, id):
        uuid_instance = get_object_or_404(ActivationUUID, id=id)
        if uuid_instance:
            if datetime.now() < uuid_instance.expiry_time.replace(tzinfo=None):
                print("valid")
                uuid_instance.delete()
                user_instance = get_object_or_404(User, email=uuid_instance.email)
                user_instance.is_active = True
                user_instance.save()               
                return Response("Your account has been activated.", status=status.HTTP_204_NO_CONTENT)
        return Response("Something went wrong, request another activation token.", status=status.HTTP_404_NOT_FOUND)

class AuthTest(generics.GenericAPIView):
    permission_classes = [ IsAuthenticated ]
    authentication_classes = [ JWTAuthentication]
    queryset = Plant.objects.all()
    def get(self, request):
        auth_data = JWT_authenticator.authenticate(request)
        if auth_data is not None:
            [user, token] = auth_data
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)