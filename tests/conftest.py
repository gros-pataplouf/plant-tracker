import pytest
from django.db import connection


@pytest.fixture(scope='session')
def django_db_setup(django_db_blocker):
    with django_db_blocker.unblock():
        with connection.cursor() as c:
            c.execute('''
                        DELETE FROM api_plant;
                        INSERT INTO api_plant (scientific_name, family, common_name_de, common_name_fr, common_name_en, description_de, description_fr, description_en)
                        VALUES('Solidago canadensis', 'Asteraceae',	'Goldrute',	'Verge dor du Canada',	'Goldenrod', 'testtesttesttesttest', 'testtesttesttesttest', 'testtesttesttest')
            ''')
            