import json, re
from datetime import datetime

from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404

from rest_framework.response import Response
from rest_framework import generics, status
from rest_framework.decorators import permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.authentication import JWTAuthentication

from .models import Plant, Location, PlantImage, LocationImage
from .serializers import PlantSerializer, LocationSerializer, LocationImageSerializer, PlantImageSerializer
from core.throttles import AnonBurstRateThrottle, AnonSustainedRateThrottle

User = get_user_model()

JWT_authenticator = JWTAuthentication()

class PlantList(generics.ListCreateAPIView):
    queryset = Plant.objects.all()
    serializer_class = PlantSerializer
    permission_classes = [ AllowAny ]

class PlantDetail(generics.RetrieveAPIView):
    queryset = Plant.objects.all()
    serializer_class = PlantSerializer
    permission_classes = [ IsAuthenticatedOrReadOnly ]

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

class PlantImages(generics.ListAPIView):
    queryset = PlantImage.objects.all()
    serializer_class = PlantImageSerializer

class LocationImages(generics.ListCreateAPIView):
    serializer_class = LocationImageSerializer
    def get_queryset(self):
        query = self.request.GET
        return LocationImage.objects.filter(**query.dict())

