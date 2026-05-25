import express from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// Lazy-initialize Gemini SDK
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY não configurada no servidor Vercel. Configure nas configurações do projeto.");
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

// REST API para assistência criativa IA
app.post("/api/ai/creative", async (req, res) => {
  try {
    const { action, prompt, projectContext } = req.body;
    let systemInstruction = "Você é um assistente criativo profissional e didático de histórias em quadrinhos (HQs), tirinhas e mangás. Escreva em português brasileiro de forma inspiradora e técnica.";
    let userPrompt = "";

    switch (action) {
      case "ideas":
        userPrompt = `Gere 3 ideias inovadoras baseadas neste prompt: "${prompt}". Formato do projeto: ${projectContext.format}. Gênero: ${projectContext.genre}. Estilo: ${projectContext.style}.`;
        break;
      case "conflicts":
        userPrompt = `Sugira 3 conflitos dramáticos intensos ou reviravoltas de roteiro baseando-se no contexto de história: "${prompt}".`;
        break;
      case "dialogues":
        systemInstruction = "Você é um roteirista profissional de quadrinhos e mangás. Reescreva falas de forma limpa, direta, natural e impactante. Escreva em português brasileiro.";
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
    res.status(500).json({ success: true, error: error.message || "Erro desconhecido de IA", text: "Erro ao processar requisição com a IA." });
  }
});

// REST API para análise detalhada do roteiro
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
  "pacingScore": 1 a 100 (número indicando o ritmo das scenes),
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

export default app;
