# Task: Build FocusFlow Student Productivity Website

## Plan
- [x] Initialize project configuration and themes
  - [x] Update `index.css` with Light, Dark, and Orange themes
  - [x] Update `tailwind.config.js` with any necessary extensions
- [x] Implement Core State Management
  - [x] Create `FocusContext.tsx` to manage Timer, Notes, Analytics, and Settings
- [x] Implement Layout Components
  - [x] Sidebar for navigation
  - [x] Main content wrapper with responsive design
- [x] Implement Timer System (Pomodoro)
  - [x] Timer display with progress ring
  - [x] Controls (Start, Pause, Reset, Skip)
  - [x] Timer settings modal (Implemented in settings page + simple display in timer page)
  - [x] Sound notifications
- [x] Implement Notes System
  - [x] CRUD operations for notes
  - [x] Tags and search functionality
  - [x] PDF/TXT export
- [x] Implement Planner (Task Manager)
  - [x] Simple task list with completion status
- [x] Implement Focus Mode
  - [x] Minimal UI with Timer and Notes only (Added ambient sounds and quotes)
  - [x] Ambient sound player
  - [x] Motivational quotes
- [x] Implement Study Analytics
  - [x] Progress tracking (daily/weekly)
  - [x] Weekly bar chart using shadcn/ui chart
- [x] Implement Goals & Streaks
  - [x] Daily goal setting
  - [x] Streak counter logic
  - [x] Achievement badges
- [x] Settings & Polish
  - [x] Theme switcher
  - [x] Sound/Volume controls
  - [x] Keyboard shortcuts
  - [x] Responsive adjustments and final linting

## Notes
- Use LocalStorage for all persistence as per requirements.
- Primary color: Soft faint orange (HSL: 25 95% 65% approximately).
- Background: Cream (HSL: 30 50% 98% for light/orange mode).
