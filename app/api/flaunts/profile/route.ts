import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get('username');

  console.log('Searching for username:', username); // Add this to debug

  if (!username) {
    return NextResponse.json({ error: 'Username required' }, { status: 400 });
  }

  const { data: profile, error } = await supabase
    .from('flaunts_profiles')
    .select('*')
    .eq('username', username)
    .maybeSingle();  // Change from .single() to .maybeSingle()

  console.log('Profile found:', profile); // Add this to debug
  console.log('Error:', error); // Add this to debug

  if (error || !profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }

  // Rest of your code...
  const { data: socialLinks } = await supabase
    .from('flaunts_social_links')
    .select('id, platform, url, order_index')
    .eq('profile_id', profile.id)
    .order('order_index', { ascending: true });

  const { data: services } = await supabase
    .from('flaunts_services')
    .select('id, name, description, price, image_url, order_index')
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