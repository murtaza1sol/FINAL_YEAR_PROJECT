import clientPromise from '@/lib/mongodb';

export async function POST(request) {
  try {
    const body = await request.json();
    const { walletAddress, name, specialisation, hospitalLocation } = body;

    // Validate required fields
    if (!walletAddress || !name || !specialisation || !hospitalLocation) {
        console.log(`specialisation ${specialisation}`)
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const client = await clientPromise;
    const db = client.db('doctordb');

    // Save or update doctor info
    await db.collection('doctors').updateOne(
      { walletAddress },
      {
        $set: {
          name,
          specialisation,
          hospitalLocation,
        },
      },
      { upsert: true }
    );

    return new Response(JSON.stringify({ message: 'Doctor info saved successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error in /api/save-doctor:', err);
    return new Response(JSON.stringify({ error: 'Something went wrong' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export function GET() {
  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' },
  });
}
