// Lightweight English-ization utilities for age and Gyeonggi-do locations

export function englishAge(age: number | string): string {
  if (typeof age === "number") return `${age} yrs`;
  const s = String(age);
  // 2025(60일미만)(년생) → Born in 2025 (under 60 days)
  const mUnder = s.match(/(\d{4}).*?\((\d+)\s*일\s*미만\)/);
  if (mUnder) return `Born in ${mUnder[1]} (under ${mUnder[2]} days)`;
  // 2021(년생) → Born in 2021
  const mBorn = s.match(/(\d{4})\s*\(년생\)/);
  if (mBorn) return `Born in ${mBorn[1]}`;
  // 한글 괄호 제거 + 숫자만 → Born in
  const stripped = s.replace(/\(.*?\)/g, "").trim();
  if (/^\d{4}$/.test(stripped)) return `Born in ${stripped}`;
  return stripped;
}

export const COUNTRY_MAP: Record<string, string> = {
  "대한민국": "South Korea",
  "한국": "South Korea",
};

export const PROVINCE_MAP: Record<string, string> = {
  "경기도": "Gyeonggi-do",
};

// Gyeonggi-do cities (si) and counties (gun)
const GYEONGGI_CITIES: Record<string, string> = {
  "수원시": "Suwon",
  "성남시": "Seongnam",
  "의정부시": "Uijeongbu",
  "안양시": "Anyang",
  "부천시": "Bucheon",
  "광명시": "Gwangmyeong",
  "평택시": "Pyeongtaek",
  "동두천시": "Dongducheon",
  "안산시": "Ansan",
  "고양시": "Goyang",
  "과천시": "Gwacheon",
  "구리시": "Guri",
  "남양주시": "Namyangju",
  "오산시": "Osan",
  "시흥시": "Siheung",
  "군포시": "Gunpo",
  "의왕시": "Uiwang",
  "하남시": "Hanam",
  "용인시": "Yongin",
  "파주시": "Paju",
  "이천시": "Icheon",
  "안성시": "Anseong",
  "김포시": "Gimpo",
  "화성시": "Hwaseong",
  "광주시": "Gwangju",
  "양주시": "Yangju",
  "포천시": "Pocheon",
  "여주시": "Yeoju",
};

const GYEONGGI_COUNTIES: Record<string, string> = {
  "연천군": "Yeoncheon",
  "가평군": "Gapyeong",
  "양평군": "Yangpyeong",
};

export function englishCountry(country: string): string {
  return COUNTRY_MAP[country?.trim()] ?? country;
}

export function englishProvince(province?: string): string | undefined {
  if (!province) return undefined;
  return PROVINCE_MAP[province.trim()] ?? province;
}

export function englishCity(city: string, province?: string): string {
  // Normalize and strip leading province labels like "경기도 " if present
  const raw = city?.trim() ?? "";
  const c = raw.replace(/^경기도\s*/g, "").trim();

  // Prefer explicit province hint, but also map by known city/county regardless
  if (province?.trim() === "경기도" || true) {
    if (GYEONGGI_CITIES[c]) return GYEONGGI_CITIES[c];
    if (GYEONGGI_COUNTIES[c]) return GYEONGGI_COUNTIES[c];
  }

  // Generic cleanup when no mapping available
  if (/^[\u3131-\u3163\uac00-\ud7a3]+시$/.test(c)) return c.replace(/시$/, "");
  if (/^[\u3131-\u3163\uac00-\ud7a3]+군$/.test(c)) return c.replace(/군$/, "");
  return c;
}

export function englishLocation(city: string, country: string, province?: string): string {
  const ec = englishCity(city, province);
  const ep = englishProvince(province);
  const cc = englishCountry(country);
  return [ec, ep, cc].filter(Boolean).join(", ");
}
