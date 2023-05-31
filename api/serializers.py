from .models import Plant, Location, PlantImage, LocationImage
from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class PlantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plant
        fields = "__all__"
        read_only = "__all__"

class PlantImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlantImage
        fields = "__all__"
        read_only = "__all__"

class LocationImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = LocationImage
        fields = "__all__"

class LocationSerializer(serializers.ModelSerializer):
    author = serializers.SlugRelatedField(queryset=User.objects.all(), many=False, slug_field='pk')
    plant = serializers.SlugRelatedField(queryset=Plant.objects.all(), many=False, slug_field='pk')
    class Meta: 
        model = Location
        fields = "__all__"
        read_only = ["created_at"]

