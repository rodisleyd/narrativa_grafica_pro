import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini SDK to prevent crash if key is missing on start
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY não configurada no servidor. Configure sob Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// REST API for Creative AI assistance
app.post("/api/ai/creative", async (req, res) => {
  try {
    const { action, prompt, projectContext } = req.body;
    
    // Prepare prompt according to the selected action
    let systemInstruction = "Você é um assistente criativo profissional e didático de histórias em quadrinhos (HQs), tirinhas e mangás. Escreva em português brasileiro de forma inspiradora e técnica.";
    
    if (action === "dialogues") {
      systemInstruction = "Você é um roteirista profissional de quadrinhos e mangás. Reescreva falas de forma limpa, direta, natural e impactante. Escreva em português brasileiro.";
    }

    if (projectContext) {
      let contextString = `\n\n[CONTEXTO DO PROJETO INTERNO PARA REFERÊNCIA]\n`;
      if (projectContext.title) contextString += `- Título: ${projectContext.title}\n`;
      if (projectContext.premise) contextString += `- Argumento Geral (Sinopse/Premissa): ${projectContext.premise}\n`;
      if (projectContext.genre) contextString += `- Gênero: ${projectContext.genre}\n`;
      if (projectContext.format) contextString += `- Formato: ${projectContext.format}\n`;
      if (projectContext.style) contextString += `- Estilo Gráfico: ${projectContext.style}\n`;
      if (projectContext.theme) contextString += `- Tema Moral: ${projectContext.theme}\n`;
      if (projectContext.characters) contextString += `- Elenco Principal (Personagens): ${projectContext.characters}\n`;
      if (projectContext.world) contextString += `- Ambientação e Regras: ${projectContext.world}\n`;
      contextString += `--------------------------------------------------\n\nUse as informações do contexto acima para garantir que suas respostas, sugestões de desenho, diálogos e correções sejam estritamente consistentes com os personagens, regras do mundo e enredo estabelecido pelo roteirista.`;
      systemInstruction += contextString;
    }

    let userPrompt = "";

    switch (action) {
      case "ideas":
        userPrompt = `Gere 3 ideias inovadoras baseadas neste prompt: "${prompt}". Formato do projeto: ${projectContext.format}. Gênero: ${projectContext.genre}. Estilo: ${projectContext.style}.`;
        break;
      case "conflicts":
        userPrompt = `Sugira 3 conflitos dramáticos intensos ou reviravoltas de roteiro baseando-se no contexto de história: "${prompt}".`;
        break;
      case "dialogues":
        userPrompt = `Melhore e reescreva o diálogo abaixo de forma a torná-lo mais natural, dramático ou engraçado (conforme o estilo apropriado), com economia textual e subtexto.
ATENÇÃO: Retorne EXCLUSIVAMENTE o texto do diálogo reescrito. Não adicione nenhuma explicação, introdução, múltiplas opções, formatação em tópicos, notas visuais, nem formatação markdown adicional. Retorne apenas a fala final. Se a fala original tiver o nome de um personagem indicando quem fala (ex: "HERÓI: fala"), mantenha o mesmo formato no retorno (ex: "HERÓI: fala melhorada").

Diálogo original:
${prompt}`;
        break;
      case "framing":
        userPrompt = `Gere sugestões de enquadramentos e ritmo visual (pacing) para a seguinte descrição de cena de quadrinho. Explique a escolha das câmeras (plano geral, close-up, close extremo, etc.) e o fluxo de leitura:\n\n${prompt}`;
        break;
      case "review":
        userPrompt = `Faça uma análise crítica deste trecho de roteiro, analisando o ritmo das páginas, a economia de textos, o balanceamento de diálogos e o impacto visual:\n\n${prompt}`;
        break;
      default:
        userPrompt = prompt;
    }

    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.8,
      },
    });

    res.json({ success: true, text: response.text });
  } catch (error: any) {
    console.error("Erro no assistente IA:", error);
    res.status(500).json({ success: false, error: error.message || "Erro desconhecido de IA" });
  }
});

// REST API for Detailed Script Analysis
app.post("/api/ai/analyze", async (req, res) => {
  try {
    const { scriptData } = req.body;
    
    if (!scriptData) {
      return res.status(400).json({ success: false, error: "Dados do roteiro ausentes" });
    }

    const ai = getAiClient();
    
    const analysisPrompt = `Analise o seguinte roteiro de quadrinho estruturado e forneça uma resposta em JSON válido baseado na estrutura especificada abaixo.
Formato: ${scriptData.format}
Gênero: ${scriptData.genre}
Premissa: ${scriptData.premise}
Estilo: ${scriptData.style}

Conteúdo do roteiro:
${JSON.stringify(scriptData.pages)}

Sua resposta deve ser EXCLUSIVAMENTE um objeto JSON válido, sem tags markdown ou explicações externas, com a seguinte estrutura de tipos:
{
  "dramaticStructure": "Texto sobre o andamento e consistência da estrutura dramática baseada nas referências teóricas",
  "pacingScore": 1 a 100 (número indicando o ritmo das cenas),
  "pacingFeedback": "Breve parágrafo analisando o ritmo",
  "textDensity": "Baixa" | "Média" | "Alta",
  "textDensityFeedback": "Análise da quantidade de balões e textos versus ação visual",
  "balanceRatio": "X% Ação / Y% Diálogo",
  "visualClarity": "Texto analisando a clareza visual e se os enquadramentos ajudam na transição de quadros",
  "emotionalCurve": [pontuação de intensidade de -10 a 10 representando a curva dramática por página de forma sequencial],
  "recommendations": ["Recomendação 1", "Recomendação 2", "Recomendação 3"]
}

Atente-se estritamente à fidelidade do formato JSON de retorno.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: analysisPrompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.3,
        systemInstruction: "Você é um revisor profissional de roteiros de quadrinhos. Sempre responda usando um JSON estrito em português brasileiro.",
      },
    });

    const jsonText = response.text || "{}";
    const cleanedJson = jsonText.replace(/```json|```/g, "").trim();
    const parsedData = JSON.parse(cleanedJson);

    res.json({ success: true, analysis: parsedData });
  } catch (error: any) {
    console.error("Erro na análise do roteiro:", error);
    res.status(500).json({ success: false, error: error.message || "Erro desconhecido na análise" });
  }
});

// Serve static assets or mount Vite in dev mode
async function boot() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Narrativa Gráfica Pro] Executando em http://localhost:${PORT}`);
  });
}

// Só inicia o servidor local se não estivermos no Vercel (serviço serverless)
if (!process.env.VERCEL) {
  boot();
}

export default app;
