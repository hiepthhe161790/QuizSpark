import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { ContextProvider } from './ContextApi';

const inter = Inter({ subsets: ['latin'] });

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export const metadata = {
  title: 'Quiz Spark',
  description: 'Generated by create next app',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Quiz Spark</title>
      </head>
      <body className={`${poppins.variable} ${inter.variable}`}>
        <ContextProvider>
          <main>{children}</main>
        </ContextProvider>
      </body>
    </html>
  );
}