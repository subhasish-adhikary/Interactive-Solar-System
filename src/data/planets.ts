import { CelestialBody } from '../types';

export const SUN_DATA: CelestialBody = {
  id: 'sun',
  name: 'Sun',
  type: 'Star',
  diameterKm: 1392700,
  relativeSizeEarth: 109.2,
  distanceFromSunAU: 0,
  distanceFromSunMillionKm: 0,
  orbitalPeriodDays: 0,
  orbitalPeriodYears: 0,
  rotationPeriodHours: 600, // ~25-35 Earth days differential rotation
  moonsCount: 0,
  avgTempCelsius: 5500,
  temperatureRange: '5,500°C (Photosphere) to 15,000,000°C (Core)',
  surfaceGravityMs2: 274.0,
  relativeGravity: 27.96,
  color: '#FDB813',
  accentColor: '#FF6B00',
  glowColor: 'rgba(255, 170, 0, 0.65)',
  orbitRadius: 0,
  visualRadius: 36,
  speedFactor: 0,
  overview:
    'The Sun is the G-type main-sequence star at the center of our solar system. Its enormous gravitational pull holds all planets, asteroids, and comets in orbital sync, bathing the system in electromagnetic energy and solar wind.',
  funFact:
    'The Sun contains 99.86% of all mass in the Solar System. Approximately 1.3 million planet Earths could fit inside its volume.',
  atmosphereComposition: ['73% Hydrogen', '25% Helium', '1% Oxygen, Carbon, Neon & Iron'],
  internalStructure: [
    {
      name: 'Core',
      depth: '0 - 175,000 km',
      description: 'Nuclear fusion engine fusing 600 million tons of hydrogen into helium every second at 15M°C.',
      color: '#FFF8E7',
    },
    {
      name: 'Radiative Zone',
      depth: '175,000 - 490,000 km',
      description: 'Energy slowly bounces outward through dense plasma photons; a single photon takes ~100,000 years to escape!',
      color: '#FFA500',
    },
    {
      name: 'Convective Zone',
      depth: '490,000 - 696,000 km',
      description: 'Boiling plasma currents carry thermal energy up to the solar surface like giant convection bubbles.',
      color: '#FF4500',
    },
    {
      name: 'Photosphere & Corona',
      depth: 'Surface to Outer Atmosphere',
      description: 'The visible surface exhibiting sunspots and solar flares, surrounded by the scorching multi-million degree corona.',
      color: '#FFD700',
    },
  ],
  notableMissions: [
    { name: 'Parker Solar Probe', year: '2018–Present', agency: 'NASA', highlight: 'Fastest human-made object, swooping within 6.1M km of the Sun.' },
    { name: 'SOHO', year: '1995–Present', agency: 'ESA / NASA', highlight: 'Discovered over 4,000 comets and monitors solar weather 24/7.' },
    { name: 'Solar Orbiter', year: '2020–Present', agency: 'ESA', highlight: 'Capturing the closest images ever taken of the Sun’s polar regions.' },
  ],
};

