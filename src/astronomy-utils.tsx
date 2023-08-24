/**
 * Calculate the Julian Date Number
 * @see https://en.wikipedia.org/wiki/Julian_day
 * @see https://en.wikipedia.org/wiki/Julian_day#Converting_Gregorian_calendar_date_to_Julian_Day_Number
 * @param date
 */

export function calculateJulianDayNumber(date: Date) {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

/**
 * Calculate the Julian Date
 * @see https://en.wikipedia.org/wiki/Julian_day
 * @see https://en.wikipedia.org/wiki/Julian_day#Converting_Gregorian_calendar_date_to_Julian_Day_Number
 * @param date
 */
export function calculateJulianDate(date: Date) {
  return (
    calculateJulianDayNumber(date) +
    +(date.getUTCHours() - 12) / 24 +
    date.getUTCMinutes() / 1440 +
    date.getUTCSeconds() / 86400 +
    date.getUTCMilliseconds() / 1000 / 86400000000
  );
}

/**
 * Calculate the Greenwich Mean Sidereal Time
 * @see https://en.wikipedia.org/wiki/Sidereal_time#Definition
 * @see https://www.omnicalculator.com/everyday-life/sidereal-time#:~:text=Calculate%20the%20Greenwich%20sidereal%20time%2C%20or%20find%20its%20value%20in,find%20the%20local%20sidereal%20time.
 * @param date The date to calculate the GMST for
 * @returns The Greenwich Mean Sidereal Time in Degrees
 */
export function calculateGreenwichMeanSiderealTime(date: Date) {
  const julianDate = calculateJulianDate(date);
  const d_tt = julianDate - 2451545.0;
  const t = d_tt / 36525;
  return (
    (280.46061837 +
      360.98564736629 * d_tt +
      0.000387933 * t * t -
      (t * t * t) / 38710000) %
    360
  );
}

interface PrimaryOrbitalElements {
  /**
   * longitude of the ascending node
   * @see https://en.wikipedia.org/wiki/Longitude_of_the_ascending_node
   */
  N: (dateNumber: number) => number;
  /**
   * inclination to the ecliptic (plane of the Earth's orbit)
   * @see https://en.wikipedia.org/wiki/Orbital_inclination
   */
  i: (dateNumber: number) => number;
  /**
   * argument of perihelion
   * @see https://en.wikipedia.org/wiki/Argument_of_periapsis
   */
  w: (dateNumber: number) => number;
  /**
   * semi-major axis, or mean distance from Sun
   * @see https://en.wikipedia.org/wiki/Semi-major_and_semi-minor_axes
   */
  a: (dateNumber: number) => number;
  /**
   * eccentricity (0=circle, 0-1=ellipse, 1=parabola)
   * @see https://en.wikipedia.org/wiki/Eccentricity_(mathematics)
   */
  e: (dateNumber: number) => number;
  /**
   * mean anomaly (0 at perihelion; increases uniformly with time)
   * @see https://en.wikipedia.org/wiki/Mean_anomaly
   */
  M: (dateNumber: number) => number;
}

interface CalculatedPrimaryOrbitalElements {
  /**
   * longitude of the ascending node
   * @see https://en.wikipedia.org/wiki/Longitude_of_the_ascending_node
   */
  N: number;
  /**
   * inclination to the ecliptic (plane of the Earth's orbit)
   * @see https://en.wikipedia.org/wiki/Orbital_inclination
   */
  i: number;
  /**
   * argument of perihelion
   * @see https://en.wikipedia.org/wiki/Argument_of_periapsis
   */
  w: number;
  /**
   * semi-major axis, or mean distance from Sun
   * @see https://en.wikipedia.org/wiki/Semi-major_and_semi-minor_axes
   */
  a: number;
  /**
   * eccentricity (0=circle, 0-1=ellipse, 1=parabola)
   * @see https://en.wikipedia.org/wiki/Eccentricity_(mathematics)
   */
  e: number;
  /**
   * mean anomaly (0 at perihelion; increases uniformly with time)
   * @see https://en.wikipedia.org/wiki/Mean_anomaly
   */
  M: number;
}

function getDateNumber(date: Date) {
  return calculateJulianDate(date) - 2451544.0;
}

export function toRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

export function toDegrees(radians: number) {
  return (radians * 180) / Math.PI;
}

/**
 * Normalize an angle to be between 0 and 360 degrees
 * @param angle
 */
function normalizeAngle(angle: number) {
  return angle - Math.floor(angle / 360) * 360;
}

export function calculateOrbitalElements(
  primaryOrbitalElements: PrimaryOrbitalElements,
  date: Date,
): CalculatedPrimaryOrbitalElements {
  const dateNumber = getDateNumber(date);
  const N = toRadians(normalizeAngle(primaryOrbitalElements.N(dateNumber)));
  const i = toRadians(normalizeAngle(primaryOrbitalElements.i(dateNumber)));
  const w = toRadians(normalizeAngle(primaryOrbitalElements.w(dateNumber)));
  const a = primaryOrbitalElements.a(dateNumber);
  const e = primaryOrbitalElements.e(dateNumber);
  const M = toRadians(normalizeAngle(primaryOrbitalElements.M(dateNumber)));
  return { N, i, w, a, e, M };
}

/**
 * Calculate the eccentric anomaly (E)
 * @param M The mean anomaly
 * @param e The eccentricity
 */
export function calculateEccentricAnomaly(M: number, e: number) {
  let E0 = M + e * Math.sin(M) * (1.0 + e * Math.cos(M));
  let E1 = E0 - (E0 - e * Math.sin(E0) - M) / (1 - e * Math.cos(E0));
  while (Math.abs(E0 - E1) > 0.0005) {
    E0 = E1;
    E1 = E0 - (E0 - e * Math.sin(E0) - M) / (1 - e * Math.cos(E0));
  }
  return E1;
}

/**
 * Calculate the true anomaly (v) and the distance (r)
 * @param a The semi-major axis
 * @param E The eccentric anomaly
 * @param e The eccentricity
 */
export function calculateTrueAnomalyAndDistance(
  a: number,
  E: number,
  e: number,
) {
  const xv = a * (Math.cos(E) - e);
  const yv = a * (Math.sqrt(1.0 - e * e) * Math.sin(E));
  const v = Math.atan2(yv, xv);
  const r = Math.sqrt(xv * xv + yv * yv);
  return { v, r };
}

/**
 * Calculate position in Space
 * For the Moon, this is the geocentric (Earth-centered) position in the ecliptic coordinate system. For the planets,
 * this is the heliocentric (Sun-centered) position, also in the ecliptic coordinate system.
 * @param primaryOrbitalElements The orbital elements of the primary body
 * @param date The date to calculate the position for
 *
 */
export function calculatePosition(
  primaryOrbitalElements: PrimaryOrbitalElements,
  date: Date,
) {
  const { N, i, w, a, e, M } = calculateOrbitalElements(
    primaryOrbitalElements,
    date,
  );
  const E = calculateEccentricAnomaly(M, e);
  const { v, r } = calculateTrueAnomalyAndDistance(a, E, e);
  const xh =
    r *
    (Math.cos(N) * Math.cos(v + w) -
      Math.sin(N) * Math.sin(v + w) * Math.cos(i));
  const yh =
    r *
    (Math.sin(N) * Math.cos(v + w) +
      Math.cos(N) * Math.sin(v + w) * Math.cos(i));
  const zh = r * (Math.sin(v + w) * Math.sin(i));
  return { xh, yh, zh, r, v, E };
}

/**
 * Calculate the elliptic longitude and latitude
 * @param xh The x coordinate in space
 * @param yh The y coordinate in space
 * @param zh The z coordinate in space
 */
export function calculateEllipticLongitudeAndLatitude(
  xh: number,
  yh: number,
  zh: number,
) {
  const ellipticLongitude = Math.atan2(yh, xh);
  const ellipticLatitude = Math.atan2(zh, Math.sqrt(xh * xh + yh * yh));
  return { ellipticLongitude, ellipticLatitude };
}

/**
 * Calculate equatorial coordinates
 * geocentric (Earth centered) position in rectangular, ecliptic coordinates
 * @param xg
 * @param yg
 * @param zg
 */
export function calculateEquatorialCoordinates(
  xg: number,
  yg: number,
  zg: number,
) {
  const ecl = toRadians(23.439291);
  const xeq = xg;
  const yeq = yg * Math.cos(ecl) - zg * Math.sin(ecl);
  const zeq = yg * Math.sin(ecl) + zg * Math.cos(ecl);
  return { xeq, yeq, zeq };
}

/**
 * Calculate the right ascension and declination
 * equatorial coordinates to right ascension and declination
 * @param xeq
 * @param yeq
 * @param zeq
 */
export function calculateRightAscensionAndDeclination(
  xeq: number,
  yeq: number,
  zeq: number,
) {
  const ra = Math.atan2(yeq, xeq);
  const dec = Math.atan2(zeq, Math.sqrt(xeq * xeq + yeq * yeq));
  return { ra, dec };
}

/**
 * Calculate sun position
 * @param date The date to calculate the position for
 * @returns Elliptic longitude and latitude, equatorial coordinates(right ascension and declination) in radians
 */
export function calculateSunPosition(date: Date) {
  const sunOrbitalElements = {
    N: () => 0.0,
    i: () => 0.0,
    w: (d: number) => 282.9404 + 4.70935e-5 * d,
    a: () => 1.0,
    e: (d: number) => 0.016709 - 1.151e-9 * d,
    M: (d: number) => 356.047 + 0.9856002585 * d,
  };

  const { xh, yh, zh, v, E, r } = calculatePosition(sunOrbitalElements, date);
  const { ellipticLongitude, ellipticLatitude } =
    calculateEllipticLongitudeAndLatitude(xh, yh, zh);
  const { xeq, yeq, zeq } = calculateEquatorialCoordinates(xh, yh, zh);
  const { ra, dec } = calculateRightAscensionAndDeclination(xeq, yeq, zeq);
  const { geoLatitude, geoLongitude } =
    rightAscensionAndDeclinationToGeoCoordinates(ra, dec, date);
  return {
    ellipticLongitude,
    ellipticLatitude,
    ra,
    dec,
    v,
    E,
    r,
    xh,
    yh,
    zh,
    xeq,
    yeq,
    zeq,
    geoLatitude,
    geoLongitude,
  };
}

/**
 * Convert right ascension and declination to geo coordinates
 * @param ra Right ascension
 * @param dec Declination
 * @param date The date to calculate the position for
 * @returns {{lon: number; lat: number}} in radians
 */
export function rightAscensionAndDeclinationToGeoCoordinates(
  ra: number,
  dec: number,
  date: Date,
): {
  geoLongitude: number;
  geoLatitude: number;
} {
  const siderealTime = calculateGreenwichMeanSiderealTime(date);
  const lon = toRadians(360) - (toRadians(siderealTime) - ra);
  return {
    geoLongitude: lon,
    geoLatitude: dec,
  };
}

/**
 * Calculate the moon position
 * @param date The date to calculate the position for
 */
export function calculateMoonPosition(date: Date): {
  dec: number;
  yeq: number;
  E: number;
  xeq: number;
  zeq: number;
  zh: number;
  ellipticLatitude: number;
  ra: number;
  yh: number;
  xh: number;
  geoLongitude: number;
  r: number;
  geoLatitude: number;
  ellipticLongitude: number;
  v: number;
} {
  const moonOrbitalElements = {
    N: (d: number) => 125.1228 - 0.0529538083 * d,
    i: () => 5.1454,
    w: (d: number) => 318.0634 + 0.1643573223 * d,
    a: () => 60.2666,
    e: () => 0.0549,
    M: (d: number) => 115.3654 + 13.0649929509 * d,
  };

  const { xh, yh, zh, v, E, r } = calculatePosition(moonOrbitalElements, date);
  const { ellipticLongitude, ellipticLatitude } =
    calculateEllipticLongitudeAndLatitude(xh, yh, zh);
  const { xeq, yeq, zeq } = calculateEquatorialCoordinates(xh, yh, zh);
  const { ra, dec } = calculateRightAscensionAndDeclination(xeq, yeq, zeq);
  const { geoLatitude, geoLongitude } =
    rightAscensionAndDeclinationToGeoCoordinates(ra, dec, date);
  return {
    ellipticLongitude,
    ellipticLatitude,
    ra,
    dec,
    v,
    E,
    r,
    xh,
    yh,
    zh,
    xeq,
    yeq,
    zeq,
    geoLatitude,
    geoLongitude,
  };
}
