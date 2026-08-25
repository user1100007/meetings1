import { MeetingReport, MeetingTemplateMeta } from './types';

export const MEETING_TEMPLATES_META: MeetingTemplateMeta[] = [
  {
    id: 'meeting_1',
    meetingNumber: 1,
    label: 'កិច្ចប្រជុំលើកទី ១',
    title: 'ការបង្កើត និងធ្វើបច្ចុប្បន្នកម្មសមាសភាពគណៈកម្មការគ្រប់គ្រងសាលារៀន (គ.គ.ស.)',
    shortDescription: 'បង្កើត និងធ្វើបច្ចុប្បន្នកម្មសមាសភាព គ.គ.ស. ផ្សព្វផ្សាយលិខិតលេខ ៤១ និង ៤៩',
    quarter: 'ដើមឆ្នាំសិក្សា',
    recommendedMonth: 'ខែធ្នូ'
  },
  {
    id: 'meeting_2',
    meetingNumber: 2,
    label: 'កិច្ចប្រជុំលើកទី ២',
    title: 'ការរៀបចំ និងអនុម័តផែនការអភិវឌ្ឍន៍សាលារៀន (SIP) និងផែនការប្រតិបត្តិប្រចាំឆ្នាំ (AIP)',
    shortDescription: 'ពិនិត្យ និងអនុម័តផែនការ SIP (៣-៥ឆ្នាំ) និងផែនការប្រតិបត្តិ AIP',
    quarter: 'ត្រីមាសទី១',
    recommendedMonth: 'ខែមករា'
  },
  {
    id: 'meeting_3',
    meetingNumber: 3,
    label: 'កិច្ចប្រជុំលើកទី ៣',
    title: 'ការតាមដានការអនុវត្តផែនការ និងការគ្រប់គ្រងហិរញ្ញវត្ថុ/ថវិកាសាលា ត្រីមាសទី១',
    shortDescription: 'ត្រួតពិនិត្យវឌ្ឍនភាពការងារបង្រៀន និងចំណូល-ចំណាយថវិកាសាលា (PB)',
    quarter: 'ត្រីមាសទី១',
    recommendedMonth: 'ខែមីនា'
  },
  {
    id: 'meeting_4',
    meetingNumber: 4,
    label: 'កិច្ចប្រជុំលើកទី ៤',
    title: 'ការវាយតម្លៃលទ្ធផលការសិក្សារបស់សិស្ស ឆមាសទី១ និងទិសដៅឆមាសទី២',
    shortDescription: 'បូកសរុបពិន្ទុឆមាសទី១ កំណត់សិស្សរៀនយឺត និងរៀបចំវិធានការបង្រៀនបំប៉ន',
    quarter: 'ត្រីមាសទី២',
    recommendedMonth: 'ខែមេសា'
  },
  {
    id: 'meeting_5',
    meetingNumber: 5,
    label: 'កិច្ចប្រជុំលើកទី ៥',
    title: 'ការត្រួតពិនិត្យការអនុវត្តថវិកា ហេដ្ឋារចនាសម្ព័ន្ធ បរិស្ថាន និងអនាម័យសាលារៀន',
    shortDescription: 'ពិនិត្យចំណាយត្រីមាសទី៣ ការកែលម្អបន្ទប់រៀន បន្ទប់ទឹក និងសួនជីវចម្រុះ',
    quarter: 'ត្រីមាសទី៣',
    recommendedMonth: 'ខែមិថុនា'
  },
  {
    id: 'meeting_6',
    meetingNumber: 6,
    label: 'កិច្ចប្រជុំលើកទី ៦',
    title: 'ការវាយតម្លៃលទ្ធផលចុងឆ្នាំសិក្សា និងការត្រៀមរៀបចំឆ្នាំសិក្សាថ្មី',
    shortDescription: 'បូកសរុបលទ្ធផលសិស្សឡើងថ្នាក់ រៀបចំពិធីចែករង្វាន់ និងយុទ្ធនាការចុះឈ្មោះចូលរៀន',
    quarter: 'ចុងឆ្នាំសិក្សា',
    recommendedMonth: 'ខែសីហា'
  },
  {
    id: 'meeting_7',
    meetingNumber: 7,
    label: 'កិច្ចប្រជុំលើកទី ៧',
    title: 'មហាសន្និបាត ឬសន្និបាតបូកសរុបការងារប្រចាំឆ្នាំ គណនេយ្យភាពសង្គម និងកៀរគរធនធានពីសហគមន៍',
    shortDescription: 'សន្និបាតប្រចាំឆ្នាំ បង្ហាញតម្លាភាពហិរញ្ញវត្ថុជូនសហគមន៍ និងកៀរគរធនធាន',
    quarter: 'បូកសរុបប្រចាំឆ្នាំ',
    recommendedMonth: 'ខែតុលា'
  }
];

const defaultSignature1 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAWgAAACgCAYAAAAhKfa4AAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAABaKADAAQAAAABAAAAoAAAAABJZE7qAAAY2UlEQVR4Ae2de2wcx33HZ/aOEknTsWyLqiKRRzl+1JFrt05jRyJVR07iNMkfDZrAQRG0MYr8WbRo7IqykxYg0MI2qdZo0f5RICgMpY8EMWoULZq0cuoorkgpduIkSq06qpxSfDiq5YdsUSJF8nb6++3e3M7t7R1377GPu+/a1M7OzM7jM3ff++1vZ2eFwAYCIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIJBFAjKLjUabQSBrBAqjk0qI6q+bzKtPn33u4NNZ6w/aGw8BK55qUAsIdC+BwuhUoDgzEbUuv9q9ZNDzjQhAoDcihHQQaIJAYe/US/VPV5vqpyO1mwlAoLt59NH39hOQcotXiXx1bmZc8p8R5wURAgEfAQi0DwgOQSAeAuT1KG07Rycf0mHsQcAkAIE2aSAMAjERUEqWFTqn5BdiqhbVZIwABDpjA4bmdggBqa7onpBWX6/D2IOASQACbdJAGARAAARSRAACnaLBQFNAAARAwCQAgTZpIAwCLSegVrwizbAXixAI1CIAga5FBvEgAAIgkDABCHTCA4DqQQAEQKAWAQh0LTKIBwEQAIGECUCgEx4AVA8CIAACtQhAoGuRQTwItJWA7DGKt40wgiBQJgCBLqNAAARiJKBE+btHzxRejLFmVJUhAuUPSYbajKaCQAcQUN6CSZb1TAd0CF1oAwEIdBugokgQ2IiA9ORZzE0f+K2N8iO9OwlAoLtz3NHrxAkYCp14W9CAtBKAQKd1ZNCuTiFwyeiIGTaiEQSBYAIQ6GAuiAUBEACBxAlAoBMfAjQABEAABIIJQKCDuSAWBGIiUF63P6b6UE2WCECgszRaaGtHECiM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';

