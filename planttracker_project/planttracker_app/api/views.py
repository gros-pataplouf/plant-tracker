from ..models import Tag, Plant, Location
from django.contrib.auth.models import User
from rest_framework.response import Response
from .serializers import UserSerializer, TagSerializer, PlantSerializer, LocationSerializer, RegisterUserSerializer
from rest_framework.throttling import AnonRateThrottle

from rest_framework import generics, status
from rest_framework.decorators import permission_classes, authentication_classes
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny
from planttracker_app.api.throttles import AnonBurstRateThrottle, AnonSustainedRateThrottle
from django.core.mail import send_mail


class PlantList(generics.ListCreateAPIView):
    queryset = Plant.objects.all()
    serializer_class = PlantSerializer


class PlantDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Plant.objects.all()
    serializer_class = PlantSerializer

class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = "username"

class LocationList(generics.ListCreateAPIView):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    permission_classes = [ IsAuthenticatedOrReadOnly ]


class LocationDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    permission_classes = [ IsAuthenticatedOrReadOnly ]

class UserCreate(generics.ListCreateAPIView):
    throttle_classes = [AnonBurstRateThrottle, AnonSustainedRateThrottle]
    permission_classes = [ AllowAny ]
    def post(self, request):
        reg_serializer = RegisterUserSerializer(data=request.data)
        existing_users = User.objects.filter(username=request.data['username']) | User.objects.filter(email=request.data['email'])
        if bool(existing_users.values()):
            error = "Something went wrong, please try again. If the issue persists, you may want to choose another username."
            return Response(error, status=status.HTTP_403_FORBIDDEN)
        if reg_serializer.is_valid():
            newuser = reg_serializer.save()
            if newuser:
                send_mail(
                    'Welcome to the Planttracker Project',
                    'Please click on the following link to activate your account.',
                    'planttrackerapp@gmx.de',
                    [request.data['email']],
                    fail_silently=False,
                )                
                return Response(status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)