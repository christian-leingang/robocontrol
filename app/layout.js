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
        className={`${inter.className} bg-primary-950 text-primary-100 relative flex min-h-screen flex-col antialiased`}
      >
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
