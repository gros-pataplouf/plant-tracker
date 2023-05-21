from .models import ActivationUUID, ResetUUID
from rest_framework import serializers
from django.contrib.auth import get_user_model
User = get_user_model()

class ActivationUUIDSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivationUUID
        fields = "__all__"

class ResetUUIDSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResetUUID
        fields = "__all__"

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('email', 'username', 'password', 'id')

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
