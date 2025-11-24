import "./globals.css";
import AppLayoutWrapper from "@/components/AppLayoutWrapper";
import { AuthProvider } from "@/context/AuthContext";
import { JoinedChallengesProvider } from "@/context/JoinedChallengesContext";
import { Analytics } from "@vercel/analytics/next"

export const metadata = {
    title: "MarineCare - Ocean Conservation Platform",
    description:
        "Join Canada's ocean conservation movement. Track cleanup efforts, classify waste with AI, and protect our coastlines.",
    keywords:
        "ocean conservation, beach cleanup, marine debris, Canada coastline, environmental impact, AI waste classification",
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "MarineCare",
    },
    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon.ico",
        apple: "/favicon.ico",
    },
};

// New syntax for Next.js 15+
export const viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
};

// New dedicated export for theme color
export const themeColor = "#0077b6";

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning={true}>
        <head>
            <link
                rel="preload"
                as="image"
                href="/images/login-mobile.webp"
                media="(max-width: 900px)"
            />
            <link
                rel="preload"
                as="image"
                href="/images/login-optimized.webp"
                media="(min-width: 901px)"
            />
            <link rel="preload" as="image" href="/images/1.png" />
        </head>
        <body
            style={{
                fontFamily:
                    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            }}
        >
        <AuthProvider>
            <JoinedChallengesProvider>
                <AppLayoutWrapper>{children}</AppLayoutWrapper>
            </JoinedChallengesProvider>
        </AuthProvider>
        <Analytics />
        </body>
        </html>
    );
}
