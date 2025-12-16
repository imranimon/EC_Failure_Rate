from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ComponentCategoryViewSet, 
    ComponentTypeViewSet, 
    EnvironmentViewSet, 
    CalculateFailureRateView,
    welcome_view
)

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'categories', ComponentCategoryViewSet)
router.register(r'component-types', ComponentTypeViewSet)
router.register(r'environments', EnvironmentViewSet)

urlpatterns = [
    # The router URLs (CRUD endpoints)
    path('', include(router.urls)),
    
    # Custom Calculation Endpoint
    path('calculate/', CalculateFailureRateView.as_view(), name='calculate_failure_rate'),
    
    # Welcome Page
    path('welcome/', welcome_view, name='welcome'),
]