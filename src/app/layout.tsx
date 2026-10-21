import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AquaHarvest AI — Smart Rainwater Harvesting Calculator & Optimization',
  description:
    'Comprehensive hydrological modeling, tank sizing, financial ROI, and Google Gemini AI insights for rainwater harvesting systems.',
  keywords: [
    'rainwater harvesting calculator',
    'RWH sizing',
    'hydrology',
    'catchment runoff',
    'tank capacity calculator',
    'groundwater recharge',
    'Gemini AI',
    'sustainability',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💧</text></svg>" />
      </head>
      <body className="min-h-screen flex flex-col text-slate-800 antialiased selection:bg-sky-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
