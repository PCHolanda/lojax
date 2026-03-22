const SUPABASE_URL = 'https://nllpovpqfzbyhwbobwhv.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Wi2Zg9TRG633EOSG5TrXIg_ZAuvfUVf';

// Initialize Supabase Client dynamically avoiding the global 'supabase' name conflict
window.db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
