import { Suspense } from "react";
import ProductsClient from "./_components/ProductsClient";

export const metadata = {
  title: "상품 목록",
  description: "쇼핑몰 상품 목록을 둘러보세요.",
};

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-4 text-center text-muted-foreground">로딩 중...</div>}>
      <ProductsClient />
    </Suspense>
  );
}
