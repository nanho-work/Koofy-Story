import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "쿠피 스토리",
  description: "월간 쿠피, 연재소설, 인터뷰를 만나는 쿠피랩의 읽을거리.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
