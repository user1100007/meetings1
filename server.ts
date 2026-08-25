import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // AI Meeting Generator & Refiner
  app.post("/api/gemini/generate-meeting", async (req, res) => {
    try {
      const {
        meetingNumber,
        topic,
        date,
        time,
        location,
        schoolName,
        district,
        leaderName,
        leaderRole,
        notes
      } = req.body;

      const ai = getAIClient();

      const prompt = `អ្នកគឺជាអ្នកជំនាញកត់ត្រាកំណត់ហេតុ និងរៀបចំឯកសាររដ្ឋបាលផ្លូវការនៃក្រសួងអប់រំ យុវជន និងកីឡា នៃព្រះរាជាណាចក្រកម្ពុជា សម្រាប់គណៈកម្មការគ្រប់គ្រងសាលារៀន (គ.គ.ស.)។
សូមជួយបង្កើត និងបម្លែងខ្លឹមសារកំណត់ហេតុកិច្ចប្រជុំលើកទី ${meetingNumber || 1} ឱ្យមានទម្រង់រដ្ឋបាលស្តង់ដារ និងផ្លូវការបំផុត។

ព័ត៌មានបញ្ចូល៖
- លើកទី៖ ${meetingNumber || 1}
- ឈ្មោះកំណត់ហេតុ/ប្រធានបទ៖ ${topic || 'ការប្រជុំ គ.គ.ស.'}
- កាលបរិច្ឆេទ៖ ${date || '2025-12-08'}
- ម៉ោង៖ ${time || '8:00 AM'}
- ទីកន្លែង៖ ${location || 'សាលាបឋមសិក្សា'}
- សាលារៀន៖ ${schoolName || 'សាលាបឋមសិក្សា'}
- ស្រុក/ក្រុង៖ ${district || 'រដ្ឋបាលស្រុក'}
- ឈ្មោះប្រធានអង្គប្រជុំ៖ ${leaderName || 'លោកស្រី សុខ សារើន'} (${leaderRole || 'នាយិកាសាលា'})
- កំណត់សម្គាល់បន្ថែម៖ ${notes || 'គ្មាន'}

តម្រូវការ៖
១. introText៖ សរសេរជាពាក្យពេញលេញតាមកាលបរិច្ឆេទផ្លូវការខ្មែរ (ឆ្នាំ... ខែ... ថ្ងៃទី... ត្រូវនឹងថ្ងៃ... រោច/កើត ខែ... ឆ្នាំ... សប្តស័ក ពុទ្ធសករាជ... វេលាម៉ោង... នៅ... បានបើកកិច្ចប្រជុំមួយដើម្បី... ដែលដឹកនាំដោយ... ជាប្រធានអង្គប្រជុំ។)
២. agendas៖ បញ្ជីរបៀបវារៈប្រជុំ ៣ ទៅ ៥ ចំណុច សមស្របតាមកិច្ចប្រជុំលើកទី ${meetingNumber} នេះ។
៣. processes៖ បញ្ជីដំណើរការប្រជុំលម្អិត ៣ ទៅ ៥ ចំណុច។
៤. executiveSummary៖ សេចក្តីសង្ខេបកិច្ចប្រជុំ (Executive Summary) ផ្លូវការ រួមមានប្រធានបទ កាលបរិច្ឆេទ ទីតាំង ប្រធានអង្គប្រជុំ និងលទ្ធផល/សេចក្តីសម្រេចសំខាន់ៗ។
៥. conclusionText៖ សេចក្តីសន្និដ្ឋានបញ្ចប់កិច្ចប្រជុំផ្លូវការ។
៦. attendanceDateLocation៖ កាលបរិច្ឆេទពេញលេញ និងទីតាំងសម្រាប់សន្លឹកវត្តមាន។`;

      let response;
      let retries = 3;
      while (retries > 0) {
        try {
          response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  introText: { type: Type.STRING, description: "Formal Khmer solar and lunar date introductory paragraph" },
                  agendas: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "List of formal meeting agendas"
                  },
                  processes: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "List of meeting proceedings and processes"
                  },
                  executiveSummary: { type: Type.STRING, description: "Detailed executive summary of the meeting" },
                  conclusionText: { type: Type.STRING, description: "Formal closing statement" },
                  attendanceDateLocation: { type: Type.STRING, description: "Full formal date and location header for attendance" }
                },
                required: ["introText", "agendas", "processes", "executiveSummary", "conclusionText", "attendanceDateLocation"]
              }
            }
          });
          break; // success
        } catch (error: any) {
          retries--;
          if (retries === 0 || error?.status !== 503) throw error;
          await new Promise(resolve => setTimeout(resolve, 1500)); // wait 1.5s before retry
        }
      }

      const parsed = JSON.parse(response.text || '{}');
      if (parsed.processes && Array.isArray(parsed.processes)) {
        parsed.processes = parsed.processes.map((text: string) => ({ text, images: [] }));
      }
      return res.json({ success: true, data: parsed });
    } catch (err: any) {
      console.error("Gemini API generation error:", err);
      return res.status(500).json({
        success: false,
        error: err.message || "Failed to generate meeting content with AI"
      });
    }
  });

  // Vite middleware for dev / static for prod
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
