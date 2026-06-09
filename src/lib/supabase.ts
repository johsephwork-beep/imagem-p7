import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Valores padrão embarcados — a anon key é pública e aparece no bundle JS de qualquer forma.
// Variáveis de ambiente têm precedência quando definidas (desenvolvimento local).
const supabaseUrl =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ||
  'https://hxhymurktvktjiisalrp.supabase.co';

const supabaseAnonKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4aHltdXJrdHZrdGppaXNhbHJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5NTc1OTcsImV4cCI6MjA5NjUzMzU5N30.FoqlAEOvAzKOy2-u5lQM1M33cWnsg8Gi-34ArBCKCQE';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
