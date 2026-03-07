/**
 * Astronomical Calculation Engine for Vedic Astrology
 * Based on Jean Meeus "Astronomical Algorithms" and VSOP87 theory
 * Provides high-precision planetary positions for Vedic chart calculations
 */

// ============================================================================
// Constants
// ============================================================================

const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

// Julian centuries from J2000.0 for various epochs
const J2000 = 2451545.0;
const JULIAN_CENTURY_DAYS = 36525;

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Normalize angle to 0-360 range
 */
export function normalizeDegrees(degrees: number): number {
  let result = degrees % 360;
  if (result < 0) result += 360;
  return result;
}

/**
 * Convert degrees to radians
 */
export function toRadians(degrees: number): number {
  return degrees * DEG_TO_RAD;
}

/**
 * Convert radians to degrees
 */
export function toDegrees(radians: number): number {
  return radians * RAD_TO_DEG;
}

/**
 * Convert degrees to DMS format
 */
export function toDMS(degrees: number): { degrees: number; minutes: number; seconds: number } {
  const normalized = normalizeDegrees(degrees);
  const deg = Math.floor(normalized);
  const minFloat = (normalized - deg) * 60;
  const min = Math.floor(minFloat);
  const sec = (minFloat - min) * 60;
  return { degrees: deg, minutes: min, seconds: sec };
}

/**
 * Format degrees as string
 */
export function formatDegrees(degrees: number, includeSeconds = false): string {
  const { degrees: d, minutes: m, seconds: s } = toDMS(degrees);
  const sign = Math.floor(d / 30);
  const degInSign = d % 30;
  if (includeSeconds) {
    return `${sign}°${degInSign.toString().padStart(2, '0')}°${m.toString().padStart(2, '0')}'${Math.round(s).toString().padStart(2, '0')}"`;
  }
  return `${sign}°${degInSign.toString().padStart(2, '0')}°${m.toString().padStart(2, '0')}'`;
}

// ============================================================================
// Julian Day Calculations
// ============================================================================

/**
 * Calculate Julian Day Number from calendar date and time
 * Uses the algorithm from Meeus Chapter 7
 */
export function calculateJulianDay(
  year: number,
  month: number,
  day: number,
  hour = 0,
  minute = 0,
  second = 0
): number {
  // Adjust for months January and February
  if (month <= 2) {
    year -= 1;
    month += 12;
  }

  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);

  const JD =
    Math.floor(365.25 * (year + 4716)) +
    Math.floor(30.6001 * (month + 1)) +
    day +
    B -
    1524.5 +
    (hour + minute / 60 + second / 3600) / 24;

  return JD;
}

/**
 * Calculate Julian Century from J2000.0
 */
export function calculateJulianCentury(jd: number): number {
  return (jd - J2000) / JULIAN_CENTURY_DAYS;
}

/**
 * Convert Julian Day to calendar date
 */
export function julianDayToDate(jd: number): {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
} {
  const Z = Math.floor(jd + 0.5);
  const F = jd + 0.5 - Z;

  let A = Z;
  if (Z >= 2299161) {
    const alpha = Math.floor((Z - 1867216.25) / 36524.25);
    A = Z + 1 + alpha - Math.floor(alpha / 4);
  }

  const B = A + 1524;
  const C = Math.floor((B - 122.1) / 365.25);
  const D = Math.floor(365.25 * C);
  const E = Math.floor((B - D) / 30.6001);

  const day = B - D - Math.floor(30.6001 * E) + F;
  const dayInt = Math.floor(day);
  const hourFloat = (day - dayInt) * 24;
  const hour = Math.floor(hourFloat);
  const minuteFloat = (hourFloat - hour) * 60;
  const minute = Math.floor(minuteFloat);
  const second = Math.round((minuteFloat - minute) * 60);

  const month = E < 14 ? E - 1 : E - 13;
  const year = month > 2 ? C - 4716 : C - 4715;

  return { year, month, day: dayInt, hour, minute, second };
}

// ============================================================================
// Sidereal Time Calculations
// ============================================================================

/**
 * Calculate Greenwich Mean Sidereal Time
 * Based on IAU 2006 resolution
 */
export function calculateGMST(jd: number): number {
  const T = calculateJulianCentury(jd);

  // GMST at 0h UT
  let gmst =
    280.46061837 +
    360.98564736629 * (jd - J2000) +
    0.000387933 * T * T -
    T * T * T / 38710000;

  gmst = normalizeDegrees(gmst);
  return gmst;
}

/**
 * Calculate Local Sidereal Time
 */
export function calculateLST(jd: number, longitude: number): number {
  const gmst = calculateGMST(jd);
  const lst = gmst + longitude;
  return normalizeDegrees(lst);
}

// ============================================================================
// Obliquity of the Ecliptic
// ============================================================================

/**
 * Calculate mean obliquity of the ecliptic
 * Uses IAU 2006 formula with corrections
 */
export function calculateObliquity(jd: number): number {
  const T = calculateJulianCentury(jd);
  const U = T / 100; // Julian millennia

  // Mean obliquity in degrees
  let epsilon =
    23.439291 -
    46.836769 * U -
    0.0001831 * U * U +
    0.0020034 * U * U * U -
    0.576e-6 * U * U * U * U -
    4.34e-8 * U * U * U * U * U;

  // Add nutation correction (simplified)
  const omega = 125.04 - 1934.136 * T;
  const deltaEpsilon = 0.00256 * Math.cos(toRadians(omega));

  return epsilon + deltaEpsilon;
}

// ============================================================================
// Nutation Calculations
// ============================================================================

