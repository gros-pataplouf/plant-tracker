import jwt
from django.urls import reverse
from factories import fake_password
from core.settings import SECRET_KEY


def test_can_get_tokens(client, unauthenticated_user, db):
    endpoint = reverse('token_obtain_pair')
    request = client.post(endpoint, {'username': unauthenticated_user.username, 'password': fake_password}, format='json')
    assert request.status_code == 200
    decoded_access_token = jwt.decode(jwt=request.data.get("access"), key=SECRET_KEY, algorithms=["HS256"])
    assert decoded_access_token.get('user_id')
    decoded_refresh_token = jwt.decode(jwt=request.data.get("access"), key=SECRET_KEY, algorithms=["HS256"])
    assert decoded_refresh_token.get('user_id')

def test_unauthenticated_no_account_details(client, db):
    endpoint = reverse('accounts_me')
    request = client.get(endpoint)
    assert request.status_code == 401

def test_authenticated_gets_account_details(authuser_clientheaders, db):
    [user, client] = authuser_clientheaders
    endpoint = reverse('accounts_me')
    request = client.get(endpoint)
    assert request.status_code == 200

def test_authenticated_updates_email(authuser_clientheaders, db):
    [user, client] = authuser_clientheaders
    endpoint = reverse('accounts_me')
    request = client.patch(endpoint, {'email': 'testmail@test.com'})
    assert request.status_code == 200

def test_invalid_email_update_not_accepted(authuser_clientheaders, db):
    [user, client] = authuser_clientheaders
    endpoint = reverse('accounts_me')
    request = client.patch(endpoint, {'email': 'i am invalid'})
    assert request.status_code == 400

def test_authenticated_updated_pwd(authuser_clientheaders, db):
    [user, client] = authuser_clientheaders
    endpoint = reverse('accounts_me')
    request = client.patch(endpoint, {'password': '123SafePwd!'})
    assert request.status_code == 200

def test_insecure_pwd_update_not_accepted(authuser_clientheaders, db):
    [user, client] = authuser_clientheaders
    endpoint = reverse('accounts_me')
    request = client.patch(endpoint, {'password': 'password'})
    assert request.status_code == 400
