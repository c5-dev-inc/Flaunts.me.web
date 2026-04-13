import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// POST - Add service
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
  const { name, description, price, image_url } = body;

  if (!name) {
    return NextResponse.json({ error: 'Service name required' }, { status: 400 });
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
  const { data: existingServices } = await supabase
    .from('flaunts_services')
    .select('order_index')
    .eq('profile_id', profile.id)
    .order('order_index', { ascending: false })
    .limit(1);

  const nextOrder = existingServices && existingServices.length > 0 ? existingServices[0].order_index + 1 : 0;

  const { data: service, error } = await supabase
    .from('flaunts_services')
    .insert({
      profile_id: profile.id,
      name,
      description: description || null,
      price: price || null,
      image_url: image_url || null,
      order_index: nextOrder,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    service: {
      id: service.id,
      name: service.name,
      description: service.description,
      price: service.price,
      image_url: service.image_url,
      order_index: service.order_index,
    },
  });
}

// DELETE - Remove service
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
  const serviceId = searchParams.get('id');

  if (!serviceId) {
    return NextResponse.json({ error: 'Service ID required' }, { status: 400 });
  }

  // Verify ownership
  const { data: service } = await supabase
    .from('flaunts_services')
    .select('profile_id')
    .eq('id', serviceId)
    .single();

  if (!service) {
    return NextResponse.json({ error: 'Service not found' }, { status: 404 });
  }

  const { data: profile } = await supabase
    .from('flaunts_profiles')
    .select('user_id')
    .eq('id', service.profile_id)
    .single();

  if (profile?.user_id !== user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { error } = await supabase
    .from('flaunts_services')
    .delete()
    .eq('id', serviceId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}