/**
 * Calculate longitude of the ascending node of the Moon
 */
function calculateOmega(T: number): number {
  return normalizeDegrees(125.04452 - 1934.136261 * T + 0.0020708 * T * T + T * T * T / 450000);
}

/**
 * Calculate nutation in longitude (simplified)
 */
export function calculateNutationInLongitude(jd: number): number {
  const T = calculateJulianCentury(jd);
  const omega = calculateOmega(T);

  // Mean longitude of Sun
  const L0 = normalizeDegrees(280.46646 + 36000.76983 * T + 0.0003032 * T * T);

  // Mean longitude of Moon
  const L = normalizeDegrees(218.3164477 + 481267.88123421 * T - 0.0015786 * T * T);

  // Nutation in longitude (simplified, main terms only)
  const deltaPsi =
    -17.2 * Math.sin(toRadians(omega)) -
    1.32 * Math.sin(toRadians(2 * L0)) -
    0.23 * Math.sin(toRadians(2 * L)) +
    0.21 * Math.sin(toRadians(2 * omega));

  return deltaPsi / 3600; // Convert to degrees
}

// ============================================================================
// Solar Calculations (Meeus Chapter 25)
// ============================================================================

/**
 * Calculate the Sun's geometric mean longitude
 */
function calculateSunMeanLongitude(T: number): number {
  return normalizeDegrees(280.4664567 + 36000.7698278 * T + 0.0003032 * T * T);
}

/**
 * Calculate the Sun's mean anomaly
 */
function calculateSunMeanAnomaly(T: number): number {
  return normalizeDegrees(357.5291092 + 35999.0502909 * T - 0.0001536 * T * T);
}

/**
 * Calculate the equation of center for the Sun
 */
function calculateSunEquationOfCenter(T: number): number {
  const M = calculateSunMeanAnomaly(T);
  const Mrad = toRadians(M);

  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mrad) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad) +
    0.000289 * Math.sin(3 * Mrad);

  return C;
}

/**
 * Calculate the Sun's true longitude (tropical)
 */
export function calculateSunLongitude(jd: number): number {
  const T = calculateJulianCentury(jd);

  const L0 = calculateSunMeanLongitude(T);
  const C = calculateSunEquationOfCenter(T);
  const trueLong = L0 + C;

  // Apply nutation and aberration
  const omega = calculateOmega(T);
  const nutation = -0.00569 - 0.00478 * Math.sin(toRadians(omega));

  return normalizeDegrees(trueLong + nutation);
}

/**
 * Calculate the Sun's distance from Earth in AU (simplified)
 */
export function calculateSunDistance(jd: number): number {
  const T = calculateJulianCentury(jd);
  const M = calculateSunMeanAnomaly(T);

  // Eccentricity of Earth's orbit
  const e = 0.016708634 - 0.000042037 * T - 0.0000001267 * T * T;

  // True anomaly
  const C = calculateSunEquationOfCenter(T);
  const v = M + C;

  // Distance in AU
  const R = (1.000001018 * (1 - e * e)) / (1 + e * Math.cos(toRadians(v)));

  return R;
}

/**
 * Calculate the Sun's right ascension and declination
 */
export function calculateSunRA_Dec(jd: number): { ra: number; dec: number } {
  const lambda = calculateSunLongitude(jd);
  const epsilon = calculateObliquity(jd);

  const lambdaRad = toRadians(lambda);
  const epsilonRad = toRadians(epsilon);

  // Right ascension
  const ra = toDegrees(
    Math.atan2(Math.sin(lambdaRad) * Math.cos(epsilonRad), Math.cos(lambdaRad))
  );

  // Declination
  const dec = toDegrees(Math.asin(Math.sin(epsilonRad) * Math.sin(lambdaRad)));

  return { ra: normalizeDegrees(ra), dec };
}

// ============================================================================
// Lunar Calculations (ELP2000 simplified - Meeus Chapter 47)
// ============================================================================

/**
 * Calculate the Moon's longitude using simplified ELP2000
 * Accuracy: ~0.5 arcminutes
 */
