import {
  RoofMaterialInfo,
  RoofMaterialType,
  CalculationInputs,
  CalculationResults,
  MonthlyData,
  TankMaterialOption,
} from './types';

export const ROOF_MATERIALS: Record<RoofMaterialType, RoofMaterialInfo> = {
  metal_gi: {
    id: 'metal_gi',
    name: 'Corrugated Metal / GI Sheet',
    runoffCoefficient: 0.90,
    typicalEfficiency: 0.90,
    description: 'High runoff efficiency, smooth impermeable surface. Best for drinking water when non-toxic coated.',
    maintenanceNeeds: 'Inspect fasteners, clean debris before rainy season.',
  },
  concrete_rcc: {
    id: 'concrete_rcc',
    name: 'Reinforced Concrete (RCC Flat Roof)',
    runoffCoefficient: 0.82,
    typicalEfficiency: 0.85,
    description: 'Standard flat urban terrace. Slight absorption and dust retention in microscopic pores.',
    maintenanceNeeds: 'Sweep regularly, seal hair cracks, keep drain sumps clear.',
  },
  clay_tiles: {
    id: 'clay_tiles',
    name: 'Terracotta / Glazed Clay Tiles',
    runoffCoefficient: 0.78,
    typicalEfficiency: 0.82,
    description: 'Traditional pitched roof. Excellent aesthetic, moderate porosity in unglazed clay.',
    maintenanceNeeds: 'Check broken tiles, clear moss growth in joints.',
  },
  slate: {
    id: 'slate',
    name: 'Natural Slate / Stone Shingle',
    runoffCoefficient: 0.80,
    typicalEfficiency: 0.85,
    description: 'Durable, low chemical leach, naturally sloped for rapid catchment.',
    maintenanceNeeds: 'Annual inspection of flashing and valley gutters.',
  },
  asphalt_shingle: {
    id: 'asphalt_shingle',
    name: 'Asphalt / Bitumen Shingles',
    runoffCoefficient: 0.70,
    typicalEfficiency: 0.75,
    description: 'Granular texture causes micro-retention. Best for non-potable uses like gardening and flushing.',
    maintenanceNeeds: 'Watch for granule shedding, replace curled shingles.',
  },
  paved_driveway: {
    id: 'paved_driveway',
    name: 'Paved Courtyard / Interlocking Tiles',
    runoffCoefficient: 0.65,
    typicalEfficiency: 0.70,
    description: 'Ground level catchment. Requires robust first-flush and oil-grit sedimentation separator.',
    maintenanceNeeds: 'Regular power washing, check sand joints.',
  },
  green_roof: {
    id: 'green_roof',
    name: 'Vegetated Green Roof (Sedum/Extensive)',
    runoffCoefficient: 0.35,
    typicalEfficiency: 0.60,
    description: 'Retains bulk stormwater for insulation and urban heat reduction; harvests overflow.',
    maintenanceNeeds: 'Weeding, seasonal drainage inspection.',
  },
};

export const TANK_MATERIALS: Record<string, TankMaterialOption> = {
  plastic_hdpe: {
    type: 'plastic_hdpe',
    name: 'HDPE / Rotomolded Polyethylene',
    costPerLitre: 0.12, // approx $0.12/L
    durabilityYears: 15,
    pros: ['Lightweight', '100% rustproof', 'Quick installation', 'Food-grade certified'],
    cons: ['UV degradation over decades if unshaded', 'Not suited for deep burial without reinforcement'],
    recommendedPlacement: 'Above ground',
  },
  concrete_rcc: {
    type: 'concrete_rcc',
    name: 'Cast-in-place RCC Sump (Concrete)',
    costPerLitre: 0.22,
    durabilityYears: 40,
    pros: ['Extremely strong', 'Can be installed under driveway/lawn', 'Keeps water naturally cool'],
    cons: ['Higher capital investment', 'Requires skilled civil masonry & waterproofing'],
    recommendedPlacement: 'Underground',
  },
  ferro_cement: {
    type: 'ferro_cement',
    name: 'Ferrocement Tank',
    costPerLitre: 0.15,
    durabilityYears: 25,
    pros: ['Low material cost', 'Flexible circular shape resists hydrostatic pressure', 'Long lifespan'],
    cons: ['Requires specialized wire-mesh plastering craftsmanship'],
    recommendedPlacement: 'Partially buried',
  },
  masonry: {
    type: 'masonry',
    name: 'Brick / Stone Masonry Tank',
    costPerLitre: 0.18,
    durabilityYears: 20,
    pros: ['Uses standard local construction materials', 'Good thermal insulation'],
    cons: ['Risk of seepage cracks over time', 'Requires thick waterproof cement rendering'],
    recommendedPlacement: 'Above ground',
  },
};

