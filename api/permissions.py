from rest_framework import permissions
from rest_framework_simplejwt.authentication import JWTAuthentication
JWT_authenticator = JWTAuthentication()

class IsAuthorOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        response = JWT_authenticator.authenticate(request)
        print(response)
        if response is not None:
            [id, token] = response
            if id == obj.author:
                return True

        return False