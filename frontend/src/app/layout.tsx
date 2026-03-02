import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import Header from "@/components/Header";
import I18nProvider from "@/components/I18nProvider";
import "./_styles/globals.css";

const notoSansKr = Noto_Sans_KR({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: { default: "쇼핑몰", template: "%s | 쇼핑몰" },
  description: "중소형 쇼핑몰 - 다양한 상품을 만나보세요.",
  openGraph: { title: "쇼핑몰", description: "다양한 상품을 만나보세요." },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${notoSansKr.className} antialiased`}>
        <I18nProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">{children}</main>
            <footer className="border-t py-4 px-4 sm:px-6 lg:px-8 text-center text-xs sm:text-sm text-muted-foreground">
              © 쇼핑몰. All rights reserved.
            </footer>
          </div>
        </I18nProvider>
      </body>
    </html>
  );
}
