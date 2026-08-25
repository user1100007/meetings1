import React, { useState, useEffect, useRef } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { MeetingReport, Attendee } from './types';
import { DEFAULT_MEETINGS_DATA, MEETING_TEMPLATES_META } from './defaultData';
import { MeetingSelector } from './components/MeetingSelector';
import { MeetingCardEditor } from './components/MeetingCardEditor';
import { MeetingPrintDocument } from './components/MeetingPrintDocument';
import { SignaturePadModal } from './components/SignaturePadModal';
import { KhmerCalendarModal } from './components/KhmerCalendarModal';
import { generateFormalKhmerDateText, generateFormalKhmerConclusionText } from './utils/khmerDate';
import { Edit3, CheckCircle2, RefreshCw } from 'lucide-react';
import { Language, ThemeMode, ScreenSize, translations } from './utils/translations';

export default function App() {
  const [meetingsData, setMeetingsData] = useState<Record<string, MeetingReport>>(() => {
    // Attempt local storage cache first
    try {
      const cached = localStorage.getItem('khmer_meetings_7_data_v2');
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (e) {
      console.warn('LocalStorage read error:', e);
    }
    return DEFAULT_MEETINGS_DATA;
  });

  const [activeMeetingId, setActiveMeetingId] = useState<string>('meeting_1');
  const [activeTab, setActiveTab] = useState<'preview' | 'cards'>('preview');
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const [isKhmerCalendarOpen, setIsKhmerCalendarOpen] = useState(false);

  // Screen size, Theme Mode, Language
  const [screenSize, setScreenSize] = useState<ScreenSize>(() => {
    return (localStorage.getItem('khmer_meeting_screen_size') as ScreenSize) || 'browser';
  });
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    return (localStorage.getItem('khmer_meeting_theme_mode') as ThemeMode) || 'light';
  });
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('khmer_meeting_language') as Language) || 'km';
  });

  // Attendee Modal state
  const [isAttendeeModalOpen, setIsAttendeeModalOpen] = useState(false);
  const [selectedAttendee, setSelectedAttendee] = useState<Attendee | null>(null);

  // Debounce ref for auto-save
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Active meeting data
  const currentMeeting: MeetingReport = meetingsData[activeMeetingId] || DEFAULT_MEETINGS_DATA[activeMeetingId] || DEFAULT_MEETINGS_DATA['meeting_1'];
  const t = translations[language];

  // Apply dark mode class to html document
  useEffect(() => {
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('khmer_meeting_theme_mode', themeMode);
  }, [themeMode]);

  useEffect(() => {
    localStorage.setItem('khmer_meeting_screen_size', screenSize);
  }, [screenSize]);

  useEffect(() => {
    localStorage.setItem('khmer_meeting_language', language);
  }, [language]);

  // Load from Firestore on mount
  useEffect(() => {
    let isMounted = true;
    async function loadAllFromFirestore() {
      try {
        const loadedMeetings: Record<string, MeetingReport> = { ...DEFAULT_MEETINGS_DATA };
        for (const meta of MEETING_TEMPLATES_META) {
          try {
            const docRef = doc(db, 'meetings', meta.id);
            const snap = await getDoc(docRef);
            if (snap.exists()) {
              loadedMeetings[meta.id] = snap.data() as MeetingReport;
            }
          } catch (err) {
            console.warn(`Firestore read failed for ${meta.id}:`, err);
          }
        }
        if (isMounted) {
          setMeetingsData(loadedMeetings);
          const now = new Date().toLocaleTimeString(language === 'km' ? 'km-KH' : 'en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          });
          setLastSavedTime(now);
          try {
            localStorage.setItem('khmer_meetings_7_data_v2', JSON.stringify(loadedMeetings));
          } catch (e) {}
        }
      } catch (err) {
        console.warn('Could not load meetings from cloud:', err);
      }
    }

    loadAllFromFirestore();
    return () => {
      isMounted = false;
    };
  }, [language]);

  // Save to Firestore function
  const saveMeetingToCloud = async (meetingToSave: MeetingReport, allData: Record<string, MeetingReport>) => {
    setIsSaving(true);
    try {
      const docRef = doc(db, 'meetings', meetingToSave.meetingId);
      await setDoc(docRef, meetingToSave, { merge: true });
      
      const now = new Date().toLocaleTimeString(language === 'km' ? 'km-KH' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      setLastSavedTime(now);
      setHasUnsavedChanges(false);
    } catch (err) {
      console.warn('Firestore sync failed, retained in LocalStorage:', err);
      const now = new Date().toLocaleTimeString(language === 'km' ? 'km-KH' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      setLastSavedTime(now);
      setHasUnsavedChanges(false);
    } finally {
      setIsSaving(false);
    }
  };

  // Update meeting state with Auto-Save
  const handleUpdateCurrentMeeting = (updated: MeetingReport) => {
    const nextData = {
      ...meetingsData,
      [activeMeetingId]: updated
    };

    setMeetingsData(nextData);
    setHasUnsavedChanges(true);

    // 1. Instant local persistence
    try {
      localStorage.setItem('khmer_meetings_7_data_v2', JSON.stringify(nextData));
    } catch (e) {}

    // 2. Debounced auto-save to cloud (1000ms delay)
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(() => {
      saveMeetingToCloud(updated, nextData);
    }, 1200);
  };

  // Manual save trigger
  const handleManualSave = async () => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    await saveMeetingToCloud(currentMeeting, meetingsData);
    setSaveStatus(language === 'km' ? '✅ បានរក្សាទុកទិន្នន័យជោគជ័យ!' : '✅ Data successfully saved!');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  // Reset to default template
  const handleResetTemplate = () => {
    const confirmMsg = language === 'km' 
      ? 'តើអ្នកពិតជាចង់កំណត់ទម្រង់ដើមនៃកិច្ចប្រជុំនេះឡើងវិញមែនទេ?' 
      : 'Are you sure you want to reset this meeting to its default template?';
    if (window.confirm(confirmMsg)) {
      const template = DEFAULT_MEETINGS_DATA[activeMeetingId];
      if (template) {
        handleUpdateCurrentMeeting(template);
      }
    }
  };

  // Attendee Modal Handlers
  const handleOpenAttendeeModal = (attendee?: Attendee) => {
    setSelectedAttendee(attendee || null);
    setIsAttendeeModalOpen(true);
  };

  const handleSaveAttendee = (newOrUpdatedAttendee: Attendee) => {
    const existingIndex = currentMeeting.attendees.findIndex((a) => a.id === newOrUpdatedAttendee.id);
    let updatedAttendees: Attendee[];

    if (existingIndex >= 0) {
      updatedAttendees = [...currentMeeting.attendees];
      updatedAttendees[existingIndex] = newOrUpdatedAttendee;
    } else {
      updatedAttendees = [...currentMeeting.attendees, newOrUpdatedAttendee];
    }

    handleUpdateCurrentMeeting({
      ...currentMeeting,
      attendees: updatedAttendees
    });
  };

  const handleDeleteAttendee = (id: string) => {
    const confirmMsg = language === 'km' ? 'តើអ្នកពិតជាចង់លុបវត្តមាននេះមែនទេ?' : 'Delete this attendee?';
    if (window.confirm(confirmMsg)) {
      const updatedAttendees = currentMeeting.attendees.filter((a) => a.id !== id);
      handleUpdateCurrentMeeting({
        ...currentMeeting,
        attendees: updatedAttendees
      });
    }
  };

  // Container styling based on screen size switcher
  const getScreenContainerClass = () => {
    switch (screenSize) {
      case 'phone':
        return 'max-w-[410px] mx-auto my-6 p-4 rounded-[40px] border-8 border-slate-800 dark:border-slate-700 shadow-2xl bg-slate-900 overflow-hidden';
      case 'pc':
        return 'max-w-6xl mx-auto my-4 rounded-2xl border border-slate-300 dark:border-slate-700 shadow-lg p-2 bg-slate-50 dark:bg-slate-900';
      case 'app':
        return 'max-w-5xl mx-auto my-3 rounded-2xl border border-slate-200 dark:border-slate-800 p-3 shadow-md bg-white dark:bg-slate-900';
      case 'browser':
      default:
        return 'w-full max-w-7xl mx-auto';
    }
  };

  return (
    <div className={`min-h-screen ${themeMode === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'} font-sans flex flex-col selection:bg-indigo-500 selection:text-white transition-colors duration-200`}>
      {/* Top Selector & Navigation Toolbar */}
      <MeetingSelector
        activeMeetingId={activeMeetingId}
        onSelectMeeting={(id) => setActiveMeetingId(id)}
        activeTab={activeTab}
        onChangeTab={(tab) => setActiveTab(tab)}
        onSaveToCloud={handleManualSave}
        onResetTemplate={handleResetTemplate}
        onOpenAttendeeModal={() => handleOpenAttendeeModal()}
        onOpenKhmerCalendar={() => setIsKhmerCalendarOpen(true)}
        isSaving={isSaving}
        hasUnsavedChanges={hasUnsavedChanges}
        saveStatus={saveStatus}
        lastSavedTime={lastSavedTime}
        currentMeeting={currentMeeting}
        screenSize={screenSize}
        onChangeScreenSize={setScreenSize}
        themeMode={themeMode}
        onToggleThemeMode={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}
        language={language}
        onChangeLanguage={setLanguage}
      />

      {/* Main Content Area framed by Screen Switcher */}
      <div className={`flex-1 px-2 sm:px-4 py-4 ${getScreenContainerClass()}`}>
        {/* Phone Mockup Status Bar if Phone mode is active */}
        {screenSize === 'phone' && (
          <div className="bg-slate-900 text-white text-[11px] px-6 py-1 flex items-center justify-between font-bold rounded-t-[30px] select-none">
            <span>9:41</span>
            <div className="w-16 h-3 bg-black rounded-full mx-auto" />
            <div className="flex items-center gap-1">
              <span>5G</span>
              <div className="w-5 h-2.5 border border-white rounded-xs p-0.5 flex items-center">
                <div className="w-full h-full bg-white rounded-2xs" />
              </div>
            </div>
          </div>
        )}

        <main className="w-full">
          {activeTab === 'preview' ? (
            <div className="space-y-4">
              <div className={`flex items-center justify-between px-5 py-3 rounded-xl border shadow-xs print:hidden ${
                themeMode === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
              }`}>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {t.officialAdminLayout}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('cards')}
                    className="text-xs font-bold text-indigo-700 dark:text-indigo-300 hover:text-indigo-900 bg-indigo-50 dark:bg-indigo-950 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{t.editCards}</span>
                  </button>
                </div>
              </div>

              {/* The Paper Document */}
              <div className="overflow-x-auto pb-4">
                <MeetingPrintDocument meeting={currentMeeting} />
              </div>
            </div>
          ) : (
            <MeetingCardEditor
              meeting={currentMeeting}
              onChange={handleUpdateCurrentMeeting}
              onOpenAttendeeModal={handleOpenAttendeeModal}
              onDeleteAttendee={handleDeleteAttendee}
              language={language}
              themeMode={themeMode}
            />
          )}
        </main>
      </div>

      {/* Signature & Attendee Modal */}
      <SignaturePadModal
        isOpen={isAttendeeModalOpen}
        onClose={() => {
          setIsAttendeeModalOpen(false);
          setSelectedAttendee(null);
        }}
        onSave={handleSaveAttendee}
        initialAttendee={selectedAttendee}
      />

      {/* Khmer Calendar Modal */}
      <KhmerCalendarModal
        isOpen={isKhmerCalendarOpen}
        onClose={() => setIsKhmerCalendarOpen(false)}
        selectedDateStr={currentMeeting.date}
        meetingTime={currentMeeting.time}
        meetingLocation={currentMeeting.location}
        meetingTopic={currentMeeting.topic}
        meetingLeader={`${currentMeeting.leaderName} (${currentMeeting.leaderRole})`}
        onSelectDate={(newDateStr, generatedTexts) => {
          if (generatedTexts) {
            handleUpdateCurrentMeeting({
              ...currentMeeting,
              date: newDateStr,
              introText: generatedTexts.introText,
              attendanceDateLocation: generatedTexts.attendanceDateLocation,
              conclusionText: generatedTexts.conclusionText
            });
          } else {
            const { introText, attendanceDateLocation } = generateFormalKhmerDateText(
              newDateStr,
              currentMeeting.time,
              currentMeeting.location,
              currentMeeting.topic,
              `${currentMeeting.leaderName} (${currentMeeting.leaderRole})`
            );
            const conclusionText = generateFormalKhmerConclusionText(currentMeeting.time);
            handleUpdateCurrentMeeting({
              ...currentMeeting,
              date: newDateStr,
              introText,
              attendanceDateLocation,
              conclusionText
            });
          }
        }}
      />
    </div>
  );
}
