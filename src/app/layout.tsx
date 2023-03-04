import './globals.css';

export const metadata = {
  title: 'Tweet',
  description: 'A single tweet built using Tailwind',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  );
}
