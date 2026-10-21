export type RoofMaterialType =
  | 'metal_gi'
  | 'concrete_rcc'
  | 'clay_tiles'
  | 'slate'
  | 'asphalt_shingle'
  | 'paved_driveway'
  | 'green_roof';

export interface RoofMaterialInfo {
  id: RoofMaterialType;
  name: string;
  runoffCoefficient: number; // e.g. 0.85
  description: string;
  typicalEfficiency: number;
  maintenanceNeeds: string;
}

export type PropertyType = 'residential' | 'school_college' | 'hostel' | 'commercial' | 'agricultural';

export interface MonthlyData {
  month: string;
  rainfallMm: number;
  harvestedLitres: number;
  demandLitres: number;
  storedLitres: number;
  overflowLitres: number;
  deficitLitres: number;
}

export interface TankMaterialOption {
  type: 'plastic_hdpe' | 'concrete_rcc' | 'ferro_cement' | 'masonry';
  name: string;
  costPerLitre: number; // in USD or local currency
  durabilityYears: number;
  pros: string[];
  cons: string[];
  recommendedPlacement: 'Above ground' | 'Underground' | 'Partially buried';
}

export interface CalculationInputs {
  projectName: string;
  locationName: string;
  propertyType: PropertyType;
  catchmentAreaSqM: number; // m²
  roofLengthM?: number;
  roofWidthM?: number;
  roofMaterial: RoofMaterialType;
  filterEfficiency: number; // 0.70 to 0.95 (e.g. 0.85)
  annualRainfallMm: number; // mm
  monthlyRainfallDistribution: number[]; // 12 numbers in mm
  
  // Demand
  numberOfOccupants: number;
  lpcd: number; // Litres per capita per day
  dryPeriodDays: number; // e.g. 60-90 days
  demandUses: {
    toiletFlushing: boolean;
    gardening: boolean;
    laundryWashing: boolean;
    drinkingCooking: boolean;
  };
  
  // Storage & Cost
  customTankSizeLitres?: number;
  tankMaterial: 'plastic_hdpe' | 'concrete_rcc' | 'ferro_cement' | 'masonry';
  waterTariffPerKL: number; // $/kL or currency/1000L
  filtrationSystemCost: number;
  gutterPipingCost: number;
}

export interface CalculationResults {
  annualHarvestPotentialLitres: number; // L
  annualHarvestPotentialKL: number; // kL (m³)
  dailyHarvestAverageLitres: number;
  
  dailyDemandLitres: number;
  annualDemandLitres: number;
  annualDemandKL: number;
  
  selfSufficiencyRatio: number; // Percentage (e.g. 64.5%)
  waterSavedLitres: number; // minimum of harvest and demand
  
  recommendedTankSizeLitres: number;
  recommendedTankSizeKL: number;
  dryPeriodRequiredLitres: number;
  autonomyDaysWithRecommendedTank: number;
  
  monthlyBreakdown: MonthlyData[];
  
  // Financials
  estimatedCapitalCost: number;
  annualUtilitySavings: number;
  paybackPeriodYears: number;
  co2OffsetKgPerYear: number;
  
  // Aquifer Recharge Option
  rechargeWellRecommendation: {
    diameterMeters: number;
    depthMeters: number;
    capacityLitres: number;
    rechargeRateLPerHour: number;
  };
}

export interface SavedProject {
  id: string;
  user_id?: string;
  name: string;
  location: string;
  inputs: CalculationInputs;
  results: CalculationResults;
  ai_analysis?: AIRecommendationResult | null;
  created_at: string;
  updated_at: string;
  status: 'draft' | 'analyzed' | 'optimized' | 'implemented';
}

export interface AIRecommendationResult {
  summary: string;
  feasibilityScore: number; // 1-100
  keyInsights: string[];
  tankOptimizationNote: string;
  recommendedFilters: {
    name: string;
    description: string;
    priority: 'Essential' | 'Recommended' | 'Optional';
  }[];
  maintenanceChecklist: {
    frequency: 'Pre-Monsoon' | 'Monthly' | 'Post-Monsoon' | 'Annually';
    tasks: string[];
  }[];
  groundwaterRechargeAdvice: string;
  regulatoryComplianceTips: string[];
  customAnswer?: string;
}
