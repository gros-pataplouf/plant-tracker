import pytest, json, os
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from api.models import Plant

def test_can_get_plants_without_token(plants_db, client, db):
    endpoint = reverse("api_plant_list")
    request = client.get(endpoint)
    assert request.status_code == 200
    assert len(request.data) == len(plants_db)

def test_can_get_plant_detail_without_token(client, plants_db, db):
    existing_plant_id = Plant.objects.filter(scientific_name="Plantum plantum")[0].id
    endpoint = reverse("api_plant_detail", args=[existing_plant_id])
    request = client.get(endpoint)
    assert request.status_code == 200

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

def test_invalid_location_data_with_token_return_400(authuser_clientheaders, db):
    [user, client] = authuser_clientheaders
    endpoint = reverse("api_location_list")
    request = client.post(endpoint, {"data": "some gibberish"})
    assert request.status_code == 400

def test_can_upload_image_file_with_location(authuser_clientheaders, plants_db, db):
    [user, client] = authuser_clientheaders
    existing_plant = Plant.objects.filter(scientific_name="Plantum plantum")
    endpoint = reverse("api_location_list")
    test_dir = os.path.dirname(os.path.realpath(__file__))
    with open(f"{test_dir}/data/testphoto.jpg", "rb") as testfile:
        img = SimpleUploadedFile(f"{test_dir}/testphoto.jpg", testfile.read(), content_type='multipart/form-data')
        request = client.post(endpoint, {
            "plant": existing_plant[0].id,
            "area": 1,
            "location": 
            json.dumps({ #must be converted to string bc multipart requests cannot be nested
                "type": "Point",
                "coordinates": [50.123, -10.123]}),
            "images" : [img]
            },
            format='multipart'
            )
        assert request.status_code == 201

def test_can_get_plant_images_without_auth(client, db):
    endpoint = reverse("api_plant_images")
    request = client.get(endpoint)
    assert request.status_code == 200

def test_can_get_location_images_without_auth(client, db):
    endpoint = reverse("api_location_images")
    request = client.get(endpoint)
    assert request.status_code == 200

def test_can_get_location_detail_without_auth(client, db):
    endpoint = reverse("api_location_detail", args=[3])
    request = client.get(endpoint)
    assert request.status_code == 200 or 404

def test_author_can_delete_location(authuser_clientheaders, plants_db, db):
    endpoint_list = reverse("api_location_list")
    [user, client] = authuser_clientheaders
    existing_plant = Plant.objects.filter(scientific_name="Plantum plantum")
    test_dir = os.path.dirname(os.path.realpath(__file__))
    request = client.post(endpoint_list, {
            "plant": existing_plant[0].id,
            "area": 1,
            "location": 
            json.dumps({ #must be converted to string bc multipart requests cannot be nested
                "type": "Point",
                "coordinates": [50.123, -10.123]})
                },
            format='multipart'
            )
    location_id = request.data
    endpoint_detail = reverse("api_location_detail", args=[location_id])
    deletion_request = client.delete(endpoint_detail)
    assert deletion_request.status_code == 204

def test_cannot_delete_location_if_not_author(authuser_clientheaders, authuser_clientheaders2, plants_db, db):
    endpoint_list = reverse("api_location_list")
    [user, client] = authuser_clientheaders
    [user2, client2] = authuser_clientheaders2
    existing_plant = Plant.objects.filter(scientific_name="Plantum plantum")
    request = client.post(endpoint_list, {
            "plant": existing_plant[0].id,
            "area": 1,
            "location": 
            json.dumps({ #must be converted to string bc multipart requests cannot be nested
                "type": "Point",
                "coordinates": [50.123, -10.123]})
                },
            format='multipart'
            )
    location_id = request.data
    endpoint_detail = reverse("api_location_detail", args=[location_id])
    deletion_request = client2.delete(endpoint_detail)
    assert deletion_request.status_code == 403
