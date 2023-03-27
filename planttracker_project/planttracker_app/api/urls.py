from django.urls import path, include, re_path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions
from django.urls import path
from .views import PlantDetail, PlantList, LocationDetail, LocationList, UserDetail

schema_view = get_schema_view(
   openapi.Info(
      title="Planttracker API",
      default_version='v1',
   ),
   public=True,
   permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    path('plants/', PlantList.as_view(), name="api_plant_list"),
    path('plants/<int:pk>', PlantDetail.as_view(), name="api_plant_detail"),
    path("users/<str:username>/", UserDetail.as_view(), name="api_user_detail"),
    path('locations/', LocationList.as_view(), name="api_location_list"),
    path('locations/<int:pk>', LocationDetail.as_view(), name="api_location_detail"),
   ]

urlpatterns += [
   path("auth/", include("rest_framework.urls")),
   ]

urlpatterns += [
   re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
   re_path(r'^swagger/$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
   re_path(r'^redoc/$', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
   ]