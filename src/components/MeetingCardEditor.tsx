import React, { useState } from 'react';
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  User,
  School,
  Plus,
  Trash2,
  Edit2,
  FileCheck,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Layers,
  Users,
  PenTool,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  ClipboardList,
  Paperclip,
  FileText,
  FileSpreadsheet,
  Download,
  Eye,
  Upload,
  CalendarCheck2
} from 'lucide-react';
import { MeetingReport, Attendee, ActionItem, ReferenceDocument } from '../types';
import {
  generateFormalKhmerDateText,
  generateFormalKhmerConclusionText,
  convertTimeToKhmerSpokenWords,
  toKhmerNumeral
} from '../utils/khmerDate';
import { getKhmerDateDetails } from '../utils/khmerCalendar';
import { KhmerCalendarModal } from './KhmerCalendarModal';
import { Language, ThemeMode, translations } from '../utils/translations';

interface MeetingCardEditorProps {
  meeting: MeetingReport;
  onChange: (updated: MeetingReport) => void;
  onOpenAttendeeModal: (attendee?: Attendee) => void;
  onDeleteAttendee: (id: string) => void;
  language?: Language;
  themeMode?: ThemeMode;
}

export const MeetingCardEditor: React.FC<MeetingCardEditorProps> = ({
  meeting,
  onChange,
  onOpenAttendeeModal,
  onDeleteAttendee,
  language = 'km',
  themeMode = 'light'
}) => {
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [activeCard, setActiveCard] = useState<string>('card1');
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [docViewMode, setDocViewMode] = useState<'a4-sheet' | 'list'>('a4-sheet');
  const [isKhmerCalendarOpen, setIsKhmerCalendarOpen] = useState(false);
  const [customEndTimeInput, setCustomEndTimeInput] = useState('11:00 AM');
  const t = translations[language];

  // Quick date summary details
  const selectedKhmerDate = getKhmerDateDetails(meeting.date || new Date().toISOString().split('T')[0]);

  // Handle direct field updates
  const updateField = <K extends keyof MeetingReport>(field: K, value: MeetingReport[K]) => {
    onChange({
      ...meeting,
      [field]: value
    });
  };

  // AI Auto-Transformation
  const handleAITransform = async () => {
    setIsGeneratingAI(true);
    setAiMessage(null);

    try {
      // First attempt backend Gemini API call
      const res = await fetch('/api/gemini/generate-meeting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meetingNumber: meeting.meetingId.replace('meeting_', ''),
          topic: meeting.topic,
          date: meeting.date,
          time: meeting.time,
          location: meeting.location,
          schoolName: meeting.schoolName,
          district: meeting.district,
          leaderName: meeting.leaderName,
          leaderRole: meeting.leaderRole
        })
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const aiData = json.data;
          onChange({
            ...meeting,
            introText: aiData.introText || meeting.introText,
            agendas: aiData.agendas && aiData.agendas.length > 0 ? aiData.agendas : meeting.agendas,
            processes: aiData.processes && aiData.processes.length > 0 ? aiData.processes : meeting.processes,
            executiveSummary: aiData.executiveSummary || meeting.executiveSummary,
            conclusionText: aiData.conclusionText || meeting.conclusionText,
            attendanceDateLocation: aiData.attendanceDateLocation || meeting.attendanceDateLocation
          });
          setAiMessage('✨ AI បានបម្លែងខ្លឹមសារកំណត់ហេតុ និងរបៀបវារៈដោយជោគជ័យ!');
          setIsGeneratingAI(false);
          return;
        }
      }
    } catch (err) {
      console.warn('API fetch failed or offline, falling back to instant client-side converter:', err);
    }

    // Fallback: Client-side Khmer date & standard administrative synthesis
    const { introText, attendanceDateLocation } = generateFormalKhmerDateText(
      meeting.date,
      meeting.time,
      meeting.location,
      meeting.topic,
      `${meeting.leaderName} (${meeting.leaderRole})`
    );

    onChange({
      ...meeting,
      introText,
      attendanceDateLocation
    });

    setAiMessage('✨ បានបម្លែងកាលបរិច្ឆេទចន្ទគតិ និងទម្រង់រដ្ឋបាលខ្មែរដោយជោគជ័យ!');
    setIsGeneratingAI(false);
  };

  // Agenda handlers
  const handleAddAgenda = () => {
    const newAgendas = [...meeting.agendas, ''];
    updateField('agendas', newAgendas);
  };

  const handleUpdateAgenda = (index: number, val: string) => {
    const updated = [...meeting.agendas];
    updated[index] = val;
    updateField('agendas', updated);
  };

  const handleDeleteAgenda = (index: number) => {
    const updated = meeting.agendas.filter((_, i) => i !== index);
    updateField('agendas', updated);
  };

  // Process handlers
  const handleAddProcess = () => {
    const newProcesses = [...meeting.processes, { text: '', images: [] }];
    updateField('processes', newProcesses);
  };

  const handleUpdateProcess = (index: number, val: string) => {
    const updated = [...meeting.processes];
    updated[index] = { ...updated[index], text: val };
    updateField('processes', updated);
  };

  const handleAddProcessImage = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileList: File[] = Array.from(files);
      const readPromises = fileList.map((file: File) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            if (reader.result) {
              resolve(reader.result as string);
            }
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(readPromises).then((newImages) => {
        const updated = [...meeting.processes];
        updated[index] = { 
          ...updated[index], 
          images: [...(updated[index].images || []), ...newImages] 
        };
        updateField('processes', updated);
      });
      // Reset input value so same file can be selected again
      e.target.value = '';
    }
  };

  const handleDeleteProcessImage = (processIndex: number, imageIndex: number) => {
    const updated = [...meeting.processes];
    const updatedImages = [...(updated[processIndex].images || [])];
    updatedImages.splice(imageIndex, 1);
    updated[processIndex] = { ...updated[processIndex], images: updatedImages };
    updateField('processes', updated);
  };

  const handleReplaceProcessImage = (processIndex: number, imageIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          const updated = [...meeting.processes];
          const updatedImages = [...(updated[processIndex].images || [])];
          updatedImages[imageIndex] = reader.result as string;
          updated[processIndex] = { ...updated[processIndex], images: updatedImages };
          updateField('processes', updated);
        }
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  };

  const handleMoveProcessImage = (processIndex: number, fromIndex: number, direction: 'left' | 'right') => {
    const updated = [...meeting.processes];
    const images = [...(updated[processIndex].images || [])];
    const toIndex = direction === 'left' ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= images.length) return;

    const temp = images[fromIndex];
    images[fromIndex] = images[toIndex];
    images[toIndex] = temp;

    updated[processIndex] = { ...updated[processIndex], images };
    updateField('processes', updated);
  };

  const handleClearAllProcessImages = (processIndex: number) => {
    const updated = [...meeting.processes];
    updated[processIndex] = { ...updated[processIndex], images: [] };
    updateField('processes', updated);
  };

  const handleDeleteProcess = (index: number) => {
    const updated = meeting.processes.filter((_, i) => i !== index);
    updateField('processes', updated);
  };

  // Action Items (តារាងសកម្មភាព & សេចក្តីសម្រេចក្រោយកិច្ចប្រជុំ)
  const defaultActionHeaders = {
    col1: 'ល.រ',
    col2: 'សកម្មភាព / កិច្ចការ',
    col3: 'អ្នកទទួលខុសត្រូវ',
    col4: 'កាលកំណត់',
    col5: 'លទ្ធផលរំពឹងទុក',
    col6: 'ស្ថានភាព'
  };

  const currentActionHeaders = {
    col1: meeting.actionTableHeaders?.col1 || defaultActionHeaders.col1,
    col2: meeting.actionTableHeaders?.col2 || defaultActionHeaders.col2,
    col3: meeting.actionTableHeaders?.col3 || defaultActionHeaders.col3,
    col4: meeting.actionTableHeaders?.col4 || defaultActionHeaders.col4,
    col5: meeting.actionTableHeaders?.col5 || defaultActionHeaders.col5,
    col6: meeting.actionTableHeaders?.col6 || defaultActionHeaders.col6,
  };

  const handleUpdateActionHeader = (colKey: 'col1' | 'col2' | 'col3' | 'col4' | 'col5' | 'col6', val: string) => {
    const updated = {
      ...currentActionHeaders,
      [colKey]: val
    };
    updateField('actionTableHeaders', updated);
  };

  const handleApplyActionPreset = (preset: 'committee' | 'actionPlan' | 'budget') => {
    if (preset === 'committee') {
      onChange({
        ...meeting,
        actionTableTitle: 'ឃ- តារាងសមាសភាព និងការបែងចែកភារកិច្ច គ.គ.ស. ថ្មី (Committee Structure)៖',
        actionTableHeaders: {
          col1: 'ល.រ',
          col2: 'មុខតំណែងដើម',
          col3: 'គោត្តនាម និងនាម',
          col4: 'អង្គភាព/ស្ថាប័ន',
          col5: 'តួនាទីក្នុង គ.គ.ស.',
          col6: 'ភារកិច្ចទទួលខុសត្រូវ'
        }
      });
    } else if (preset === 'actionPlan') {
      onChange({
        ...meeting,
        actionTableTitle: 'ឃ- តារាងសេចក្តីសម្រេច & សកម្មភាពអនុវត្តបន្ត (Action Plan)៖',
        actionTableHeaders: {
          col1: 'ល.រ',
          col2: 'សកម្មភាព / កិច្ចការ',
          col3: 'អ្នកទទួលខុសត្រូវ',
          col4: 'កាលកំណត់',
          col5: 'លទ្ធផលរំពឹងទុក',
          col6: 'ស្ថានភាព'
        }
      });
    } else if (preset === 'budget') {
      onChange({
        ...meeting,
        actionTableTitle: 'ឃ- តារាងផែនការថវិកា និងលទ្ធកម្ម (Budget & Procurement)៖',
        actionTableHeaders: {
          col1: 'ល.រ',
          col2: 'មុខទំនិញ / សកម្មភាព',
          col3: 'ប្រភពថវិកា / បរិមាណ',
          col4: 'អង្គភាពទទួលបន្ទុក',
          col5: 'តម្លៃប៉ាន់ស្មាន',
          col6: 'ស្ថានភាពអនុវត្ត'
        }
      });
    }
  };

  const handleResetActionHeaders = () => {
    updateField('actionTableHeaders', defaultActionHeaders);
  };

  const handleAddActionItem = () => {
    const newItem: ActionItem = {
      id: Date.now().toString(),
      task: '',
      responsiblePerson: '',
      deadline: '',
      expectedOutput: '',
      status: currentActionHeaders.col6 === 'ភារកិច្ចទទួលខុសត្រូវ' ? '' : 'កំពុងអនុវត្ត'
    };
    const updated = [...(meeting.actionItems || []), newItem];
    updateField('actionItems', updated);
  };

  const handleUpdateActionItem = (id: string, field: keyof ActionItem, value: string) => {
    const updated = (meeting.actionItems || []).map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    updateField('actionItems', updated);
  };

  const handleDeleteActionItem = (id: string) => {
    const updated = (meeting.actionItems || []).filter(item => item.id !== id);
    updateField('actionItems', updated);
  };

  // Reference Documents (ឯកសារយោង & ឧបសម្ព័ន្ធភ្ជាប់)
  const handleUploadReferenceDocument = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileList: File[] = Array.from(files);
      const readPromises = fileList.map((file: File) => {
        return new Promise<ReferenceDocument>((resolve) => {
          const reader = new FileReader();
          const isImg = file.type.startsWith('image/');
          const isPdf = file.type === 'application/pdf';
          const isDoc = file.type.includes('word') || file.type.includes('document') || file.type.includes('officedocument');
          const fileType: ReferenceDocument['fileType'] = isImg ? 'image' : isPdf ? 'pdf' : isDoc ? 'doc' : 'other';

          reader.onloadend = () => {
            const sizeStr = file.size > 1024 * 1024 
              ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
              : `${Math.round(file.size / 1024)} KB`;

            resolve({
              id: Date.now().toString() + Math.random().toString(36).substring(2, 5),
              title: file.name.replace(/\.[^/.]+$/, ''),
              fileName: file.name,
              fileType,
              fileSize: sizeStr,
              fileData: (reader.result as string) || '',
              note: ''
            });
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(readPromises).then((newDocs) => {
        const updated = [...(meeting.referenceDocuments || []), ...newDocs];
        updateField('referenceDocuments', updated);
      });
      e.target.value = '';
    }
  };

  const handleUpdateReferenceDocument = (id: string, field: keyof ReferenceDocument, value: string) => {
    const updated = (meeting.referenceDocuments || []).map(doc => {
      if (doc.id === id) {
        return { ...doc, [field]: value };
      }
      return doc;
    });
    updateField('referenceDocuments', updated);
  };

  const handleReplaceReferenceDocument = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      const isImg = file.type.startsWith('image/');
      const isPdf = file.type === 'application/pdf';
      const isDoc = file.type.includes('word') || file.type.includes('document') || file.type.includes('officedocument');
      const fileType: ReferenceDocument['fileType'] = isImg ? 'image' : isPdf ? 'pdf' : isDoc ? 'doc' : 'other';

      reader.onloadend = () => {
        const sizeStr = file.size > 1024 * 1024 
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
          : `${Math.round(file.size / 1024)} KB`;

        const updated = (meeting.referenceDocuments || []).map(doc => {
          if (doc.id === id) {
            return {
              ...doc,
              fileName: file.name,
              fileType,
              fileSize: sizeStr,
              fileData: (reader.result as string) || ''
            };
          }
          return doc;
        });
        updateField('referenceDocuments', updated);
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  };

  const handleMoveReferenceDocument = (fromIdx: number, direction: 'left' | 'right') => {
    const docs = [...(meeting.referenceDocuments || [])];
    const toIdx = direction === 'left' ? fromIdx - 1 : fromIdx + 1;
    if (toIdx < 0 || toIdx >= docs.length) return;

    const temp = docs[fromIdx];
    docs[fromIdx] = docs[toIdx];
    docs[toIdx] = temp;

    updateField('referenceDocuments', docs);
  };

  const handleClearAllReferenceDocuments = () => {
    updateField('referenceDocuments', []);
  };

  const handleDeleteReferenceDocument = (id: string) => {
    const updated = (meeting.referenceDocuments || []).filter(doc => doc.id !== id);
    updateField('referenceDocuments', updated);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* AI Action Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 rounded-2xl p-5 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-indigo-700/50">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-amber-400 text-slate-950 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              AI Smart Transformation
            </span>
            <span className="text-xs text-indigo-200">
              ប្រព័ន្ធបំពេញ និងបម្លែងស្វ័យប្រវត្ត
            </span>
          </div>
          <h2 className="text-xl font-bold font-moul tracking-wide text-white">
            កែប្រែកាតព័ត៌មានកិច្ចប្រជុំ & បម្លែងដោយ AI
          </h2>
          <p className="text-xs text-indigo-100/90 max-w-2xl leading-relaxed">
            គ្រាន់តែបំពេញឈ្មោះកំណត់ហេតុ កាលបរិច្ឆេទ ម៉ោង ទីកន្លែង និងឈ្មោះប្រធានអង្គប្រជុំ រួចចុចប៊ូតុងខាងស្តាំ AI នឹងបម្លែងកាលបរិច្ឆេទចន្ទគតិ-សុរិយគតិ របៀបវារៈ និងដំណើរការប្រជុំផ្លូវការជូនលោកអ្នកភ្លាមៗ។
          </p>
        </div>

        <button
          onClick={handleAITransform}
          disabled={isGeneratingAI}
          className="shrink-0 px-5 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold rounded-xl shadow-lg hover:shadow-xl transition flex items-center gap-2 font-moul text-xs"
        >
          {isGeneratingAI ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-slate-900" />
              <span>កំពុងបម្លែង...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>✨ បម្លែងដោយ AI</span>
            </>
          )}
        </button>
      </div>

      {aiMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{aiMessage}</span>
        </div>
      )}

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 gap-6">
        {/* CARD 1: Basic Information */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg">
                <School className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 font-moul text-base">
                  កាតទី ១៖ ព័ត៌មានគោលនៃកិច្ចប្រជុំ
                </h3>
                <p className="text-xs text-slate-500">
                  ឈ្មោះកំណត់ហេតុ កាលបរិច្ឆេទ ម៉ោង ទីកន្លែង និងប្រធានអង្គប្រជុំ
                </p>
              </div>
            </div>
            <span className="text-xs font-bold bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
              ផ្នែកសំខាន់
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Topic */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ឈ្មោះកំណត់ហេតុ / ប្រធានបទកិច្ចប្រជុំ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={meeting.topic}
                onChange={(e) => updateField('topic', e.target.value)}
                placeholder="ឧ. ការបង្កើត និងធ្វើបច្ចុប្បន្នកម្មសមាសភាពគណៈកម្មការគ្រប់គ្រងសាលារៀន..."
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden"
              />
            </div>

            {/* Date */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-indigo-600" /> កាលបរិច្ឆេទ (Calendar) <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsKhmerCalendarOpen(true)}
                  className="text-[11px] text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 font-bold px-2.5 py-0.5 rounded-lg border border-indigo-200 transition flex items-center gap-1"
                >
                  <CalendarCheck2 className="w-3 h-3 text-indigo-600" /> ប្រតិទិនខ្មែរ 🪷
                </button>
              </div>
              <input
                type="date"
                value={meeting.date}
                onChange={(e) => {
                  const newDate = e.target.value;
                  const { introText, attendanceDateLocation } = generateFormalKhmerDateText(
                    newDate,
                    meeting.time,
                    meeting.location,
                    meeting.topic,
                    `${meeting.leaderName} (${meeting.leaderRole})`
                  );
                  const conclusionText = generateFormalKhmerConclusionText(meeting.time);
                  onChange({
                    ...meeting,
                    date: newDate,
                    introText,
                    attendanceDateLocation,
                    conclusionText
                  });
                }}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden"
              />
              {/* Selected date preview helper */}
              <div className="mt-1 text-[11px] text-slate-500 flex items-center gap-1.5 flex-wrap">
                <span className="font-serif text-indigo-900 font-bold">
                  {selectedKhmerDate.fullKhmerPhrase}
                </span>
                {selectedKhmerDate.isPublicHoliday && (
                  <span className="bg-red-100 text-red-700 text-[10px] font-bold px-1.5 py-0.2 rounded">
                    ថ្ងៃឈប់សម្រាក
                  </span>
                )}
                {selectedKhmerDate.isHolyDay && (
                  <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-1.5 py-0.2 rounded">
                    🪷 {selectedKhmerDate.holyDayLabel}
                  </span>
                )}
              </div>
            </div>

            {/* Time */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-indigo-600" /> ម៉ោងប្រជុំ (Start Time) <span className="text-red-500">*</span>
                </label>
                <span className="text-[10px] text-slate-400">AM / PM</span>
              </div>
              <input
                type="text"
                value={meeting.time}
                onChange={(e) => {
                  const newTime = e.target.value;
                  const conclusionText = generateFormalKhmerConclusionText(newTime);
                  onChange({
                    ...meeting,
                    time: newTime,
                    conclusionText
                  });
                }}
                placeholder="ឧ. 7:30 AM ឬ 8:00 AM"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden"
              />
              {/* Quick Time Preset Chips */}
              <div className="mt-1.5 flex items-center gap-1 flex-wrap">
                <span className="text-[10px] text-slate-400 font-medium">ពេលព្រឹក៖</span>
                {['7:30 AM', '8:00 AM', '8:30 AM'].map((tVal) => (
                  <button
                    key={tVal}
                    type="button"
                    onClick={() => {
                      const conclusionText = generateFormalKhmerConclusionText(tVal);
                      const { introText, attendanceDateLocation } = generateFormalKhmerDateText(
                        meeting.date,
                        tVal,
                        meeting.location,
                        meeting.topic,
                        `${meeting.leaderName} (${meeting.leaderRole})`
                      );
                      onChange({
                        ...meeting,
                        time: tVal,
                        introText,
                        attendanceDateLocation,
                        conclusionText
                      });
                    }}
                    className={`text-[10px] px-2 py-0.5 rounded-md font-bold transition border ${
                      meeting.time === tVal
                        ? 'bg-amber-500 text-white border-amber-500'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                    }`}
                  >
                    ☀️ {tVal}
                  </button>
                ))}
                <span className="text-[10px] text-slate-400 font-medium ml-1">ពេលរសៀល៖</span>
                {['1:30 PM', '2:00 PM', '2:30 PM'].map((tVal) => (
                  <button
                    key={tVal}
                    type="button"
                    onClick={() => {
                      const conclusionText = generateFormalKhmerConclusionText(tVal);
                      const { introText, attendanceDateLocation } = generateFormalKhmerDateText(
                        meeting.date,
                        tVal,
                        meeting.location,
                        meeting.topic,
                        `${meeting.leaderName} (${meeting.leaderRole})`
                      );
                      onChange({
                        ...meeting,
                        time: tVal,
                        introText,
                        attendanceDateLocation,
                        conclusionText
                      });
                    }}
                    className={`text-[10px] px-2 py-0.5 rounded-md font-bold transition border ${
                      meeting.time === tVal
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                    }`}
                  >
                    ⛅ {tVal}
                  </button>
                ))}
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-indigo-600" /> ទីកន្លែងប្រជុំ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={meeting.location}
                onChange={(e) => updateField('location', e.target.value)}
                placeholder="ឧ. សាលាបឋមសិក្សា រោគ"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden"
              />
            </div>

            {/* School Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ឈ្មោះសាលារៀន
              </label>
              <input
                type="text"
                value={meeting.schoolName}
                onChange={(e) => updateField('schoolName', e.target.value)}
                placeholder="ឧ. សាលាបឋមសិក្សា រោគ"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden"
              />
            </div>

            {/* District */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                រដ្ឋបាលស្រុក / ក្រុង
              </label>
              <input
                type="text"
                value={meeting.district}
                onChange={(e) => updateField('district', e.target.value)}
                placeholder="ឧ. រដ្ឋបាលស្រុកភ្នំស្រុក"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden"
              />
            </div>

            {/* Leader / Chairperson */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-indigo-600" /> ឈ្មោះប្រធានអង្គប្រជុំ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={meeting.leaderName}
                onChange={(e) => updateField('leaderName', e.target.value)}
                placeholder="ឧ. លោកស្រី សុខ សារើន"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden"
              />
            </div>

            {/* Leader Role */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                តួនាទីប្រធានអង្គប្រជុំ
              </label>
              <input
                type="text"
                value={meeting.leaderRole}
                onChange={(e) => updateField('leaderRole', e.target.value)}
                placeholder="ឧ. នាយិកាសាលា / ប្រធានអង្គប្រជុំ"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden"
              />
            </div>

            {/* Recorder Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ឈ្មោះលេខាកត់ត្រា
              </label>
              <input
                type="text"
                value={meeting.recorderName}
                onChange={(e) => updateField('recorderName', e.target.value)}
                placeholder="ឧ. លោក អ៊ុន ប៊ុនទុង"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* CARD 2: Khmer Date Intro & Opening Text */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 font-moul text-base">
                  កាតទី ២៖ កថាខណ្ឌផ្តើម (កាលបរិច្ឆេទចន្ទគតិ-សុរិយគតិផ្លូវការ)
                </h3>
                <p className="text-xs text-slate-500">
                  ទម្រង់កាលបរិច្ឆេទ និងការប្រកាសបើកអង្គប្រជុំជាភាសាខ្មែរ
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                const { introText, attendanceDateLocation } = generateFormalKhmerDateText(
                  meeting.date,
                  meeting.time,
                  meeting.location,
                  meeting.topic,
                  `${meeting.leaderName} (${meeting.leaderRole})`
                );
                onChange({
                  ...meeting,
                  introText,
                  attendanceDateLocation
                });
              }}
              className="text-xs text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 font-bold px-3 py-1.5 rounded-lg transition"
            >
              🔄 បង្កើតកាលបរិច្ឆេទស្វ័យប្រវត្ត
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                អត្ថបទកថាខណ្ឌផ្តើមនៃកំណត់ហេតុ (Meeting Intro Text)៖
              </label>
              <textarea
                rows={3}
                value={meeting.introText}
                onChange={(e) => updateField('introText', e.target.value)}
                placeholder="ឆ្នាំ... ខែ... ថ្ងៃទី... ត្រូវនឹងថ្ងៃ... វេលាម៉ោង... នៅ... បានបើកកិច្ចប្រជុំមួយដើម្បី..."
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                អត្ថបទកាលបរិច្ឆេទ & ទីតាំងលើបញ្ជីវត្តមាន (Attendance Date & Location)៖
              </label>
              <textarea
                rows={2}
                value={meeting.attendanceDateLocation}
                onChange={(e) => updateField('attendanceDateLocation', e.target.value)}
                placeholder="ឧ. ថ្ងៃទី២៥ ខែសីហា ឆ្នាំ២០២៦ ត្រូវនឹងថ្ងៃអង្គារ ១២កើត ខែស្រាពណ៍ ឆ្នាំមមី អដ្ឋស័ក ពុទ្ធសករាជ ២៥៧០ នៅក្នុងបរិវេណសាលាបឋមសិក្សា រោគ។"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* CARD 3: Agendas (របៀបវារៈ) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 font-moul text-base">
                  កាតទី ៣៖ របៀបវារៈប្រជុំ (Agendas)
                </h3>
                <p className="text-xs text-slate-500">
                  ចំណុចសំខាន់ៗដែលត្រូវលើកយកមកពិភាក្សាក្នុងអង្គប្រជុំ
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleAddAgenda}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" /> បន្ថែមរបៀបវារៈ
            </button>
          </div>

          <div className="space-y-3">
            {meeting.agendas.map((agenda, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 font-moul">
                  {toKhmerNumeral(idx + 1)}
                </div>
                <input
                  type="text"
                  value={agenda}
                  onChange={(e) => handleUpdateAgenda(idx, e.target.value)}
                  placeholder={`របៀបវារៈទី ${toKhmerNumeral(idx + 1)}...`}
                  className="flex-1 px-3.5 py-2 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteAgenda(idx)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* CARD 4: Proceedings (ដំណើរការប្រជុំ) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-50 text-amber-700 rounded-lg">
                <PenTool className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 font-moul text-base">
                  កាតទី ៤៖ ដំណើរការប្រជុំ (Meeting Proceedings)
                </h3>
                <p className="text-xs text-slate-500">
                  សកម្មភាព និងការអនុវត្តជាក់ស្តែងក្នុងអង្គប្រជុំ
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleAddProcess}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" /> បន្ថែមដំណើរការ
            </button>
          </div>

          <div className="space-y-4">
            {meeting.processes.map((proc, idx) => (
              <div key={idx} className="flex flex-col gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-start gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xs shrink-0 font-moul mt-1">
                    {toKhmerNumeral(idx + 1)}
                  </div>
                  <div className="flex-1 space-y-3">
                    <input
                      type="text"
                      value={proc.text || ''}
                      onChange={(e) => handleUpdateProcess(idx, e.target.value)}
                      placeholder={`ដំណើរការទី ${toKhmerNumeral(idx + 1)}...`}
                      className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-hidden"
                    />
                    
                    {/* Images Collection Grid */}
                    {proc.images && proc.images.length > 0 && (
                      <div className="space-y-2 pt-1">
                        <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-0.5">
                          <span className="font-semibold text-slate-700">រូបភាពសកម្មភាព ({toKhmerNumeral(proc.images.length)} សន្លឹក)</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-slate-400 hidden sm:inline">តម្រៀបពេញទទឹង (២ រូបក្នុង ១ ជួរ)</span>
                            {proc.images.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleClearAllProcessImages(idx)}
                                className="text-[11px] text-red-600 hover:text-red-700 hover:underline flex items-center gap-1 font-bold"
                              >
                                <Trash2 className="w-3 h-3" />
                                លុបទាំងអស់
                              </button>
                            )}
                          </div>
                        </div>
                        <div className={`grid gap-3 ${
                          proc.images.length === 1 
                            ? 'grid-cols-1 max-w-sm' 
                            : proc.images.length === 3 
                              ? 'grid-cols-2 sm:grid-cols-3' 
                              : 'grid-cols-2'
                        }`}>
                          {proc.images.map((imgUrl, imgIdx) => (
                            <div key={imgIdx} className="relative group aspect-[4/3] bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-xs flex flex-col justify-between">
                              <img 
                                src={imgUrl} 
                                alt={`Activity ${imgIdx + 1}`} 
                                className="w-full h-full object-cover cursor-pointer" 
                                referrerPolicy="no-referrer"
                                onClick={() => setPreviewImageUrl(imgUrl)}
                              />
                              
                              {/* Top Bar: Number Tag & Preview Zoom */}
                              <div className="absolute top-1.5 left-1.5 right-1.5 flex items-center justify-between pointer-events-none">
                                <span className="bg-black/70 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded-md font-mono pointer-events-auto">
                                  #{imgIdx + 1}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setPreviewImageUrl(imgUrl)}
                                  className="p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-md shadow-xs pointer-events-auto transition"
                                  title="ពង្រីកមើលរូបភាព"
                                >
                                  <Maximize2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {/* Bottom Action Bar: Reorder, Replace (Edit), Delete */}
                              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-1.5 pt-4 flex items-center justify-between gap-1 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                <div className="flex items-center gap-1">
                                  {/* Move Left */}
                                  {imgIdx > 0 && (
                                    <button
                                      type="button"
                                      onClick={() => handleMoveProcessImage(idx, imgIdx, 'left')}
                                      className="p-1 bg-white/90 hover:bg-white text-slate-700 rounded shadow-xs"
                                      title="រំកិលទៅមុខ"
                                    >
                                      <ChevronLeft className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                  {/* Move Right */}
                                  {imgIdx < proc.images!.length - 1 && (
                                    <button
                                      type="button"
                                      onClick={() => handleMoveProcessImage(idx, imgIdx, 'right')}
                                      className="p-1 bg-white/90 hover:bg-white text-slate-700 rounded shadow-xs"
                                      title="រំកិលទៅក្រោយ"
                                    >
                                      <ChevronRight className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>

                                <div className="flex items-center gap-1">
                                  {/* Replace / Edit Photo */}
                                  <label 
                                    className="p-1.5 bg-blue-600/90 hover:bg-blue-600 text-white rounded-md shadow-xs cursor-pointer transition"
                                    title="ផ្លាស់ប្តូររូបភាពនេះ"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={(e) => handleReplaceProcessImage(idx, imgIdx, e)}
                                    />
                                  </label>

                                  {/* Delete Photo */}
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteProcessImage(idx, imgIdx)}
                                    className="p-1.5 bg-red-600/90 hover:bg-red-600 text-white rounded-md shadow-xs transition"
                                    title="លុបរូបភាពនេះ"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Add Image Button */}
                    <div>
                      <label className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer active:scale-95">
                        <ImageIcon className="w-4 h-4 text-amber-600" />
                        ជ្រើសរើសរូបភាពសកម្មភាព (អាចជ្រើសម្តងច្រើនសន្លឹក)
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={(e) => handleAddProcessImage(idx, e)}
                        />
                      </label>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteProcess(idx)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition shrink-0 mt-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CARD 5: Executive Summary (សេចក្តីសង្ខេបកិច្ចប្រជុំ) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-purple-50 text-purple-700 rounded-lg">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 font-moul text-base">
                  កាតទី ៥៖ សេចក្តីសង្ខេបកិច្ចប្រជុំ (Executive Summary)
                </h3>
                <p className="text-xs text-slate-500">
                  សេចក្តីសង្ខេបលទ្ធផល និងសេចក្តីសម្រេចសំខាន់ៗ
                </p>
              </div>
            </div>
          </div>

          <div>
            <textarea
              rows={6}
              value={meeting.executiveSummary}
              onChange={(e) => updateField('executiveSummary', e.target.value)}
              placeholder="សេចក្តីសង្ខេបកិច្ចប្រជុំ..."
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-hidden leading-relaxed font-mono"
            />
          </div>
        </div>

        {/* CARD 5.1: Action Items Table (តារាងសេចក្តីសម្រេច & សកម្មភាពអនុវត្តក្រោយកិច្ចប្រជុំ) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
                <ClipboardList className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 font-moul text-base">
                  តារាងសេចក្តីសម្រេច & សកម្មភាពអនុវត្តក្រោយកិច្ចប្រជុំ (Action Plan / Committee Table)
                </h3>
                <p className="text-xs text-slate-500">
                  ប្តូរទម្រង់ជា «សមាសភាព គ.គ.ស.» ឬ «ផែនការសកម្មភាព» និងកែសម្រួលឈ្មោះជួរឈរ (Header Columns) បានតាមចិត្ត
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleAddActionItem}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs shrink-0 font-moul"
              >
                <Plus className="w-4 h-4" /> ➕ បន្ថែមជួរទិន្នន័យ
              </button>
            </div>
          </div>

          {/* Quick Presets & Table Title Customization */}
          <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100 space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-900 font-moul shrink-0">
                  🎯 ជ្រើសរើសគំរូទម្រង់រហ័ស៖
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => handleApplyActionPreset('committee')}
                    className="px-2.5 py-1 bg-white hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-lg text-xs font-semibold shadow-2xs transition"
                    title="ទម្រង់សមាសភាព គ.គ.ស. ថ្មី (មុខតំណែងដើម, ឈ្មោះ, ស្ថាប័ន, តួនាទី, ភារកិច្ច)"
                  >
                    👥 គំរូសមាសភាព គ.គ.ស.
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyActionPreset('actionPlan')}
                    className="px-2.5 py-1 bg-white hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-lg text-xs font-semibold shadow-2xs transition"
                    title="ទម្រង់ផែនការសកម្មភាព & សេចក្តីសម្រេច (សកម្មភាព, អ្នកទទួលខុសត្រូវ, កាលកំណត់, លទ្ធផល, ស្ថានភាព)"
                  >
                    📋 គំរូផែនការសកម្មភាព
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyActionPreset('budget')}
                    className="px-2.5 py-1 bg-white hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-lg text-xs font-semibold shadow-2xs transition"
                    title="ទម្រង់ថវិកា & លទ្ធកម្ម (មុខទំនិញ, ប្រភពថវិកា, អង្គភាព, តម្លៃ, ស្ថានភាព)"
                  >
                    💰 គំរូថវិកា & លទ្ធកម្ម
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleResetActionHeaders}
                className="text-[11px] text-slate-500 hover:text-blue-700 underline font-medium self-end md:self-center"
              >
                កំណត់ចំណងជើងលំនាំដើមឡើងវិញ
              </button>
            </div>

            {/* Editable Table Section Title */}
            <div className="space-y-1 pt-1 border-t border-blue-100/80">
              <label className="block text-xs font-bold text-slate-700 font-moul">
                ចំណងជើងផ្នែកតារាងក្នុងកំណត់ហេតុ (Table Title)៖
              </label>
              <input
                type="text"
                value={meeting.actionTableTitle || 'ឃ- តារាងសេចក្តីសម្រេច & សកម្មភាពអនុវត្តបន្ត (Action Plan)៖'}
                onChange={(e) => updateField('actionTableTitle', e.target.value)}
                placeholder="ឧ. ឃ- តារាងសមាសភាព និងការបែងចែកភារកិច្ច គ.គ.ស. ថ្មី..."
                className="w-full px-3 py-1.5 bg-white border border-blue-200 rounded-lg text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 outline-hidden font-moul"
              />
            </div>
          </div>

          {/* Datalist for Column 6 suggestions */}
          <datalist id="col6-suggestions">
            <option value="ផ្សព្វផ្សាយផែនការ និងកៀរគរធនធាន" />
            <option value="គាំទ្រគោលនយោបាយ និងសន្តិសុខ" />
            <option value="ដឹកនាំ និងចាត់ចែងការងារទូទៅ" />
            <option value="កត់ត្រា និងរៀបចំឯកសារ" />
            <option value="កំពុងអនុវត្ត" />
            <option value="រួចរាល់" />
            <option value="គ្រោងទុក" />
          </datalist>

          {(!meeting.actionItems || meeting.actionItems.length === 0) ? (
            <div className="text-center py-7 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-500 text-xs">
              មិនទាន់មានជួរទិន្នន័យក្នុងតារាងនៅឡើយទេ។ ចុចប៊ូតុង "➕ បន្ថែមជួរទិន្នន័យ" ដើម្បីបញ្ចូលទិន្នន័យ។
            </div>
          ) : (
            <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-2xs">
              <div className="bg-slate-100/90 px-3 py-1.5 border-b border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
                <span className="font-semibold text-slate-700 flex items-center gap-1">
                  ✏️ <span className="font-moul text-xs">ចំណងជើងជួរឈរ (Headers)៖</span> លោកអ្នកអាចចុចកែប្រែឈ្មោះជួរឈរខាងក្រោមបានដោយផ្ទាល់
                </span>
                <span className="text-slate-500">សរុប {toKhmerNumeral(meeting.actionItems.length)} ជួរ</span>
              </div>
              <table className="w-full text-xs text-left divide-y divide-slate-200">
                <thead className="bg-slate-100 font-bold text-slate-800 font-moul">
                  <tr>
                    {/* Header Col 1 */}
                    <th className="py-2 px-2 text-center w-12 border-r border-slate-200">
                      <input
                        type="text"
                        value={currentActionHeaders.col1}
                        onChange={(e) => handleUpdateActionHeader('col1', e.target.value)}
                        className="w-full text-center bg-transparent border-b border-dashed border-slate-400 focus:bg-white focus:border-blue-500 outline-hidden font-bold py-0.5"
                        title="កែប្រែចំណងជើងជួរឈរទី ១"
                      />
                    </th>

                    {/* Header Col 2 */}
                    <th className="py-2 px-2 min-w-[170px] border-r border-slate-200">
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={currentActionHeaders.col2}
                          onChange={(e) => handleUpdateActionHeader('col2', e.target.value)}
                          className="w-full bg-transparent border-b border-dashed border-slate-400 focus:bg-white focus:border-blue-500 outline-hidden font-bold py-0.5 text-blue-900"
                          placeholder="ចំណងជើងជួរឈរទី ២"
                          title="កែប្រែចំណងជើងជួរឈរទី ២ (ចុចដើម្បីវាយ)"
                        />
                        <Edit2 className="w-3 h-3 text-slate-400 shrink-0 pointer-events-none" />
                      </div>
                    </th>

                    {/* Header Col 3 */}
                    <th className="py-2 px-2 min-w-[150px] border-r border-slate-200">
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={currentActionHeaders.col3}
                          onChange={(e) => handleUpdateActionHeader('col3', e.target.value)}
                          className="w-full bg-transparent border-b border-dashed border-slate-400 focus:bg-white focus:border-blue-500 outline-hidden font-bold py-0.5 text-blue-900"
                          placeholder="ចំណងជើងជួរឈរទី ៣"
                          title="កែប្រែចំណងជើងជួរឈរទី ៣ (ចុចដើម្បីវាយ)"
                        />
                        <Edit2 className="w-3 h-3 text-slate-400 shrink-0 pointer-events-none" />
                      </div>
                    </th>

                    {/* Header Col 4 */}
                    <th className="py-2 px-2 min-w-[140px] border-r border-slate-200">
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={currentActionHeaders.col4}
                          onChange={(e) => handleUpdateActionHeader('col4', e.target.value)}
                          className="w-full bg-transparent border-b border-dashed border-slate-400 focus:bg-white focus:border-blue-500 outline-hidden font-bold py-0.5 text-blue-900"
                          placeholder="ចំណងជើងជួរឈរទី ៤"
                          title="កែប្រែចំណងជើងជួរឈរទី ៤ (ចុចដើម្បីវាយ)"
                        />
                        <Edit2 className="w-3 h-3 text-slate-400 shrink-0 pointer-events-none" />
                      </div>
                    </th>

                    {/* Header Col 5 */}
                    <th className="py-2 px-2 min-w-[150px] border-r border-slate-200">
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={currentActionHeaders.col5}
                          onChange={(e) => handleUpdateActionHeader('col5', e.target.value)}
                          className="w-full bg-transparent border-b border-dashed border-slate-400 focus:bg-white focus:border-blue-500 outline-hidden font-bold py-0.5 text-blue-900"
                          placeholder="ចំណងជើងជួរឈរទី ៥"
                          title="កែប្រែចំណងជើងជួរឈរទី ៥ (ចុចដើម្បីវាយ)"
                        />
                        <Edit2 className="w-3 h-3 text-slate-400 shrink-0 pointer-events-none" />
                      </div>
                    </th>

                    {/* Header Col 6 */}
                    <th className="py-2 px-2 min-w-[170px] border-r border-slate-200">
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={currentActionHeaders.col6}
                          onChange={(e) => handleUpdateActionHeader('col6', e.target.value)}
                          className="w-full bg-transparent border-b border-dashed border-slate-400 focus:bg-white focus:border-blue-500 outline-hidden font-bold py-0.5 text-blue-900"
                          placeholder="ចំណងជើងជួរឈរទី ៦"
                          title="កែប្រែចំណងជើងជួរឈរទី ៦ (ចុចដើម្បីវាយ)"
                        />
                        <Edit2 className="w-3 h-3 text-slate-400 shrink-0 pointer-events-none" />
                      </div>
                    </th>

                    {/* Action Col */}
                    <th className="py-2 px-2 text-center w-12">លុប</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {meeting.actionItems.map((item, aIdx) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-2 px-2 text-center font-bold text-slate-500 border-r border-slate-100">
                        {toKhmerNumeral(aIdx + 1)}
                      </td>
                      <td className="py-1.5 px-2 border-r border-slate-100">
                        <input
                          type="text"
                          value={item.task}
                          onChange={(e) => handleUpdateActionItem(item.id, 'task', e.target.value)}
                          placeholder={`បញ្ចូល ${currentActionHeaders.col2}...`}
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-blue-500 outline-hidden"
                        />
                      </td>
                      <td className="py-1.5 px-2 border-r border-slate-100">
                        <input
                          type="text"
                          value={item.responsiblePerson}
                          onChange={(e) => handleUpdateActionItem(item.id, 'responsiblePerson', e.target.value)}
                          placeholder={`បញ្ចូល ${currentActionHeaders.col3}...`}
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-blue-500 outline-hidden"
                        />
                      </td>
                      <td className="py-1.5 px-2 border-r border-slate-100">
                        <input
                          type="text"
                          value={item.deadline}
                          onChange={(e) => handleUpdateActionItem(item.id, 'deadline', e.target.value)}
                          placeholder={`បញ្ចូល ${currentActionHeaders.col4}...`}
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-blue-500 outline-hidden"
                        />
                      </td>
                      <td className="py-1.5 px-2 border-r border-slate-100">
                        <input
                          type="text"
                          value={item.expectedOutput}
                          onChange={(e) => handleUpdateActionItem(item.id, 'expectedOutput', e.target.value)}
                          placeholder={`បញ្ចូល ${currentActionHeaders.col5}...`}
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-blue-500 outline-hidden"
                        />
                      </td>
                      <td className="py-1.5 px-2 border-r border-slate-100">
                        <input
                          type="text"
                          list="col6-suggestions"
                          value={item.status || ''}
                          onChange={(e) => handleUpdateActionItem(item.id, 'status', e.target.value)}
                          placeholder={`បញ្ចូល ${currentActionHeaders.col6}...`}
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-blue-500 outline-hidden"
                        />
                      </td>
                      <td className="py-1.5 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteActionItem(item.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="លុបជួរនេះ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* CARD 5.2: Reference Documents & Attachments (ឯកសារយោង & ឧបសម្ព័ន្ធភ្ជាប់ទម្រង់ A4) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-50 text-amber-700 rounded-lg">
                <Paperclip className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 font-moul text-base">
                  ឯកសារយោង & ឧបសម្ព័ន្ធភ្ជាប់ទម្រង់ A4 (A4 Reference Documents)
                </h3>
                <p className="text-xs text-slate-500">
                  Upload លិខិតចំណាត់តាំង លិខិតផ្លូវការ របាយការណ៍ PDF ឬរូបភាពសន្លឹក A4
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* View Mode Toggle */}
              {meeting.referenceDocuments && meeting.referenceDocuments.length > 0 && (
                <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
                  <button
                    type="button"
                    onClick={() => setDocViewMode('a4-sheet')}
                    className={`px-2.5 py-1 rounded-md font-medium transition ${
                      docViewMode === 'a4-sheet' 
                        ? 'bg-white text-slate-900 shadow-xs font-bold' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    📄 សន្លឹក A4
                  </button>
                  <button
                    type="button"
                    onClick={() => setDocViewMode('list')}
                    className={`px-2.5 py-1 rounded-md font-medium transition ${
                      docViewMode === 'list' 
                        ? 'bg-white text-slate-900 shadow-xs font-bold' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    📋 បញ្ជី
                  </button>
                </div>
              )}

              {meeting.referenceDocuments && meeting.referenceDocuments.length > 1 && (
                <button
                  type="button"
                  onClick={handleClearAllReferenceDocuments}
                  className="px-2.5 py-1.5 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg font-bold transition flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> លុបទាំងអស់
                </button>
              )}

              <label className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition shadow-xs shrink-0 cursor-pointer font-moul">
                <Upload className="w-4 h-4" /> ➕ បញ្ចូលឯកសារយោង (Upload)
                <input
                  type="file"
                  multiple
                  accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx"
                  className="hidden"
                  onChange={handleUploadReferenceDocument}
                />
              </label>
            </div>
          </div>

          {(!meeting.referenceDocuments || meeting.referenceDocuments.length === 0) ? (
            <div className="text-center py-10 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 text-slate-500 space-y-2">
              <div className="p-3 bg-white w-12 h-12 rounded-full mx-auto shadow-xs flex items-center justify-center text-amber-600">
                <FileText className="w-6 h-6" />
              </div>
              <p className="text-xs font-medium text-slate-700">មិនទាន់មានឯកសារយោង ឬឧបសម្ព័ន្ធភ្ជាប់នៅឡើយទេ</p>
              <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                ចុចប៊ូតុង "➕ បញ្ចូលឯកសារយោង (Upload)" ខាងលើដើម្បីភ្ជាប់រូបភាពលិខិត A4 (ដូចជាលិខិតចំណាត់តាំង, លិខិតអញ្ជើញ ឬសេចក្តីសម្រេច)
              </p>
            </div>
          ) : docViewMode === 'a4-sheet' ? (
            /* A4 Document Sheets Preview Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-1">
              {meeting.referenceDocuments.map((doc, dIdx) => (
                <div 
                  key={doc.id}
                  className="flex flex-col bg-slate-50/80 rounded-2xl border border-slate-200 p-3 shadow-xs hover:border-slate-300 transition space-y-3"
                >
                  {/* A4 Sheet Container */}
                  <div className="relative group aspect-[210/297] w-full bg-white rounded-xl overflow-hidden shadow-md border border-slate-300 flex flex-col justify-between">
                    {/* If Image (e.g. Scanned A4 letter like sample) */}
                    {doc.fileData && (doc.fileType === 'image' || doc.fileData.startsWith('data:image')) ? (
                      <img 
                        src={doc.fileData} 
                        alt={doc.title} 
                        className="w-full h-full object-cover object-top cursor-pointer"
                        referrerPolicy="no-referrer"
                        onClick={() => setPreviewImageUrl(doc.fileData!)}
                      />
                    ) : (
                      /* If PDF or Other Doc type, render formal A4 letter preview card */
                      <div 
                        className="w-full h-full p-4 flex flex-col justify-between bg-gradient-to-b from-white via-slate-50 to-slate-100 cursor-pointer"
                        onClick={() => doc.fileData && window.open(doc.fileData, '_blank')}
                      >
                        <div className="text-center space-y-1 opacity-70">
                          <p className="text-[9px] font-moul text-slate-800">ព្រះរាជាណាចក្រកម្ពុជា</p>
                          <p className="text-[8px] font-moul text-slate-700">ជាតិ សាសនា ព្រះមហាក្សត្រ</p>
                          <div className="w-10 h-0.5 bg-slate-300 mx-auto mt-1"></div>
                        </div>

                        <div className="my-auto flex flex-col items-center justify-center p-3 text-center space-y-2">
                          <div className="p-3 bg-red-50 text-red-600 rounded-2xl shadow-xs border border-red-100">
                            {doc.fileType === 'pdf' ? (
                              <FileText className="w-8 h-8" />
                            ) : (
                              <FileSpreadsheet className="w-8 h-8 text-blue-600" />
                            )}
                          </div>
                          <p className="text-xs font-bold text-slate-800 line-clamp-2 px-2">{doc.title || doc.fileName}</p>
                          <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-slate-200 text-slate-700 rounded-md">
                            {doc.fileType.toUpperCase()} {doc.fileSize ? `(${doc.fileSize})` : ''}
                          </span>
                        </div>

                        <div className="text-center text-[9px] text-slate-400 italic">
                          ចុចដើម្បីបើកមើលឯកសារ
                        </div>
                      </div>
                    )}

                    {/* Top Bar on A4 Sheet: Page Badge & Fullscreen Button */}
                    <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
                      <span className="bg-slate-900/80 backdrop-blur-xs text-white text-[10px] px-2.5 py-0.5 rounded-md font-moul pointer-events-auto shadow-xs">
                        សន្លឹក A4 ទី {toKhmerNumeral(dIdx + 1)}
                      </span>
                      {doc.fileData && (
                        <button
                          type="button"
                          onClick={() => doc.fileType === 'image' ? setPreviewImageUrl(doc.fileData!) : window.open(doc.fileData, '_blank')}
                          className="p-1.5 bg-black/60 hover:bg-black/90 text-white rounded-md shadow-xs pointer-events-auto transition"
                          title="ពង្រីកមើលសន្លឹក A4 ពេញលេញ"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Bottom Action Bar on A4 Sheet */}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/55 to-transparent p-2 pt-5 flex items-center justify-between gap-1 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center gap-1">
                        {/* Move Left */}
                        {dIdx > 0 && (
                          <button
                            type="button"
                            onClick={() => handleMoveReferenceDocument(dIdx, 'left')}
                            className="p-1 bg-white/90 hover:bg-white text-slate-800 rounded shadow-xs"
                            title="រំកិលទៅទំព័រមុខ"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {/* Move Right */}
                        {dIdx < meeting.referenceDocuments!.length - 1 && (
                          <button
                            type="button"
                            onClick={() => handleMoveReferenceDocument(dIdx, 'right')}
                            className="p-1 bg-white/90 hover:bg-white text-slate-800 rounded shadow-xs"
                            title="រំកិលទៅទំព័របន្ទាប់"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        {/* Replace File */}
                        <label 
                          className="p-1.5 bg-blue-600/90 hover:bg-blue-600 text-white rounded-md shadow-xs cursor-pointer transition"
                          title="ផ្លាស់ប្តូរសន្លឹកឯកសារនេះ"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <input
                            type="file"
                            accept="image/*,application/pdf,.doc,.docx"
                            className="hidden"
                            onChange={(e) => handleReplaceReferenceDocument(doc.id, e)}
                          />
                        </label>

                        {/* Download */}
                        {doc.fileData && (
                          <a
                            href={doc.fileData}
                            download={doc.fileName || `document_page_${dIdx + 1}`}
                            className="p-1.5 bg-slate-700/90 hover:bg-slate-700 text-white rounded-md shadow-xs transition"
                            title="ទាញយកឯកសារ"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </a>
                        )}

                        {/* Delete File */}
                        <button
                          type="button"
                          onClick={() => handleDeleteReferenceDocument(doc.id)}
                          className="p-1.5 bg-red-600/90 hover:bg-red-600 text-white rounded-md shadow-xs transition"
                          title="លុបសន្លឹកនេះ"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Metadata Fields Under A4 Sheet */}
                  <div className="space-y-1.5">
                    <input
                      type="text"
                      value={doc.title}
                      onChange={(e) => handleUpdateReferenceDocument(doc.id, 'title', e.target.value)}
                      placeholder="ចំណងជើងឯកសារ (ឧ. ចំណាត់តាំង...)"
                      className="w-full font-bold text-xs text-slate-800 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-amber-500 outline-hidden shadow-2xs"
                    />
                    <input
                      type="text"
                      value={doc.note || ''}
                      onChange={(e) => handleUpdateReferenceDocument(doc.id, 'note', e.target.value)}
                      placeholder="ចំណាំបន្ថែម (ឧ. លិខិតលេខ ៦១...)"
                      className="w-full text-xs text-slate-600 bg-white/90 border border-slate-200 rounded-lg px-2.5 py-1 focus:ring-1 focus:ring-amber-500 outline-hidden"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {meeting.referenceDocuments.map((doc, dIdx) => (
                <div 
                  key={doc.id}
                  className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 transition"
                >
                  <div 
                    className="w-14 aspect-[210/297] bg-white rounded-md border border-slate-300 shadow-xs overflow-hidden shrink-0 cursor-pointer flex items-center justify-center"
                    onClick={() => doc.fileData && setPreviewImageUrl(doc.fileData)}
                  >
                    {doc.fileData && (doc.fileType === 'image' || doc.fileData.startsWith('data:image')) ? (
                      <img src={doc.fileData} alt={doc.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <FileText className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={doc.title}
                        onChange={(e) => handleUpdateReferenceDocument(doc.id, 'title', e.target.value)}
                        placeholder="ចំណងជើងឯកសារ"
                        className="w-full font-bold text-xs text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:bg-white px-1 py-0.5 rounded outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteReferenceDocument(doc.id)}
                        className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition shrink-0"
                        title="លុបឯកសារយោងនេះ"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span className="truncate max-w-[150px]">{doc.fileName}</span>
                      {doc.fileSize && <span>• {doc.fileSize}</span>}
                    </div>

                    <input
                      type="text"
                      value={doc.note || ''}
                      onChange={(e) => handleUpdateReferenceDocument(doc.id, 'note', e.target.value)}
                      placeholder="ចំណាំបន្ថែម"
                      className="w-full text-xs text-slate-600 bg-white/80 border border-slate-200 rounded-lg px-2 py-1 focus:ring-1 focus:ring-amber-500 outline-hidden"
                    />

                    {doc.fileData && (
                      <div className="pt-1 flex items-center gap-2">
                        {doc.fileType === 'image' && (
                          <button
                            type="button"
                            onClick={() => setPreviewImageUrl(doc.fileData!)}
                            className="text-[11px] text-indigo-600 hover:underline flex items-center gap-1 font-medium"
                          >
                            <Eye className="w-3 h-3" /> មើលរូបភាព
                          </button>
                        )}
                        <a
                          href={doc.fileData}
                          download={doc.fileName || 'document'}
                          className="text-[11px] text-slate-600 hover:text-slate-900 hover:underline flex items-center gap-1 font-medium"
                        >
                          <Download className="w-3 h-3" /> ទាញយក ({doc.fileName})
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CARD 5.3: Conclusion (ផ្នែកបញ្ចប់នៃកំណត់ហេតុ AM/PM) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 font-moul text-base">
                  កាតទី ៥.៣៖ ផ្នែកបញ្ចប់នៃកំណត់ហេតុ (Meeting Conclusion)
                </h3>
                <p className="text-xs text-slate-500">
                  អត្ថបទបញ្ចប់កំណត់ហេតុផ្លូវការស្វ័យប្រវត្តិតាមពេលព្រឹក (AM) ឬពេលរសៀល (PM)
                </p>
              </div>
            </div>

            {/* Quick Auto Generator from current Start Time */}
            <button
              type="button"
              onClick={() => {
                const generated = generateFormalKhmerConclusionText(meeting.time);
                updateField('conclusionText', generated);
              }}
              className="text-xs text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 font-bold px-3 py-1.5 rounded-lg border border-emerald-200 transition flex items-center gap-1.5 self-start sm:self-center font-moul"
            >
              <RefreshCw className="w-3.5 h-3.5" /> 🔄 បង្កើតស្វ័យប្រវត្តិតាមម៉ោងប្រជុំ ({meeting.time || '8:00 AM'})
            </button>
          </div>

          <div className="space-y-3">
            {/* AM / PM Quick Presets based on standard Khmer minutes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                គំរូអត្ថបទបញ្ចប់ផ្លូវការរហ័ស (Standard Presets)៖
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* AM Presets */}
                <button
                  type="button"
                  onClick={() => {
                    updateField(
                      'conclusionText',
                      'អង្គប្រជុំនេះ បានបញ្ចប់នៅវេលាម៉ោងដប់មួយ និងសូន្យនាទីព្រឹក នាថ្ងៃខែឆ្នាំដដែល ក្រោមបរិយាកាសរីករាយ និងស្និទ្ធស្នាលក្រៃលែង។'
                    );
                  }}
                  className="p-2.5 text-left bg-amber-50/70 hover:bg-amber-100/80 border border-amber-200 rounded-xl transition space-y-1 group"
                >
                  <div className="flex items-center justify-between text-[11px] font-bold text-amber-900">
                    <span className="flex items-center gap-1">☀️ ពេលព្រឹក (១១:០០ ព្រឹក - AM)</span>
                    <span className="text-[10px] text-amber-700 font-medium group-hover:underline">ជ្រើសរើស ➔</span>
                  </div>
                  <p className="text-[11px] text-slate-700 font-serif leading-relaxed line-clamp-2">
                    «អង្គប្រជុំនេះ បានបញ្ចប់នៅវេលាម៉ោងដប់មួយ និងសូន្យនាទីព្រឹក នាថ្ងៃខែឆ្នាំដដែល ក្រោមបរិយាកាសរីករាយ និងស្និទ្ធស្នាលក្រៃលែង។»
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    updateField(
                      'conclusionText',
                      'អង្គប្រជុំនេះ បានបញ្ចប់នៅវេលាម៉ោងដប់មួយ និងសាមសិបនាទីព្រឹក នាថ្ងៃខែឆ្នាំដដែល ក្រោមបរិយាកាសរីករាយ និងស្និទ្ធស្នាលក្រៃលែង។'
                    );
                  }}
                  className="p-2.5 text-left bg-amber-50/70 hover:bg-amber-100/80 border border-amber-200 rounded-xl transition space-y-1 group"
                >
                  <div className="flex items-center justify-between text-[11px] font-bold text-amber-900">
                    <span className="flex items-center gap-1">☀️ ពេលព្រឹក (១១:៣០ ព្រឹក - AM)</span>
                    <span className="text-[10px] text-amber-700 font-medium group-hover:underline">ជ្រើសរើស ➔</span>
                  </div>
                  <p className="text-[11px] text-slate-700 font-serif leading-relaxed line-clamp-2">
                    «អង្គប្រជុំនេះ បានបញ្ចប់នៅវេលាម៉ោងដប់មួយ និងសាមសិបនាទីព្រឹក នាថ្ងៃខែឆ្នាំដដែល ក្រោមបរិយាកាសរីករាយ និងស្និទ្ធស្នាលក្រៃលែង។»
                  </p>
                </button>

                {/* PM Presets */}
                <button
                  type="button"
                  onClick={() => {
                    updateField(
                      'conclusionText',
                      'អង្គប្រជុំនេះ បានបញ្ចប់នៅវេលាម៉ោងបួន និងសាមសិបនាទី នាថ្ងៃខែឆ្នាំដដែល ក្រោមបរិយាកាសរីករាយ និងស្និទ្ធស្នាលក្រៃលែង។'
                    );
                  }}
                  className="p-2.5 text-left bg-blue-50/70 hover:bg-blue-100/80 border border-blue-200 rounded-xl transition space-y-1 group"
                >
                  <div className="flex items-center justify-between text-[11px] font-bold text-blue-900">
                    <span className="flex items-center gap-1">⛅ ពេលរសៀល (៤:៣០ រសៀល - PM)</span>
                    <span className="text-[10px] text-blue-700 font-medium group-hover:underline">ជ្រើសរើស ➔</span>
                  </div>
                  <p className="text-[11px] text-slate-700 font-serif leading-relaxed line-clamp-2">
                    «អង្គប្រជុំនេះ បានបញ្ចប់នៅវេលាម៉ោងបួន និងសាមសិបនាទី នាថ្ងៃខែឆ្នាំដដែល ក្រោមបរិយាកាសរីករាយ និងស្និទ្ធស្នាលក្រៃលែង។»
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    updateField(
                      'conclusionText',
                      'អង្គប្រជុំនេះ បានបញ្ចប់នៅវេលាម៉ោងប្រាំ និងសូន្យនាទី នាថ្ងៃខែឆ្នាំដដែល ក្រោមបរិយាកាសរីករាយ និងស្និទ្ធស្នាលក្រៃលែង។'
                    );
                  }}
                  className="p-2.5 text-left bg-blue-50/70 hover:bg-blue-100/80 border border-blue-200 rounded-xl transition space-y-1 group"
                >
                  <div className="flex items-center justify-between text-[11px] font-bold text-blue-900">
                    <span className="flex items-center gap-1">⛅ ពេលរសៀល (៥:០០ រសៀល - PM)</span>
                    <span className="text-[10px] text-blue-700 font-medium group-hover:underline">ជ្រើសរើស ➔</span>
                  </div>
                  <p className="text-[11px] text-slate-700 font-serif leading-relaxed line-clamp-2">
                    «អង្គប្រជុំនេះ បានបញ្ចប់នៅវេលាម៉ោងប្រាំ និងសូន្យនាទី នាថ្ងៃខែឆ្នាំដដែល ក្រោមបរិយាកាសរីករាយ និងស្និទ្ធស្នាលក្រៃលែង។»
                  </p>
                </button>
              </div>
            </div>

            {/* Custom End Time Spoken Converter */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-1">
                <span className="text-xs font-bold text-slate-700 shrink-0">
                  ម៉ោងបញ្ចប់ជាក់ស្តែង៖
                </span>
                <input
                  type="text"
                  value={customEndTimeInput}
                  onChange={(e) => setCustomEndTimeInput(e.target.value)}
                  placeholder="ឧ. 11:15 AM ឬ 4:45 PM"
                  className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-hidden w-36"
                />
                <span className="text-[11px] text-slate-400 font-serif hidden md:inline">
                  ➔ {convertTimeToKhmerSpokenWords(customEndTimeInput)}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  const spoken = convertTimeToKhmerSpokenWords(customEndTimeInput);
                  const generated = generateFormalKhmerConclusionText(undefined, spoken);
                  updateField('conclusionText', generated);
                }}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition shadow-xs flex items-center justify-center gap-1 shrink-0"
              >
                ⚡ បង្កើតអត្ថបទតាមម៉ោងនេះ
              </button>
            </div>

            {/* Textarea */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                អត្ថបទបញ្ចប់ដែលបង្ហាញលើកំណត់ហេតុ (Conclusion Text Area)៖
              </label>
              <textarea
                rows={2}
                value={meeting.conclusionText}
                onChange={(e) => updateField('conclusionText', e.target.value)}
                placeholder="អង្គប្រជុំនេះ បានបញ្ចប់នៅវេលាម៉ោង... នាថ្ងៃខែឆ្នាំដដែល ក្រោមបរិយាកាសរីករាយ និងស្និទ្ធស្នាលក្រៃលែង។"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* CARD 6: Attendees & Signatures (វត្តមាន & ហត្ថលេខា) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-teal-50 text-teal-700 rounded-lg">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 font-moul text-base">
                  កាតទី ៦៖ បញ្ជីវត្តមាន & ហត្ថលេខា ({toKhmerNumeral(meeting.attendees.length)} នាក់)
                </h3>
                <p className="text-xs text-slate-500">
                  គ្រប់គ្រង និងគូសហត្ថលេខាឌីជីថលតាមរយៈ Modal Form
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onOpenAttendeeModal()}
              className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition shadow-xs shrink-0 font-moul"
            >
              <Plus className="w-4 h-4" /> ➕ បន្ថែមវត្តមាន & គូសហត្ថលេខា
            </button>
          </div>

          {/* Attendees List / Table */}
          {meeting.attendees.length === 0 ? (
            <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-500 text-xs">
              មិនទាន់មានទិន្នន័យវត្តមាននៅឡើយទេ។ សូមចុចប៊ូតុង "➕ បន្ថែមវត្តមាន & គូសហត្ថលេខា" ខាងលើ។
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {meeting.attendees.map((att, idx) => (
                <div
                  key={att.id || idx}
                  className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 hover:border-indigo-300 transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs shrink-0 font-moul">
                      {toKhmerNumeral(idx + 1)}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {att.name} <span className="text-[10px] text-slate-500 font-normal">({att.gender})</span>
                      </h4>
                      <p className="text-[11px] text-slate-600 truncate">{att.role} - {att.organization}</p>
                      <p className="text-[10px] text-slate-400 truncate">{att.phone || 'គ្មានលេខ'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Signature Preview */}
                    {att.signatureData?.startsWith('data:image') ? (
                      <div className="w-14 h-8 bg-white border border-slate-200 rounded flex items-center justify-center overflow-hidden p-0.5">
                        <img
                          src={att.signatureData}
                          alt="sig"
                          className="max-h-full max-w-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ) : (
                      <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono">
                        ហត្ថលេខា
                      </span>
                    )}

                    {/* Actions */}
                    <button
                      type="button"
                      onClick={() => onOpenAttendeeModal(att)}
                      title="កែប្រែ"
                      className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteAttendee(att.id)}
                      title="លុប"
                      className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox / Full Photo Preview Modal */}
      {previewImageUrl && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewImageUrl(null)}
        >
          <div 
            className="relative max-w-4xl max-h-[90vh] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700 flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full bg-slate-950/80 px-4 py-3 flex items-center justify-between text-white border-b border-slate-800">
              <span className="text-xs font-medium text-slate-300">ទិដ្ឋភាពរូបភាពសកម្មភាពពេញទំហំ</span>
              <button
                type="button"
                onClick={() => setPreviewImageUrl(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-2 flex items-center justify-center max-h-[calc(90vh-60px)] overflow-auto">
              <img
                src={previewImageUrl}
                alt="រូបភាពពង្រីក"
                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-md"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Khmer Calendar Modal */}
      <KhmerCalendarModal
        isOpen={isKhmerCalendarOpen}
        onClose={() => setIsKhmerCalendarOpen(false)}
        selectedDateStr={meeting.date}
        meetingTime={meeting.time}
        meetingLocation={meeting.location}
        meetingTopic={meeting.topic}
        meetingLeader={`${meeting.leaderName} (${meeting.leaderRole})`}
        onSelectDate={(newDateStr, generatedTexts) => {
          if (generatedTexts) {
            onChange({
              ...meeting,
              date: newDateStr,
              introText: generatedTexts.introText,
              attendanceDateLocation: generatedTexts.attendanceDateLocation,
              conclusionText: generatedTexts.conclusionText
            });
          } else {
            const { introText, attendanceDateLocation } = generateFormalKhmerDateText(
              newDateStr,
              meeting.time,
              meeting.location,
              meeting.topic,
              `${meeting.leaderName} (${meeting.leaderRole})`
            );
            const conclusionText = generateFormalKhmerConclusionText(meeting.time);
            onChange({
              ...meeting,
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
};
