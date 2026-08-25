import React from 'react';
import { MeetingReport } from '../types';
import { toKhmerNumeral } from '../utils/khmerDate';

interface MeetingPrintDocumentProps {
  meeting: MeetingReport;
}

export const MeetingPrintDocument: React.FC<MeetingPrintDocumentProps> = ({ meeting }) => {
  return (
    <div className="max-w-[210mm] mx-auto bg-white text-slate-900 shadow-xl print:shadow-none border border-slate-200 print:border-none p-6 sm:p-12 md:p-14 space-y-8 rounded-2xl print:rounded-none">
      {/* SECTION 1: OFFICIAL REPORT DOCUMENT (សន្លឹកកំណត់ហេតុ) */}
      <section className="space-y-6">
        {/* Kingdom Header - Exclusively centered at the top */}
        <div className="flex flex-col items-center justify-center space-y-1 pb-4">
          <h1 className="font-moul text-sm sm:text-base text-slate-900 tracking-wider">
            ព្រះរាជាណាចក្រកម្ពុជា
          </h1>
          <h2 className="font-moul text-xs sm:text-sm text-slate-800 tracking-widest">
            ជាតិ សាសនា ព្រះមហាក្សត្រ
          </h2>
          <div className="flex justify-center items-center gap-1 text-slate-700 text-[10px] sm:text-xs tracking-widest font-serif pt-0.5">
            <span>𖣘𖣘𖣘𖣘𖣘</span>
          </div>
        </div>

        {/* School Header - Placed below the Kingdom header */}
        <div className="space-y-0.5 text-left pb-2">
          <p className="font-moul text-xs sm:text-sm text-slate-800 tracking-wide leading-relaxed">{meeting.district || 'រដ្ឋបាលស្រុកភ្នំស្រុក'}</p>
          <p className="font-moul text-xs text-slate-700 leading-relaxed">{meeting.schoolName || 'សាលាបឋមសិក្សា រោគ'}</p>
          <p className="text-[11px] sm:text-xs text-slate-500 font-serif pt-0.5">លេខ: .................... គ.គ.ស.</p>
        </div>

        {/* Title */}
        <div className="text-center py-3 space-y-1">
          <h2 className="font-moul text-lg sm:text-xl text-slate-900 underline decoration-slate-400 underline-offset-8 decoration-1">
            កំណត់ហេតុ
          </h2>
          <p className="font-moul text-sm text-slate-800 pt-1">ស្តីពី</p>
          <p className="font-moul text-sm sm:text-base text-indigo-950 px-4 leading-relaxed max-w-2xl mx-auto">
            {meeting.topic}
          </p>
        </div>

        {/* Intro Paragraph */}
        <div className="text-justify leading-loose text-sm sm:text-[15px] font-normal indent-8 text-slate-800">
          {meeting.introText}
        </div>

        {/* Participants */}
        <div className="space-y-1">
          <p className="font-bold text-sm text-slate-900 font-moul">
            + សមាសភាពចូលរួម៖
          </p>
          <p className="text-sm text-slate-700 italic pl-4">
            {meeting.participantsText || '-(បញ្ជីវត្តមានជូនភ្ជាប់)'}
          </p>
        </div>

        {/* Agendas (ក- របៀបវារៈប្រជុំ) */}
        <div className="space-y-2">
          <p className="font-bold text-sm text-slate-900 font-moul">
            ក- របៀបវារៈប្រជុំ៖
          </p>
          <div className="space-y-1.5 pl-6 text-sm text-slate-800">
            {meeting.agendas.map((agenda, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="font-moul font-bold text-xs shrink-0 text-slate-700 mt-0.5">
                  {toKhmerNumeral(index + 1)}.
                </span>
                <span className="leading-relaxed">{agenda}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Proceedings (ខ- ដំណើរការប្រជុំ) */}
        <div className="space-y-2">
          <p className="font-bold text-sm text-slate-900 font-moul">
            ខ- ដំណើរការប្រជុំ៖
          </p>
          <div className="space-y-3 pl-6 text-sm text-slate-800">
            {meeting.processes.map((proc, index) => (
              <div key={index} className="flex flex-col gap-2">
                <div className="flex items-start gap-2">
                  <span className="font-moul font-bold text-xs shrink-0 text-slate-700 mt-0.5">
                    {toKhmerNumeral(index + 1)}.
                  </span>
                  <span className="leading-relaxed">{proc.text}</span>
                </div>
                {/* Images Collection Grid for this process */}
                {proc.images && proc.images.length > 0 && (
                  <div className={`mt-2 mb-2.5 w-full ${
                    proc.images.length === 1 
                      ? 'grid grid-cols-1 max-w-lg mx-auto' 
                      : proc.images.length === 3 
                        ? 'grid grid-cols-3 gap-2.5' 
                        : 'grid grid-cols-2 gap-3'
                  }`}>
                    {proc.images.map((imgUrl, imgIdx) => (
                      <div 
                        key={imgIdx} 
                        className={`w-full overflow-hidden rounded-lg border border-slate-300 bg-slate-100 shadow-2xs ${
                          proc.images!.length === 1 
                            ? 'aspect-[16/9] max-h-64' 
                            : proc.images!.length === 3 
                              ? 'aspect-[4/3] max-h-44' 
                              : 'aspect-[4/3] sm:aspect-[16/10] max-h-52'
                        }`}
                      >
                        <img 
                          src={imgUrl} 
                          alt={`សកម្មភាព ${index + 1} - រូបភាព ${imgIdx + 1}`} 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer" 
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Executive Summary (គ- សេចក្តីសង្ខេបកិច្ចប្រជុំ) */}
        {meeting.executiveSummary && (
          <div className="space-y-2 bg-slate-50/80 p-4 rounded-xl border border-slate-200 print:bg-transparent print:p-0 print:border-none">
            <p className="font-bold text-sm text-slate-900 font-moul">
              គ- សេចក្តីសង្ខេបកិច្ចប្រជុំ (Executive Summary)៖
            </p>
            <div className="text-justify text-sm text-slate-800 whitespace-pre-line leading-relaxed pl-2 font-serif">
              {meeting.executiveSummary}
            </div>
          </div>
        )}

        {/* Post-Meeting Action Items Table (ឃ- តារាងសេចក្តីសម្រេច & សកម្មភាពអនុវត្តបន្ត) */}
        {meeting.actionItems && meeting.actionItems.length > 0 && (
          <div className="space-y-2">
            <p className="font-bold text-sm text-slate-900 font-moul">
              {meeting.actionTableTitle || 'ឃ- តារាងសេចក្តីសម្រេច & សកម្មភាពអនុវត្តបន្ត (Action Plan)៖'}
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse border border-slate-400">
                <thead>
                  <tr className="bg-slate-100 font-moul text-slate-800 text-[11px]">
                    <th className="border border-slate-400 py-1.5 px-2 text-center w-10">
                      {meeting.actionTableHeaders?.col1 || 'ល.រ'}
                    </th>
                    <th className="border border-slate-400 py-1.5 px-2">
                      {meeting.actionTableHeaders?.col2 || 'សកម្មភាព / កិច្ចការ'}
                    </th>
                    <th className="border border-slate-400 py-1.5 px-2">
                      {meeting.actionTableHeaders?.col3 || 'អ្នកទទួលខុសត្រូវ'}
                    </th>
                    <th className="border border-slate-400 py-1.5 px-2 text-center">
                      {meeting.actionTableHeaders?.col4 || 'កាលកំណត់'}
                    </th>
                    <th className="border border-slate-400 py-1.5 px-2">
                      {meeting.actionTableHeaders?.col5 || 'លទ្ធផលរំពឹងទុក'}
                    </th>
                    <th className="border border-slate-400 py-1.5 px-2 text-center">
                      {meeting.actionTableHeaders?.col6 || 'ស្ថានភាព'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {meeting.actionItems.map((item, aIdx) => (
                    <tr key={item.id || aIdx} className="hover:bg-slate-50/50">
                      <td className="border border-slate-400 py-1.5 px-2 text-center font-bold">
                        {toKhmerNumeral(aIdx + 1)}
                      </td>
                      <td className="border border-slate-400 py-1.5 px-2 font-medium text-slate-900">
                        {item.task}
                      </td>
                      <td className="border border-slate-400 py-1.5 px-2 text-slate-700">
                        {item.responsiblePerson}
                      </td>
                      <td className="border border-slate-400 py-1.5 px-2 text-center text-slate-700">
                        {item.deadline}
                      </td>
                      <td className="border border-slate-400 py-1.5 px-2 text-slate-700">
                        {item.expectedOutput}
                      </td>
                      <td className="border border-slate-400 py-1.5 px-2 text-center font-medium text-slate-800">
                        {item.status || 'កំពុងអនុវត្ត'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Reference Documents & Attachments (ង- ឯកសារយោង & ឧបសម្ព័ន្ធភ្ជាប់) */}
        {meeting.referenceDocuments && meeting.referenceDocuments.length > 0 && (
          <div className="space-y-2">
            <p className="font-bold text-sm text-slate-900 font-moul">
              ង- ឯកសារយោង & ឧបសម្ព័ន្ធភ្ជាប់ដែលសម្រេចបាន (References & Attachments)៖
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {meeting.referenceDocuments.map((doc, dIdx) => (
                <div key={doc.id || dIdx} className="p-2 border border-slate-300 rounded-lg bg-slate-50/60 flex items-start gap-2">
                  <span className="font-bold font-moul text-slate-600 shrink-0">{toKhmerNumeral(dIdx + 1)}.</span>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 truncate">{doc.title || doc.fileName}</p>
                    {doc.note && <p className="text-slate-600 text-[11px] italic">{doc.note}</p>}
                    {doc.fileSize && <p className="text-slate-400 text-[10px]">ប្រភេទ៖ {doc.fileType.toUpperCase()} ({doc.fileSize})</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Conclusion (ច- សេចក្តីសន្និដ្ឋាន) */}
        <div className="space-y-1 text-justify text-sm text-slate-800 indent-8 leading-relaxed">
          {meeting.conclusionText || 'អង្គប្រជុំនេះ បានបញ្ចប់នៅវេលាម៉ោងសមគួរ នាថ្ងៃខែឆ្នាំដដែល ក្រោមបរិយាកាសរីករាយ និងស្និទ្ធស្នាលក្រៃលែង។'}
        </div>

        {/* Signatures for Main Document */}
        <div className="pt-6 grid grid-cols-2 gap-4 text-center">
          {/* Left: Chairperson (No name text below, only title and signature/seal) */}
          <div className="space-y-1">
            <p className="text-xs text-slate-500 italic">បានឃើញ និងឯកភាព</p>
            <p className="font-moul text-xs sm:text-sm text-slate-900">
              ប្រធានអង្គប្រជុំ / នាយិកាសាលា
            </p>
            <div className="h-14 flex items-center justify-center my-1">
              {meeting.attendees[0]?.signatureData?.startsWith('data:image') ? (
                <img
                  src={meeting.attendees[0].signatureData}
                  alt="ហត្ថលេខាប្រធាន"
                  className="max-h-11 max-w-[130px] object-contain mx-auto"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="text-xs text-slate-400 italic">ហត្ថលេខា & ត្រា</div>
              )}
            </div>
          </div>

          {/* Right: Recorder */}
          <div className="space-y-1">
            <p className="font-moul text-xs sm:text-sm text-slate-900">
              អ្នកធ្វើកំណត់ហេតុ
            </p>
            <div className="h-14 flex items-center justify-center my-1">
              {meeting.attendees[1]?.signatureData?.startsWith('data:image') ? (
                <img
                  src={meeting.attendees[1].signatureData}
                  alt="ហត្ថលេខាអ្នកកត់ត្រា"
                  className="max-h-11 max-w-[130px] object-contain mx-auto"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="text-xs text-slate-400 italic">ហត្ថលេខា</div>
              )}
            </div>
            <p className="font-moul text-xs sm:text-sm text-slate-900 font-bold">
              {meeting.preparerName || meeting.recorderName || 'លោក អ៊ុន ប៊ុនទុង'}
            </p>
          </div>
        </div>
      </section>

      {/* PAGE BREAK FOR PRINT */}
      <div className="break-before-page border-t-2 border-dashed border-slate-300 pt-8 print:border-none space-y-6">
        {/* SECTION 2: ATTENDANCE SHEET (បញ្ជីវត្តមាន) */}
        {/* Kingdom Header - Exclusively centered at the top */}
        <div className="flex flex-col items-center justify-center space-y-1 pb-4">
          <h1 className="font-moul text-sm sm:text-base text-slate-900 tracking-wider">
            ព្រះរាជាណាចក្រកម្ពុជា
          </h1>
          <h2 className="font-moul text-xs sm:text-sm text-slate-800 tracking-widest">
            ជាតិ សាសនា ព្រះមហាក្សត្រ
          </h2>
          <div className="flex justify-center items-center gap-1 text-slate-700 text-[10px] sm:text-xs tracking-widest font-serif pt-0.5">
            <span>𖣘𖣘𖣘𖣘𖣘</span>
          </div>
        </div>

        {/* School Header - Placed below the Kingdom header (No letter number, only unit/school name) */}
        <div className="space-y-0.5 text-left pb-2">
          <p className="font-moul text-xs text-slate-800 leading-relaxed">{meeting.schoolName || 'សាលាបឋមសិក្សា រោគ'}</p>
        </div>

        {/* Attendance Header */}
        <div className="text-center py-2 space-y-1">
          <h2 className="font-moul text-base sm:text-lg text-slate-900">
            បញ្ជីវត្តមានអ្នកចូលរួមប្រជុំ
          </h2>
          <p className="font-moul text-xs sm:text-sm text-slate-800 pt-0.5">ស្តីពី</p>
          <p className="font-moul text-xs sm:text-sm text-indigo-950 px-4 leading-relaxed max-w-2xl mx-auto">
            {meeting.topic}
          </p>
        </div>

        {/* Attendance Paragraph Date & Location: text align left & indented */}
        {meeting.attendanceDateLocation && (
          <div className="text-justify leading-loose text-xs sm:text-sm font-normal indent-8 text-slate-800">
            {meeting.attendanceDateLocation}
          </div>
        )}

        {/* Attendance Table - Responsive Design with Desktop Table & Mobile Stacking */}
        <div className="overflow-x-auto rounded-lg border border-slate-300">
          <table className="w-full text-xs sm:text-sm border-collapse text-left">
            <thead>
              <tr className="bg-slate-100/90 text-slate-800 border-b border-slate-300 font-moul text-center text-[11px] sm:text-xs">
                <th className="p-2 border-r border-slate-300 w-10">ល.រ</th>
                <th className="p-2 border-r border-slate-300">គោត្តនាម និងនាម</th>
                <th className="p-2 border-r border-slate-300 w-12">ភេទ</th>
                <th className="p-2 border-r border-slate-300">ភារកិច្ច / តួនាទី</th>
                <th className="p-2 border-r border-slate-300">អង្គភាព / ស្ថាប័ន</th>
                <th className="p-2 border-r border-slate-300">លេខទូរស័ព្ទ</th>
                <th className="p-2 border-r border-slate-300 w-28">ហត្ថលេខា</th>
                <th className="p-2 w-20">ផ្សេងៗ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300 text-slate-800">
              {meeting.attendees.map((att, idx) => (
                <tr key={att.id || idx} className="hover:bg-slate-50/60 transition">
                  <td className="p-2 text-center border-r border-slate-300 font-moul text-xs">
                    {toKhmerNumeral(idx + 1)}
                  </td>
                  <td className="p-2 border-r border-slate-300 font-medium">
                    {att.name}
                  </td>
                  <td className="p-2 text-center border-r border-slate-300">
                    {att.gender}
                  </td>
                  <td className="p-2 border-r border-slate-300">
                    {att.role}
                  </td>
                  <td className="p-2 border-r border-slate-300">
                    {att.organization}
                  </td>
                  <td className="p-2 border-r border-slate-300 font-mono text-center text-[11px]">
                    {att.phone || '-'}
                  </td>
                  <td className="p-1 border-r border-slate-300 text-center">
                    {att.signatureData?.startsWith('data:image') ? (
                      <div className="h-10 flex items-center justify-center">
                        <img
                          src={att.signatureData}
                          alt="sig"
                          className="max-h-9 max-w-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-500 italic">
                        {att.signatureData || 'ឌីជីថល'}
                      </span>
                    )}
                  </td>
                  <td className="p-2 text-center text-slate-600 text-xs">
                    {att.remarks || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Signatures for Attendance Sheet */}
        <div className="pt-6 grid grid-cols-2 gap-4 text-center">
          <div className="space-y-1">
            <p className="text-xs text-slate-500 italic">បានឃើញ និងពិនិត្យត្រឹមត្រូវ</p>
            <p className="font-moul text-xs sm:text-sm text-slate-900">
              ប្រធានអង្គប្រជុំ
            </p>
            <div className="h-14 flex items-center justify-center my-1">
              {meeting.attendees[0]?.signatureData?.startsWith('data:image') ? (
                <img
                  src={meeting.attendees[0].signatureData}
                  alt="ហត្ថលេខា"
                  className="max-h-11 max-w-[130px] object-contain mx-auto"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="text-xs text-slate-400 italic">ហត្ថលេខា & ត្រា</div>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <p className="font-moul text-xs sm:text-sm text-slate-900">
              អ្នកស្រង់វត្តមាន
            </p>
            <div className="h-14 flex items-center justify-center my-1">
              {meeting.attendees[1]?.signatureData?.startsWith('data:image') ? (
                <img
                  src={meeting.attendees[1].signatureData}
                  alt="ហត្ថលេខា"
                  className="max-h-11 max-w-[130px] object-contain mx-auto"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="text-xs text-slate-400 italic">ហត្ថលេខា</div>
              )}
            </div>
            <p className="font-moul text-xs sm:text-sm text-slate-900 font-bold">
              {meeting.preparerName || meeting.recorderName || 'លោក អ៊ុន ប៊ុនទុង'}
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 3: ATTACHED A4 REFERENCE DOCUMENTS (ឧបសម្ព័ន្ធឯកសារយោងទម្រង់ A4) */}
      {meeting.referenceDocuments && meeting.referenceDocuments.length > 0 && (
        <div className="space-y-8">
          {meeting.referenceDocuments.map((doc, dIdx) => (
            <div 
              key={doc.id || dIdx}
              className="break-before-page border-t-2 border-dashed border-slate-300 pt-8 print:border-none space-y-4"
            >
              {/* Attachment Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-slate-300 gap-2">
                <div className="space-y-0.5">
                  <span className="font-moul text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                    ឧបសម្ព័ន្ធភ្ជាប់ (សន្លឹក A4 ទី {toKhmerNumeral(dIdx + 1)})
                  </span>
                  <h3 className="font-moul text-sm sm:text-base text-slate-900 pt-1">
                    {doc.title || doc.fileName}
                  </h3>
                </div>
                {doc.note && (
                  <p className="text-xs text-slate-600 italic bg-slate-50 px-3 py-1 rounded border border-slate-200">
                    {doc.note}
                  </p>
                )}
              </div>

              {/* A4 Sheet Body */}
              <div className="w-full flex justify-center">
                {doc.fileData && (doc.fileType === 'image' || doc.fileData.startsWith('data:image')) ? (
                  <div className="w-full max-w-2xl bg-white border border-slate-300 rounded-lg overflow-hidden shadow-xs">
                    <img 
                      src={doc.fileData} 
                      alt={doc.title} 
                      className="w-full h-auto object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ) : (
                  <div className="w-full p-8 bg-slate-50 border border-slate-300 rounded-xl text-center space-y-2">
                    <p className="font-moul text-sm text-slate-800">{doc.title || doc.fileName}</p>
                    <p className="text-xs text-slate-500">ប្រភេទឯកសារ៖ {doc.fileType.toUpperCase()} {doc.fileSize ? `(${doc.fileSize})` : ''}</p>
                    {doc.note && <p className="text-xs text-slate-600 italic">{doc.note}</p>}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
