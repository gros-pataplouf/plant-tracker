import pytest
from django.urls import reverse
from pytest_factoryboy import register
from  tests.factories import UserFactory
from tests.factories import fake_password
from rest_framework_simplejwt.authentication import JWTAuthentication

from rest_framework.test import APIClient
register(UserFactory)

@pytest.fixture
def client():
    return APIClient()

@pytest.fixture
def unauthenticated_user(user_factory, db):
    return user_factory.create()

@pytest.fixture
def authuser_clientheaders(user_factory, db):
    client = APIClient()
    user = user_factory.create()
    endpoint = reverse('token_obtain_pair')
    request = client.post(endpoint, {'username': user.username, 'password': fake_password}, format='json')
    client.credentials(HTTP_AUTHORIZATION='JWT ' + request.data.get('access'))
    return user, client

