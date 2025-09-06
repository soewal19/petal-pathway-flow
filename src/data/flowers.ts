import { Flower, Shop } from '@/types/flower';
import roseBouquet from '@/assets/rose-bouquet.jpg';
import lilyBouquet from '@/assets/lily-bouquet.jpg';
import tulipBouquet from '@/assets/tulip-bouquet.jpg';
import daisyBouquet from '@/assets/daisy-bouquet.jpg';

export const shops: Shop[] = [
  {
    id: 'flowery-fragrant',
    name: 'Flowery Fragrant',
    location: '123 Garden Street, Bloomville'
  },
  {
    id: 'bloomwell',
    name: 'Bloomwell',
    location: '456 Rose Avenue, Petalton'
  }
];

export const flowers: Flower[] = [
  {
    id: 'rose-1',
    name: 'Rose',
    price: 25.99,
    image: roseBouquet,
    description: 'Beautiful pink roses perfect for any romantic occasion',
    shop: 'Flowery Fragrant',
    dateAdded: new Date('2024-01-15'),
    isFavorite: false
  },
  {
    id: 'lily-1',
    name: 'Lily',
    price: 32.99,
    image: lilyBouquet,
    description: 'Elegant white lilies symbolizing purity and rebirth',
    shop: 'Flowery Fragrant',
    dateAdded: new Date('2024-01-10'),
    isFavorite: false
  },
  {
    id: 'tulip-1',
    name: 'Tulip',
    price: 18.99,
    image: tulipBouquet,
    description: 'Vibrant spring tulips to brighten any space',
    shop: 'Bloomwell',
    dateAdded: new Date('2024-01-20'),
    isFavorite: false
  },
  {
    id: 'daisy-1',
    name: 'Daisy',
    price: 22.99,
    image: daisyBouquet,
    description: 'Cheerful daisies bringing joy and innocence',
    shop: 'Bloomwell',
    dateAdded: new Date('2024-01-12'),
    isFavorite: false
  },
  {
    id: 'rose-2',
    name: 'Premium Rose',
    price: 45.99,
    image: roseBouquet,
    description: 'Premium collection of the finest roses',
    shop: 'Flowery Fragrant',
    dateAdded: new Date('2024-01-25'),
    isFavorite: false
  },
  {
    id: 'lily-2',
    name: 'White Lily Premium',
    price: 38.99,
    image: lilyBouquet,
    description: 'Premium white lilies for special occasions',
    shop: 'Bloomwell',
    dateAdded: new Date('2024-01-08'),
    isFavorite: false
  }
];