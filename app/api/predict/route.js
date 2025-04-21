import { spawn } from 'child_process';

export async function POST(request) {
  const symptoms = await request.json();

  return new Promise((resolve, reject) => {
    const python = spawn('python3', ['python/predict_model.py', JSON.stringify(symptoms)]);

    let resultData = '';
    let errorData = '';

    python.stdout.on('data', (data) => {
      resultData += data.toString();
    });

    python.stderr.on('data', (data) => {
      errorData += data.toString();
    });

    python.on('close', (code) => {
      if (code !== 0) {
        console.error(`Python process exited with code ${code}`);
        return resolve(
          new Response(JSON.stringify({
            error: 'Error during prediction process',
            details: errorData,
          }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          })
        );
      }

      return resolve(
        new Response(JSON.stringify({ result: resultData.trim() }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });

    python.on('error', (err) => {
      console.error('Failed to start Python process', err);
      return resolve(
        new Response(JSON.stringify({ error: 'Failed to start Python process' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });
  });
}
