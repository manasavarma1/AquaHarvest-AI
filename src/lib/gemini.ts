import { GoogleGenerativeAI } from '@google/generative-ai';
import { CalculationInputs, CalculationResults, AIRecommendationResult } from './types';

export function generateFallbackAIReport(
  inputs: CalculationInputs,
  results: CalculationResults,
  customQuestion?: string
): AIRecommendationResult {
  const isHighSufficiency = results.selfSufficiencyRatio >= 60;
  const area = inputs.catchmentAreaSqM;
  const isLargeCatchment = area > 200;

  let customAnswer: string | undefined = undefined;
  if (customQuestion) {
    customAnswer = `Based on your ${area} m² ${inputs.roofMaterial.replace('_', ' ')} roof and ${results.annualHarvestPotentialKL} kL annual yield: ${
      customQuestion.toLowerCase().includes('gutter')
        ? 'For a catchment of ' + area + ' m², recommended semicircular PVC/GI gutters are 140mm-160mm diameter with 100mm diameter downspout drop pipes spaced every 10-12 meters.'
        : customQuestion.toLowerCase().includes('filter')
        ? 'A dual-stage system with a mechanical first-flush diverter (diverting the first 1.5mm of rain) followed by a slow-sand or dual-mesh 100-micron stainless steel filter will deliver optimal clarity.'
        : 'Your rainwater catchment profile shows strong hydraulic performance. Ensure regular pre-monsoon gutter desilting and inspect tank ventilation screens.'
    }`;
  }

  return {
    summary: `The site presents a ${isHighSufficiency ? 'highly promising' : 'moderate'} rainwater harvesting feasibility with a self-sufficiency potential of ${results.selfSufficiencyRatio}%. With an annual harvestable yield of ${results.annualHarvestPotentialKL} kL (${results.annualHarvestPotentialLitres.toLocaleString()} Litres), the property can reliably satisfy critical non-potable demands for ${results.autonomyDaysWithRecommendedTank} consecutive days during dry spells.`,
    feasibilityScore: Math.min(95, Math.max(65, Math.round(55 + (results.selfSufficiencyRatio * 0.4)))),
    keyInsights: [
      `Roof Runoff Potential: ${results.annualHarvestPotentialKL} kL/year exceeds baseline requirements for ${inputs.numberOfOccupants} occupants by ${results.selfSufficiencyRatio > 100 ? 'a surplus factor' : 'satisfying ' + results.selfSufficiencyRatio + '% of total demand'}.`,
      `Optimal Storage Equilibrium: The recommended ${results.recommendedTankSizeLitres.toLocaleString()}L capacity balances capital expenditure against dry-period autonomy (${results.autonomyDaysWithRecommendedTank} days).`,
      `Ecological Dividend: Avoids ${results.co2OffsetKgPerYear} kg CO₂ emissions annually from municipal pumping grid energy.`,
      `Financial Amortization: Projected payback of approximately ${results.paybackPeriodYears} years with an annual utility savings of $${results.annualUtilitySavings.toFixed(2)}.`,
    ],
    tankOptimizationNote: isLargeCatchment
      ? `For a ${area} m² catchment, an underground RCC sump or modular dual-tank arrangement (e.g. 2 x ${Math.round(results.recommendedTankSizeLitres / 2000) * 1000}L) is recommended to simplify maintenance and avoid excessive structural loading.`
      : `An above-ground UV-stabilized food-grade HDPE tank of ${results.recommendedTankSizeLitres.toLocaleString()}L on a compacted reinforced masonry plinth offers the fastest ROI and lowest installation footprint.`,
    recommendedFilters: [
      {
        name: 'First Flush Diverter (1.5mm - 2mm rainfall diversion)',
        description: 'Crucial for washing off atmospheric dust, bird droppings, and loose leaf debris before water enters storage.',
        priority: 'Essential',
      },
      {
        name: 'Dual Stage Sand-Gravel & Mesh Filter (100 micron)',
        description: 'Physical sediment separation filter featuring graded gravel, coarse sand, and a stainless steel screen.',
        priority: 'Essential',
      },
      {
        name: 'Activated Carbon Block + Post UV Sterilizer',
        description: 'Required only if harvested water is redirected for drinking, culinary, or high-purity hygiene applications.',
        priority: inputs.demandUses.drinkingCooking ? 'Essential' : 'Optional',
      },
    ],
    maintenanceChecklist: [
      {
        frequency: 'Pre-Monsoon',
        tasks: [
          'Thoroughly sweep roof terrace and clear gutter leaves and debris.',
          'Dismantle and wash first-flush diverter chamber and float ball.',
          'Inspect downspout joints and gutter slopes (minimum 1:100 fall).',
        ],
      },
      {
        frequency: 'Monthly',
        tasks: [
          'Check stainless steel filter mesh for organic sediment accumulation.',
          'Inspect tank inspection cover seal and overflow mosquito mesh screen.',
          'Verify pump dry-run protection and water level sensors.',
        ],
      },
      {
        frequency: 'Post-Monsoon',
        tasks: [
          'Drain remaining sedimentation sump if bottom silt depth exceeds 2cm.',
          'Flush filtration media (backwash sand filter or rinse cartridge).',
        ],
      },
      {
        frequency: 'Annually',
        tasks: [
          'Test stored water for pH, turbidity, and total dissolved solids (TDS).',
          'Inspect tank internal walls for biological biofilm and pressure wash if necessary.',
        ],
      },
    ],
    groundwaterRechargeAdvice: `Excess overflow volume during peak rainfall months (totaling approximately ${Math.round(results.annualHarvestPotentialLitres * 0.25).toLocaleString()} Litres) is ideal for shallow aquifer recharge. Sizing: 1.5m diameter x ${results.rechargeWellRecommendation.depthMeters}m depth recharge pit with inverted filter layers (pebbles, gravel, and sand).`,
    regulatoryComplianceTips: [
      'Ensure tank overflow pipe has a non-return flap gate and fine brass mesh (mesh size < 1mm) to prevent mosquito vectors and pest intrusion.',
      'Maintain minimum 3-meter separation distance between any underground recharge pit and building foundations or septic soakaways.',
      'Display clear signage: "Rainwater Harvesting Non-Potable Supply" on dedicated distribution valves.',
    ],
    customAnswer,
  };
}