export const PLANETS_DATA: CelestialBody[] = [
  {
    id: 'mercury',
    name: 'Mercury',
    type: 'Terrestrial Planet',
    diameterKm: 4879,
    relativeSizeEarth: 0.38,
    distanceFromSunAU: 0.39,
    distanceFromSunMillionKm: 57.9,
    orbitalPeriodDays: 88.0,
    orbitalPeriodYears: 0.24,
    rotationPeriodHours: 1407.6, // 58.6 Earth days
    moonsCount: 0,
    avgTempCelsius: 167,
    temperatureRange: '-180°C (Night) to 430°C (Day)',
    surfaceGravityMs2: 3.7,
    relativeGravity: 0.38,
    color: '#A5A5A5',
    accentColor: '#D3D3D3',
    glowColor: 'rgba(180, 180, 180, 0.4)',
    orbitRadius: 75,
    visualRadius: 7,
    speedFactor: 365.25 / 88.0, // ~4.15
    overview:
      'The smallest planet in the solar system and closest to the Sun. Lacking a substantial atmosphere to regulate warmth, Mercury swings wildly between searing heat by day and sub-zero freezing by night.',
    funFact:
      'A year on Mercury is only 88 Earth days, but one solar day (from sunrise to sunrise) takes 176 Earth days!',
    atmosphereComposition: ['42% Molecular Oxygen', '29% Sodium', '22% Hydrogen', '6% Helium'],
    internalStructure: [
      { name: 'Metallic Core', depth: 'Radius ~2,000 km', description: 'Huge iron-nickel core making up ~85% of the planet’s radius.', color: '#71717A' },
      { name: 'Silicate Mantle', depth: 'Thickness ~400 km', description: 'Dense silicate rock mantle compressed beneath high gravity.', color: '#A1A1AA' },
      { name: 'Silicate Crust', depth: 'Thickness ~35 km', description: 'Heavily cratered volcanic surface littered with scarps and impact basins.', color: '#D4D4D8' },
    ],
    notableMissions: [
      { name: 'MESSENGER', year: '2004–2015', agency: 'NASA', highlight: 'First probe to orbit Mercury; discovered water ice in shadowed craters.' },
      { name: 'BepiColombo', year: '2018–Present', agency: 'ESA / JAXA', highlight: 'Dual-orbiter mission scheduled for orbital insertion in 2026.' },
      { name: 'Mariner 10', year: '1973', agency: 'NASA', highlight: 'First probe to visit Mercury, capturing the first close-up flyby imagery.' },
    ],
  },
  {
    id: 'venus',
    name: 'Venus',
    type: 'Terrestrial Planet',
    diameterKm: 12104,
    relativeSizeEarth: 0.95,
    distanceFromSunAU: 0.72,
    distanceFromSunMillionKm: 108.2,
    orbitalPeriodDays: 224.7,
    orbitalPeriodYears: 0.62,
    rotationPeriodHours: -5832.5, // 243 Earth days retrograde
    moonsCount: 0,
    avgTempCelsius: 464,
    temperatureRange: 'Uniform ~464°C across entire surface',
    surfaceGravityMs2: 8.87,
    relativeGravity: 0.9,
    color: '#E3BB7B',
    accentColor: '#F7D08A',
    glowColor: 'rgba(247, 208, 138, 0.45)',
    orbitRadius: 115,
    visualRadius: 11,
    speedFactor: 365.25 / 224.7, // ~1.62
    overview:
      'Often called Earth’s twin in dimensions, Venus is enveloped in dense carbon dioxide with reflective clouds of corrosive sulfuric acid. Runaway greenhouse heating makes it the hottest planet in the Solar System.',
    funFact:
      'Venus spins in retrograde (clockwise), meaning the Sun rises in the west and sets in the east.',
    atmosphereComposition: ['96.5% Carbon Dioxide', '3.5% Nitrogen', 'Traces of Sulfur Dioxide & Argon'],
    internalStructure: [
      { name: 'Iron-Nickel Core', depth: 'Radius ~3,200 km', description: 'Partially molten metallic core with minimal planetary magnetic field.', color: '#78350F' },
      { name: 'Rocky Mantle', depth: 'Thickness ~3,000 km', description: 'Viscous hot silicate mantle with continuous volcanic recycling.', color: '#D97706' },
      { name: 'Basaltic Crust', depth: 'Thickness ~20-50 km', description: 'Dominated by volcanic plains, lava flows, and jagged coronae structures.', color: '#FBBF24' },
    ],
    notableMissions: [
      { name: 'Magellan', year: '1989–1994', agency: 'NASA', highlight: 'Radar-mapped 98% of Venus’s surface through the impenetrable cloud deck.' },
      { name: 'Venera 13', year: '1981', agency: 'Soviet Union', highlight: 'Landed on the surface, survived 127 minutes, and sent the first color surface photos.' },
      { name: 'Akatsuki', year: '2010–Present', agency: 'JAXA', highlight: 'Studying atmospheric super-rotation and cloud dynamics.' },
    ],
  },
  {
    id: 'earth',
    name: 'Earth',
    type: 'Terrestrial Planet',
    diameterKm: 12742,
    relativeSizeEarth: 1.0,
    distanceFromSunAU: 1.0,
    distanceFromSunMillionKm: 149.6,
    orbitalPeriodDays: 365.25,
    orbitalPeriodYears: 1.0,
    rotationPeriodHours: 24.0,
    moonsCount: 1,
    avgTempCelsius: 15,
    temperatureRange: '-89°C (Antarctica) to 58°C (Deserts)',
    surfaceGravityMs2: 9.8,
    relativeGravity: 1.0,
    color: '#3B82F6',
    accentColor: '#10B981',
    glowColor: 'rgba(59, 130, 246, 0.5)',
    orbitRadius: 165,
    visualRadius: 12,
    speedFactor: 1.0,
    overview:
      'The vibrant third rock from the Sun and our home world. Earth is the only known celestial object to support oceans of liquid surface water, an oxygen-rich atmosphere, and thriving biospheres.',
    funFact:
      'Earth’s magnetic field (magnetosphere) shields our atmosphere and all living organisms from lethal solar radiation and cosmic rays.',
    atmosphereComposition: ['78.08% Nitrogen', '20.95% Oxygen', '0.93% Argon', '0.04% Carbon Dioxide'],
    internalStructure: [
      { name: 'Solid Inner Core', depth: 'Radius ~1,220 km', description: 'Solid iron-nickel sphere reaching temperatures as hot as the Sun’s surface (5,400°C).', color: '#FEF08A' },
      { name: 'Liquid Outer Core', depth: 'Thickness ~2,260 km', description: 'Churning molten iron and nickel generating Earth’s protective magnetic field.', color: '#F97316' },
      { name: 'Silicate Mantle', depth: 'Thickness ~2,900 km', description: 'Semi-solid ductile rock driving plate tectonics through slow convection.', color: '#B45309' },
      { name: 'Oceanic & Continental Crust', depth: 'Thickness 5–70 km', description: 'Fragile surface crust harboring oceans, continents, and all known life.', color: '#10B981' },
    ],
    notableMissions: [
      { name: 'International Space Station', year: '1998–Present', agency: 'NASA / ESA / JAXA / Roscosmos / CSA', highlight: 'Continuously inhabited orbital laboratory conducting microgravity science.' },
      { name: 'Apollo 11', year: '1969', agency: 'NASA', highlight: 'First crewed lunar landing, placing humanity on another celestial body.' },
      { name: 'Landsat / Sentinel', year: '1972–Present', agency: 'NASA / ESA', highlight: 'Decades of global climate, vegetation, and ocean monitoring.' },
    ],
  },
  {
    id: 'mars',
    name: 'Mars',
    type: 'Terrestrial Planet',
    diameterKm: 6779,
    relativeSizeEarth: 0.53,
    distanceFromSunAU: 1.52,
    distanceFromSunMillionKm: 227.9,
    orbitalPeriodDays: 687.0,
    orbitalPeriodYears: 1.88,
    rotationPeriodHours: 24.6,
    moonsCount: 2, // Phobos & Deimos
    avgTempCelsius: -65,
    temperatureRange: '-140°C (Winter poles) to 20°C (Summer equator)',
    surfaceGravityMs2: 3.72,
    relativeGravity: 0.38,
    color: '#E05A47',
    accentColor: '#FF7A66',
    glowColor: 'rgba(224, 90, 71, 0.45)',
    orbitRadius: 215,
    visualRadius: 8.5,
    speedFactor: 365.25 / 687.0, // ~0.53
    overview:
      'The "Red Planet" gets its rusty crimson tint from oxidized iron across its desert soil. Mars hosts the solar system’s largest canyon (Valles Marineris) and tallest shield volcano (Olympus Mons).',
    funFact:
      'Sunsets on Mars appear distinctly blue because fine atmospheric dust scatters blue light more effectively than red light.',
    atmosphereComposition: ['95.3% Carbon Dioxide', '2.6% Nitrogen', '1.9% Argon', '0.16% Oxygen'],
    internalStructure: [
      { name: 'Metallic Core', depth: 'Radius ~1,800 km', description: 'Partially molten core enriched with sulfur, nickel, and iron.', color: '#7F1D1D' },
      { name: 'Silicate Mantle', depth: 'Thickness ~1,500 km', description: 'Once active volcanic mantle that formed towering shield volcanoes.', color: '#C2410C' },
      { name: 'Basaltic Crust', depth: 'Thickness 20–80 km', description: 'Enriched in iron oxide rust with dry riverbeds from an ancient wetter era.', color: '#EA580C' },
    ],
    notableMissions: [
      { name: 'Perseverance & Ingenuity', year: '2021–Present', agency: 'NASA', highlight: 'Searching for ancient microbial biosignatures; Ingenuity made 72 flights on Mars.' },
      { name: 'Curiosity Rover', year: '2012–Present', agency: 'NASA', highlight: 'Traversing Gale Crater, proving ancient Mars had freshwater lakes.' },
      { name: 'Mars Express', year: '2003–Present', agency: 'ESA', highlight: 'Confirmed vast subsurface water ice reserves at the Martian poles.' },
    ],
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    type: 'Gas Giant',
    diameterKm: 139820,
    relativeSizeEarth: 11.0,
    distanceFromSunAU: 5.2,
    distanceFromSunMillionKm: 778.6,
    orbitalPeriodDays: 4332.6,
    orbitalPeriodYears: 11.86,
    rotationPeriodHours: 9.9,
    moonsCount: 95,
    avgTempCelsius: -110,
    temperatureRange: '-110°C (Cloud tops) to 24,000°C (Core)',
    surfaceGravityMs2: 24.79,
    relativeGravity: 2.53,
    color: '#D99B6A',
    accentColor: '#E8B688',
    glowColor: 'rgba(217, 155, 106, 0.45)',
    orbitRadius: 285,
    visualRadius: 24,
    speedFactor: 365.25 / 4332.6, // ~0.084
    overview:
      'The undisputed heavyweight of our planetary system, twice as massive as all other planets combined. Jupiter features dynamic atmospheric jet streams, auroras, and a miniature solar system of 95 known moons.',
    funFact:
      'Jupiter acts as the Solar System’s cosmic vacuum cleaner: its colossal gravity deflects or absorbs countless comets and asteroids that might otherwise strike Earth.',
    atmosphereComposition: ['89.8% Hydrogen', '10.2% Helium', 'Traces of Methane, Water & Ammonia'],
    internalStructure: [
      { name: 'Dense Rocky/Icy Core', depth: 'Radius ~10,000 km', description: 'Diffuse mixture of rock and heavy elements under millions of atmospheres pressure.', color: '#451A03' },
      { name: 'Metallic Hydrogen Layer', depth: 'Thickness ~40,000 km', description: 'Hydrogen compressed so intensely it behaves like an electrically conductive liquid metal.', color: '#9A3412' },
      { name: 'Liquid Molecular Hydrogen', depth: 'Thickness ~20,000 km', description: 'Supercritical fluid state blending seamlessly from gas into liquid.', color: '#D97706' },
      { name: 'Cloud Tops & Weather Deck', depth: 'Outer ~1,000 km', description: 'Vibrant ammonia and water cloud bands sculpted by 600 km/h jet streams.', color: '#FBBF24' },
    ],
    notableMissions: [
      { name: 'Juno', year: '2016–Present', agency: 'NASA', highlight: 'Probing Jupiter’s deep gravity fields, core structure, and cyclonic polar storms.' },
      { name: 'Galileo', year: '1989–2003', agency: 'NASA', highlight: 'Discovered evidence of a subsurface saltwater ocean on moon Europa.' },
      { name: 'JUICE', year: '2023–En Route', agency: 'ESA', highlight: 'Mission to inspect Jupiter’s ocean moons Ganymede, Callisto, and Europa.' },
    ],
  },
  {
    id: 'saturn',
    name: 'Saturn',
    type: 'Gas Giant',
    diameterKm: 116460,
    relativeSizeEarth: 9.14,
    distanceFromSunAU: 9.58,
    distanceFromSunMillionKm: 1433.5,
    orbitalPeriodDays: 10759.2,
    orbitalPeriodYears: 29.45,
    rotationPeriodHours: 10.7,
    moonsCount: 146,
    avgTempCelsius: -140,
    temperatureRange: '-140°C in upper atmosphere',
    surfaceGravityMs2: 10.44,
    relativeGravity: 1.07,
    color: '#E4D199',
    accentColor: '#F5E6B8',
    glowColor: 'rgba(228, 209, 153, 0.4)',
    orbitRadius: 360,
    visualRadius: 20,
    speedFactor: 365.25 / 10759.2, // ~0.034
    rings: {
      innerRadius: 24,
      outerRadius: 38,
      color: 'rgba(214, 196, 148, 0.75)',
      tiltAngle: 0.45,
    },
    overview:
      'Renowned for its dazzling system of celestial rings spanning hundreds of thousands of kilometers. Saturn is the least dense planet in the system—with an average density of 0.687 g/cm³, it would literally float in a vast bathtub of water.',
    funFact:
      'Saturn’s moon Titan is the only moon in the solar system with a dense atmosphere and liquid lakes of methane and ethane on its surface.',
    atmosphereComposition: ['96.3% Hydrogen', '3.25% Helium', '0.45% Methane', '0.01% Ammonia'],
    internalStructure: [
      { name: 'Dense Core', depth: 'Radius ~12,000 km', description: 'Rock, ice, and metal core surrounded by metallic hydrogen.', color: '#422006' },
      { name: 'Metallic Hydrogen Mantle', depth: 'Thickness ~25,000 km', description: 'Conductive fluid hydrogen creating Saturn’s aligned magnetic axis.', color: '#A16207' },
      { name: 'Liquid Hydrogen & Helium', depth: 'Thickness ~20,000 km', description: 'Where "helium rain" is hypothesized to fall toward the core.', color: '#CA8A04' },
      { name: 'Ammonia Ice Clouds', depth: 'Outer ~1,000 km', description: 'Muted golden cloud bands capped by an extraordinary polar hexagon storm.', color: '#FDE047' },
    ],
    notableMissions: [
      { name: 'Cassini-Huygens', year: '1997–2017', agency: 'NASA / ESA / ASI', highlight: 'Orbited Saturn for 13 years; landed the Huygens probe on Titan and found geysers on Enceladus.' },
      { name: 'Voyager 1 & 2', year: '1980–1981', agency: 'NASA', highlight: 'Discovered intricate ring structure braids, shepherd moons, and Titan’s haze.' },
    ],
  },
  {
    id: 'uranus',
    name: 'Uranus',
    type: 'Ice Giant',
    diameterKm: 50724,
    relativeSizeEarth: 3.98,
    distanceFromSunAU: 19.22,
    distanceFromSunMillionKm: 2872.5,
    orbitalPeriodDays: 30685.4,
    orbitalPeriodYears: 84.02,
    rotationPeriodHours: -17.2,
    moonsCount: 28,
    avgTempCelsius: -195,
    temperatureRange: '-224°C to -195°C (Coldest atmosphere)',
    surfaceGravityMs2: 8.69,
    relativeGravity: 0.89,
    color: '#70D6FF',
    accentColor: '#A8EDFF',
    glowColor: 'rgba(112, 214, 255, 0.45)',
    orbitRadius: 435,
    visualRadius: 15,
    speedFactor: 365.25 / 30685.4, // ~0.012
    rings: {
      innerRadius: 18,
      outerRadius: 22,
      color: 'rgba(160, 225, 255, 0.4)',
      tiltAngle: 1.4, // nearly vertical tilt
    },
    overview:
      'An ice giant world with a distinctive pale cyan color resulting from atmospheric methane absorbing red light. Uranus is uniquely tipped almost completely on its side with an axial tilt of 97.8°.',
    funFact:
      'Because of its extreme tilt, Uranus’s north and south poles take turns pointing almost directly at the Sun, experiencing 42 years of continuous day followed by 42 years of night!',
    atmosphereComposition: ['82.5% Hydrogen', '15.2% Helium', '2.3% Methane'],
    internalStructure: [
      { name: 'Rocky Core', depth: 'Radius ~4,000 km', description: 'Iron-silicate core roughly comparable to the mass of Earth.', color: '#1E293B' },
      { name: 'Icy Mantle', depth: 'Thickness ~10,000 km', description: 'Superheated, highly compressed slurry of water, ammonia, and methane ices.', color: '#0369A1' },
      { name: 'Hydrogen-Helium Atmosphere', depth: 'Outer ~5,000 km', description: 'Cold atmospheric envelope rich in methane haze and delicate vertical rings.', color: '#38BDF8' },
    ],
    notableMissions: [
      { name: 'Voyager 2', year: '1986', agency: 'NASA', highlight: 'The only spacecraft ever to visit Uranus; discovered 10 new moons and 2 new rings.' },
    ],
  },
  {
    id: 'neptune',
    name: 'Neptune',
    type: 'Ice Giant',
    diameterKm: 49244,
    relativeSizeEarth: 3.86,
    distanceFromSunAU: 30.05,
    distanceFromSunMillionKm: 4495.1,
    orbitalPeriodDays: 60189.0,
    orbitalPeriodYears: 164.79,
    rotationPeriodHours: 16.1,
    moonsCount: 16,
    avgTempCelsius: -200,
    temperatureRange: '-218°C to -200°C',
    surfaceGravityMs2: 11.15,
    relativeGravity: 1.14,
    color: '#3A68F9',
    accentColor: '#5C82FF',
    glowColor: 'rgba(58, 104, 249, 0.5)',
    orbitRadius: 505,
    visualRadius: 14.5,
    speedFactor: 365.25 / 60189.0, // ~0.006
    overview:
      'The farthest major planet from our Sun. Neptune is a vibrant deep blue world subject to the most ferocious supersonic winds anywhere in the solar system, clocking speeds beyond 2,100 km/h.',
    funFact:
      'Neptune was discovered through mathematical calculations rather than direct observation: irregularities in Uranus’s orbit led astronomers directly to its position!',
    atmosphereComposition: ['80% Hydrogen', '19% Helium', '1.5% Methane'],
    internalStructure: [
      { name: 'Rocky Core', depth: 'Radius ~7,000 km', description: 'Massive iron, nickel, and silicate core ~1.2 times Earth’s mass.', color: '#0F172A' },
      { name: 'Hot Fluid Icy Mantle', depth: 'Thickness ~12,000 km', description: 'Dense "water-ammonia ocean" under extreme heat and pressure, where diamond rain may crystallize.', color: '#1D4ED8' },
      { name: 'Upper Atmosphere', depth: 'Outer ~3,000 km', description: 'Whipped by high-speed winds forming bright white cirrus clouds and Great Dark Spots.', color: '#60A5FA' },
    ],
    notableMissions: [
      { name: 'Voyager 2', year: '1989', agency: 'NASA', highlight: 'Passed 4,950 km above Neptune’s north pole; discovered the Great Dark Spot and Triton’s active nitrogen geysers.' },
    ],
  },
  {
    id: 'pluto',
    name: 'Pluto',
    type: 'Dwarf Planet',
    diameterKm: 2377,
    relativeSizeEarth: 0.18,
    distanceFromSunAU: 39.48,
    distanceFromSunMillionKm: 5906.4,
    orbitalPeriodDays: 90560.0,
    orbitalPeriodYears: 247.94,
    rotationPeriodHours: -153.3, // 6.4 Earth days retrograde
    moonsCount: 5, // Charon, Styx, Nix, Kerberos, Hydra
    avgTempCelsius: -229,
    temperatureRange: '-240°C to -218°C',
    surfaceGravityMs2: 0.62,
    relativeGravity: 0.063,
    color: '#D2B48C',
    accentColor: '#E6CCB2',
    glowColor: 'rgba(210, 180, 140, 0.4)',
    orbitRadius: 575,
    visualRadius: 5.5,
    speedFactor: 365.25 / 90560.0, // ~0.004
    overview:
      'The famous dwarf planet in the icy Kuiper Belt. Pluto features a prominent heart-shaped nitrogen glacier (Sputnik Planitia), towering water-ice mountains, and blue atmospheric hazes.',
    funFact:
      'Pluto and its largest moon, Charon, form a "double planet system": they orbit a common center of mass (barycenter) that lies outside Pluto itself!',
    atmosphereComposition: ['99% Nitrogen', '0.5% Methane', '0.5% Carbon Monoxide'],
    internalStructure: [
      { name: 'Dense Rocky Core', depth: 'Radius ~850 km', description: 'Comprising ~70% of Pluto’s total mass.', color: '#3E2723' },
      { name: 'Subsurface Ocean / Ice Mantle', depth: 'Thickness ~300 km', description: 'Water ice mantle potentially insulating a slushy liquid ocean.', color: '#64748B' },
      { name: 'Nitrogen & Methane Ice Crust', depth: 'Outer ~50 km', description: 'Dynamic glaciated crust with flowing nitrogen ice plains.', color: '#E2E8F0' },
    ],
    notableMissions: [
      { name: 'New Horizons', year: '2015', agency: 'NASA', highlight: 'Made historic flyby past Pluto on July 14, 2015, revealing its famous heart-shaped glacier.' },
    ],
  },
];

export const ALL_CELESTIAL_BODIES: CelestialBody[] = [SUN_DATA, ...PLANETS_DATA];

export function getBodyById(id: string | null): CelestialBody | null {
  if (!id) return null;
  return ALL_CELESTIAL_BODIES.find((b) => b.id === id) || null;
}
