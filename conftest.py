import pytest, json
from django.urls import reverse
from pytest_factoryboy import register
from tests.factories import UserFactory, PlantFactory, UserFactory2
from tests.factories import fake_password
from rest_framework.test import APIClient

register(UserFactory)
register(UserFactory2)
register(PlantFactory)


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

@pytest.fixture
def authuser_clientheaders2(user_factory2, db):
    client = APIClient()
    user = user_factory2.create()
    endpoint = reverse('token_obtain_pair')
    request = client.post(endpoint, {'username': user.username, 'password': fake_password}, format='json')
    client.credentials(HTTP_AUTHORIZATION='JWT ' + request.data.get('access'))
    return user, client


@pytest.fixture
def authuser_clientheaders_invalid(user_factory, db):
    client = APIClient()
    user = user_factory.create()
    endpoint = reverse('token_obtain_pair')
    request = client.post(endpoint, {'username': user.username, 'password': fake_password}, format='json')
    client.credentials(HTTP_AUTHORIZATION='JWT ' + request.data.get('access').replace("a", "0"))
    return user, client


@pytest.fixture
def plants_db(plant_factory, db, plants=None):
    plant1 = plant_factory.create(scientific_name="Plantum plantum", common_name_en="Plant", family="Plantae")
    plant2 = plant_factory.create(scientific_name="Ficus benjamini", common_name_en="Gummibaum", family="Topfpflanzen")
    return [plant1, plant2]