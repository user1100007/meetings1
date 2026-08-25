export const KHMER_DIGITS = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];

export const toKhmerNumeral = (val: number | string): string => {
  return String(val).replace(/[0-9]/g, (d) => KHMER_DIGITS[parseInt(d, 10)]);
};

export const KHMER_DAYS = [
  'អាទិត្យ',
  'ច័ន្ទ',
  'អង្គារ',
  'ពុធ',
  'ព្រហស្បតិ៍',
  'សុក្រ',
  'សៅរ៍'
];

export const KHMER_MONTHS_SOLAR = [
  'មករា',
  'កុម្ភៈ',
  'មីនា',
  'មេសា',
  'ឧសភា',
  'មិថុនា',
  'កក្កដា',
  'សីហា',
  'កញ្ញា',
  'តុលា',
  'វិច្ឆិកា',
  'ធ្នូ'
];

export const KHMER_NUM_WORDS: Record<number, string> = {
  0: 'សូន្យ',
  1: 'មួយ',
  2: 'ពីរ',
  3: 'បី',
  4: 'បួន',
  5: 'ប្រាំ',
  6: 'ប្រាំមួយ',
  7: 'ប្រាំពីរ',
  8: 'ប្រាំបី',
  9: 'ប្រាំបួន',
  10: 'ដប់',
  11: 'ដប់មួយ',
  12: 'ដប់ពីរ',
  13: 'ដប់បី',
  14: 'ដប់បួន',
  15: 'ដប់ប្រាំ',
  16: 'ដប់ប្រាំមួយ',
  17: 'ដប់ប្រាំពីរ',
  18: 'ដប់ប្រាំបី',
  19: 'ដប់ប្រាំបួន',
  20: 'ម្ភៃ',
  21: 'ម្ភៃមួយ',
  22: 'ម្ភៃពីរ',
  23: 'ម្ភៃបី',
  24: 'ម្ភៃបួន',
  25: 'ម្ភៃប្រាំ',
  26: 'ម្ភៃប្រាំមួយ',
  27: 'ម្ភៃប្រាំពីរ',
  28: 'ម្ភៃប្រាំបី',
  29: 'ម្ភៃប្រាំបួន',
  30: 'សាមសិប',
  31: 'សាមសិបមួយ'
};

export const KHMER_LUNAR_MONTHS = [
  'មិគសិរ', 'បុស្ស', 'មាឃ', 'ផល្គុន', 'ចេត្រ', 'ពិសាខ', 'ជេស្ឋ', 'អាសាឍ', 'ស្រាពណ៍', 'ភទ្របទ', 'អស្សុជ', 'កត្តិក'
];

export const KHMER_ZODIAC_YEARS = [
  'ជូត', 'ឆ្លូវ', 'ខាល', 'ថោះ', 'រោង', 'ម្សាញ់', 'មមី', 'មមែ', 'វក', 'រកា', 'ច ស', 'កុរ'
];

export const KHMER_SAK = [
  'ឯកស័ក', 'ទោស័ក', 'ត្រីស័ក', 'ចត្វាស័ក', 'បញ្ចស័ក', 'ឆស័ក', 'សប្តស័ក', 'អដ្ឋស័ក', 'នព្វស័ក', 'សំរឹទ្ធិស័ក'
];

export function convertNumberToKhmerWords(num: number): string {
  if (num in KHMER_NUM_WORDS) return KHMER_NUM_WORDS[num];
  if (num === 2025) return 'ពីរពាន់ម្ភៃប្រាំ';
  if (num === 2026) return 'ពីរពាន់ម្ភៃប្រាំមួយ';
  if (num === 2027) return 'ពីរពាន់ម្ភៃប្រាំពីរ';
  if (num === 2569) return 'ពីរពាន់ប្រាំរយហុកសិបប្រាំបួន';
  if (num === 2570) return 'ពីរពាន់ប្រាំរយចិតសិប';
  if (num >= 2000 && num < 2100) {
    const rem = num - 2000;
    return 'ពីរពាន់' + (KHMER_NUM_WORDS[rem] || String(rem));
  }
  return String(num);
}

