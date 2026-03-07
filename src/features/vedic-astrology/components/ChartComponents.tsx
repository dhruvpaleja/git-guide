/**
 * Vedic Astrology Chart Components
 * North Indian (Diamond) and South Indian (Rectangular) style charts
 */

import React from 'react';
import { ZODIAC_SIGNS } from '../utils/astronomy';

// ============================================================================
// Type Definitions
// ============================================================================

export interface PlanetData {
  name: string;
  longitude: number;
  sign: number;
  degreeInSign: number;
  house: number;
  isRetrograde?: boolean;
}

export interface ChartData {
  ascendant: number;
  ascendantSign: number;
  planets: PlanetData[];
}

// ============================================================================
// Constants
// ============================================================================

const PLANET_COLORS: Record<string, string> = {
  Sun: '#FFD700',
  Moon: '#C0C0C0',
  Mars: '#FF6B6B',
  Mercury: '#90EE90',
  Jupiter: '#FFA500',
  Venus: '#FF69B4',
  Saturn: '#4169E1',
  Rahu: '#8B4513',
  Ketu: '#8B4513',
};

const PLANET_SYMBOLS: Record<string, string> = {
  Sun: 'Su',
  Moon: 'Mo',
  Mars: 'Ma',
  Mercury: 'Me',
  Jupiter: 'Ju',
  Venus: 'Ve',
  Saturn: 'Sa',
  Rahu: 'Ra',
  Ketu: 'Ke',
};

// ============================================================================
// South Indian Chart Component
// Fixed sign positions, houses rotate based on lagna
// ============================================================================

interface SouthIndianChartProps {
  data: ChartData;
  size?: number;
  showHouseNumbers?: boolean;
  highlightLagna?: boolean;
}

