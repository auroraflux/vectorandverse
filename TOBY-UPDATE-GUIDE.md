# Toby Status Page Update Guide

## Overview
The Toby status page (`/src/pages/toby.astro`) is a dedicated health update page for Toby, separate from the main blog. It provides real-time updates in a timeline format.

## Page Structure

### 1. Current Status Section
- **Location**: Top of page after header
- **Purpose**: Most recent update prominently displayed
- **Features**: 
  - Pulsing yellow dot animation
  - Current day/time indicator
  - Update frequency note (1/2 or 2/2 for daily updates)

### 2. Timeline Section
- **Location**: Below current status
- **Format**: Reverse chronological order (newest first)
- **Components**: 
  - Day circles with 3-letter abbreviations (SUN, MON, TUE, etc.)
  - Color coding: Green (improvement), Yellow (stable), Red (crisis), Gray (background)
  - Bullet points with status colors: Green (good news), Orange (neutral), Red (concerning)

## Update Process

### Adding New Updates
1. **Update Current Status**: Replace content in the "Current Status" section
2. **Add New Timeline Entry**: Insert new day section at top of timeline
3. **Update Progress Indicator**: Modify "Morning update • Evening update pending" as needed
4. **Color Coding**: Choose appropriate day circle color based on overall status

### Timeline Entry Template
```astro
{/* [DAY], [DATE] */}
<div class="relative flex items-start">
  <div class="flex-shrink-0 w-16 h-16 bg-[COLOR]-100 rounded-full flex items-center justify-center border-4 border-white shadow-md">
    <span class="text-sm font-weight-900 text-[COLOR]-700">[DAY]</span>
  </div>
  <div class="ml-8 flex-1">
    <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 class="text-xl font-weight-850 text-gray-800 mb-2">[Full Date]</h3>
      
      {/* Optional status callout */}
      <div class="mb-4 p-3 bg-[COLOR]-50 rounded-lg border-l-4 border-[COLOR]-400">
        <p class="text-[COLOR]-800 font-weight-600">
          [Key status message]
        </p>
      </div>
      
      <ul class="space-y-2 text-gray-700 font-weight-500">
        <li class="flex items-start">
          <span class="text-[STATUS_COLOR]-500 mr-3 text-lg flex-shrink-0">•</span>
          <span>[Update content]</span>
        </li>
        {/* Repeat for each bullet point */}
      </ul>
    </div>
  </div>
</div>
```

## Color Reference

### Day Circle Colors
- **Green**: `bg-green-100`, `text-green-700` - Good days, improvements
- **Yellow**: `bg-yellow-100`, `text-yellow-700` - Stable, holding pattern
- **Red**: `bg-red-100`, `text-red-700` - Crisis, emergency situations
- **Gray**: `bg-gray-100`, `text-gray-700` - Background context

### Bullet Point Colors
- **Green**: `text-green-500` - Positive developments, good news
- **Orange**: `text-orange-500` - Neutral updates, ongoing situations
- **Red**: `text-red-500` - Concerning developments, setbacks

### Status Callout Colors
- **Green**: `bg-green-50`, `border-green-400`, `text-green-800` - Hopeful news
- **Yellow**: `bg-yellow-50`, `border-yellow-400`, `text-yellow-800` - Cautious updates
- **Red**: `bg-red-50`, `border-red-400`, `text-red-800` - Serious concerns

## Daily Update Types

### Morning Updates
- Usually more comprehensive
- Include overnight observations
- Blood work results if available
- Vet communications

### Evening Updates
- Brief status check
- Any changes from morning
- Next steps or expectations
- Can be combined with morning if no significant changes

## Current Status Management

### Update Frequency Indicators
```astro
<!-- Single update day -->
<span class="text-sm text-gray-500 font-weight-500">[Day] [Time]</span>

<!-- Partial day (1 of 2 updates) -->
<div class="ml-auto text-right">
  <span class="text-sm text-gray-500 font-weight-500">[Day] [Time]</span>
  <div class="text-xs text-gray-400 font-weight-400 mt-1">
    [Time] update • [Time] update pending
  </div>
</div>

<!-- Complete day (2 of 2 updates) -->
<span class="text-sm text-gray-500 font-weight-500">[Day] - Both Updates Complete</span>
```

## LLM Update Instructions

When updating this page:

1. **Identify Update Type**: New day vs. additional update for existing day
2. **Update Current Status**: Always replace with latest information
3. **Timeline Placement**: Add new entries at the TOP of the timeline
4. **Maintain Consistency**: Use established color patterns and formatting
5. **Update Progress**: Modify daily update indicators appropriately

## File Locations
- **Main page**: `/src/pages/toby.astro`
- **Images**: `/public/images/blog/013-toby/` (if needed)
- **This guide**: `/TOBY-UPDATE-GUIDE.md`

## Notes for Updates
- Keep bullet points concise but informative
- Use color coding consistently to help quick scanning
- Bold important medical terms or significant changes
- Maintain the personal, caring tone throughout
- Update timestamp in Current Status section
- Consider mobile readability (flex-shrink-0 on bullets prevents layout issues)