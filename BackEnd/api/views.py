from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import render
from rest_framework.decorators import api_view

# All Models
from .models import Component, ComponentType

# All Serializers
from .serializer import ComponentSerializer, ComponentTypeSerializer

def welcome_view(request):
    return render(request, 'welcome.html')
@api_view(['GET'])
def api_status_check(request):
    return Response({'message': 'API is working'}, status=status.HTTP_200_OK)

class ComponentView(APIView):
    def get(self, request):
        components = Component.objects.all()
        components_serializer = ComponentSerializer(components, many=True)
        return Response(components_serializer.data, status=status.HTTP_200_OK)

class ComponentTypeView(APIView):
    def get(self, request):
        com_id = request.query_params.get('com_id', None)
        if not com_id:
            return Response({'message': 'You must provide a valid com_id'}, status=status.HTTP_400_BAD_REQUEST)
        component_types = ComponentType.objects.filter(component_id=com_id)
        component_types_serializers=ComponentTypeSerializer(component_types, many=True)
        return Response(component_types_serializers.data, status=status.HTTP_200_OK)