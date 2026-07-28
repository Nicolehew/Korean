import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// No <Database> generic yet — see src/types/database.ts for how to
// generate real types once the Supabase project is linked, then
// parameterize this client with it.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // setAll called from a Server Component; ignore if middleware
            // is already refreshing the session.
          }
        },
      },
    },
  );
}
