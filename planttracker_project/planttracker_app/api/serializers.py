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
        fields = ["first_name", "last_name", "email"]


class PlantSerializer(serializers.ModelSerializer):
    tags = serializers.SlugRelatedField(queryset=Tag.objects.all(), many = True, slug_field='value')
    class Meta:
        model = Plant
        fields = "__all__"
        read_only = "__all__"


class LocationSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Location
        fields = "__all__"
        read_only = ["created_at"]

