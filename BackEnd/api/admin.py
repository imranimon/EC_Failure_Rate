from django.contrib import admin
from .models import ComponentCategory, ComponentType, Environment

admin.site.register(ComponentCategory)
admin.site.register(ComponentType)
admin.site.register(Environment)