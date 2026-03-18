import { ImageResponse } from 'next/og';

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
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#ffffff',
          fontSize: 60,
          fontWeight: 'bold',
        }}
      >
        You're Invited {name} 💌
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}