// Public API for dashboard feature

export { default as PersonalizationPage } from './pages/PersonalizationPage';

// Layout primitives
export { default as DashboardSidebar } from './components/layout/DashboardSidebar';
export { default as DashboardTopbar } from './components/layout/DashboardTopbar';

// Practitioner surfaces
export { PractitionerSidebar } from './components/PractitionerSidebar';
export { PractitionerHeader } from './components/PractitionerHeader';
export { MetricCard } from './components/MetricCard';
export { ScheduledSessionsWidget } from './components/ScheduledSessionsWidget';
export { PendingApprovalsWidget } from './components/PendingApprovalsWidget';
export { ClientIntakeWidget } from './components/ClientIntakeWidget';
export { WeeklySessionsWidget, CompletedSessionsWidget } from './components/SessionsRecordsWidgets';
export { QuickLinksWidget } from './components/QuickLinksWidget';

// Dashboard widgets
export { default as SoulConstellationMap } from './components/widgets/SoulConstellationMap';
export { default as TheConfessional } from './components/widgets/TheConfessional';
export { default as PatternAlerts } from './components/widgets/PatternAlerts';
export { default as HumanMatchCard } from './components/widgets/HumanMatchCard';
