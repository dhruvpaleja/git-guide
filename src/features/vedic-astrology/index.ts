/**
 * Vedic Astrology Module Exports
 * Parashara Light Style Vedic Astrology Software
 */

// Components
export { ChartSelector, NorthIndianChart, SouthIndianChart } from './components/ChartComponents';
export type { ChartData, PlanetData } from './components/ChartComponents';

// Pages
export { default as VedicAstrologyPage } from './pages/VedicAstrologyPage';

// Utilities
export * from './utils/astronomy';

// Styles
import './styles/vedic-astrology.css';
