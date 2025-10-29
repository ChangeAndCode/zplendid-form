/**
 * Calculadora de IMC (Índice de Masa Corporal)
 */

export interface BMICalculation {
  bmi: number;
  category: string;
  description: string;
}

/**
 * Calcula el IMC usando el sistema estándar (pies, pulgadas y libras)
 */
export function calculateBMIStandard(feet: number, inches: number, pounds: number): BMICalculation {
  const totalInches = (feet * 12) + inches;
  const bmi = (pounds / (totalInches * totalInches)) * 703;
  
  return {
    bmi: Math.round(bmi * 10) / 10, // Redondear a 1 decimal
    ...getBMICategory(bmi)
  };
}

/**
 * Calcula el IMC usando el sistema métrico (centímetros y kilogramos)
 */
export function calculateBMIMetric(centimeters: number, kilograms: number): BMICalculation {
  const meters = centimeters / 100;
  const bmi = kilograms / (meters * meters);
  
  return {
    bmi: Math.round(bmi * 10) / 10, // Redondear a 1 decimal
    ...getBMICategory(bmi)
  };
}

/**
 * Convierte de sistema estándar a métrico
 */
export function convertStandardToMetric(feet: number, inches: number, pounds: number): {
  centimeters: number;
  kilograms: number;
} {
  const totalInches = (feet * 12) + inches;
  const centimeters = Math.round(totalInches * 2.54);
  const kilograms = Math.round(pounds * 0.453592 * 10) / 10;
  
  return { centimeters, kilograms };
}

/**
 * Convierte de sistema métrico a estándar
 */
export function convertMetricToStandard(centimeters: number, kilograms: number): {
  feet: number;
  inches: number;
  pounds: number;
} {
  const totalInches = Math.round(centimeters / 2.54);
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches % 12;
  const pounds = Math.round(kilograms / 0.453592 * 10) / 10;
  
  return { feet, inches, pounds };
}

/**
 * Obtiene la categoría del IMC según los estándares de la OMS
 */
function getBMICategory(bmi: number): { category: string; description: string } {
  if (bmi < 18.5) {
    return {
      category: 'Bajo peso',
      description: 'Tu peso está por debajo del rango normal'
    };
  } else if (bmi >= 18.5 && bmi < 25) {
    return {
      category: 'Peso normal',
      description: 'Tu peso está en el rango normal'
    };
  } else if (bmi >= 25 && bmi < 30) {
    return {
      category: 'Sobrepeso',
      description: 'Tu peso está por encima del rango normal'
    };
  } else if (bmi >= 30 && bmi < 35) {
    return {
      category: 'Obesidad Clase I',
      description: 'Tienes obesidad de grado I'
    };
  } else if (bmi >= 35 && bmi < 40) {
    return {
      category: 'Obesidad Clase II',
      description: 'Tienes obesidad de grado II'
    };
  } else {
    return {
      category: 'Obesidad Clase III',
      description: 'Tienes obesidad de grado III'
    };
  }
}

/**
 * Valida los valores de entrada para el cálculo del IMC
 */
export function validateBMIInputs(
  feet?: number, 
  inches?: number, 
  pounds?: number,
  centimeters?: number, 
  kilograms?: number
): { isValid: boolean; error?: string } {
  // Validar sistema estándar
  if (feet !== undefined && inches !== undefined && pounds !== undefined) {
    if (feet < 3 || feet > 8) {
      return { isValid: false, error: 'La altura en pies debe estar entre 3 y 8' };
    }
    if (inches < 0 || inches > 11) {
      return { isValid: false, error: 'Las pulgadas deben estar entre 0 y 11' };
    }
    if (pounds < 50 || pounds > 1000) {
      return { isValid: false, error: 'El peso en libras debe estar entre 50 y 1000' };
    }
  }
  
  // Validar sistema métrico
  if (centimeters !== undefined && kilograms !== undefined) {
    if (centimeters < 100 || centimeters > 250) {
      return { isValid: false, error: 'La altura en centímetros debe estar entre 100 y 250' };
    }
    if (kilograms < 20 || kilograms > 500) {
      return { isValid: false, error: 'El peso en kilogramos debe estar entre 20 y 500' };
    }
  }
  
  return { isValid: true };
}