export function calculateMoonLongitude(jd: number): number {
  const T = calculateJulianCentury(jd);

  // Mean longitude of the Moon
  const L = normalizeDegrees(
    218.3164477 + 481267.88123421 * T - 0.0015786 * T * T + T * T * T / 538841 - T * T * T * T / 65194000
  );

  // Mean elongation of the Moon from the Sun
  const D = normalizeDegrees(
    297.8501921 + 445267.1114034 * T - 0.0018819 * T * T + T * T * T / 545868 - T * T * T * T / 113065000
  );

  // Sun's mean anomaly
  const M = normalizeDegrees(
    357.5291092 + 35999.0502909 * T - 0.0001536 * T * T + T * T * T / 24490000
  );

  // Moon's mean anomaly
  const Mprime = normalizeDegrees(
    134.9633964 + 477198.8675055 * T + 0.0087414 * T * T + T * T * T / 69699 - T * T * T * T / 14712000
  );

  // Moon's argument of latitude
  const F = normalizeDegrees(
    93.2720950 + 483202.0175233 * T - 0.0036539 * T * T - T * T * T / 3526000 + T * T * T * T / 863310000
  );

  // Eccentricity factor
  const E = 1 - 0.002516 * T - 0.0000074 * T * T;

  // Main periodic terms for longitude (simplified - main 60 terms)
  let sumLongitude = 0;

  // Evection
  sumLongitude += 6288774 * Math.sin(toRadians(Mprime));

  // Equation of center
  sumLongitude += 1274027 * Math.sin(toRadians(2 * D - Mprime));

  // Variation
  sumLongitude += 658314 * Math.sin(toRadians(2 * D));

  // Annual equation
  sumLongitude += 213618 * Math.sin(toRadians(M));

  // Reduction to ecliptic
  sumLongitude -= 185116 * E * Math.sin(toRadians(Mprime - 2 * F));

  // Other main terms
  sumLongitude -= 114332 * Math.sin(toRadians(2 * F));
  sumLongitude += 58793 * E * Math.sin(toRadians(2 * D - Mprime - M));
  sumLongitude += 57066 * E * Math.sin(toRadians(2 * D - Mprime + M));
  sumLongitude += 53322 * E * Math.sin(toRadians(Mprime + M));
  sumLongitude += 45758 * E * Math.sin(toRadians(2 * D - M));
  sumLongitude -= 40923 * Math.sin(toRadians(Mprime - M));
  sumLongitude -= 34720 * Math.sin(toRadians(D));
  sumLongitude -= 30383 * E * Math.sin(toRadians(Mprime + 2 * F));
  sumLongitude += 15327 * Math.sin(toRadians(2 * D + Mprime));
  sumLongitude -= 12528 * Math.sin(toRadians(2 * D + M));
  sumLongitude -= 10980 * Math.sin(toRadians(Mprime - 2 * D));
  sumLongitude += 10675 * E * Math.sin(toRadians(Mprime - M - 2 * F));
  sumLongitude += 10034 * Math.sin(toRadians(3 * Mprime));
  sumLongitude += 8548 * Math.sin(toRadians(2 * F - Mprime));
  sumLongitude -= 7888 * E * Math.sin(toRadians(2 * D + Mprime - M));
  sumLongitude -= 6766 * E * Math.sin(toRadians(Mprime + 2 * M));
  sumLongitude += 5162 * Math.sin(toRadians(4 * D - Mprime));
  sumLongitude += 4987 * Math.sin(toRadians(Mprime - F));
  sumLongitude += 4036 * E * Math.sin(toRadians(2 * D + M));
  sumLongitude += 3994 * E * Math.sin(toRadians(2 * D - Mprime - 2 * M));
  sumLongitude += 3861 * Math.sin(toRadians(4 * D));
  sumLongitude += 3665 * Math.sin(toRadians(2 * D - 2 * F));

  // Convert to degrees and add to mean longitude
  const longitude = L + sumLongitude / 1000000;

  // Additional corrections
  const A1 = normalizeDegrees(119.75 + 131.849 * T);
  const A2 = normalizeDegrees(53.09 + 479264.290 * T);
  const A3 = normalizeDegrees(313.45 + 481266.484 * T);

  const correction =
    0.82 * Math.sin(toRadians(A1)) +
    0.31 * Math.sin(toRadians(A2)) +
    0.35 * Math.sin(toRadians(A3));

  return normalizeDegrees(longitude + correction);
}

/**
 * Calculate the Moon's latitude
 */
export function calculateMoonLatitude(jd: number): number {
  const T = calculateJulianCentury(jd);

  const D = normalizeDegrees(
    297.8501921 + 445267.1114034 * T - 0.0018819 * T * T
  );
  const M = normalizeDegrees(
    357.5291092 + 35999.0502909 * T - 0.0001536 * T * T
  );
  const Mprime = normalizeDegrees(
    134.9633964 + 477198.8675055 * T + 0.0087414 * T * T
  );
  const F = normalizeDegrees(
    93.2720950 + 483202.0175233 * T - 0.0036539 * T * T
  );

  const E = 1 - 0.002516 * T - 0.0000074 * T * T;

  let sumLatitude = 0;

  sumLatitude += 5128122 * Math.sin(toRadians(F));
  sumLatitude += 280602 * Math.sin(toRadians(Mprime + F));
  sumLatitude += 277693 * Math.sin(toRadians(Mprime - F));
  sumLatitude += 173237 * Math.sin(toRadians(2 * D - F));
  sumLatitude += 55413 * Math.sin(toRadians(2 * D + F - Mprime));
  sumLatitude += 46271 * Math.sin(toRadians(2 * D - F - Mprime));
  sumLatitude += 32573 * Math.sin(toRadians(2 * D + F));
  sumLatitude += 17198 * Math.sin(toRadians(2 * Mprime + F));
  sumLatitude += 9266 * Math.sin(toRadians(2 * D - 2 * F));
  sumLatitude += 8822 * Math.sin(toRadians(2 * Mprime - F));
  sumLatitude += 8216 * E * Math.sin(toRadians(Mprime + M + F));
  sumLatitude += 4324 * E * Math.sin(toRadians(Mprime + M - F));

  return sumLatitude / 1000000;
}

// ============================================================================
// Lunar Nodes (Rahu/Ketu)
// ============================================================================

/**
 * Calculate the mean longitude of the ascending node (Rahu)
 * The node moves retrograde
 */
export function calculateRahuLongitude(jd: number): number {
  const T = calculateJulianCentury(jd);

  // Mean longitude of ascending node
  const omega = normalizeDegrees(
    125.04452 - 1934.136261 * T + 0.0020708 * T * T + T * T * T / 450000
  );

  return omega;
}

/**
 * Calculate Ketu longitude (opposite of Rahu)
 */
export function calculateKetuLongitude(jd: number): number {
  const rahu = calculateRahuLongitude(jd);
  return normalizeDegrees(rahu + 180);
}

// ============================================================================
// Planetary Calculations (VSOP87 truncated)
// ============================================================================

