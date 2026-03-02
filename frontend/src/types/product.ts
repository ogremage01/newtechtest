export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
}

export interface ProductSingleCard {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  condition: "NM" | "EX" | "VG" | "G";
}