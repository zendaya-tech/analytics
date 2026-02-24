import geoip from "geoip-lite";

const IP_HEADERS = [
  "x-forwarded-for",
  "x-real-ip",
  "cf-connecting-ip",
  "x-client-ip",
  "x-cluster-client-ip",
  "fastly-client-ip",
  "true-client-ip",
];

function isPublicIp(ip: string) {
  if (!ip) {
    return false;
  }

  if (ip === "::1" || ip.startsWith("127.")) {
    return false;
  }

  if (ip.startsWith("10.") || ip.startsWith("192.168.")) {
    return false;
  }

  if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(ip)) {
    return false;
  }

  if (ip.startsWith("fc") || ip.startsWith("fd") || ip.startsWith("fe80")) {
    return false;
  }

  return true;
}

export function extractClientIp(headers: Headers) {
  for (const key of IP_HEADERS) {
    const raw = headers.get(key);
    if (!raw) {
      continue;
    }

    const ip = raw.split(",")[0].trim();
    if (ip && isPublicIp(ip)) {
      return ip;
    }
  }

  return null;
}

export function resolveCountryCode(ip: string | null) {
  if (!ip) {
    return null;
  }

  const lookup = geoip.lookup(ip);
  if (!lookup?.country) {
    return null;
  }

  return lookup.country;
}