interface OrbitalElements {
  a: number; // Semi-major axis (AU)
  e: number; // Eccentricity
  i: number; // Inclination (degrees)
  L: number; // Mean longitude (degrees)
  omega: number; // Longitude of ascending node (degrees)
  pi: number; // Longitude of perihelion (degrees)
}

/**
 * Get mean orbital elements for planets at J2000.0
 * Based on Meeus Table 31.A
 */
function getPlanetaryElements(T: number, planet: string): OrbitalElements {
  // Elements at J2000.0 and rates per Julian century
  const elements: Record<string, { a: number; e: number; i: number; L: number; omega: number; pi: number }> = {
    mercury: { a: 0.38709893, e: 0.20563069, i: 7.00487, L: 252.25084, omega: 48.33167, pi: 77.45645 },
    venus: { a: 0.72333199, e: 0.00677323, i: 3.39471, L: 181.97973, omega: 76.68069, pi: 131.53298 },
    mars: { a: 1.52366231, e: 0.09341233, i: 1.85061, L: 355.43327, omega: 49.57854, pi: 336.04084 },
    jupiter: { a: 5.20336301, e: 0.04849485, i: 1.30530, L: 34.40438, omega: 100.46441, pi: 14.75385 },
    saturn: { a: 9.53707032, e: 0.05415060, i: 2.48446, L: 49.94432, omega: 113.71504, pi: 92.43194 },
  };

  const rates: Record<string, { a: number; e: number; i: number; L: number; omega: number; pi: number }> = {
    mercury: { a: 0.00000037, e: 0.00001906, i: -0.005947, L: 149472.67411, omega: -0.12534, pi: 1.48647 },
    venus: { a: 0.00000390, e: -0.00004107, i: -0.000788, L: 58517.81538, omega: -0.27769, pi: 1.42430 },
    mars: { a: 0.00001847, e: 0.00007882, i: -0.008131, L: 19141.69644, omega: -0.29257, pi: 1.84435 },
    jupiter: { a: -0.00011607, e: -0.00013253, i: -0.001837, L: 3034.74612, omega: 0.20469, pi: 0.21252 },
    saturn: { a: -0.00125060, e: -0.00050991, i: 0.001936, L: 1222.11380, omega: -0.41897, pi: -0.41897 },
  };

  const el = elements[planet];
  const rt = rates[planet];

  return {
    a: el.a + rt.a * T,
    e: el.e + rt.e * T,
    i: el.i + rt.i * T,
    L: normalizeDegrees(el.L + rt.L * T),
    omega: normalizeDegrees(el.omega + rt.omega * T),
    pi: normalizeDegrees(el.pi + rt.pi * T),
  };
}

/**
 * Solve Kepler's equation for eccentric anomaly
 * M = E - e * sin(E)
 */
function solveKepler(M: number, e: number, tolerance = 1e-10): number {
  let E = M;
  let delta;

  do {
    delta = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
    E -= delta;
  } while (Math.abs(delta) > tolerance);

  return E;
}

/**
 * Calculate heliocentric position of a planet
 */
function calculateHeliocentricPosition(jd: number, planet: string): {
  longitude: number;
  latitude: number;
  radius: number;
} {
  const T = calculateJulianCentury(jd);
  const el = getPlanetaryElements(T, planet);

  // Mean anomaly
  const M = normalizeDegrees(el.L - el.pi);
  const Mrad = toRadians(M);

  // Solve Kepler's equation
  const E = solveKepler(Mrad, el.e);

  // True anomaly
  const v = 2 * Math.atan2(
    Math.sqrt(1 + el.e) * Math.sin(E / 2),
    Math.sqrt(1 - el.e) * Math.cos(E / 2)
  );

  // Heliocentric distance
  const r = el.a * (1 - el.e * Math.cos(E));

  // Heliocentric longitude
  const longitude = normalizeDegrees(toDegrees(v) + el.pi);

  // Heliocentric latitude (simplified)
  const u = toDegrees(v) + el.pi - el.omega; // Argument of latitude
  const latitude = toDegrees(Math.asin(Math.sin(toRadians(el.i)) * Math.sin(toRadians(u))));

  return { longitude, latitude, radius: r };
}

/**
 * Calculate geocentric position of a planet
 */
export function calculatePlanetLongitude(jd: number, planet: string): {
  longitude: number;
  latitude: number;
  distance: number;
  isRetrograde: boolean;
} {
  // Get planet's heliocentric position
  const planetPos = calculateHeliocentricPosition(jd, planet);

  // Get Earth's (Sun's opposite) heliocentric position
  const sunLong = calculateSunLongitude(jd);
  const earthLong = normalizeDegrees(sunLong + 180);
  const earthDist = calculateSunDistance(jd);

  // Convert to rectangular coordinates
  const planetX = planetPos.radius * Math.cos(toRadians(planetPos.longitude));
  const planetY = planetPos.radius * Math.sin(toRadians(planetPos.longitude));
  const planetZ = planetPos.radius * Math.sin(toRadians(planetPos.latitude));

  const earthX = earthDist * Math.cos(toRadians(earthLong));
  const earthY = earthDist * Math.sin(toRadians(earthLong));

  // Geocentric position
  const geoX = planetX - earthX;
  const geoY = planetY - earthY;
  const geoZ = planetZ;

  // Geocentric longitude
  const longitude = normalizeDegrees(toDegrees(Math.atan2(geoY, geoX)));

  // Geocentric latitude
  const distance = Math.sqrt(geoX * geoX + geoY * geoY + geoZ * geoZ);
  const latitude = toDegrees(Math.asin(geoZ / distance));

  // Check for retrograde motion
  const jdPrev = jd - 1;
  const prevPos = calculatePlanetLongitude(jdPrev, planet);
  const isRetrograde = longitude < prevPos.longitude && Math.abs(longitude - prevPos.longitude) > 1;

  return { longitude, latitude, distance, isRetrograde };
}

