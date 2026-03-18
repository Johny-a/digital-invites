import { ImageResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get('name') || 'Guest';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#ffffff',
          fontSize: 60,
          fontWeight: 'bold',
        }}
      >
        <div>You're Invited 💌</div>
        <div style={{ marginTop: 20 }}>{name}</div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}