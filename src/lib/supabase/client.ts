import { createBrowserClient } from "@supabase/ssr";

// No <Database> generic yet — see src/types/database.ts for how to
// generate real types once the Supabase project is linked, then
// parameterize this client with it.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
