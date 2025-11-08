import './globals.css';

export const metadata = {
  title: 'Performance Dashboard Pro',
  description: 'Glossy gradient performance dashboard with neon accents'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
