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
    author = serializers.SlugRelatedField(queryset=User.objects.all(), many=False, slug_field='pk')
    plant = serializers.SlugRelatedField(queryset=Plant.objects.all(), many=False, slug_field='pk')
    class Meta: 
        model = Location
        fields = "__all__"
        read_only = ["created_at"]

class RegisterUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('email', 'username', 'password')
        extra_kwargs = {'password': {'write_only': True}}
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None: 
            instance.set_password(password)
        instance.save()
        return instance