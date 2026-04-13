import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// POST - Track click on social link
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { username, link_id } = body;

  if (!username) {
    return NextResponse.json({ error: 'Username required' }, { status: 400 });
  }

  // Get profile
  const { data: profile } = await supabase
    .from('flaunts_profiles')
    .select('id')
    .eq('username', username)
    .single();

  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }

  // Get IP address from headers
  const ipAddress = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown';

  // Get user agent
  const userAgent = request.headers.get('user-agent') || 'unknown';

  // Track click
  const { error } = await supabase
    .from('flaunts_clicks')
    .insert({
      profile_id: profile.id,
      link_id: link_id || null,
      user_agent: userAgent,
      ip_address: ipAddress,
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}