export const REGIONAL_PRESETS = [
  {
    name: 'Bangalore, India (Tropical Savanna)',
    annualRainfallMm: 970,
    monthlyDistribution: [2, 7, 18, 45, 110, 80, 115, 145, 210, 170, 60, 15],
    defaultLPCD: 135,
    dryPeriodDays: 90,
  },
  {
    name: 'Mumbai, India (Heavy Coastal Monsoon)',
    annualRainfallMm: 2200,
    monthlyDistribution: [1, 1, 1, 2, 20, 520, 800, 550, 270, 30, 4, 1],
    defaultLPCD: 135,
    dryPeriodDays: 180,
  },
  {
    name: 'Delhi NCR, India (Semi-Arid Monsoonal)',
    annualRainfallMm: 790,
    monthlyDistribution: [15, 18, 12, 10, 25, 65, 240, 250, 120, 15, 5, 15],
    defaultLPCD: 135,
    dryPeriodDays: 120,
  },
  {
    name: 'London, UK (Temperate Oceanic)',
    annualRainfallMm: 615,
    monthlyDistribution: [55, 40, 42, 45, 50, 48, 46, 52, 58, 62, 59, 58],
    defaultLPCD: 140,
    dryPeriodDays: 30,
  },
  {
    name: 'Seattle, USA (Pacific Northwest Cool)',
    annualRainfallMm: 990,
    monthlyDistribution: [145, 105, 95, 70, 50, 40, 20, 25, 45, 90, 150, 155],
    defaultLPCD: 180,
    dryPeriodDays: 60,
  },
  {
    name: 'Melbourne, Australia (Temperate Mediterranean-influence)',
    annualRainfallMm: 648,
    monthlyDistribution: [47, 48, 52, 57, 56, 49, 48, 50, 58, 66, 60, 57],
    defaultLPCD: 155,
    dryPeriodDays: 45,
  },
  {
    name: 'Nairobi, Kenya (Bimodal Highland)',
    annualRainfallMm: 925,
    monthlyDistribution: [60, 55, 95, 210, 160, 35, 18, 25, 30, 55, 120, 62],
    defaultLPCD: 110,
    dryPeriodDays: 75,
  },
];

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function calculateRWH(inputs: CalculationInputs): CalculationResults {
  const roofInfo = ROOF_MATERIALS[inputs.roofMaterial] || ROOF_MATERIALS.concrete_rcc;
  const runoffCoeff = roofInfo.runoffCoefficient;
  const filterEff = inputs.filterEfficiency > 0 ? inputs.filterEfficiency : 0.85;

  // 1. Annual Harvest Potential: V = Area * Rainfall * RunoffCoeff * FilterEff
  // Area (m²) * Rainfall (mm) = Litres. (1 m² * 1 mm = 1 Litre)
  const annualRain = inputs.annualRainfallMm || 900;
  const area = inputs.catchmentAreaSqM || 100;
  
  const annualHarvestPotentialLitres = Math.round(area * annualRain * runoffCoeff * filterEff);
  const annualHarvestPotentialKL = +(annualHarvestPotentialLitres / 1000).toFixed(2);
  const dailyHarvestAverageLitres = +(annualHarvestPotentialLitres / 365).toFixed(1);

  // 2. Demand Calculation
  // Determine usage proportion based on selected categories
  let usageMultiplier = 0;
  if (inputs.demandUses.toiletFlushing) usageMultiplier += 0.30;
  if (inputs.demandUses.gardening) usageMultiplier += 0.20;
  if (inputs.demandUses.laundryWashing) usageMultiplier += 0.25;
  if (inputs.demandUses.drinkingCooking) usageMultiplier += 0.25;
  if (usageMultiplier === 0) usageMultiplier = 0.50; // default to secondary non-potable

  const occupants = Math.max(1, inputs.numberOfOccupants || 4);
  const lpcd = inputs.lpcd || 135;
  const dailyDemandLitres = Math.round(occupants * lpcd * usageMultiplier);
  const annualDemandLitres = Math.round(dailyDemandLitres * 365);
  const annualDemandKL = +(annualDemandLitres / 1000).toFixed(2);

  // 3. Dry Period Capacity requirement
  const dryDays = inputs.dryPeriodDays || 75;
  const dryPeriodRequiredLitres = Math.round(dailyDemandLitres * dryDays);

  // Recommended tank capacity:
  // Practical engineering rule of thumb: Min of (Dry Period Demand, 15-20% of annual harvest) with standard constraints
  const harvestBasedCap = Math.round(annualHarvestPotentialLitres * 0.18);
  const recommendedTankSizeLitres = inputs.customTankSizeLitres && inputs.customTankSizeLitres > 0
    ? inputs.customTankSizeLitres
    : Math.max(2000, Math.min(dryPeriodRequiredLitres, harvestBasedCap));
  const recommendedTankSizeKL = +(recommendedTankSizeLitres / 1000).toFixed(2);

  const autonomyDaysWithRecommendedTank = +(recommendedTankSizeLitres / Math.max(1, dailyDemandLitres)).toFixed(1);

  // 4. Monthly Mass Balance Simulation
  const monthlyDist = inputs.monthlyRainfallDistribution && inputs.monthlyRainfallDistribution.length === 12
    ? inputs.monthlyRainfallDistribution
    : [30, 25, 40, 60, 100, 120, 160, 150, 110, 60, 30, 15]; // default fallbacks

  let currentStorage = 0;
  let totalWaterSaved = 0;

  const monthlyBreakdown: MonthlyData[] = MONTH_NAMES.map((month, idx) => {
    const rain = monthlyDist[idx] || 0;
    // Monthly harvest in Litres
    const harvest = Math.round(area * rain * runoffCoeff * filterEff);
    // Monthly demand (approx 30.4 days per month)
    const demand = Math.round(dailyDemandLitres * 30.42);

    // Inflow + initial storage
    const available = currentStorage + harvest;
    let deficit = 0;
    let stored = 0;
    let overflow = 0;

    if (available >= demand) {
      const remaining = available - demand;
      if (remaining > recommendedTankSizeLitres) {
        stored = recommendedTankSizeLitres;
        overflow = remaining - recommendedTankSizeLitres;
      } else {
        stored = remaining;
      }
      totalWaterSaved += demand;
    } else {
      deficit = demand - available;
      stored = 0;
      totalWaterSaved += available;
    }

    currentStorage = stored;

    return {
      month,
      rainfallMm: rain,
      harvestedLitres: harvest,
      demandLitres: demand,
      storedLitres: Math.round(stored),
      overflowLitres: Math.round(overflow),
      deficitLitres: Math.round(deficit),
    };
  });

  const waterSavedLitres = Math.round(Math.min(totalWaterSaved, annualDemandLitres));
  const selfSufficiencyRatio = +(Math.min(100, (waterSavedLitres / Math.max(1, annualDemandLitres)) * 100)).toFixed(1);

  // 5. Financial & Ecological
  const tariffPerKL = inputs.waterTariffPerKL || 1.80; // Default $1.80/kL (or local currency)
  const annualUtilitySavings = +((waterSavedLitres / 1000) * tariffPerKL).toFixed(2);

  const tankMat = TANK_MATERIALS[inputs.tankMaterial] || TANK_MATERIALS.plastic_hdpe;
  const tankCost = recommendedTankSizeLitres * tankMat.costPerLitre;
  const filtrationCost = inputs.filtrationSystemCost || 350;
  const pipingCost = inputs.gutterPipingCost || 450;
  const estimatedCapitalCost = +(tankCost + filtrationCost + pipingCost).toFixed(2);

  const paybackPeriodYears = annualUtilitySavings > 0
    ? +(estimatedCapitalCost / annualUtilitySavings).toFixed(1)
    : 0;

  // CO2 offset: ~0.35 kWh per m³ treated water * 0.7 kg CO2 / kWh = 0.245 kg CO2 per kL
  const co2OffsetKgPerYear = +((waterSavedLitres / 1000) * 0.245).toFixed(1);

  // 6. Artificial Recharge Well Sizing
  // Peak intensity storm of 25mm in 1 hour
  const peakRunoffLitres = Math.round(area * 25 * runoffCoeff);
  const pitCapacity = Math.min(peakRunoffLitres, 8000);
  const pitDia = 1.5; // meters
  const pitRadius = pitDia / 2;
  // Volume = pi * r^2 * depth => depth = Volume(m³) / (pi * r^2)
  const pitDepth = +(pitCapacity / (1000 * Math.PI * pitRadius * pitRadius)).toFixed(1);

  return {
    annualHarvestPotentialLitres,
    annualHarvestPotentialKL,
    dailyHarvestAverageLitres,
    dailyDemandLitres,
    annualDemandLitres,
    annualDemandKL,
    selfSufficiencyRatio,
    waterSavedLitres,
    recommendedTankSizeLitres,
    recommendedTankSizeKL,
    dryPeriodRequiredLitres,
    autonomyDaysWithRecommendedTank,
    monthlyBreakdown,
    estimatedCapitalCost,
    annualUtilitySavings,
    paybackPeriodYears,
    co2OffsetKgPerYear,
    rechargeWellRecommendation: {
      diameterMeters: pitDia,
      depthMeters: Math.max(1.8, pitDepth),
      capacityLitres: pitCapacity,
      rechargeRateLPerHour: Math.round(pitCapacity / 2.5),
    },
  };
}

export const DEFAULT_INPUTS: CalculationInputs = {
  projectName: 'Green Campus Science Block RWH',
  locationName: 'Bangalore, India (Tropical Savanna)',
  propertyType: 'school_college',
  catchmentAreaSqM: 350,
  roofLengthM: 25,
  roofWidthM: 14,
  roofMaterial: 'concrete_rcc',
  filterEfficiency: 0.88,
  annualRainfallMm: 970,
  monthlyRainfallDistribution: [2, 7, 18, 45, 110, 80, 115, 145, 210, 170, 60, 15],
  numberOfOccupants: 80,
  lpcd: 45, // typical school day usage
  dryPeriodDays: 75,
  demandUses: {
    toiletFlushing: true,
    gardening: true,
    laundryWashing: false,
    drinkingCooking: false,
  },
  tankMaterial: 'plastic_hdpe',
  waterTariffPerKL: 2.20,
  filtrationSystemCost: 480,
  gutterPipingCost: 650,
};
