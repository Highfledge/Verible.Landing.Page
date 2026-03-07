# Requirements Document: Dynamic Analytics Data

## Introduction

This document specifies the requirements for replacing hardcoded demo data in the analytics page with real-time data from backend APIs. The system shall maintain the exact same UI/UX while transforming the data source from static constants to dynamic API calls. The requirements are derived from the approved technical design and ensure all analytics metrics are computed from live database queries.

## Glossary

- **Analytics_System**: The complete system responsible for collecting, aggregating, and displaying analytics data
- **Frontend_Client**: The browser-based UI component that displays analytics data
- **Backend_API**: The server-side API that processes analytics requests and queries the database
- **Database**: The persistent data store containing user, seller, and platform information
- **Trust_Score**: A numerical value between 0 and 100 representing seller trustworthiness
- **Pulse_Score**: Synonym for Trust_Score used in the platform
- **Growth_Metric**: A percentage value indicating change over time (can be positive or negative)
- **Platform**: An e-commerce marketplace (e.g., eBay, Amazon, Etsy)
- **Risk_Score**: A numerical value indicating potential threat level
- **Scoring_Criterion**: A weighted component used to calculate trust scores

## Requirements

### Requirement 1: Analytics Overview Data Retrieval

**User Story:** As a platform administrator, I want to view real-time analytics overview metrics, so that I can monitor platform health and user activity.

#### Acceptance Criteria

1. WHEN the analytics overview is requested, THE Backend_API SHALL query the Database for current user counts, scan counts, threat counts, and average trust scores
2. WHEN the analytics overview is returned, THE Backend_API SHALL include all numeric fields as non-negative values
3. WHEN calculating growth metrics, THE Backend_API SHALL compute percentage changes based on historical comparison periods
4. WHEN the Frontend_Client receives overview data, THE Analytics_System SHALL display total users, trust scans, threats blocked, and average trust score
5. IF the Database query fails, THEN THE Backend_API SHALL return an error response with success set to false

### Requirement 2: Trust Score Distribution Calculation

**User Story:** As a platform administrator, I want to see the distribution of trust scores across all sellers, so that I can understand the overall trust landscape.

#### Acceptance Criteria

1. WHEN trust distribution is requested, THE Backend_API SHALL query all seller pulse scores from the Database
2. WHEN calculating distribution, THE Backend_API SHALL categorize scores into five ranges: 90-100, 80-89, 70-79, 60-69, and below 60
3. WHEN computing percentages, THE Backend_API SHALL ensure the sum of all range percentages equals 100 within a tolerance of ±0.1
4. WHEN returning distribution data, THE Backend_API SHALL order ranges from highest to lowest scores
5. WHEN a range is calculated, THE Backend_API SHALL include count, percentage, and color for each range

### Requirement 3: Platform Coverage Metrics

**User Story:** As a platform administrator, I want to view platform coverage statistics, so that I can assess which marketplaces are being monitored.

#### Acceptance Criteria

1. WHEN platform coverage is requested, THE Backend_API SHALL query scan counts and coverage percentages for all platforms
2. WHEN returning platform data, THE Backend_API SHALL ensure each platform has a non-negative scan count
3. WHEN calculating coverage, THE Backend_API SHALL ensure coverage percentage is between 0 and 100
4. WHEN platform data is returned, THE Backend_API SHALL include platform name, scans, coverage, and display color

### Requirement 4: Platform Performance Analytics

**User Story:** As a platform administrator, I want to monitor platform-specific performance metrics, so that I can identify which marketplaces have the most activity and threats.

#### Acceptance Criteria

1. WHEN platform performance is requested, THE Backend_API SHALL query protected user counts, average pulse scores, threats blocked, and growth metrics for each platform
2. WHEN returning performance data, THE Backend_API SHALL ensure protected users count is non-negative
3. WHEN calculating average pulse score, THE Backend_API SHALL ensure the value is between 0 and 100
4. WHEN returning threats blocked, THE Backend_API SHALL ensure the count is non-negative
5. WHEN calculating growth, THE Backend_API SHALL allow negative values to represent decline

### Requirement 5: Scoring Criteria Configuration

**User Story:** As a platform administrator, I want to view the scoring criteria and their weights, so that I understand how trust scores are calculated.

#### Acceptance Criteria

1. WHEN scoring criteria is requested, THE Backend_API SHALL return exactly four scoring criteria
2. WHEN returning criteria weights, THE Backend_API SHALL ensure the sum of all weights equals 100
3. WHEN returning criteria, THE Backend_API SHALL ensure each criterion has a maximum points value greater than 0
4. WHEN returning example scores, THE Backend_API SHALL ensure points do not exceed maximum points for each criterion
5. WHEN displaying criteria, THE Frontend_Client SHALL show title, weight, max points, description, and example score