export async function analyzeWithGemini(
  inputs: CalculationInputs,
  results: CalculationResults,
  apiKey?: string,
  customQuestion?: string
): Promise<AIRecommendationResult> {
  const key = apiKey || process.env.GEMINI_API_KEY;
  if (!key) {
    return generateFallbackAIReport(inputs, results, customQuestion);
  }

  try {
    const genAI = new GoogleGenerativeAI(key);
    // Use gemini-1.5-flash or gemini-2.0-flash for high-speed, high-accuracy civil engineering reasoning
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });

    const prompt = `
You are an expert hydrological engineer and civil stormwater management consultant.
Analyze this Rainwater Harvesting (RWH) project data and provide actionable, site-specific engineering insights and recommendations.

Input Parameters:
- Project Name: ${inputs.projectName}
- Location: ${inputs.locationName}
- Property Type: ${inputs.propertyType}
- Catchment Area: ${inputs.catchmentAreaSqM} m² (Dimensions: ${inputs.roofLengthM || 'N/A'}m x ${inputs.roofWidthM || 'N/A'}m)
- Roof Material: ${inputs.roofMaterial}
- Filter Efficiency: ${(inputs.filterEfficiency * 100).toFixed(0)}%
- Annual Rainfall: ${inputs.annualRainfallMm} mm
- Occupants: ${inputs.numberOfOccupants}
- Per Capita Daily Demand: ${inputs.lpcd} LPCD
- Consecutive Dry Period: ${inputs.dryPeriodDays} days
- Targeted Uses: Toilet Flushing=${inputs.demandUses.toiletFlushing}, Gardening=${inputs.demandUses.gardening}, Laundry=${inputs.demandUses.laundryWashing}, Drinking=${inputs.demandUses.drinkingCooking}
- Tank Material: ${inputs.tankMaterial}
- Water Tariff: $${inputs.waterTariffPerKL}/kL

Calculated Hydrological Results:
- Annual Harvest Potential: ${results.annualHarvestPotentialLitres} Litres (${results.annualHarvestPotentialKL} kL)
- Daily Demand: ${results.dailyDemandLitres} L/day (Annual: ${results.annualDemandKL} kL)
- Self-Sufficiency Index: ${results.selfSufficiencyRatio}%
- Recommended Storage Tank Capacity: ${results.recommendedTankSizeLitres} Litres (${results.recommendedTankSizeKL} kL)
- Days of Autonomy: ${results.autonomyDaysWithRecommendedTank} days
- Annual Utility Savings: $${results.annualUtilitySavings}
- Simple Payback Period: ${results.paybackPeriodYears} years
- CO2 Emissions Saved: ${results.co2OffsetKgPerYear} kg/year

${customQuestion ? `User Specific Question to Answer: "${customQuestion}"` : ''}

Respond with a strictly formatted JSON object matching this schema:
{
  "summary": "2-3 sentences concise civil engineering executive summary",
  "feasibilityScore": number between 1 and 100,
  "keyInsights": ["string", "string", "string", "string"],
  "tankOptimizationNote": "Specific advice on sizing, placement, or structural recommendations",
  "recommendedFilters": [
    { "name": "string", "description": "string", "priority": "Essential" | "Recommended" | "Optional" }
  ],
  "maintenanceChecklist": [
    {
      "frequency": "Pre-Monsoon" | "Monthly" | "Post-Monsoon" | "Annually",
      "tasks": ["string", "string"]
    }
  ],
  "groundwaterRechargeAdvice": "string explaining how to recharge overflow",
  "regulatoryComplianceTips": ["string", "string"],
  ${customQuestion ? '"customAnswer": "detailed direct response to user question"' : ''}
}
`;

    const response = await model.generateContent(prompt);
    const text = response.response.text();
    const parsed = JSON.parse(text) as AIRecommendationResult;
    return parsed;
  } catch (err) {
    console.warn('Gemini API call failed or encountered error, using fallback engineering engine:', err);
    return generateFallbackAIReport(inputs, results, customQuestion);
  }
}
