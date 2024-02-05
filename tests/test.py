import pytest
from django.urls import reverse
from pytest_drf import APIViewTest, Returns200, UsesGetMethod
from pytest_lambda import lambda_fixture

from accounts.models import User
from api.models import Plant

@pytest.fixture
def dummyuser(db):
    user = User.objects.create_user('dummyuser1', 'test@pytest.com', 'pydummyuser')
    return user

def test_user(dummyuser):
   assert dummyuser.username == 'dummyuser1'

@pytest.mark.django_db(True)
class TestPlant(
    APIViewTest,
    UsesGetMethod,
    Returns200,
):
    url = lambda_fixture(lambda: reverse('api_plant_list'))
    def test_it_returns_plantlist(self, json):
        print("plantlist:", self, json)
        assert True