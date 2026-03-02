"use client";

import { useRouter } from "next/navigation";
import SearchBar from "@/components/SearchBar";

/** 홈 페이지용: 상품 검색 API 호출 후 /products?q= 검색어 로 이동 */
export default function SearchBarHome() {
  const router = useRouter();
  return (
    <SearchBar
      searchApiPath="/api/products/search"
      placeholder="Search"
      onSearchResults={(_data, query) => router.push(`/products?q=${encodeURIComponent(query)}`)}
    />
  );
}
