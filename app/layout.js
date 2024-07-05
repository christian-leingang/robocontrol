import { Inter } from 'next/font/google';
import './globals.css';
import Header from './_components/Header';
import { ThemeProvider } from './_components/theme-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'RoboControl',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body
        className={`${inter.className} relative flex min-h-screen flex-col bg-primary-950 text-primary-100 antialiased`}
      >
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
