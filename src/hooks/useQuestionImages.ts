import { useState, useEffect } from 'react';
import { getImagesForQuestion } from '../services/questionImages';
import type { QuestionImageRow } from '../lib/database.types';

interface UseQuestionImagesResult {
  images: QuestionImageRow[];
  loading: boolean;
  error: string | null;
}

/**
 * Hook que busca imagens de uma questão no Supabase.
 * Retorna { images, loading, error }.
 * Se questionId for undefined/null, não faz fetch e retorna estado vazio.
 */
export function useQuestionImages(questionId: string | undefined): UseQuestionImagesResult {
  const [images, setImages] = useState<QuestionImageRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!questionId) {
      setImages([]);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    getImagesForQuestion(questionId)
      .then((data) => {
        if (!cancelled) {
          setImages(data);
          setLoading(false);
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err.message ?? 'Erro ao carregar imagens');
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [questionId]);

  return { images, loading, error };
}
