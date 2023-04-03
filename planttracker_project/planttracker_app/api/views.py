from datetime import datetime
from django.core.mail import send_mail
from django.shortcuts import get_object_or_404

from rest_framework.throttling import AnonRateThrottle
from rest_framework.response import Response
from rest_framework import generics, status

from rest_framework.decorators import permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny, IsAuthenticated

from planttracker_app.api.throttles import AnonBurstRateThrottle, AnonSustainedRateThrottle

from django.contrib.auth.models import User
from ..models import Tag, Plant, Location, ActivationUUID
from .serializers import UserSerializer, TagSerializer, PlantSerializer, LocationSerializer, RegisterUserSerializer, ActivationUUIDSerializer
from .permissions import IsAuthorOrReadOnly

from rest_framework_simplejwt.authentication import JWTAuthentication
JWT_authenticator = JWTAuthentication()

class PlantList(generics.ListCreateAPIView):
    queryset = Plant.objects.all()
    serializer_class = PlantSerializer
    permission_classes = [ IsAuthorOrReadOnly ]


class PlantDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Plant.objects.all()
    serializer_class = PlantSerializer
    permission_classes = [ IsAuthorOrReadOnly ]

class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = "username"

class LocationList(generics.ListCreateAPIView):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    permission_classes = [ IsAuthorOrReadOnly ]

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
            print(reg_serializer.validated_data)
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
                uuid_instance.delete()
                user_instance = get_object_or_404(User, email=uuid_instance.email)
                user_instance.is_active = True
                user_instance.save()               
                return Response("Your account has been activated.", status=status.HTTP_204_NO_CONTENT)
        return Response("Something went wrong, request another activation token.", status=status.HTTP_404_NOT_FOUND)

