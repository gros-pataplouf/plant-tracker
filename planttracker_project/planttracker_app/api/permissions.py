from rest_framework import permissions
from rest_framework_simplejwt.authentication import JWTAuthentication
JWT_authenticator = JWTAuthentication()

class IsAuthorOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        response = JWT_authenticator.authenticate(request)
        print(response)
        if response is not None:
            [username, token] = response
            print(username, token)
        return True


    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        response = JWT_authenticator.authenticate(request)
        print(response)
        if response is not None:
            [username, token] = response
            print(username, token)
            if user == obj.author:
                return True

        return True