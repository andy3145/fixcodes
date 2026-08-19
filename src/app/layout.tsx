import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import type { ReactNode } from 'react';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import './globals.css';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
    display: 'swap',
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
    display: 'swap',
});

const siteDescription =
    'Search appliance error codes, understand likely causes, follow step-by-step diagnostic checks, and identify compatible replacement parts for major appliance brands.';

export const metadata: Metadata = {
    metadataBase: new URL('https://www.fixcodedb.com'),
    title: {
        default: 'FixCodeDB | Appliance Error Code Diagnostics & Repair Guides',
        template: '%s | FixCodeDB',
    },
    description: siteDescription,
    applicationName: 'FixCodeDB',
    category: 'Home repair',
    alternates: {
        canonical: '/',
    },
    openGraph: {
        type: 'website',
        url: '/',
        siteName: 'FixCodeDB',
        title: 'FixCodeDB | Appliance Error Code Diagnostics & Repair Guides',
        description: siteDescription,
    },
    twitter: {
        card: 'summary_large_image',
        title: 'FixCodeDB | Appliance Error Code Diagnostics',
        description: siteDescription,
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
        },
    },
    other: {
        'google-adsense-account': 'ca-pub-2557635897830952',
    },
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
            <body className="min-h-full bg-slate-50 text-slate-900">
                <div className="flex min-h-screen flex-col">
                    <SiteHeader />
                    <div className="flex-1">{children}</div>
                    <SiteFooter />
                </div>
            </body>
        </html>
    );
}
