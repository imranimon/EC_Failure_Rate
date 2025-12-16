import math

# Boltzmann Constant (eV/K)
K_BOLTZMANN = 8.617e-5

def calculate_pi_t(temp_op_c, temp_ref_c, activation_energy):
    """
    Calculates Temperature Factor (Pi_T) using the Arrhenius Equation (Eq. 5 in IEC 61709).
    
    :param temp_op_c: Operating Temperature (Celsius)
    :param temp_ref_c: Reference Temperature (Celsius)
    :param activation_energy: Ea in eV
    :return: Pi_T factor
    """
    if activation_energy == 0:
        return 1.0

    # Convert Celsius to Kelvin
    temp_op_k = temp_op_c + 273.15
    temp_ref_k = temp_ref_c + 273.15

    # Arrhenius Formula: exp( (Ea/k) * (1/T_ref - 1/T_op) )
    exponent = (activation_energy / K_BOLTZMANN) * ((1 / temp_ref_k) - (1 / temp_op_k))
    return math.exp(exponent)


def calculate_pi_u(voltage_op, voltage_rated, voltage_ref_ratio, c1, c2):
    """
    Calculates Voltage Factor (Pi_U) using Equation (3) in IEC 61709.
    
    :param voltage_op: Operating Voltage
    :param voltage_rated: Rated Voltage
    :param voltage_ref_ratio: Ratio of U_ref/U_rated (e.g., 0.5)
    :param c1: Constant C3 from Table 37
    :param c2: Constant C2 from Table 37
    :return: Pi_U factor
    """
    if voltage_rated == 0 or c1 == 0:
        return 1.0

    # Ratio calculations
    s_op = voltage_op / voltage_rated       # Stress Operating
    s_ref = voltage_ref_ratio               # Stress Reference (e.g., 0.5)

    # Formula: exp( C1 * ( (U_op/U_rat)^C2 - (U_ref/U_rat)^C2 ) )
    # Note: We use c1 to represent C3 from the standard tables based on your model design
    exponent = c1 * (pow(s_op, c2) - pow(s_ref, c2))
    return math.exp(exponent)

def calculate_pi_i(current_op, current_rated, current_ref_ratio, c3, c4):
    """
    Calculates Current Factor (Pi_I) using IEC 61709 Equation (4/5).
    Used primarily for Transistors and Diodes.
    """
    if current_rated == 0 or c3 == 0:
        return 1.0

    # Ratio calculations
    s_op = current_op / current_rated       # Stress Operating
    s_ref = current_ref_ratio               # Stress Reference (e.g., 0.5)

    # Formula: exp( C3 * ( (I_op/I_rat)^C4 - (I_ref/I_rat)^C4 ) )
    exponent = c3 * (pow(s_op, c4) - pow(s_ref, c4))
    return math.exp(exponent)    