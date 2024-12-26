from django.contrib import admin
from django.urls import path, include

from api.views import welcome_view

urlpatterns = [
    path('', welcome_view),
    path('admin/', admin.site.urls),
    path('api/', include('api.urls'))
]