export const SouthIndianChart: React.FC<SouthIndianChartProps> = ({
  data,
  size = 500,
  showHouseNumbers = true,
  highlightLagna = true,
}) => {
  const cellSize = size / 4;
  const { ascendantSign, planets } = data;

  // Fixed sign positions in South Indian chart
  // Row 0: Pisces, Aries, Taurus, Gemini
  // Row 1: Aquarius, [empty], [empty], Cancer
  // Row 2: Capricorn, [empty], [empty], Leo
  // Row 3: Sagittarius, Scorpio, Libra, Virgo
  const signPositions = [
    { sign: 11, row: 0, col: 0 }, // Pisces
    { sign: 0, row: 0, col: 1 },  // Aries
    { sign: 1, row: 0, col: 2 },  // Taurus
    { sign: 2, row: 0, col: 3 },  // Gemini
    { sign: 10, row: 1, col: 0 }, // Aquarius
    { sign: 3, row: 1, col: 3 },  // Cancer
    { sign: 9, row: 2, col: 0 },  // Capricorn
    { sign: 4, row: 2, col: 3 },  // Leo
    { sign: 8, row: 3, col: 0 },  // Sagittarius
    { sign: 7, row: 3, col: 1 },  // Scorpio
    { sign: 6, row: 3, col: 2 },  // Libra
    { sign: 5, row: 3, col: 3 },  // Virgo
  ];

  // Calculate house number for each sign
  const getHouseForSign = (signIndex: number): number => {
    return ((signIndex - ascendantSign + 12) % 12) + 1;
  };

  // Get planets in a sign
  const getPlanetsInSign = (signIndex: number): PlanetData[] => {
    return planets.filter((p) => p.sign === signIndex);
  };

  // Check if this is the lagna sign
  const isLagnaSign = (signIndex: number): boolean => {
    return signIndex === ascendantSign;
  };

  return (
    <div className="inline-block">
      <svg width={size} height={size} className="vedic-chart-svg">
        {/* Define gradients and patterns */}
        <defs>
          <pattern id="diagonalLines" patternUnits="userSpaceOnUse" width="10" height="10">
            <line x1="0" y1="0" x2="10" y2="10" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
          </pattern>
          <linearGradient id="lagnaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 215, 0, 0.2)" />
            <stop offset="100%" stopColor="rgba(255, 165, 0, 0.1)" />
          </linearGradient>
        </defs>

        {/* Outer border */}
        <rect x="0" y="0" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" />

        {/* Grid lines - create the 4x4 grid with empty center */}
        {/* Horizontal lines */}
        <line x1="0" y1={cellSize} x2={size} y2={cellSize} stroke="currentColor" strokeWidth="1.5" />
        <line x1="0" y1={cellSize * 2} x2={cellSize} y2={cellSize * 2} stroke="currentColor" strokeWidth="1.5" />
        <line x1={cellSize * 3} y1={cellSize * 2} x2={size} y2={cellSize * 2} stroke="currentColor" strokeWidth="1.5" />
        <line x1="0" y1={cellSize * 3} x2={size} y2={cellSize * 3} stroke="currentColor" strokeWidth="1.5" />

        {/* Vertical lines */}
        <line x1={cellSize} y1="0" x2={cellSize} y2={size} stroke="currentColor" strokeWidth="1.5" />
        <line x1={cellSize * 2} y1="0" x2={cellSize * 2} y2={cellSize} stroke="currentColor" strokeWidth="1.5" />
        <line x1={cellSize * 2} y1={cellSize * 3} x2={cellSize * 2} y2={size} stroke="currentColor" strokeWidth="1.5" />
        <line x1={cellSize * 3} y1="0" x2={cellSize * 3} y2={size} stroke="currentColor" strokeWidth="1.5" />

        {/* Diagonal lines in corner cells */}
        {/* Top-left corner (Pisces) */}
        <line x1={cellSize} y1="0" x2="0" y2={cellSize} stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
        {/* Top-right corner (Gemini) */}
        <line x1={cellSize * 2} y1="0" x2={size} y2={cellSize} stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
        {/* Bottom-right corner (Virgo) */}
        <line x1={cellSize * 3} y2={size} x2={size} y1={cellSize * 3} stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
        {/* Bottom-left corner (Sagittarius) */}
        <line x1={cellSize} y2={size} x2="0" y1={cellSize * 3} stroke="currentColor" strokeWidth="0.5" opacity="0.5" />

        {/* Render each sign cell */}
        {signPositions.map(({ sign, row, col }) => {
          const x = col * cellSize;
          const y = row * cellSize;
          const houseNum = getHouseForSign(sign);
          const isLagna = isLagnaSign(sign);
          const signPlanets = getPlanetsInSign(sign);
          const signData = ZODIAC_SIGNS[sign];

          return (
            <g key={`sign-${sign}`}>
              {/* Cell background */}
              {isLagna && highlightLagna && (
                <rect x={x} y={y} width={cellSize} height={cellSize} fill="url(#lagnaGradient)" />
              )}

              {/* House number */}
              {showHouseNumbers && (
                <text
                  x={x + cellSize / 2}
                  y={y + cellSize * 0.15}
                  textAnchor="middle"
                  className="text-xs font-semibold opacity-60"
                  fontSize="12"
                >
                  {houseNum}
                </text>
              )}

              {/* Sign symbol and name */}
              <text
                x={x + cellSize / 2}
                y={y + cellSize * 0.35}
                textAnchor="middle"
                className="font-bold"
                fontSize="16"
              >
                {signData.symbol}
              </text>
              <text
                x={x + cellSize / 2}
                y={y + cellSize * 0.5}
                textAnchor="middle"
                className="text-xs opacity-80"
                fontSize="10"
              >
                {signData.short}
              </text>

              {/* Lagna indicator */}
              {isLagna && (
                <text
                  x={x + cellSize / 2}
                  y={y + cellSize * 0.65}
                  textAnchor="middle"
                  className="font-bold text-amber-500"
                  fontSize="11"
                  fill="#F59E0B"
                >
                  Lagna
                </text>
              )}

              {/* Planets in this sign */}
              {signPlanets.map((planet, idx) => {
                const planetY = isLagna ? y + cellSize * 0.78 + idx * 18 : y + cellSize * 0.65 + idx * 18;
                return (
                  <text
                    key={planet.name}
                    x={x + cellSize / 2}
                    y={planetY}
                    textAnchor="middle"
                    fontSize="13"
                    fontWeight="600"
                    fill={PLANET_COLORS[planet.name]}
                  >
                    {PLANET_SYMBOLS[planet.name]}
                    {planet.isRetrograde && '°'}
                  </text>
                );
              })}
            </g>
          );
        })}

        {/* Center area - Birth info placeholder */}
        <rect
          x={cellSize}
          y={cellSize}
          width={cellSize * 2}
          height={cellSize * 2}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.3"
        />
        <text
          x={size / 2}
          y={size / 2 - 10}
          textAnchor="middle"
          className="text-xs opacity-50"
          fontSize="11"
        >
          Birth Chart
        </text>
        <text
          x={size / 2}
          y={size / 2 + 10}
          textAnchor="middle"
          className="text-xs opacity-50"
          fontSize="11"
        >
          (D1)
        </text>
      </svg>
    </div>
  );
};

// ============================================================================
// North Indian Chart Component
// Diamond style with houses in fixed positions, signs rotate
// ============================================================================

interface NorthIndianChartProps {
  data: ChartData;
  size?: number;
  showSigns?: boolean;
  highlightLagna?: boolean;
}