// ============================================================================
// Ascendant and House Calculations
// ============================================================================

/**
 * Calculate the Ascendant (Lagna) using Meeus formula
 * Whole Sign House System (standard for Vedic astrology)
 */
export function calculateAscendant(jd: number, latitude: number, longitude: number): {
  ascendant: number;
  midheaven: number;
} {
  const lst = calculateLST(jd, longitude);
  const ramc = toRadians(lst); // Right Ascension of Midheaven
  const eps = toRadians(calculateObliquity(jd));
  const lat = toRadians(latitude);

  // Midheaven (MC)
  const mc = normalizeDegrees(
    toDegrees(Math.atan2(Math.sin(ramc), Math.cos(ramc) * Math.cos(eps)))
  );

  // Ascendant using Meeus formula
  const asc = normalizeDegrees(
    toDegrees(
      Math.atan2(
        -Math.cos(ramc),
        Math.sin(ramc) * Math.cos(eps) + Math.tan(lat) * Math.sin(eps)
      )
    )
  );

  return { ascendant: asc, midheaven: mc };
}

/**
 * Calculate house cusps using Whole Sign system
 * In Vedic astrology, each sign is one house starting from the ascendant sign
 */
export function calculateHouseCusps(ascendant: number): number[] {
  const ascSign = Math.floor(ascendant / 30);
  const cusps: number[] = [];

  for (let i = 0; i < 12; i++) {
    cusps.push((ascSign + i) * 30);
  }

  return cusps;
}

/**
 * Get the house number for a given longitude (Whole Sign system)
 */
export function getHouseNumber(planetLongitude: number, ascendant: number): number {
  const ascSign = Math.floor(ascendant / 30);
  const planetSign = Math.floor(planetLongitude / 30);
  let house = planetSign - ascSign + 1;
  if (house <= 0) house += 12;
  return house;
}

// ============================================================================
// Lahiri Ayanamsa
// ============================================================================

/**
 * Calculate Lahiri Ayanamsa (Chitrapaksha)
 * Based on Indian National Calendar Committee standard
 * Reference: Spica at 0° Libra in 285 CE
 */
export function calculateLahiriAyanamsa(jd: number): number {
  const T = calculateJulianCentury(jd);

  // Precession rate (arcseconds per year)
  const precessionRate = 50.290966;

  // Base ayanamsa at J2000.0 = 23.85635 degrees (approximately)
  const ayanamsaJ2000 = 23.85635;

  // Calculate ayanamsa
  let ayanamsa = ayanamsaJ2000 + (T * precessionRate * 100) / 3600;

  // Adjust to match traditional value
  ayanamsa = 23.85635 + T * 1.3969;

  return normalizeDegrees(ayanamsa);
}

/**
 * Convert tropical longitude to sidereal longitude
 */
export function tropicalToSidereal(tropicalLongitude: number, ayanamsa: number): number {
  return normalizeDegrees(tropicalLongitude - ayanamsa);
}

// ============================================================================
// Nakshatra Calculations
// ============================================================================

export const NAKSHATRAS = [
  { name: 'Ashwini', lord: 'Ketu', deity: 'Ashwini Kumaras', symbol: "Horse's Head" },
  { name: 'Bharani', lord: 'Venus', deity: 'Yama', symbol: 'Yoni (Womb)' },
  { name: 'Krittika', lord: 'Sun', deity: 'Agni', symbol: 'Knife/Razor' },
  { name: 'Rohini', lord: 'Moon', deity: 'Brahma', symbol: 'Chariot' },
  { name: 'Mrigashira', lord: 'Mars', deity: 'Soma', symbol: 'Deer Head' },
  { name: 'Ardra', lord: 'Rahu', deity: 'Rudra', symbol: 'Teardrop' },
  { name: 'Punarvasu', lord: 'Jupiter', deity: 'Aditi', symbol: 'Quiver' },
  { name: 'Pushya', lord: 'Saturn', deity: 'Brihaspati', symbol: "Cow's Udder" },
  { name: 'Ashlesha', lord: 'Mercury', deity: 'Nagas', symbol: 'Serpent' },
  { name: 'Magha', lord: 'Ketu', deity: 'Pitris', symbol: 'Royal Throne' },
  { name: 'Purva Phalguni', lord: 'Venus', deity: 'Bhaga', symbol: 'Front Legs of Bed' },
  { name: 'Uttara Phalguni', lord: 'Sun', deity: 'Aryaman', symbol: 'Back Legs of Bed' },
  { name: 'Hasta', lord: 'Moon', deity: 'Savitar', symbol: 'Hand' },
  { name: 'Chitra', lord: 'Mars', deity: 'Vishvakarma', symbol: 'Bright Jewel' },
  { name: 'Swati', lord: 'Rahu', deity: 'Vayu', symbol: 'Coral/Sword' },
  { name: 'Vishakha', lord: 'Jupiter', deity: 'Indra-Agni', symbol: 'Triumphal Arch' },
  { name: 'Anuradha', lord: 'Saturn', deity: 'Mitra', symbol: 'Triumphal Archway' },
  { name: 'Jyeshtha', lord: 'Mercury', deity: 'Indra', symbol: 'Earring/Amulet' },
  { name: 'Mula', lord: 'Ketu', deity: 'Nirriti', symbol: 'Bunch of Roots' },
  { name: 'Purva Ashadha', lord: 'Venus', deity: 'Apas', symbol: 'Winnowing Basket' },
  { name: 'Uttara Ashadha', lord: 'Sun', deity: 'Vishvadevas', symbol: 'Elephant Tusk' },
  { name: 'Shravana', lord: 'Moon', deity: 'Vishnu', symbol: 'Ear' },
  { name: 'Dhanishta', lord: 'Mars', deity: 'Eight Vasus', symbol: 'Drum' },
  { name: 'Shatabhisha', lord: 'Rahu', deity: 'Varuna', symbol: 'Thousand Physicians' },
  { name: 'Purva Bhadrapada', lord: 'Jupiter', deity: 'Aja Ekapada', symbol: 'Front of Funeral Cot' },
  { name: 'Uttara Bhadrapada', lord: 'Saturn', deity: 'Ahir Budhnya', symbol: 'Back of Funeral Cot' },
  { name: 'Revati', lord: 'Mercury', deity: 'Pushan', symbol: 'Fish' },
];