const defaultSignature2 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAWgAAACgCAYAAAAhKfa4AAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAABaKADAAQAAAABAAAAoAAAAABJZE7qAAAe5UlEQVR4Ae2dC5AlVXnHz+k7uwuzu8DCAsrO3NkFBMSoiwi7M4M8rBIfkZQxbmKiBEiloKKRRGRndpUkY8JrZhCNShIsU/iIpRGiVtQImJKHOzPLYwU0CoLC7J0ZEHm7O7s7s3P75H+6+/Tt+5x757768e+qmXP6dPfpr3+n7/+e+52vTwvBhQRIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIYGkE5NIOC8dRXb03HmrJhX3aGlt1dE5PXLE/HJbRChIgARKon4BVfxXtqwHiPG3OHsybMqYkQAIkEGUCkRZoIaXtww/m/UJmSIAESCC6BKIt0NHlTstJgARIYFECFOhFEXEHEiABEmgPAQp0e7jzrCRAAiSwKAEK9KKIFt8h3Tdq67/F9+QeJEACJFA9AQp09axK7pnuHfm5EArhikqm+0eeKbkTC0mABEhgCQQo0EuAFjxk36x6r7+uxKv8PDMkQAIkUCcBCnSdAJ//6eAvg1WsfcPwycF15kmABEhgqQQo0Esll3+c/wRj5yr5yfxNXCMBEiCBpRGgQC+NW8FR8iG/QIouP88MCZAACdRBINoCrVTO/mC+DiBLPDQXwaGkWmIdPIwESIAE8gjkBC6vOCorci5naTCfK2WOBEiABKJKoCOqhnt2B3urwXzELyse5nf3j/xA2OLtOgRROvMm6n9KKPzKwPrejn3i/U8+PPA/8bhaXgUJNJ5A1AW68URY45IIdPcN3w7tfRsOtjw11loshC/MplqJOa6c0tULneL7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';

