import pytest, json
from accounts.models import User
from api.models import Plant

@pytest.fixture
def user_factory(db): #get db access
    def create_user(
            username: str,
            password: str = None, 
            first_name: str = "firstname",
            last_name: str = "lastname",
            email: str = "test@test.com", 
            is_staff: bool = False, 
            is_superuser: bool = False,
            is_active: bool = True

    ):
        user = User.objects.create_user(
            username=username, 
            password=password, 
            first_name=first_name, 
            last_name=last_name, 
            email=email, 
            is_staff=is_staff,
            is_superuser=is_superuser,
            is_active=is_active,
        )
        return user

    return create_user


@pytest.fixture
def dummy_user(db, user_factory):
    return user_factory("testdummy", "dummypwd", "dummy")

@pytest.fixture
def admin_user(db, user_factory):
    return user_factory("testadmin", "adminpwd", "admin", is_staff=True, is_superuser=True)


@pytest.fixture
def plant_list(db, plant_list=None):
    if plant_list is None:
        plant_list = []
    with open('tests/fixtures/plants.json') as infile:
        plants = json.loads(infile.read())
    for plant in plants:
        new_plant = Plant.objects.create(
            scientific_name = plant["scientific_name"],
            family = plant["family"],
            common_name_de = plant["common_name_de"],
            common_name_fr = plant["common_name_fr"],
            common_name_en = plant["common_name_en"],
            description_de = plant["description_de"],
            description_fr = plant["description_fr"],
            description_en = plant["description_en"],
            identification_de = plant["identification_de"],
            identification_fr = plant["identification_fr"],
            identification_en = plant["identification_en"],
            ecology_de = plant["ecology_de"],
            ecology_fr = plant["ecology_fr"],
            ecology_en = plant["ecology_en"]
        )
        plant_list.append(new_plant)

    return plant_list