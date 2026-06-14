import '../styles/globals.css';
import { ThemeProvider } from '../components/ThemeProvider';

export const metadata = {
  title: 'FinSense AI — Pakistan\'s Smartest Financial Assistant',
  description:
    'FinSense AI helps Pakistani users understand taxes, optimize finances, and navigate FBR regulations with AI-powered personalized insights.',
  keywords: 'Pakistan tax, FBR, financial assistant, AI advisor, freelancer tax Pakistan, income tax calculator',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ background: 'var(--bg)', color: 'var(--text)' }}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
