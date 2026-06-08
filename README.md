# IMAGEM P7 — Banco de Questões de Neuroimagem

Plataforma web de banco de questões de neuroimagem para estudantes do 7º período (P7) da **UNIMA Afya**.

**Monitores:** Johseph Carvalho · Lucas Gabriel · José Petrúcio · Rafael Viana  
**Professora:** Érica Oliveira Alves Cardoso

---

## Como rodar localmente

### Pré-requisito: instalar Node.js

Baixe e instale o Node.js LTS em: https://nodejs.org

### Instalar e rodar

```bash
cd imagem-p7
npm install
npm run dev
```

Acesse em: http://localhost:5173

### Build para produção

```bash
npm run build
npm run preview
```

---

## Configurar Google Drive (para exibir PDFs/imagens)

Para que os materiais de referência abram no site, os arquivos precisam estar **compartilhados publicamente**:

1. Acesse o Google Drive com sua conta UNIMA
2. Clique com o botão direito no arquivo (PDF ou PPTX)
3. Selecione **"Compartilhar"**
4. Em "Acesso geral", escolha **"Qualquer pessoa com o link"**
5. Permissão: **"Leitor"**
6. Clique em **"Copiar link"** e depois **"Concluído"**

Repita para todos os arquivos de aula.

---

## Estrutura de pastas

```
imagem-p7/
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── src/
    ├── types/           # Interfaces TypeScript
    │   └── index.ts
    ├── data/            # Banco de questões e tópicos
    │   ├── questions.ts
    │   └── topics.ts
    ├── store/           # Estado global (Zustand + localStorage)
    │   └── index.ts
    ├── utils/           # Funções de cálculo de estatísticas
    │   └── stats.ts
    ├── services/        # Integração Google Drive
    │   └── driveImages.ts
    ├── components/      # Componentes reutilizáveis
    │   ├── Header.tsx
    │   ├── StatCard.tsx
    │   ├── TopicBadge.tsx
    │   ├── DifficultyBadge.tsx
    │   ├── ProgressRing.tsx
    │   ├── DriveImage.tsx
    │   └── QuestionCard.tsx
    ├── pages/           # Páginas da aplicação
    │   ├── Dashboard.tsx
    │   ├── Quiz.tsx
    │   ├── Resultado.tsx
    │   ├── Desempenho.tsx
    │   └── Topicos.tsx
    ├── App.tsx          # Roteamento principal
    ├── main.tsx         # Entry point
    └── index.css        # Estilos globais + Tailwind
```

---

## Como adicionar novas questões

Edite `src/data/questions.ts` e adicione um objeto seguindo o modelo:

```typescript
{
  id: 'tce-11',           // ID único: topicId-número
  topicId: 'tce',         // ID do tópico (tce, ave, cefaleia, parkinson, em_sgb)
  text: 'Enunciado da questão...',
  options: [
    { id: 'A', text: 'Opção A' },
    { id: 'B', text: 'Opção B' },
    { id: 'C', text: 'Opção C' },
    { id: 'D', text: 'Opção D' },
    { id: 'E', text: 'Opção E' },  // opcional
  ],
  correctAnswer: 'B',     // A, B, C, D ou E
  explanation: 'Comentário detalhado após a resposta...',
  difficulty: 'medio',    // facil | medio | dificil
  tags: ['TC', 'TCE'],    // tags de busca e métricas
  source: 'ENARE 2023',   // fonte da questão
}
```

Após adicionar, atualize o `questionCount` do tópico correspondente em `src/data/topics.ts`.

---

## Tópicos disponíveis

| ID        | Título          | Material de referência         |
|-----------|-----------------|-------------------------------|
| `tce`     | TCE             | Monitoria TCE.pdf             |
| `ave`     | AVE             | AVE 2026.pdf                  |
| `cefaleia`| Cefaleias & HIC | Cefaleias e HIC.pdf           |
| `parkinson`| Parkinson      | parkinson final.pptx          |
| `em_sgb`  | EM & SGB        | QUIZ_CVCC.pptx                |

---

## Stack técnica

- **Vite + React 18 + TypeScript** — build e desenvolvimento
- **React Router v6** — roteamento SPA
- **Zustand** — estado global persistido no localStorage
- **Tailwind CSS v3** — estilização
- **Framer Motion** — animações
- **Recharts** — gráficos de desempenho
- **Lucide React** — ícones

---

## Rotas

| Rota                     | Página                        |
|--------------------------|-------------------------------|
| `/`                      | Dashboard com tópicos         |
| `/quiz/:topicId`         | Sessão de questões            |
| `/resultado/:sessionId`  | Tela de resultado pós-quiz    |
| `/desempenho`            | Painel de métricas e histórico|
| `/topicos`               | Biblioteca de tópicos         |