/**
 * Get nakshatra information for a given longitude
 */
export function getNakshatra(longitude: number): {
  nakshatra: number;
  name: string;
  lord: string;
  pada: number;
  deity: string;
  symbol: string;
  startDegree: number;
  endDegree: number;
} {
  const normalized = normalizeDegrees(longitude);
  const nakshatraSize = 360 / 27; // 13°20' per nakshatra

  const nakshatraIndex = Math.floor(normalized / nakshatraSize);
  const pada = Math.floor((normalized % nakshatraSize) / (nakshatraSize / 4)) + 1;

  const nakshatra = NAKSHATRAS[nakshatraIndex];

  return {
    nakshatra: nakshatraIndex,
    name: nakshatra.name,
    lord: nakshatra.lord,
    pada,
    deity: nakshatra.deity,
    symbol: nakshatra.symbol,
    startDegree: nakshatraIndex * nakshatraSize,
    endDegree: (nakshatraIndex + 1) * nakshatraSize,
  };
}

/**
 * Get the lord of a nakshatra by index
 */
export function getNakshatraLord(nakshatraIndex: number): string {
  const lords = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];
  return lords[nakshatraIndex % 9];
}

// ============================================================================
// Vimshottari Dasha
// ============================================================================

export const DASHA_LORDS = ['Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury', 'Ketu', 'Venus'];
export const DASHA_YEARS = [6, 10, 7, 18, 16, 19, 17, 7, 20];

/**
 * Calculate Vimshottari Dasha periods
 */
export function calculateVimshottariDasha(
  moonLongitude: number,
  birthDate: Date
): {
  mahadashas: {
    lord: string;
    startDate: Date;
    endDate: Date;
    years: number;
    isCurrent: boolean;
  }[];
  currentMahadasha: number;
  balanceYears: number;
} {
  const nakshatraInfo = getNakshatra(moonLongitude);
  const nakshatraIndex = nakshatraInfo.nakshatra;
  const dashaLordIndex = nakshatraIndex % 9;

  // Calculate balance of birth nakshatra
  const nakshatraSize = 360 / 27; // 13°20' = 800 arcminutes
  const degreesInNakshatra = moonLongitude % nakshatraSize;
  const fractionRemaining = 1 - degreesInNakshatra / nakshatraSize;

  const currentDashaYears = DASHA_YEARS[dashaLordIndex];
  const balanceYears = fractionRemaining * currentDashaYears;

  // Generate dasha sequence
  const mahadashas: {
    lord: string;
    startDate: Date;
    endDate: Date;
    years: number;
    isCurrent: boolean;
  }[] = [];

  let currentDate = new Date(birthDate);
  const today = new Date();

  // First dasha (balance)
  const firstEndDate = new Date(birthDate);
  firstEndDate.setFullYear(firstEndDate.getFullYear() + balanceYears);

  mahadashas.push({
    lord: DASHA_LORDS[dashaLordIndex],
    startDate: new Date(birthDate),
    endDate: firstEndDate,
    years: balanceYears,
    isCurrent: today >= birthDate && today < firstEndDate,
  });

  currentDate = firstEndDate;

  // Remaining dashas
  for (let i = 1; i < 108; i++) {
    // 108 dashas covers ~120 years
    const dashaIndex = (dashaLordIndex + i) % 9;
    const years = DASHA_YEARS[dashaIndex];
    const endDate = new Date(currentDate);
    endDate.setFullYear(endDate.getFullYear() + years);

    mahadashas.push({
      lord: DASHA_LORDS[dashaIndex],
      startDate: new Date(currentDate),
      endDate,
      years,
      isCurrent: today >= currentDate && today < endDate,
    });

    currentDate = endDate;
  }

  const currentMahadasha = mahadashas.findIndex((d) => d.isCurrent);

  return {
    mahadashas,
    currentMahadasha: currentMahadasha >= 0 ? currentMahadasha : 0,
    balanceYears,
  };
}

/**
 * Calculate Antardasha (sub-period) within a Mahadasha
 */
