export interface CompCategory {
  id: number;
  name: string;
}

export interface CompType {
  id: number;
  category: number;
  name: string;

  // Physics Parameters
  lambda_ref: number;
  ref_temp: number;
  thermal_resistance: number;
  activation_energy: number;
  ref_voltage_ratio: number;
  
  // Constants
  c1_factor: number;
  c2_factor: number;
  c3_factor: number;
  c4_factor: number;
}

export interface Environment {
  id: number;
  name: string;
  pi_e_factor: number;
}

export interface CalculatorRequest {
  component_type_id: number;
  environment_id: number;
  temperature: number;
  operating_voltage: number;
  rated_voltage: number;
  operating_power: number;
  operating_current: number; 
  rated_current: number;
  quality_factor: number;
}

export interface CalculatorResponse {
  component: string;
  lambda_final_fit: number;
  mtbf_hours: number;
  stress_details: {
    temp_ambient: number;
    temp_rise: number;
    temp_hotspot: number;
  };
  pi_factors: {
    pi_t: number;
    pi_u: number;
    pi_i: number;
    pi_e: number;
    pi_q: number;
  };
}