import factory
from faker import Faker
from accounts.models import User
from django.contrib.auth.hashers import make_password

fake = Faker()

fake_password = '1234Test!'

class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User
    username = fake.name().replace(" ", "")
    email = f"{username}@test.com"
    password = factory.PostGenerationMethodCall('set_password', fake_password)
    is_staff = False
    is_active = True
