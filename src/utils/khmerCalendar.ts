import { toKhmerNumeral, convertNumberToKhmerWords, KHMER_DAYS, KHMER_MONTHS_SOLAR, KHMER_LUNAR_MONTHS, KHMER_ZODIAC_YEARS, KHMER_SAK } from './khmerDate';

export interface KhmerHoliday {
  name: string;
  nameEn?: string;
  type: 'national' | 'religious' | 'royal' | 'international';
  isOffDay: boolean; // ថ្ងៃឈប់សម្រាកផ្លូវការ
  description?: string;
}

export interface KhmerDateDetails {
  dateStr: string; // YYYY-MM-DD
  year: number;
  month: number; // 1-12
  day: number; // 1-31
  dayOfWeek: number; // 0=Sun, 1=Mon, ..., 6=Sat
  dayName: string; // អាទិត្យ, ច័ន្ទ, ...
  
  // Lunar Details
  beYear: number; // ពុទ្ធសករាជ
  zodiac: string; // ជូត, ឆ្លូវ, ...
  sak: string; // ឯកស័ក, ទោស័ក, ...
  lunarMonth: string; // មិគសិរ, បុស្ស, ...
  lunarDay: number; // 1-15
  lunarPhase: 'កើត' | 'រោច';
  isFullMoon: boolean; // ១៥កើត (ពេញបូណ៌មី)
  isNewMoon: boolean; // ១៤រោច ឬ ១៥រោច (ដាច់ខែ)
  isHolyDay: boolean; // ថ្ងៃសីល (៨កើត, ១៥កើត, ៨រោច, ១៤/១៥រោច)
  holyDayLabel?: string;

  // Holiday
  holidays: KhmerHoliday[];
  isWeekend: boolean;
  isPublicHoliday: boolean;

  // Text representations
  formattedSolar: string;
  formattedLunar: string;
  fullKhmerPhrase: string;
}

// Fixed solar holidays in Cambodia (Month: 1-12, Day: 1-31)
export const SOLAR_HOLIDAYS: Record<string, KhmerHoliday[]> = {
  '1-1': [{ name: 'ទិវាចូលឆ្នាំសកល (International New Year)', type: 'international', isOffDay: true }],
  '1-7': [{ name: 'ទិវាជ័យជម្នះលើរបបប្រល័យពូជសាសន៍ (Victory over Genocide Day)', type: 'national', isOffDay: true, description: 'រំឭកខួបជ័យជម្នះ ៧ មករា ១៩៧៩' }],
  '3-8': [{ name: 'ទិវាអន្តរជាតិនារី ៨ មីនា (International Women\'s Day)', type: 'international', isOffDay: true }],
  '4-13': [{ name: 'ពិធីបុណ្យចូលឆ្នាំថ្មី ប្រពៃណីជាតិខ្មែរ (ថ្ងៃមហាសង្ក្រាន្ត)', type: 'national', isOffDay: true }],
  '4-14': [{ name: 'ពិធីបុណ្យចូលឆ្នាំថ្មី ប្រពៃណីជាតិខ្មែរ (ថ្ងៃវារៈវ័នបត)', type: 'national', isOffDay: true }],
  '4-15': [{ name: 'ពិធីបុណ្យចូលឆ្នាំថ្មី ប្រពៃណីជាតិខ្មែរ (ថ្ងៃវារៈឡើងស័ក)', type: 'national', isOffDay: true }],
  '4-16': [{ name: 'ពិធីបុណ្យចូលឆ្នាំថ្មី ប្រពៃណីជាតិខ្មែរ (ថ្ងៃឡើងស័ក)', type: 'national', isOffDay: true }],
  '5-1': [{ name: 'ទិវាពលកម្មអន្តរជាតិ (International Labor Day)', type: 'international', isOffDay: true }],
  '5-14': [{ name: 'ព្រះរាជពិធីបុណ្យចម្រើនព្រះជន្ម ព្រះករុណា ព្រះបាទសម្តេច ព្រះបរមនាថ នរោត្តម សីហមុនី', type: 'royal', isOffDay: true }],
  '6-18': [{ name: 'ព្រះរាជពិធីបុណ្យចម្រើនព្រះជន្ម សម្តេចព្រះមហាក្សត្រី នរោត្តម មុនិនាថ សីហនុ ព្រះវររាជមាតាជាតិខ្មែរ', type: 'royal', isOffDay: true }],
  '9-24': [{ name: 'ទិវាប្រកាសរដ្ឋធម្មនុញ្ញ (Constitutional Day)', type: 'national', isOffDay: true }],
  '10-15': [{ name: 'ទិវាប្រារព្ធពិធីគោរពព្រះវិញ្ញាណក្ខន្ធ ព្រះករុណា ព្រះបាទសម្តេច ព្រះនរោត្តម សីហនុ (ព្រះបរមរតនកោដ្ឋ)', type: 'royal', isOffDay: true }],
  '10-29': [{ name: 'ព្រះរាជពិធីគ្រងព្រះបរមរាជសម្បត្តិ ព្រះករុណា ព្រះបាទសម្តេច ព្រះបរមនាថ នរោត្តម សីហមុនី', type: 'royal', isOffDay: true }],
  '11-9': [{ name: 'ទិវាបុណ្យឯករាជ្យជាតិ (National Independence Day)', type: 'national', isOffDay: true, description: 'រំឭកខួបឯករាជ្យជាតិពីអាណានិគមបារាំង ៩ វិច្ឆិកា ១៩៥៣' }],
  '12-29': [{ name: 'ទិវាសន្តិភាពនៅកម្ពុជា (Peace Day in Cambodia)', type: 'national', isOffDay: true, description: 'រំឭកការបញ្ចប់សង្គ្រាមស៊ីវិលទាំងស្រុងដោយនយោបាយឈ្នះ-ឈ្នះ' }]
};

