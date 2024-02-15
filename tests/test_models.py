def test_dummy_user(dummy_user):
    print(dummy_user)    
    assert dummy_user.is_staff is False


def test_admin_user(admin_user):
    print(admin_user)    
    assert admin_user.is_staff

def test_plant_list(plant_list):
    assert len(plant_list) == 4
    assert len(list(filter(lambda x: x.scientific_name == 'Reynoutria japonica', plant_list))) > 0
