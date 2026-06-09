import type { Topic } from '../types';

export const TOPICS: Topic[] = [
  {
    id: 'tce',
    title: 'TCE',
    description: 'Traumatismo Cranioencefálico — fraturas, hematomas, escalas de Glasgow',
    icon: 'Brain',
    color: '#EF4444',
    questionCount: 15,
    driveFileId: '155MQby7jWZ7xqkA9n0xvcfnhKAzf01Sb',
  },
  {
    id: 'ave',
    title: 'AVE',
    description: 'Acidente Vascular Encefálico — isquêmico, hemorrágico, ASPECTS, trombectomia',
    icon: 'Activity',
    color: '#6366F1',
    questionCount: 15,
    driveFileId: '1S2Rha4MbX9UC0ns9Do2Hb1H70RUyGAyJ',
  },
  {
    id: 'cefaleia',
    title: 'Cefaleias & HIC',
    description: 'Cefaleias secundárias e Hipertensão Intracraniana — HSA, papiledema, sela turca',
    icon: 'Zap',
    color: '#F59E0B',
    questionCount: 15,
    driveFileId: '18gtrknfggsayUMs5LC8Lgupgrt_bXYOG',
  },
  {
    id: 'parkinson',
    title: 'Parkinson',
    description: 'DP e Síndromes Parkinsonianas — neuroimagem funcional e estrutural',
    icon: 'Circle',
    color: '#14B8A6',
    questionCount: 15,
    driveFileId: '1jxItWMQuJA8DjlyuxR1wlGYebiXVBErL',
  },
  {
    id: 'em_sgb',
    title: 'EM & SGB',
    description: 'Esclerose Múltipla, Guillain-Barré e Schwannoma — CVCC e doenças desmielinizantes',
    icon: 'Layers',
    color: '#EC4899',
    questionCount: 18,
    driveFileId: '1g7tRH534321Gpi_-6acHmqbmORvCL2Jn',
  },
];
