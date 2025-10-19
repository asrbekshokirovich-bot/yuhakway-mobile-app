import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://dacegfnivzdkzctgubqt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhY2VnZm5pdnpka3pjdGd1YnF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4MDU5NTUsImV4cCI6MjA3NjM4MTk1NX0.Dgo-FBwMR30tTGLmCjaa6FE5z_T7uNeEtij3DJP2ubY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
