import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// PUT - Reorder social links
export async function PUT(request: NextRequest) {
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
  const { links } = body; // Array of { id, order_index }

  if (!links || !Array.isArray(links)) {
    return NextResponse.json({ error: 'Links array required' }, { status: 400 });
  }

  // Update each link's order
  for (const link of links) {
    const { error } = await supabase
      .from('flaunts_social_links')
      .update({ order_index: link.order_index })
      .eq('id', link.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}