// Known Lunar Holiday rules (Year specific anchors or general rule)
export const LUNAR_HOLIDAY_RULES: Array<{
  lunarMonth: string;
  lunarPhase: 'កើត' | 'រោច';
  lunarDay: number;
  name: string;
  type: 'religious' | 'national';
  isOffDay: boolean;
  description?: string;
}> = [
  {
    lunarMonth: 'មាឃ',
    lunarPhase: 'កើត',
    lunarDay: 15,
    name: 'ពិធីបុណ្យមាឃបូជា (Meak Bochea Day)',
    type: 'religious',
    isOffDay: true,
    description: 'រំឭកការប្រជុំចតុរង្គសន្និបាត និងការសម្តែងឱវាទបាតិមោក្ខ'
  },
  {
    lunarMonth: 'ពិសាខ',
    lunarPhase: 'កើត',
    lunarDay: 15,
    name: 'ពិធីបុណ្យពិសាខបូជា (Visak Bochea Day)',
    type: 'religious',
    isOffDay: true,
    description: 'រំឭកថ្ងៃប្រសូត ត្រាស់ដឹង និងបរិនិព្វាន នៃព្រះសម្មាសម្ពុទ្ធ'
  },
  {
    lunarMonth: 'ពិសាខ',
    lunarPhase: 'រោច',
    lunarDay: 4,
    name: 'ព្រះរាជពិធីច្រត់ព្រះនង្គ័ល (Royal Ploughing Ceremony)',
    type: 'national',
    isOffDay: true,
    description: 'ពិធីប្រពៃណីជាតិស្តីពីការចាប់ផ្តើមរដូវបង្កបង្កើនផលស្រូវ'
  },
  {
    lunarMonth: 'ភទ្របទ',
    lunarPhase: 'រោច',
    lunarDay: 14,
    name: 'ពិធីបុណ្យភ្ជុំបិណ្ឌ (ថ្ងៃកាន់បិណ្ឌទី១៤ / បុណ្យភ្ជុំបិណ្ឌ)',
    type: 'religious',
    isOffDay: true
  },
  {
    lunarMonth: 'ភទ្របទ',
    lunarPhase: 'រោច',
    lunarDay: 15,
    name: 'ពិធីបុណ្យភ្ជុំបិណ្ឌ (ថ្ងៃភ្ជុំធំ)',
    type: 'religious',
    isOffDay: true,
    description: 'ថ្ងៃភ្ជុំធំ បងប្អូនខ្មែរជួបជុំគ្រួសារឧទ្ទិសកុសលដល់បុព្វការីជន'
  },
  {
    lunarMonth: 'អស្សុជ',
    lunarPhase: 'កើត',
    lunarDay: 1,
    name: 'ពិធីបុណ្យភ្ជុំបិណ្ឌ (ថ្ងៃឆ្លងភ្ជុំបិណ្ឌ)',
    type: 'religious',
    isOffDay: true
  },
  {
    lunarMonth: 'កត្តិក',
    lunarPhase: 'កើត',
    lunarDay: 14,
    name: 'ព្រះរាជពិធីបុណ្យអុំទូក បណ្តែតប្រទីប និងសំពះព្រះខែ អកអំបុក (ថ្ងៃទី១)',
    type: 'national',
    isOffDay: true
  },
  {
    lunarMonth: 'កត្តិក',
    lunarPhase: 'កើត',
    lunarDay: 15,
    name: 'ព្រះរាជពិធីបុណ្យអុំទូក (ថ្ងៃសំពះព្រះខែ អកអំបុក & ពេញបូណ៌មី)',
    type: 'national',
    isOffDay: true,
    description: 'ពិធីសំពះព្រះខែ និងអកអំបុក នាវេលាកណ្តាលអធ្រាត្រ'
  },
  {
    lunarMonth: 'កត្តិក',
    lunarPhase: 'រោច',
    lunarDay: 1,
    name: 'ព្រះរាជពិធីបុណ្យអុំទូក (ថ្ងៃផ្តាច់ព្រ័ត្រ & កាត់ព្រ័ត្រ)',
    type: 'national',
    isOffDay: true
  }
];

