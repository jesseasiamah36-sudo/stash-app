import { USER_DATA } from './data';

export function calculateSafeToSpend() {
  const { totalBalance, monthlyFixedCosts, savingsTarget, daysLeftInMonth } = USER_DATA;
  const disposableIncome = totalBalance - monthlyFixedCosts - savingsTarget;
  const dailySafeLimit = disposableIncome / daysLeftInMonth;
  
  let status: 'healthy' | 'caution' | 'danger' = 'healthy';
  if (dailySafeLimit < 10) status = 'danger';
  else if (dailySafeLimit < 25) status = 'caution';

  return { dailySafeLimit: dailySafeLimit.toFixed(2), status };
}