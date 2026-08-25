import React, { useState } from 'react';
import { 
  ChevronDown, 
  CheckCircle2, 
  FileText, 
  Edit3, 
  Printer, 
  Save, 
  RefreshCw, 
  Users, 
  Download, 
  FileCode, 
  Sun, 
  Moon, 
  Smartphone, 
  Monitor, 
  Layout, 
  Globe, 
  Layers
} from 'lucide-react';
import { MEETING_TEMPLATES_META } from '../defaultData';
import { toKhmerNumeral } from '../utils/khmerDate';
import { Language, ThemeMode, ScreenSize, translations } from '../utils/translations';
import { exportMeetingToWord, exportMeetingToHtml, exportMeetingToJson } from '../utils/exportDocument';
import { MeetingReport } from '../types';

interface MeetingSelectorProps {
  activeMeetingId: string;
  onSelectMeeting: (id: string) => void;
  activeTab: 'preview' | 'cards';
  onChangeTab: (tab: 'preview' | 'cards') => void;
  onSaveToCloud: () => void;
  onResetTemplate: () => void;
  onOpenAttendeeModal: () => void;
  onOpenKhmerCalendar?: () => void;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  saveStatus: string | null;
  lastSavedTime: string | null;
  currentMeeting: MeetingReport;
  
  // New props for screen, mode, language
  screenSize: ScreenSize;
  onChangeScreenSize: (size: ScreenSize) => void;
  themeMode: ThemeMode;
  onToggleThemeMode: () => void;
  language: Language;
  onChangeLanguage: (lang: Language) => void;
}

