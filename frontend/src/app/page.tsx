import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import homeContent from "@/locales/ko/common.json";
import SearchBarHome from "@/app/_components/SearchBarHome";

// SSG: 빌드 시 정적 HTML 생성. 실 서버에 Node 불필요.
export const dynamic = "force-static";

export default function Home() {
  const { home: t, nav } = homeContent as {
    home: Record<string, string>;
    nav: Record<string, string>;
  };

  return (
    <div className="space-y-8">
      <section className="text-center py-8 sm:py-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">{t.heroTitle}</h1>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto text-sm sm:text-base px-2">
          {t.heroSubtitle}
        </p>
        <Link
          href="/products"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground h-10 px-4 py-2 hover:bg-primary/90"
        >
          {t.cta}
        </Link>
      </section>
      <SearchBarHome />
      <section className="grid gap-4 grid-cols-1 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>{t.sectionProductsTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">{t.sectionProductsDesc}</p>
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-md border border-input bg-background h-9 px-3 hover:bg-accent"
            >
              {t.view}
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t.sectionCartTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">{t.sectionCartDesc}</p>
            <Link
              href="/cart"
              className="inline-flex items-center justify-center rounded-md border border-input bg-background h-9 px-3 hover:bg-accent"
            >
              {nav.cart}
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
