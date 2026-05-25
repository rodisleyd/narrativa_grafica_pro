import React, { useState } from "react";
import { Project } from "../types";
import { Download, Copy, Check, FileText, Code, File, Printer, Columns, Sparkles, AlertCircle } from "lucide-react";
import { jsPDF } from "jspdf";

interface ExportPanelProps {
  project: Project;
}

interface ParsedDialogueLine {
  charName: string;
  text: string;
}

const parseDialogueLines = (dialogueText: string): ParsedDialogueLine[] => {
  if (!dialogueText) return [];
  const lines = dialogueText.split("\n").map(l => l.trim()).filter(Boolean);
  
  const formatSpeech = (txt: string) => {
    if (txt === txt.toUpperCase()) {
      const lowered = txt.toLowerCase();
      return lowered.charAt(0).toUpperCase() + lowered.slice(1).replace(/(?:^[a-z]|\.\s+[a-z]|\!\s+[a-z]|\?\s+[a-z])/g, m => m.toUpperCase());
    }
    return txt;
  };

  return lines.map(line => {
    let charName = "";
    let speechText = line;
    
    if (line.includes(":")) {
      const parts = line.split(":");
      charName = parts[0].trim().toUpperCase();
      speechText = parts.slice(1).join(":").trim();
    }
    
    return {
      charName,
      text: formatSpeech(speechText)
    };
  });
};

