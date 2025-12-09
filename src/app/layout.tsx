import type {Metadata}
from "next";
import "./globals.css";
import {Libre_Baskerville} from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata : Metadata = {
    title: "PNW Parking",
    description: "This is a website that helps PNW with finding parking spots"
};

// Import Libre Baskerville instead of Inter
const libreBaskerville = Libre_Baskerville({
    subsets: ["latin"],
    weight: [
        "400", "700"
    ],
    display: "swap"
});

export default function RootLayout({children} : Readonly < {
    children: React.ReactNode;
} >) {
    return (
        <html lang="en" className={libreBaskerville.className}>
            <body className="flex flex-col min-h-screen">
                <Header/>

                <main className="grow w-full pt-[72px]">
                    {children}
                </main>
                <Footer/>

            </body>
        </html>
    );
}