/**
 * Calculate accurate Khmer Lunar details for a given date
 */
export function getKhmerDateDetails(dateInput: string | Date): KhmerDateDetails {
  const dateObj = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  const validDate = isNaN(dateObj.getTime()) ? new Date() : dateObj;

  const year = validDate.getFullYear();
  const month = validDate.getMonth() + 1; // 1-12
  const day = validDate.getDate();
  const dayOfWeek = validDate.getDay(); // 0-6
  const dayName = KHMER_DAYS[dayOfWeek];

  const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday

  // Buddhist Era (BE) year (ពុទ្ធសករាជ)
  // Usually Vesak (around May) shifts Buddhist Era, so Jan-April is Year+543 or 544
  const beYear = month >= 5 ? year + 544 : year + 543;

  // Khmer Zodiac (ជូត, ឆ្លូវ, ...)
  // Traditional Khmer New Year is mid-April (Maha Sangkran), but for common reference:
  const zodiacIndex = (year - 4) % 12;
  const zodiac = KHMER_ZODIAC_YEARS[zodiacIndex >= 0 ? zodiacIndex : zodiacIndex + 12];
  
  // Khmer Sak (ឯកស័ក, ទោស័ក, ...)
  const sakIndex = (year - 2020 + 2) % 10;
  const sak = KHMER_SAK[sakIndex >= 0 ? sakIndex : sakIndex + 10];

  // Khmer Lunar Month & Phase approximate calculation
  // Base reference epoch: 2025-12-08 is ៤រោច ខែកត្តិក (day 19 of lunar cycle)
  const baseDate = new Date(Date.UTC(2025, 11, 8)); // 2025-12-08
  const targetDate = new Date(Date.UTC(year, month - 1, day));
  const diffDays = Math.round((targetDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));

  // Average lunar month is 29.530588 days
  const synodicMonth = 29.530588;
  const baseLunarDayInCycle = 19; // ៤រោច (15 + 4)
  const totalLunarDays = baseLunarDayInCycle + diffDays;
  
  let currentCycleDay = ((totalLunarDays % synodicMonth) + synodicMonth) % synodicMonth;
  let lunarDayNum = Math.floor(currentCycleDay) + 1;
  if (lunarDayNum > 30) lunarDayNum = 30;

  let lunarPhase: 'កើត' | 'រោច' = 'កើត';
  let lunarDay = lunarDayNum;

  if (lunarDayNum > 15) {
    lunarPhase = 'រោច';
    lunarDay = lunarDayNum - 15;
    if (lunarDay > 15) lunarDay = 15;
  }

  // Lunar Month calculation
  // Offset from base month (11 is Kattaok/កត្តិក in lunar list index 11)
  const totalMonthsPassed = Math.floor((totalLunarDays) / synodicMonth);
  const baseMonthIndex = 11; // កត្តិក
  let lunarMonthIndex = (baseMonthIndex + totalMonthsPassed) % 12;
  if (lunarMonthIndex < 0) lunarMonthIndex += 12;
  const lunarMonth = KHMER_LUNAR_MONTHS[lunarMonthIndex];

  // Holy Day (ថ្ងៃសីល) check: 8កើត, 15កើត (ពេញបូណ៌មី), 8រោច, 14រោច ឬ 15រោច (ដាច់ខែ)
  const isFullMoon = lunarPhase === 'កើត' && lunarDay === 15;
  const isNewMoon = lunarPhase === 'រោច' && (lunarDay === 14 || lunarDay === 15);
  const isHolyDay = (lunarDay === 8) || isFullMoon || isNewMoon;
  
  let holyDayLabel: string | undefined;
  if (isHolyDay) {
    if (isFullMoon) holyDayLabel = 'ថ្ងៃសីល (ពេញបូណ៌មី 🌕)';
    else if (isNewMoon) holyDayLabel = 'ថ្ងៃសីល (ដាច់ខែ 🌑)';
    else holyDayLabel = `ថ្ងៃសីល (៨${lunarPhase} 🪷)`;
  }

  // Check holidays
  const holidays: KhmerHoliday[] = [];

  // 1. Check fixed solar holidays
  const solarKey = `${month}-${day}`;
  if (SOLAR_HOLIDAYS[solarKey]) {
    holidays.push(...SOLAR_HOLIDAYS[solarKey]);
  }

  // 2. Check dynamic lunar holidays
  for (const rule of LUNAR_HOLIDAY_RULES) {
    if (rule.lunarMonth === lunarMonth && rule.lunarPhase === lunarPhase && rule.lunarDay === lunarDay) {
      holidays.push({
        name: rule.name,
        type: rule.type,
        isOffDay: rule.isOffDay,
        description: rule.description
      });
    }
  }

  const isPublicHoliday = holidays.some((h) => h.isOffDay);

  // Formatted Strings
  const solarMonthName = KHMER_MONTHS_SOLAR[month - 1];
  const formattedSolar = `ថ្ងៃទី${toKhmerNumeral(day)} ខែ${solarMonthName} ឆ្នាំ${toKhmerNumeral(year)}`;
  const formattedLunar = `ថ្ងៃ${dayName} ${toKhmerNumeral(lunarDay)}${lunarPhase} ខែ${lunarMonth} ឆ្នាំ${zodiac} ${sak} ពុទ្ធសករាជ ${toKhmerNumeral(beYear)}`;
  const fullKhmerPhrase = `${formattedSolar} ត្រូវនឹង${formattedLunar}`;

  return {
    dateStr,
    year,
    month,
    day,
    dayOfWeek,
    dayName,
    beYear,
    zodiac,
    sak,
    lunarMonth,
    lunarDay,
    lunarPhase,
    isFullMoon,
    isNewMoon,
    isHolyDay,
    holyDayLabel,
    holidays,
    isWeekend,
    isPublicHoliday,
    formattedSolar,
    formattedLunar,
    fullKhmerPhrase
  };
}

/**
 * Generate all days for a given Gregorian Month (year, month 1-12)
 */
export function getMonthCalendarDays(year: number, month: number): KhmerDateDetails[] {
  const daysInMonth = new Date(year, month, 0).getDate();
  const days: KhmerDateDetails[] = [];

  for (let d = 1; d <= daysInMonth; d++) {
    const dStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    days.push(getKhmerDateDetails(dStr));
  }

  return days;
}
