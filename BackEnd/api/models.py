from django.db import models

class Component(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class ComponentType(models.Model):
    id = models.AutoField(primary_key=True) 
    name = models.CharField(max_length=100) 
    component = models.ForeignKey(Component, on_delete=models.CASCADE)  # Foreign key to Component

    def __str__(self):
        return self.name