export const NorthIndianChart: React.FC<NorthIndianChartProps> = ({
  data,
  size = 500,
  showSigns = true,
  highlightLagna = true,
}) => {
  const { ascendantSign, planets } = data;
  const halfSize = size / 2;
  const quarterSize = size / 4;

  // Key points for the diamond chart
  const points = {
    top: { x: halfSize, y: 0 },
    bottom: { x: halfSize, y: size },
    left: { x: 0, y: halfSize },
    right: { x: size, y: halfSize },
    center: { x: halfSize, y: halfSize },
    // Inner diamond points (midpoints)
    topMid: { x: halfSize, y: quarterSize },
    bottomMid: { x: halfSize, y: quarterSize * 3 },
    leftMid: { x: quarterSize, y: halfSize },
    rightMid: { x: quarterSize * 3, y: halfSize },
  };

  // House positions in North Indian chart (going clockwise from top)
  // House 1 is always at the top (Lagna)
  const housePolygons: { house: number; points: { x: number; y: number }[] }[] = [
    // House 1 (Lagna) - Top center diamond
    { house: 1, points: [points.topMid, points.center, points.leftMid, points.top] },
    // House 2 - Top right triangle
    { house: 2, points: [points.top, points.rightMid, points.center, points.topMid] },
    // House 3 - Right upper trapezoid
    { house: 3, points: [points.rightMid, points.right, { x: quarterSize * 3, y: quarterSize * 3 }, points.center] },
    // House 4 - Right center diamond
    { house: 4, points: [points.center, { x: quarterSize * 3, y: quarterSize * 3 }, points.rightMid, points.bottomMid] },
    // House 5 - Bottom right triangle
    { house: 5, points: [points.bottomMid, points.rightMid, { x: quarterSize * 3, y: quarterSize * 3 }, points.bottom] },
    // House 6 - Bottom right corner
    { house: 6, points: [points.bottom, { x: quarterSize * 3, y: quarterSize * 3 }, points.bottomMid] },
    // House 7 - Bottom center diamond
    { house: 7, points: [points.bottomMid, points.center, points.bottom, points.rightMid] },
    // House 8 - Bottom left triangle
    { house: 8, points: [points.bottomMid, points.leftMid, points.center, points.bottom] },
    // House 9 - Bottom left corner
    { house: 9, points: [points.bottom, points.leftMid, { x: quarterSize, y: quarterSize * 3 }, points.bottomMid] },
    // House 10 - Left center diamond
    { house: 10, points: [points.leftMid, points.left, { x: quarterSize, y: quarterSize * 3 }, points.center] },
    // House 11 - Left upper trapezoid
    { house: 11, points: [points.leftMid, points.top, points.center, { x: quarterSize, y: quarterSize * 3 }] },
    // House 12 - Top left triangle
    { house: 12, points: [points.top, points.leftMid, points.center, points.topMid] },
  ];

  // Calculate which sign is in each house
  const getSignInHouse = (houseNum: number): number => {
    return (ascendantSign + houseNum - 1) % 12;
  };

  // Get planets in a house
  const getPlanetsInHouse = (houseNum: number): PlanetData[] => {
    return planets.filter((p) => p.house === houseNum);
  };

  // Calculate polygon centroid for text placement
  const getCentroid = (polygonPoints: { x: number; y: number }[]): { x: number; y: number } => {
    const x = polygonPoints.reduce((sum, p) => sum + p.x, 0) / polygonPoints.length;
    const y = polygonPoints.reduce((sum, p) => sum + p.y, 0) / polygonPoints.length;
    return { x, y };
  };

  return (
    <div className="inline-block">
      <svg width={size} height={size} className="vedic-chart-svg">
        <defs>
          <linearGradient id="lagnaGradientNI" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 215, 0, 0.25)" />
            <stop offset="100%" stopColor="rgba(255, 165, 0, 0.15)" />
          </linearGradient>
        </defs>

        {/* Outer border */}
        <rect x="0" y="0" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" />

        {/* Draw the main diamond (connecting midpoints) */}
        <polygon
          points={`${points.top.x},${points.top.y} ${points.right.x},${points.right.y} ${points.bottom.x},${points.bottom.y} ${points.left.x},${points.left.y}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />

        {/* Draw diagonals */}
        <line x1="0" y1="0" x2={size} y2={size} stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
        <line x1={size} y1="0" x2="0" y2={size} stroke="currentColor" strokeWidth="0.5" opacity="0.5" />

        {/* Draw lines from corners to center */}
        <line x1="0" y1="0" x2={halfSize} y2={halfSize} stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
        <line x1={size} y1="0" x2={halfSize} y2={halfSize} stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
        <line x1={size} y1={size} x2={halfSize} y2={halfSize} stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
        <line x1="0" y1={size} x2={halfSize} y2={halfSize} stroke="currentColor" strokeWidth="0.5" opacity="0.3" />

        {/* Render each house */}
        {housePolygons.map(({ house, points: housePoints }) => {
          const signIndex = getSignInHouse(house);
          const signData = ZODIAC_SIGNS[signIndex];
          const housePlanets = getPlanetsInHouse(house);
          const centroid = getCentroid(housePoints);
          const isLagna = house === 1;

          return (
            <g key={`house-${house}`}>
              {/* House background */}
              {isLagna && highlightLagna && (
                <polygon
                  points={housePoints.map((p) => `${p.x},${p.y}`).join(' ')}
                  fill="url(#lagnaGradientNI)"
                />
              )}

              {/* House number */}
              <text
                x={centroid.x}
                y={centroid.y - 15}
                textAnchor="middle"
                className="text-xs font-semibold opacity-60"
                fontSize="11"
              >
                H{house}
              </text>

              {/* Sign symbol */}
              {showSigns && (
                <>
                  <text
                    x={centroid.x}
                    y={centroid.y + 5}
                    textAnchor="middle"
                    className="font-bold"
                    fontSize="18"
                  >
                    {signData.symbol}
                  </text>
                  <text
                    x={centroid.x}
                    y={centroid.y + 22}
                    textAnchor="middle"
                    className="text-xs opacity-80"
                    fontSize="10"
                  >
                    {signData.short}
                  </text>
                </>
              )}

              {/* Lagna indicator */}
              {isLagna && (
                <text
                  x={centroid.x}
                  y={centroid.y + 40}
                  textAnchor="middle"
                  className="font-bold text-amber-500"
                  fontSize="10"
                  fill="#F59E0B"
                >
                  Lagna
                </text>
              )}

              {/* Planets in this house */}
              {housePlanets.map((planet, idx) => {
                const planetY = isLagna ? centroid.y + 55 + idx * 16 : centroid.y + 38 + idx * 16;
                return (
                  <text
                    key={planet.name}
                    x={centroid.x}
                    y={planetY}
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight="600"
                    fill={PLANET_COLORS[planet.name]}
                  >
                    {PLANET_SYMBOLS[planet.name]}
                    {planet.isRetrograde && '°'}
                  </text>
                );
              })}
            </g>
          );
        })}

        {/* Center area label */}
        <text
          x={halfSize}
          y={halfSize - 10}
          textAnchor="middle"
          className="text-xs opacity-50"
          fontSize="11"
        >
          North Indian
        </text>
        <text
          x={halfSize}
          y={halfSize + 10}
          textAnchor="middle"
          className="text-xs opacity-50"
          fontSize="11"
        >
          Kundali
        </text>
      </svg>
    </div>
  );
};

// ============================================================================
// Chart Selector Component
// ============================================================================

interface ChartSelectorProps {
  data: ChartData;
  chartStyle: 'north' | 'south';
  onStyleChange: (style: 'north' | 'south') => void;
  size?: number;
  divisional?: number;
}

export const ChartSelector: React.FC<ChartSelectorProps> = ({
  data,
  chartStyle,
  onStyleChange,
  size = 500,
  divisional = 1,
}) => {
  const divisionalNames: Record<number, string> = {
    1: 'Rasi (D1)',
    2: 'Hora (D2)',
    3: 'Drekkana (D3)',
    4: 'Chaturthamsa (D4)',
    7: 'Saptamsa (D7)',
    9: 'Navamsa (D9)',
    10: 'Dasamsa (D10)',
    12: 'Dwadasamsa (D12)',
  };

  return (
    <div className="vedic-chart-container">
      <div className="chart-controls flex items-center justify-between mb-4 gap-4">
        <div className="chart-type-selector flex items-center gap-2">
          <span className="text-sm font-medium opacity-70">Chart Style:</span>
          <button
            onClick={() => onStyleChange('north')}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
              chartStyle === 'north'
                ? 'bg-amber-600 text-white'
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            North Indian
          </button>
          <button
            onClick={() => onStyleChange('south')}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
              chartStyle === 'south'
                ? 'bg-amber-600 text-white'
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            South Indian
          </button>
        </div>
        <div className="chart-label text-sm font-medium opacity-70">
          {divisional === 1 ? 'Birth Chart' : divisionalNames[divisional] || `D${divisional}`}
        </div>
      </div>

      <div className="chart-display flex justify-center">
        {chartStyle === 'north' ? (
          <NorthIndianChart data={data} size={size} />
        ) : (
          <SouthIndianChart data={data} size={size} />
        )}
      </div>

      {/* Planet Legend */}
      <div className="planet-legend mt-4 flex flex-wrap justify-center gap-3 text-xs">
        {Object.entries(PLANET_SYMBOLS).map(([name, symbol]) => (
          <div key={name} className="flex items-center gap-1.5">
            <span className="font-bold" style={{ color: PLANET_COLORS[name] }}>
              {symbol}
            </span>
            <span className="opacity-70">{name}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5 ml-4">
          <span className="font-bold">°</span>
          <span className="opacity-70">Retrograde</span>
        </div>
      </div>
    </div>
  );
};

export default ChartSelector;
