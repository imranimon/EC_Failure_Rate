from django.urls import path
from . import views

urlpatterns = [
    path('', views.api_status_check, name='status_check'),
    path('components/', views.ComponentView.as_view(), name='components-list'),
    path('component-types/', views.ComponentTypeView.as_view(), name='component-types-list'),
]
