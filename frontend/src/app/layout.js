import "./globals.css";
import { Inter } from "next/font/google";
import AppLayoutWrapper from "@/components/AppLayoutWrapper";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "WaveGuard",
    description: "Protect Canada's Shorelines Together",
};

export default function RootLayout({ children }) {
    return (
        // SuppressHydrationWarning to prevent errors from browser extensions
        <html lang="en" suppressHydrationWarning={true}>
        <body className={inter.className}>
        {/* Wrap the entire application with the AuthProvider */}
        <AuthProvider>
            <AppLayoutWrapper>{children}</AppLayoutWrapper>
        </AuthProvider>
        </body>
        </html>
    );
}