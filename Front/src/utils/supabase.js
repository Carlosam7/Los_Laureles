import { createClient } from '@supabase/supabase-js';

// Debug: Ver qué variables están disponibles
console.log('=== SUPABASE CLIENT DEBUG ===');
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_ANON_KEY exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
console.log('VITE_SUPABASE_ANON_KEY preview:', import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 20) + '...');
console.log('All VITE env vars:', Object.keys(import.meta.env).filter(key => key.startsWith('VITE_')));
console.log('============================');

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validación con mensajes de error específicos
if (!supabaseUrl) {
  console.error('X: VITE_SUPABASE_URL no está definida');
  console.error('Variables disponibles:', import.meta.env);
  throw new Error('VITE_SUPABASE_URL is required but not found');
}

if (!supabaseKey) {
  console.error('X: VITE_SUPABASE_ANON_KEY no está definida');
  console.error('Variables disponibles:', import.meta.env);
  
  throw new Error('VITE_SUPABASE_ANON_KEY is required but not found');
}

console.log('✅ Supabase client creado correctamente');
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;