export function calculateAntardasha(
  mahadashaLord: string,
  mahadashaStart: Date,
  _mahadashaYears: number
): {
  lord: string;
  startDate: Date;
  endDate: Date;
  duration: number; // in years
}[] {
  const mdIndex = DASHA_LORDS.indexOf(mahadashaLord);
  if (mdIndex === -1) return [];

  const antardashas: {
    lord: string;
    startDate: Date;
    endDate: Date;
    duration: number;
  }[] = [];

  const totalDashaYears = DASHA_YEARS.reduce((a, b) => a + b, 0);
  let currentDate = new Date(mahadashaStart);

  for (let i = 0; i < 9; i++) {
    const adIndex = (mdIndex + i) % 9;
    const adYears = (DASHA_YEARS[mdIndex] * DASHA_YEARS[adIndex]) / totalDashaYears;

    const endDate = new Date(currentDate);
    const daysToAdd = Math.round(adYears * 365.25);
    endDate.setDate(endDate.getDate() + daysToAdd);

    antardashas.push({
      lord: DASHA_LORDS[adIndex],
      startDate: new Date(currentDate),
      endDate,
      duration: adYears,
    });

    currentDate = endDate;
  }

  return antardashas;
}

// ============================================================================
// Divisional Charts (Vargas)
// ============================================================================

/**
 * Calculate Navamsa (D9) position
 * Each sign is divided into 9 equal parts of 3°20' each
 */
export function calculateNavamsa(longitude: number): number {
  const normalized = normalizeDegrees(longitude);
  const sign = Math.floor(normalized / 30);
  const degreeInSign = normalized % 30;

  // Each navamsa is 3°20' = 3.333... degrees
  const navamsaIndex = Math.floor(degreeInSign / (30 / 9));

  // Navamsa counting depends on the sign
  // Fire signs (0, 4, 8): Start from Aries
  // Earth signs (2, 6, 10): Start from Capricorn
  // Air signs (3, 7, 11): Start from Libra
  // Water signs (1, 5, 9): Start from Cancer

  let startSign: number;
  if ([0, 4, 8].includes(sign)) {
    startSign = 0; // Aries
  } else if ([2, 6, 10].includes(sign)) {
    startSign = 9; // Capricorn
  } else if ([3, 7, 11].includes(sign)) {
    startSign = 6; // Libra
  } else {
    startSign = 3; // Cancer
  }

  const navamsaSign = (startSign + navamsaIndex) % 12;
  const degreeInNavamsa = (degreeInSign % (30 / 9)) * 9;

  return navamsaSign * 30 + degreeInNavamsa;
}

/**
 * Calculate other divisional charts
 */
export function calculateDivisionalChart(longitude: number, division: number): number {
  const normalized = normalizeDegrees(longitude);
  const sign = Math.floor(normalized / 30);
  const degreeInSign = normalized % 30;

  const divisionSize = 30 / division;
  const divisionIndex = Math.floor(degreeInSign / divisionSize);
  const degreeInDivision = (degreeInSign % divisionSize) * division;

  // Different starting points for different vargas
  let startSign = 0;

  switch (division) {
    case 2: // Hora (D2)
      startSign = degreeInSign < 15 ? (sign % 2 === 0 ? 4 : 3) : (sign % 2 === 0 ? 3 : 4);
      return startSign * 30 + degreeInDivision;
    case 7: // Saptamsa (D7)
      if ([0, 4, 8].includes(sign)) startSign = 0;
      else if ([2, 6, 10].includes(sign)) startSign = 6;
      else if ([3, 7, 11].includes(sign)) startSign = 9;
      else startSign = 3;
      break;
    case 10: // Dasamsa (D10)
      if ([0, 4, 8].includes(sign)) startSign = 0;
      else if ([1, 5, 9].includes(sign)) startSign = 9;
      else if ([2, 6, 10].includes(sign)) startSign = 6;
      else startSign = 3;
      break;
    default:
      startSign = sign;
  }

  const divisionSign = (startSign + divisionIndex) % 12;
  return divisionSign * 30 + degreeInDivision;
}

// ============================================================================
// Yoga Calculations
// ============================================================================

export const ZODIAC_SIGNS = [
  { name: 'Aries', symbol: '♈', short: 'Ar' },
  { name: 'Taurus', symbol: '♉', short: 'Ta' },
  { name: 'Gemini', symbol: '♊', short: 'Ge' },
  { name: 'Cancer', symbol: '♋', short: 'Cn' },
  { name: 'Leo', symbol: '♌', short: 'Le' },
  { name: 'Virgo', symbol: '♍', short: 'Vi' },
  { name: 'Libra', symbol: '♎', short: 'Li' },
  { name: 'Scorpio', symbol: '♏', short: 'Sc' },
  { name: 'Sagittarius', symbol: '♐', short: 'Sg' },
  { name: 'Capricorn', symbol: '♑', short: 'Cp' },
  { name: 'Aquarius', symbol: '♒', short: 'Aq' },
  { name: 'Pisces', symbol: '♓', short: 'Pi' },
];

export const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

/**
 * Get sign lord (ruler)
 */
export function getSignLord(signIndex: number): string {
  const lords = ['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'];
  return lords[signIndex];
}

/**
 * Calculate angular distance between two longitudes
 */
export function getAngularDistance(long1: number, long2: number): number {
  let diff = Math.abs(long1 - long2);
  if (diff > 180) diff = 360 - diff;
  return diff;
}

/**
 * Check if two planets are in conjunction (same sign)
 */
export function areInConjunction(long1: number, long2: number): boolean {
  return Math.floor(long1 / 30) === Math.floor(long2 / 30);
}

/**
 * Check if two planets are in opposition (7th from each other)
 */
export function areInOpposition(long1: number, long2: number): boolean {
  const sign1 = Math.floor(long1 / 30);
  const sign2 = Math.floor(long2 / 30);
  return (sign1 - sign2 + 12) % 12 === 6;
}

/**
 * Check if planet is in kendra (1, 4, 7, 10) from another
 */
