import jwt
from django.urls import reverse
from factories import fake_password
from core.settings import SECRET_KEY


def test_can_get_tokens(client, user_factory, db):
    endpoint = reverse('token_obtain_pair')
    user = user_factory.create()
    response = client.post(endpoint, {'username': user.username, 'password': fake_password}, format='json')
    assert response.status_code == 200
    access_token = jwt.decode(jwt=response.data.get("access"), key=SECRET_KEY, algorithms=["HS256"])
    assert access_token.get('user_id')
    refresh_token = jwt.decode(jwt=response.data.get("access"), key=SECRET_KEY, algorithms=["HS256"])
    assert refresh_token.get('user_id')