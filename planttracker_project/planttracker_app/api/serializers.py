from ..models import Tag, Plant, Location
from django.contrib.auth.models import User
from rest_framework import serializers



class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = "__all__"


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username"]


class PlantSerializer(serializers.ModelSerializer):
    tags = serializers.SlugRelatedField(queryset=Tag.objects.all(), many = True, slug_field='value')
    class Meta:
        model = Plant
        fields = "__all__"
        read_only = "__all__"


class LocationSerializer(serializers.ModelSerializer):
    author = serializers.SlugRelatedField(queryset=User.objects.all(), many=False, slug_field='username')
    plant = serializers.SlugRelatedField(queryset=Plant.objects.all(), many=False, slug_field='scientific_name')
    class Meta: 
        model = Location
        fields = "__all__"
        read_only = ["created_at"]

