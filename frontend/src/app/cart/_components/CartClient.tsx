"use client";

import { useCartStore } from "@/stores/cart-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CartClient() {
  const { items, removeItem, updateQuantity, itemCount } = useCartStore();

  if (itemCount === 0) {
    return (
      <div className="text-center py-8 sm:py-12">
        <h1 className="text-xl sm:text-2xl font-bold mb-4">장바구니</h1>
        <p className="text-muted-foreground text-sm sm:text-base">장바구니가 비어 있습니다.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">장바구니</h1>
      <div className="space-y-4">
        {items.map((item) => (
          <Card key={item.productId}>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 pb-2 gap-2">
              <CardTitle className="text-base font-semibold line-clamp-2">{item.name}</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => removeItem(item.productId)} className="shrink-0">
                삭제
              </Button>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => updateQuantity(item.productId, item.quantity - 1)}>-</Button>
                <span>{item.quantity}</span>
                <Button variant="outline" size="icon" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</Button>
              </div>
              <span className="font-medium text-sm sm:text-base">{(item.price * item.quantity).toLocaleString()}원</span>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-6 text-right">
        <p className="text-lg font-semibold">
          총 {items.reduce((acc, i) => acc + i.price * i.quantity, 0).toLocaleString()}원
        </p>
      </div>
    </div>
  );
}
