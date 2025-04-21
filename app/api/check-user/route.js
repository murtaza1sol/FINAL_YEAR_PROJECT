import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const wallet = searchParams.get('wallet');

    if (!wallet) {
      return NextResponse.json({ error: 'Missing wallet parameter' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('monkeypoxdb');

    const user = await db.collection('users').findOne({ walletAddress: wallet });

    if (user) {
      return NextResponse.json({ exists: true, user }, { status: 200 });
    } else {
      return NextResponse.json({ exists: false }, { status: 200 });
    }
  } catch (err) {
    return NextResponse.json(
      { error: 'Error checking user', details: err.message },
      { status: 500 }
    );
  }
}

export function POST() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}
