
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
    try {
        // Try to fetch data from the 'settings' table
        const { data, error } = await supabase
            .from('settings')
            .select('*')
            .limit(1);

        if (error) {
            return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
        }

        return NextResponse.json({
            status: 'success',
            message: 'Connected to Supabase successfully!',
            data: data
        });
    } catch (err: any) {
        return NextResponse.json({ status: 'error', message: err.message }, { status: 500 });
    }
}
