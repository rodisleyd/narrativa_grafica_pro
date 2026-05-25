# 📝 Narrativa Gráfica Pro

O **Narrativa Gráfica Pro** é um aplicativo moderno, didático e profissional projetado para escritores, professores, alunos e entusiastas criarem roteiros de Histórias em Quadrinhos (HQs), tirinhas e mangás de alta qualidade dramática e visual.

Este projeto está pronto como um **Progressive Web App (PWA)**, configurado para controle de versão com **GitHub** e preparado para deploy serverless na **Vercel**.

---

## ✨ Funcionalidades Principais

*   **Wizard de Projetos:** Criação guiada definindo formato (mangá, tira, graphic novel), estilo visual, gênero e público.
*   **Arquitetura Narrativa & Plotter:** Estruture sua história em Atos (Robert McKee), Batidas (Save the Cat), Jornada do Herói ou 7 Passos Orgânicos (John Truby). Decupe um argumento inteiro página por página, controlando a intensidade de drama de forma dinâmica.
*   **Editor de Roteiro Profissional:** Quatro modos de escrita (Simples, Pro, Visual, Tirinha), presets de composição de quadros (Regra dos Terços, Simetria, Silhueta), transições de Scott McCloud e enquadramentos de câmera.
*   **Assistência e Análise Crítica por IA:** IA integrada (Gemini 3.5 Flash) para revisar roteiros, desenhar gráficos de curvas emocionais, melhorar diálogos, sugerir enquadramentos e onomatopeias.
*   **Escola Didática:** Microaulas e enciclopédia teórica de storytelling.
*   **Exportador Multi-formato:** Compilação do script em Markdown (.md), Draft (.txt), Word (.docx), Final Draft (.fdx), Celtx (.html) ou PDF diagramado profissionalmente.

---

## 📱 Progressive Web App (PWA)

O aplicativo conta com suporte completo a PWA:
*   **Manifesto (`manifest.json`):** Permite a instalação como um aplicativo nativo no computador (Windows/macOS) ou celular (Android/iOS).
*   **Service Worker (`sw.js`):** Gerencia o cache dinâmico de recursos estáticos para permitir o funcionamento e visualização offline das telas principais.
*   **Ícones Otimizados:** Ícones de alta resolução pré-renderizados para todas as plataformas.

---

## 🛠️ Executando Localmente

### Pré-requisitos
*   Node.js instalado (v18 ou superior).

### Instalação
1.  Instale as dependências:
    ```bash
    npm install
    ```
2.  Duplique o arquivo `.env.example` para `.env`:
    ```bash
    cp .env.example .env
    ```
3.  Abra o arquivo `.env` e insira sua chave da API do Gemini:
    ```env
    GEMINI_API_KEY=sua_chave_aqui
    ```
4.  Inicie o servidor de desenvolvimento local:
    ```bash
    npm run dev
    ```
5.  Acesse o aplicativo em [http://localhost:3000](http://localhost:3000).

---

## 🚀 Como Enviar para o GitHub

Para criar um repositório no GitHub e fazer o envio do seu código local, siga este passo a passo no terminal:

1.  **Inicialize o Git** na pasta do projeto (caso não tenha feito):
    ```bash
    git init
    ```
2.  **Adicione os arquivos** ao controle de versão:
    ```bash
    git add .
    ```
3.  **Faça o primeiro commit**:
    ```bash
    git commit -m "feat: setup inicial, PWA e configurações do Vercel"
    ```
4.  **Crie um repositório vazio no GitHub** (público ou privado).
5.  **Vincule o repositório remoto** (substitua com o link do seu repositório):
    ```bash
    git remote add origin https://github.com/seu-usuario/narrativa-grafica-pro.git
    ```
6.  **Altere o nome da branch principal** para `main`:
    ```bash
    git branch -M main
    ```
7.  **Envie o código**:
    ```bash
    git push -u origin main
    ```

---

## ☁️ Como Fazer Deploy na Vercel

O projeto está configurado para deploy imediato no **Vercel** usando Serverless Functions para o backend (Express) e CDN Estática para o frontend (Vite).

### Método 1: Pelo site do Vercel (Recomendado)
1.  Acesse [vercel.com](https://vercel.com) e crie/faça login em sua conta.
2.  Clique em **"Add New" > "Project"**.
3.  Importe o repositório do GitHub criado na etapa anterior.
4.  Nas configurações do projeto, sob **Environment Variables (Variáveis de Ambiente)**, adicione a chave do Gemini:
    *   **Name:** `GEMINI_API_KEY`
    *   **Value:** `sua_chave_aqui`
5.  Clique em **"Deploy"**. A Vercel lerá o arquivo `vercel.json` e configurará as rotas automaticamente.

### Método 2: Pelo terminal (Vercel CLI)
1.  Instale a Vercel CLI globalmente:
    ```bash
    npm install -g vercel
    ```
2.  Faça login:
    ```bash
    vercel login
    ```
3.  Inicie o deploy na pasta raiz do projeto:
    ```bash
    vercel
    ```
4.  Configure as variáveis de ambiente no dashboard do projeto no site da Vercel (`GEMINI_API_KEY`).
5.  Promova para produção:
    ```bash
    vercel --prod
    ```
