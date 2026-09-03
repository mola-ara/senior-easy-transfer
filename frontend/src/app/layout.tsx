import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppStoreProvider } from "@/store/app-store";
import { AppShell } from "@/components/ui";

export const metadata: Metadata = {
  title: { default: "바다송금", template: "%s | 바다송금" },
  description: "고령자를 위한 안전하고 쉬운 송금 연습 서비스",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0B6FA8",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        <AppStoreProvider>
          <AppShell>{children}</AppShell>
        </AppStoreProvider>
      </body>
    </html>
  );
}
