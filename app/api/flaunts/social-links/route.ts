import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// POST - Add social link
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { platform, url } = body;

  if (!platform || !url) {
    return NextResponse.json({ error: 'Platform and URL required' }, { status: 400 });
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

  // Get current max order index
  const { data: existingLinks } = await supabase
    .from('flaunts_social_links')
    .select('order_index')
    .eq('profile_id', profile.id)
    .order('order_index', { ascending: false })
    .limit(1);

  const nextOrder = existingLinks && existingLinks.length > 0 ? existingLinks[0].order_index + 1 : 0;

  const { data: socialLink, error } = await supabase
    .from('flaunts_social_links')
    .insert({
      profile_id: profile.id,
      platform,
      url,
      order_index: nextOrder,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    social_link: {
      id: socialLink.id,
      platform: socialLink.platform,
      url: socialLink.url,
      order_index: socialLink.order_index,
    },
  });
}

// DELETE - Remove social link
export async function DELETE(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const linkId = searchParams.get('id');

  if (!linkId) {
    return NextResponse.json({ error: 'Link ID required' }, { status: 400 });
  }

  // Verify ownership
  const { data: link } = await supabase
    .from('flaunts_social_links')
    .select('profile_id')
    .eq('id', linkId)
    .single();

  if (!link) {
    return NextResponse.json({ error: 'Link not found' }, { status: 404 });
  }

  const { data: profile } = await supabase
    .from('flaunts_profiles')
    .select('user_id')
    .eq('id', link.profile_id)
    .single();

  if (profile?.user_id !== user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { error } = await supabase
    .from('flaunts_social_links')
    .delete()
    .eq('id', linkId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}