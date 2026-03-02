import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { AddToCartButton } from "./_components/AddToCartButton";
import { JsonLdProduct } from "@/lib/json-ld";
import type { Product } from "@/types/product";
import type { Metadata } from "next";
import { getServerApiBaseUrl } from "@/lib/server-api";

async function getProduct(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`${getServerApiBaseUrl()}/api/products/${id}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data && typeof data === "object" && "id" in data ? (data as Product) : null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return { title: "상품을 찾을 수 없습니다" };
  return {
    title: product.name,
    description: product.description ?? product.name,
    openGraph: { title: product.name, description: product.description ?? product.name },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  return (
    <>
      <JsonLdProduct product={product} />
      <Card>
        <CardContent className="pt-4 sm:pt-6">
          <Link href="/products" className="text-sm text-muted-foreground hover:underline mb-4 inline-block">
            ← 상품 목록
          </Link>
          {product.imageUrl && (
            <div className="relative w-full max-w-md h-48 sm:h-64 rounded-md overflow-hidden mb-4">
              <Image src={product.imageUrl} alt={product.name} fill className="object-cover" sizes="(max-width:768px) 100vw, 28rem" unoptimized />
            </div>
          )}
          <h1 className="text-xl sm:text-2xl font-bold">{product.name}</h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">{product.description}</p>
          <p className="text-lg sm:text-xl font-semibold mt-4">₩{product.price.toLocaleString()}</p>
          <AddToCartButton product={product} />
        </CardContent>
      </Card>
    </>
  );
}
