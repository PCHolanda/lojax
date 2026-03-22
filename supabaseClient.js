const SUPABASE_URL = 'https://nllpovpqfzbyhwbobwhv.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Wi2Zg9TRG633EOSG5TrXIg_ZAuvfUVf';

// Initialize Supabase Client globally so other script files can use `supabase`
window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
const supabase = window.supabaseClient;
