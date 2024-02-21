import pytest
from django.urls import reverse

def test_can_get_plants_without_token(plants_db, client, db):
    endpoint = reverse("api_plant_list")
    request = client.get(endpoint)
    assert request.status_code == 200
    assert len(request.data) == len(plants_db)


def test_can_get_plant_detail_without_token(client, db):
    endpoint = reverse("api_plant_detail", args=[5])
    request = client.get(f"{endpoint}")
    assert request.status_code == 200 or 404


def test_can_get_location_list_without_token(client, db):
    endpoint = reverse("api_location_list")
    request = client.get(endpoint)
    assert request.status_code == 200

def test_can_get_location_detail_without_token(client, db):
    endpoint = reverse("api_location_detail", args=[1])
    request = client.get(endpoint)
    assert request.status_code == 200 or 404

def test_cannot_create_location_without_token(client):
    endpoint = reverse("api_location_list")
    request = client.post(endpoint, {"data": "some gibberish"})
    assert request.status_code == 401




