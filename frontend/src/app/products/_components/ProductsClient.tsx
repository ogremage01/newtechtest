"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";
import { api } from "@/lib/api";
import SearchBar from "@/components/SearchBar";
import type { Product } from "@/types/product";

export default function ProductsClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const q = searchParams?.get("q") ?? "";
  const addItem = useCartStore((s) => s.addItem);

  const loadProducts = useCallback(() => {
    setLoading(true);
    if (q.trim()) {
      api.get<Product[]>(`/api/products/search?q=${encodeURIComponent(q)}`)
        .then((data) => setProducts(Array.isArray(data) ? data : []))
        .catch(() => setProducts([]))
        .finally(() => setLoading(false));
    } else {
      api.get<Product[]>("/api/products")
        .then((data) => setProducts(Array.isArray(data) ? data : []))
        .catch(() => setProducts([]))
        .finally(() => setLoading(false));
    }
  }, [q]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleSearchResults = useCallback((data: unknown) => {
    setProducts(Array.isArray(data) ? (data as Product[]) : []);
  }, []);

  if (loading) {
    return <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">로딩 중...</div>;
  }

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">상품 목록</h1>
      <div className="mb-4">
        <SearchBar
          searchApiPath="/api/products/search"
          placeholder="상품 검색"
          onSearchResults={handleSearchResults}
        />
      </div>
      <div className="grid gap-4 grid-cols-1 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.length === 0 ? (
          <p className="text-muted-foreground">등록된 상품이 없습니다.</p>
        ) : (
          products.map((p) => (
            <Card key={p.id}>
              <CardContent className="pt-6">
                {p.imageUrl && (
                  <div className="relative w-full h-48 rounded-md overflow-hidden mb-4">
                    <Image src={p.imageUrl} alt={p.name} fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" unoptimized />
                  </div>
                )}
                <Link href={`/products/${p.id}`} className="font-semibold hover:underline">
                  {p.name}
                </Link>
                <p className="text-sm text-muted-foreground mt-1">{p.description}</p>
                <p className="font-medium mt-2">{p.price.toLocaleString()}원</p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => addItem({ productId: p.id, name: p.name, price: p.price, imageUrl: p.imageUrl })}>
                  장바구니 담기
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
