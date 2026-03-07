/**
 * Vedic Astrology Software - Parashara Light Style
 * Main Application Component
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  calculateJulianDay,
  calculateSunLongitude,
  calculateMoonLongitude,
  calculateRahuLongitude,
  calculateKetuLongitude,
  calculatePlanetLongitude,
  calculateAscendant,
  calculateLahiriAyanamsa,
  tropicalToSidereal,
  getNakshatra,
  getHouseNumber,
  calculateNavamsa,
  calculateVimshottariDasha,
  calculateAntardasha,
  detectYogas,
  NAKSHATRAS,
  ZODIAC_SIGNS,
  getSignLord,
} from '../utils/astronomy';
import { ChartSelector, type ChartData, type PlanetData } from '../components/ChartComponents';

// ============================================================================
// Types
// ============================================================================

interface BirthData {
  name: string;
  date: string;
  time: string;
  latitude: number;
  longitude: number;
  timezone: number;
  place: string;
}

interface CalculatedPlanet {
  name: string;
  tropicalLongitude: number;
  siderealLongitude: number;
  sign: number;
  degreeInSign: number;
  house: number;
  nakshatra: number;
  nakshatraName: string;
  nakshatraLord: string;
  pada: number;
  navamsaSign: number;
  isRetrograde: boolean;
  speed: number;
}

interface ChartCalculations {
  ascendant: number;
  ascendantSign: number;
  ascendantNakshatra: string;
  ayanamsa: number;
  planets: CalculatedPlanet[];
  dasha: {
    mahadashas: {
      lord: string;
      startDate: Date;
      endDate: Date;
      years: number;
      isCurrent: boolean;
    }[];
    currentMahadasha: number;
    balanceYears: number;
  };
  yogas: { name: string; description: string; present: boolean }[];
}

// ============================================================================
// City Database
// ============================================================================

interface CityData {
  name: string;
  latitude: number;
  longitude: number;
  timezone: number;
}

const CITIES: CityData[] = [
  // Major Indian Cities
  { name: 'New Delhi', latitude: 28.6139, longitude: 77.2090, timezone: 5.5 },
  { name: 'Mumbai', latitude: 19.0760, longitude: 72.8777, timezone: 5.5 },
  { name: 'Kolkata', latitude: 22.5726, longitude: 88.3639, timezone: 5.5 },
  { name: 'Chennai', latitude: 13.0827, longitude: 80.2707, timezone: 5.5 },
  { name: 'Bangalore', latitude: 12.9716, longitude: 77.5946, timezone: 5.5 },
  { name: 'Hyderabad', latitude: 17.3850, longitude: 78.4867, timezone: 5.5 },
  { name: 'Ahmedabad', latitude: 23.0225, longitude: 72.5714, timezone: 5.5 },
  { name: 'Pune', latitude: 18.5204, longitude: 73.8567, timezone: 5.5 },
  { name: 'Jaipur', latitude: 26.9124, longitude: 75.7873, timezone: 5.5 },
  { name: 'Lucknow', latitude: 26.8467, longitude: 80.9462, timezone: 5.5 },
  { name: 'Kanpur', latitude: 26.4499, longitude: 80.3319, timezone: 5.5 },
  { name: 'Nagpur', latitude: 21.1458, longitude: 79.0882, timezone: 5.5 },
  { name: 'Indore', latitude: 22.7196, longitude: 75.8577, timezone: 5.5 },
  { name: 'Thane', latitude: 19.2183, longitude: 72.9781, timezone: 5.5 },
  { name: 'Bhopal', latitude: 23.2599, longitude: 77.4126, timezone: 5.5 },
  { name: 'Visakhapatnam', latitude: 17.6868, longitude: 83.2185, timezone: 5.5 },
  { name: 'Patna', latitude: 25.5941, longitude: 85.1376, timezone: 5.5 },
  { name: 'Vadodara', latitude: 22.3072, longitude: 73.1812, timezone: 5.5 },
  { name: 'Ghaziabad', latitude: 28.6692, longitude: 77.4538, timezone: 5.5 },
  { name: 'Ludhiana', latitude: 30.9010, longitude: 75.8573, timezone: 5.5 },
  { name: 'Agra', latitude: 27.1767, longitude: 78.0081, timezone: 5.5 },
  { name: 'Nashik', latitude: 19.9975, longitude: 73.7898, timezone: 5.5 },
  { name: 'Faridabad', latitude: 28.4089, longitude: 77.3178, timezone: 5.5 },
  { name: 'Meerut', latitude: 29.0168, longitude: 77.5644, timezone: 5.5 },
  { name: 'Rajkot', latitude: 22.3039, longitude: 70.8022, timezone: 5.5 },
  { name: 'Kalyan-Dombivali', latitude: 19.2403, longitude: 73.1305, timezone: 5.5 },
  { name: 'Vasai-Virar', latitude: 19.4612, longitude: 72.7985, timezone: 5.5 },
  { name: 'Varanasi', latitude: 25.3176, longitude: 82.9739, timezone: 5.5 },
  { name: 'Srinagar', latitude: 34.0837, longitude: 74.7973, timezone: 5.5 },
  { name: 'Aurangabad', latitude: 19.8762, longitude: 75.3433, timezone: 5.5 },
  { name: 'Dhanbad', latitude: 23.7957, longitude: 86.4304, timezone: 5.5 },
  { name: 'Amritsar', latitude: 31.6340, longitude: 74.8723, timezone: 5.5 },
  { name: 'Navi Mumbai', latitude: 19.0330, longitude: 73.0297, timezone: 5.5 },
  { name: 'Allahabad', latitude: 25.4358, longitude: 81.8463, timezone: 5.5 },
  { name: 'Ranchi', latitude: 23.3441, longitude: 85.3096, timezone: 5.5 },
  { name: 'Howrah', latitude: 22.5958, longitude: 88.2636, timezone: 5.5 },
  { name: 'Coimbatore', latitude: 11.0168, longitude: 76.9558, timezone: 5.5 },
  { name: 'Jabalpur', latitude: 23.1815, longitude: 79.9864, timezone: 5.5 },
  { name: 'Gwalior', latitude: 26.2183, longitude: 78.1828, timezone: 5.5 },
  { name: 'Vijayawada', latitude: 16.5062, longitude: 80.6480, timezone: 5.5 },
  { name: 'Jodhpur', latitude: 26.2389, longitude: 73.0243, timezone: 5.5 },
  { name: 'Madurai', latitude: 9.9252, longitude: 78.1198, timezone: 5.5 },
  { name: 'Raipur', latitude: 21.2514, longitude: 81.6296, timezone: 5.5 },
  { name: 'Kota', latitude: 25.2138, longitude: 75.8648, timezone: 5.5 },
  { name: 'Chandigarh', latitude: 30.7333, longitude: 76.7794, timezone: 5.5 },
  { name: 'Guwahati', latitude: 26.1445, longitude: 91.7362, timezone: 5.5 },
  { name: 'Solapur', latitude: 17.6599, longitude: 75.9064, timezone: 5.5 },
  { name: 'Hubli-Dharwad', latitude: 15.3647, longitude: 75.1240, timezone: 5.5 },
  { name: 'Bareilly', latitude: 28.3670, longitude: 79.4304, timezone: 5.5 },
  { name: 'Moradabad', latitude: 28.8389, longitude: 78.7378, timezone: 5.5 },
  { name: 'Mysore', latitude: 12.2958, longitude: 76.6394, timezone: 5.5 },
  { name: 'Gurgaon', latitude: 28.4595, longitude: 77.0266, timezone: 5.5 },
  { name: 'Aligarh', latitude: 27.8974, longitude: 78.0880, timezone: 5.5 },
  { name: 'Jalandhar', latitude: 31.3260, longitude: 75.5762, timezone: 5.5 },
  { name: 'Tiruchirappalli', latitude: 10.7905, longitude: 78.7047, timezone: 5.5 },
  { name: 'Bhubaneswar', latitude: 20.2961, longitude: 85.8245, timezone: 5.5 },
  { name: 'Salem', latitude: 11.6643, longitude: 78.1460, timezone: 5.5 },
  { name: 'Warangal', latitude: 17.9689, longitude: 79.5941, timezone: 5.5 },
  { name: 'Mira-Bhayandar', latitude: 19.2952, longitude: 72.8544, timezone: 5.5 },
  { name: 'Thiruvananthapuram', latitude: 8.5241, longitude: 76.9366, timezone: 5.5 },
  { name: 'Guntur', latitude: 16.3067, longitude: 80.4365, timezone: 5.5 },
  { name: 'Bhiwandi', latitude: 19.2969, longitude: 73.0641, timezone: 5.5 },
  { name: 'Saharanpur', latitude: 29.9680, longitude: 77.5460, timezone: 5.5 },
  { name: 'Gorakhpur', latitude: 26.7606, longitude: 83.3732, timezone: 5.5 },
  { name: 'Bikaner', latitude: 28.0229, longitude: 73.3119, timezone: 5.5 },
  { name: 'Amravati', latitude: 20.9374, longitude: 77.7796, timezone: 5.5 },
  { name: 'Noida', latitude: 28.5355, longitude: 77.3910, timezone: 5.5 },
  { name: 'Jamshedpur', latitude: 22.8046, longitude: 86.2029, timezone: 5.5 },
  { name: 'Bhilai', latitude: 21.2095, longitude: 81.3784, timezone: 5.5 },
  { name: 'Cuttack', latitude: 20.4625, longitude: 85.8830, timezone: 5.5 },
  { name: 'Firozabad', latitude: 27.1591, longitude: 78.3957, timezone: 5.5 },
  { name: 'Kochi', latitude: 9.9312, longitude: 76.2673, timezone: 5.5 },
  { name: 'Nellore', latitude: 14.4426, longitude: 79.9865, timezone: 5.5 },
  { name: 'Bhavnagar', latitude: 21.7645, longitude: 72.1519, timezone: 5.5 },
  { name: 'Dehradun', latitude: 30.3165, longitude: 78.0322, timezone: 5.5 },
  { name: 'Durgapur', latitude: 23.5204, longitude: 87.3119, timezone: 5.5 },
  { name: 'Asansol', latitude: 23.6739, longitude: 86.9524, timezone: 5.5 },
  { name: 'Rourkela', latitude: 22.2604, longitude: 84.8536, timezone: 5.5 },
  { name: 'Nanded', latitude: 19.1383, longitude: 77.3210, timezone: 5.5 },
  { name: 'Kolhapur', latitude: 16.7050, longitude: 74.2433, timezone: 5.5 },
  { name: 'Ajmer', latitude: 26.4499, longitude: 74.6399, timezone: 5.5 },
  { name: 'Akola', latitude: 20.7002, longitude: 77.0082, timezone: 5.5 },
  { name: 'Gulbarga', latitude: 17.1254, longitude: 76.8212, timezone: 5.5 },
  { name: 'Jamnagar', latitude: 22.4707, longitude: 70.0577, timezone: 5.5 },
  { name: 'Ujjain', latitude: 23.1765, longitude: 75.7885, timezone: 5.5 },
  { name: 'Loni', latitude: 28.7520, longitude: 77.2867, timezone: 5.5 },
  { name: 'Siliguri', latitude: 26.7271, longitude: 88.3953, timezone: 5.5 },
  { name: 'Jhansi', latitude: 25.4484, longitude: 78.5685, timezone: 5.5 },
  { name: 'Ulhasnagar', latitude: 19.2183, longitude: 73.1382, timezone: 5.5 },
  { name: 'Jammu', latitude: 32.7266, longitude: 74.8570, timezone: 5.5 },
  { name: 'Sangli-Miraj-Kupwad', latitude: 16.8524, longitude: 74.5815, timezone: 5.5 },
  { name: 'Mangalore', latitude: 12.9141, longitude: 74.8560, timezone: 5.5 },
  { name: 'Erode', latitude: 11.3514, longitude: 77.7053, timezone: 5.5 },
  { name: 'Belgaum', latitude: 15.8497, longitude: 74.4977, timezone: 5.5 },
  { name: 'Ambattur', latitude: 13.1143, longitude: 80.1548, timezone: 5.5 },
  { name: 'Tirunelveli', latitude: 8.7289, longitude: 77.7567, timezone: 5.5 },
  { name: 'Malegaon', latitude: 20.5579, longitude: 74.5287, timezone: 5.5 },
  { name: 'Gaya', latitude: 24.7955, longitude: 85.0002, timezone: 5.5 },
  { name: 'Jalgaon', latitude: 21.0077, longitude: 75.5626, timezone: 5.5 },
  { name: 'Udaipur', latitude: 24.5854, longitude: 73.7125, timezone: 5.5 },
  { name: 'Maheshtala', latitude: 22.5094, longitude: 88.2478, timezone: 5.5 },
  { name: 'Davanagere', latitude: 14.4644, longitude: 75.9218, timezone: 5.5 },
  { name: 'Kozhikode', latitude: 11.2588, longitude: 75.7804, timezone: 5.5 },
  { name: 'Kurnool', latitude: 15.8281, longitude: 78.0373, timezone: 5.5 },
  { name: 'Rajpur Sonarpur', latitude: 22.4533, longitude: 88.3895, timezone: 5.5 },
  { name: 'Rajahmundry', latitude: 17.0005, longitude: 81.8040, timezone: 5.5 },
  { name: 'Bokaro', latitude: 23.6693, longitude: 86.1511, timezone: 5.5 },
  { name: 'South Dumdum', latitude: 22.6089, longitude: 88.4047, timezone: 5.5 },
  { name: 'Bellary', latitude: 15.1394, longitude: 76.9214, timezone: 5.5 },
  { name: 'Patiala', latitude: 30.3398, longitude: 76.3869, timezone: 5.5 },
  { name: 'Gopalpur', latitude: 22.5448, longitude: 88.3211, timezone: 5.5 },
  { name: 'Agartala', latitude: 23.8315, longitude: 91.2868, timezone: 5.5 },
  { name: 'Bhagalpur', latitude: 25.2425, longitude: 86.9842, timezone: 5.5 },
  { name: 'Muzaffarnagar', latitude: 29.4727, longitude: 77.7085, timezone: 5.5 },
  { name: 'Bhatpara', latitude: 22.8697, longitude: 88.4022, timezone: 5.5 },
  { name: 'Panihati', latitude: 22.6939, longitude: 88.3742, timezone: 5.5 },
  { name: 'Latur', latitude: 18.4088, longitude: 76.5604, timezone: 5.5 },
  { name: 'Dhule', latitude: 20.9042, longitude: 74.7749, timezone: 5.5 },
  { name: 'Rohtak', latitude: 28.8955, longitude: 76.6066, timezone: 5.5 },
  { name: 'Korba', latitude: 22.3595, longitude: 82.7501, timezone: 5.5 },
  { name: 'Bhilwara', latitude: 25.3407, longitude: 74.6269, timezone: 5.5 },
  { name: 'Berhampur', latitude: 19.3149, longitude: 84.7941, timezone: 5.5 },
  { name: 'Muzaffarpur', latitude: 26.1225, longitude: 85.3906, timezone: 5.5 },
  { name: 'Ahmednagar', latitude: 19.0948, longitude: 74.7480, timezone: 5.5 },
  { name: 'Mathura', latitude: 27.4924, longitude: 77.6737, timezone: 5.5 },
  { name: 'Kollam', latitude: 8.8932, longitude: 76.6141, timezone: 5.5 },
  { name: 'Avadi', latitude: 13.1147, longitude: 80.1020, timezone: 5.5 },
  { name: 'Kadapa', latitude: 14.4673, longitude: 78.8242, timezone: 5.5 },
  { name: 'Kamarhati', latitude: 22.6708, longitude: 88.3742, timezone: 5.5 },
  { name: 'Sambalpur', latitude: 21.4669, longitude: 83.9812, timezone: 5.5 },
  { name: 'Bilaspur', latitude: 22.0797, longitude: 82.1391, timezone: 5.5 },
  { name: 'Shahjahanpur', latitude: 27.8830, longitude: 79.9010, timezone: 5.5 },
  { name: 'Satara', latitude: 17.6805, longitude: 74.0183, timezone: 5.5 },
  { name: 'Bijapur', latitude: 16.8302, longitude: 75.7100, timezone: 5.5 },
  { name: 'Rampur', latitude: 28.8152, longitude: 79.0250, timezone: 5.5 },
  { name: 'Shivamogga', latitude: 13.9299, longitude: 75.5681, timezone: 5.5 },
  { name: 'Chandrapur', latitude: 19.9615, longitude: 79.2961, timezone: 5.5 },
  { name: 'Junagadh', latitude: 21.5222, longitude: 70.4579, timezone: 5.5 },
  { name: 'Thrissur', latitude: 10.5276, longitude: 76.2144, timezone: 5.5 },
  { name: 'Alwar', latitude: 27.5530, longitude: 76.6346, timezone: 5.5 },
  { name: 'Bardhaman', latitude: 23.2324, longitude: 87.8615, timezone: 5.5 },
  { name: 'Kulti', latitude: 23.7307, longitude: 86.8454, timezone: 5.5 },
  { name: 'Kakinada', latitude: 16.9891, longitude: 82.2475, timezone: 5.5 },
  { name: 'Nizamabad', latitude: 18.6725, longitude: 78.0941, timezone: 5.5 },
  { name: 'Parbhani', latitude: 19.2608, longitude: 76.7611, timezone: 5.5 },
  { name: 'Tumkur', latitude: 13.3392, longitude: 77.1006, timezone: 5.5 },
  { name: 'Khammam', latitude: 17.2473, longitude: 80.1514, timezone: 5.5 },
  { name: 'Ozhukarai', latitude: 11.9578, longitude: 79.7765, timezone: 5.5 },
  { name: 'Bihar Sharif', latitude: 25.2000, longitude: 85.5167, timezone: 5.5 },
  { name: 'Panipat', latitude: 29.3909, longitude: 76.9635, timezone: 5.5 },
  { name: 'Darbhanga', latitude: 26.1542, longitude: 85.8918, timezone: 5.5 },
  { name: 'Bally', latitude: 22.6522, longitude: 88.3400, timezone: 5.5 },
  { name: 'Aizawl', latitude: 23.7271, longitude: 92.7176, timezone: 5.5 },
  { name: 'Dewas', latitude: 22.9676, longitude: 76.0534, timezone: 5.5 },
  { name: 'Ichalkaranji', latitude: 16.6910, longitude: 74.4607, timezone: 5.5 },
  { name: 'Karnal', latitude: 29.6857, longitude: 76.9905, timezone: 5.5 },
  { name: 'Bathinda', latitude: 30.2110, longitude: 74.9455, timezone: 5.5 },
  { name: 'Jalna', latitude: 19.8347, longitude: 75.8800, timezone: 5.5 },
  { name: 'Eluru', latitude: 16.7106, longitude: 81.0952, timezone: 5.5 },
  { name: 'Kirari Suleman Nagar', latitude: 28.7233, longitude: 77.0344, timezone: 5.5 },
  { name: 'Barasat', latitude: 22.7210, longitude: 88.4853, timezone: 5.5 },
  { name: 'Purnia', latitude: 25.7771, longitude: 87.4753, timezone: 5.5 },
  { name: 'Satna', latitude: 24.6005, longitude: 80.8322, timezone: 5.5 },
  { name: 'Mau', latitude: 25.9417, longitude: 83.5611, timezone: 5.5 },
  { name: 'Sonipat', latitude: 28.9931, longitude: 77.0151, timezone: 5.5 },
  { name: 'Farrukhabad', latitude: 27.3974, longitude: 79.5800, timezone: 5.5 },
  { name: 'Sagar', latitude: 23.8388, longitude: 78.7378, timezone: 5.5 },
  { name: 'Rourkela', latitude: 22.2604, longitude: 84.8536, timezone: 5.5 },
  { name: 'Durg', latitude: 21.1901, longitude: 81.2849, timezone: 5.5 },
  { name: 'Imphal', latitude: 24.8170, longitude: 93.9368, timezone: 5.5 },
  { name: 'Ratlam', latitude: 23.3315, longitude: 75.0367, timezone: 5.5 },
  { name: 'Hapur', latitude: 28.7306, longitude: 77.7662, timezone: 5.5 },
  { name: 'Arrah', latitude: 25.5562, longitude: 84.6666, timezone: 5.5 },
  { name: 'Karimnagar', latitude: 18.4386, longitude: 79.1288, timezone: 5.5 },
  { name: 'Anantapur', latitude: 14.6819, longitude: 77.6006, timezone: 5.5 },
  { name: 'Etawah', latitude: 26.7751, longitude: 79.0116, timezone: 5.5 },
  { name: 'Ambernath', latitude: 19.1869, longitude: 73.1558, timezone: 5.5 },
  { name: 'North Dumdum', latitude: 22.6533, longitude: 88.4178, timezone: 5.5 },
  { name: 'Bharatpur', latitude: 27.2152, longitude: 77.4909, timezone: 5.5 },
  { name: 'Begusarai', latitude: 25.4182, longitude: 86.1272, timezone: 5.5 },
  { name: 'New Delhi', latitude: 28.6139, longitude: 77.2090, timezone: 5.5 },
  { name: 'Gandhidham', latitude: 23.0800, longitude: 70.1333, timezone: 5.5 },
  { name: 'Baranagar', latitude: 22.6422, longitude: 88.3747, timezone: 5.5 },
  { name: 'Tiruvottiyur', latitude: 13.1594, longitude: 80.3006, timezone: 5.5 },
  { name: 'Puducherry', latitude: 11.9416, longitude: 79.8083, timezone: 5.5 },
  { name: 'Sikar', latitude: 27.6094, longitude: 75.1398, timezone: 5.5 },
  { name: 'Thoothukudi', latitude: 8.7642, longitude: 78.1348, timezone: 5.5 },
  { name: 'Rewa', latitude: 24.5367, longitude: 81.2961, timezone: 5.5 },
  { name: 'Mirzapur', latitude: 25.1467, longitude: 82.5690, timezone: 5.5 },
  { name: 'Raichur', latitude: 16.2160, longitude: 77.3566, timezone: 5.5 },
  { name: 'Pali', latitude: 25.7711, longitude: 73.3234, timezone: 5.5 },
  { name: 'Ramagundam', latitude: 18.7559, longitude: 79.4740, timezone: 5.5 },
  { name: 'Silchar', latitude: 24.8333, longitude: 92.7789, timezone: 5.5 },
  { name: 'Orai', latitude: 25.9933, longitude: 79.4614, timezone: 5.5 },
  { name: 'Tenali', latitude: 16.2428, longitude: 80.6420, timezone: 5.5 },
  { name: 'Jorhat', latitude: 26.7509, longitude: 94.2037, timezone: 5.5 },
  { name: 'Karawal Nagar', latitude: 28.7428, longitude: 77.2950, timezone: 5.5 },
  { name: 'Hospet', latitude: 15.2695, longitude: 76.3871, timezone: 5.5 },
  { name: 'Nangloi Jat', latitude: 28.6833, longitude: 77.0667, timezone: 5.5 },
  { name: 'Malda', latitude: 25.0096, longitude: 88.1406, timezone: 5.5 },
  { name: 'Ongole', latitude: 15.5057, longitude: 80.0499, timezone: 5.5 },
  { name: 'Deoghar', latitude: 24.4854, longitude: 86.6966, timezone: 5.5 },
  { name: 'Chapra', latitude: 25.7781, longitude: 84.7278, timezone: 5.5 },
  { name: 'Haldia', latitude: 22.0258, longitude: 88.0583, timezone: 5.5 },
  { name: 'Kanchrapara', latitude: 22.9642, longitude: 88.4317, timezone: 5.5 },
  { name: 'Dabgram', latitude: 26.7622, longitude: 88.4044, timezone: 5.5 },
  { name: 'Kharagpur', latitude: 22.3460, longitude: 87.2320, timezone: 5.5 },
  { name: 'Dindigul', latitude: 10.3673, longitude: 77.9803, timezone: 5.5 },
  { name: 'Gandhinagar', latitude: 23.2156, longitude: 72.6369, timezone: 5.5 },
  { name: 'Hospet', latitude: 15.2695, longitude: 76.3871, timezone: 5.5 },
  { name: 'Naihati', latitude: 22.8939, longitude: 88.4153, timezone: 5.5 },
  { name: 'Sambhal', latitude: 28.5850, longitude: 78.5700, timezone: 5.5 },
  { name: 'Nadiad', latitude: 22.6939, longitude: 72.8614, timezone: 5.5 },
  { name: 'Yamunanagar', latitude: 30.1290, longitude: 77.2674, timezone: 5.5 },
  { name: 'English Bazar', latitude: 25.0096, longitude: 88.1406, timezone: 5.5 },
  { name: 'Eluru', latitude: 16.7106, longitude: 81.0952, timezone: 5.5 },
  { name: 'Musaffarnagar', latitude: 29.4727, longitude: 77.7085, timezone: 5.5 },
  // International Cities
  { name: 'New York, USA', latitude: 40.7128, longitude: -74.0060, timezone: -5 },
  { name: 'London, UK', latitude: 51.5074, longitude: -0.1278, timezone: 0 },
  { name: 'Dubai, UAE', latitude: 25.2048, longitude: 55.2708, timezone: 4 },
  { name: 'Singapore', latitude: 1.3521, longitude: 103.8198, timezone: 8 },
  { name: 'Sydney, Australia', latitude: -33.8688, longitude: 151.2093, timezone: 10 },
  { name: 'Toronto, Canada', latitude: 43.6532, longitude: -79.3832, timezone: -5 },
  { name: 'Los Angeles, USA', latitude: 34.0522, longitude: -118.2437, timezone: -8 },
  { name: 'Kathmandu, Nepal', latitude: 27.7172, longitude: 85.3240, timezone: 5.75 },
  { name: 'Colombo, Sri Lanka', latitude: 6.9271, longitude: 79.8612, timezone: 5.5 },
  { name: 'Dhaka, Bangladesh', latitude: 23.8103, longitude: 90.4125, timezone: 6 },
  { name: 'Karachi, Pakistan', latitude: 24.8607, longitude: 67.0011, timezone: 5 },
  { name: 'Bangkok, Thailand', latitude: 13.7563, longitude: 100.5018, timezone: 7 },
  { name: 'Tokyo, Japan', latitude: 35.6762, longitude: 139.6503, timezone: 9 },
  { name: 'Hong Kong', latitude: 22.3193, longitude: 114.1694, timezone: 8 },
  { name: 'Paris, France', latitude: 48.8566, longitude: 2.3522, timezone: 1 },
  { name: 'Berlin, Germany', latitude: 52.5200, longitude: 13.4050, timezone: 1 },
  { name: 'Moscow, Russia', latitude: 55.7558, longitude: 37.6173, timezone: 3 },
  { name: 'Cape Town, South Africa', latitude: -33.9249, longitude: 18.4241, timezone: 2 },
  { name: 'Mauritius', latitude: -20.1609, longitude: 57.5012, timezone: 4 },
  { name: 'Fiji', latitude: -17.7134, longitude: 178.0650, timezone: 12 },
  { name: 'Trinidad', latitude: 10.6918, longitude: -61.2225, timezone: -4 },
  { name: 'Guyana', latitude: 6.7833, longitude: -58.1833, timezone: -4 },
  { name: 'Suriname', latitude: 5.8520, longitude: -55.2038, timezone: -3 },
];

// ============================================================================
// Default Birth Data (Swami Vivekananda)
// ============================================================================

const DEFAULT_BIRTH_DATA: BirthData = {
  name: 'Swami Vivekananda',
  date: '1863-01-12',
  time: '06:33',
  latitude: 22.5726,
  longitude: 88.3639,
  timezone: 5.5,
  place: 'Kolkata, India',
};

// ============================================================================
// Main Vedic Astrology Component
// ============================================================================

const VedicAstrology: React.FC = () => {
  // State
  const [birthData, setBirthData] = useState<BirthData>(DEFAULT_BIRTH_DATA);
  const [calculations, setCalculations] = useState<ChartCalculations | null>(null);
  const [chartStyle, setChartStyle] = useState<'north' | 'south'>('south');
  const [activeTab, setActiveTab] = useState<'chart' | 'planets' | 'dasha' | 'yogas' | 'divisional'>('chart');
  const [divisionalChart, setDivisionalChart] = useState<number>(1);
  const [selectedCity, setSelectedCity] = useState<string>('');

  // Calculate chart data
  const calculateChart = useCallback(() => {
    try {
      const [year, month, day] = birthData.date.split('-').map(Number);
      const [hour, minute] = birthData.time.split(':').map(Number);

      // Convert local time to UTC
      const utcHour = hour - birthData.timezone;
      const utcMinute = minute;

      // Calculate Julian Day
      const jd = calculateJulianDay(year, month, day, utcHour, utcMinute, 0);

      // Calculate Ayanamsa
      const ayanamsa = calculateLahiriAyanamsa(jd);

      // Calculate planetary positions (tropical)
      const sunTropical = calculateSunLongitude(jd);
      const moonTropical = calculateMoonLongitude(jd);
      const rahuTropical = calculateRahuLongitude(jd);
      const ketuTropical = calculateKetuLongitude(jd);

      const marsTropical = calculatePlanetLongitude(jd, 'mars');
      const mercuryTropical = calculatePlanetLongitude(jd, 'mercury');
      const jupiterTropical = calculatePlanetLongitude(jd, 'jupiter');
      const venusTropical = calculatePlanetLongitude(jd, 'venus');
      const saturnTropical = calculatePlanetLongitude(jd, 'saturn');

      // Convert to sidereal
      const sunSidereal = tropicalToSidereal(sunTropical, ayanamsa);
      const moonSidereal = tropicalToSidereal(moonTropical, ayanamsa);
      const rahuSidereal = tropicalToSidereal(rahuTropical, ayanamsa);
      const ketuSidereal = tropicalToSidereal(ketuTropical, ayanamsa);
      const marsSidereal = tropicalToSidereal(marsTropical.longitude, ayanamsa);
      const mercurySidereal = tropicalToSidereal(mercuryTropical.longitude, ayanamsa);
      const jupiterSidereal = tropicalToSidereal(jupiterTropical.longitude, ayanamsa);
      const venusSidereal = tropicalToSidereal(venusTropical.longitude, ayanamsa);
      const saturnSidereal = tropicalToSidereal(saturnTropical.longitude, ayanamsa);

      // Calculate Ascendant
      const { ascendant: ascendantTropical } = calculateAscendant(jd, birthData.latitude, birthData.longitude);
      const ascendantSidereal = tropicalToSidereal(ascendantTropical, ayanamsa);
      const ascendantSign = Math.floor(ascendantSidereal / 30);

      // Calculate planetary data
      const planetData = [
        { name: 'Sun', tropical: sunTropical, sidereal: sunSidereal, speed: 0.9856 },
        { name: 'Moon', tropical: moonTropical, sidereal: moonSidereal, speed: 13.1764 },
        { name: 'Mars', tropical: marsTropical.longitude, sidereal: marsSidereal, isRetrograde: marsTropical.isRetrograde, speed: 0.524 },
        { name: 'Mercury', tropical: mercuryTropical.longitude, sidereal: mercurySidereal, isRetrograde: mercuryTropical.isRetrograde, speed: 1.383 },
        { name: 'Jupiter', tropical: jupiterTropical.longitude, sidereal: jupiterSidereal, isRetrograde: jupiterTropical.isRetrograde, speed: 0.083 },
        { name: 'Venus', tropical: venusTropical.longitude, sidereal: venusSidereal, isRetrograde: venusTropical.isRetrograde, speed: 1.2 },
        { name: 'Saturn', tropical: saturnTropical.longitude, sidereal: saturnSidereal, isRetrograde: saturnTropical.isRetrograde, speed: 0.033 },
        { name: 'Rahu', tropical: rahuTropical, sidereal: rahuSidereal, isRetrograde: true, speed: -0.053 },
        { name: 'Ketu', tropical: ketuTropical, sidereal: ketuSidereal, isRetrograde: true, speed: -0.053 },
      ];

      const calculatedPlanets: CalculatedPlanet[] = planetData.map((p) => {
        const sign = Math.floor(p.sidereal / 30);
        const degreeInSign = p.sidereal % 30;
        const house = getHouseNumber(p.sidereal, ascendantSidereal);
        const nakshatraInfo = getNakshatra(p.sidereal);
        const navamsaSign = Math.floor(calculateNavamsa(p.sidereal) / 30);

        return {
          name: p.name,
          tropicalLongitude: p.tropical,
          siderealLongitude: p.sidereal,
          sign,
          degreeInSign,
          house,
          nakshatra: nakshatraInfo.nakshatra,
          nakshatraName: nakshatraInfo.name,
          nakshatraLord: nakshatraInfo.lord,
          pada: nakshatraInfo.pada,
          navamsaSign,
          isRetrograde: p.isRetrograde || false,
          speed: p.speed,
        };
      });

      // Calculate Vimshottari Dasha
      const dasha = calculateVimshottariDasha(moonSidereal, new Date(year, month - 1, day, hour, minute));

      // Detect Yogas
      const planetLongitudes: Record<string, number> = {};
      calculatedPlanets.forEach((p) => {
        planetLongitudes[p.name] = p.siderealLongitude;
      });
      const yogas = detectYogas(planetLongitudes, ascendantSidereal);

      // Get ascendant nakshatra
      const ascNakshatra = getNakshatra(ascendantSidereal);

      setCalculations({
        ascendant: ascendantSidereal,
        ascendantSign,
        ascendantNakshatra: ascNakshatra.name,
        ayanamsa,
        planets: calculatedPlanets,
        dasha,
        yogas,
      });
    } catch (error) {
      console.error('Error calculating chart:', error);
    }
  }, [birthData]);

  // Initial calculation
  useEffect(() => {
    calculateChart();
  }, [calculateChart]);

  // Handle city selection
  const handleCitySelect = (cityName: string) => {
    const city = CITIES.find((c) => c.name === cityName);
    if (city) {
      setBirthData({
        ...birthData,
        latitude: city.latitude,
        longitude: city.longitude,
        timezone: city.timezone,
        place: city.name,
      });
      setSelectedCity(cityName);
    }
  };

  // Format date for display
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Get chart data for display
  const getChartData = (division: number = 1): ChartData => {
    if (!calculations) {
      return { ascendant: 0, ascendantSign: 0, planets: [] };
    }

    const planets: PlanetData[] = calculations.planets.map((p) => {
      let longitude = p.siderealLongitude;
      if (division !== 1) {
        longitude = calculateNavamsa(p.siderealLongitude);
      }
      const sign = Math.floor(longitude / 30);
      const house = division === 1 ? p.house : getHouseNumber(longitude, calculations.ascendant);

      return {
        name: p.name,
        longitude,
        sign,
        degreeInSign: longitude % 30,
        house,
        isRetrograde: p.isRetrograde,
      };
    });

    return {
      ascendant: division === 1 ? calculations.ascendant : calculateNavamsa(calculations.ascendant),
      ascendantSign: division === 1 ? calculations.ascendantSign : Math.floor(calculateNavamsa(calculations.ascendant) / 30),
      planets,
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-sm border-b border-amber-500/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center">
                <span className="text-2xl">ॐ</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                  Parashara Light
                </h1>
                <p className="text-xs text-amber-200/70">Vedic Astrology Software</p>
              </div>
            </div>
            <div className="text-right text-sm opacity-70">
              <p>Professional Jyotish</p>
              <p className="text-xs">Chart Calculation System</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Birth Data Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-amber-500/20 p-4 sticky top-4">
              <h2 className="text-lg font-semibold mb-4 text-amber-400 flex items-center gap-2">
                <span>📅</span> Birth Details
              </h2>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-medium opacity-70 mb-1">Name</label>
                  <input
                    type="text"
                    value={birthData.name}
                    onChange={(e) => setBirthData({ ...birthData, name: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-xs font-medium opacity-70 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={birthData.date}
                    onChange={(e) => setBirthData({ ...birthData, date: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                {/* Time */}
                <div>
                  <label className="block text-xs font-medium opacity-70 mb-1">Time of Birth</label>
                  <input
                    type="time"
                    value={birthData.time}
                    onChange={(e) => setBirthData({ ...birthData, time: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                {/* City Selection */}
                <div>
                  <label className="block text-xs font-medium opacity-70 mb-1">Place of Birth</label>
                  <select
                    value={selectedCity}
                    onChange={(e) => handleCitySelect(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500/50"
                  >
                    <option value="">Select City</option>
                    {CITIES.map((city) => (
                      <option key={city.name} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Coordinates */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium opacity-70 mb-1">Latitude</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={birthData.latitude.toFixed(4)}
                      onChange={(e) => setBirthData({ ...birthData, latitude: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-white/10 border border-white/20 rounded px-2 py-2 text-sm focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium opacity-70 mb-1">Longitude</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={birthData.longitude.toFixed(4)}
                      onChange={(e) => setBirthData({ ...birthData, longitude: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-white/10 border border-white/20 rounded px-2 py-2 text-sm focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                </div>

                {/* Timezone */}
                <div>
                  <label className="block text-xs font-medium opacity-70 mb-1">Timezone (UTC offset)</label>
                  <input
                    type="number"
                    step="0.25"
                    value={birthData.timezone}
                    onChange={(e) => setBirthData({ ...birthData, timezone: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                {/* Calculate Button */}
                <button
                  onClick={calculateChart}
                  className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-medium py-2.5 rounded-lg transition-all transform hover:scale-[1.02]"
                >
                  Calculate Chart
                </button>

                {/* Current Details Summary */}
                {calculations && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="text-xs space-y-1 opacity-80">
                      <p><span className="opacity-60">Ayanamsa:</span> {calculations.ayanamsa.toFixed(4)}°</p>
                      <p><span className="opacity-60">Lagna:</span> {ZODIAC_SIGNS[calculations.ascendantSign].name} {calculations.ascendant.toFixed(2)}°</p>
                      <p><span className="opacity-60">Nakshatra:</span> {calculations.ascendantNakshatra}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Tabs */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-amber-500/20 mb-6 overflow-hidden">
              <div className="flex border-b border-amber-500/20">
                {[
                  { id: 'chart', label: 'Charts', icon: '📊' },
                  { id: 'planets', label: 'Planets', icon: '🪐' },
                  { id: 'dasha', label: 'Dasha', icon: '⏰' },
                  { id: 'yogas', label: 'Yogas', icon: '✨' },
                  { id: 'divisional', label: 'Divisional', icon: '🔮' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-amber-600/20 text-amber-400 border-b-2 border-amber-500'
                        : 'opacity-70 hover:opacity-100 hover:bg-white/5'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {/* Chart Tab */}
                {activeTab === 'chart' && calculations && (
                  <div className="space-y-6">
                    <ChartSelector
                      data={getChartData()}
                      chartStyle={chartStyle}
                      onStyleChange={setChartStyle}
                      size={450}
                    />

                    {/* Quick Planet Positions */}
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mt-6">
                      {calculations.planets.map((planet) => (
                        <div
                          key={planet.name}
                          className="bg-white/5 rounded-lg p-3 border border-white/10 text-center"
                        >
                          <p className="text-xs opacity-60 mb-1">{planet.name}</p>
                          <p className="font-bold text-amber-400">{ZODIAC_SIGNS[planet.sign].short}</p>
                          <p className="text-xs opacity-70">{planet.degreeInSign.toFixed(1)}°</p>
                          <p className="text-xs opacity-50 mt-1">H{planet.house}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Planets Tab */}
                {activeTab === 'planets' && calculations && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-amber-500/30">
                          <th className="text-left py-3 px-4 font-semibold text-amber-400">Planet</th>
                          <th className="text-left py-3 px-4 font-semibold">Sign</th>
                          <th className="text-left py-3 px-4 font-semibold">Degree</th>
                          <th className="text-left py-3 px-4 font-semibold">House</th>
                          <th className="text-left py-3 px-4 font-semibold">Nakshatra</th>
                          <th className="text-left py-3 px-4 font-semibold">Pada</th>
                          <th className="text-left py-3 px-4 font-semibold">Lord</th>
                          <th className="text-left py-3 px-4 font-semibold">Navamsa</th>
                          <th className="text-left py-3 px-4 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Lagna Row */}
                        <tr className="border-b border-white/10 bg-amber-500/10">
                          <td className="py-3 px-4 font-bold text-amber-400">Lagna</td>
                          <td className="py-3 px-4">{ZODIAC_SIGNS[calculations.ascendantSign].name}</td>
                          <td className="py-3 px-4">{calculations.ascendant.toFixed(2)}°</td>
                          <td className="py-3 px-4">1</td>
                          <td className="py-3 px-4">{calculations.ascendantNakshatra}</td>
                          <td className="py-3 px-4">-</td>
                          <td className="py-3 px-4">{getSignLord(calculations.ascendantSign)}</td>
                          <td className="py-3 px-4">{ZODIAC_SIGNS[Math.floor(calculateNavamsa(calculations.ascendant) / 30)].name}</td>
                          <td className="py-3 px-4">-</td>
                        </tr>
                        {/* Planet Rows */}
                        {calculations.planets.map((planet) => (
                          <tr key={planet.name} className="border-b border-white/10">
                            <td className="py-3 px-4 font-medium" style={{ color: `var(--planet-${planet.name.toLowerCase()})` }}>
                              {planet.name}
                              {planet.isRetrograde && <span className="text-xs ml-1">°R</span>}
                            </td>
                            <td className="py-3 px-4">{ZODIAC_SIGNS[planet.sign].name}</td>
                            <td className="py-3 px-4">{planet.degreeInSign.toFixed(2)}°</td>
                            <td className="py-3 px-4">{planet.house}</td>
                            <td className="py-3 px-4">{planet.nakshatraName}</td>
                            <td className="py-3 px-4">{planet.pada}</td>
                            <td className="py-3 px-4 opacity-70">{planet.nakshatraLord}</td>
                            <td className="py-3 px-4">{ZODIAC_SIGNS[planet.navamsaSign].name}</td>
                            <td className="py-3 px-4">
                              {planet.isRetrograde ? (
                                <span className="text-red-400 text-xs">Retrograde</span>
                              ) : (
                                <span className="text-green-400 text-xs">Direct</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Dasha Tab */}
                {activeTab === 'dasha' && calculations && (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-lg p-4 border border-amber-500/30">
                      <h3 className="text-lg font-semibold text-amber-400 mb-2">Vimshottari Dasha</h3>
                      <p className="text-sm opacity-80">
                        Total Cycle: 120 years | Based on Moon's Nakshatra at birth
                      </p>
                    </div>

                    {/* Current Mahadasha */}
                    <div className="bg-white/5 rounded-lg p-4 border border-amber-500/20">
                      <h4 className="font-semibold text-amber-400 mb-3">Current Mahadasha</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {calculations.dasha.mahadashas
                          .filter((d) => d.isCurrent)
                          .map((dasha, idx) => (
                            <div key={idx} className="bg-amber-500/10 rounded-lg p-3 border border-amber-500/30">
                              <p className="font-bold text-amber-400">{dasha.lord}</p>
                              <p className="text-xs opacity-70">{formatDate(dasha.startDate)}</p>
                              <p className="text-xs opacity-70">to {formatDate(dasha.endDate)}</p>
                              <p className="text-xs opacity-50 mt-1">{dasha.years.toFixed(1)} years</p>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* All Mahadashas */}
                    <div className="bg-white/5 rounded-lg p-4 border border-amber-500/20">
                      <h4 className="font-semibold text-amber-400 mb-3">Dasha Timeline</h4>
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {calculations.dasha.mahadashas.slice(0, 20).map((dasha, idx) => (
                          <div
                            key={idx}
                            className={`flex items-center justify-between p-3 rounded ${
                              dasha.isCurrent ? 'bg-amber-500/20 border border-amber-500/40' : 'bg-white/5'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className={`font-medium ${dasha.isCurrent ? 'text-amber-400' : ''}`}>
                                {dasha.lord}
                              </span>
                              {dasha.isCurrent && (
                                <span className="text-xs bg-amber-500 text-black px-2 py-0.5 rounded">Current</span>
                              )}
                            </div>
                            <div className="text-xs opacity-70 text-right">
                              <p>{formatDate(dasha.startDate)}</p>
                              <p>{formatDate(dasha.endDate)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Antardasha */}
                    <div className="bg-white/5 rounded-lg p-4 border border-amber-500/20">
                      <h4 className="font-semibold text-amber-400 mb-3">Antardasha (Sub-periods)</h4>
                      <p className="text-xs opacity-60 mb-3">
                        Click on a Mahadasha to view its Antardasha periods
                      </p>
                      <div className="space-y-2">
                        {calculations.dasha.mahadashas
                          .filter((d) => d.isCurrent)
                          .map((md, idx) => {
                            const antardashas = calculateAntardasha(md.lord, md.startDate, md.years);
                            return (
                              <div key={idx}>
                                <p className="text-sm font-medium mb-2">{md.lord} Mahadasha:</p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                  {antardashas.map((ad, adIdx) => (
                                    <div
                                      key={adIdx}
                                      className="bg-white/5 rounded p-2 text-xs border border-white/10"
                                    >
                                      <span className="font-medium">{ad.lord}</span>
                                      <span className="opacity-60 ml-2">
                                        {ad.duration.toFixed(2)} yrs
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Yogas Tab */}
                {activeTab === 'yogas' && calculations && (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-lg p-4 border border-amber-500/30">
                      <h3 className="text-lg font-semibold text-amber-400 mb-2">Planetary Yogas</h3>
                      <p className="text-sm opacity-80">
                        Auspicious combinations formed by planetary positions
                      </p>
                    </div>

                    <div className="grid gap-3">
                      {calculations.yogas.map((yoga, idx) => (
                        <div
                          key={idx}
                          className={`p-4 rounded-lg border ${
                            yoga.present
                              ? 'bg-green-500/10 border-green-500/30'
                              : 'bg-white/5 border-white/10 opacity-50'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className={`font-semibold ${yoga.present ? 'text-green-400' : ''}`}>
                                {yoga.name}
                              </h4>
                              <p className="text-sm opacity-70 mt-1">{yoga.description}</p>
                            </div>
                            {yoga.present ? (
                              <span className="text-green-400 text-xl">✓</span>
                            ) : (
                              <span className="text-white/30 text-xl">✗</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Divisional Charts Tab */}
                {activeTab === 'divisional' && calculations && (
                  <div className="space-y-6">
                    <div className="flex flex-wrap gap-2">
                      {[
                        { num: 1, name: 'Rasi' },
                        { num: 2, name: 'Hora' },
                        { num: 3, name: 'Drekkana' },
                        { num: 4, name: 'Chaturthamsa' },
                        { num: 7, name: 'Saptamsa' },
                        { num: 9, name: 'Navamsa' },
                        { num: 10, name: 'Dasamsa' },
                        { num: 12, name: 'Dwadasamsa' },
                      ].map((div) => (
                        <button
                          key={div.num}
                          onClick={() => setDivisionalChart(div.num)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            divisionalChart === div.num
                              ? 'bg-amber-600 text-white'
                              : 'bg-white/10 hover:bg-white/20'
                          }`}
                        >
                          D{div.num} {div.name}
                        </button>
                      ))}
                    </div>

                    <div className="flex justify-center">
                      <ChartSelector
                        data={getChartData(divisionalChart)}
                        chartStyle={chartStyle}
                        onStyleChange={setChartStyle}
                        size={400}
                        divisional={divisionalChart}
                      />
                    </div>

                    {/* Divisional Chart Planet Positions */}
                    <div className="bg-white/5 rounded-lg p-4 border border-amber-500/20">
                      <h4 className="font-semibold text-amber-400 mb-3">
                        Planet Positions in D{divisionalChart}
                      </h4>
                      <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                        {calculations.planets.map((planet) => {
                          const divLongitude = calculateNavamsa(planet.siderealLongitude);
                          const divSign = Math.floor(divLongitude / 30);
                          return (
                            <div
                              key={planet.name}
                              className="bg-white/5 rounded-lg p-3 border border-white/10 text-center"
                            >
                              <p className="text-xs opacity-60 mb-1">{planet.name}</p>
                              <p className="font-bold text-amber-400">{ZODIAC_SIGNS[divSign].short}</p>
                              <p className="text-xs opacity-70">{(divLongitude % 30).toFixed(1)}°</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Info */}
            {calculations && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nakshatra Info */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-amber-500/20 p-4">
                  <h3 className="text-lg font-semibold text-amber-400 mb-3">Moon Nakshatra</h3>
                  {(() => {
                    const moon = calculations.planets.find((p) => p.name === 'Moon');
                    if (!moon) return null;
                    const nakshatraInfo = NAKSHATRAS[moon.nakshatra];
                    return (
                      <div className="space-y-2 text-sm">
                        <p><span className="opacity-60">Name:</span> {nakshatraInfo.name}</p>
                        <p><span className="opacity-60">Lord:</span> {nakshatraInfo.lord}</p>
                        <p><span className="opacity-60">Deity:</span> {nakshatraInfo.deity}</p>
                        <p><span className="opacity-60">Symbol:</span> {nakshatraInfo.symbol}</p>
                        <p><span className="opacity-60">Pada:</span> {moon.pada}</p>
                      </div>
                    );
                  })()}
                </div>

                {/* Panchang Info */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-amber-500/20 p-4">
                  <h3 className="text-lg font-semibold text-amber-400 mb-3">Panchang Details</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="opacity-60">Tithi:</span> Calculating...</p>
                    <p><span className="opacity-60">Vara:</span> Calculating...</p>
                    <p><span className="opacity-60">Nakshatra:</span> {calculations.planets.find(p => p.name === 'Moon')?.nakshatraName}</p>
                    <p><span className="opacity-60">Yoga:</span> Calculating...</p>
                    <p><span className="opacity-60">Karana:</span> Calculating...</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-amber-500/20">
        <div className="container mx-auto px-4 text-center text-sm opacity-60">
          <p>Parashara Light - Vedic Astrology Software</p>
          <p className="text-xs mt-1">Calculations based on Lahiri Ayanamsa and Swiss Ephemeris algorithms</p>
        </div>
      </footer>
    </div>
  );
};

export default VedicAstrology;