export const DEFAULT_MEETINGS_DATA: Record<string, MeetingReport> = {
  meeting_1: {
    meetingId: 'meeting_1',
    district: 'រដ្ឋបាលស្រុកភ្នំស្រុក',
    schoolName: 'សាលាបឋមសិក្សា រោគ',
    topic: 'ការបង្កើត និងធ្វើបច្ចុប្បន្នកម្មសមាសភាពគណៈកម្មការគ្រប់គ្រងសាលារៀន (គ.គ.ស.)',
    date: '2025-12-08',
    time: '8:00 AM',
    location: 'សាលាបឋមសិក្សា រោគ',
    leaderName: 'លោកស្រី សុខ សារើន',
    leaderRole: 'នាយិកាសាលា / ប្រធានអង្គប្រជុំ',
    recorderName: 'លោក អ៊ុន ប៊ុនទុង',
    recorderRole: 'លេខាកត់ត្រា',
    introText: 'ឆ្នាំពីរពាន់ម្ភៃប្រាំ ខែធ្នូ ថ្ងៃទីប្រាំបី ត្រូវនឹងថ្ងៃច័ន្ទ បួនរោច ខែកត្តិក ឆ្នាំម្សាញ់ សប្តស័ក ពុទ្ធសករាជ ពីរពាន់ប្រាំរយហុកសិបប្រាំបួន វេលាម៉ោងប្រាំបី និងសូន្យនាទី(៨:០០) នៅសាលាបឋមសិក្សា រោគ បានបើកកិច្ចប្រជុំមួយដើម្បី ការបង្កើត និងធ្វើបច្ចុប្បន្នកម្មសមាសភាពគណៈកម្មការគ្រប់គ្រងសាលារៀន (គ.គ.ស.) ដែលដឹកនាំដោយលោកស្រី សុខ សារើន (នាយិកាសាលា) ជាប្រធានអង្គប្រជុំ។',
    participantsText: '-(បញ្ជីវត្តមានជូនភ្ជាប់)',
    agendas: [
      'ផ្សព្វផ្សាយខ្លឹមសារលិខិតលេខ ៤១ និងលេខ ៤៩ ស្តីពីការរៀបចំ គ.គ.ស.',
      'ការបោះឆ្នោតជ្រើសរើស និងបែងចែកតួនាទីភារកិច្ចសមាជិក គ.គ.ស.',
      'កិច្ចព្រមព្រៀងអនុម័តដោយប្រធានអង្គប្រជុំ',
      'សេចក្តីសម្រេច និងទិសដៅការងារបន្ត'
    ],
    processes: [
      { text: 'អានលិខិតលេខ ៤១ និងលេខ ៤៩ ដោយប្រធានអង្គប្រជុំ', images: [] },
      { text: 'ការបោះឆ្នោត និងបង្ហាញលទ្ធផល (អង្គប្រជុំទាំងមូល)', images: [] },
      { text: 'ចុះកិច្ចព្រមព្រៀងរួមគ្នានិងការអនុម័តលើឯកសារ', images: [] }
    ],
    executiveSummary: 'សេចក្តីសង្ខេបកិច្ចប្រជុំ (Executive Summary)\n* ប្រធានបទ៖ ការបង្កើត និងធ្វើបច្ចុប្បន្នកម្មសមាសភាពគណៈកម្មការគ្រប់គ្រងសាលារៀន (គ.គ.ស.)\n* កាលបរិច្ឆេទ និងទីតាំង៖ ថ្ងៃច័ន្ទ ទី០៨ ខែធ្នូ ឆ្នាំ២០២៥ (វេលាម៉ោង ៨:០០ នាទីព្រឹក) នៅសាលាបឋមសិក្សារោគ\n* ប្រធានអង្គប្រជុំ៖ លោកស្រី សុខ សារើន (នាយិកាសាលាបឋមសិក្សារោគ)\n\nលទ្ធផល និងសេចក្តីសម្រេចសំខាន់ៗ៖\n១. ការផ្សព្វផ្សាយលិខិតបទដ្ឋាន៖ អង្គប្រជុំបានស្តាប់ និងយល់ជ្រាបយ៉ាងច្បាស់នូវខ្លឹមសារលិខិតណែនាំលេខ ៤១ និងលេខ ៤៩ ដែលអាន និងពន្យល់ដោយប្រធានអង្គប្រជុំ។\n២. ការបោះឆ្នោត និងប្រកាសលទ្ធផល៖ បានដំណើរការបោះឆ្នោតជ្រើសរើស និងធ្វើបច្ចុប្បន្នកម្មសមាសភាព គ.គ.ស. ថ្មី ដោយប្រកបដោយតម្លាភាព ព្រមទាំងបានប្រកាសលទ្ធផលជាផ្លូវការជូនអង្គប្រជុំទាំងមូល។\n៣. ការអនុម័ត និងទិសដៅអនុវត្ត៖ ប្រធានអង្គប្រជុំ និងសមាជិកទាំងអស់បានឯកភាព ចុះកិច្ចព្រមព្រៀងរួម និងអនុម័តលើឯកសារពាក់ព័ន្ធ ដើម្បីទុកជាមូលដ្ឋានក្នុងការអនុវត្តទិសដៅការងារបន្តឱ្យមានប្រសិទ្ធភាព។',
    actionTableTitle: 'ឃ- តារាងសមាសភាព និងការបែងចែកភារកិច្ច គ.គ.ស. ថ្មី (Committee Structure)៖',
    actionTableHeaders: {
      col1: 'ល.រ',
      col2: 'មុខតំណែងដើម',
      col3: 'គោត្តនាម និងនាម',
      col4: 'អង្គភាព/ស្ថាប័ន',
      col5: 'តួនាទីក្នុង គ.គ.ស.',
      col6: 'ភារកិច្ចទទួលខុសត្រូវ'
    },
    actionItems: [
      {
        id: 'act-1',
        task: 'ព្រះចៅអធិការ',
        responsiblePerson: 'វឿន លីហ៊ុយ',
        deadline: 'វត្តពោធ៌៍វិន័យរោគ',
        expectedOutput: 'ប្រធានកិត្តិយស',
        status: 'ផ្សព្វផ្សាយផែនការ និងកៀរគរធនធាន'
      },
      {
        id: 'act-2',
        task: 'មេឃុំរោគ',
        responsiblePerson: 'សួស សុជាតិ',
        deadline: 'រដ្ឋបាលឃុំរោគ',
        expectedOutput: 'អនុប្រធានកិត្តិយស',
        status: 'គាំទ្រគោលនយោបាយ និងសន្តិសុខ'
      },
      {
        id: 'act-3',
        task: 'នាយិកាសាលា',
        responsiblePerson: 'សុខ សារើន',
        deadline: 'សាលាបឋមសិក្សារោគ',
        expectedOutput: 'ប្រធាន',
        status: 'ដឹកនាំ និងចាត់ចែងការងារទូទៅ'
      },
      {
        id: 'act-4',
        task: 'គ្រូបង្រៀន',
        responsiblePerson: 'អ៊ុន ប៊ុនទុង',
        deadline: 'សាលាបឋមសិក្សារោគ',
        expectedOutput: 'លេខា',
        status: 'កត់ត្រា និងរៀបចំឯកសារ'
      }
    ],
    referenceDocuments: [
      {
        id: 'ref-1',
        title: 'លិខិតលេខ ៤១ អយក.សរ',
        fileName: 'Letter_41_MoEYS.pdf',
        fileType: 'pdf',
        fileSize: '1.2 MB',
        note: 'លិខិតណែនាំស្តីពីការរៀបចំគណៈកម្មការគ្រប់គ្រងសាលារៀន'
      },
      {
        id: 'ref-2',
        title: 'លិខិតលេខ ៤៩ អយក.សរ',
        fileName: 'Letter_49_Guidelines.pdf',
        fileType: 'pdf',
        fileSize: '950 KB',
        note: 'សេចក្តីណែនាំបន្ថែមស្តីពីការបែងចែកតួនាទីភារកិច្ច'
      }
    ],
    conclusionText: 'អង្គប្រជុំនេះ បានបញ្ចប់នៅវេលាម៉ោងសមគួរ នាថ្ងៃខែឆ្នាំដដែល ក្រោមបរិយាកាសរីករាយ និងស្និទ្ធស្នាលក្រៃលែង។',
    checkerName: 'លោកស្រី សុខ សារើន',
    preparerName: 'លោក អ៊ុន ប៊ុនទុង',
    attendanceDateLocation: 'ថ្ងៃទី២៥ ខែសីហា ឆ្នាំ២០២៦ ត្រូវនឹងថ្ងៃអង្គារ ១២កើត ខែស្រាពណ៍ ឆ្នាំមមី អដ្ឋស័ក ពុទ្ធសករាជ ២៥៧០ នៅក្នុងបរិវេណសាលាបឋមសិក្សា រោគ',
    attendees: [
      {
        id: '1',
        name: 'សុខ សារើន',
        gender: 'ស្រី',
        role: 'ប្រធានអង្គប្រជុំ',
        organization: 'សាលាបឋមសិក្សា រោគ',
        phone: '០៨៩៦៦៣៩៦៦',
        signatureType: 'image',
        signatureData: defaultSignature1,
        remarks: 'ចូលរួមដឹកនាំអង្គប្រជុំ'
      },
      {
        id: '2',
        name: 'អ៊ុន ប៊ុនទុង',
        gender: 'ប្រុស',
        role: 'លេខាកត់ត្រា',
        organization: 'សាលាបឋមសិក្សា រោគ',
        phone: '០៩២២៧២០០៥',
        signatureType: 'image',
        signatureData: defaultSignature2,
        remarks: 'កត់ត្រាកំណត់ហេតុ'
      },
      {
        id: '3',
        name: 'សូ គិន',
        gender: 'ប្រុស',
        role: 'សមាសភាពគ.គ.ស.',
        organization: 'សហគមន៍',
        phone: '០៩៧៥៦០៩០២',
        signatureType: 'text',
        signatureData: 'ឌីជីថល (បានចុះហត្ថលេខា)',
        remarks: 'ចូលរួមពេញលេញ'
      },
      {
        id: '4',
        name: 'ផាត សាមួយ',
        gender: 'ស្រី',
        role: 'សមាសភាពគ.គ.ស.',
        organization: 'សហគមន៍',
        phone: '-',
        signatureType: 'text',
        signatureData: 'ឌីជីថល (បានចុះហត្ថលេខា)',
        remarks: 'ចូលរួមពេញលេញ'
      }
    ]
  },
  meeting_2: {
    meetingId: 'meeting_2',
    district: 'រដ្ឋបាលស្រុកភ្នំស្រុក',
    schoolName: 'សាលាបឋមសិក្សា រោគ',
    topic: 'ការរៀបចំ និងអនុម័តផែនការអភិវឌ្ឍន៍សាលារៀន (SIP) និងផែនការប្រតិបត្តិប្រចាំឆ្នាំ (AIP)',
    date: '2026-01-15',
    time: '8:00 AM',
    location: 'សាលាបឋមសិក្សា រោគ',
    leaderName: 'លោកស្រី សុខ សារើន',
    leaderRole: 'នាយិកាសាលា / ប្រធានអង្គប្រជុំ',
    recorderName: 'លោក អ៊ុន ប៊ុនទុង',
    recorderRole: 'លេខាកត់ត្រា',
    introText: 'ឆ្នាំពីរពាន់ម្ភៃប្រាំមួយ ខែមករា ថ្ងៃទីដប់ប្រាំ ត្រូវនឹងថ្ងៃព្រហស្បតិ៍ វេលាម៉ោងប្រាំបី និងសូន្យនាទី(៨:០០) នៅសាលាបឋមសិក្សា រោគ បានបើកកិច្ចប្រជុំមួយដើម្បី ការរៀបចំ និងអនុម័តផែនការអភិវឌ្ឍន៍សាលារៀន (SIP) និងផែនការប្រតិបត្តិប្រចាំឆ្នាំ (AIP) ដែលដឹកនាំដោយលោកស្រី សុខ សារើន ជាប្រធានអង្គប្រជុំ។',
    participantsText: '-(បញ្ជីវត្តមានជូនភ្ជាប់)',
    agendas: [
      'ត្រួតពិនិត្យតម្រូវការអាទិភាព និងលទ្ធផលស្ទង់មតិសហគមន៍',
      'ការពិនិត្យ និងកែសម្រួលសេចក្តីព្រាងផែនការអភិវឌ្ឍន៍សាលារៀន (SIP ៣ឆ្នាំ)',
      'ការរៀបចំផែនការប្រតិបត្តិប្រចាំឆ្នាំ (AIP) សម្រាប់ឆ្នាំសិក្សាថ្មី',
      'ការអនុម័ត និងចុះហត្ថលេខាលើឯកសារ SIP និង AIP រួមគ្នា'
    ],
    processes: [
      { text: 'បទបង្ហាញស្តីពីសេចក្តីព្រាង SIP និង AIP ដោយនាយិកាសាលា', images: [] },
      { text: 'ការពិភាក្សាជាក្រុម និងការផ្តល់ធាតុចូលពីតំណាងសហគមន៍ អាជ្ញាធរ និងលោកគ្រូ-អ្នកគ្រូ', images: [] },
      { text: 'ការបោះឆ្នោតអនុម័តជាឯកច្ឆន្ទ និងការចុះហត្ថលេខាលើឯកសារផែនការ', images: [] }
    ],
    executiveSummary: 'សេចក្តីសង្ខេបកិច្ចប្រជុំ (Executive Summary)\n* ប្រធានបទ៖ ការរៀបចំ និងអនុម័តផែនការអភិវឌ្ឍន៍សាលារៀន (SIP) និងផែនការប្រតិបត្តិប្រចាំឆ្នាំ (AIP)\n* កាលបរិច្ឆេទ និងទីតាំង៖ ថ្ងៃព្រហស្បតិ៍ ទី១៥ ខែមករា ឆ្នាំ២០២៦ នៅសាលាបឋមសិក្សារោគ\n\nលទ្ធផល និងសេចក្តីសម្រេចសំខាន់ៗ៖\n១. បានឯកភាពលើចក្ខុវិស័យ និងសកម្មភាពអាទិភាពក្នុងផែនការ SIP ៣ឆ្នាំ ដោយផ្តោតលើគុណភាពនៃការរៀននិងបង្រៀន។\n២. បានអនុម័តផែនការប្រតិបត្តិប្រចាំឆ្នាំ (AIP) ជាមួយកញ្ចប់ថវិកាបែងចែកច្បាស់លាស់។\n៣. តំណាងសហគមន៍ និងអាជ្ញាធរបានប្តេជ្ញាគាំទ្រយ៉ាងពេញទំហឹងទាំងធនធានសម្ភារ និងកម្លាំងពលកម្ម។',
    conclusionText: 'អង្គប្រជុំបានបញ្ចប់នៅវេលាម៉ោង ១១:៣០ នាទីព្រឹក នាថ្ងៃខែឆ្នាំដដែល ប្រកបដោយភាពជោគជ័យ។',
    checkerName: 'លោកស្រី សុខ សារើន',
    preparerName: 'លោក អ៊ុន ប៊ុនទុង',
    attendanceDateLocation: 'ឆ្នាំពីរពាន់ម្ភៃប្រាំមួយ ខែមករា ថ្ងៃទីដប់ប្រាំ នៅសាលាបឋមសិក្សា រោគ',
    attendees: [
      {
        id: '1',
        name: 'សុខ សារើន',
        gender: 'ស្រី',
        role: 'ប្រធានអង្គប្រជុំ',
        organization: 'សាលាបឋមសិក្សា រោគ',
        phone: '០៨៩៦៦៣៩៦៦',
        signatureType: 'image',
        signatureData: defaultSignature1,
        remarks: 'ដឹកនាំកិច្ចប្រជុំ'
      },
      {
        id: '2',
        name: 'អ៊ុន ប៊ុនទុង',
        gender: 'ប្រុស',
        role: 'លេខាកត់ត្រា',
        organization: 'សាលាបឋមសិក្សា រោគ',
        phone: '០៩២២៧២០០៥',
        signatureType: 'image',
        signatureData: defaultSignature2,
        remarks: 'កត់ត្រាកំណត់ហេតុ'
      },
      {
        id: '3',
        name: 'សូ គិន',
        gender: 'ប្រុស',
        role: 'សមាសភាពគ.គ.ស.',
        organization: 'សហគមន៍',
        phone: '០៩៧៥៦០៩០២',
        signatureType: 'text',
        signatureData: 'ឌីជីថល (បានចុះហត្ថលេខា)',
        remarks: 'ចូលរួមពេញលេញ'
      }
    ]
  },
  meeting_3: {
    meetingId: 'meeting_3',
    district: 'រដ្ឋបាលស្រុកភ្នំស្រុក',
    schoolName: 'សាលាបឋមសិក្សា រោគ',
    topic: 'ការតាមដានការអនុវត្តផែនការ និងការគ្រប់គ្រងហិរញ្ញវត្ថុ/ថវិកាសាលា ត្រីមាសទី១',
    date: '2026-03-20',
    time: '8:00 AM',
    location: 'សាលាបឋមសិក្សា រោគ',
    leaderName: 'លោកស្រី សុខ សារើន',
    leaderRole: 'នាយិកាសាលា / ប្រធានអង្គប្រជុំ',
    recorderName: 'លោក អ៊ុន ប៊ុនទុង',
    recorderRole: 'លេខាកត់ត្រា',
    introText: 'ឆ្នាំពីរពាន់ម្ភៃប្រាំមួយ ខែមីនា ថ្ងៃទីម្ភៃ ត្រូវនឹងថ្ងៃសុក្រ វេលាម៉ោងប្រាំបី និងសូន្យនាទី(៨:០០) នៅសាលាបឋមសិក្សា រោគ បានបើកកិច្ចប្រជុំមួយដើម្បី ការតាមដានការអនុវត្តផែនការ និងការគ្រប់គ្រងហិរញ្ញវត្ថុ/ថវិកាសាលា ត្រីមាសទី១។',
    participantsText: '-(បញ្ជីវត្តមានជូនភ្ជាប់)',
    agendas: [
      'របាយការណ៍វឌ្ឍនភាពការងារបង្រៀន និងរៀនប្រចាំត្រីមាសទី១',
      'របាយការណ៍ចំណូល-ចំណាយថវិកាប្រតិបត្តិការសាលា (PB) និងថវិកាសហគមន៍',
      'ការពិនិត្យបញ្ហាប្រឈម និងវិធានការដោះស្រាយសម្រាប់ការអនុវត្តបន្ត',
      'ទិសដៅការងារត្រីមាសទី២'
    ],
    processes: [
      { text: 'បទបង្ហាញរបាយការណ៍ហិរញ្ញវត្ថុ និងគណនេយ្យភាពដោយបេឡាធិការសាលា', images: [] },
      { text: 'ការពិនិត្យផ្ទៀងផ្ទាត់បញ្ជីចំណាយ និងវិក្កយបត្រដោយគណៈកម្មការត្រួតពិនិត្យ', images: [] },
      { text: 'ការពិភាក្សាដោះស្រាយលើការខ្វះខាតសម្ភាររៀន និងកែលម្អបរិស្ថាន', images: [] }
    ],
    executiveSummary: 'សេចក្តីសង្ខេបកិច្ចប្រជុំ (Executive Summary)\n* ប្រធានបទ៖ ការតាមដានការអនុវត្តផែនការ និងការគ្រប់គ្រងហិរញ្ញវត្ថុ ត្រីមាសទី១\n\nលទ្ធផល និងសេចក្តីសម្រេចសំខាន់ៗ៖\n១. ការអនុវត្តថវិកា PB ត្រីមាសទី១ សម្រេចបានត្រឹមត្រូវតាមសៀវភៅផែនការ និងមានវិក្កយបត្របញ្ជាក់ច្បាស់លាស់។\n២. សកម្មភាពបង្រៀន និងរៀនដំណើរការល្អ សិស្សមានវត្តមានទៀងទាត់។\n៣. បានឯកភាពបន្តការជួសជុលបន្ទប់ទឹក និងបន្ថែមសៀវភៅអានក្នុងបណ្ណាល័យសម្រាប់ត្រីមាសទី២។',
    conclusionText: 'អង្គប្រជុំបានបញ្ចប់នៅវេលាម៉ោង ១១:០០ នាទីព្រឹក ប្រកបដោយភាពស្និទ្ធស្នាល។',
    checkerName: 'លោកស្រី សុខ សារើន',
    preparerName: 'លោក អ៊ុន ប៊ុនទុង',
    attendanceDateLocation: 'ឆ្នាំពីរពាន់ម្ភៃប្រាំមួយ ខែមីនា ថ្ងៃទីម្ភៃ នៅសាលាបឋមសិក្សា រោគ',
    attendees: [
      {
        id: '1',
        name: 'សុខ សារើន',
        gender: 'ស្រី',
        role: 'ប្រធានអង្គប្រជុំ',
        organization: 'សាលាបឋមសិក្សា រោគ',
        phone: '០៨៩៦៦៣៩៦៦',
        signatureType: 'image',
        signatureData: defaultSignature1,
        remarks: 'ដឹកនាំកិច្ចប្រជុំ'
      },
      {
        id: '2',
        name: 'អ៊ុន ប៊ុនទុង',
        gender: 'ប្រុស',
        role: 'លេខាកត់ត្រា',
        organization: 'សាលាបឋមសិក្សា រោគ',
        phone: '០៩២២៧២០០៥',
        signatureType: 'image',
        signatureData: defaultSignature2,
        remarks: 'កត់ត្រាកំណត់ហេតុ'
      }
    ]
  },
  meeting_4: {
    meetingId: 'meeting_4',
    district: 'រដ្ឋបាលស្រុកភ្នំស្រុក',
    schoolName: 'សាលាបឋមសិក្សា រោគ',
    topic: 'ការវាយតម្លៃលទ្ធផលការសិក្សារបស់សិស្ស ឆមាសទី១ និងទិសដៅឆមាសទី២',
    date: '2026-04-24',
    time: '8:00 AM',
    location: 'សាលាបឋមសិក្សា រោគ',
    leaderName: 'លោកស្រី សុខ សារើន',
    leaderRole: 'នាយិកាសាលា / ប្រធានអង្គប្រជុំ',
    recorderName: 'លោក អ៊ុន ប៊ុនទុង',
    recorderRole: 'លេខាកត់ត្រា',
    introText: 'ឆ្នាំពីរពាន់ម្ភៃប្រាំមួយ ខែមេសា ថ្ងៃទីម្ភៃបួន ត្រូវនឹងថ្ងៃសុក្រ វេលាម៉ោងប្រាំបី និងសូន្យនាទី(៨:០០) នៅសាលាបឋមសិក្សា រោគ បានបើកកិច្ចប្រជុំមួយដើម្បី ការវាយតម្លៃលទ្ធផលការសិក្សារបស់សិស្ស ឆមាសទី១ និងទិសដៅឆមាសទី២។',
    participantsText: '-(បញ្ជីវត្តមានជូនភ្ជាប់)',
    agendas: [
      'របាយការណ៍លទ្ធផលប្រឡងឆមាសទី១ របស់សិស្សគ្រប់កម្រិតថ្នាក់',
      'ការកំណត់អត្តសញ្ញាណសិស្សរៀនយឺត និងសិស្សប្រឈមនឹងការបោះបង់ការសិក្សា',
      'វិធានការបង្រៀនបំប៉នបន្ថែម និងការសហការជាមួយមាតាបិតាសិស្ស',
      'ផែនការសកម្មភាព និងការរៀបចំការរៀននិងបង្រៀនឆមាសទី២'
    ],
    processes: [
      { text: 'រាយការណ៍ស្ថិតិ និងពិន្ទុឆមាសទី១ ដោយតំណាងលោកគ្រូ-អ្នកគ្រូ', images: [] },
      { text: 'ពិភាក្សាពីមូលហេតុអវត្តមាន និងការធ្លាក់ចុះពិន្ទុរបស់សិស្សមួយចំនួន', images: [] },
      { text: 'ឯកភាពគ្នាលើកាលវិភាគបង្រៀនបំប៉នឥតគិតថ្លៃ និងការចុះជួបផ្ទះសិស្ស', images: [] }
    ],
    executiveSummary: 'សេចក្តីសង្ខេបកិច្ចប្រជុំ (Executive Summary)\n* ប្រធានបទ៖ ការវាយតម្លៃលទ្ធផលការសិក្សា ឆមាសទី១\n\nលទ្ធផល និងសេចក្តីសម្រេចសំខាន់ៗ៖\n១. អត្រាសិស្សជាប់មធ្យមភាគឆមាសទី១ សម្រេចបាន ៨៨% នៃសិស្សសរុប។\n២. បានកំណត់អត្តសញ្ញាណសិស្សរៀនយឺតចំនួន ១២នាក់ ដើម្បីរៀបចំការបង្រៀនបំប៉នភាសាខ្មែរ និងគណិតវិទ្យា។\n៣. គណៈកម្មការ គ.គ.ស. និងមេភូមិ នឹងសហការចុះជួបមាតាបិតាសិស្សដែលខ្វះខាត និងអវត្តមានច្រើន។',
    conclusionText: 'អង្គប្រជុំបានបញ្ចប់នៅវេលាម៉ោង ១១:៣០ នាទីព្រឹក ក្រោមបរិយាកាសស្និទ្ធស្នាល។',
    checkerName: 'លោកស្រី សុខ សារើន',
    preparerName: 'លោក អ៊ុន ប៊ុនទុង',
    attendanceDateLocation: 'ឆ្នាំពីរពាន់ម្ភៃប្រាំមួយ ខែមេសា ថ្ងៃទីម្ភៃបួន នៅសាលាបឋមសិក្សា រោគ',
    attendees: [
      {
        id: '1',
        name: 'សុខ សារើន',
        gender: 'ស្រី',
        role: 'ប្រធានអង្គប្រជុំ',
        organization: 'សាលាបឋមសិក្សា រោគ',
        phone: '០៨៩៦៦៣៩៦៦',
        signatureType: 'image',
        signatureData: defaultSignature1,
        remarks: 'ដឹកនាំកិច្ចប្រជុំ'
      },
      {
        id: '2',
        name: 'អ៊ុន ប៊ុនទុង',
        gender: 'ប្រុស',
        role: 'លេខាកត់ត្រា',
        organization: 'សាលាបឋមសិក្សា រោគ',
        phone: '០៩២២៧២០០៥',
        signatureType: 'image',
        signatureData: defaultSignature2,
        remarks: 'កត់ត្រាកំណត់ហេតុ'
      }
    ]
  },
  meeting_5: {
    meetingId: 'meeting_5',
    district: 'រដ្ឋបាលស្រុកភ្នំស្រុក',
    schoolName: 'សាលាបឋមសិក្សា រោគ',
    topic: 'ការត្រួតពិនិត្យការអនុវត្តថវិកា ហេដ្ឋារចនាសម្ព័ន្ធ បរិស្ថាន និងអនាម័យសាលារៀន (ត្រីមាសទី៣)',
    date: '2026-06-18',
    time: '8:00 AM',
    location: 'សាលាបឋមសិក្សា រោគ',
    leaderName: 'លោកស្រី សុខ សារើន',
    leaderRole: 'នាយិកាសាលា / ប្រធានអង្គប្រជុំ',
    recorderName: 'លោក អ៊ុន ប៊ុនទុង',
    recorderRole: 'លេខាកត់ត្រា',
    introText: 'ឆ្នាំពីរពាន់ម្ភៃប្រាំមួយ ខែមិថុនា ថ្ងៃទីដប់ប្រាំបី ត្រូវនឹងថ្ងៃព្រហស្បតិ៍ វេលាម៉ោងប្រាំបី និងសូន្យនាទី(៨:០០) នៅសាលាបឋមសិក្សា រោគ បានបើកកិច្ចប្រជុំមួយដើម្បី ការត្រួតពិនិត្យការអនុវត្តថវិកា ហេដ្ឋារចនាសម្ព័ន្ធ បរិស្ថាន និងអនាម័យសាលារៀន។',
    participantsText: '-(បញ្ជីវត្តមានជូនភ្ជាប់)',
    agendas: [
      'វឌ្ឍនភាពនៃការកែលម្អហេដ្ឋារចនាសម្ព័ន្ធ (បន្ទប់រៀន បន្ទប់ទឹក សួនជីវចម្រុះ)',
      'ការពិនិត្យរបាយការណ៍ចំណាយថវិកាត្រីមាសទី៣',
      'ការលើកកម្ពស់ស្តង់ដាសាលារៀនស្អាត បៃតង និងសុវត្ថិភាព',
      'ការរៀបចំទិសដៅការងារបញ្ចប់ឆ្នាំសិក្សា'
    ],
    processes: [
      { text: 'ចុះត្រួតពិនិត្យជាក់ស្តែងលើទីធ្លាសាលា បន្ទប់ទឹក និងសួនកុមារ', images: [] },
      { text: 'រាយការណ៍ពីស្ថានភាពថវិកាដែលនៅសល់ និងតម្រូវការជួសជុលបន្ទាន់', images: [] },
      { text: 'សមាជិក គ.គ.ស. និងអាជ្ញាធរភូមិ-ឃុំ ឯកភាពជួយកម្លាំងពលកម្មស្ម័គ្រចិត្ត', images: [] }
    ],
    executiveSummary: 'សេចក្តីសង្ខេបកិច្ចប្រជុំ (Executive Summary)\n* ប្រធានបទ៖ ការត្រួតពិនិត្យហេដ្ឋារចនាសម្ព័ន្ធ បរិស្ថាន និងថវិកា\n\nលទ្ធផល និងសេចក្តីសម្រេចសំខាន់ៗ៖\n១. បន្ទប់ទឹកសិស្សានុសិស្សត្រូវបានជួសជុលរួចរាល់ និងមានទឹកស្អាតប្រើប្រាស់គ្រប់គ្រាន់។\n២. បានរៀបចំដាំដើមឈើ និងផ្កាបន្ថែមដើម្បីបង្កើតបរិស្ថានបៃតងស្រស់ស្អាត។\n៣. ថវិកាចំណាយត្រីមាសទី៣ ត្រូវបានអនុម័តដោយតម្លាភាព។',
    conclusionText: 'អង្គប្រជុំបានបញ្ចប់នៅវេលាម៉ោង ១១:០០ នាទីព្រឹក នាថ្ងៃដដែល។',
    checkerName: 'លោកស្រី សុខ សារើន',
    preparerName: 'លោក អ៊ុន ប៊ុនទុង',
    attendanceDateLocation: 'ឆ្នាំពីរពាន់ម្ភៃប្រាំមួយ ខែមិថុនា ថ្ងៃទីដប់ប្រាំបី នៅសាលាបឋមសិក្សា រោគ',
    attendees: [
      {
        id: '1',
        name: 'សុខ សារើន',
        gender: 'ស្រី',
        role: 'ប្រធានអង្គប្រជុំ',
        organization: 'សាលាបឋមសិក្សា រោគ',
        phone: '០៨៩៦៦៣៩៦៦',
        signatureType: 'image',
        signatureData: defaultSignature1,
        remarks: 'ដឹកនាំកិច្ចប្រជុំ'
      },
      {
        id: '2',
        name: 'អ៊ុន ប៊ុនទុង',
        gender: 'ប្រុស',
        role: 'លេខាកត់ត្រា',
        organization: 'សាលាបឋមសិក្សា រោគ',
        phone: '០៩២២៧២០០៥',
        signatureType: 'image',
        signatureData: defaultSignature2,
        remarks: 'កត់ត្រាកំណត់ហេតុ'
      }
    ]
  },
  meeting_6: {
    meetingId: 'meeting_6',
    district: 'រដ្ឋបាលស្រុកភ្នំស្រុក',
    schoolName: 'សាលាបឋមសិក្សា រោគ',
    topic: 'ការវាយតម្លៃលទ្ធផលចុងឆ្នាំសិក្សា និងការត្រៀមរៀបចំឆ្នាំសិក្សាថ្មី',
    date: '2026-08-20',
    time: '8:00 AM',
    location: 'សាលាបឋមសិក្សា រោគ',
    leaderName: 'លោកស្រី សុខ សារើន',
    leaderRole: 'នាយិកាសាលា / ប្រធានអង្គប្រជុំ',
    recorderName: 'លោក អ៊ុន ប៊ុនទុង',
    recorderRole: 'លេខាកត់ត្រា',
    introText: 'ឆ្នាំពីរពាន់ម្ភៃប្រាំមួយ ខែសីហា ថ្ងៃទីម្ភៃ ត្រូវនឹងថ្ងៃព្រហស្បតិ៍ វេលាម៉ោងប្រាំបី និងសូន្យនាទី(៨:០០) នៅសាលាបឋមសិក្សា រោគ បានបើកកិច្ចប្រជុំមួយដើម្បី ការវាយតម្លៃលទ្ធផលចុងឆ្នាំសិក្សា និងការត្រៀមរៀបចំឆ្នាំសិក្សាថ្មី។',
    participantsText: '-(បញ្ជីវត្តមានជូនភ្ជាប់)',
    agendas: [
      'ការបូកសរុបលទ្ធផលប្រឡងចុងឆ្នាំ និងអត្រាសិស្សឡើងថ្នាក់/ត្រួតថ្នាក់',
      'ការរៀបចំពិធីចែករង្វាន់ជ័យលាភីសិស្សពូកែ និងបិទឆ្នាំសិក្សា',
      'យុទ្ធនាការកៀរគរសិស្សចុះឈ្មោះចូលរៀនឆ្នាំសិក្សាថ្មី (កុមារអាយុ ៦ឆ្នាំ)',
      'ការរៀបចំជួសជុលបន្ទប់រៀន និងតុ កៅអី មុនបើកបវេសនកាល'
    ],
    processes: [
      { text: 'បទបង្ហាញសង្ខេបលទ្ធផលសិក្សាពេញមួយឆ្នាំ និងការប្រៀបធៀបជាមួយឆ្នាំមុន', images: [] },
      { text: 'ពិភាក្សាផែនការយុទ្ធនាការចុះតាមខ្នងផ្ទះកៀរគរកុមារចូលរៀន', images: [] },
      { text: 'បែងចែកក្រុមការងារទទួលខុសត្រូវតាមភូមិ', images: [] }
    ],
    executiveSummary: 'សេចក្តីសង្ខេបកិច្ចប្រជុំ (Executive Summary)\n* ប្រធានបទ៖ ការវាយតម្លៃចុងឆ្នាំ និងត្រៀមឆ្នាំសិក្សាថ្មី\n\nលទ្ធផល និងសេចក្តីសម្រេចសំខាន់ៗ៖\n១. អត្រាសិស្សឡើងថ្នាក់សម្រេចបាន ៩២.៥% នៃសិស្សសរុប។\n២. ពិធីបិទឆ្នាំសិក្សា និងចែករង្វាន់នឹងប្រព្រឹត្តទៅនៅចុងខែសីហា។\n៣. គណៈកម្មការ គ.គ.ស. និងអាជ្ញាធរភូមិ នឹងចុះជំរុញឪពុកម្តាយឱ្យនាំកូនៗអាយុ ៦ឆ្នាំ មកចុះឈ្មោះចូលរៀនឱ្យបាន ១០០%។',
    conclusionText: 'អង្គប្រជុំបានបញ្ចប់នៅវេលាម៉ោង ១១:៣០ នាទីព្រឹក ក្រោមបរិយាកាសរីករាយ។',
    checkerName: 'លោកស្រី សុខ សារើន',
    preparerName: 'លោក អ៊ុន ប៊ុនទុង',
    attendanceDateLocation: 'ឆ្នាំពីរពាន់ម្ភៃប្រាំមួយ ខែសីហា ថ្ងៃទីម្ភៃ នៅសាលាបឋមសិក្សា រោគ',
    attendees: [
      {
        id: '1',
        name: 'សុខ សារើន',
        gender: 'ស្រី',
        role: 'ប្រធានអង្គប្រជុំ',
        organization: 'សាលាបឋមសិក្សា រោគ',
        phone: '០៨៩៦៦៣៩៦៦',
        signatureType: 'image',
        signatureData: defaultSignature1,
        remarks: 'ដឹកនាំកិច្ចប្រជុំ'
      },
      {
        id: '2',
        name: 'អ៊ុន ប៊ុនទុង',
        gender: 'ប្រុស',
        role: 'លេខាកត់ត្រា',
        organization: 'សាលាបឋមសិក្សា រោគ',
        phone: '០៩២២៧២០០៥',
        signatureType: 'image',
        signatureData: defaultSignature2,
        remarks: 'កត់ត្រាកំណត់ហេតុ'
      }
    ]
  },
  meeting_7: {
    meetingId: 'meeting_7',
    district: 'រដ្ឋបាលស្រុកភ្នំស្រុក',
    schoolName: 'សាលាបឋមសិក្សា រោគ',
    topic: 'មហាសន្និបាត ឬសន្និបាតបូកសរុបការងារប្រចាំឆ្នាំ គណនេយ្យភាពសង្គម និងកៀរគរធនធានពីសហគមន៍',
    date: '2026-10-15',
    time: '8:00 AM',
    location: 'សាលាបឋមសិក្សា រោគ',
    leaderName: 'លោកស្រី សុខ សារើន',
    leaderRole: 'នាយិកាសាលា / ប្រធានអង្គប្រជុំ',
    recorderName: 'លោក អ៊ុន ប៊ុនទុង',
    recorderRole: 'លេខាកត់ត្រា',
    introText: 'ឆ្នាំពីរពាន់ម្ភៃប្រាំមួយ ខែតុលា ថ្ងៃទីដប់ប្រាំ ត្រូវនឹងថ្ងៃព្រហស្បតិ៍ វេលាម៉ោងប្រាំបី និងសូន្យនាទី(៨:០០) នៅសាលាបឋមសិក្សា រោគ បានបើកមហាសន្និបាតបូកសរុបការងារប្រចាំឆ្នាំ គណនេយ្យភាពសង្គម និងកៀរគរធនធានពីសហគមន៍ ដែលដឹកនាំដោយលោកស្រី សុខ សារើន ជាប្រធានអង្គប្រជុំ។',
    participantsText: '-(បញ្ជីវត្តមានជូនភ្ជាប់)',
    agendas: [
      'របាយការណ៍បូកសរុបលទ្ធផលការងារគ្រប់គ្រងសាលារៀនប្រចាំឆ្នាំ',
      'របាយការណ៍គណនេយ្យភាពសង្គម និងតម្លាភាពហិរញ្ញវត្ថុជូនសហគមន៍',
      'ការថ្លែងអំណរគុណដល់សប្បុរសជន និងដៃគូអភិវឌ្ឍន៍សាលារៀន',
      'ការកៀរគរធនធាន និងការរៀបចំទិសដៅការងារសម្រាប់ឆ្នាំសិក្សាខាងមុខ'
    ],
    processes: [
      { text: 'នាយិកាសាលា និងប្រធាន គ.គ.ស. អានរបាយការណ៍ជូនអង្គមហាសន្និបាត', images: [] },
      { text: 'មាតាបិតាសិស្ស អាជ្ញាធរ និងសហគមន៍ ឡើងបញ្ចេញមតិយោបល់ និងសំណូមពរ', images: [] },
      { text: 'ប្រកាសការចូលរួមវិភាគទាន និងការអនុម័តផែនការអភិវឌ្ឍន៍សាលាបន្ត', images: [] }
    ],
    executiveSummary: 'សេចក្តីសង្ខេបកិច្ចប្រជុំ (Executive Summary)\n* ប្រធានបទ៖ មហាសន្និបាតបូកសរុបការងារប្រចាំឆ្នាំ និងគណនេយ្យភាពសង្គម\n\nលទ្ធផល និងសេចក្តីសម្រេចសំខាន់ៗ៖\n១. អង្គមហាសន្និបាតបានអនុម័តរបាយការណ៍ប្រចាំឆ្នាំ និងរបាយការណ៍ហិរញ្ញវត្ថុដោយតម្លាភាពខ្ពស់។\n២. សហគមន៍ មាតាបិតាសិស្ស និងសប្បុរសជន បានចូលរួមបរិច្ចាគថវិកា និងសម្ភារគាំទ្រសាលារៀន។\n៣. បានឯកភាពលើទិសដៅយុទ្ធសាស្ត្រឆ្នាំសិក្សាថ្មី ដើម្បីលើកកម្ពស់ស្តង់ដាសាលារៀនគំរូ។',
    conclusionText: 'មហាសន្និបាតបានបិទបញ្ចប់នៅវេលាម៉ោង ១២:០០ ថ្ងៃត្រង់ ក្រោមបរិយាកាសរីករាយ និងស្និទ្ធស្នាលក្រៃលែង។',
    checkerName: 'លោកស្រី សុខ សារើន',
    preparerName: 'លោក អ៊ុន ប៊ុនទុង',
    attendanceDateLocation: 'ឆ្នាំពីរពាន់ម្ភៃប្រាំមួយ ខែតុលា ថ្ងៃទីដប់ប្រាំ នៅសាលាបឋមសិក្សា រោគ',
    attendees: [
      {
        id: '1',
        name: 'សុខ សារើន',
        gender: 'ស្រី',
        role: 'ប្រធានអង្គប្រជុំ',
        organization: 'សាលាបឋមសិក្សា រោគ',
        phone: '០៨៩៦៦៣៩៦៦',
        signatureType: 'image',
        signatureData: defaultSignature1,
        remarks: 'ដឹកនាំមហាសន្និបាត'
      },
      {
        id: '2',
        name: 'អ៊ុន ប៊ុនទុង',
        gender: 'ប្រុស',
        role: 'លេខាកត់ត្រា',
        organization: 'សាលាបឋមសិក្សា រោគ',
        phone: '០៩២២៧២០០៥',
        signatureType: 'image',
        signatureData: defaultSignature2,
        remarks: 'កត់ត្រាកំណត់ហេតុ'
      },
      {
        id: '3',
        name: 'សូ គិន',
        gender: 'ប្រុស',
        role: 'សមាសភាពគ.គ.ស.',
        organization: 'សហគមន៍',
        phone: '០៩៧៥៦០៩០២',
        signatureType: 'text',
        signatureData: 'ឌីជីថល (បានចុះហត្ថលេខា)',
        remarks: 'ចូលរួមពេញលេញ'
      },
      {
        id: '4',
        name: 'ផាត សាមួយ',
        gender: 'ស្រី',
        role: 'សមាសភាពគ.គ.ស.',
        organization: 'សហគមន៍',
        phone: '-',
        signatureType: 'text',
        signatureData: 'ឌីជីថល (បានចុះហត្ថលេខា)',
        remarks: 'ចូលរួមពេញលេញ'
      }
    ]
  }
};
