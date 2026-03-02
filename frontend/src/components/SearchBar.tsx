"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

export type SearchBarProps = {
  /** 페이지마다 다른 검색 API 경로. 예: /api/products/search, /api/orders/search */
  searchApiPath: string;
  /** 검색 결과를 받을 콜백. (결과 데이터, 검색어) — 결과 처리·라우팅은 페이지에서 결정 */
  onSearchResults?: (data: unknown, query: string) => void;
  placeholder?: string;
  /** 쿼리 파라미터 이름 (기본: q) */
  queryParam?: string;
};

export default function SearchBar({
  searchApiPath,
  onSearchResults,
  placeholder = "Search",
  queryParam = "q",
}: SearchBarProps) {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  const doSearch = useCallback(async () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setLoading(true);
    try {
      const path = `${searchApiPath}?${queryParam}=${encodeURIComponent(trimmed)}`;
      const data = await api.get<unknown>(path);
      onSearchResults?.(data, trimmed);
    } catch (e) {
      console.error("Search failed:", e);
      onSearchResults?.(null, trimmed);
    } finally {
      setLoading(false);
    }
  }, [searchApiPath, queryParam, value, onSearchResults]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    doSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <Input
        id="search"
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={loading}
        aria-label="검색어"
      />
      <Button type="submit" disabled={loading} id="search-button" aria-label="검색">
        <Search className="w-4 h-4" id="search-icon" />
      </Button>
    </form>
  );
}
