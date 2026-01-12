# The Shpak - App Specification

## Overview

"The Shpak" is a Course Match simulator and analytics tool for Wharton MBA students. It helps students make informed bidding decisions by analyzing historical clearing prices and predicting future prices.

## Target Users

- **Primary**: Incoming Wharton MBA students preparing for Course Match
- **Secondary**: Current students optimizing their bidding strategy

## Core Problem

Wharton's Course Match uses a complex auction-based system (CEEI - Competitive Equilibrium from Equal Incomes) where students bid points for courses. Students need to:
1. Understand historical price trends
2. Predict which courses will be competitive
3. Allocate their limited points optimally

## Features

### P0 - Core Features (MVP)

1. **Price Explorer**
   - Browse all historical clearing prices (2013-2026)
   - Search by course code, section, department
   - Filter by department and price range
   - Sort by price, predicted price, price change
   - Expandable price history charts
   - Toggle to show ML predictions

2. **Data Pipeline**
   - Automated fetching from Wharton's published Excel files
   - 26 semesters of data (Fall 2013 - Spring 2026)
   - 888 unique course sections tracked
   - Linear regression for next-semester predictions

### P1 - Enhanced Analytics

3. **Hidden Gems View**
   - Find undervalued courses (low price, good history)
   - Courses with consistent availability
   - Rising stars (low now, predicted to increase)

4. **Department Analytics**
   - Per-department price distributions
   - Department competitiveness rankings
   - Seasonal trends (Fall vs Spring)

### P2 - Strategy Tools (Planned)

5. **Bid Advisor**
   - Input courses of interest with utilities
   - Get recommended bid amounts
   - Risk assessment (probability of getting the course)

6. **Portfolio Simulator**
   - Simulate different bidding strategies
   - See expected outcomes
   - Compare scenarios

### P3 - Educational (Planned)

7. **How It Works**
   - Interactive CEEI algorithm explanation
   - Worked examples
   - Common strategies and pitfalls

## Data Sources

- Historical clearing prices: `mba-inside.wharton.upenn.edu/course-match/`
- Format: Excel files (.xlsx) published each semester
- Sections: 4-letter department + 7-digit code (e.g., FNCE1000001)

## Success Metrics

- Users can quickly find price history for any course
- Predictions are within 20% of actual clearing prices
- Students report feeling more confident in bidding decisions
