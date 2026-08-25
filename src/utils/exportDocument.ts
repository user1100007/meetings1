import { MeetingReport } from '../types';
import { toKhmerNumeral } from './khmerDate';

export function exportMeetingToWord(meeting: MeetingReport) {
  const filename = `កំណត់ហេតុ_${meeting.topic.replace(/[/\\?%*:|"<>]/g, '_').substring(0, 30)}.doc`;

  // Generate HTML formatted for Word with MSO namespaces
  const htmlContent = `
<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' 
      xmlns:w='urn:schemas-microsoft-com:office:word' 
      xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset="utf-8">
<title>${meeting.topic}</title>
<style>
  @page Section1 {
    size: 21.0cm 29.7cm; /* A4 */
    margin: 2.0cm 2.0cm 2.0cm 2.0cm;
    mso-header-margin: 1.0cm;
    mso-footer-margin: 1.0cm;
    mso-paper-source: 0;
  }
  div.Section1 {
    page: Section1;
    font-family: 'Khmer OS Siemreap', 'Battambang', 'Khmer OS', Arial, sans-serif;
    font-size: 11.5pt;
    line-height: 1.6;
    color: #111827;
  }
  .font-moul {
    font-family: 'Khmer OS Muol Light', 'Khmer OS Muol', 'Moul', serif;
  }
  .text-center { text-align: center; }
  .text-right { text-align: right; }
  .text-justify { text-align: justify; }
  .table-header {
    background-color: #f3f4f6;
    font-weight: bold;
    text-align: center;
  }
  table.attendance-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 15px;
    margin-bottom: 20px;
  }
  table.attendance-table th, table.attendance-table td {
    border: 1px solid #9ca3af;
    padding: 6px 8px;
    font-size: 10.5pt;
  }
  .page-break {
    page-break-before: always;
  }
  .img-grid {
    width: 100%;
    margin-top: 8px;
    margin-bottom: 12px;
  }
  .img-col {
    width: 24%;
    display: inline-block;
    vertical-align: top;
    margin-right: 1%;
    margin-bottom: 6px;
  }
  .img-col img {
    width: 100%;
    height: 120px;
    object-fit: cover;
    border: 1px solid #d1d5db;
  }
</style>
</head>
<body>
<div class="Section1">
  <!-- Top National & District Header -->
  <div style="text-align: center; margin-bottom: 20px;">
    <p class="font-moul" style="font-size:12pt; margin:0 0 2px 0; letter-spacing:1px;">ព្រះរាជាណាចក្រកម្ពុជា</p>
    <p class="font-moul" style="font-size:11pt; margin:0 0 3px 0;">ជាតិ សាសនា ព្រះមហាក្សត្រ</p>
    <p style="font-size:10pt; margin:0;">𖣘𖣘𖣘𖣘𖣘</p>
  </div>
  <div style="text-align: left; margin-bottom: 20px;">
    <p class="font-moul" style="font-size:11pt; margin:0 0 2px 0;">${meeting.district || 'រដ្ឋបាលស្រុកភ្នំស្រុក'}</p>
    <p class="font-moul" style="font-size:10pt; margin:0 0 2px 0;">${meeting.schoolName || 'សាលាបឋមសិក្សា រោគ'}</p>
    <p style="font-size:10pt; color:#4b5563; margin:0;">លេខ: .................... គ.គ.ស.</p>
  </div>

  <!-- Title -->
  <div class="text-center" style="margin: 20px 0;">
    <p class="font-moul" style="font-size:14pt; margin:0; text-decoration:underline;">កំណត់ហេតុ</p>
    <p class="font-moul" style="font-size:11pt; margin:4px 0;">ស្តីពី</p>
    <p class="font-moul" style="font-size:12pt; margin:0; color:#1e1b4b;">${meeting.topic}</p>
  </div>

  <!-- Intro -->
  <p class="text-justify" style="text-indent: 1.2cm; margin: 15px 0;">
    ${meeting.introText}
  </p>

  <!-- Participants -->
  <p style="margin: 10px 0;">
    <strong class="font-moul">+ សមាសភាពចូលរួម៖</strong><br/>
    <span style="font-style:italic; margin-left: 20px; color:#374151;">${meeting.participantsText || '-(បញ្ជីវត្តមានជូនភ្ជាប់)'}</span>
  </p>

  <!-- Agendas -->
  <p style="margin: 12px 0 6px 0;">
    <strong class="font-moul">ក- របៀបវារៈប្រជុំ៖</strong>
  </p>
  <div style="margin-left: 25px;">
    ${meeting.agendas.map((ag, idx) => `
      <p style="margin: 3px 0;">
        <strong class="font-moul">${toKhmerNumeral(idx + 1)}.</strong> ${ag}
      </p>
    `).join('')}
  </div>

  <!-- Processes & Photos -->
  <p style="margin: 14px 0 6px 0;">
    <strong class="font-moul">ខ- ដំណើរការប្រជុំ៖</strong>
  </p>
  <div style="margin-left: 25px;">
    ${meeting.processes.map((proc, idx) => {
      let imagesHtml = '';
      if (proc.images && proc.images.length > 0) {
        if (proc.images.length === 1) {
          imagesHtml = `
            <table style="width:100%; margin:8px 0 12px 0; border:none; border-collapse:collapse;">
              <tr>
                <td style="width:100%; border:none; padding:4px; text-align:center;">
                  <img src="${proc.images[0]}" style="width:100%; max-height:280px; object-fit:cover; border:1px solid #d1d5db; border-radius:6px;" alt="សកម្មភាព" />
                </td>
              </tr>
            </table>
          `;
        } else if (proc.images.length === 3) {
          imagesHtml = `
            <table style="width:100%; margin:8px 0 12px 0; border:none; border-collapse:collapse;">
              <tr>
                ${proc.images.map((img) => `
                  <td style="width:33.33%; border:none; padding:4px; vertical-align:top;">
                    <img src="${img}" style="width:100%; height:150px; object-fit:cover; border:1px solid #d1d5db; border-radius:6px;" alt="សកម្មភាព" />
                  </td>
                `).join('')}
              </tr>
            </table>
          `;
        } else {
          // 2 columns filling full width (2 per row)
          const rows: string[][] = [];
          for (let i = 0; i < proc.images.length; i += 2) {
            rows.push(proc.images.slice(i, i + 2));
          }
          imagesHtml = `
            <table style="width:100%; margin:8px 0 12px 0; border:none; border-collapse:collapse;">
              ${rows.map((row) => `
                <tr>
                  ${row.map((img) => `
                    <td style="width:50%; border:none; padding:4px; vertical-align:top;">
                      <img src="${img}" style="width:100%; height:180px; object-fit:cover; border:1px solid #d1d5db; border-radius:6px;" alt="សកម្មភាព" />
                    </td>
                  `).join('')}
                </tr>
              `).join('')}
            </table>
          `;
        }
      }

      return `
        <div style="margin-bottom: 8px;">
          <p style="margin: 3px 0;">
            <strong class="font-moul">${toKhmerNumeral(idx + 1)}.</strong> ${proc.text}
          </p>
          ${imagesHtml}
        </div>
      `;
    }).join('')}
  </div>

  <!-- Executive Summary -->
  ${meeting.executiveSummary ? `
    <div style="margin: 15px 0; background-color: #f9fafb; border: 1px solid #e5e7eb; padding: 12px; border-radius: 6px;">
      <p style="margin: 0 0 6px 0;"><strong class="font-moul">គ- សេចក្តីសង្ខេបកិច្ចប្រជុំ (Executive Summary)៖</strong></p>
      <div class="text-justify" style="white-space: pre-line; margin-left: 10px;">${meeting.executiveSummary}</div>
    </div>
  ` : ''}

  <!-- Action Items Table (Word export) -->
  ${meeting.actionItems && meeting.actionItems.length > 0 ? `
    <div style="margin: 15px 0;">
      <p style="margin: 0 0 6px 0;"><strong class="font-moul">${meeting.actionTableTitle || 'ឃ- តារាងសេចក្តីសម្រេច & សកម្មភាពអនុវត្តបន្ត (Action Plan)៖'}</strong></p>
      <table class="attendance-table" style="width:100%;">
        <thead>
          <tr class="table-header">
            <th style="width:35px;">${meeting.actionTableHeaders?.col1 || 'ល.រ'}</th>
            <th>${meeting.actionTableHeaders?.col2 || 'សកម្មភាព / កិច្ចការ'}</th>
            <th>${meeting.actionTableHeaders?.col3 || 'អ្នកទទួលខុសត្រូវ'}</th>
            <th style="width:90px;">${meeting.actionTableHeaders?.col4 || 'កាលកំណត់'}</th>
            <th>${meeting.actionTableHeaders?.col5 || 'លទ្ធផលរំពឹងទុក'}</th>
            <th style="width:90px;">${meeting.actionTableHeaders?.col6 || 'ស្ថានភាព'}</th>
          </tr>
        </thead>
        <tbody>
          ${meeting.actionItems.map((item, aIdx) => `
            <tr>
              <td class="text-center" style="font-weight:bold;">${toKhmerNumeral(aIdx + 1)}</td>
              <td><strong>${item.task}</strong></td>
              <td>${item.responsiblePerson}</td>
              <td class="text-center">${item.deadline}</td>
              <td>${item.expectedOutput}</td>
              <td class="text-center">${item.status || 'កំពុងអនុវត្ត'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  ` : ''}

  <!-- Reference Documents (Word export) -->
  ${meeting.referenceDocuments && meeting.referenceDocuments.length > 0 ? `
    <div style="margin: 15px 0;">
      <p style="margin: 0 0 6px 0;"><strong class="font-moul">ង- ឯកសារយោង & ឧបសម្ព័ន្ធភ្ជាប់ (References & Attachments)៖</strong></p>
      <ul style="margin: 4px 0 0 20px; padding: 0;">
        ${meeting.referenceDocuments.map((doc, dIdx) => `
          <li style="margin-bottom: 4px;">
            <strong>${doc.title || doc.fileName}</strong> 
            ${doc.note ? `<em>(${doc.note})</em>` : ''} 
            ${doc.fileSize ? `<span style="color:#6b7280; font-size:9pt;">- [${doc.fileType.toUpperCase()}, ${doc.fileSize}]</span>` : ''}
          </li>
        `).join('')}
      </ul>
    </div>
  ` : ''}

  <!-- Conclusion -->
  <p class="text-justify" style="text-indent: 1.2cm; margin: 15px 0;">
    ${meeting.conclusionText || 'អង្គប្រជុំនេះ បានបញ្ចប់នៅវេលាម៉ោងសមគួរ នាថ្ងៃខែឆ្នាំដដែល ក្រោមបរិយាកាសរីករាយ និងស្និទ្ធស្នាលក្រៃលែង។'}
  </p>

  <!-- Signatures Report -->
  <table style="width:100%; border:none; margin-top:25px; text-align:center;">
    <tr>
      <td style="width:50%; vertical-align:top; border:none;">
        <p style="font-size:9.5pt; font-style:italic; margin:0 0 4px 0;">បានឃើញ និងឯកភាព</p>
        <p class="font-moul" style="font-size:10.5pt; margin:0 0 4px 0;">ប្រធានអង្គប្រជុំ / នាយិកាសាលា</p>
        <div style="height:48px; margin:4px 0;">
          ${meeting.attendees[0]?.signatureData?.startsWith('data:image') 
            ? `<img src="${meeting.attendees[0].signatureData}" style="max-height:44px; max-width:120px;" />` 
            : `<div style="height:35px;"></div>`}
        </div>
      </td>
      <td style="width:50%; vertical-align:top; border:none;">
        <p class="font-moul" style="font-size:10.5pt; margin:0 0 4px 0;">អ្នកធ្វើកំណត់ហេតុ</p>
        <div style="height:48px; margin:4px 0;">
          ${meeting.attendees[1]?.signatureData?.startsWith('data:image') 
            ? `<img src="${meeting.attendees[1].signatureData}" style="max-height:44px; max-width:120px;" />` 
            : `<div style="height:35px;"></div>`}
        </div>
        <p class="font-moul" style="font-size:10.5pt; font-weight:bold; margin:0;">${meeting.preparerName || meeting.recorderName || 'លោក អ៊ុន ប៊ុនទុង'}</p>
      </td>
    </tr>
  </table>

  <!-- PAGE BREAK FOR ATTENDANCE -->
  <div class="page-break"></div>

  <!-- ATTENDANCE SHEET -->
  <div style="text-align: center; margin-bottom: 20px; margin-top: 15px;">
    <p class="font-moul" style="font-size:12pt; margin:0 0 2px 0;">ព្រះរាជាណាចក្រកម្ពុជា</p>
    <p class="font-moul" style="font-size:11pt; margin:0 0 3px 0;">ជាតិ សាសនា ព្រះមហាក្សត្រ</p>
    <p style="font-size:10pt; margin:0;">𖣘𖣘𖣘𖣘𖣘</p>
  </div>
  <div style="text-align: left; margin-bottom: 15px;">
    <p class="font-moul" style="font-size:11pt; margin:0 0 2px 0;">${meeting.schoolName || 'សាលាបឋមសិក្សា រោគ'}</p>
  </div>

  <div class="text-center" style="margin: 15px 0;">
    <p class="font-moul" style="font-size:13pt; margin:0;">បញ្ជីវត្តមានអ្នកចូលរួមប្រជុំ</p>
    <p class="font-moul" style="font-size:10.5pt; margin:4px 0;">ស្តីពី</p>
    <p class="font-moul" style="font-size:11.5pt; margin:0; color:#1e1b4b;">${meeting.topic}</p>
  </div>

  ${meeting.attendanceDateLocation ? `
    <div style="text-align: justify; text-indent: 36pt; line-height: 1.8; font-size: 10.5pt; margin-bottom: 15px;">
      ${meeting.attendanceDateLocation}
    </div>
  ` : ''}

  <!-- Attendance Table -->
  <table class="attendance-table">
    <thead>
      <tr class="table-header">
        <th style="width:35px;">ល.រ</th>
        <th>គោត្តនាម និងនាម</th>
        <th style="width:45px;">ភេទ</th>
        <th>ភារកិច្ច / តួនាទី</th>
        <th>អង្គភាព / ស្ថាប័ន</th>
        <th>លេខទូរស័ព្ទ</th>
        <th style="width:80px;">ហត្ថលេខា</th>
        <th>ផ្សេងៗ</th>
      </tr>
    </thead>
    <tbody>
      ${meeting.attendees.map((att, idx) => `
        <tr>
          <td class="text-center" style="font-weight:bold;">${toKhmerNumeral(idx + 1)}</td>
          <td><strong>${att.name}</strong></td>
          <td class="text-center">${att.gender}</td>
          <td>${att.role}</td>
          <td>${att.organization}</td>
          <td class="text-center">${att.phone || '-'}</td>
          <td class="text-center">
            ${att.signatureData?.startsWith('data:image') 
              ? `<img src="${att.signatureData}" style="max-height:35px; max-width:75px;" />` 
              : `<span style="font-size:8pt; font-style:italic; color:#6b7280;">${att.signatureData || 'ឌីជីថល'}</span>`
            }
          </td>
          <td class="text-center">${att.remarks || '-'}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <!-- Attendance Signatures -->
  <table style="width:100%; border:none; margin-top:20px; text-align:center;">
    <tr>
      <td style="width:50%; vertical-align:top; border:none;">
        <p style="font-size:9.5pt; font-style:italic; margin:0 0 4px 0;">បានឃើញ និងពិនិត្យត្រឹមត្រូវ</p>
        <p class="font-moul" style="font-size:10.5pt; margin:0 0 4px 0;">ប្រធានអង្គប្រជុំ</p>
        <div style="height:48px; margin:4px 0;">
          ${meeting.attendees[0]?.signatureData?.startsWith('data:image') 
            ? `<img src="${meeting.attendees[0].signatureData}" style="max-height:44px; max-width:120px;" />` 
            : `<div style="height:35px;"></div>`}
        </div>
      </td>
      <td style="width:50%; vertical-align:top; border:none;">
        <p class="font-moul" style="font-size:10.5pt; margin:0 0 4px 0;">អ្នកស្រង់វត្តមាន</p>
        <div style="height:48px; margin:4px 0;">
          ${meeting.attendees[1]?.signatureData?.startsWith('data:image') 
            ? `<img src="${meeting.attendees[1].signatureData}" style="max-height:44px; max-width:120px;" />` 
            : `<div style="height:35px;"></div>`}
        </div>
        <p class="font-moul" style="font-size:10.5pt; font-weight:bold; margin:0;">${meeting.preparerName || meeting.recorderName || 'លោក អ៊ុន ប៊ុនទុង'}</p>
      </td>
    </tr>
  </table>
</div>

<!-- Attached Reference Documents Pages (Word Export) -->
${meeting.referenceDocuments && meeting.referenceDocuments.length > 0 ? meeting.referenceDocuments.map((doc, dIdx) => `
  <div class="page-break"></div>
  <div class="doc-page" style="margin-top:20px;">
    <div style="border-bottom: 2px solid #b45309; padding-bottom: 8px; margin-bottom: 20px;">
      <p style="font-size:10pt; color:#b45309; margin:0;"><strong class="font-moul">ឧបសម្ព័ន្ធភ្ជាប់ (សន្លឹក A4 ទី ${toKhmerNumeral(dIdx + 1)})</strong></p>
      <p style="font-size:13pt; margin:4px 0 0 0;"><strong class="font-moul">${doc.title || doc.fileName}</strong></p>
      ${doc.note ? `<p style="font-size:10pt; font-style:italic; color:#4b5563; margin:4px 0 0 0;">${doc.note}</p>` : ''}
    </div>

    ${doc.fileData && (doc.fileType === 'image' || doc.fileData.startsWith('data:image')) ? `
      <div style="text-align:center;">
        <img src="${doc.fileData}" style="max-width:100%; border:1px solid #cbd5e1;" alt="${doc.title}" />
      </div>
    ` : `
      <div style="padding:40px; border:1px solid #cbd5e1; text-align:center; background:#f8fafc;">
        <p class="font-moul" style="font-size:13pt;">${doc.title || doc.fileName}</p>
        <p style="color:#64748b; font-size:10pt;">ប្រភេទ៖ ${doc.fileType.toUpperCase()} ${doc.fileSize ? `(${doc.fileSize})` : ''}</p>
      </div>
    `}
  </div>
`).join('') : ''}
</body>
</html>
  `;

  const blob = new Blob(['\ufeff', htmlContent], {
    type: 'application/msword;charset=utf-8'
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportMeetingToHtml(meeting: MeetingReport) {
  const filename = `កំណត់ហេតុ_${meeting.topic.replace(/[/\\?%*:|"<>]/g, '_').substring(0, 30)}.html`;

  const htmlContent = `
<!DOCTYPE html>
<html lang="km">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${meeting.topic}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Battambang:wght@400;700&family=Moul&display=swap" rel="stylesheet">
<style>
  body {
    font-family: 'Battambang', Arial, sans-serif;
    background-color: #f1f5f9;
    margin: 0;
    padding: 30px 15px;
    color: #0f172a;
  }
  .font-moul {
    font-family: 'Moul', cursive;
  }
  .page {
    max-width: 210mm;
    margin: 0 auto 30px auto;
    background: #ffffff;
    padding: 40px 50px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.08);
    border-radius: 12px;
    box-sizing: border-box;
  }
  .header-grid {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 25px;
  }
  .title-section {
    text-align: center;
    margin: 25px 0;
  }
  .title-section h2 {
    font-size: 20px;
    margin: 0;
    text-decoration: underline;
    text-underline-offset: 6px;
  }
  .title-section p.sub {
    margin: 6px 0 2px 0;
    font-size: 14px;
  }
  .title-section p.topic {
    font-size: 16px;
    color: #1e1b4b;
    margin: 0;
    line-height: 1.6;
  }
  .content-text {
    text-align: justify;
    line-height: 1.8;
    text-indent: 35px;
    font-size: 14.5px;
  }
  .section-label {
    font-weight: bold;
    margin: 15px 0 6px 0;
    font-size: 15px;
  }
  .item-list {
    margin-left: 20px;
    line-height: 1.7;
    font-size: 14px;
  }
  .exec-summary {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 15px;
    margin: 15px 0;
    white-space: pre-line;
    line-height: 1.6;
    font-size: 13.5px;
  }
  .signature-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    text-align: center;
    margin-top: 40px;
  }
  .sig-img-container {
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 6px 0;
  }
  .sig-img-container img {
    max-height: 44px;
    max-width: 120px;
    object-fit: contain;
  }
  table.attendance {
    width: 100%;
    border-collapse: collapse;
    margin-top: 15px;
    font-size: 13px;
  }
  table.attendance th, table.attendance td {
    border: 1px solid #cbd5e1;
    padding: 8px 10px;
  }
  table.attendance th {
    background: #f1f5f9;
  }
  .img-collection-1 {
    width: 100%;
    margin: 8px 0 14px 0;
  }
  .img-collection-1 img {
    width: 100%;
    max-height: 260px;
    aspect-ratio: 16/9;
    object-fit: cover;
    border-radius: 6px;
    border: 1px solid #cbd5e1;
  }
  .img-collection-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    width: 100%;
    margin: 8px 0 14px 0;
  }
  .img-collection-2 img {
    width: 100%;
    height: 180px;
    aspect-ratio: 4/3;
    object-fit: cover;
    border-radius: 6px;
    border: 1px solid #cbd5e1;
  }
  .img-collection-3 {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 8px;
    width: 100%;
    margin: 8px 0 14px 0;
  }
  .img-collection-3 img {
    width: 100%;
    height: 140px;
    aspect-ratio: 4/3;
    object-fit: cover;
    border-radius: 6px;
    border: 1px solid #cbd5e1;
  }
  @media print {
    body {
      background: white;
      padding: 0;
    }
    .page {
      box-shadow: none;
      border-radius: 0;
      padding: 0;
      margin: 0;
      page-break-after: always;
    }
  }
</style>
</head>
<body>

  <!-- PAGE 1: MEETING REPORT -->
  <div class="page">
    <div style="text-align: center; margin-bottom: 25px;">
      <h1 class="font-moul" style="font-size:15px; margin:0 0 2px 0; letter-spacing:1px;">ព្រះរាជាណាចក្រកម្ពុជា</h1>
      <h2 class="font-moul" style="font-size:13px; margin:0 0 4px 0;">ជាតិ សាសនា ព្រះមហាក្សត្រ</h2>
      <div style="font-size:12px;">𖣘𖣘𖣘𖣘𖣘</div>
    </div>
    <div style="text-align: left; margin-bottom: 20px;">
      <p class="font-moul" style="font-size:13px; margin:0 0 2px 0;">${meeting.district || 'រដ្ឋបាលស្រុកភ្នំស្រុក'}</p>
      <p class="font-moul" style="font-size:12px; margin:0 0 2px 0;">${meeting.schoolName || 'សាលាបឋមសិក្សា រោគ'}</p>
      <p style="font-size:11px; color:#64748b; margin:0;">លេខ: .................... គ.គ.ស.</p>
    </div>

    <div class="title-section">
      <h2 class="font-moul">កំណត់ហេតុ</h2>
      <p class="font-moul sub">ស្តីពី</p>
      <p class="font-moul topic">${meeting.topic}</p>
    </div>

    <div class="content-text">
      ${meeting.introText}
    </div>

    <div>
      <p class="section-label font-moul">+ សមាសភាពចូលរួម៖</p>
      <p style="font-style:italic; margin-left:15px; color:#475569; font-size:13.5px;">${meeting.participantsText || '-(បញ្ជីវត្តមានជូនភ្ជាប់)'}</p>
    </div>

    <div>
      <p class="section-label font-moul">ក- របៀបវារៈប្រជុំ៖</p>
      <div class="item-list">
        ${meeting.agendas.map((agenda, i) => `
          <div><strong class="font-moul" style="font-size:12px;">${toKhmerNumeral(i + 1)}.</strong> ${agenda}</div>
        `).join('')}
      </div>
    </div>

    <div>
      <p class="section-label font-moul">ខ- ដំណើរការប្រជុំ៖</p>
      <div class="item-list">
        ${meeting.processes.map((proc, i) => `
          <div style="margin-bottom:6px;">
            <div><strong class="font-moul" style="font-size:12px;">${toKhmerNumeral(i + 1)}.</strong> ${proc.text}</div>
            ${proc.images && proc.images.length > 0 ? `
              <div class="${
                proc.images.length === 1 
                  ? 'img-collection-1' 
                  : proc.images.length === 3 
                    ? 'img-collection-3' 
                    : 'img-collection-2'
              }">
                ${proc.images.map((img, imgIdx) => `<img src="${img}" alt="សកម្មភាព ${i+1} - ${imgIdx+1}" />`).join('')}
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    </div>

    ${meeting.executiveSummary ? `
      <div class="exec-summary">
        <p class="font-moul" style="font-weight:bold; margin:0 0 6px 0; font-size:14px;">គ- សេចក្តីសង្ខេបកិច្ចប្រជុំ (Executive Summary)៖</p>
        <div>${meeting.executiveSummary}</div>
      </div>
    ` : ''}

    ${meeting.actionItems && meeting.actionItems.length > 0 ? `
      <div style="margin: 15px 0;">
        <p class="font-moul" style="font-weight:bold; margin:0 0 6px 0; font-size:14px;">${meeting.actionTableTitle || 'ឃ- តារាងសេចក្តីសម្រេច & សកម្មភាពអនុវត្តបន្ត (Action Plan)៖'}</p>
        <table class="att-table" style="width:100%;">
          <thead>
            <tr>
              <th style="width:35px;">${meeting.actionTableHeaders?.col1 || 'ល.រ'}</th>
              <th>${meeting.actionTableHeaders?.col2 || 'សកម្មភាព / កិច្ចការ'}</th>
              <th>${meeting.actionTableHeaders?.col3 || 'អ្នកទទួលខុសត្រូវ'}</th>
              <th style="width:85px;">${meeting.actionTableHeaders?.col4 || 'កាលកំណត់'}</th>
              <th>${meeting.actionTableHeaders?.col5 || 'លទ្ធផលរំពឹងទុក'}</th>
              <th style="width:85px;">${meeting.actionTableHeaders?.col6 || 'ស្ថានភាព'}</th>
            </tr>
          </thead>
          <tbody>
            ${meeting.actionItems.map((item, aIdx) => `
              <tr>
                <td style="text-align:center; font-weight:bold;">${toKhmerNumeral(aIdx + 1)}</td>
                <td><strong>${item.task}</strong></td>
                <td>${item.responsiblePerson}</td>
                <td style="text-align:center;">${item.deadline}</td>
                <td>${item.expectedOutput}</td>
                <td style="text-align:center;">${item.status || 'កំពុងអនុវត្ត'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    ` : ''}

    ${meeting.referenceDocuments && meeting.referenceDocuments.length > 0 ? `
      <div style="margin: 15px 0;">
        <p class="font-moul" style="font-weight:bold; margin:0 0 6px 0; font-size:14px;">ង- ឯកសារយោង & ឧបសម្ព័ន្ធភ្ជាប់ (References & Attachments)៖</p>
        <ul style="margin: 4px 0 0 18px; padding: 0; font-size:13px; color:#1e293b;">
          ${meeting.referenceDocuments.map((doc, dIdx) => `
            <li style="margin-bottom: 4px;">
              <strong>${doc.title || doc.fileName}</strong> 
              ${doc.note ? `<em>(${doc.note})</em>` : ''} 
              ${doc.fileSize ? `<span style="color:#64748b; font-size:11px;">- [${doc.fileType.toUpperCase()}, ${doc.fileSize}]</span>` : ''}
            </li>
          `).join('')}
        </ul>
      </div>
    ` : ''}

    <div class="content-text" style="margin-top:15px;">
      ${meeting.conclusionText || 'អង្គប្រជុំនេះ បានបញ្ចប់នៅវេលាម៉ោងសមគួរ នាថ្ងៃខែឆ្នាំដដែល ក្រោមបរិយាកាសរីករាយ និងស្និទ្ធស្នាលក្រៃលែង។'}
    </div>

    <div class="signature-grid">
      <div>
        <p style="font-size:12px; color:#64748b; font-style:italic; margin:0 0 3px 0;">បានឃើញ និងឯកភាព</p>
        <p class="font-moul" style="font-size:13px; margin:0;">ប្រធានអង្គប្រជុំ / នាយិកាសាលា</p>
        <div class="sig-img-container">
          ${meeting.attendees[0]?.signatureData?.startsWith('data:image') 
            ? `<img src="${meeting.attendees[0].signatureData}" alt="ហត្ថលេខា" />` 
            : `<span style="color:#94a3b8; font-size:11px;">ហត្ថលេខា & ត្រា</span>`}
        </div>
      </div>
      <div>
        <p class="font-moul" style="font-size:13px; margin:0;">អ្នកធ្វើកំណត់ហេតុ</p>
        <div class="sig-img-container">
          ${meeting.attendees[1]?.signatureData?.startsWith('data:image') 
            ? `<img src="${meeting.attendees[1].signatureData}" alt="ហត្ថលេខា" />` 
            : `<span style="color:#94a3b8; font-size:11px;">ហត្ថលេខា</span>`}
        </div>
        <p class="font-moul" style="font-weight:bold; font-size:13px; margin:0;">${meeting.preparerName || meeting.recorderName || 'លោក អ៊ុន ប៊ុនទុង'}</p>
      </div>
    </div>
  </div>

  <!-- PAGE 2: ATTENDANCE SHEET -->
  <div class="page">
    <div style="text-align: center; margin-bottom: 25px;">
      <h1 class="font-moul" style="font-size:15px; margin:0 0 2px 0;">ព្រះរាជាណាចក្រកម្ពុជា</h1>
      <h2 class="font-moul" style="font-size:13px; margin:0 0 4px 0;">ជាតិ សាសនា ព្រះមហាក្សត្រ</h2>
      <div style="font-size:12px;">𖣘𖣘𖣘𖣘𖣘</div>
    </div>
    <div style="text-align: left; margin-bottom: 15px;">
      <p class="font-moul" style="font-size:13px; margin:0 0 2px 0;">${meeting.schoolName || 'សាលាបឋមសិក្សា រោគ'}</p>
    </div>

    <div class="title-section" style="margin: 15px 0;">
      <h2 class="font-moul" style="font-size:16px;">បញ្ជីវត្តមានអ្នកចូលរួមប្រជុំ</h2>
      <p class="font-moul sub" style="font-size:13px; margin:4px 0 2px 0;">ស្តីពី</p>
      <p class="font-moul" style="font-size:14px; margin:0; color:#1e1b4b;">${meeting.topic}</p>
    </div>

    ${meeting.attendanceDateLocation ? `
      <div style="text-align: justify; text-indent: 32px; line-height: 1.8; font-size: 13.5px; color: #1e293b; margin-bottom: 15px;">
        ${meeting.attendanceDateLocation}
      </div>
    ` : ''}

    <table class="attendance">
      <thead>
        <tr class="font-moul" style="font-size:11.5px; text-align:center;">
          <th style="width:35px;">ល.រ</th>
          <th>គោត្តនាម និងនាម</th>
          <th style="width:45px;">ភេទ</th>
          <th>ភារកិច្ច / តួនាទី</th>
          <th>អង្គភាព / ស្ថាប័ន</th>
          <th>លេខទូរស័ព្ទ</th>
          <th style="width:90px;">ហត្ថលេខា</th>
          <th>ផ្សេងៗ</th>
        </tr>
      </thead>
      <tbody>
        ${meeting.attendees.map((att, i) => `
          <tr>
            <td style="text-align:center; font-family:'Moul'; font-size:11px;">${toKhmerNumeral(i + 1)}</td>
            <td style="font-weight:bold;">${att.name}</td>
            <td style="text-align:center;">${att.gender}</td>
            <td>${att.role}</td>
            <td>${att.organization}</td>
            <td style="text-align:center; font-family:monospace;">${att.phone || '-'}</td>
            <td style="text-align:center;">
              ${att.signatureData?.startsWith('data:image') 
                ? `<img src="${att.signatureData}" style="max-height:35px; max-width:80px; object-contain;" />` 
                : `<span style="font-size:10px; color:#64748b; font-style:italic;">${att.signatureData || 'ឌីជីថល'}</span>`}
            </td>
            <td style="text-align:center;">${att.remarks || '-'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div class="signature-grid" style="margin-top:30px;">
      <div>
        <p style="font-size:12px; color:#64748b; font-style:italic; margin:0 0 3px 0;">បានឃើញ និងពិនិត្យត្រឹមត្រូវ</p>
        <p class="font-moul" style="font-size:13px; margin:0;">ប្រធានអង្គប្រជុំ</p>
        <div class="sig-img-container">
          ${meeting.attendees[0]?.signatureData?.startsWith('data:image') 
            ? `<img src="${meeting.attendees[0].signatureData}" alt="ហត្ថលេខា" />` 
            : `<span style="color:#94a3b8; font-size:11px;">ហត្ថលេខា & ត្រា</span>`}
        </div>
      </div>
      <div>
        <p class="font-moul" style="font-size:13px; margin:0;">អ្នកស្រង់វត្តមាន</p>
        <div class="sig-img-container">
          ${meeting.attendees[1]?.signatureData?.startsWith('data:image') 
            ? `<img src="${meeting.attendees[1].signatureData}" alt="ហត្ថលេខា" />` 
            : `<span style="color:#94a3b8; font-size:11px;">ហត្ថលេខា</span>`}
        </div>
        <p class="font-moul" style="font-weight:bold; font-size:13px; margin:0;">${meeting.preparerName || meeting.recorderName || 'លោក អ៊ុន ប៊ុនទុង'}</p>
      </div>
    </div>
  </div>

  <!-- ATTACHED REFERENCE DOCUMENTS (A4 Pages) -->
  ${meeting.referenceDocuments && meeting.referenceDocuments.length > 0 ? meeting.referenceDocuments.map((doc, dIdx) => `
    <div class="page" style="page-break-before: always;">
      <div style="border-bottom: 2px solid #b45309; padding-bottom: 8px; margin-bottom: 20px;">
        <span class="font-moul" style="font-size:11px; background:#fef3c7; color:#92400e; padding:3px 8px; border-radius:4px; border:1px solid #fde68a;">
          ឧបសម្ព័ន្ធភ្ជាប់ (សន្លឹក A4 ទី ${toKhmerNumeral(dIdx + 1)})
        </span>
        <h2 class="font-moul" style="font-size:15px; margin:8px 0 2px 0; color:#0f172a;">${doc.title || doc.fileName}</h2>
        ${doc.note ? `<p style="font-size:12px; color:#475569; font-style:italic; margin:4px 0 0 0;">${doc.note}</p>` : ''}
      </div>

      ${doc.fileData && (doc.fileType === 'image' || doc.fileData.startsWith('data:image')) ? `
        <div style="text-align:center; margin-top:15px;">
          <img src="${doc.fileData}" style="max-width:100%; border-radius:8px; border:1px solid #cbd5e1; box-shadow:0 4px 10px rgba(0,0,0,0.05);" alt="${doc.title}" />
        </div>
      ` : `
        <div style="padding:40px; border:1px solid #cbd5e1; border-radius:8px; text-align:center; background:#f8fafc; margin-top:15px;">
          <p class="font-moul" style="font-size:14px; color:#1e293b;">${doc.title || doc.fileName}</p>
          <p style="color:#64748b; font-size:12px; margin-top:6px;">ប្រភេទឯកសារ៖ ${doc.fileType.toUpperCase()} ${doc.fileSize ? `(${doc.fileSize})` : ''}</p>
        </div>
      `}
    </div>
  `).join('') : ''}

</body>
</html>
  `;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportMeetingToJson(meeting: MeetingReport) {
  const filename = `ទិន្នន័យកំណត់ហេតុ_${meeting.meetingId}.json`;
  const jsonStr = JSON.stringify(meeting, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
