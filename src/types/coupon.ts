export interface Coupon {
  id: string;
  name: string;
  code: string;
  discount: number; // percentage discount
  description: string;
  expiryDate: Date;
  isActive: boolean;
  minOrderAmount?: number;
}

export interface AppliedCoupon {
  coupon: Coupon;
  discountAmount: number;
}