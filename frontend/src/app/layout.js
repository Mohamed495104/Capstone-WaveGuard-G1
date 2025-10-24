import "./globals.css";
import { Inter } from "next/font/google";
import AppLayoutWrapper from "@/components/AppLayoutWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "WaveGuard",
    description: "Protect Canada's Shorelines Together",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <AppLayoutWrapper>{children}</AppLayoutWrapper>
        </body>
        </html>
    );
}
