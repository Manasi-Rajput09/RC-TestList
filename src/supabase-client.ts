import { createClient } from "@supabase/supabase-js";

const supbase_url = "https://zhukyjbjwzzkufigpnou.supabase.co";
const supabase_key = "sb_publishable_4ypqI88fyzFxZFCeeWBYYQ_SDarUkuy";
export const supabase = createClient(supbase_url, supabase_key);
