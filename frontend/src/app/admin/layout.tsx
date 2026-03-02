import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "관리자",
  description: "쇼핑몰 관리자 페이지",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-muted-foreground border-b pb-2">/admin</h1>
      {children}
    </div>
  );
}
