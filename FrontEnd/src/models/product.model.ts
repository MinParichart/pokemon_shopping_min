export interface Product { 
  id: number; 
  name: string; 
  description: string; 
  price: number; 
  stock: number;
  category? : string;
  imageURL?: string;
}

export interface ProductQuery { 
  name? : string; 
  category? : string; 
  sort? : 'price-asc' | 'price-desc' | 'name-asc'| 'name-desc'; // การจัดเรียงสินค้า
  page? : number; 
  pageSize? : number; 
}

export interface CartItem { 
  product: Product; 
  quantity: number;
}