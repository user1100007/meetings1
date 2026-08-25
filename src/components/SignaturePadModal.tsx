import React, { useState, useRef, useEffect } from 'react';
import { X, Check, RotateCcw, Pen, Trash2, ShieldCheck, Image as ImageIcon } from 'lucide-react';
import { Attendee } from '../types';

interface SignaturePadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (attendee: Attendee) => void;
  initialAttendee?: Attendee | null;
}

export const SignaturePadModal: React.FC<SignaturePadModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialAttendee
}) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('ប្រុស');
  const [role, setRole] = useState('សមាសភាពគ.គ.ស.');
  const [organization, setOrganization] = useState('សាលាបឋមសិក្សា រោគ');
  const [phone, setPhone] = useState('');
  const [remarks, setRemarks] = useState('ចូលរួមពេញលេញ');
  const [signatureType, setSignatureType] = useState<'text' | 'image'>('image');
  const [signatureData, setSignatureData] = useState<string>('');
  const [penColor, setPenColor] = useState<string>('#1e40af'); // blue ink
  const [penWidth, setPenWidth] = useState<number>(2.5);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Populate initial data when editing
  useEffect(() => {
    if (initialAttendee) {
      setName(initialAttendee.name || '');
      setGender(initialAttendee.gender || 'ប្រុស');
      setRole(initialAttendee.role || '');
      setOrganization(initialAttendee.organization || '');
      setPhone(initialAttendee.phone || '');
      setRemarks(initialAttendee.remarks || '');
      setSignatureType(initialAttendee.signatureType || 'image');
      setSignatureData(initialAttendee.signatureData || '');
      if (initialAttendee.signatureType === 'image' && initialAttendee.signatureData) {
        setHasDrawn(true);
      }
    } else {
      setName('');
      setGender('ប្រុស');
      setRole('សមាសភាពគ.គ.ស.');
      setOrganization('សាលាបឋមសិក្សា រោគ');
      setPhone('');
      setRemarks('ចូលរួមពេញលេញ');
      setSignatureType('image');
      setSignatureData('');
      setHasDrawn(false);
    }
  }, [initialAttendee, isOpen]);

  // Setup canvas high-DPI scaling
  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear and draw grid / baseline
    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;
    ctx.scale(ratio, ratio);

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // If initial image exists, load it
    if (initialAttendee?.signatureType === 'image' && initialAttendee.signatureData?.startsWith('data:image')) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, rect.width, rect.height);
      };
      img.src = initialAttendee.signatureData;
    }
  }, [isOpen, initialAttendee]);

  if (!isOpen) return null;

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
    ctx.strokeStyle = penColor;
    ctx.lineWidth = penWidth;
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      setSignatureData(canvas.toDataURL('image/png'));
      setSignatureType('image');
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureData('');
    setHasDrawn(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const base64 = ev.target?.result as string;
        setSignatureData(base64);
        setSignatureType('image');
        setHasDrawn(true);
        // Draw to canvas
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          const img = new Image();
          img.onload = () => {
            if (ctx) {
              const rect = canvas.getBoundingClientRect();
              ctx.clearRect(0, 0, rect.width, rect.height);
              ctx.drawImage(img, 0, 0, rect.width, rect.height);
            }
          };
          img.src = base64;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('សូមបញ្ចូលគោត្តនាម-នាមអ្នកចូលរួម!');
      return;
    }

    let finalSigData = signatureData;
    let finalSigType: 'text' | 'image' = signatureType;

    if (!finalSigData && !hasDrawn) {
      // Default to digital stamp if nothing drawn
      finalSigData = 'ឌីជីថល (បានចុះហត្ថលេខា)';
      finalSigType = 'text';
    }

    const attendee: Attendee = {
      id: initialAttendee?.id || Date.now().toString(),
      name: name.trim(),
      gender,
      role: role.trim() || 'សមាសភាព គ.គ.ស.',
      organization: organization.trim() || 'សាលារៀន',
      phone: phone.trim(),
      signatureType: finalSigType,
      signatureData: finalSigData,
      remarks: remarks.trim() || 'ចូលរួមពេញលេញ'
    };

    onSave(attendee);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-blue-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/15 rounded-lg">
              <Pen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight font-moul">
                {initialAttendee ? 'កែប្រែព័ត៌មានវត្តមាន' : 'ចុះឈ្មោះវត្តមាន & គូសហត្ថលេខា'}
              </h3>
              <p className="text-xs text-indigo-100 mt-0.5">
                បំពេញព័ត៌មាន និងគូសហត្ថលេខាផ្ទាល់លើអេក្រង់
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                គោត្តនាម-នាម <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="ឧ. សុខ សារើន ឬ វ៉ាន់ ថា"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden font-medium"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ភេទ</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden"
              >
                <option value="ប្រុស">ប្រុស</option>
                <option value="ស្រី">ស្រី</option>
              </select>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">លេខទូរស័ព្ទ</label>
              <input
                type="text"
                placeholder="ឧ. ០១២ ៣៤៥ ៦៧៨"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden font-mono"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ភារកិច្ច / តួនាទី
              </label>
              <input
                type="text"
                placeholder="ឧ. សមាសភាព គ.គ.ស. / នាយិកា"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden"
              />
            </div>

            {/* Organization */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                អង្គភាព / ស្ថាប័ន
              </label>
              <input
                type="text"
                placeholder="ឧ. សាលាបឋមសិក្សា រោគ / សហគមន៍"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden"
              />
            </div>

            {/* Remarks */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                សេចក្ដីបញ្ជាក់ / ផ្សេងៗ
              </label>
              <input
                type="text"
                placeholder="ឧ. ចូលរួមពេញលេញ ឬ ដឹកនាំអង្គប្រជុំ"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden"
              />
            </div>
          </div>

          {/* Signature Canvas Area */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/70 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Pen className="w-3.5 h-3.5 text-indigo-600" /> គូសហត្ថលេខាផ្ទាល់លើប្រអប់ខាងក្រោម (Touch / Mouse)
              </span>

              {/* Color & tools */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setPenColor('#1e40af')}
                  title="ទឹកប៊ិចខៀវ"
                  className={`w-5 h-5 rounded-full border-2 transition ${penColor === '#1e40af' ? 'border-slate-800 scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: '#1e40af' }}
                />
                <button
                  type="button"
                  onClick={() => setPenColor('#0f172a')}
                  title="ទឹកប៊ិចខ្មៅ"
                  className={`w-5 h-5 rounded-full border-2 transition ${penColor === '#0f172a' ? 'border-slate-800 scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: '#0f172a' }}
                />
                <button
                  type="button"
                  onClick={clearCanvas}
                  className="text-xs text-red-600 hover:text-red-800 hover:bg-red-50 px-2 py-1 rounded flex items-center gap-1 transition ml-2 font-medium"
                >
                  <RotateCcw className="w-3 h-3" /> លុបគូសឡើងវិញ
                </button>
              </div>
            </div>

            {/* Canvas Box */}
            <div className="relative border-2 border-dashed border-slate-300 rounded-xl bg-white overflow-hidden shadow-inner cursor-crosshair">
              <canvas
                ref={canvasRef}
                className="w-full h-36 touch-none block"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
              {!hasDrawn && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-400 text-xs italic">
                  ✍️ សូមចុច និងអូសម្រាមដៃ ឬ Mouse ដើម្បីចុះហត្ថលេខា
                </div>
              )}
            </div>

            {/* Optional upload / digital seal */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 hover:underline"
              >
                <ImageIcon className="w-3.5 h-3.5" /> ផ្ទុកឡើងរូបភាពហត្ថលេខា (Upload PNG/JPG)
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />

              <span className="text-[11px] text-slate-400">
                (ហត្ថលេខានឹងរក្សាទុកក្នុងរបាយការណ៍)
              </span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg text-sm font-medium transition"
            >
              បោះបង់
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold shadow-md hover:shadow-lg transition flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" /> រក្សាទុកវត្តមាន
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
