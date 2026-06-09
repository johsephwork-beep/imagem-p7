/**
 * Script de seed: faz upload de imagens para o Supabase e registra no banco.
 *
 * Uso (com Node.js + ts-node instalados):
 *   SUPABASE_SERVICE_KEY=xxx npx ts-node scripts/uploadImages.ts
 *
 * Coloque as imagens em: scripts/images/<question_id>/<arquivo>.<ext>
 * Ex: scripts/images/tce-04/epidural_biconvexo.jpg
 *
 * A SERVICE_KEY é a "service_role" key do projeto Supabase
 * (Settings → API → service_role). NUNCA exponha no frontend.
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join, extname } from 'path';

const SUPABASE_URL     = process.env.VITE_SUPABASE_URL     ?? '';
const SERVICE_KEY      = process.env.SUPABASE_SERVICE_KEY  ?? '';

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌ Defina VITE_SUPABASE_URL e SUPABASE_SERVICE_KEY como variáveis de ambiente.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

interface ImageManifest {
  questionId: string;
  topicId?: string;
  caption?: string;
  showAfterAnswer?: boolean;
  displayOrder?: number;
}

/**
 * Defina aqui os metadados de cada imagem.
 * Chave: caminho relativo a scripts/images/
 * Valor: metadados da questão correspondente.
 *
 * Os question_id devem bater com os IDs em src/data/questions.ts
 */
const MANIFEST: Record<string, ImageManifest> = {
  'tce-04/epidural_biconvexo.jpg': {
    questionId:      'tce-04',
    topicId:         'tce',
    caption:         'TC crânio s/ contraste — hematoma epidural biconvexo hiperdensidade',
    showAfterAnswer: false,
    displayOrder:    0,
  },
  'tce-05/subdural_cronico.jpg': {
    questionId:      'tce-05',
    topicId:         'tce',
    caption:         'TC crânio — hematoma subdural crônico (hipodensa, morfologia em crescente)',
    showAfterAnswer: false,
    displayOrder:    0,
  },
  'tce-10/desvio_linha_media.jpg': {
    questionId:      'tce-10',
    topicId:         'tce',
    caption:         'TC crânio — desvio de linha média > 5 mm com colapso ventricular',
    showAfterAnswer: false,
    displayOrder:    0,
  },
  'ave-01/acm_hiperdensa.jpg': {
    questionId:      'ave-01',
    topicId:         'ave',
    caption:         'TC s/ contraste — sinal da ACM hiperdensa (trombo agudo intraluminal)',
    showAfterAnswer: false,
    displayOrder:    0,
  },
  'ave-02/aspects_mapa.jpg': {
    questionId:      'ave-02',
    topicId:         'ave',
    caption:         'TC — mapa ASPECTS: 10 regiões do território da ACM',
    showAfterAnswer: false,
    displayOrder:    0,
  },
  'ave-03/dwi_flair_mismatch.jpg': {
    questionId:      'ave-03',
    topicId:         'ave',
    caption:         'RM — DWI com hipersinal, FLAIR negativo → AVCi dentro da janela terapêutica',
    showAfterAnswer: false,
    displayOrder:    0,
  },
  'ave-10/hsa_cisternas.jpg': {
    questionId:      'ave-10',
    topicId:         'ave',
    caption:         'TC s/ contraste — HSA: hiperdensidade nas cisternas basais',
    showAfterAnswer: false,
    displayOrder:    0,
  },
  'cefaleia-02/sela_turca_vazia.jpg': {
    questionId:      'cefaleia-02',
    topicId:         'cefaleia',
    caption:         'RM T1 sagital — sela turca vazia na Hipertensão Intracraniana idiopática',
    showAfterAnswer: false,
    displayOrder:    0,
  },
  'cefaleia-03/bainha_nervio_optico.jpg': {
    questionId:      'cefaleia-03',
    topicId:         'cefaleia',
    caption:         'RM T2 axial — distensão do complexo bainha-nervo óptico na HIC',
    showAfterAnswer: true,
    displayOrder:    0,
  },
  'cefaleia-05/hsa_aneurisma.jpg': {
    questionId:      'cefaleia-05',
    topicId:         'cefaleia',
    caption:         'TC — HSA por aneurisma roto: hiperdensidade nas cisternas basais e fissura sylviana',
    showAfterAnswer: false,
    displayOrder:    0,
  },
  'parkinson-01/swallow_tail.jpg': {
    questionId:      'parkinson-01',
    topicId:         'parkinson',
    caption:         'RM SWI — nigrossoma-1: sinal da cauda de andorinha (ausente na DP)',
    showAfterAnswer: false,
    displayOrder:    0,
  },
  'em-02/dawson_fingers.jpg': {
    questionId:      'em-02',
    topicId:         'em_sgb',
    caption:         'RM FLAIR sagital — dedos de Dawson: lesões desmielinizantes periventriculares (EM)',
    showAfterAnswer: false,
    displayOrder:    0,
  },
};

async function run() {
  const IMAGES_DIR = join(__dirname, 'images');
  let success = 0;
  let fail = 0;

  for (const [relativePath, meta] of Object.entries(MANIFEST)) {
    const filePath = join(IMAGES_DIR, relativePath);

    try {
      const buffer = readFileSync(filePath);
      const ext = extname(filePath).replace('.', '');
      const fileName = `${meta.questionId}_${Date.now()}.${ext}`;
      const storagePath = `questions/${fileName}`;

      // 1. Upload para o bucket
      const { error: uploadError } = await supabase.storage
        .from('question-images')
        .upload(storagePath, buffer, {
          contentType: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
          cacheControl: '31536000',
        });

      if (uploadError) throw uploadError;

      // 2. URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('question-images')
        .getPublicUrl(storagePath);

      // 3. Insert na tabela
      const { error: dbError } = await supabase.from('question_images').insert({
        question_id:       meta.questionId,
        storage_path:      storagePath,
        public_url:        publicUrl,
        caption:           meta.caption ?? null,
        show_after_answer: meta.showAfterAnswer ?? false,
        display_order:     meta.displayOrder ?? 0,
        topic_id:          meta.topicId ?? null,
      });

      if (dbError) throw dbError;

      console.log(`✅ ${relativePath}`);
      console.log(`   → ${publicUrl}`);
      success++;
    } catch (err) {
      console.error(`❌ ${relativePath}:`, err);
      fail++;
    }
  }

  console.log(`\nConcluído: ${success} imagem(ns) enviada(s), ${fail} falha(s).`);
}

run();
