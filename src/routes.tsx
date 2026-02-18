import { lazy } from 'react';

export interface RouteConfig {
  path: string;
  element: React.ReactNode;
  label?: string;
  icon?: string;
}

const TimerPage = lazy(() => import('./pages/TimerPage'));
const NotesPage = lazy(() => import('./pages/NotesPage'));
const FocusPage = lazy(() => import('./pages/FocusPage'));
const PlannerPage = lazy(() => import('./pages/PlannerPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const NotFound = lazy(() => import('./pages/NotFound'));

export const routes: RouteConfig[] = [
  {
    path: '/',
    element: <TimerPage />,
    label: 'Timer',
    icon: 'Timer',
  },
  {
    path: '/notes',
    element: <NotesPage />,
    label: 'Notes',
    icon: 'BookOpen',
  },
  {
    path: '/focus',
    element: <FocusPage />,
    label: 'Focus Mode',
    icon: 'Maximize',
  },
  {
    path: '/planner',
    element: <PlannerPage />,
    label: 'Planner',
    icon: 'Calendar',
  },
  {
    path: '/analytics',
    element: <AnalyticsPage />,
    label: 'Analytics',
    icon: 'BarChart',
  },
  {
    path: '/settings',
    element: <SettingsPage />,
    label: 'Settings',
    icon: 'Settings',
  },
  {
    path: '*',
    element: <NotFound />,
  },
];