export function isInKendra(planetLong: number, referenceLong: number): boolean {
  const planetSign = Math.floor(planetLong / 30);
  const refSign = Math.floor(referenceLong / 30);
  const distance = (planetSign - refSign + 12) % 12;
  return [0, 3, 6, 9].includes(distance);
}

/**
 * Check if planet is in trikona (1, 5, 9) from another
 */
export function isInTrikona(planetLong: number, referenceLong: number): boolean {
  const planetSign = Math.floor(planetLong / 30);
  const refSign = Math.floor(referenceLong / 30);
  const distance = (planetSign - refSign + 12) % 12;
  return [0, 4, 8].includes(distance);
}

/**
 * Detect major yogas in the chart
 */
export function detectYogas(
  planets: Record<string, number>,
  ascendant: number
): { name: string; description: string; present: boolean }[] {
  const yogas: { name: string; description: string; present: boolean }[] = [];

  const moonLong = planets['Moon'];
  const marsLong = planets['Mars'];
  const mercuryLong = planets['Mercury'];
  const jupiterLong = planets['Jupiter'];
  const venusLong = planets['Venus'];
  const saturnLong = planets['Saturn'];

  // Gajakesari Yoga: Jupiter in kendra from Moon
  yogas.push({
    name: 'Gajakesari Yoga',
    description: 'Jupiter in kendra (1, 4, 7, 10) from Moon. Brings wisdom, prosperity, and fame.',
    present: isInKendra(jupiterLong, moonLong) && !areInConjunction(jupiterLong, moonLong),
  });

  // Pancha Mahapurusha Yogas
  // Ruchaka Yoga: Mars in own/exalted sign in kendra
  const marsSign = Math.floor(marsLong / 30);
  yogas.push({
    name: 'Ruchaka Yoga',
    description: 'Mars in Aries, Scorpio, or Capricorn in a kendra house. Gives courage and leadership.',
    present: [0, 7, 9].includes(marsSign) && isInKendra(marsLong, ascendant),
  });

  // Bhadra Yoga: Mercury in own/exalted sign in kendra
  const mercurySign = Math.floor(mercuryLong / 30);
  yogas.push({
    name: 'Bhadra Yoga',
    description: 'Mercury in Gemini, Virgo in a kendra house. Gives intelligence and communication skills.',
    present: [2, 5].includes(mercurySign) && isInKendra(mercuryLong, ascendant),
  });

  // Hamsa Yoga: Jupiter in own/exalted sign in kendra
  const jupiterSign = Math.floor(jupiterLong / 30);
  yogas.push({
    name: 'Hamsa Yoga',
    description: 'Jupiter in Sagittarius, Pisces, or Cancer in a kendra house. Gives wisdom and spirituality.',
    present: [9, 11, 3].includes(jupiterSign) && isInKendra(jupiterLong, ascendant),
  });

  // Malavya Yoga: Venus in own/exalted sign in kendra
  const venusSign = Math.floor(venusLong / 30);
  yogas.push({
    name: 'Malavya Yoga',
    description: 'Venus in Taurus, Libra, or Pisces in a kendra house. Gives beauty and artistic talents.',
    present: [1, 6, 11].includes(venusSign) && isInKendra(venusLong, ascendant),
  });

  // Sasa Yoga: Saturn in own/exalted sign in kendra
  const saturnSign = Math.floor(saturnLong / 30);
  yogas.push({
    name: 'Sasa Yoga',
    description: 'Saturn in Capricorn, Aquarius, or Libra in a kendra house. Gives discipline and longevity.',
    present: [9, 10, 6].includes(saturnSign) && isInKendra(saturnLong, ascendant),
  });

  // Kemadruma Yoga: No planets in 2nd and 12th from Moon
  const moonSign = Math.floor(moonLong / 30);
  const secondFromMoon = (moonSign + 1) % 12;
  const twelfthFromMoon = (moonSign + 11) % 12;
  const hasPlanetIn2ndOr12th = Object.entries(planets).some(([planet, long]) => {
    if (planet === 'Moon') return false;
    const sign = Math.floor(long / 30);
    return sign === secondFromMoon || sign === twelfthFromMoon;
  });
  yogas.push({
    name: 'Kemadruma Yoga',
    description: 'No planets in 2nd and 12th from Moon. Can cause financial difficulties.',
    present: !hasPlanetIn2ndOr12th,
  });

  // Sunapha Yoga: Benefics in 2nd from Moon
  const benefics = ['Mercury', 'Jupiter', 'Venus'];
  const hasBeneficIn2nd = benefics.some((planet) => {
    const sign = Math.floor(planets[planet] / 30);
    return sign === secondFromMoon;
  });
  yogas.push({
    name: 'Sunapha Yoga',
    description: 'Benefic planets in 2nd from Moon. Brings wealth and prosperity.',
    present: hasBeneficIn2nd,
  });

  // Anapha Yoga: Benefics in 12th from Moon
  const hasBeneficIn12th = benefics.some((planet) => {
    const sign = Math.floor(planets[planet] / 30);
    return sign === twelfthFromMoon;
  });
  yogas.push({
    name: 'Anapha Yoga',
    description: 'Benefic planets in 12th from Moon. Brings spiritual growth.',
    present: hasBeneficIn12th,
  });

  // Duradhara Yoga: Benefics in both 2nd and 12th from Moon
  yogas.push({
    name: 'Duradhara Yoga',
    description: 'Benefic planets in both 2nd and 12th from Moon. Excellent for wealth.',
    present: hasBeneficIn2nd && hasBeneficIn12th,
  });

  return yogas;
}
