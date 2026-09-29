const PROJECT_BRIEFS = [
  {
    "ticketId": "DX-7512",
    "title": "RepairLoop",
    "difficulty": "Beginner",
    "platform": "Mobile app (iOS/Android)",
    "industry": "Repair & sustainability",
    "overview": "RepairLoop helps people find nearby repair cafes and volunteer fixers before they throw away a broken household item.",
    "problemToSolve": "People default to buying new because they don't know free repair help exists nearby.",
    "targetUsers": "Budget-conscious renters and homeowners who want to waste less but can't fix things themselves.",
    "keyScreens": [
      "Onboarding: pick the item types you need help with",
      "Snap a photo and describe the problem",
      "Nearby repair cafes list with next event date",
      "Booking confirmation with what to bring"
    ],
    "constraints": [
      "Keep the flow to 4-5 screens",
      "Design for one primary user type only",
      "Follow basic accessible color contrast",
      "Design for comfortable one-handed use on a small screen"
    ],
    "deliverables": [
      "Low-fidelity wireframes for the core flow",
      "One polished high-fidelity screen",
      "A simple clickable prototype"
    ],
    "skillsPracticed": [
      "Onboarding design",
      "Camera/upload flows",
      "Location-based lists",
      "Confirmation states"
    ],
    "estimatedTime": "4-8 hours"
  },
  {
    "ticketId": "DX-7513",
    "title": "TabStash",
    "difficulty": "Beginner",
    "platform": "Browser extension",
    "industry": "Productivity",
    "overview": "TabStash lets people save a messy set of open browser tabs into a named group they can reopen later with one click.",
    "problemToSolve": "People keep dozens of tabs open as a memory aid, which slows down their browser and makes it hard to find anything.",
    "targetUsers": "Students and researchers who open many reference tabs while working on a single task.",
    "keyScreens": [
      "Extension popup: list of currently open tabs with checkboxes",
      "Name and save a tab group",
      "Saved groups list with tab counts",
      "Group detail view with restore-all button"
    ],
    "constraints": [
      "Entire experience must fit inside a single popup window (max 400x600px)",
      "No onboarding tour, must be self-explanatory in one glance",
      "Use system default fonts only",
      "Keep the flow to 4 screens or fewer"
    ],
    "deliverables": [
      "Low-fidelity wireframes for the popup states",
      "One polished high-fidelity screen (saved groups list)",
      "A simple clickable prototype"
    ],
    "skillsPracticed": [
      "Compact layout design",
      "List and checkbox patterns",
      "Empty states",
      "Micro-interactions"
    ],
    "estimatedTime": "3-6 hours"
  },
  {
    "ticketId": "DX-7514",
    "title": "DeskFlow",
    "difficulty": "Beginner",
    "platform": "Desktop app",
    "industry": "Personal productivity",
    "overview": "DeskFlow is a simple daily planner that sits in the system tray and shows a single prioritized task list for today.",
    "problemToSolve": "People use overcomplicated project management tools for a simple personal to-do list and end up not using them at all.",
    "targetUsers": "Freelancers and remote workers who want a lightweight daily planner without team features.",
    "keyScreens": [
      "Empty state: add your first task for today",
      "Today view with a ranked task list",
      "Add/edit task modal",
      "End-of-day summary screen"
    ],
    "constraints": [
      "Keep the flow to 4-5 screens",
      "Design for one primary user type only",
      "Must work well in a small, non-resizable window (600x400px)",
      "Follow basic accessible color contrast"
    ],
    "deliverables": [
      "Low-fidelity wireframes for the core flow",
      "One polished high-fidelity screen",
      "A simple clickable prototype"
    ],
    "skillsPracticed": [
      "Task list design",
      "Modal/dialog patterns",
      "Empty states",
      "Summary screens"
    ],
    "estimatedTime": "4-8 hours"
  },
  {
    "ticketId": "DX-7515",
    "title": "FloristPetal",
    "difficulty": "Beginner",
    "platform": "Responsive website",
    "industry": "Local business/florist",
    "overview": "FloristPetal is a marketing and ordering site for a single independent flower shop, letting customers browse bouquets and place a pickup order.",
    "problemToSolve": "The shop currently only takes orders by phone, causing missed calls and lost sales during busy hours.",
    "targetUsers": "Local customers ordering flowers for pickup, mostly browsing on their phone during a work break.",
    "keyScreens": [
      "Home page with featured bouquets",
      "Bouquet detail page with size options",
      "Simple cart and pickup time picker",
      "Order confirmation page"
    ],
    "constraints": [
      "Keep the flow to 4-5 screens",
      "Design for one primary user type only",
      "Must be fully usable on mobile, tablet, and desktop breakpoints",
      "Follow basic accessible color contrast"
    ],
    "deliverables": [
      "Low-fidelity wireframes for mobile and desktop breakpoints",
      "One polished high-fidelity screen",
      "A simple clickable prototype"
    ],
    "skillsPracticed": [
      "Responsive layout design",
      "Product browsing patterns",
      "Simple checkout flows",
      "Confirmation states"
    ],
    "estimatedTime": "5-8 hours"
  },
  {
    "ticketId": "DX-7516",
    "title": "PillPing",
    "difficulty": "Beginner",
    "platform": "Smartwatch app",
    "industry": "Health & wellness",
    "overview": "PillPing sends a gentle reminder to a smartwatch when it's time to take a daily medication and lets the wearer confirm with a tap.",
    "problemToSolve": "People miss doses because their phone is in another room or on silent when the reminder fires.",
    "targetUsers": "Older adults managing one or two daily medications who already wear a smartwatch.",
    "keyScreens": [
      "Watch face complication showing next dose time",
      "Reminder notification screen",
      "Confirm taken / snooze screen",
      "Simple daily history view"
    ],
    "constraints": [
      "Keep the flow to 4 screens or fewer",
      "Design for one primary user type only",
      "All text must be readable at arm's length on a small round or square face",
      "Every action must be reachable with a single tap"
    ],
    "deliverables": [
      "Low-fidelity wireframes for the core flow",
      "One polished high-fidelity screen",
      "A simple clickable prototype"
    ],
    "skillsPracticed": [
      "Glanceable UI design",
      "Notification design",
      "Large touch-target design",
      "Minimal-input interactions"
    ],
    "estimatedTime": "3-6 hours"
  },
  {
    "ticketId": "DX-7517",
    "title": "SketchPad",
    "difficulty": "Beginner",
    "platform": "Tablet app",
    "industry": "Kids education",
    "overview": "SketchPad is a simple drawing app for young children with a big color palette and one-tap sharing to a parent's device.",
    "problemToSolve": "Existing drawing apps are cluttered with tools that confuse young children and require reading skills they don't have yet.",
    "targetUsers": "Children ages 4-7 using a family tablet, with a parent nearby for setup.",
    "keyScreens": [
      "Blank canvas with a large color palette",
      "Brush size picker (icon-based, no text)",
      "Save/share drawing screen",
      "Gallery of past drawings"
    ],
    "constraints": [
      "Keep the flow to 4 screens or fewer",
      "Design for one primary user type only",
      "Use icons instead of text wherever possible",
      "Touch targets must be large enough for small fingers"
    ],
    "deliverables": [
      "Low-fidelity wireframes for the core flow",
      "One polished high-fidelity screen",
      "A simple clickable prototype"
    ],
    "skillsPracticed": [
      "Icon-first design",
      "Large touch-target design",
      "Playful visual design",
      "Gallery/grid patterns"
    ],
    "estimatedTime": "4-7 hours"
  },
  {
    "ticketId": "DX-7518",
    "title": "AskPantry",
    "difficulty": "Beginner",
    "platform": "Voice or conversational interface",
    "industry": "Food & home",
    "overview": "AskPantry is a voice skill that lets someone ask what they can cook using ingredients they already have on hand.",
    "problemToSolve": "People forget what's in their pantry and either waste food or make an unnecessary grocery run.",
    "targetUsers": "Home cooks with a smart speaker in the kitchen who want quick meal ideas hands-free.",
    "keyScreens": [
      "Voice flow: greeting and prompt to list ingredients",
      "Voice flow: confirming the ingredients heard",
      "Voice flow: offering a recipe suggestion",
      "Companion app screen showing the recipe in text"
    ],
    "constraints": [
      "Keep the flow to 4-5 conversational steps",
      "Design for one primary user type only",
      "Every voice prompt must have a short, unambiguous confirmation",
      "Companion screen must be readable without touching the device"
    ],
    "deliverables": [
      "Low-fidelity conversation flow diagram (script + screens)",
      "One polished high-fidelity companion app screen",
      "A simple clickable prototype of the companion screen"
    ],
    "skillsPracticed": [
      "Voice UX scripting",
      "Conversational error handling",
      "Multimodal design (voice + screen)",
      "Confirmation states"
    ],
    "estimatedTime": "4-7 hours"
  },
  {
    "ticketId": "DX-7519",
    "title": "ShiftSwap",
    "difficulty": "Beginner",
    "platform": "Web app",
    "industry": "Retail/hospitality workforce",
    "overview": "ShiftSwap lets hourly retail employees post a shift they can't work and pick it up from a teammate who can.",
    "problemToSolve": "Employees currently text a group chat to swap shifts, which is chaotic and often goes unnoticed by managers.",
    "targetUsers": "Part-time retail employees checking their schedule from a shared break-room computer or their own laptop.",
    "keyScreens": [
      "My schedule view with an option to post a shift",
      "Post-a-shift form with reason and date",
      "Open shifts board for teammates to claim",
      "Swap confirmation screen"
    ],
    "constraints": [
      "Keep the flow to 4-5 screens",
      "Design for one primary user type only",
      "Follow basic accessible color contrast",
      "Must be usable on shared/public computers, so no saved passwords assumed"
    ],
    "deliverables": [
      "Low-fidelity wireframes for the core flow",
      "One polished high-fidelity screen",
      "A simple clickable prototype"
    ],
    "skillsPracticed": [
      "Form design",
      "Schedule/calendar patterns",
      "List and board layouts",
      "Confirmation states"
    ],
    "estimatedTime": "5-8 hours"
  },
  {
    "ticketId": "DX-7520",
    "title": "FoodShare",
    "difficulty": "Intermediate",
    "platform": "Mobile app (iOS/Android)",
    "industry": "Food waste & community",
    "overview": "FoodShare connects neighbors who have surplus food from their garden, bulk shopping, or events with others nearby who want it before it spoils.",
    "problemToSolve": "Usable surplus food is thrown away because there's no quick, trustworthy way to offer it to nearby neighbors before it goes bad.",
    "targetUsers": "Two connected user types: neighbors offering surplus food, and neighbors browsing for free food nearby, both operating within a trust-based community.",
    "keyScreens": [
      "Onboarding with neighborhood verification",
      "Post a food item with photo, quantity, and expiry window",
      "Map/list browse view with filters (distance, dietary tags, pickup window)",
      "Claim request and in-app chat with the poster",
      "Pickup confirmation and light rating screen"
    ],
    "constraints": [
      "Support two distinct user roles within one app",
      "Include a real-time or near-real-time messaging component",
      "Design for trust and safety cues (verified neighbor badges, ratings)",
      "Handle edge cases: expired listings, no-shows, multiple claimants"
    ],
    "deliverables": [
      "User flow diagrams for both roles",
      "Mid-fidelity wireframes for the full flow",
      "High-fidelity screens for 3 key moments (post, browse, chat)",
      "A clickable prototype covering both roles"
    ],
    "skillsPracticed": [
      "Multi-role app design",
      "Map and filter UI",
      "In-app messaging design",
      "Trust and safety patterns",
      "Edge case handling"
    ],
    "estimatedTime": "10-16 hours"
  },
  {
    "ticketId": "DX-7521",
    "title": "PriceWatch",
    "difficulty": "Intermediate",
    "platform": "Browser extension",
    "industry": "E-commerce/consumer",
    "overview": "PriceWatch tracks the price history of products a shopper is viewing and alerts them when a tracked item drops below their target price.",
    "problemToSolve": "Shoppers don't know if the price they're seeing is actually a good deal, and manually checking price history across sites is tedious.",
    "targetUsers": "Value-conscious online shoppers who compare prices before buying across several e-commerce sites.",
    "keyScreens": [
      "In-page overlay showing price history graph on a product page",
      "Set a target price and alert threshold",
      "Extension popup: dashboard of all tracked items",
      "Alert notification with quick 'go to product' action",
      "Settings screen for notification preferences"
    ],
    "constraints": [
      "Must work as both an injected in-page overlay and a separate popup dashboard",
      "Design must adapt to appearing over many different third-party site layouts",
      "Include a data visualization (price history graph)",
      "Keep notification interruptions minimal and dismissible"
    ],
    "deliverables": [
      "User flow diagram covering overlay + popup interactions",
      "Mid-fidelity wireframes for all screens",
      "High-fidelity screens for the overlay and dashboard",
      "A clickable prototype"
    ],
    "skillsPracticed": [
      "Overlay/injected UI design",
      "Data visualization",
      "Notification system design",
      "Cross-context consistency (overlay vs popup)"
    ],
    "estimatedTime": "10-14 hours"
  }
];