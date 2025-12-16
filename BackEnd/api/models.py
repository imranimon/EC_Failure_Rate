from django.db import models

class ComponentCategory(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name_plural = "Component Categories"

    def __str__(self):
        return self.name


class ComponentType(models.Model):
    category = models.ForeignKey(ComponentCategory, on_delete=models.CASCADE, related_name='types')
    name = models.CharField(max_length=100)
    
    # 1. Base Failure Rate
    lambda_ref = models.FloatField(help_text="Base Failure Rate in FIT")
    
    # 2. Reference Conditions
    ref_temp = models.FloatField(default=40.0)
    ref_voltage_ratio = models.FloatField(default=1.0)

    # 3. Temperature Stress Constants
    activation_energy = models.FloatField(default=0.0, help_text="Activation Energy (Ea) in eV")
    
    # 4. Voltage Stress Constants
    c1_factor = models.FloatField(default=0.0)
    c2_factor = models.FloatField(default=0.0)
    c3_factor = models.FloatField(default=0.0, help_text="Current Constant C3 (for Pi_I)")
    c4_factor = models.FloatField(default=0.0, help_text="Current Constant C4 (for Pi_I)")

    # 5. Additional Parameters
    thermal_resistance = models.FloatField(default=0.0, help_text="R_th in K/W (Degrees rise per Watt)")
    rated_power = models.FloatField(default=0.0, help_text="Rated Power in Watts (P_rat)")

    def __str__(self):
        return f"{self.name} ({self.category.name})"


class Environment(models.Model):
    name = models.CharField(max_length=50)
    pi_e_factor = models.FloatField()

    def __str__(self):
        return f"{self.name} (x{self.pi_e_factor})"