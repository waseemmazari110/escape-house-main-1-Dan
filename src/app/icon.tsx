import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default async function Icon() {
  const logoUrl =
    'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/stacked_logo-1760785640378-2-1761832743005.webp?width=32&height=32&resize=contain';

  try {
    // Render the remote image into a PNG via ImageResponse to avoid format mismatches
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
          }}
        >
          <img
            src={logoUrl}
            width={size.width}
            height={size.height}
            style={{ objectFit: 'contain' }}
          />
        </div>
      ),
      size
    );
  } catch (error) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#F5F3F0',
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: '#C6A76D',
              fontFamily: 'Georgia, serif',
            }}
          >
            GE
          </div>
        </div>
      ),
      size
    );
  }
}