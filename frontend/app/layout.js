import '../styles/globals.css';

export const metadata = {
  title: 'FinSense AI — Your Pakistani Financial Assistant',
  description:
    'FinSense AI helps Pakistani users understand taxes, financial obligations, and government schemes using AI-powered insights.',
  keywords: 'Pakistan tax, FBR, financial assistant, AI, freelancer tax Pakistan',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-inter bg-[#0f0f1a] text-[#F0F0F5] min-h-screen">
        {children}
      </body>
    </html>
  );
}
