import { CalculationInputs, CalculationResults, AIRecommendationResult } from './types';

export function exportToCSV(inputs: CalculationInputs, results: CalculationResults): void {
  const rows: string[][] = [
    ['--- RAINWATER HARVESTING CALCULATOR REPORT ---'],
    ['Generated On', new Date().toLocaleString()],
    ['Project Name', inputs.projectName],
    ['Location', inputs.locationName],
    ['Property Type', inputs.propertyType],
    ['Catchment Area (sq.m)', inputs.catchmentAreaSqM.toString()],
    ['Roof Material', inputs.roofMaterial],
    ['Annual Rainfall (mm)', inputs.annualRainfallMm.toString()],
    ['Number of Occupants', inputs.numberOfOccupants.toString()],
    ['Daily Demand LPCD', inputs.lpcd.toString()],
    [],
    ['--- HYDROLOGICAL & STORAGE RESULTS ---'],
    ['Annual Harvest Potential (Litres)', results.annualHarvestPotentialLitres.toString()],
    ['Annual Harvest Potential (kL / m3)', results.annualHarvestPotentialKL.toString()],
    ['Daily Demand (Litres/day)', results.dailyDemandLitres.toString()],
    ['Annual Demand (Litres/year)', results.annualDemandLitres.toString()],
    ['Self-Sufficiency Coverage (%)', `${results.selfSufficiencyRatio}%`],
    ['Recommended Storage Tank Size (Litres)', results.recommendedTankSizeLitres.toString()],
    ['Days of Autonomy (Dry Period)', results.autonomyDaysWithRecommendedTank.toString()],
    ['Estimated Capital Cost ($)', results.estimatedCapitalCost.toString()],
    ['Annual Utility Water Bill Savings ($)', results.annualUtilitySavings.toString()],
    ['Payback Period (Years)', results.paybackPeriodYears.toString()],
    ['Annual CO2 Saved (kg)', results.co2OffsetKgPerYear.toString()],
    [],
    ['--- MONTHLY WATER BALANCE BREAKDOWN ---'],
    ['Month', 'Rainfall (mm)', 'Harvested (L)', 'Demand (L)', 'Stored (L)', 'Overflow (L)', 'Deficit (L)'],
  ];

  results.monthlyBreakdown.forEach((m) => {
    rows.push([
      m.month,
      m.rainfallMm.toString(),
      m.harvestedLitres.toString(),
      m.demandLitres.toString(),
      m.storedLitres.toString(),
      m.overflowLitres.toString(),
      m.deficitLitres.toString(),
    ]);
  });

  const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.map(val => `"${val.replace(/"/g, '""')}"`).join(',')).join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `${inputs.projectName.replace(/\s+/g, '_')}_RWH_Report.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function printProjectReport(): void {
  if (typeof window !== 'undefined') {
    window.print();
  }
}
