import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// GET - Get click analytics for user's profile
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get user's profile
  const { data: profile } = await supabase
    .from('flaunts_profiles')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }

  // Get total clicks
  const { count: totalClicks } = await supabase
    .from('flaunts_clicks')
    .select('*', { count: 'exact', head: true })
    .eq('profile_id', profile.id);

  // Get clicks last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { data: recentClicks } = await supabase
    .from('flaunts_clicks')
    .select('clicked_at')
    .eq('profile_id', profile.id)
    .gte('clicked_at', sevenDaysAgo.toISOString());

  // Get clicks by link
  const { data: clicksByLink } = await supabase
    .from('flaunts_clicks')
    .select('link_id, count')
    .eq('profile_id', profile.id)
    .select('link_id');

  return NextResponse.json({
    total_clicks: totalClicks || 0,
    clicks_last_7_days: recentClicks?.length || 0,
  });
}