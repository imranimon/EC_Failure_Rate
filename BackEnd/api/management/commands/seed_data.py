from django.core.management.base import BaseCommand
from api.models import ComponentCategory, ComponentType, Environment

class Command(BaseCommand):
    help = 'Populates the database with Categories, Environments, and Reference Components'

    def handle(self, *args, **kwargs):
        self.stdout.write("Seeding Data...")

        # --- 1. Categories ---
        categories_data = [
            {"name": "Capacitors", "desc": "Calculates Failure Rate based on Voltage Stress"},
            {"name": "Resistors", "desc": "Calculates Failure Rate based on Power Dissipation"},
            {"name": "Discrete Semiconductors", "desc": "Calculates based on Current & Voltage Stress"},
            {"name": "Integrated Circuits", "desc": "Digital/Analog Chips"},
            {"name": "Mechanical", "desc": "Relays, Switches (Base Failure Rate)"}
        ]

        # Dictionary to store category objects for linking later
        cat_map = {} 

        for cat in categories_data:
            obj, created = ComponentCategory.objects.get_or_create(name=cat["name"])
            if created:
                obj.description = cat["desc"]
                obj.save()
                self.stdout.write(self.style.SUCCESS(f"Created Category: {cat['name']}"))
            cat_map[cat["name"]] = obj

        # --- 2. Environments ---
        environments = [
            {"name": "Ground Benign (E1)", "factor": 1.0},
            {"name": "Ground Mobile (E2)", "factor": 2.0},
            {"name": "Naval Sheltered (E3)", "factor": 4.0},
            {"name": "Aircraft Inhabited (E4)", "factor": 5.0},
            {"name": "Space Flight (E5)", "factor": 0.5},
        ]

        for env in environments:
            obj, created = Environment.objects.get_or_create(
                name=env["name"], 
                defaults={'pi_e_factor': env["factor"]}
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created Environment: {env['name']}"))

        # --- 3. Component Types (Reference Data) ---
        # These constants (C1, C2, Ea) are typical generic values for testing
        components = [
            {
                "category": "Capacitors",
                "name": "Ceramic Capacitor",
                "lambda_ref": 1.0,
                "ref_temp": 40,
                "activation_energy": 0.3, # Typical for ceramic
                "thermal_resistance": 0,  # Negligible self-heating
                "ref_voltage_ratio": 0.5,
                "c1": 0.2, "c2": 0.8,     # Voltage Stress constants
                "c3": 0.0, "c4": 0.0      # No Current Stress
            },
            {
                "category": "Resistors",
                "name": "Metal Film Resistor 0.25W",
                "lambda_ref": 0.5,
                "ref_temp": 40,
                "activation_energy": 0.1, # Low sensitivity to ambient temp
                "thermal_resistance": 120, # High self-heating (small package)
                "ref_voltage_ratio": 0.0, # Resistors usually stress by Power, not Voltage
                "c1": 0.0, "c2": 0.0,
                "c3": 0.0, "c4": 0.0
            },
            {
                "category": "Discrete Semiconductors",
                "name": "Bipolar Transistor (NPN)",
                "lambda_ref": 5.0,
                "ref_temp": 40,
                "activation_energy": 0.7, # Silicon standard
                "thermal_resistance": 80, # TO-92 Package
                "ref_voltage_ratio": 0.5,
                "c1": 0.1, "c2": 0.9,     # Voltage factors
                "c3": 1.5, "c4": 1.0      # Current factors (Critical for Transistors)
            }
        ]

        for comp in components:
            category_obj = cat_map.get(comp["category"])
            if category_obj:
                obj, created = ComponentType.objects.get_or_create(
                    name=comp["name"],
                    category=category_obj,
                    defaults={
                        'lambda_ref': comp["lambda_ref"],
                        'ref_temp': comp["ref_temp"],
                        'activation_energy': comp["activation_energy"],
                        'thermal_resistance': comp["thermal_resistance"],
                        'ref_voltage_ratio': comp["ref_voltage_ratio"],
                        'c1_factor': comp["c1"],
                        'c2_factor': comp["c2"],
                        'c3_factor': comp["c3"],
                        'c4_factor': comp["c4"],
                    }
                )
                if created:
                    self.stdout.write(self.style.SUCCESS(f"Created Type: {comp['name']}"))
                else:
                    self.stdout.write(f"Skipped {comp['name']} (Already exists)")

        self.stdout.write(self.style.SUCCESS("Data Seeding Complete!"))