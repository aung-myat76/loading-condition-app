import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://jvrcqzzilnqtggdgpgmh.supabase.co";
const supabaseAnonKey = "sb_publishable_NgJIz1yiwRApNZM0I-67lA_Vlzv8hQq";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