export const MeetingSelector: React.FC<MeetingSelectorProps> = ({
  activeMeetingId,
  onSelectMeeting,
  activeTab,
  onChangeTab,
  onSaveToCloud,
  onResetTemplate,
  onOpenAttendeeModal,
  onOpenKhmerCalendar,
  isSaving,
  hasUnsavedChanges,
  saveStatus,
  lastSavedTime,
  currentMeeting,
  screenSize,
  onChangeScreenSize,
  themeMode,
  onToggleThemeMode,
  language,
  onChangeLanguage,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [screenMenuOpen, setScreenMenuOpen] = useState(false);

  const t = translations[language];
  const activeMeta = MEETING_TEMPLATES_META.find((m) => m.id === activeMeetingId) || MEETING_TEMPLATES_META[0];

  return (
    <header className={`${themeMode === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'} border-b sticky top-0 z-40 shadow-xs print:hidden transition-colors`}>
      {/* Top Utility Controls: Screen Size, Theme Mode, Language, Auto-save status */}
      <div className={`border-b ${themeMode === 'dark' ? 'border-slate-800 bg-slate-950/60' : 'border-slate-100 bg-slate-50/80'} px-4 py-1.5 text-xs`}>
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Left: Auto-save status indicator */}
          <div className="flex items-center gap-2">
            {isSaving ? (
              <span className="inline-flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-medium">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>{t.autoSaving}</span>
              </span>
            ) : lastSavedTime ? (
              <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{t.autoSaved} ({lastSavedTime})</span>
              </span>
            ) : hasUnsavedChanges ? (
              <span className="inline-flex items-center gap-1.5 text-amber-500 font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                <span>{t.unsavedChanges}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                <span>{t.autoSaved}</span>
              </span>
            )}
          </div>

          {/* Right: Screen Switcher, Theme Toggle, Language */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Screen Size Switcher */}
            <div className="flex items-center bg-slate-200/80 dark:bg-slate-800 p-0.5 rounded-lg">
              <button
                onClick={() => onChangeScreenSize('browser')}
                title={t.screenBrowser}
                className={`p-1.5 rounded-md transition flex items-center gap-1 ${
                  screenSize === 'browser'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span className="hidden md:inline text-[11px] font-bold">Browser</span>
              </button>
              <button
                onClick={() => onChangeScreenSize('pc')}
                title={t.screenPc}
                className={`p-1.5 rounded-md transition flex items-center gap-1 ${
                  screenSize === 'pc'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden md:inline text-[11px] font-bold">PC</span>
              </button>
              <button
                onClick={() => onChangeScreenSize('app')}
                title={t.screenApp}
                className={`p-1.5 rounded-md transition flex items-center gap-1 ${
                  screenSize === 'app'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Layout className="w-3.5 h-3.5" />
                <span className="hidden md:inline text-[11px] font-bold">App</span>
              </button>
              <button
                onClick={() => onChangeScreenSize('phone')}
                title={t.screenPhone}
                className={`p-1.5 rounded-md transition flex items-center gap-1 ${
                  screenSize === 'phone'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden md:inline text-[11px] font-bold">Phone</span>
              </button>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={onToggleThemeMode}
              title={themeMode === 'dark' ? t.lightMode : t.darkMode}
              className={`p-1.5 rounded-lg border transition flex items-center gap-1 font-bold ${
                themeMode === 'dark'
                  ? 'bg-slate-800 border-slate-700 text-amber-300 hover:bg-slate-700'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-xs'
              }`}
            >
              {themeMode === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[11px]">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="hidden sm:inline text-[11px]">Dark</span>
                </>
              )}
            </button>

            {/* Language Toggle Button */}
            <div className="flex items-center bg-slate-200/80 dark:bg-slate-800 p-0.5 rounded-lg">
              <button
                onClick={() => onChangeLanguage('km')}
                className={`px-2 py-1 rounded-md text-[11px] font-bold transition ${
                  language === 'km'
                    ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                🇰🇭 ខ្មែរ
              </button>
              <button
                onClick={() => onChangeLanguage('en')}
                className={`px-2 py-1 rounded-md text-[11px] font-bold transition ${
                  language === 'en'
                    ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                🇬🇧 EN
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Bar: Meeting Selector, Tabs, Attendance, Export & Print */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Left: Meeting Dropdown Selector */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={`flex items-center gap-3 border rounded-xl px-4 py-2 text-left transition w-full sm:w-auto shadow-xs ${
                themeMode === 'dark'
                  ? 'bg-slate-800 border-slate-700 hover:bg-slate-750 text-white'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-300 text-slate-900'
              }`}
            >
              <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-moul font-bold text-sm shadow-xs shrink-0">
                {toKhmerNumeral(activeMeta.meetingNumber)}
              </div>
              <div className="min-w-0 pr-2">
                <div className="flex items-center gap-2">
                  <span className="font-moul text-indigo-600 dark:text-indigo-300 text-sm tracking-wide">
                    {activeMeta.label}
                  </span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    themeMode === 'dark' ? 'bg-indigo-950 text-indigo-300' : 'bg-indigo-100 text-indigo-700'
                  }`}>
                    {activeMeta.quarter} ({activeMeta.recommendedMonth})
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[280px] sm:max-w-md mt-0.5">
                  {activeMeta.title}
                </p>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className={`absolute left-0 mt-2 w-full sm:w-[480px] rounded-2xl shadow-2xl border p-2 z-40 max-h-[80vh] overflow-y-auto space-y-1 ${
                  themeMode === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
                }`}>
                  <div className={`px-3 py-2 border-b flex items-center justify-between ${
                    themeMode === 'dark' ? 'border-slate-700' : 'border-slate-100'
                  }`}>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      {t.selectMeetingTitle}
                    </span>
                    <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-full">
                      {t.meetingCount}
                    </span>
                  </div>

                  {MEETING_TEMPLATES_META.map((meta) => {
                    const isSelected = meta.id === activeMeetingId;
                    return (
                      <button
                        key={meta.id}
                        onClick={() => {
                          onSelectMeeting(meta.id);
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left p-3 rounded-xl transition flex items-start gap-3 ${
                          isSelected
                            ? themeMode === 'dark'
                              ? 'bg-indigo-950/70 border border-indigo-700 text-white'
                              : 'bg-indigo-50/90 border border-indigo-200 text-indigo-950'
                            : themeMode === 'dark'
                              ? 'hover:bg-slate-750 text-slate-200 border border-transparent'
                              : 'hover:bg-slate-50 border border-transparent text-slate-800'
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center font-moul text-xs shrink-0 mt-0.5 ${
                            isSelected
                              ? 'bg-indigo-600 text-white font-bold'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {toKhmerNumeral(meta.meetingNumber)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-sm font-moul text-indigo-600 dark:text-indigo-300 leading-snug">
                              {meta.label}
                            </span>
                            <span className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium px-2 py-0.5 rounded-full shrink-0">
                              {meta.recommendedMonth}
                            </span>
                          </div>
                          <p className="text-xs font-medium text-slate-800 dark:text-slate-200 mt-1 line-clamp-1">
                            {meta.title}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                            {meta.shortDescription}
                          </p>
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0 mt-1" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Center / Right: Tabs & Actions */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {/* View Mode Toggle */}
            <div className={`p-1 rounded-xl flex items-center border ${
              themeMode === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'
            }`}>
              <button
                onClick={() => onChangeTab('preview')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeTab === 'preview'
                    ? themeMode === 'dark'
                      ? 'bg-slate-700 text-indigo-300 shadow-xs'
                      : 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.documentView}</span>
                <span className="sm:hidden">ឯកសារ</span>
              </button>
              <button
                onClick={() => onChangeTab('cards')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeTab === 'cards'
                    ? themeMode === 'dark'
                      ? 'bg-slate-700 text-indigo-300 shadow-xs'
                      : 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.editCards}</span>
                <span className="sm:hidden">កែប្រែ</span>
              </button>
            </div>

            {/* Khmer Calendar Trigger */}
            {onOpenKhmerCalendar && (
              <button
                onClick={onOpenKhmerCalendar}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
                  themeMode === 'dark'
                    ? 'bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-800'
                    : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300'
                }`}
                title="ប្រតិទិនខ្មែរ ចន្ទគតិ & ថ្ងៃបុណ្យជាតិ"
              >
                <span>📅</span>
                <span className="hidden sm:inline">ប្រតិទិនខ្មែរ</span>
              </button>
            )}

            {/* Attendance Modal Trigger */}
            <button
              onClick={onOpenAttendeeModal}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
                themeMode === 'dark'
                  ? 'bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-emerald-500" />
              <span>+ {t.addAttendance}</span>
            </button>

            {/* Export Dropdown Menu */}
            <div className="relative">
              <button
                onClick={() => setExportMenuOpen(!exportMenuOpen)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition shadow-xs border ${
                  themeMode === 'dark'
                    ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-750'
                    : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50'
                }`}
              >
                <Download className="w-3.5 h-3.5 text-indigo-500" />
                <span>{t.export}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {exportMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setExportMenuOpen(false)}
                  />
                  <div className={`absolute right-0 mt-2 w-64 rounded-2xl shadow-2xl border p-2 z-40 space-y-1 ${
                    themeMode === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
                  }`}>
                    <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700">
                      ជម្រើសនៃការទាញយក (Export)
                    </div>
                    {/* Word */}
                    <button
                      onClick={() => {
                        exportMeetingToWord(currentMeeting);
                        setExportMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 hover:bg-blue-50 dark:hover:bg-blue-950/60 text-blue-700 dark:text-blue-300 transition"
                    >
                      <FileText className="w-4 h-4 text-blue-600" />
                      <div>
                        <div>{t.exportWord}</div>
                        <div className="text-[10px] font-normal text-slate-500">កែប្រែក្នុង Microsoft Word</div>
                      </div>
                    </button>
                    {/* HTML */}
                    <button
                      onClick={() => {
                        exportMeetingToHtml(currentMeeting);
                        setExportMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 hover:bg-amber-50 dark:hover:bg-amber-950/60 text-amber-700 dark:text-amber-300 transition"
                    >
                      <FileCode className="w-4 h-4 text-amber-600" />
                      <div>
                        <div>{t.exportHtml}</div>
                        <div className="text-[10px] font-normal text-slate-500">បើកមើលបានគ្រប់ Browser</div>
                      </div>
                    </button>
                    {/* PDF Print */}
                    <button
                      onClick={() => {
                        window.print();
                        setExportMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 hover:bg-red-50 dark:hover:bg-red-950/60 text-red-700 dark:text-red-300 transition"
                    >
                      <Printer className="w-4 h-4 text-red-600" />
                      <div>
                        <div>{t.exportPdf}</div>
                        <div className="text-[10px] font-normal text-slate-500">បោះពុម្ព ឬរក្សាទុកជា PDF A4</div>
                      </div>
                    </button>
                    {/* JSON */}
                    <button
                      onClick={() => {
                        exportMeetingToJson(currentMeeting);
                        setExportMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
                    >
                      <Layers className="w-4 h-4 text-slate-500" />
                      <div>
                        <div>{t.exportJson}</div>
                        <div className="text-[10px] font-normal text-slate-500">ទិន្នន័យដើមបម្រុង (Backup)</div>
                      </div>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Quick Print Button */}
            <button
              onClick={() => window.print()}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition shadow-xs border ${
                themeMode === 'dark'
                  ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
              }`}
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">{t.printOrPdf}</span>
            </button>

            {/* Manual Save Button */}
            <button
              onClick={onSaveToCloud}
              disabled={isSaving}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
                hasUnsavedChanges
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white animate-pulse'
                  : themeMode === 'dark'
                    ? 'bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-800'
                    : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200'
              }`}
            >
              {isSaving ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>{isSaving ? t.saving : t.save}</span>
            </button>
          </div>
        </div>

        {/* Status Toast / Alert */}
        {saveStatus && (
          <div className="mt-2 text-xs font-medium px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              {saveStatus}
            </span>
          </div>
        )}
      </div>
    </header>
  );
};
