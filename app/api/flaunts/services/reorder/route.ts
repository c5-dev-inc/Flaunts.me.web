import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// PUT - Reorder services
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
  const { services } = body; // Array of { id, order_index }

  if (!services || !Array.isArray(services)) {
    return NextResponse.json({ error: 'Services array required' }, { status: 400 });
  }

  // Update each service's order
  for (const service of services) {
    const { error } = await supabase
      .from('flaunts_services')
      .update({ order_index: service.order_index })
      .eq('id', service.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}