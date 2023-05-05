import { Navbar } from './components/Navbar';
import ZeroDevWrapper from './components/ZeroDevWrapper';
import './globals.css';

export const metadata = {
  title: 'PSFMA',
  description: 'PSFMA',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body>
        <ZeroDevWrapper>
          <Navbar />
        </ZeroDevWrapper>
        {children}
      </body>
    </html>
  );
}
