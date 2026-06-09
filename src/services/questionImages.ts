import { supabase } from '../lib/supabase';
import type { QuestionImageRow } from '../lib/database.types';

/**
 * Busca todas as imagens de uma questão específica.
 * Retorna array vazio (nunca null) se não houver imagens.
 */
export async function getImagesForQuestion(questionId: string): Promise<QuestionImageRow[]> {
  const { data, error } = await supabase
    .from('question_images')
    .select('*')
    .eq('question_id', questionId)
    .order('display_order', { ascending: true });

  if (error) {
    console.error(`[questionImages] Erro ao buscar imagens para questão ${questionId}:`, error.message);
    return [];
  }

  return data ?? [];
}

/**
 * Pré-carrega imagens de um array de question_ids em batch.
 * Retorna um Map<questionId, QuestionImageRow[]> para lookup O(1).
 */
export async function getImagesForQuestions(
  questionIds: string[]
): Promise<Map<string, QuestionImageRow[]>> {
  if (questionIds.length === 0) return new Map();

  const { data, error } = await supabase
    .from('question_images')
    .select('*')
    .in('question_id', questionIds)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('[questionImages] Erro no batch fetch:', error.message);
    return new Map();
  }

  const map = new Map<string, QuestionImageRow[]>();
  for (const img of data ?? []) {
    const arr = map.get(img.question_id) ?? [];
    arr.push(img);
    map.set(img.question_id, arr);
  }

  return map;
}

/**
 * Faz upload de uma imagem para o Supabase Storage e registra na tabela.
 * Uso: painel admin ou script de seed com service_role key.
 */
export async function uploadQuestionImage(params: {
  file: File;
  questionId: string;
  topicId?: string;
  caption?: string;
  showAfterAnswer?: boolean;
  displayOrder?: number;
}): Promise<QuestionImageRow | null> {
  const { file, questionId, topicId, caption, showAfterAnswer = false, displayOrder = 0 } = params;

  const ext = file.name.split('.').pop();
  const fileName = `${questionId}_${Date.now()}.${ext}`;
  const storagePath = `questions/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('question-images')
    .upload(storagePath, file, {
      cacheControl: '31536000',
      upsert: false,
    });

  if (uploadError) {
    console.error('[questionImages] Upload falhou:', uploadError.message);
    return null;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('question-images')
    .getPublicUrl(storagePath);

  const { data, error: dbError } = await supabase
    .from('question_images')
    .insert({
      question_id: questionId,
      storage_path: storagePath,
      public_url: publicUrl,
      caption: caption ?? null,
      show_after_answer: showAfterAnswer,
      display_order: displayOrder,
      topic_id: topicId ?? null,
    })
    .select()
    .single();

  if (dbError) {
    console.error('[questionImages] Insert na tabela falhou:', dbError.message);
    return null;
  }

  return data;
}

/**
 * Remove uma imagem do Storage e da tabela.
 */
export async function deleteQuestionImage(imageId: string, storagePath: string): Promise<boolean> {
  const [{ error: storageError }, { error: dbError }] = await Promise.all([
    supabase.storage.from('question-images').remove([storagePath]),
    supabase.from('question_images').delete().eq('id', imageId),
  ]);

  if (storageError) console.error('[questionImages] Storage delete falhou:', storageError.message);
  if (dbError) console.error('[questionImages] DB delete falhou:', dbError.message);

  return !storageError && !dbError;
}
