import { Coupon } from '@/types/coupon';

export const coupons: Coupon[] = [
  {
    id: 'SPRING20',
    name: 'Spring Sale',
    code: 'SPRING20',
    discount: 20,
    description: 'Get 20% off on all spring flowers',
    expiryDate: new Date('2025-06-01'),
    isActive: true,
    minOrderAmount: 50
  },
  {
    id: 'WELCOME10',
    name: 'Welcome Discount',
    code: 'WELCOME10', 
    discount: 10,
    description: 'Welcome! Get 10% off your first order',
    expiryDate: new Date('2025-12-31'),
    isActive: true,
    minOrderAmount: 30
  },
  {
    id: 'ROSES15',
    name: 'Rose Special',
    code: 'ROSES15',
    discount: 15,
    description: '15% off on all rose bouquets',
    expiryDate: new Date('2025-05-15'),
    isActive: true,
    minOrderAmount: 40
  },
  {
    id: 'VALENTINE25',
    name: 'Valentine Special',
    code: 'VALENTINE25',
    discount: 25,
    description: '25% off for Valentine\'s Day flowers',
    expiryDate: new Date('2025-02-14'),
    isActive: true,
    minOrderAmount: 60
  },
  {
    id: 'BULK30',
    name: 'Bulk Order',
    code: 'BULK30',
    discount: 30,
    description: '30% off on orders over $200',
    expiryDate: new Date('2025-08-31'),
    isActive: true,
    minOrderAmount: 200
  },
  {
    id: 'SUMMER18',
    name: 'Summer Bloom',
    code: 'SUMMER18',
    discount: 18,
    description: '18% off on summer flower collections',
    expiryDate: new Date('2025-08-31'),
    isActive: true,
    minOrderAmount: 45
  }
];