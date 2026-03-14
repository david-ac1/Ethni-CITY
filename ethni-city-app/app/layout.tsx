import type { Metadata } from "next";
import { Space_Grotesk, Playfair_Display } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Ethni-CITY | Sonic Story-Zines from the Global South",
  description:
    "Upload your travel photos. Let AI discover the niche local music of that exact place. Generate a beautiful Sonic Story-Zine that credits the artists who made it.",
  openGraph: {
    title: "Ethni-CITY | Sonic Story-Zines",
    description: "Discover hyper-local music from the Global South through your travel photos.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${playfairDisplay.variable} font-display antialiased bg-background-light text-background-dark`}
      >
        {children}
      </body>
    </html>
  );
}
