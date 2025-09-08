import { useState, useMemo } from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FlowerCard from '@/components/FlowerCard';
import { flowers } from '@/data/flowers';
import { useFavorites } from '@/context/FavoritesContext';

const Favorites = () => {
  const { favorites, isFavorite } = useFavorites();
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const favoriteFlowers = useMemo(() => {
    const favoriteFlowersList = flowers.filter(flower => isFavorite(flower.id));
    
    const sorted = [...favoriteFlowersList].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'dateAdded':
          aValue = new Date(a.dateAdded).getTime();
          bValue = new Date(b.dateAdded).getTime();
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
    
    return sorted;
  }, [favorites, sortBy, sortOrder, isFavorite]);

  if (favoriteFlowers.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center py-16">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl text-gray-500">No favorites yet</h2>
          <p className="text-gray-400 mb-4">Start adding flowers to your favorites to see them here</p>
          <Button onClick={() => window.location.href = '/shop'}>
            Browse Flowers
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <Heart className="w-6 h-6 mr-2 fill-red-500 text-red-500" />
          My Favorites ({favoriteFlowers.length})
        </h1>
        
        <div className="flex items-center space-x-4">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="price">Price</SelectItem>
              <SelectItem value="dateAdded">Date Added</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortOrder} onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {favoriteFlowers.map((flower) => (
          <div key={flower.id} className="animate-fade-in">
            <FlowerCard 
              flower={{...flower, isFavorite: isFavorite(flower.id)}}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;