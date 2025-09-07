# Claude Code Instructions for Toby Status Page Updates

## Quick Reference for LLMs

When asked to update the Toby status page (`/src/pages/toby.astro`), follow this process:

### 1. Understand the Update Type
- **New Day**: Create a new timeline entry at the top
- **Same Day Update**: Modify existing entry or update current status
- **Current Status**: Always update the "Current Status" section with latest info

### 2. Update Current Status Section
**Location**: Lines ~30-70 in `/src/pages/toby.astro`
```astro
<div class="mb-12 p-8 bg-white rounded-xl shadow-sm border border-gray-200">
  <div class="flex items-center mb-4">
    <div class="w-3 h-3 bg-yellow-400 rounded-full mr-3 animate-pulse-gentle"></div>
    <h2 class="text-2xl font-weight-850 text-gray-800">Current Status</h2>
    <div class="ml-auto text-right">
      <span class="text-sm text-gray-500 font-weight-500">[DAY TIME]</span>
      <div class="text-xs text-gray-400 font-weight-400 mt-1">
        [TIME] update • [TIME] update pending
      </div>
    </div>
  </div>
  <p class="text-lg text-gray-700 font-weight-500 leading-relaxed">
    [LATEST STATUS TEXT]
  </p>
</div>
```

### 3. Add New Timeline Entries
**Location**: After line ~90, insert at TOP of timeline entries
**Template**:
```astro
{/* [DAY], [DATE] - [STATUS DESCRIPTION] */}
<div class="relative timeline-entry">
  <div class="timeline-day-circle flex-shrink-0 w-16 h-16 bg-[COLOR]-100 rounded-full flex items-center justify-center border-4 border-white shadow-md">
    <span class="text-sm font-weight-900 text-[COLOR]-700">[DAY]</span>
  </div>
  <div class="timeline-content ml-8 flex-1">
    <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 class="text-xl font-weight-850 text-gray-800 mb-2">[Full Date]</h3>
      
      <!-- Optional status highlight -->
      <div class="mb-4 p-3 bg-[COLOR]-50 rounded-lg border-l-4 border-[COLOR]-400">
        <p class="text-[COLOR]-800 font-weight-600">
          [Key message about the day]
        </p>
      </div>
      
      <ul class="space-y-2 text-gray-700 font-weight-500">
        <li class="flex items-start">
          <span class="text-[STATUS_COLOR]-500 mr-3 text-lg flex-shrink-0">•</span>
          <span>[Update point]</span>
        </li>
        <!-- Repeat for each bullet -->
      </ul>
    </div>
  </div>
</div>
```

### 4. Color Coding System

**Day Circle Colors** (choose based on overall day status):
- `green-100`/`green-700` - Good days, improvements, recovery
- `yellow-100`/`yellow-700` - Stable, holding pattern, cautious optimism
- `red-100`/`red-700` - Crisis, emergency, serious concerns
- `gray-100`/`gray-700` - Background context, neutral

**Bullet Point Colors** (choose based on individual update):
- `green-500` - Positive news, improvements, good signs
- `orange-500` - Neutral updates, ongoing situations, procedures
- `red-500` - Concerning developments, setbacks, problems

**Status Callout Colors** (optional highlight box):
- `green-50`/`green-400`/`green-800` - Hope, recovery, good news
- `yellow-50`/`yellow-400`/`yellow-800` - Caution, waiting, uncertainty  
- `red-50`/`red-400`/`red-800` - Crisis, emergency, serious concern

### 5. Update Frequency Indicators

**Morning update with evening pending**:
```astro
<div class="ml-auto text-right">
  <span class="text-sm text-gray-500 font-weight-500">Sunday Morning</span>
  <div class="text-xs text-gray-400 font-weight-400 mt-1">
    Morning update • Evening update pending
  </div>
</div>
```

**Both updates complete**:
```astro
<span class="ml-auto text-sm text-gray-500 font-weight-500">Sunday - Both Updates Complete</span>
```

### 6. Mobile Responsive Design

The timeline uses responsive classes for optimal mobile viewing:
- **`timeline-entry`**: Container with responsive flex behavior
- **`timeline-day-circle`**: Day circle that stacks above content on mobile
- **`timeline-content`**: Content area that adjusts to mobile layout

**Mobile Behavior (≤640px)**: Day circles appear above content in vertical stack
**Desktop Behavior (>640px)**: Side-by-side layout with day circles on left

### 7. Important Guidelines

- **Always** update Current Status section first
- **Add new timeline entries at the TOP** (newest first)
- **Use responsive classes**: `timeline-entry`, `timeline-day-circle`, `timeline-content`
- **Use `flex-shrink-0`** on bullet point spans to prevent layout issues
- **Keep bullet points concise** but informative
- **Bold important medical terms** using `<strong class="font-weight-700">`
- **Maintain personal, caring tone** throughout
- **Be consistent with color patterns** established in existing entries

### 8. Example Update Process

If given: "Sunday evening update: Toby ate a small amount on his own, blood sugar is stable, still needs IV support"

1. Update Current Status with evening info
2. Modify frequency indicator to show evening update complete
3. Either add to existing Sunday entry or create evening subsection
4. Use green bullets for eating progress, orange for ongoing IV support

### 9. Files to Reference
- `/TOBY-UPDATE-GUIDE.md` - Detailed documentation
- `/src/pages/toby.astro` - The actual page file
- Look for comments marked `UPDATE INSTRUCTIONS` in the code