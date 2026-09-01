import type { AnswerOption } from '../types';

/**
 * Banco do modo Duelo — perguntas diretas, sem caso clínico longo.
 * Cada uma deve ser lida e respondida confortavelmente em 30 segundos:
 * enunciado de uma linha e alternativas curtas.
 */
export interface DuelQuestion {
  id: string;
  text: string;
  options: { id: AnswerOption; text: string }[];
  correctAnswer: AnswerOption;
  /** Frase curta mostrada na revelação — sem parágrafo longo. */
  fact: string;
}

export const DUEL_QUESTIONS: DuelQuestion[] = [
  // ── Neuroimagem: TCE ──────────────────────
  {
    id: 'd-01',
    text: 'Qual a morfologia do hematoma epidural na TC?',
    options: [
      { id: 'A', text: 'Crescente, cruza suturas' },
      { id: 'B', text: 'Biconvexa, limitada pelas suturas' },
      { id: 'C', text: 'Linear ao longo dos sulcos' },
      { id: 'D', text: 'Arredondada intraparenquimatosa' },
    ],
    correctAnswer: 'B',
    fact: 'A dura adere às suturas e contém o sangramento — daí a forma lenticular.',
  },
  {
    id: 'd-02',
    text: 'Qual vaso rompe classicamente no hematoma epidural?',
    options: [
      { id: 'A', text: 'Veias em ponte' },
      { id: 'B', text: 'Seio sagital superior' },
      { id: 'C', text: 'Artéria meníngea média' },
      { id: 'D', text: 'Artéria cerebral anterior' },
    ],
    correctAnswer: 'C',
    fact: 'Ramo da carótida externa — sangramento arterial, evolução rápida.',
  },
  {
    id: 'd-03',
    text: 'Densidade do sangue agudo na TC sem contraste?',
    options: [
      { id: 'A', text: '0–20 UH' },
      { id: 'B', text: '35–80 UH' },
      { id: 'C', text: '100–150 UH' },
      { id: 'D', text: '−10 a 10 UH' },
    ],
    correctAnswer: 'B',
    fact: 'Hiperdenso pela concentração de globina no coágulo.',
  },
  {
    id: 'd-04',
    text: 'Hematoma subdural crônico (> 3 semanas) aparece como:',
    options: [
      { id: 'A', text: 'Hiperdenso' },
      { id: 'B', text: 'Isodenso' },
      { id: 'C', text: 'Hipodenso' },
      { id: 'D', text: 'Com realce em anel' },
    ],
    correctAnswer: 'C',
    fact: 'Agudo hiper → subagudo iso → crônico hipo, acompanhando a degradação da hemoglobina.',
  },
  {
    id: 'd-05',
    text: 'Qual sequência de RM é a mais sensível para lesão axonal difusa?',
    options: [
      { id: 'A', text: 'T1 sem contraste' },
      { id: 'B', text: 'SWI' },
      { id: 'C', text: 'FLAIR' },
      { id: 'D', text: 'T2 convencional' },
    ],
    correctAnswer: 'B',
    fact: 'A SWI detecta as microhemorragias petequiais que a TC não mostra.',
  },

  // ── Neuroimagem: AVE ──────────────────────
  {
    id: 'd-06',
    text: 'O sinal da ACM hiperdensa representa:',
    options: [
      { id: 'A', text: 'Necrose estabelecida' },
      { id: 'B', text: 'Trombo intraluminal' },
      { id: 'C', text: 'Edema vasogênico' },
      { id: 'D', text: 'Calcificação da parede' },
    ],
    correctAnswer: 'B',
    fact: 'É o coágulo visível dentro do vaso — sinal precoce de AVC isquêmico.',
  },
  {
    id: 'd-07',
    text: 'Qual sequência detecta isquemia mais precocemente?',
    options: [
      { id: 'A', text: 'DWI' },
      { id: 'B', text: 'T1' },
      { id: 'C', text: 'TC sem contraste' },
      { id: 'D', text: 'T2' },
    ],
    correctAnswer: 'A',
    fact: 'A difusão restringe em minutos, muito antes de qualquer alteração na TC.',
  },
  {
    id: 'd-08',
    text: 'O mismatch DWI positivo com FLAIR negativo indica:',
    options: [
      { id: 'A', text: 'AVC com mais de 24 h' },
      { id: 'B', text: 'AVC hemorrágico' },
      { id: 'C', text: 'AVC com menos de 4,5 h' },
      { id: 'D', text: 'Tumor cerebral' },
    ],
    correctAnswer: 'C',
    fact: 'Usado para indicar trombólise no AVC de horário indeterminado (wake-up stroke).',
  },
  {
    id: 'd-09',
    text: 'O "sinal do delta vazio" indica:',
    options: [
      { id: 'A', text: 'Trombose venosa cerebral' },
      { id: 'B', text: 'Aneurisma roto' },
      { id: 'C', text: 'Abscesso cerebral' },
      { id: 'D', text: 'Meningioma' },
    ],
    correctAnswer: 'A',
    fact: 'Realce dural triangular ao redor do trombo no seio sagital superior.',
  },
  {
    id: 'd-10',
    text: 'Hemorragia subaracnóidea espontânea: causa mais frequente?',
    options: [
      { id: 'A', text: 'MAV' },
      { id: 'B', text: 'Aneurisma sacular roto' },
      { id: 'C', text: 'Angiopatia amiloide' },
      { id: 'D', text: 'Trauma' },
    ],
    correctAnswer: 'B',
    fact: 'Responde por cerca de 85% dos casos não traumáticos.',
  },

  // ── Neuroimagem: Cefaleia / HIC ───────────
  {
    id: 'd-11',
    text: 'Sela turca vazia + achatamento posterior dos globos sugere:',
    options: [
      { id: 'A', text: 'Hipertensão intracraniana' },
      { id: 'B', text: 'Hipotensão liquórica' },
      { id: 'C', text: 'Adenoma hipofisário' },
      { id: 'D', text: 'Craniofaringioma' },
    ],
    correctAnswer: 'A',
    fact: 'Tríade orbitária da HIC: bainha óptica dilatada, globo achatado e nervo tortuoso.',
  },
  {
    id: 'd-12',
    text: 'Bainha do nervo óptico dilatada na RM é considerada acima de:',
    options: [
      { id: 'A', text: '2 mm' },
      { id: 'B', text: '5 mm' },
      { id: 'C', text: '10 mm' },
      { id: 'D', text: '15 mm' },
    ],
    correctAnswer: 'B',
    fact: 'Medida a 3 mm atrás do globo ocular.',
  },

  // ── Neuroimagem: Parkinson / EM ───────────
  {
    id: 'd-13',
    text: 'A perda do "sinal da andorinha" na SWI indica:',
    options: [
      { id: 'A', text: 'Doença de Parkinson' },
      { id: 'B', text: 'Tremor essencial' },
      { id: 'C', text: 'Doença de Huntington' },
      { id: 'D', text: 'Esclerose múltipla' },
    ],
    correctAnswer: 'A',
    fact: 'Perda do nigrossoma-1 na substância negra — a "cauda de andorinha" desaparece.',
  },
  {
    id: 'd-14',
    text: 'No DaTscan normal, o padrão de captação é chamado de:',
    options: [
      { id: 'A', text: 'Vírgula' },
      { id: 'B', text: 'Gaivota' },
      { id: 'C', text: 'Beija-flor' },
      { id: 'D', text: 'Olho de tigre' },
    ],
    correctAnswer: 'B',
    fact: 'Na DP vira "vírgula": o putâmen posterior perde captação antes do caudado.',
  },
  {
    id: 'd-15',
    text: 'Sintoma obrigatório para diagnosticar parkinsonismo (MDS 2015)?',
    options: [
      { id: 'A', text: 'Tremor de repouso' },
      { id: 'B', text: 'Bradicinesia' },
      { id: 'C', text: 'Instabilidade postural' },
      { id: 'D', text: 'Rigidez' },
    ],
    correctAnswer: 'B',
    fact: 'Bradicinesia + rigidez OU tremor de repouso.',
  },
  {
    id: 'd-16',
    text: 'Os "dedos de Dawson" são típicos de qual doença?',
    options: [
      { id: 'A', text: 'Esclerose múltipla' },
      { id: 'B', text: 'Neuromielite óptica' },
      { id: 'C', text: 'LMP' },
      { id: 'D', text: 'ADEM' },
    ],
    correctAnswer: 'A',
    fact: 'Lesões periventriculares perpendiculares ao corpo caloso, ao longo das vênulas.',
  },
  {
    id: 'd-17',
    text: 'Achado de RM da esclerose hipocampal mesial?',
    options: [
      { id: 'A', text: 'Hipersinal T1 e aumento do volume' },
      { id: 'B', text: 'Hipersinal T2/FLAIR e atrofia' },
      { id: 'C', text: 'Realce anelar pelo gadolínio' },
      { id: 'D', text: 'Calcificação hipocampal' },
    ],
    correctAnswer: 'B',
    fact: 'Some ainda a perda da laminação interna do hipocampo.',
  },

  // ── Musculoesquelético ────────────────────
  {
    id: 'd-18',
    text: 'O sinal do duplo contorno na ultrassonografia indica:',
    options: [
      { id: 'A', text: 'Gota' },
      { id: 'B', text: 'Condrocalcinose' },
      { id: 'C', text: 'Artrite reumatoide' },
      { id: 'D', text: 'Osteoartrite' },
    ],
    correctAnswer: 'A',
    fact: 'Urato depositado SOBRE a cartilagem, paralelo à cortical óssea.',
  },
  {
    id: 'd-19',
    text: 'Qual cristal causa a condrocalcinose?',
    options: [
      { id: 'A', text: 'Urato monossódico' },
      { id: 'B', text: 'Hidroxiapatita' },
      { id: 'C', text: 'Pirofosfato de cálcio' },
      { id: 'D', text: 'Oxalato de cálcio' },
    ],
    correctAnswer: 'C',
    fact: 'CPPD — cristal romboide, birrefringência positiva fraca.',
  },
  {
    id: 'd-20',
    text: 'Cristal da gota ao microscópio polarizado:',
    options: [
      { id: 'A', text: 'Agulha, birrefringência negativa' },
      { id: 'B', text: 'Romboide, birrefringência positiva' },
      { id: 'C', text: 'Agulha, birrefringência positiva' },
      { id: 'D', text: 'Não birrefringente' },
    ],
    correctAnswer: 'A',
    fact: 'Intraleucocitário confirma o diagnóstico — é o padrão-ouro.',
  },
  {
    id: 'd-21',
    text: 'Quais articulações a artrite reumatoide caracteristicamente POUPA?',
    options: [
      { id: 'A', text: 'Metacarpofalangianas' },
      { id: 'B', text: 'Interfalangianas distais' },
      { id: 'C', text: 'Punhos' },
      { id: 'D', text: 'Interfalangianas proximais' },
    ],
    correctAnswer: 'B',
    fact: 'IFD são território de osteoartrite e artrite psoriática.',
  },
  {
    id: 'd-22',
    text: 'Achado radiográfico mais precoce da artrite reumatoide na mão?',
    options: [
      { id: 'A', text: 'Anquilose do carpo' },
      { id: 'B', text: 'Desvio ulnar' },
      { id: 'C', text: 'Erosão do estiloide ulnar' },
      { id: 'D', text: 'Osteófitos marginais' },
    ],
    correctAnswer: 'C',
    fact: 'Sinóvia abundante e cortical fina fazem dele o primeiro alvo.',
  },
  {
    id: 'd-23',
    text: 'A tríade radiográfica da osteoartrite é:',
    options: [
      { id: 'A', text: 'Erosões, osteopenia e anquilose' },
      { id: 'B', text: 'Pinçamento, esclerose subcondral e osteófitos' },
      { id: 'C', text: 'Tofos, erosões e espaço preservado' },
      { id: 'D', text: 'Calcificação linear e derrame' },
    ],
    correctAnswer: 'B',
    fact: 'Some os cistos (geodos) subcondrais — e nenhuma erosão.',
  },
  {
    id: 'd-24',
    text: 'A deformidade em "lápis e cálice" é típica de:',
    options: [
      { id: 'A', text: 'Artrite reumatoide' },
      { id: 'B', text: 'Gota' },
      { id: 'C', text: 'Artrite psoriática' },
      { id: 'D', text: 'Osteoartrite' },
    ],
    correctAnswer: 'C',
    fact: 'Pencil-in-cup nas interfalangianas distais — erosão somada a neoformação óssea.',
  },
  {
    id: 'd-25',
    text: 'Qual o achado MAIS PRECOCE da espondilite anquilosante?',
    options: [
      { id: 'A', text: 'Coluna em bambu' },
      { id: 'B', text: 'Sacroileíte' },
      { id: 'C', text: 'Sindesmófitos' },
      { id: 'D', text: 'Anquilose vertebral' },
    ],
    correctAnswer: 'B',
    fact: 'Bilateral e simétrica. A coluna em bambu é o achado mais tardio.',
  },
  {
    id: 'd-26',
    text: 'O "sinal de Romanus" corresponde a:',
    options: [
      { id: 'A', text: 'Fusão das sacroilíacas' },
      { id: 'B', text: 'Erosão dos ângulos vertebrais com esclerose' },
      { id: 'C', text: 'Ossificação do ligamento longitudinal' },
      { id: 'D', text: 'Hérnia discal calcificada' },
    ],
    correctAnswer: 'B',
    fact: 'A "shiny corner" — achado vertebral precoce da espondilite anquilosante.',
  },
  {
    id: 'd-27',
    text: 'Qual sequência de RM demonstra edema ósseo nas sacroilíacas?',
    options: [
      { id: 'A', text: 'T1 sem saturação' },
      { id: 'B', text: 'STIR' },
      { id: 'C', text: 'Eco gradiente' },
      { id: 'D', text: 'Angio-RM' },
    ],
    correctAnswer: 'B',
    fact: 'Satura a gordura e revela a inflamação ativa.',
  },
  {
    id: 'd-28',
    text: 'Quais músculos formam o manguito rotador?',
    options: [
      { id: 'A', text: 'Deltoide, bíceps, tríceps e coracobraquial' },
      { id: 'B', text: 'Subescapular, supraespinhal, infraespinhal e redondo menor' },
      { id: 'C', text: 'Peitoral maior, redondo maior, deltoide e bíceps' },
      { id: 'D', text: 'Supraespinhal, redondo maior, trapézio e deltoide' },
    ],
    correctAnswer: 'B',
    fact: 'Mnemônico SITS. O supraespinhal é o mais lesado.',
  },
  {
    id: 'd-29',
    text: 'Qual substância se deposita na tendinopatia calcária do ombro?',
    options: [
      { id: 'A', text: 'Urato monossódico' },
      { id: 'B', text: 'Pirofosfato de cálcio' },
      { id: 'C', text: 'Hidroxiapatita' },
      { id: 'D', text: 'Colesterol' },
    ],
    correctAnswer: 'C',
    fact: 'Acomete preferencialmente o tendão supraespinhal.',
  },
  {
    id: 'd-30',
    text: 'Teste de Finkelstein positivo indica acometimento de qual compartimento?',
    options: [
      { id: 'A', text: '1º extensor (De Quervain)' },
      { id: 'B', text: '6º extensor' },
      { id: 'C', text: 'Túnel do carpo' },
      { id: 'D', text: 'Canal de Guyon' },
    ],
    correctAnswer: 'A',
    fact: 'Abdutor longo e extensor curto do polegar — dor na face radial do punho.',
  },
  {
    id: 'd-31',
    text: 'Exame padrão-ouro para confirmar síndrome do túnel do carpo?',
    options: [
      { id: 'A', text: 'Ultrassonografia' },
      { id: 'B', text: 'Ressonância magnética' },
      { id: 'C', text: 'Eletroneuromiografia' },
      { id: 'D', text: 'Radiografia do punho' },
    ],
    correctAnswer: 'C',
    fact: 'A US avalia a morfologia; a ENMG avalia a função de condução.',
  },
  {
    id: 'd-32',
    text: 'Método validado para avaliar sinovite ATIVA na artrite reumatoide?',
    options: [
      { id: 'A', text: 'Radiografia simples' },
      { id: 'B', text: 'US com Power Doppler' },
      { id: 'C', text: 'Densitometria óssea' },
      { id: 'D', text: 'Cintilografia' },
    ],
    correctAnswer: 'B',
    fact: 'O sinal Doppler mostra a neovascularização do panus.',
  },
  {
    id: 'd-33',
    text: 'Na gota, o espaço articular caracteristicamente está:',
    options: [
      { id: 'A', text: 'Muito reduzido' },
      { id: 'B', text: 'Preservado' },
      { id: 'C', text: 'Ausente por anquilose' },
      { id: 'D', text: 'Alargado' },
    ],
    correctAnswer: 'B',
    fact: 'Espaço preservado + densidade óssea normal separam a gota da AR.',
  },
  {
    id: 'd-34',
    text: 'A erosão da gota apresenta qual característica típica?',
    options: [
      { id: 'A', text: 'Bordas mal definidas sem esclerose' },
      { id: 'B', text: 'Borda esclerótica com "overhanging edge"' },
      { id: 'C', text: 'Erosão central em asa de gaivota' },
      { id: 'D', text: 'Erosão em lápis e cálice' },
    ],
    correctAnswer: 'B',
    fact: 'A aba óssea pendente reflete o crescimento lento do tofo.',
  },
  {
    id: 'd-35',
    text: 'Qual raiz nervosa altera o reflexo aquileu?',
    options: [
      { id: 'A', text: 'L4' },
      { id: 'B', text: 'L5' },
      { id: 'C', text: 'S1' },
      { id: 'D', text: 'L3' },
    ],
    correctAnswer: 'C',
    fact: 'L4 altera o patelar; L5 não altera reflexo nenhum.',
  },
  {
    id: 'd-36',
    text: 'A erosão central em "asa de gaivota" ocorre em:',
    options: [
      { id: 'A', text: 'Osteoartrite erosiva das mãos' },
      { id: 'B', text: 'Artrite reumatoide' },
      { id: 'C', text: 'Gota tofácea' },
      { id: 'D', text: 'Espondilite anquilosante' },
    ],
    correctAnswer: 'A',
    fact: 'Erosão CENTRAL — a da AR é marginal.',
  },
];

/** Sorteia `n` perguntas distintas. A semente mantém os dois duelistas com o mesmo conjunto. */
export function drawDuelQuestions(n: number, seed: string): DuelQuestion[] {
  // PRNG determinístico (mulberry32) semeado pelo id da partida
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  const rand = () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const pool = [...DUEL_QUESTIONS];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, n);
}

export const DUEL_QUESTION_COUNT = 7;
export const DUEL_SECONDS_PER_QUESTION = 30;

/**
 * Pontuação: acerto vale 500 pontos + até 500 de bônus proporcional ao
 * tempo restante. Errar ou estourar o tempo vale zero. Assim, quem acerta
 * mais rápido pontua mais — sem que a velocidade sozinha ganhe do acerto.
 */
export function scoreAnswer(correct: boolean, msElapsed: number): number {
  if (!correct) return 0;
  const limite = DUEL_SECONDS_PER_QUESTION * 1000;
  const restante = Math.max(0, limite - msElapsed) / limite;
  return 500 + Math.round(500 * restante);
}

export const DUEL_MAX_SCORE = DUEL_QUESTION_COUNT * 1000;
