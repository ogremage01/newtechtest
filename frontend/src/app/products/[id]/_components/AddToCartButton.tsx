"use client";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";
import type { Product } from "@/types/product";

export function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  return (
    <Button
      className="mt-4"
      onClick={() => addItem({ productId: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl })}
    >
      장바구니 담기
    </Button>
  );
}
