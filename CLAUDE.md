# Financial Planning App - Requirements Document

## Product Overview

### Core Concept

A visual financial planning application that helps users understand how current financial decisions impact their future. Users drag and drop financial components onto an interactive timeline to see real-time projections of their net worth and plan for debt elimination, retirement, and FIRE (Financial Independence, Retire Early).

### Primary Goals

- Visualize long-term impact of financial decisions
- Help users get out of debt
- Plan for retirement and FIRE
- Provide lightweight budgeting functionality
- Transform boring calculator inputs into interactive, visual components

## Core Features

### Timeline Interface

- **Main Interface**: Horizontal timeline representing time
- **Granularity**: Monthly view (with potential weekly option)
- **Time Range**: Default 30-50 years, user-adjustable
- **Net Worth Visualization**:
  - Bold line showing net worth over time
  - Red when below zero (debt)
  - Green when positive (assets)
  - Real-time updates when components change
- **Dark Mode**: Required before launch

### Component System

#### Universal Component Properties

All components must have:

- **ID**: Unique identifier
- **Name**: User-defined label (editable)
- **Start Date**: When component begins (default: today)
- **End Date**: Optional (show only if user selects "window" vs "ongoing")
- **Notes**: Optional text field

#### Component Types & Inputs

**1. Checking Account**

- Balance (current amount)

**2. Savings Account**

- Balance (current amount)
- Interest Rate (annual percentage)

**3. Investment Account**

- Balance (current amount)
- Projected Annual Return (percentage)
- Account Type (401k, Roth IRA, Traditional IRA, Brokerage, Crypto, HSA)

**4. Debt**

- Current Balance
- Interest Rate (annual percentage)
- Monthly Payment

**5. Income**

- Annual Amount
- Tax Rate (percentage)

**6. Expense**

- Amount (dollar value)
- Frequency (monthly, yearly, weekly)
- Repeat (Yes/No for one-time vs recurring)

**7. Current Home**

- Current Home Value
- Remaining Mortgage Balance
- Monthly Payment
- Interest Rate
- Years Remaining on Mortgage

**8. Future Home Purchase**

- Purchase Price
- Down Payment Percent
- Interest Rate
- Mortgage Term (15 or 30 years)
- Purchase Date

**9. Retirement Milestone** (Special Component)

- Target Retirement Age OR Target Net Worth
- Expected Retirement Expenses (percentage of current income)
- Withdrawal Rate (default 4%)

## User Interface Requirements

### Component Library

Organized sidebar with drag-and-drop components grouped by category:

**💰 Cash Flow (Green Theme)**

- Income sources
- Expenses (recurring and one-time)

**🏠 Assets (Blue Theme)**

- Real estate (current home, future purchase)
- Investment accounts (by type)
- Cash accounts (checking, savings)

**🔴 Liabilities (Red Theme)**

- Various debt types

**⚡ Special Events (Yellow/Orange Theme)**

- Retirement milestone
- Major life events

### Adding Components

**Method 1**: Drag from component library onto timeline
**Method 2**: Hover timeline → plus button appears → click to add → search/select component type

### Timeline Interaction

#### Component Visualization

- **Income/Expense**: Horizontal lines showing flow over time
- **Assets**: Curved lines showing compound growth
- **Debt**: Declining lines showing payoff progress
- **Real Estate**: Combined asset appreciation + mortgage paydown visualization

#### Timeline Editing System

**Core Interaction**: Click anywhere on any component's timeline line

**Edit Flow**:

1. Click any point on a component's line
2. Component editor popup appears at that timeline location
3. Editor shows pre-filled values for what component would be at that moment
4. UI clearly indicates this is an edit: "Edit [Component Name] - Starting [Date]"
5. User modifies values and saves
6. Editor disappears, small circle marker appears on the line
7. Circle remains clickable to re-edit those values

**Visual Markers**:

- Original component: Full component box at start date
- Edit points: Small circles along the component line
- Line segments: Show value changes between edit points

### Timeline Layout

**Vertical Lanes** (top to bottom):

- Income/positive cash flow
- Assets/investments
- Expenses/debt payments

**Timeline Navigation**:

- Zoom levels: Decade view, Year view, Month view
- Scroll/pan horizontally through time
- Current date marker clearly visible

## Technical Requirements

### Calculations Engine

**Real-time Calculations**: All projections update instantly when any component changes

**Core Calculations**:

- Net worth over time (assets - liabilities)
- Compound interest for investments and savings
- Debt payoff timelines with interest
- Mortgage amortization schedules
- Tax calculations on income
- Retirement feasibility analysis

**Advanced Calculations**:

- Home equity building over time
- Investment account growth with contributions
- Debt avalanche vs snowball comparisons
- FIRE calculation (25x annual expenses rule)

### Data Management

**Component Storage**: Each component stored with all properties and edit history
**Edit History**: Track all timeline edits with dates and values
**Calculation State**: Maintain current projection state for fast UI updates

### System Settings

**Inflation Toggle**: Optional 2-3% inflation applied to all components
**Smart Defaults**:

- Investment returns: 7% stocks, 3% bonds, 2% savings
- Tax rates: Standard brackets with state lookup
- Withdrawal rates: 4% rule for retirement

## User Experience Requirements

### Onboarding Flow

1. Brief explanation of timeline concept
2. Add 2-3 basic components (income, major expense, savings goal)
3. Show how net worth line changes with adjustments
4. Guide to adding more detailed components

### Visual Feedback

**Hover States**: Show detailed tooltips with calculations
**Loading States**: Smooth transitions during calculations
**Error States**: Clear validation messages for impossible scenarios
**Success States**: Visual confirmation when components added/edited

### Responsive Design

- Mobile-first design for component adding/editing
- Desktop-optimized for timeline visualization
- Touch-friendly drag and drop on mobile
- Keyboard navigation support

## Advanced Features (Future Considerations)

### Scenario Planning

- "What if" mode to test different decisions
- Multiple scenario layers that can be toggled on/off
- Scenario comparison view

### Goal Tracking

- Visual milestones on timeline (debt freedom, retirement target)
- Progress tracking with actual vs projected
- Achievement celebrations

### Data Integration

- Optional bank account linking (Plaid integration)
- Real-time investment tracking
- Tax document import for accurate calculations

## Technical Architecture Considerations

### Frontend Requirements

- React-based for component interactivity
- SVG or Canvas for timeline visualization
- Drag and drop library (React DnD or similar)
- Date/time handling library
- Chart/graph library for projections

### Performance Requirements

- Sub-100ms calculation updates
- Smooth 60fps timeline interactions
- Efficient rendering for 30+ year timelines
- Memory-efficient component storage

### Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browser optimization
- Local storage for user data persistence
- Progressive Web App capabilities

## Success Metrics

### User Engagement

- Time spent on timeline visualization
- Number of components added per user
- Frequency of timeline edits/adjustments
- User retention over time

### Educational Impact

- Users who complete debt payoff projections
- Users who identify retirement feasibility gaps
- Users who optimize their FIRE timeline

## Minimum Viable Product (MVP) Scope

**Core MVP Features**:

- Basic timeline with 5 component types (income, expense, debt, savings, investment)
- Timeline editing with click-to-edit functionality
- Real-time net worth calculation
- Component drag-and-drop from sidebar
- Dark mode support

**MVP Exclusions** (for later releases):

- Advanced scenario planning
- Bank account integration
- Complex tax calculations
- Mobile app versions
- Data export features

This requirements document provides the technical foundation needed to build a financial planning application that transforms traditional calculators into an engaging, visual experience.
