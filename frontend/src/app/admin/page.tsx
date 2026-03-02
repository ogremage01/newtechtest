import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingBag, Settings } from "lucide-react";

export const metadata = {
  title: "대시보드",
  description: "관리자 대시보드",
};

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">대시보드</h2>
      <p className="text-muted-foreground text-sm">
        관리 기능을 선택하세요. (추후 메뉴 추가 예정)
      </p>
      <section className="grid gap-4 grid-cols-1 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Package className="w-5 h-5" />
              상품 관리
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">상품 등록·수정·삭제</p>
            <Link
              href="/admin/products"
              className="inline-flex items-center justify-center rounded-md border border-input bg-background h-9 px-3 text-sm hover:bg-accent"
            >
              이동
            </Link>
          </CardContent>
        </Card>
        <Card className="hover:border-primary/50 transition-colors opacity-70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ShoppingBag className="w-5 h-5" />
              주문 관리
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">준비 중</p>
            <span className="inline-flex items-center justify-center rounded-md border border-input bg-muted h-9 px-3 text-sm text-muted-foreground cursor-not-allowed">
              이동
            </span>
          </CardContent>
        </Card>
        <Card className="hover:border-primary/50 transition-colors opacity-70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Settings className="w-5 h-5" />
              설정
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">준비 중</p>
            <span className="inline-flex items-center justify-center rounded-md border border-input bg-muted h-9 px-3 text-sm text-muted-foreground cursor-not-allowed">
              이동
            </span>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
