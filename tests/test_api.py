import pytest
from django.urls import reverse

def test_can_get_plants_without_token(plants_db, client, db):
    endpoint = reverse("api_plant_list")
    request = client.get(endpoint)
    assert request.status_code == 200
    assert len(request.data) == len(plants_db)