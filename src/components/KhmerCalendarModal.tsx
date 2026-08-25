import React, { useState } from 'react';
import {
  getKhmerDateDetails,
  getMonthCalendarDays,
  KhmerDateDetails,
  SOLAR_HOLIDAYS,
  LUNAR_HOLIDAY_RULES
} from '../utils/khmerCalendar';
import {
  toKhmerNumeral,
  KHMER_DAYS,
  KHMER_MONTHS_SOLAR,
  generateFormalKhmerDateText,
  generateFormalKhmerConclusionText
} from '../utils/khmerDate';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Info,
  Layers
} from 'lucide-react';

interface KhmerCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDateStr: string;
  onSelectDate: (dateStr: string, generatedTexts?: {
    introText: string;
    attendanceDateLocation: string;
    conclusionText: string;
  }) => void;
  meetingTime?: string;
  meetingLocation?: string;
  meetingTopic?: string;
  meetingLeader?: string;
}

export const KhmerCalendarModal: React.FC<KhmerCalendarModalProps> = ({
  isOpen,
  onClose,
  selectedDateStr,
  onSelectDate,
  meetingTime = '8:00 AM',
  meetingLocation = 'សាលាបឋមសិក្សា រោគ',
  meetingTopic = 'ការប្រជុំគណៈកម្មការគ្រប់គ្រងសាលារៀន(គ.គ.ស.)',
  meetingLeader = 'លោកស្រី សុខ សារើន (នាយិកាសាលា)'
}) => {
  const initialDate = selectedDateStr ? new Date(selectedDateStr) : new Date();
  const validInitialDate = isNaN(initialDate.getTime()) ? new Date() : initialDate;

  const [currentYear, setCurrentYear] = useState<number>(validInitialDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(validInitialDate.getMonth() + 1); // 1-12
  const [selectedDayDetails, setSelectedDayDetails] = useState<KhmerDateDetails>(() => {
    return getKhmerDateDetails(selectedDateStr || new Date().toISOString().split('T')[0]);
  });
  const [activeTab, setActiveTab] = useState<'calendar' | 'holidaysList'>('calendar');

  if (!isOpen) return null;

  const daysInCurrentMonth = getMonthCalendarDays(currentYear, currentMonth);
  const firstDayOfWeek = new Date(currentYear, currentMonth - 1, 1).getDay(); // 0-6

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleJumpToToday = () => {
    const today = new Date();
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth() + 1);
    const todayDetails = getKhmerDateDetails(today);
    setSelectedDayDetails(todayDetails);
  };

  const handleDayClick = (dayDetails: KhmerDateDetails) => {
    setSelectedDayDetails(dayDetails);
  };

  const handleApplySelectedDate = () => {
    const dateStr = selectedDayDetails.dateStr;
    const { introText, attendanceDateLocation } = generateFormalKhmerDateText(
      dateStr,
      meetingTime,
      meetingLocation,
      meetingTopic,
      meetingLeader
    );
    const conclusionText = generateFormalKhmerConclusionText(meetingTime);

    onSelectDate(dateStr, {
      introText,
      attendanceDateLocation,
      conclusionText
    });
    onClose();
  };

  // Build full year holiday list for display
  const allYearHolidays: Array<{ dateDisplay: string; holiday: string; type: string; isOffDay: boolean; desc?: string }> = [];
  for (let m = 1; m <= 12; m++) {
    const mDays = getMonthCalendarDays(currentYear, m);
    mDays.forEach((d) => {
      if (d.holidays && d.holidays.length > 0) {
        d.holidays.forEach((h) => {
          allYearHolidays.push({
            dateDisplay: `ថ្ងៃទី${toKhmerNumeral(d.day)} ខែ${KHMER_MONTHS_SOLAR[m - 1]} (${d.dayName}) ត្រូវនឹង ${d.lunarDay}${d.lunarPhase} ខែ${d.lunarMonth}`,
            holiday: h.name,
            type: h.type,
            isOffDay: h.isOffDay,
            desc: h.description
          });
        });
      }
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col my-auto transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 text-white px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 shadow-inner">
              <CalendarIcon className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold font-moul tracking-wide text-amber-200">
                  ប្រតិទិនខ្មែរ ចន្ទគតិ & សុរិយគតិ
                </h2>
                <span className="bg-amber-400/20 text-amber-300 border border-amber-300/30 text-[10px] px-2 py-0.5 rounded-full font-sans">
                  Khmer Lunar Calendar
                </span>
              </div>
              <p className="text-xs text-indigo-200">
                ពិនិត្យមើលថ្ងៃសីល ថ្ងៃបុណ្យជាតិ និងថ្ងៃឈប់សម្រាកផ្លូវការ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <div className="flex bg-indigo-950/60 p-0.5 rounded-xl border border-white/10 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('calendar')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === 'calendar'
                    ? 'bg-amber-400 text-indigo-950 shadow-sm'
                    : 'text-indigo-200 hover:text-white'
                }`}
              >
                📅 តារាងខែ
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('holidaysList')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === 'holidaysList'
                    ? 'bg-amber-400 text-indigo-950 shadow-sm'
                    : 'text-indigo-200 hover:text-white'
                }`}
              >
                🎉 ថ្ងៃបុណ្យប្រចាំឆ្នាំ ({toKhmerNumeral(allYearHolidays.length)})
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-indigo-200 hover:text-white hover:bg-white/10 rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {activeTab === 'calendar' ? (
          <div className="p-4 sm:p-6 space-y-5">
            {/* Month & Year Controls Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-2 bg-white dark:bg-slate-700 hover:bg-indigo-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-600 shadow-2xs transition"
                  title="ខែមុន"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2">
                  <select
                    value={currentMonth}
                    onChange={(e) => setCurrentMonth(parseInt(e.target.value, 10))}
                    className="bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 font-bold text-xs sm:text-sm px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 font-moul"
                  >
                    {KHMER_MONTHS_SOLAR.map((m, idx) => (
                      <option key={idx} value={idx + 1}>
                        ខែ {m}
                      </option>
                    ))}
                  </select>

                  <select
                    value={currentYear}
                    onChange={(e) => setCurrentYear(parseInt(e.target.value, 10))}
                    className="bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 font-bold text-xs sm:text-sm px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 font-moul"
                  >
                    {[2024, 2025, 2026, 2027, 2028, 2029, 2030].map((y) => (
                      <option key={y} value={y}>
                        ឆ្នាំ {toKhmerNumeral(y)} ({y})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-2 bg-white dark:bg-slate-700 hover:bg-indigo-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-600 shadow-2xs transition"
                  title="ខែបន្ទាប់"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleJumpToToday}
                  className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 rounded-xl text-xs font-bold transition border border-indigo-200 dark:border-indigo-800"
                >
                  ថ្ងៃនេះ (Today)
                </button>
              </div>

              {/* Lunar Context of the Month */}
              <div className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2 bg-white dark:bg-slate-700/80 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-600 font-serif">
                <span className="font-moul text-indigo-800 dark:text-amber-300">
                  ឆ្នាំ{selectedDayDetails.zodiac} {selectedDayDetails.sak}
                </span>
                <span className="text-slate-400">•</span>
                <span>ព.ស. {toKhmerNumeral(selectedDayDetails.beYear)}</span>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-xs">
              {/* Day of week headers */}
              <div className="grid grid-cols-7 bg-slate-100 dark:bg-slate-800 text-center font-bold text-xs py-2 border-b border-slate-200 dark:border-slate-700">
                <div className="text-red-600 dark:text-red-400">អាទិត្យ (Sun)</div>
                <div className="text-slate-700 dark:text-slate-300">ច័ន្ទ (Mon)</div>
                <div className="text-slate-700 dark:text-slate-300">អង្គារ (Tue)</div>
                <div className="text-slate-700 dark:text-slate-300">ពុធ (Wed)</div>
                <div className="text-slate-700 dark:text-slate-300">ព្រហស្បតិ៍ (Thu)</div>
                <div className="text-blue-700 dark:text-blue-400">សុក្រ (Fri)</div>
                <div className="text-purple-700 dark:text-purple-400">សៅរ៍ (Sat)</div>
              </div>

              {/* Grid cells */}
              <div className="grid grid-cols-7 bg-slate-200 dark:bg-slate-800 gap-[1px]">
                {/* Empty cells before month start */}
                {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="bg-slate-50/50 dark:bg-slate-900/40 min-h-[70px] sm:min-h-[85px] p-1.5 opacity-30"
                  />
                ))}

                {/* Days */}
                {daysInCurrentMonth.map((day) => {
                  const isSelected = selectedDayDetails.dateStr === day.dateStr;
                  const isToday = new Date().toISOString().split('T')[0] === day.dateStr;

                  return (
                    <div
                      key={day.dateStr}
                      onClick={() => handleDayClick(day)}
                      className={`min-h-[70px] sm:min-h-[85px] p-1.5 transition cursor-pointer flex flex-col justify-between relative ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-inner ring-2 ring-indigo-400 z-10'
                          : day.isPublicHoliday
                          ? 'bg-red-50/80 dark:bg-red-950/40 hover:bg-red-100/90 text-slate-800 dark:text-slate-100'
                          : day.isHolyDay
                          ? 'bg-amber-50/80 dark:bg-amber-950/40 hover:bg-amber-100/90 text-slate-800 dark:text-slate-100'
                          : day.isWeekend
                          ? 'bg-slate-50 dark:bg-slate-900/80 hover:bg-slate-100 text-slate-800 dark:text-slate-100'
                          : 'bg-white dark:bg-slate-900 hover:bg-indigo-50/60 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100'
                      }`}
                    >
                      {/* Top: Solar Day Number + Today/Holy badge */}
                      <div className="flex items-start justify-between">
                        <span
                          className={`text-xs sm:text-sm font-bold ${
                            isSelected
                              ? 'text-white'
                              : day.dayOfWeek === 0
                              ? 'text-red-600 dark:text-red-400'
                              : day.dayOfWeek === 6
                              ? 'text-purple-600 dark:text-purple-400'
                              : 'text-slate-900 dark:text-slate-100'
                          }`}
                        >
                          {day.day}
                        </span>

                        <div className="flex items-center gap-1">
                          {isToday && (
                            <span
                              className={`w-2 h-2 rounded-full ${
                                isSelected ? 'bg-amber-300' : 'bg-emerald-500'
                              }`}
                              title="ថ្ងៃនេះ"
                            />
                          )}

                          {day.isHolyDay && (
                            <span
                              className={`text-[10px] px-1 py-0.2 rounded font-mono ${
                                isSelected
                                  ? 'bg-white/20 text-amber-200'
                                  : 'bg-amber-200 text-amber-900'
                              }`}
                              title={day.holyDayLabel}
                            >
                              🪷
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Middle: Lunar Day & Phase */}
                      <div className="my-0.5 text-center">
                        <p
                          className={`text-[10px] sm:text-[11px] font-medium leading-tight ${
                            isSelected
                              ? 'text-indigo-100'
                              : day.isHolyDay
                              ? 'text-amber-800 dark:text-amber-300 font-bold'
                              : 'text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {toKhmerNumeral(day.lunarDay)}{day.lunarPhase}
                        </p>
                        <p
                          className={`text-[9px] truncate max-w-full ${
                            isSelected ? 'text-indigo-200' : 'text-slate-400'
                          }`}
                        >
                          {day.lunarMonth}
                        </p>
                      </div>

                      {/* Bottom: Holiday Indicator Pill */}
                      {day.holidays && day.holidays.length > 0 && (
                        <div
                          className={`text-[8px] sm:text-[9px] px-1 py-0.5 rounded truncate font-bold ${
                            isSelected
                              ? 'bg-red-500 text-white'
                              : 'bg-red-600 text-white'
                          }`}
                          title={day.holidays.map((h) => h.name).join(', ')}
                        >
                          {day.holidays[0].name.split('(')[0].trim()}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Date Summary & Apply Section */}
            <div className="bg-indigo-50/80 dark:bg-indigo-950/40 rounded-2xl p-4 border border-indigo-200 dark:border-indigo-800/80 space-y-3">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-moul text-xs text-indigo-950 dark:text-indigo-200 font-bold">
                      កាលបរិច្ឆេទដែលបានជ្រើសរើស (Selected Date)៖
                    </span>
                    {selectedDayDetails.isPublicHoliday && (
                      <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> ថ្ងៃឈប់សម្រាកផ្លូវការ
                      </span>
                    )}
                    {selectedDayDetails.isHolyDay && (
                      <span className="bg-amber-500 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        🪷 {selectedDayDetails.holyDayLabel}
                      </span>
                    )}
                    {selectedDayDetails.isWeekend && !selectedDayDetails.isPublicHoliday && (
                      <span className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        ថ្ងៃចុងសប្តាហ៍ ({selectedDayDetails.dayName})
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm font-bold text-indigo-900 dark:text-amber-200 font-moul leading-relaxed">
                    {selectedDayDetails.fullKhmerPhrase}
                  </p>

                  {selectedDayDetails.holidays.length > 0 && (
                    <div className="text-xs text-red-700 dark:text-red-300 font-medium space-y-0.5 pt-0.5">
                      {selectedDayDetails.holidays.map((h, hIdx) => (
                        <p key={hIdx} className="flex items-center gap-1">
                          🎉 <span className="font-bold">{h.name}</span> {h.description && `— ${h.description}`}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleApplySelectedDate}
                    className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold rounded-xl text-xs sm:text-sm transition shadow-md flex items-center justify-center gap-2 font-moul"
                  >
                    <CheckCircle2 className="w-4 h-4 text-amber-300" />
                    កំណត់ថ្ងៃនេះក្នុងកំណត់ហេតុ (Apply Date)
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Year Holidays List Tab */
          <div className="p-4 sm:p-6 space-y-4 max-h-[65vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-sm sm:text-base font-moul text-slate-900 dark:text-slate-100">
                បញ្ជីថ្ងៃបុណ្យជាតិ & ថ្ងៃឈប់សម្រាកផ្លូវការក្នុងឆ្នាំ {toKhmerNumeral(currentYear)} ({currentYear})
              </h3>
              <span className="text-xs text-slate-500">សរុប {toKhmerNumeral(allYearHolidays.length)} ថ្ងៃបុណ្យ</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {allYearHolidays.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-400 transition space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-indigo-700 dark:text-amber-300">
                      {item.dateDisplay}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        item.isOffDay
                          ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {item.isOffDay ? 'ឈប់សម្រាក' : 'ពិធីបុណ្យ'}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 font-moul leading-snug">
                    {item.holiday}
                  </h4>
                  {item.desc && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      {item.desc}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer info note */}
        <div className="bg-slate-100 dark:bg-slate-800/80 px-5 py-3 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
          <div className="flex items-center gap-1.5">
            <Info className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>
              ចុចលើថ្ងៃណាមួយក្នុងតារាង ដើម្បីពិនិត្យ ឬកំណត់កាលបរិច្ឆេទចូលក្នុងកំណត់ហេតុដោយស្វ័យប្រវត្តិ។
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-indigo-600 px-3 py-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg transition"
          >
            បិទ (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
