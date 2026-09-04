import type { Metadata } from "next";
import {
  Alex_Brush,
  Gelasio,
  Geist,
  Geist_Mono,
  Inter,
  Italianno,
} from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Named *-sans so the Tailwind theme key can be `--font-inter` without
// referencing itself. See globals.css.
const inter = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin"],
});

// Named *-serif for the same reason as inter above: the Tailwind theme key
// `--font-gelasio` can't reference a variable of its own name.
const gelasio = Gelasio({
  variable: "--font-gelasio-serif",
  subsets: ["latin"],
});

// The FTC mark. Named *-script for the same reason as the fonts above.
const alexBrush = Alex_Brush({
  variable: "--font-alex-brush-script",
  subsets: ["latin"],
  weight: "400",
});

const italianno = Italianno({
  variable: "--font-italianno",
  subsets: ["latin"],
  weight: "400",
});

// Self-hosted rather than from Google. Named *-script for the same reason as
// inter and gelasio above: the Tailwind theme key `--font-cochocib` cannot
// reference a variable of its own name. See globals.css.
const cochocib = localFont({
  src: "../fonts/Cochocib Script Free.otf",
  variable: "--font-cochocib-script",
  display: "swap",
});

export const metadata: Metadata = {
  title: "For the Culture",
  description: "For the Culture is a full-service creative agency specializing in web design, branding, and digital marketing. We help businesses and individuals bring their ideas to life through innovative design and strategic marketing solutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Font vars live on <html>, not <body>: shadcn's base layer applies
    // `font-sans` to <html>, which cannot see variables scoped to <body>.
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${gelasio.variable} ${italianno.variable} ${alexBrush.variable} ${cochocib.variable}`}
    >
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
