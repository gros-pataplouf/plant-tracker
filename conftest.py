import pytest

from pytest_factoryboy import register
from  tests.factories import UserFactory

from rest_framework.test import APIClient

@pytest.fixture
def client():
    return APIClient()

register(UserFactory)