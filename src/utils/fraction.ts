/**
 * Formats a decimal quantity to human culinary fraction notation
 */
export function formatFraction(amount: number): string {
  if (!amount || isNaN(amount)) return '';
  
  // Round to nearest 2 decimal places first
  const rounded = Math.round(amount * 100) / 100;
  
  const whole = Math.floor(rounded);
  const remainder = rounded - whole;

  if (remainder < 0.05) {
    return whole.toString();
  }

  let fraction = '';
  if (Math.abs(remainder - 0.25) < 0.08) fraction = '¼';
  else if (Math.abs(remainder - 0.33) < 0.08) fraction = '⅓';
  else if (Math.abs(remainder - 0.5) < 0.08) fraction = '½';
  else if (Math.abs(remainder - 0.66) < 0.08) fraction = '⅔';
  else if (Math.abs(remainder - 0.75) < 0.08) fraction = '¾';
  else if (Math.abs(remainder - 0.125) < 0.05) fraction = '⅛';
  else fraction = remainder.toFixed(1).replace(/^0/, '');

  if (whole === 0) return fraction;
  return `${whole} ${fraction}`;
}

/**
 * Convert metric/imperial units if toggled
 */
export function convertUnit(
  amount: number,
  unit: string,
  isMetric: boolean
): { amount: number; unit: string } {
  if (isMetric) {
    return { amount, unit };
  }

  // Convert grams to ounces
  if (unit.toLowerCase() === 'g') {
    const oz = amount * 0.035274;
    return { amount: Math.round(oz * 10) / 10, unit: 'oz' };
  }

  // Convert ml to fluid ounces
  if (unit.toLowerCase() === 'ml') {
    const flOz = amount * 0.033814;
    return { amount: Math.round(flOz * 10) / 10, unit: 'fl oz' };
  }

  return { amount, unit };
}
