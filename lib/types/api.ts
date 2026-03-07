/**
 * API Type Definitions
 * 
 * Defines TypeScript interfaces for API requests and responses.
 * These types ensure consistency across frontend and backend.
 */

/**
 * Generic API Response wrapper
 * All API endpoints return this structure
 */
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
}

/**
 * Analytics Overview Response
 * Contains key metrics for the analytics dashboard
 */
export interface AnalyticsOverview {
  totalUsers: number
  totalUsersGrowth: number
  trustScans: number
  trustScansGrowth: number
  threatsBlocked: number
  threatsBlockedSuccessRate: number
  avgTrustScore: number
  avgTrustScoreChange: number
  activeScans: number
  activeScansGrowth: number
  trustVerifications: number
  trustVerificationsGrowth: number
  riskAlerts: number
  riskAlertsChange: number
  protectedUsers: number
  protectedUsersGrowth: number
}

/**
 * Trust Score Range
 * Represents a single range in the trust distribution
 */
export interface TrustScoreRange {
  range: string
  count: number
  percentage: number
  color: string
}

/**
 * Trust Distribution Response
 * Contains distribution of trust scores across ranges
 */
export interface TrustDistribution {
  ranges: TrustScoreRange[]
}

/**
 * Platform Coverage
 * Represents coverage metrics for a single platform
 */
export interface PlatformCoverage {
  name: string
  scans: number
  coverage: number
  dotColor: string
}

/**
 * Platform Performance
 * Represents performance metrics for a single platform
 */
export interface PlatformPerformance {
  name: string
  protectedUsers: number
  avgPulseScore: number
  threatsBlocked: number
  growth: number
}

/**
 * Trust Ecosystem Component
 * Represents a single component in the trust ecosystem
 */
export interface TrustEcosystemComponent {
  metric: string
  description: string
}

/**
 * Trust Ecosystem Metrics
 * Contains metrics for all trust ecosystem components
 */
export interface TrustEcosystem {
  dataCollection: TrustEcosystemComponent
  analysisEngine: TrustEcosystemComponent
  trustScoring: TrustEcosystemComponent
  userProtection: TrustEcosystemComponent
}

/**
 * Scoring Criterion
 * Represents a single criterion in the scoring model
 */
export interface ScoringCriterion {
  title: string
  weight: number
  maxPoints: number
  description: string
  exampleScore: number
  points: number
}

/**
 * Platform Summary
 * Contains summary statistics across all platforms
 */
export interface PlatformSummary {
  totalSellers: number
  avgScore: number
  highRisk: number
}
