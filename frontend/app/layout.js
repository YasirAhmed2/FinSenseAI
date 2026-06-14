import '../styles/globals.css';
import { ThemeProvider } from '../components/ThemeProvider';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata = {
  title: 'FinSense AI — Pakistan\'s Smartest Financial Assistant',
  description:
    'FinSense AI helps Pakistani users understand taxes, optimize finances, and navigate FBR regulations with AI-powered personalized insights.',
  keywords: 'Pakistan tax, FBR, financial assistant, AI advisor, freelancer tax Pakistan, income tax calculator',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark" className={`${inter.variable} ${plusJakarta.variable}`} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{ background: 'var(--bg)', color: 'var(--text)' }}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
