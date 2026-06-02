import type { Metadata } from "next";
import { Oswald, Noto_Sans_JP, Noto_Serif_TC } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { Header } from "@/components/pages/header/Header";
import { Footer } from "@/components/pages/footer/Footer";
import { I18nProvider } from "@/i18n";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const notoSerifTC = Noto_Serif_TC({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "結城安全帽",
  description: "結城安全帽官方商店",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="zh-TW">
      <body
        className={`${oswald.variable} ${notoSansJP.variable} ${notoSerifTC.variable} h-full antialiased`}
      >
        <I18nProvider>
          <CartProvider>
            <AuthProvider>
              <Header />
              <main className="flex-1 pt-16">{children}</main>
            </AuthProvider>
          </CartProvider>
          <GoogleAnalytics gaId="G-E4V8YRPK7W" />
        </I18nProvider>
      </body>
    </html>
  );
}