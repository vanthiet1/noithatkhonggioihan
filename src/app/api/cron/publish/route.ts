import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/utils/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // 1. Authenticate the request
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    // Allow if CRON_SECRET is not set (for local dev) OR if the header matches
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createAdminClient();
    
    // 2. We only want to revalidate if something was *just* published in the last 2 minutes.
    // We check a 2-minute window to be safe in case the cron is slightly delayed.
    const now = new Date();
    const twoMinutesAgo = new Date(now.getTime() - 2 * 60 * 1000);
    
    const nowStr = now.toISOString();
    const pastStr = twoMinutesAgo.toISOString();

    const tables = ['news', 'categories', 'sub_categories', 'featured_projects', 'products'];
    
    // Check all tables concurrently
    const checks = await Promise.all(
      tables.map(table => 
        supabase
          .from(table)
          .select('id', { count: 'exact', head: true })
          .eq('status', 'published')
          .lte('published_at', nowStr)
          .gte('published_at', pastStr)
      )
    );

    // If any table has new items published in the last 2 minutes
    const hasNewContent = checks.some(result => result.count && result.count > 0);

    if (hasNewContent) {
      // Clear cache for the whole site
      revalidatePath('/', 'layout');
      return NextResponse.json({ 
        success: true, 
        revalidated: true, 
        message: 'Cache cleared due to new scheduled content.' 
      });
    }

    return NextResponse.json({ 
      success: true, 
      revalidated: false, 
      message: 'No new scheduled content found.' 
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
