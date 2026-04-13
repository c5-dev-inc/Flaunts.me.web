import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// GET - Get authenticated user's own profile
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

  const { data: profile, error } = await supabase
    .from('flaunts_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }

  const { data: socialLinks } = await supabase
    .from('flaunts_social_links')
    .select('*')
    .eq('profile_id', profile.id)
    .order('order_index', { ascending: true });

  const { data: services } = await supabase
    .from('flaunts_services')
    .select('*')
    .eq('profile_id', profile.id)
    .order('order_index', { ascending: true });

  return NextResponse.json({
    profile: {
      id: profile.id,
      username: profile.username,
      display_name: profile.display_name,
      bio: profile.bio,
      avatar_url: profile.avatar_url,
      theme_color: profile.theme_color,
      background_url: profile.background_url,
      views_count: profile.views_count,
    },
    social_links: socialLinks || [],
    services: services || [],
  });
}