export function generateFormalKhmerDateText(dateStr: string, timeStr: string, locationStr: string, topicStr: string, leaderStr: string): {
  introText: string;
  attendanceDateLocation: string;
} {
  let dateObj = new Date(dateStr);
  if (isNaN(dateObj.getTime())) {
    dateObj = new Date('2025-12-08');
  }

  const year = dateObj.getFullYear();
  const month = dateObj.getMonth(); // 0-11
  const day = dateObj.getDate();
  const dayOfWeek = dateObj.getDay();

  const yearWord = convertNumberToKhmerWords(year);
  const monthWord = KHMER_MONTHS_SOLAR[month];
  const dayWord = KHMER_NUM_WORDS[day] || toKhmerNumeral(day);
  const dayName = KHMER_DAYS[dayOfWeek];

  // Estimate Buddhist Era (BE) Year (Year + 543 or 544 depending on Vesak)
  const beYear = year + 544;
  const beYearWord = convertNumberToKhmerWords(beYear);

  // Zodiac cycle (2025 is ម្សាញ់ Snake)
  const zodiacIndex = (year - 4) % 12;
  const zodiac = KHMER_ZODIAC_YEARS[zodiacIndex >= 0 ? zodiacIndex : 0] || 'ម្សាញ់';
  const sak = KHMER_SAK[(year - 2020 + 2) % 10] || 'សប្តស័ក';

  // Lunar approximate
  const lunarDayWords = ['មួយ', 'ពីរ', 'បី', 'បួន', 'ប្រាំ', 'ប្រាំមួយ', 'ប្រាំពីរ', 'ប្រាំបី', 'ប្រាំបួន', 'ដប់', 'ដប់មួយ', 'ដប់ពីរ', 'ដប់បី', 'ដប់បួន', 'ដប់ប្រាំ'];
  const lunarDayNum = ((day % 15) || 15);
  const lunarPhase = day > 15 ? 'រោច' : 'កើត';
  const lunarDayName = lunarDayWords[lunarDayNum - 1] || 'បួន';
  const lunarMonth = KHMER_LUNAR_MONTHS[month] || 'កត្តិក';

  // Time format
  const cleanTime = timeStr || '8:00 AM';
  const khmerTime = toKhmerNumeral(cleanTime.replace(/AM|PM/i, '').trim());

  // Khmer solar date formatted (e.g., ថ្ងៃទី២៥ ខែសីហា ឆ្នាំ២០២៦)
  const solarDateStr = `ថ្ងៃទី${toKhmerNumeral(day)} ខែ${monthWord} ឆ្នាំ${toKhmerNumeral(year)}`;
  const lunarDateStr = `ត្រូវនឹងថ្ងៃ${dayName} ${toKhmerNumeral(lunarDayNum)}${lunarPhase} ខែ${lunarMonth} ឆ្នាំ${zodiac} ${sak} ពុទ្ធសករាជ ${toKhmerNumeral(beYear)}`;

  const dateFormula = `ឆ្នាំ${yearWord} ខែ${monthWord} ថ្ងៃទី${dayWord} ត្រូវនឹងថ្ងៃ${dayName} ${lunarDayName}${lunarPhase} ខែ${lunarMonth} ឆ្នាំ${zodiac} ${sak} ពុទ្ធសករាជ ${beYearWord}`;

  const introText = `${dateFormula} វេលាម៉ោង${khmerTime} នៅ${locationStr || 'សាលាបឋមសិក្សា'} បានបើកកិច្ចប្រជុំមួយដើម្បី ${topicStr || 'ការប្រជុំគណៈកម្មការគ្រប់គ្រងសាលារៀន(គ.គ.ស.)'} ដែលដឹកនាំដោយ${leaderStr || 'លោក/លោកស្រី នាយកសាលា'} ជាប្រធានអង្គប្រជុំ។`;

  const attendanceDateLocation = `${solarDateStr} ${lunarDateStr} នៅក្នុងបរិវេណ${locationStr || 'សាលាបឋមសិក្សា រោគ'}។`;

  return { introText, attendanceDateLocation };
}

