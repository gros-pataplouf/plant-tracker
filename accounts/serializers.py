import re
from .models import ActivationUUID, ResetUUID
from rest_framework import serializers
from django.core.exceptions import ValidationError
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
        extra_kwargs = {'password': {'write_only': True}}
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None: 
            instance.set_password(password)
        instance.save()
        return instance
    def validate_password(self, value):
        if not re.search('[A-Z]', value) or not re.search('[a-z]', value)  or not re.search('[0-9]', value) or not re.search('[\W]', value):
            raise ValidationError(
                "This password does not meet the requirements.\
                    It must contain at least one uppercase letter,\
                    one lower case letter, one special character and one number",
                code="password not strong enough")
        if len(value) < 8:
            raise ValidationError(
                    "This password is too short. It must contain at least 8 characters.",
                    code="password_too_short",
                    params={"min_length": 8})
        return value
