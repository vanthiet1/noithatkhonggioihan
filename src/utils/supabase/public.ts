import { createBrowserClient } from '@supabase/ssr';

/**
 * Public Supabase client for reading data on public-facing pages.
 * Does NOT read cookies or headers, enabling Next.js Static Site Generation (SSG)
 * and Incremental Static Regeneration (ISR).
 */
export function getPublicClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
