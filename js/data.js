const PROJECT_BRIEFS = [
  {
    "ticketId": "DX-0000",
    "referenceImagePath": "img/DX-0000/",
    "title": "CartPause",
    "difficulty": "Beginner",
    "platform": "Browser extension",
    "industry": "Personal finance",
    "overview": "CartPause adds a gentle cooling-off timer to online shopping carts so users can reconsider impulse purchases before checking out.",
    "problemToSolve": "Shoppers regret unplanned purchases but have no friction at checkout to stop and think.",
    "targetUsers": "Young professionals trying to save money who frequently shop online on their laptops.",
    "keyScreens": [
      "Extension popup: set your cooling-off period and monthly spending goal",
      "In-page cart overlay with a countdown and item total",
      "Saved-for-later list with remaining wait times",
      "Weekly savings summary"
    ],
    "constraints": [
      "Keep the flow to 4 screens",
      "Popup must fit within 400x600px",
      "Overlay must not block the checkout button permanently",
      "Follow basic accessible color contrast"
    ],
    "deliverables": [
      "Low-fidelity wireframes for the popup and overlay",
      "One polished high-fidelity popup screen",
      "A simple clickable prototype"
    ],
    "skillsPracticed": [
      "Extension popup design",
      "Overlay patterns",
      "Nudge and friction design",
      "Progress feedback"
    ],
    "estimatedTime": "4-8 hours"
  },
  {
    "ticketId": "DX-0001",
    "referenceImagePath": "img/DX-0001/",
    "title": "AltLens",
    "difficulty": "Intermediate",
    "platform": "Browser extension",
    "industry": "Digital accessibility",
    "overview": "AltLens scans a web page in a CMS editor, flags images with missing or weak alt text, and suggests better descriptions.",
    "problemToSolve": "Content teams publish images without useful alt text because checking each one is slow and easy to forget.",
    "targetUsers": "Content editors at small media and marketing teams who are not accessibility experts.",
    "keyScreens": [
      "Side panel with page scan results and an accessibility score",
      "Image-by-image review with highlight on the page",
      "Alt text editor with suggestion and character guidance",
      "Decorative image marking flow",
      "Scan history and export summary"
    ],
    "constraints": [
      "Keep the flow to 6-7 screens",
      "Design for a narrow side panel (360px wide)",
      "Never rely on color alone to show issue severity",
      "Support keyboard-only navigation"
    ],
    "deliverables": [
      "User flow and low-fidelity wireframes",
      "Two polished high-fidelity screens including the side panel states",
      "A clickable prototype of scan-to-fix"
    ],
    "skillsPracticed": [
      "Side panel layouts",
      "Issue triage patterns",
      "Inline editing",
      "Accessible status indicators"
    ],
    "estimatedTime": "8-14 hours"
  },
  {
    "ticketId": "DX-0002",
    "referenceImagePath": "img/DX-0002/",
    "title": "ClauseSpot",
    "difficulty": "Advanced",
    "platform": "Browser extension",
    "industry": "Legal tech",
    "overview": "ClauseSpot reads rental agreements and terms of service in the browser and highlights risky clauses with plain-language explanations.",
    "problemToSolve": "Renters sign long agreements without understanding hidden fees, auto-renewals, or liability clauses.",
    "targetUsers": "First-time renters reviewing digital lease agreements, who have no legal background.",
    "keyScreens": [
      "First-run setup with the document types to monitor and a privacy explanation",
      "Document summary with risk breakdown by category",
      "Clause detail drawer with plain-language explanation and alternatives",
      "Compare-with-standard-terms view",
      "Question-to-landlord draft generator",
      "Saved reviews dashboard",
      "Uncertainty and low-confidence states",
      "Privacy and data controls"
    ],
    "constraints": [
      "Keep the flow to 8-10 screens",
      "Clearly communicate that this is not legal advice",
      "Design trust and confidence indicators for AI-generated analysis",
      "Handle very long documents without overwhelming the user"
    ],
    "deliverables": [
      "Research summary and information architecture",
      "Mid-fidelity wireframes for the full flow",
      "Three polished high-fidelity screens including an error or low-confidence state",
      "A clickable prototype with in-page highlighting"
    ],
    "skillsPracticed": [
      "Trust in AI design",
      "Content hierarchy for dense text",
      "Risk communication",
      "Progressive disclosure"
    ],
    "estimatedTime": "16-28 hours"
  },
  {
    "ticketId": "DX-0003",
    "referenceImagePath": "img/DX-0003/",
    "title": "PlateBoard",
    "difficulty": "Beginner",
    "platform": "Desktop app",
    "industry": "Food & nutrition",
    "overview": "PlateBoard is a drag-and-drop weekly meal planner that builds a grocery list from the meals a home cook picks.",
    "problemToSolve": "Home cooks waste food and time because they plan meals in scattered notes and shop without a clear list.",
    "targetUsers": "Busy home cooks planning dinners for a family on a laptop or desktop.",
    "keyScreens": [
      "Weekly calendar board with empty meal slots",
      "Recipe library panel with search and filters",
      "Auto-generated grocery list grouped by store aisle",
      "Print or share view"
    ],
    "constraints": [
      "Keep the flow to 4 screens",
      "Design for a 1440x900 window",
      "Support drag-and-drop with a non-drag alternative",
      "Follow basic accessible color contrast"
    ],
    "deliverables": [
      "Low-fidelity wireframes for the planner and list",
      "One polished high-fidelity planner screen",
      "A simple clickable prototype"
    ],
    "skillsPracticed": [
      "Drag-and-drop interactions",
      "Calendar layouts",
      "Desktop window layouts",
      "List grouping"
    ],
    "estimatedTime": "4-8 hours"
  },
  {
    "ticketId": "DX-0004",
    "referenceImagePath": "img/DX-0004/",
    "title": "PawDesk",
    "difficulty": "Intermediate",
    "platform": "Desktop app",
    "industry": "Veterinary care",
    "overview": "PawDesk is a front-desk app for small vet clinics to manage check-ins, waiting rooms, and appointment handoffs.",
    "problemToSolve": "Reception staff juggle phones, walk-ins, and paper notes, causing long waits and missed details about each pet.",
    "targetUsers": "Front-desk receptionists at independent veterinary clinics.",
    "keyScreens": [
      "Live waiting room board with status per patient",
      "Quick check-in form with pet and owner lookup",
      "Appointment calendar with room and vet assignment",
      "Patient quick-view with allergies and alerts",
      "Handoff notes to the vet",
      "End-of-day summary"
    ],
    "constraints": [
      "Keep the flow to 6-7 screens",
      "Optimize for fast keyboard-driven data entry",
      "Design for interruptions, since the receptionist is constantly pulled away",
      "Status must be readable from a few feet away"
    ],
    "deliverables": [
      "User flow and low-fidelity wireframes",
      "Two polished high-fidelity screens, including the waiting room board",
      "A clickable prototype of check-in to handoff"
    ],
    "skillsPracticed": [
      "Real-time status boards",
      "Keyboard shortcuts",
      "Data-dense layouts",
      "Interruption-friendly design"
    ],
    "estimatedTime": "8-14 hours"
  },
  {
    "ticketId": "DX-0005",
    "referenceImagePath": "img/DX-0005/",
    "title": "GridWatch",
    "difficulty": "Advanced",
    "platform": "Desktop app",
    "industry": "Energy utilities",
    "overview": "GridWatch is a control-room application that lets utility operators monitor outages, prioritize repairs, and coordinate field crews during storms.",
    "problemToSolve": "Operators switch between maps, spreadsheets, and radio logs, which slows down response when many outages happen at once.",
    "targetUsers": "Control-room operators at regional electricity utilities working long shifts on multi-monitor setups.",
    "keyScreens": [
      "Live outage map with severity clusters",
      "Outage detail panel with affected customers and estimated restoration",
      "Crew assignment and dispatch view",
      "Incident timeline and shift handover log",
      "Alert rules and thresholds settings",
      "Storm mode with prioritized critical facilities",
      "Customer communication draft tool",
      "Post-event report view"
    ],
    "constraints": [
      "Keep the flow to 8-10 screens",
      "Design for dark environments and long shifts to reduce eye fatigue",
      "Critical alerts must be unmistakable without causing alarm fatigue",
      "Support multi-monitor layouts"
    ],
    "deliverables": [
      "Research summary and operator task analysis",
      "Mid-fidelity wireframes for the full flow",
      "Three polished high-fidelity screens including storm mode",
      "A clickable prototype of outage to dispatch"
    ],
    "skillsPracticed": [
      "Mission-critical dashboards",
      "Alert hierarchy",
      "Map-based interfaces",
      "Dark-mode design systems"
    ],
    "estimatedTime": "18-30 hours"
  }
];