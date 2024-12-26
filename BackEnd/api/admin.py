from django.contrib import admin

from .models import Component, ComponentType

my_models = [Component, ComponentType]
admin.site.register(my_models)
