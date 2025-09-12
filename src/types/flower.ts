export interface Flower {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  shop: string;
  dateAdded: Date;
  isFavorite?: boolean;
}

export interface CartItem {
  flower: Flower;
  quantity: number;
}

export interface Shop {
  id: string;
  name: string;
  location: string;
  address: string;
  phone: string;
  hours: string;
  coordinates: [number, number];
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  orderDate: Date;
  shop: Shop;
  appliedCoupon?: {
    id: string;
    name: string;
    code: string;
    discount: number;
  } | null;
  originalTotal?: number;
  discountAmount?: number;
}