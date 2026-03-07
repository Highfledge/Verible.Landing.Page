# Implementation Plan: Dynamic Analytics Data

## Overview

Replace hardcoded demo data in the analytics page with real-time data from backend APIs. This implementation will create backend API endpoints to aggregate analytics metrics from the database, build a frontend API client to fetch the data, and update the analytics page component to use dynamic data instead of static constants.

## Tasks

- [-] 1. Set up backend API structure and authentication middleware
  - Create analytics controller file with route handlers
  - Implement JWT authentication middleware for analytics endpoints
  - Set up error handling utilities for consistent API responses
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 9.1, 9.5, 12.1, 12.2, 12.3, 12.4, 12.5_

- [ ] 2. Implement analytics overview endpoint
  - [ ] 2.1 Create GET /api/analytics/overview endpoint
    - Query database for total users, scans, threats blocked, and average trust score
    - Calculate growth metrics by comparing with historical data (30 days for users, 7 days for scans)
    - Handle zero previous period values to avoid division by zero
    - Return AnalyticsOverview response with all required fields
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 11.1, 11.2, 11.3, 11.4, 11.5_
  
  - [ ] 2.2 Write property test for analytics overview endpoint
    - **Property 1: All Numeric Metrics Are Non-Negative**
    - **Property 10: Growth Calculation Formula**
    - **Property 11: Zero Previous Period Handling**
    - **Validates: Requirements 1.2, 11.3, 11.4, 11.5**

- [ ] 3. Implement trust distribution endpoint
  - [ ] 3.1 Create GET /api/analytics/trust-distribution endpoint
    - Query all seller pulse scores from database
    - Categorize scores into five ranges (90-100, 80-89, 70-79, 60-69, below 60)
    - Calculate count and percentage for each range
    - Ensure percentages sum to 100 within ±0.1 tolerance
    - Return TrustDistribution response ordered from highest to lowest
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_
  
  - [ ] 3.2 Write property test for trust distribution
    - **Property 3: Trust Distribution Percentages Sum to 100**
    - **Property 4: Trust Distribution Categorization**
    - **Validates: Requirements 2.2, 2.3**

- [ ] 4. Implement platform coverage and performance endpoints
  - [ ] 4.1 Create GET /api/analytics/platforms/coverage endpoint
    - Query scan counts and coverage percentages for all platforms
    - Ensure coverage values are between 0 and 100
    - Return PlatformCoverage array with name, scans, coverage, and color
    - _Requirements: 3.1, 3.2, 3.3, 3.4_
  
  - [ ] 4.2 Create GET /api/analytics/platforms/performance endpoint
    - Query protected users, average pulse scores, threats blocked, and growth for each platform
    - Ensure average pulse scores are between 0 and 100
    - Allow negative growth values for decline
    - Return PlatformPerformance array with all required fields
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_
  
  - [ ] 4.3 Write property tests for platform endpoints
    - **Property 2: Score Values Within Valid Range**
    - **Property 5: Platform Coverage Percentage Bounds**
    - **Validates: Requirements 3.3, 4.3**

- [ ] 5. Implement scoring criteria and platform summary endpoints
  - [ ] 5.1 Create GET /api/analytics/scoring-criteria endpoint
    - Return four scoring criteria with weights, max points, descriptions, and example scores
    - Ensure weights sum to exactly 100
    - Ensure points do not exceed max points for each criterion
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  
  - [ ] 5.2 Create GET /api/analytics/platforms/summary endpoint
    - Query total sellers, average score, and high-risk seller count
    - Ensure high-risk count does not exceed total sellers
    - Ensure average score is between 0 and 100
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
  
  - [ ] 5.3 Write property tests for scoring and summary endpoints
    - **Property 6: Scoring Criteria Weights Sum to 100**
    - **Property 7: Points Never Exceed Maximum**
    - **Property 8: High Risk Count Bounded by Total**
    - **Validates: Requirements 5.2, 5.4, 6.4**

- [ ] 6. Implement trust ecosystem endpoint
  - [ ] 6.1 Create GET /api/analytics/trust-ecosystem endpoint
    - Return metrics for data collection, analysis engine, trust scoring, and user protection
    - Ensure all metric and description strings are non-empty
    - Return TrustEcosystem response with all four components
    - _Requirements: 7.1, 7.2, 7.3, 7.4_
  
  - [ ] 6.2 Write property test for trust ecosystem
    - **Property 15: Required Response Fields Completeness**
    - **Validates: Requirements 7.2, 7.3**

- [ ] 7. Checkpoint - Ensure backend API tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 8. Create frontend API client
  - [ ] 8.1 Create analytics API client module
    - Implement getAnalyticsOverview() function
    - Implement getTrustDistribution() function
    - Implement getPlatformCoverage() function
    - Implement getPlatformPerformance() function
    - Implement getScoringCriteria() function
    - Implement getPlatformSummary() function
    - Implement getTrustEcosystem() function
    - Add JWT token handling for authenticated requests
    - Add error handling and response parsing
    - _Requirements: 8.1, 8.3, 9.2, 12.1, 12.2, 12.3, 12.4_
  
  - [ ] 8.2 Write unit tests for API client
    - Test successful responses
    - Test error handling
    - Test authentication token inclusion
    - _Requirements: 9.2, 9.4_

- [ ] 9. Update analytics page component for dynamic data loading
  - [ ] 9.1 Implement data loading logic for overview tab
    - Replace hardcoded overview data with API calls
    - Load overview, trust distribution, platform coverage, and platform summary
    - Add loading state management
    - Add error state management
    - _Requirements: 1.4, 9.2, 9.3, 10.1_
  
  - [ ] 9.2 Implement data loading logic for trust-ecosystem tab
    - Replace hardcoded ecosystem data with API calls
    - Load ecosystem data, platform performance, and trust distribution
    - Handle loading and error states
    - _Requirements: 7.4, 9.2, 9.3, 10.2_
  
  - [ ] 9.3 Implement data loading logic for scoring-model tab
    - Replace hardcoded scoring criteria with API call
    - Load scoring criteria data
    - Handle loading and error states
    - _Requirements: 5.5, 9.2, 9.3, 10.3_
  
  - [ ] 9.4 Implement data loading logic for platforms tab
    - Replace hardcoded platform data with API call
    - Load platform performance data
    - Handle loading and error states
    - _Requirements: 9.2, 9.3, 10.4_
  
  - [ ] 9.5 Add tab-based data loading optimization
    - Implement useEffect hook to load data based on active tab
    - Ensure only necessary data is fetched for each tab
    - Handle tab switching and data refresh
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ] 10. Implement error handling and loading states in UI
  - [ ] 10.1 Create loading spinner component for analytics page
    - Display loading indicator while data is being fetched
    - _Requirements: 9.3_
  
  - [ ] 10.2 Create error message component for analytics page
    - Display user-friendly error messages when API calls fail
    - Handle partial failures gracefully
    - _Requirements: 9.2, 9.4_
  
  - [ ] 10.3 Write integration tests for analytics page
    - Test data loading for each tab
    - Test error handling scenarios
    - Test loading state transitions
    - _Requirements: 9.2, 9.3, 9.4, 10.5_

- [ ] 11. Final checkpoint - Ensure all tests pass and UI displays dynamic data
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- The implementation uses TypeScript for both frontend and backend code
- Authentication is enforced on all analytics endpoints using JWT tokens
- All API responses follow the ApiResponse<T> wrapper format for consistency