export default function ExportPanel({ project }: ExportPanelProps) {
  const [exportFormat, setExportFormat] = useState<"MD" | "TXT" | "JSON" | "PDF" | "DOCX" | "FDX" | "CELTX">("MD");
  const [pdfTemplate, setPdfTemplate] = useState<"CLASSIC" | "EDITORIAL" | "STUDIO">("CLASSIC");
  const [copied, setCopied] = useState(false);
  const [copiedStateMessage, setCopiedStateMessage] = useState("Copiar Todo o Conteúdo");

  const generateDocxFormat = (): string => {
    let output = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">\n`;
    output += `<head>\n<meta charset="utf-8">\n<title>${project.settings.title}</title>\n`;
    output += `<style>\n`;
    output += `  body { font-family: 'Courier New', Courier, monospace; font-size: 11pt; line-height: 1.5; padding: 20px; }\n`;
    output += `  h1 { font-family: Arial, sans-serif; font-size: 18pt; text-align: center; color: #111; margin-bottom: 5px; }\n`;
    output += `  .subtitle { font-family: Arial, sans-serif; font-size: 11pt; text-align: center; color: #555; margin-bottom: 30px; }\n`;
    output += `  h2 { font-family: Arial, sans-serif; font-size: 14pt; border-bottom: 2px solid #222; padding-bottom: 4px; margin-top: 30px; color: #222; }\n`;
    output += `  h3 { font-family: Arial, sans-serif; font-size: 12pt; margin-top: 25px; color: #333; text-transform: uppercase; }\n`;
    output += `  .metadata-table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }\n`;
    output += `  .metadata-table td { padding: 6px; border: 1px solid #ddd; font-size: 10pt; font-family: Arial, sans-serif; }\n`;
    output += `  .character-item { margin-bottom: 8px; font-size: 10.5pt; }\n`;
    output += `  .pacing { font-style: italic; color: #666; margin-bottom: 12px; font-size: 10pt; }\n`;
    output += `  .panel-container { border: 1px solid #ccc; padding: 12px; margin-bottom: 15px; background-color: #fafafa; }\n`;
    output += `  .panel-header { font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 4px; margin-bottom: 8px; font-size: 11pt; color: #111; }\n`;
    output += `  .dialogue-container { margin-left: 15%; margin-right: 15%; text-align: center; margin-top: 8px; margin-bottom: 8px; }\n`;
    output += `  .char-name { font-weight: bold; text-transform: uppercase; font-size: 10.5pt; display: block; text-align: center; }\n`;
    output += `  .dialogue-text { font-style: italic; font-size: 11pt; display: block; text-align: center; }\n`;
    output += `  .sfx { font-weight: bold; color: #b91c1c; text-transform: uppercase; font-size: 10pt; }\n`;
    output += `  .artist-notes { font-style: italic; color: #555; font-size: 9.5pt; }\n`;
    output += `</style>\n</head>\n<body>\n`;
    
    output += `<h1>${project.settings.title.toUpperCase()}</h1>\n`;
    output += `<div class="subtitle">Roteiro de Narrativa Visual / Quadrinhos</div>\n`;
    
    output += `<table class="metadata-table">\n`;
    output += `  <tr><td><strong>Formato:</strong> ${project.settings.format}</td><td><strong>Gênero:</strong> ${project.settings.genre}</td></tr>\n`;
    output += `  <tr><td><strong>Público-Alvo:</strong> ${project.settings.targetAudience}</td><td><strong>Estilo:</strong> ${project.settings.style}</td></tr>\n`;
    output += `</table>\n`;
    
    output += `<h2>Premissa Dramática</h2>\n<p>${project.settings.premise}</p>\n`;
    output += `<h2>Tema Moral</h2>\n<p>${project.settings.theme}</p>\n`;
    
    output += `<h2>Elenco (Fichas e Relações)</h2>\n<ul>\n`;
    project.characters.forEach((c) => {
      output += `  <li class="character-item"><strong>${c.name}</strong> (${c.archetype})<br>\n`;
      output += `  <em>Desejo:</em> ${c.objective} | <em>Fraqueza:</em> ${c.weakness} | <em>Medo:</em> ${c.fear}<br>\n`;
      output += `  <em>Relações:</em> ${c.relations || "Nenhuma registrada."}</li>\n`;
    });
    output += `</ul>\n`;
    
    output += `<h2>Roteiro Decupado</h2>\n`;
    project.pages.forEach((p) => {
      output += `<h3>PÁGINA ${p.pageNumber}</h3>\n`;
      output += `<div class="pacing">Ritmo da Página: ${p.rhythmNotes || "Ação contínua."}</div>\n`;
      
      p.panels.forEach((pnl) => {
        output += `<div class="panel-container">\n`;
        output += `  <div class="panel-header">QUADRO ${pnl.panelNumber} - ${(pnl.framing || "Plano Médio").toUpperCase()}</div>\n`;
        output += `  <p><strong>Ação Visual:</strong> ${pnl.visualDescription}</p>\n`;
        
        if (pnl.cameraMovement) {
          output += `  <p><strong>Câmera:</strong> ${pnl.cameraMovement}</p>\n`;
        }
        
        if (pnl.soundEffects) {
          output += `  <p class="sfx">SFX: ${pnl.soundEffects.toUpperCase()}</p>\n`;
        }
        
        if (pnl.narration) {
          output += `  <p><strong>[RECORDATÓRIO]</strong> <em>"${pnl.narration}"</em></p>\n`;
        }
        
        if (pnl.dialogue) {
          const dialogLines = parseDialogueLines(pnl.dialogue);
          dialogLines.forEach((dl) => {
            output += `  <div class="dialogue-container">\n`;
            if (dl.charName) {
              output += `    <span class="char-name">${dl.charName}</span>\n`;
            }
            output += `    <span class="dialogue-text">"${dl.text}"</span>\n`;
            output += `  </div>\n`;
          });
        }
        
        if (pnl.artistNotes) {
          output += `  <p class="artist-notes"><strong>Nota ao Artista:</strong> ${pnl.artistNotes}</p>\n`;
        }
        output += `</div>\n`;
      });
    });
    
    output += `</body>\n</html>`;
    return output;
  };

  const generateFinalDraftFormat = (): string => {
    let xml = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n`;
    xml += `<FinalDraft DocumentType="Script" Version="4">\n`;
    xml += `  <Content>\n`;
    
    xml += `    <Paragraph Type="Scene Heading">\n      <Text>${project.settings.title.toUpperCase()} - ROTEIRO</Text>\n    </Paragraph>\n`;
    xml += `    <Paragraph Type="Action">\n      <Text>Formato: ${project.settings.format} | Gênero: ${project.settings.genre} | Público: ${project.settings.targetAudience}</Text>\n    </Paragraph>\n`;
    xml += `    <Paragraph Type="Action">\n      <Text>Premissa: ${project.settings.premise}</Text>\n    </Paragraph>\n`;
    
    project.pages.forEach((p) => {
      xml += `    <Paragraph Type="Scene Heading">\n      <Text>PÁGINA ${p.pageNumber}</Text>\n    </Paragraph>\n`;
      if (p.rhythmNotes) {
        xml += `    <Paragraph Type="Action">\n      <Text>[RITMO: ${p.rhythmNotes}]</Text>\n    </Paragraph>\n`;
      }
      
      p.panels.forEach((pnl) => {
        xml += `    <Paragraph Type="Scene Heading">\n      <Text>QUADRO ${pnl.panelNumber} - ${(pnl.framing || "Plano Médio").toUpperCase()}</Text>\n    </Paragraph>\n`;
        xml += `    <Paragraph Type="Action">\n      <Text>IMAGEM: ${pnl.visualDescription}</Text>\n    </Paragraph>\n`;
        
        if (pnl.cameraMovement) {
          xml += `    <Paragraph Type="Action">\n      <Text>CÂMERA: ${pnl.cameraMovement}</Text>\n    </Paragraph>\n`;
        }
        
        if (pnl.soundEffects) {
          xml += `    <Paragraph Type="Action">\n      <Text>SFX: ${pnl.soundEffects.toUpperCase()}</Text>\n    </Paragraph>\n`;
        }
        
        if (pnl.narration) {
          xml += `    <Paragraph Type="Action">\n      <Text>[RECORDATÓRIO] "${pnl.narration}"</Text>\n    </Paragraph>\n`;
        }
        
        if (pnl.dialogue) {
          const dialogLines = parseDialogueLines(pnl.dialogue);
          dialogLines.forEach((dl) => {
            if (dl.charName) {
              xml += `    <Paragraph Type="Character">\n      <Text>${dl.charName}</Text>\n    </Paragraph>\n`;
            }
            xml += `    <Paragraph Type="Dialogue">\n      <Text>${dl.text}</Text>\n    </Paragraph>\n`;
          });
        }
        
        if (pnl.artistNotes) {
          xml += `    <Paragraph Type="Action">\n      <Text>(NOTA AO ARTISTA: ${pnl.artistNotes})</Text>\n    </Paragraph>\n`;
        }
      });
    });
    
    xml += `  </Content>\n`;
    xml += `</FinalDraft>`;
    return xml;
  };

  const generateCeltxFormat = (): string => {
    let html = `<!DOCTYPE html>\n<html>\n<head>\n<meta charset="utf-8">\n<title>${project.settings.title}</title>\n`;
    html += `<style>\n`;
    html += `  body { font-family: Courier, monospace; font-size: 12pt; margin: 1in; line-height: 1.2; }\n`;
    html += `  .title-page { text-align: center; margin-top: 3in; margin-bottom: 3in; }\n`;
    html += `  .title { font-size: 18pt; font-weight: bold; text-transform: uppercase; margin-bottom: 20px; }\n`;
    html += `  .author { font-size: 12pt; margin-top: 10px; }\n`;
    html += `  .scene-heading { text-transform: uppercase; margin-top: 24pt; margin-bottom: 12pt; font-weight: bold; }\n`;
    html += `  .action { margin-top: 12pt; margin-bottom: 12pt; text-align: justify; }\n`;
    html += `  .character { text-transform: uppercase; margin-left: 2.5in; margin-top: 12pt; margin-bottom: 0pt; font-weight: bold; }\n`;
    html += `  .dialogue { margin-left: 1.5in; margin-right: 1.5in; margin-top: 0pt; margin-bottom: 12pt; }\n`;
    html += `  .parenthetical { margin-left: 2.0in; margin-top: 0pt; margin-bottom: 0pt; font-style: italic; }\n`;
    html += `</style>\n</head>\n<body>\n`;
    
    html += `<div class="title-page">\n`;
    html += `  <div class="title">${project.settings.title.toUpperCase()}</div>\n`;
    html += `  <div class="author">Roteiro de HQ por Narrativa Gráfica Pro</div>\n`;
    html += `  <div class="author">Formato: ${project.settings.format} | Gênero: ${project.settings.genre}</div>\n`;
    html += `</div>\n`;
    html += `<hr style="page-break-after: always; visibility: hidden; border: none;" />\n`;
    
    project.pages.forEach((p) => {
      html += `<div class="scene-heading">PÁGINA ${p.pageNumber}</div>\n`;
      if (p.rhythmNotes) {
        html += `<div class="action"><em>[Nota de ritmo: ${p.rhythmNotes}]</em></div>\n`;
      }
      
      p.panels.forEach((pnl) => {
        html += `<div class="scene-heading">QUADRO ${pnl.panelNumber} - ${(pnl.framing || "Plano Geral").toUpperCase()}</div>\n`;
        html += `<div class="action"><strong>Descrição Visual:</strong> ${pnl.visualDescription}</div>\n`;
        
        if (pnl.cameraMovement) {
          html += `<div class="action"><strong>Movimento de Câmera:</strong> ${pnl.cameraMovement}</div>\n`;
        }
        
        if (pnl.soundEffects) {
          html += `<div class="action"><strong>SFX:</strong> ${pnl.soundEffects.toUpperCase()}</div>\n`;
        }
        
        if (pnl.narration) {
          html += `<div class="parenthetical">[RECORDATÓRIO]</div>\n`;
          html += `<div class="dialogue">"${pnl.narration}"</div>\n`;
        }
        
        if (pnl.dialogue) {
          const dialogLines = parseDialogueLines(pnl.dialogue);
          dialogLines.forEach((dl) => {
            if (dl.charName) {
              html += `<div class="character">${dl.charName}</div>\n`;
            }
            html += `<div class="dialogue">"${dl.text}"</div>\n`;
          });
        }
        
        if (pnl.artistNotes) {
          html += `<div class="action"><em>(Nota ao Desenhista: ${pnl.artistNotes})</em></div>\n`;
        }
      });
      html += `<hr style="page-break-after: always; visibility: hidden; border: none;" />\n`;
    });
    
    html += `</body>\n</html>`;
    return html;
  };

  const generateMarkdownFormat = (): string => {
    let output = `# Roteiro: ${project.settings.title}\n`;
    output += `**Formato**: ${project.settings.format} | **Gênero**: ${project.settings.genre}\n`;
    output += `**Público-Alvo**: ${project.settings.targetAudience} | **Estilo Proposto**: ${project.settings.style}\n\n`;
    output += `## Premissa\n${project.settings.premise}\n\n`;
    output += `## Tema Moral\n${project.settings.theme}\n\n`;
    output += `## Estrutura de Personagens\n`;
    project.characters.forEach((c) => {
      output += `- **${c.name}** (${c.archetype}): Desejo: ${c.objective} | Medo: ${c.fear} | Fraqueza: ${c.weakness}\n`;
    });
    output += `\n## Roteiro Decupado por Páginas e Quadros\n\n`;

    project.pages.forEach((p) => {
      output += `### PÁGINA ${p.pageNumber}\n`;
      output += `_Nota de Ritmo: ${p.rhythmNotes || "Ação contínua."}_\n\n`;
      p.panels.forEach((pnl) => {
        output += `#### QUADRO ${pnl.panelNumber} [${pnl.framing || "Plano Médio"}]\n`;
        output += `- **Imagem**: ${pnl.visualDescription}\n`;
        if (pnl.dialogue) output += `- **Falas / Balões**:\n  ${pnl.dialogue}\n`;
        if (pnl.narration) output += `- **Recordatório**: _"${pnl.narration}"_\n`;
        if (pnl.soundEffects) output += `- **Onomatopeia**: **${pnl.soundEffects}**\n`;
        if (pnl.cameraMovement) output += `- **Câmera**: ${pnl.cameraMovement}\n`;
        if (pnl.artistNotes) output += `- **Instrução Técnica**: _${pnl.artistNotes}_\n`;
        output += `\n`;
      });
      output += `---\n\n`;
    });

    return output;
  };

  const generateTxtFormat = (): string => {
    let output = `==========================================================\n`;
    output += `           ROTEIRO DE QUADRINHOS: ${project.settings.title.toUpperCase()}\n`;
    output += `==========================================================\n\n`;
    output += `Formato: ${project.settings.format}\n`;
    output += `Gênero: ${project.settings.genre} | Público: ${project.settings.targetAudience}\n\n`;
    output += `PREMISSA:\n${project.settings.premise}\n\n`;
    output += `PERSONAGENS:\n`;
    project.characters.forEach((c) => {
      output += `- ${c.name} (${c.archetype}): ${c.objective}\n`;
    });
    output += `\n----------------------------------------------------------\n\n`;

    project.pages.forEach((p) => {
      output += `PÁGINA ${p.pageNumber}\n`;
      output += `RITMO: ${p.rhythmNotes || "Ação contínua"}\n`;
      output += `----------------------------------------------------------\n\n`;
      p.panels.forEach((pnl) => {
        output += `QUADRO ${pnl.panelNumber} - ${pnl.framing.toUpperCase()}\n`;
        output += `DESCRIÇÃO VISUAL:\n${pnl.visualDescription}\n\n`;
        if (pnl.narration) {
          output += `   NARRADOR: "${pnl.narration}"\n\n`;
        }
        if (pnl.dialogue) {
          output += `   ${pnl.dialogue}\n\n`;
        }
        if (pnl.soundEffects) {
          output += `   SFX (ONOMATOPEIA): [${pnl.soundEffects}]\n\n`;
        }
        if (pnl.artistNotes) {
          output += `   (NOTA DO ARTISTA: ${pnl.artistNotes})\n\n`;
        }
        output += `..........................................................\n\n`;
      });
    });

    return output;
  };

  const generateJsonFormat = (): string => {
    return JSON.stringify(project, null, 2);
  };

  const exportPdf = () => {
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      let pageNum = 1;
      let y = 20;

      const drawHeaderFooter = (currentPage: number) => {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        // Header line
        doc.text(`${project.settings.title.substring(0, 45)} | Roteiro de HQ`, 20, 12);
        doc.setDrawColor(220, 220, 220);
        doc.setLineWidth(0.2);
        doc.line(20, 13, 190, 13);
        // Footer (centered page number)
        doc.text(`Página ${currentPage}`, 105, 287, { align: "center" });
        doc.text(`Estúdio de Decupagem HQ • Criador Literário`, 20, 287);
      };

      const printText = (
        text: string,
        x: number,
        maxWidth: number,
        fontSize: number,
        lineHeightMm: number,
        fontFamily: "courier" | "helvetica",
        fontStyle: "normal" | "bold" | "italic" | "bolditalic",
        colorRgb: [number, number, number] = [34, 34, 34],
        center: boolean = false
      ) => {
        doc.setFont(fontFamily, fontStyle);
        doc.setFontSize(fontSize);
        doc.setTextColor(colorRgb[0], colorRgb[1], colorRgb[2]);

        const wrapText = doc.splitTextToSize(text, maxWidth);
        for (let i = 0; i < wrapText.length; i++) {
          if (y + lineHeightMm > 272) {
            doc.addPage();
            pageNum++;
            drawHeaderFooter(pageNum);
            y = 25;
            doc.setFont(fontFamily, fontStyle);
            doc.setFontSize(fontSize);
            doc.setTextColor(colorRgb[0], colorRgb[1], colorRgb[2]);
          }
          if (center) {
            doc.text(wrapText[i], 105, y, { align: "center" });
          } else {
            doc.text(wrapText[i], x, y);
          }
          y += lineHeightMm;
        }
      };

      const checkSpace = (neededHeight: number) => {
        if (y + neededHeight > 272) {
          doc.addPage();
          pageNum++;
          drawHeaderFooter(pageNum);
          y = 25;
        }
      };

      // ----------------- TEMPLATE CLÁSSICO COURIER -----------------
      if (pdfTemplate === "CLASSIC") {
        // Page 1 Cover Sheet
        y = 45;
        printText(project.settings.title.toUpperCase(), 105, 150, 24, 10, "courier", "bold", [20, 20, 20], true);
        y += 12;
        printText(`Formato: ${project.settings.format} | Gênero: ${project.settings.genre}`, 105, 150, 11, 6, "courier", "italic", [80, 80, 80], true);
        printText(`Público Alvo: ${project.settings.targetAudience}`, 105, 150, 11, 5, "courier", "normal", [80, 80, 80], true);
        y += 20;

        doc.setDrawColor(180, 180, 180);
        doc.setLineWidth(0.3);
        doc.line(40, y, 170, y);
        y += 15;

        printText("CONCEPÇÃO DA PREMISSA CONTÍNUA:", 25, 160, 12, 7, "courier", "bold", [30, 30, 30]);
        y += 3;
        printText(project.settings.premise, 25, 160, 10, 6, "courier", "normal", [60, 60, 60]);
        y += 15;

        printText("FICHA TÉCNICA E ELENCO DO ENREDO:", 25, 160, 12, 7, "courier", "bold", [30, 30, 30]);
        y += 3;
        project.characters.forEach((c) => {
          printText(`• ${c.name.toUpperCase()} (${c.archetype})`, 25, 160, 10, 5.5, "courier", "bold", [40, 40, 40]);
          printText(`  Desejo: ${c.objective} | Medo: ${c.fear}`, 25, 160, 9.5, 5, "courier", "normal", [70, 70, 70]);
          y += 2;
        });

        // Add standard script sheet
        doc.addPage();
        pageNum = 2;
        drawHeaderFooter(pageNum);
        y = 25;

        project.pages.forEach((p) => {
          checkSpace(25);
          printText(`PÁGINA ${p.pageNumber}`, 20, 170, 14, 8, "courier", "bold", [10, 10, 10]);
          if (p.rhythmNotes) {
            printText(`[Nota de Ritmo: ${p.rhythmNotes}]`, 20, 170, 9.5, 5.5, "courier", "italic", [100, 100, 100]);
          }
          y += 4;
          doc.setDrawColor(220, 220, 220);
          doc.setLineWidth(0.25);
          doc.line(20, y, 190, y);
          y += 6;

          p.panels.forEach((pnl) => {
            checkSpace(30);
            printText(`QUADRO ${pnl.panelNumber} [${(pnl.framing || "Plano Médio").toUpperCase()}]`, 20, 170, 11, 6, "courier", "bold", [15, 15, 15]);
            y += 2;
            
            printText(`Ação Visual: ${pnl.visualDescription}`, 25, 160, 10, 5.5, "courier", "normal", [50, 50, 50]);
            
            if (pnl.cameraMovement) {
              printText(`Dinâmica da Câmera: ${pnl.cameraMovement}`, 25, 160, 9.5, 5, "courier", "italic", [80, 80, 80]);
            }
            if (pnl.soundEffects) {
              printText(`SFX: // ${pnl.soundEffects.toUpperCase()} //`, 25, 160, 10, 5.5, "courier", "bold", [25, 25, 25]);
            }
            if (pnl.narration) {
              printText(`_RECORDATÓRIO:_ "${pnl.narration}"`, 40, 130, 9.5, 5, "courier", "italic", [70, 70, 70]);
            }
            if (pnl.dialogue) {
              const dialogLines = parseDialogueLines(pnl.dialogue);
              dialogLines.forEach((dl) => {
                y += 2;
                if (dl.charName) {
                  printText(dl.charName, 105, 100, 9.5, 5, "courier", "bold", [20, 20, 20], true);
                }
                printText(`"${dl.text}"`, 60, 90, 10, 5.5, "courier", "normal", [50, 50, 50]);
                y += 1.5;
              });
            }
            if (pnl.artistNotes) {
              printText(`Nota Técnica de Sarjeta: ${pnl.artistNotes}`, 25, 160, 9, 5, "courier", "italic", [110, 110, 110]);
            }
            y += 6;
          });
          y += 8;
        });

      // ----------------- TEMPLATE EDITORIAL HELVETICA -----------------
      } else if (pdfTemplate === "EDITORIAL") {
        y = 45;
        printText(project.settings.title.toUpperCase(), 105, 150, 26, 12, "helvetica", "bold", [17, 24, 39], true);
        y += 10;
        printText(`Formato Editoral: ${project.settings.format} • Gênero Literário: ${project.settings.genre}`, 105, 150, 11, 6, "helvetica", "italic", [100, 116, 139], true);
        printText(`Estilo Solicitado: ${project.settings.style}`, 105, 150, 10.5, 5, "helvetica", "normal", [100, 116, 139], true);
        y += 18;

        doc.setFillColor(31, 41, 55);
        doc.rect(20, y, 170, 1.2, "F");
        y += 15;

        printText("A PREMISSA DRAMÁTICA", 20, 170, 13, 8, "helvetica", "bold", [17, 24, 39]);
        y += 2;
        printText(project.settings.premise, 20, 170, 10.5, 6, "helvetica", "normal", [71, 85, 105]);
        y += 12;

        printText("CONCEPÇÃO DE CONCORDÂNCIA E PERSONAGENS", 20, 170, 13, 8, "helvetica", "bold", [17, 24, 39]);
        y += 3;
        project.characters.forEach((c) => {
          printText(`${c.name} (${c.archetype})`, 20, 170, 11, 6, "helvetica", "bold", [31, 41, 55]);
          printText(`Alvo Próprio: ${c.objective} | Ponto Fraco: ${c.weakness}`, 20, 170, 9.5, 5, "helvetica", "normal", [100, 116, 139]);
          y += 2.5;
        });

        doc.addPage();
        pageNum = 2;
        drawHeaderFooter(pageNum);
        y = 25;

        project.pages.forEach((p) => {
          checkSpace(25);
          printText(`PÁGINA ${p.pageNumber}`, 20, 170, 15, 9, "helvetica", "bold", [17, 24, 39]);
          if (p.rhythmNotes) {
            printText(`Ritmo e Fluxo de Enquadramento: ${p.rhythmNotes}`, 20, 170, 9.5, 5.5, "helvetica", "italic", [100, 116, 139]);
          }
          y += 4;
          doc.setFillColor(226, 232, 240);
          doc.rect(20, y, 170, 0.5, "F");
          y += 6;

          p.panels.forEach((pnl) => {
            checkSpace(32);
            
            doc.setFillColor(241, 245, 249);
            doc.rect(20, y, 170, 7.5, "F");
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10.5);
            doc.setTextColor(30, 41, 59);
            doc.text(`QUADRO ${pnl.panelNumber}`, 24, y + 5.2);
            doc.text(`${(pnl.framing || "Plano Geral").toUpperCase()}`, 186, y + 5.2, { align: "right" });
            y += 11;

            printText(`Cena: ${pnl.visualDescription}`, 24, 162, 10, 5.5, "helvetica", "normal", [51, 65, 85]);
            
            if (pnl.cameraMovement) {
              printText(`Movimento Proposto: ${pnl.cameraMovement}`, 24, 162, 9, 5, "helvetica", "italic", [100, 116, 139]);
            }
            if (pnl.soundEffects) {
              printText(`Efeitos de Som (SFX): ${pnl.soundEffects}`, 24, 162, 10, 5.5, "helvetica", "bold", [13, 148, 136]);
            }
            if (pnl.narration) {
              y += 1.5;
              printText(`[Recordatório] ${pnl.narration}`, 28, 154, 9.5, 5, "helvetica", "italic", [71, 85, 105]);
            }
            if (pnl.dialogue) {
              const dialogLines = parseDialogueLines(pnl.dialogue);
              dialogLines.forEach((dl) => {
                y += 2;
                const displayText = dl.charName ? `${dl.charName}: ${dl.text}` : dl.text;
                printText(`FALAS • ${displayText}`, 28, 154, 10, 5.5, "helvetica", "normal", [15, 23, 42]);
              });
            }
            if (pnl.artistNotes) {
              printText(`Direção ao Desenhista: ${pnl.artistNotes}`, 24, 162, 9, 5, "helvetica", "italic", [148, 163, 184]);
            }
            y += 6;
          });
          y += 10;
        });

      // ----------------- TEMPLATE DE DECUPAGEM GRADE / STUDIO -----------------
      } else if (pdfTemplate === "STUDIO") {
        y = 45;
        printText(project.settings.title.toUpperCase(), 105, 150, 24, 11, "helvetica", "bold", [15, 23, 42], true);
        y += 10;
        printText(`FOLHA TÉCNICA DE PRODUÇÃO GRÁFICA`, 105, 150, 10, 6, "helvetica", "bold", [100, 116, 139], true);
        printText(`Gênero: ${project.settings.genre} • Formato: ${project.settings.format}`, 105, 150, 10, 6, "helvetica", "normal", [100, 116, 139], true);
        y += 15;

        doc.setFillColor(34, 197, 94);
        doc.circle(105, y, 3, "F");
        y += 15;

        printText("ORIENTAÇÃO DE ENREDO DO DIRETOR", 20, 170, 12, 7, "helvetica", "bold", [15, 23, 42]);
        y += 2;
        printText(project.settings.premise, 20, 170, 10, 5.5, "helvetica", "normal", [71, 85, 105]);
        y += 10;

        printText("MATRIZ DE PERSONAGENS TÉCNICOS", 20, 170, 12, 7, "helvetica", "bold", [15, 23, 42]);
        y += 2;
        project.characters.forEach((c) => {
          printText(`• ELENCO: ${c.name} (${c.archetype})`, 25, 165, 10.5, 5.5, "helvetica", "bold", [30, 41, 59]);
          printText(`  Diretriz do Script: ${c.objective}`, 25, 165, 9.5, 5, "helvetica", "normal", [100, 116, 139]);
          y += 2;
        });

        doc.addPage();
        pageNum = 2;
        drawHeaderFooter(pageNum);
        y = 25;

        project.pages.forEach((p) => {
          checkSpace(32);
          printText(`FICHA DA PÁGINA: ${p.pageNumber}`, 20, 170, 14, 8, "helvetica", "bold", [15, 23, 42]);
          if (p.rhythmNotes) {
            printText(`Direção Narrativa / Ritmo da Página: ${p.rhythmNotes}`, 20, 170, 9.5, 5, "helvetica", "italic", [100, 116, 139]);
          }
          y += 4;
          doc.setDrawColor(15, 23, 42);
          doc.setLineWidth(0.5);
          doc.line(20, y, 190, y);
          y += 6;

          p.panels.forEach((pnl) => {
            checkSpace(38);

            // Row header box
            doc.setFillColor(15, 23, 42);
            doc.rect(20, y, 170, 6.5, "F");
            doc.setFont("helvetica", "bold");
            doc.setFontSize(9);
            doc.setTextColor(255, 255, 255);
            doc.text(`QUADRO ${pnl.panelNumber} [ ${(pnl.framing || "Plano Geral").toUpperCase()} ]`, 24, y + 4.5);
            y += 10;

            let colLeftY = y;
            let colRightY = y;

            const printColLeft = (label: string, value: string) => {
              doc.setFont("helvetica", "bold");
              doc.setFontSize(8);
              doc.setTextColor(100, 116, 139);
              doc.text(label.toUpperCase(), 24, colLeftY);
              colLeftY += 4.5;
              
              doc.setFont("helvetica", "normal");
              doc.setFontSize(9);
              doc.setTextColor(15, 23, 42);
              const lines = doc.splitTextToSize(value, 42);
              for (let line of lines) {
                if (colLeftY > 270) break;
                doc.text(line, 24, colLeftY);
                colLeftY += 4.5;
              }
              colLeftY += 2;
            };

            const printColRight = (label: string, value: string, style: "normal" | "bold" | "italic" = "normal") => {
              doc.setFont("helvetica", "bold");
              doc.setFontSize(8);
              doc.setTextColor(148, 163, 184);
              doc.text(label.toUpperCase(), 75, colRightY);
              colRightY += 4.5;

              doc.setFont("helvetica", style);
              doc.setFontSize(9.5);
              doc.setTextColor(30, 41, 59);
              const lines = doc.splitTextToSize(value, 110);
              for (let line of lines) {
                if (colRightY > 270) break;
                doc.text(line, 75, colRightY);
                colRightY += 4.8;
              }
              colRightY += 3;
            };

            printColLeft("Enquadramento / Pos", pnl.cameraMovement || "Estabilizador Fixo");
            if (pnl.soundEffects) {
              printColLeft("Gatilho Sonoro / SFX", pnl.soundEffects);
            }
            if (pnl.artistNotes) {
              printColLeft("Instrução Técnica", pnl.artistNotes);
            }

            printColRight("Descrição Plástica do Quadro", pnl.visualDescription);
            if (pnl.narration) {
              printColRight("Recordatório", pnl.narration, "italic");
            }
            if (pnl.dialogue) {
              const dialogLines = parseDialogueLines(pnl.dialogue);
              const formattedText = dialogLines.map(dl => dl.charName ? `${dl.charName}: ${dl.text}` : dl.text).join("\n");
              printColRight("Voz Dramática / Balão", formattedText);
            }

            y = Math.max(colLeftY, colRightY) + 4;
            
            doc.setDrawColor(226, 232, 240);
            doc.setLineWidth(0.25);
            doc.line(20, y - 2, 190, y - 2);
          });
          y += 8;
        });
      }

      const filename = project.settings.title.toLowerCase().replace(/\s+/g, "-") || "meu-roteiro";
      doc.save(`${filename}.pdf`);
    } catch (err) {
      console.error(err);
      alert("Houve um problema ao compilar o arquivo PDF estruturado. Verifique se o título do projeto ou o conteúdo é válido.");
    }
  };

  const getExportContent = () => {
    switch (exportFormat) {
      case "MD": return generateMarkdownFormat();
      case "TXT": return generateTxtFormat();
      case "JSON": return generateJsonFormat();
      case "PDF": return generateMarkdownFormat(); // fallback plain-text representer
      case "DOCX": return generateDocxFormat();
      case "FDX": return generateFinalDraftFormat();
      case "CELTX": return generateCeltxFormat();
      default: return generateMarkdownFormat();
    }
  };

  const activeContent = getExportContent();

  const handleDownload = () => {
    if (exportFormat === "PDF") {
      exportPdf();
      return;
    }

    const filename = project.settings.title.toLowerCase().replace(/\s+/g, "-") || "meu-roteiro";
    let mimeType = "text/plain";
    if (exportFormat === "JSON") mimeType = "application/json";
    if (exportFormat === "DOCX") mimeType = "application/msword";
    if (exportFormat === "FDX") mimeType = "application/xml";
    if (exportFormat === "CELTX") mimeType = "text/html";

    const element = document.createElement("a");
    const file = new Blob([activeContent], { type: mimeType });
    element.href = URL.createObjectURL(file);
    
    switch (exportFormat) {
      case "MD":
        element.download = `${filename}.md`;
        break;
      case "TXT":
        element.download = `${filename}.txt`;
        break;
      case "JSON":
        element.download = `${filename}.json`;
        break;
      case "DOCX":
        element.download = `${filename}.docx`;
        break;
      case "FDX":
        element.download = `${filename}.fdx`;
        break;
      case "CELTX":
        element.download = `${filename}.html`;
        break;
    }
    
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleCopy = () => {
    if (exportFormat === "PDF") {
      navigator.clipboard.writeText(`Roteiro de Novela Gráfica: ${project.settings.title}\n` + generateMarkdownFormat());
      setCopied(true);
      setCopiedStateMessage("Estrutura Copiada!");
      setTimeout(() => {
        setCopied(false);
        setCopiedStateMessage("Copiar Todo o Conteúdo");
      }, 2050);
      return;
    }

    navigator.clipboard.writeText(activeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2050);
  };


  return (
    <div id="export-panel" className="bg-art-card border border-art-border rounded p-6 max-w-7xl mx-auto space-y-6 text-xs shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-art-border pb-4 gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-art-charcoal flex items-center gap-2">
            <Download className="h-5 w-5 text-art-charcoal" />
            Módulo de Exportação Literária
          </h2>
          <p className="text-stone-605 text-xs italic mt-1 font-serif">
            Gere cópias diagramadas prontas para encaminhar ao artista ou submeter a convocatórias e editais de quadrinhos nacionais.
          </p>
        </div>

        {/* Formats selectors */}
        <div className="flex bg-art-sidebar p-1 rounded border border-art-border overflow-x-auto max-w-full shrink-0">
          <button
            id="btn-export-type-md"
            onClick={() => setExportFormat("MD")}
            className={`px-3 py-1.5 text-[10px] sm:px-3.5 sm:py-1.5 font-sans font-bold uppercase tracking-wider rounded transition-all cursor-pointer ${
              exportFormat === "MD" ? "bg-art-charcoal text-art-bg shadow-3xs" : "text-stone-550 hover:text-art-charcoal"
            }`}
          >
            Markdown
          </button>
          <button
            id="btn-export-type-txt"
            onClick={() => setExportFormat("TXT")}
            className={`px-3 py-1.5 text-[10px] sm:px-3.5 sm:py-1.5 font-sans font-bold uppercase tracking-wider rounded transition-all cursor-pointer ${
              exportFormat === "TXT" ? "bg-art-charcoal text-art-bg shadow-3xs" : "text-stone-550 hover:text-art-charcoal"
            }`}
          >
            Draft (.txt)
          </button>
          <button
            id="btn-export-type-pdf"
            onClick={() => setExportFormat("PDF")}
            className={`px-3 py-1.5 text-[10px] sm:px-3.5 sm:py-1.5 font-sans font-bold uppercase tracking-wider rounded transition-all cursor-pointer ${
              exportFormat === "PDF" ? "bg-art-charcoal text-art-bg shadow-3xs" : "text-stone-550 hover:text-art-charcoal"
            }`}
          >
            PDF (.pdf)
          </button>
          <button
            id="btn-export-type-docx"
            onClick={() => setExportFormat("DOCX")}
            className={`px-3 py-1.5 text-[10px] sm:px-3.5 sm:py-1.5 font-sans font-bold uppercase tracking-wider rounded transition-all cursor-pointer ${
              exportFormat === "DOCX" ? "bg-art-charcoal text-art-bg shadow-3xs" : "text-stone-550 hover:text-art-charcoal"
            }`}
          >
            Word (.docx)
          </button>
          <button
            id="btn-export-type-fdx"
            onClick={() => setExportFormat("FDX")}
            className={`px-3 py-1.5 text-[10px] sm:px-3.5 sm:py-1.5 font-sans font-bold uppercase tracking-wider rounded transition-all cursor-pointer ${
              exportFormat === "FDX" ? "bg-art-charcoal text-art-bg shadow-3xs" : "text-stone-550 hover:text-art-charcoal"
            }`}
          >
            Final Draft (.fdx)
          </button>
          <button
            id="btn-export-type-celtx"
            onClick={() => setExportFormat("CELTX")}
            className={`px-3 py-1.5 text-[10px] sm:px-3.5 sm:py-1.5 font-sans font-bold uppercase tracking-wider rounded transition-all cursor-pointer ${
              exportFormat === "CELTX" ? "bg-art-charcoal text-art-bg shadow-3xs" : "text-stone-550 hover:text-art-charcoal"
            }`}
          >
            Celtx (.html)
          </button>
          <button
            id="btn-export-type-json"
            onClick={() => setExportFormat("JSON")}
            className={`px-3 py-1.5 text-[10px] sm:px-3.5 sm:py-1.5 font-sans font-bold uppercase tracking-wider rounded transition-all cursor-pointer ${
              exportFormat === "JSON" ? "bg-art-charcoal text-art-bg shadow-3xs" : "text-stone-550 hover:text-art-charcoal"
            }`}
          >
            JSON
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Live Scrollable Preview box */}
        <div id="export-preview-box" className="md:col-span-8 space-y-4">
          {exportFormat === "PDF" ? (
            <div className="space-y-4">
              <div className="bg-art-sidebar/20 p-4 border border-art-border rounded space-y-3">
                <span className="text-[10px] font-mono font-bold text-stone-550 uppercase tracking-widest block leading-none">
                  Escolha o Template de Diagramação Literária
                </span>
                
                {/* PDF Template selector cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    id="btn-pdf-template-classic"
                    onClick={() => setPdfTemplate("CLASSIC")}
                    className={`p-3 rounded border text-left cursor-pointer transition-all flex flex-col gap-1.5 shadow-3xs ${
                      pdfTemplate === "CLASSIC"
                        ? "border-art-charcoal bg-art-bg ring-1 ring-art-charcoal"
                        : "border-art-border bg-art-card hover:bg-art-sidebar/20"
                    }`}
                  >
                    <span className="flex items-center gap-1.5 font-sans font-bold uppercase tracking-wider text-[10px] text-art-charcoal">
                      <Printer className="h-3.5 w-3.5" />
                      Clássico Courier
                    </span>
                    <span className="text-[10px] text-stone-650 font-serif leading-tight">
                      Modelo hollywoodiano tradicional em fonte monoespaçada com falas centralizadas e recuo largo.
                    </span>
                  </button>

                  <button
                    id="btn-pdf-template-editorial"
                    onClick={() => setPdfTemplate("EDITORIAL")}
                    className={`p-3 rounded border text-left cursor-pointer transition-all flex flex-col gap-1.5 shadow-3xs ${
                      pdfTemplate === "EDITORIAL"
                        ? "border-art-charcoal bg-art-bg ring-1 ring-art-charcoal"
                        : "border-art-border bg-art-card hover:bg-art-sidebar/20"
                    }`}
                  >
                    <span className="flex items-center gap-1.5 font-sans font-bold uppercase tracking-wider text-[10px] text-art-charcoal">
                      <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                      Sleek Editorial
                    </span>
                    <span className="text-[10px] text-stone-650 font-serif leading-tight">
                      Visual contemporâneo minimalista em fonte sem serifa. Linhas finas de divisão e tags de quadros.
                    </span>
                  </button>

                  <button
                    id="btn-pdf-template-studio"
                    onClick={() => setPdfTemplate("STUDIO")}
                    className={`p-3 rounded border text-left cursor-pointer transition-all flex flex-col gap-1.5 shadow-3xs ${
                      pdfTemplate === "STUDIO"
                        ? "border-art-charcoal bg-art-bg ring-1 ring-art-charcoal"
                        : "border-art-border bg-art-card hover:bg-art-sidebar/20"
                    }`}
                  >
                    <span className="flex items-center gap-1.5 font-sans font-bold uppercase tracking-wider text-[10px] text-art-charcoal">
                      <Columns className="h-3.5 w-3.5" />
                      Grade de Estúdio
                    </span>
                    <span className="text-[10px] text-stone-650 font-serif leading-tight">
                      Layout de duas colunas técnicas dividindo enquadramentos de câmera e onomatopeias dos blocos visuais e balões.
                    </span>
                  </button>
                </div>
              </div>

              {/* Elegant Virtual Document Sheet representation */}
              <div className="bg-stone-100 p-4 sm:p-8 rounded border border-art-border flex justify-center shadow-inner">
                <div className="w-full max-w-[540px] bg-white border border-stone-250 shadow-sm p-6 sm:p-8 min-h-[460px] font-serif flex flex-col justify-between rounded-xs">
                  <div className="space-y-4">
                    {/* Virtual Doc top header decoration */}
                    <div className="flex justify-between items-center text-[7.5px] font-mono text-stone-400 border-b border-stone-200 pb-1.5 leading-none">
                      <span className="uppercase tracking-widest truncate max-w-[200px]">{project.settings.title.toUpperCase()}</span>
                      <span>TEMPLATE: {pdfTemplate === "CLASSIC" ? "COURIER" : pdfTemplate === "EDITORIAL" ? "HELVETICA" : "GRADE DE ESTÚDIO"}</span>
                    </div>

                    {/* Styled preview page base content placeholder depending on chosen template */}
                    {pdfTemplate === "CLASSIC" && (
                      <div className="space-y-4 font-mono text-stone-700 text-[10px] leading-relaxed">
                        <div className="text-center font-bold text-xs tracking-tight mb-4">
                          PÁGINA 1
                        </div>
                        <div className="italic text-stone-450 text-[9.5px]">
                          [Nota de Ritmo: {project.pages[0]?.rhythmNotes || "Início com suspense e ritmo acelerado de planos."}]
                        </div>
                        <div className="border-t border-stone-100 pt-1.5 font-bold text-stone-850">
                          QUADRO 1 [ { (project.pages[0]?.panels[0]?.framing || "Plano Geral").toUpperCase() } ]
                        </div>
                        <div className="pl-3 border-l-2 border-stone-300 text-stone-600 italic text-[9.5px] bg-stone-50 py-0.5">
                          Ação Visual: {project.pages[0]?.panels[0]?.visualDescription || "Ruas sombrias cobertas por uma névoa espessa..."}
                        </div>
                        
                        <div className="space-y-0.5 pt-1.5">
                          <div className="text-center font-bold text-[9px] uppercase tracking-wide">
                            {project.pages[0]?.panels[0]?.dialogue?.split(":")[0]?.toUpperCase() || "PERSONAGEM"}
                          </div>
                          <div className="px-10 sm:px-14 text-center leading-normal italic text-[9.5px] text-stone-605">
                            "{project.pages[0]?.panels[0]?.dialogue?.includes(":") ? project.pages[0]?.panels[0]?.dialogue.split(":")[1].trim() : project.pages[0]?.panels[0]?.dialogue || "Não há tempo a perder!"}"
                          </div>
                        </div>
                      </div>
                    )}

                    {pdfTemplate === "EDITORIAL" && (
                      <div className="space-y-4 font-sans text-stone-800 text-[10px]">
                        <div className="flex justify-between items-end border-b-2 border-stone-800 pb-1 leading-none">
                          <h3 className="font-bold text-xs">PÁGINA 1</h3>
                          <span className="text-[9px] text-stone-500 italic font-medium">{project.pages[0]?.rhythmNotes || "Direção rápida"}</span>
                        </div>

                        <div className="bg-stone-50 p-3 border border-stone-200 rounded text-stone-605 space-y-2">
                          <div className="flex justify-between items-center font-bold text-[9px] text-stone-800 border-b border-stone-150 pb-1 mb-1 leading-none">
                            <span>QUADRO 1</span>
                            <span className="text-stone-500 uppercase tracking-wider">{ (project.pages[0]?.panels[0]?.framing || "Plano Geral").toUpperCase() }</span>
                          </div>
                          <p className="leading-relaxed font-sans text-[10.5px]">
                            <strong>Imagem:</strong> {project.pages[0]?.panels[0]?.visualDescription}
                          </p>
                          {project.pages[0]?.panels[0]?.dialogue && (
                            <div className="bg-white p-2 rounded border border-stone-150 text-[10px]">
                              <span className="font-bold uppercase text-[8px] text-stone-400 block mb-0.5 leading-none">Voz Balão</span>
                              <p className="font-sans italic">"{project.pages[0]?.panels[0]?.dialogue}"</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {pdfTemplate === "STUDIO" && (
                      <div className="space-y-3 font-sans text-stone-800 text-[9.5px]">
                        <div className="border-b border-stone-800 pb-1 leading-none">
                          <span className="text-[8px] font-bold tracking-widest text-stone-400 block uppercase mb-0.5">ESTÚDIO DE COPADO</span>
                          <h3 className="font-bold text-xs text-stone-900">PÁGINA 1</h3>
                        </div>

                        {/* Interactive Split Grid */}
                        <div className="border border-stone-250 rounded overflow-hidden">
                          <div className="bg-stone-900 text-white font-bold text-[8px] p-1.5 px-2.5 flex justify-between leading-none">
                            <span>QUADRO 1</span>
                            <span>{ (project.pages[0]?.panels[0]?.framing || "Plano Médio").toUpperCase() }</span>
                          </div>
                          <div className="grid grid-cols-12 divide-x divide-stone-200">
                            <div className="col-span-4 p-2 bg-stone-50 space-y-2 text-[8px] leading-tight">
                              <div>
                                <span className="font-bold text-stone-400 block uppercase text-[7px] leading-none mb-0.5">Enquadramento</span>
                                <span>{project.pages[0]?.panels[0]?.cameraMovement || "Estática / Fixo"}</span>
                              </div>
                              {project.pages[0]?.panels[0]?.soundEffects && (
                                <div>
                                  <span className="font-bold text-stone-400 block uppercase text-[7px] leading-none mb-0.5">SFX Onomatopeia</span>
                                  <span className="font-semibold text-stone-800">{project.pages[0]?.panels[0]?.soundEffects}</span>
                                </div>
                              )}
                            </div>
                            <div className="col-span-8 p-2.5 space-y-1.5 text-[9px] leading-relaxed">
                              <div>
                                <span className="font-bold text-stone-400 block uppercase text-[7.5px] leading-none mb-0.5">Descrição Física do Painel</span>
                                <p className="text-stone-605">{project.pages[0]?.panels[0]?.visualDescription}</p>
                              </div>
                              {project.pages[0]?.panels[0]?.dialogue && (
                                <div>
                                  <span className="font-bold text-stone-400 block uppercase text-[7.5px] leading-none mb-0.5">Falas e Recordatórios</span>
                                  <p className="italic font-normal text-stone-800">"{project.pages[0]?.panels[0]?.dialogue}"</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="text-center text-[8px] font-mono text-stone-400 pt-4 border-t border-stone-150 leading-none">
                    * Simulação do layout. O PDF gerado incluirá todas as {project.pages.length} páginas configuradas no projeto.
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[10px] font-mono text-stone-550 uppercase tracking-widest font-bold">
                <span>Visualização Prévia do Script</span>
                <span>{activeContent.split("\n").length} linhas formatadas</span>
              </div>

              <div className="bg-stone-900 text-stone-200 p-5 rounded font-mono text-xs overflow-auto max-h-[480px] border border-art-charcoal leading-relaxed shadow-inner">
                <pre className="whitespace-pre-wrap">{activeContent}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Action Panel and Tips Sidebar */}
        <div className="md:col-span-4 bg-art-sidebar/10 border border-art-border rounded p-5 space-y-4 h-fit shadow-3xs">
          <h3 className="font-serif font-bold text-xs uppercase text-art-charcoal border-b border-art-border pb-2.5">
            Ações e Destinos do Roteiro
          </h3>

          <div className="space-y-2.5">
            <button
              id="btn-export-download"
              onClick={handleDownload}
              className="w-full bg-art-charcoal hover:bg-stone-850 text-art-bg font-sans font-bold text-xs py-3 px-4 rounded flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer uppercase tracking-widest"
            >
              <Download className="h-4 w-4" />
              {exportFormat === "PDF" ? "Compilar Documento PDF" : "Download do Script"}
            </button>

            <button
              id="btn-export-copy"
              onClick={handleCopy}
              className="w-full bg-art-card hover:bg-art-sidebar text-art-charcoal font-sans font-bold text-xs py-3 px-4 border border-art-border rounded flex items-center justify-center gap-2 transition-all shadow-3xs cursor-pointer uppercase tracking-widest"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-emerald-650 flex-shrink-0" />
                  {exportFormat === "PDF" ? "Copiado Markdown!" : "Copiado com Sucesso!"}
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  {exportFormat === "PDF" ? copiedStateMessage : "Copiar Todo o Conteúdo"}
                </>
              )}
            </button>
          </div>

          <div className="border-t border-art-border pt-4 space-y-3">
            <h4 className="text-[10px] font-mono font-bold text-stone-550 uppercase tracking-widest leading-none">
              Diferença dos Formatos:
            </h4>

            <div className="space-y-3">
              {exportFormat === "PDF" ? (
                <div className="space-y-3">
                  <div className="flex gap-2 items-start bg-art-card p-2.5 rounded border border-art-border shadow-3xs">
                    <Printer className="h-4 w-4 text-art-charcoal shrink-0 mt-0.5" />
                    <p className="text-[10px] text-stone-650 leading-tight font-serif mt-0.5">
                      <strong>Impressão Física:</strong> Perfeito para revisar à mão, levar à gráfica ou apresentar a editais oficiais que exigem PDF fechado.
                    </p>
                  </div>
                  <div className="flex gap-2 items-start bg-art-card p-2.5 rounded border border-art-border shadow-3xs">
                    <Columns className="h-4 w-4 text-art-charcoal shrink-0 mt-0.5" />
                    <p className="text-[10px] text-stone-650 leading-tight font-serif mt-0.5">
                      <strong>Presets Profissionais:</strong> Classico Courier (hollywoodiano), Minimalista Editorial (moderno), ou Grade Técnica de Estúdio para desenhistas.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex gap-2 items-start bg-art-card p-2.5 rounded border border-art-border shadow-3xs">
                    <File className="h-4 w-4 text-art-charcoal shrink-0 mt-0.5" />
                    <p className="text-[10px] text-stone-650 leading-tight font-serif mt-0.5">
                      <strong>Markdown (.md):</strong> Excelente para formatação rica no Obsidian ou blogs. Preserva cabeçalhos e negritos na formatação final.
                    </p>
                  </div>

                  <div className="flex gap-2 items-start bg-art-card p-2.5 rounded border border-art-border shadow-3xs">
                    <FileText className="h-4 w-4 text-art-charcoal shrink-0 mt-0.5" />
                    <p className="text-[10px] text-stone-650 leading-tight font-serif mt-0.5">
                      <strong>Standard Draft (.txt):</strong> Formato limpo e universal para leitura por diagramadores, desenhistas e atores de voz dramática.
                    </p>
                  </div>

                  <div className="flex gap-2 items-start bg-art-card p-2.5 rounded border border-art-border shadow-3xs">
                    <File className="h-4 w-4 text-art-charcoal shrink-0 mt-0.5" />
                    <p className="text-[10px] text-stone-650 leading-tight font-serif mt-0.5">
                      <strong>Word (.docx):</strong> Documento Rich Text estruturado que abre nativamente no Microsoft Word ou LibreOffice com tabelas e estilos.
                    </p>
                  </div>

                  <div className="flex gap-2 items-start bg-art-card p-2.5 rounded border border-art-border shadow-3xs">
                    <Code className="h-4 w-4 text-art-charcoal shrink-0 mt-0.5" />
                    <p className="text-[10px] text-stone-650 leading-tight font-serif mt-0.5">
                      <strong>Final Draft (.fdx):</strong> Padrão de XML estruturado da indústria cinematográfica e de roteiros, mantendo tags de diálogo, cena e ações limpas.
                    </p>
                  </div>

                  <div className="flex gap-2 items-start bg-art-card p-2.5 rounded border border-art-border shadow-3xs">
                    <FileText className="h-4 w-4 text-art-charcoal shrink-0 mt-0.5" />
                    <p className="text-[10px] text-stone-650 leading-tight font-serif mt-0.5">
                      <strong>Celtx (.html):</strong> HTML estruturado em tags de roteiro sequencial, perfeito para importação suave em ferramentas web como Celtx.
                    </p>
                  </div>

                  <div className="flex gap-2 items-start bg-art-card p-2.5 rounded border border-art-border shadow-3xs">
                    <Code className="h-4 w-4 text-art-charcoal shrink-0 mt-0.5" />
                    <p className="text-[10px] text-stone-650 leading-tight font-serif mt-0.5">
                      <strong>Dados (.json):</strong> Dados crus e fáceis de importar para backup do projeto em outras ferramentas ou estúdios analógicos secundários.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
