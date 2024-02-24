import factory
from faker import Faker
from accounts.models import User
from api.models import Plant

fake = Faker()

fake_password = '1234Test!'

class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User
    username = fake.unique.name().replace(" ", "")
    email = f"{username}@test.com"
    password = factory.PostGenerationMethodCall('set_password', fake_password)
    is_staff = False
    is_active = True

class UserFactory2(factory.django.DjangoModelFactory):
    class Meta:
        model = User
    username = fake.unique.name().replace(" ", "")
    email = f"{username}@test.com"
    password = factory.PostGenerationMethodCall('set_password', fake_password)
    is_staff = False
    is_active = True

class PlantFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Plant
    description_en = fake.paragraph(nb_sentences=5, variable_nb_sentences=False)