/**
 * Convert time string (e.g. "8:00 AM", "11:00 AM", "4:30 PM", "16:30") to spoken formal Khmer words
 */
export function convertTimeToKhmerSpokenWords(timeStr: string): string {
  if (!timeStr) return 'ម៉ោងដប់មួយ និងសូន្យនាទីព្រឹក';
  
  const isPM = /PM|រសៀល|ល្ងាច/i.test(timeStr);
  const isAM = /AM|ព្រឹក/i.test(timeStr);

  const cleanDigits = timeStr.replace(/[^\d:]/g, '').trim();
  const parts = cleanDigits.split(':');
  let hour = parseInt(parts[0] || '11', 10);
  const minute = parseInt(parts[1] || '0', 10);

  if (isNaN(hour)) hour = isPM ? 4 : 11;
  
  // Convert 24-hour to 12-hour
  let displayHour = hour;
  let periodSuffix = '';
  if (hour > 12) {
    displayHour = hour - 12;
    periodSuffix = ''; // In PM formal letter, e.g. "ម៉ោងបួន និងសាមសិបនាទី" or "ម៉ោងបួន និងសាមសិបនាទីរសៀល"
  } else if (isPM && hour !== 12) {
    displayHour = hour;
    periodSuffix = '';
  } else if (isAM || hour <= 12) {
    periodSuffix = 'ព្រឹក';
  }

  const hourWord = KHMER_NUM_WORDS[displayHour] || convertNumberToKhmerWords(displayHour);
  const minuteWord = (minute === 0) ? 'សូន្យ' : (KHMER_NUM_WORDS[minute] || convertNumberToKhmerWords(minute));

  if (periodSuffix) {
    return `ម៉ោង${hourWord} និង${minuteWord}នាទី${periodSuffix}`;
  }
  return `ម៉ោង${hourWord} និង${minuteWord}នាទី`;
}

/**
 * Generate formal Khmer conclusion text for meeting minutes
 * Based on user specification:
 * - Morning (AM): "អង្គប្រជុំនេះ បានបញ្ចប់នៅវេលាម៉ោងដប់មួយ និងសូន្យនាទីព្រឹក នាថ្ងៃខែឆ្នាំដដែល ក្រោមបរិយាកាសរីករាយ និងស្និទ្ធស្នាលក្រៃលែង។"
 * - Afternoon (PM): "អង្គប្រជុំនេះ បានបញ្ចប់នៅវេលាម៉ោងបួន និងសាមសិបនាទី នាថ្ងៃខែឆ្នាំដដែល ក្រោមបរិយាកាសរីករាយ និងស្និទ្ធស្នាលក្រៃលែង។"
 */
export function generateFormalKhmerConclusionText(startTimeStr?: string, customEndTimeWords?: string): string {
  if (customEndTimeWords && customEndTimeWords.trim()) {
    const cleanTimeWords = customEndTimeWords.trim().replace(/^នៅវេលា|^វេលា/, '').trim();
    return `អង្គប្រជុំនេះ បានបញ្ចប់នៅវេលា${cleanTimeWords} នាថ្ងៃខែឆ្នាំដដែល ក្រោមបរិយាកាសរីករាយ និងស្និទ្ធស្នាលក្រៃលែង។`;
  }

  const cleanTime = startTimeStr || '8:00 AM';
  const isPM = /PM|រសៀល|ល្ងាច/i.test(cleanTime) || (parseInt(cleanTime, 10) >= 13);

  if (isPM) {
    return `អង្គប្រជុំនេះ បានបញ្ចប់នៅវេលាម៉ោងបួន និងសាមសិបនាទី នាថ្ងៃខែឆ្នាំដដែល ក្រោមបរិយាកាសរីករាយ និងស្និទ្ធស្នាលក្រៃលែង។`;
  } else {
    return `អង្គប្រជុំនេះ បានបញ្ចប់នៅវេលាម៉ោងដប់មួយ និងសូន្យនាទីព្រឹក នាថ្ងៃខែឆ្នាំដដែល ក្រោមបរិយាកាសរីករាយ និងស្និទ្ធស្នាលក្រៃលែង។`;
  }
}

