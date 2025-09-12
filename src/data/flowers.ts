import { Flower, Shop } from '@/types/flower';
import roseBouquet from '@/assets/rose-bouquet.jpg';
import lilyBouquet from '@/assets/lily-bouquet.jpg';
import tulipBouquet from '@/assets/tulip-bouquet.jpg';
import daisyBouquet from '@/assets/daisy-bouquet.jpg';

export const shops: Shop[] = [
  {
    id: 'flowery-fragrant',
    name: 'Flowery Fragrant',
    location: '123 Garden Street, Bloomville',
    address: '123 Garden Street, Bloomville',
    phone: '+1 (555) 123-4567',
    hours: '9:00 AM - 8:00 PM',
    coordinates: [30.5234, 50.4501] // Kiev center
  },
  {
    id: 'bloomwell',
    name: 'Bloomwell',
    location: '456 Rose Avenue, Petalton',
    address: '456 Rose Avenue, Petalton',
    phone: '+1 (555) 234-5678', 
    hours: '8:00 AM - 9:00 PM',
    coordinates: [30.5434, 50.4601] // Kiev north
  },
  {
    id: 'petals-paradise',
    name: 'Petals Paradise',
    location: '789 Flower Road, Gardenville',
    address: '789 Flower Road, Gardenville',
    phone: '+1 (555) 345-6789',
    hours: '10:00 AM - 7:00 PM', 
    coordinates: [30.5034, 50.4401] // Kiev south
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
  },
  {
    id: 'rose-3',
    name: 'Garden Rose Deluxe',
    price: 55.99,
    image: roseBouquet,
    description: 'Exquisite garden roses for special celebrations',
    shop: 'Petals Paradise',
    dateAdded: new Date('2024-01-30'),
    isFavorite: false
  },
  {
    id: 'tulip-2',
    name: 'Spring Tulip Mix',
    price: 28.99,
    image: tulipBouquet,
    description: 'Mixed spring tulips in vibrant colors',
    shop: 'Petals Paradise',
    dateAdded: new Date('2024-02-01'),
    isFavorite: false
  },
  {
    id: 'daisy-2',
    name: 'Wild Daisy Collection',
    price: 19.99,
    image: daisyBouquet,
    description: 'Wild daisies perfect for casual occasions',
    shop: 'Flowery Fragrant',
    dateAdded: new Date('2024-02-05'),
    isFavorite: false
  },
  {
    id: 'lily-3',
    name: 'Oriental Lily Bouquet',
    price: 42.99,
    image: lilyBouquet,
    description: 'Fragrant oriental lilies with stunning beauty',
    shop: 'Petals Paradise',
    dateAdded: new Date('2024-02-10'),
    isFavorite: false
  },
  {
    id: 'rose-4',
    name: 'Red Rose Classic',
    price: 29.99,
    image: roseBouquet,
    description: 'Classic red roses for timeless romance',
    shop: 'Bloomwell',
    dateAdded: new Date('2024-02-12'),
    isFavorite: false
  },
  {
    id: 'tulip-3',
    name: 'Dutch Tulip Premium',
    price: 35.99,
    image: tulipBouquet,
    description: 'Premium Dutch tulips imported fresh',
    shop: 'Flowery Fragrant',
    dateAdded: new Date('2024-02-15'),
    isFavorite: false
  },
  {
    id: 'daisy-3',
    name: 'English Daisy Bunch',
    price: 24.99,
    image: daisyBouquet,
    description: 'Charming English daisies in a rustic bunch',
    shop: 'Petals Paradise',
    dateAdded: new Date('2024-02-18'),
    isFavorite: false
  }
];