### Requirement 6: Platform Summary Statistics

**User Story:** As a platform administrator, I want to see summary statistics across all platforms, so that I can quickly assess overall platform health.

#### Acceptance Criteria

1. WHEN platform summary is requested, THE Backend_API SHALL query total seller count, average score, and high-risk seller count
2. WHEN returning total sellers, THE Backend_API SHALL ensure the count is non-negative
3. WHEN calculating average score, THE Backend_API SHALL ensure the value is between 0 and 100
4. WHEN returning high-risk count, THE Backend_API SHALL ensure it does not exceed total sellers
5. WHEN high-risk count is calculated, THE Backend_API SHALL ensure the value is non-negative

### Requirement 7: Trust Ecosystem Metrics

**User Story:** As a platform administrator, I want to view trust ecosystem metrics, so that I can understand system-wide data collection and analysis performance.

#### Acceptance Criteria

1. WHEN trust ecosystem data is requested, THE Backend_API SHALL return metrics for data collection, analysis engine, trust scoring, and user protection
2. WHEN returning ecosystem metrics, THE Backend_API SHALL ensure all metric strings are non-empty
3. WHEN returning ecosystem data, THE Backend_API SHALL ensure all description strings are non-empty
4. WHEN displaying ecosystem data, THE Frontend_Client SHALL show metric values and descriptions for each component

### Requirement 8: Authentication and Authorization

**User Story:** As a system administrator, I want to ensure only authenticated users can access analytics data, so that sensitive platform metrics remain secure.

#### Acceptance Criteria

1. WHEN any analytics endpoint is called, THE Backend_API SHALL verify the user has a valid JWT token
2. IF the user is not authenticated, THEN THE Backend_API SHALL return a 401 Unauthorized response
3. WHEN authentication succeeds, THE Backend_API SHALL process the analytics request
4. WHEN authentication fails, THE Backend_API SHALL not execute any database queries

### Requirement 9: Error Handling and Resilience

**User Story:** As a platform administrator, I want the system to handle errors gracefully, so that temporary failures don't break the analytics interface.

#### Acceptance Criteria

1. IF a Database query fails, THEN THE Backend_API SHALL return an error response with success set to false and a descriptive message
2. WHEN the Frontend_Client receives an error response, THE Analytics_System SHALL display an error message to the user
3. WHEN loading analytics data, THE Frontend_Client SHALL display a loading indicator until data is received or an error occurs
4. IF multiple API calls are required, THEN THE Frontend_Client SHALL handle partial failures gracefully
5. WHEN an error occurs, THE Backend_API SHALL log the error details for debugging

### Requirement 10: Data Loading by Tab

**User Story:** As a platform administrator, I want analytics data to load based on the active tab, so that the system only fetches necessary data and improves performance.

#### Acceptance Criteria

1. WHEN the overview tab is active, THE Frontend_Client SHALL request overview data, trust distribution, platform coverage, and platform summary
2. WHEN the trust-ecosystem tab is active, THE Frontend_Client SHALL request ecosystem data, platform performance, and trust distribution
3. WHEN the scoring-model tab is active, THE Frontend_Client SHALL request scoring criteria data
4. WHEN the platforms tab is active, THE Frontend_Client SHALL request platform performance data
5. WHEN switching tabs, THE Frontend_Client SHALL load the appropriate data for the newly active tab

### Requirement 11: Growth Calculation Accuracy

**User Story:** As a platform administrator, I want accurate growth metrics, so that I can track trends over time.

#### Acceptance Criteria

1. WHEN calculating user growth, THE Backend_API SHALL compare current user count to user count from 30 days prior
2. WHEN calculating scan growth, THE Backend_API SHALL compare current scan count to scan count from 7 days prior
3. IF the previous period count is zero, THEN THE Backend_API SHALL set growth to zero to avoid division by zero
4. WHEN calculating growth percentage, THE Backend_API SHALL use the formula: ((current - previous) / previous) * 100
5. WHEN returning growth values, THE Backend_API SHALL round to one decimal place

### Requirement 12: API Response Consistency

**User Story:** As a frontend developer, I want consistent API response formats, so that I can reliably parse and display data.

#### Acceptance Criteria

1. WHEN an API call succeeds, THE Backend_API SHALL return a response with success set to true and data populated
2. WHEN an API call fails, THE Backend_API SHALL return a response with success set to false and a message explaining the failure
3. WHEN success is true, THE Backend_API SHALL ensure the data field is not null
4. WHEN success is false, THE Backend_API SHALL ensure the message field is not null
5. THE Backend_API SHALL wrap all analytics responses in the ApiResponse interface
