from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from django.shortcuts import render

# Models & Serializers
from .models import ComponentCategory, ComponentType, Environment
from .serializer import ComponentCategorySerializer, ComponentTypeSerializer, EnvironmentSerializer
from .calculations import calculate_pi_t, calculate_pi_u, calculate_pi_i

def welcome_view(request):
    return render(request, 'welcome.html')

@api_view(['GET'])
def api_status_check(request):
    return Response({'message': 'API is working'}, status=status.HTTP_200_OK)

class ComponentCategoryViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Categories to be viewed or edited.
    """
    queryset = ComponentCategory.objects.all()
    serializer_class = ComponentCategorySerializer

class EnvironmentViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Environments to be viewed or edited.
    """
    queryset = Environment.objects.all()
    serializer_class = EnvironmentSerializer

class ComponentTypeViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Component Types to be viewed or edited.
    Supports filtering by category: /api/component-types/?category_id=1
    """
    queryset = ComponentType.objects.all()
    serializer_class = ComponentTypeSerializer

    def get_queryset(self):
        """
        Optionally restricts the returned types to a given category,
        by filtering against a `category_id` query parameter in the URL.
        """
        queryset = ComponentType.objects.all()
        category_id = self.request.query_params.get('categoryId')
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        return queryset

class CalculateFailureRateView(APIView):
    def post(self, request):
        try:
            data = request.data
            
            # 1. Extract Inputs
            comp_type_id = data.get('component_type_id')
            temp_amb = float(data.get('temperature', 40))
            voltage_op = float(data.get('operating_voltage', 0))
            voltage_rated = float(data.get('rated_voltage', 0))
            current_op = float(data.get('operating_current', 0))
            current_rated = float(data.get('rated_current', 0))
            power_op = float(data.get('operating_power', 0))
            env_id = data.get('environment_id')
            
            # NEW: Quality Factor (Default to 1.0 if not provided)
            pi_q = float(data.get('quality_factor', 1.0))

            # 2. Get Database Objects
            comp_type = ComponentType.objects.get(id=comp_type_id)
            
            pi_e = 1.0
            if env_id:
                env = Environment.objects.get(id=env_id)
                pi_e = env.pi_e_factor

            # 3. Calculate Self-Heating
            self_heating_rise = power_op * comp_type.thermal_resistance
            temp_hotspot = temp_amb + self_heating_rise

            # 4. Calculate Factors
            # A. Temperature (Pi_T)
            pi_t = calculate_pi_t(
                temp_op_c=temp_hotspot, 
                temp_ref_c=comp_type.ref_temp, 
                activation_energy=comp_type.activation_energy
            )

            # B. Voltage (Pi_U)
            pi_u = 1.0
            if voltage_rated > 0 and comp_type.c1_factor > 0:
                pi_u = calculate_pi_u(
                    voltage_op=voltage_op,
                    voltage_rated=voltage_rated,
                    voltage_ref_ratio=comp_type.ref_voltage_ratio,
                    c1=comp_type.c1_factor,
                    c2=comp_type.c2_factor
                )

            # C. Current (Pi_I)
            pi_i = 1.0
            if current_rated > 0 and comp_type.c3_factor > 0:
                pi_i = calculate_pi_i(
                    current_op=current_op,
                    current_rated=current_rated,
                    current_ref_ratio=comp_type.ref_voltage_ratio, 
                    c3=comp_type.c3_factor,
                    c4=comp_type.c4_factor
                )

            # 5. Final Calculation
            # Formula: λ = λ_ref * π_T * π_U * π_I * π_E * π_Q
            lambda_final = comp_type.lambda_ref * pi_t * pi_u * pi_i * pi_e * pi_q
            
            mtbf = 1_000_000_000 / lambda_final if lambda_final > 0 else 0

            return Response({
                "component": comp_type.name,
                "lambda_final_fit": round(lambda_final, 4),
                "mtbf_hours": round(mtbf, 2),
                "stress_details": {
                    "temp_ambient": temp_amb,
                    "temp_rise": round(self_heating_rise, 2),
                    "temp_hotspot": round(temp_hotspot, 2)
                },
                "pi_factors": {
                    "pi_t": round(pi_t, 4),
                    "pi_u": round(pi_u, 4),
                    "pi_i": round(pi_i, 4),
                    "pi_e": round(pi_e, 2),
                    "pi_q": round(pi_q, 2) 
                }
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)