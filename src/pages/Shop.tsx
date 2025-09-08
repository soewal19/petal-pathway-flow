import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import FlowerCard from '@/components/FlowerCard';
import { useFavorites } from '@/context/FavoritesContext';
import { flowers, shops } from '@/data/flowers';

const Shop = () => {
  const [selectedShop, setSelectedShop] = useState<string>('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const { isFavorite } = useFavorites();

  const filteredAndSortedFlowers = useMemo(() => {
    let filtered = flowers;

    // Filter by shop
    if (selectedShop !== 'all') {
      filtered = filtered.filter(flower => flower.shop === selectedShop);
    }

    // Sort flowers
    const sorted = [...filtered].sort((a, b) => {
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
  }, [selectedShop, sortBy, sortOrder]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Flower Shops</h1>
        <p className="text-gray-600">
          Discover beautiful flowers from our partner shops
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 space-y-6">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">Shops:</h3>
              <div className="space-y-2">
                <Button
                  variant={selectedShop === 'all' ? 'default' : 'outline'}
                  className="w-full justify-start"
                  onClick={() => setSelectedShop('all')}
                >
                  All Shops
                </Button>
                {shops.map((shop) => (
                  <Button
                    key={shop.id}
                    variant={selectedShop === shop.name ? 'default' : 'outline'}
                    className="w-full justify-start"
                    onClick={() => setSelectedShop(shop.name)}
                  >
                    {shop.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Filters */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 bg-white rounded-lg shadow-sm">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Sort by:</span>
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

            <Badge variant="secondary" className="text-sm">
              {filteredAndSortedFlowers.length} flowers found
            </Badge>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedFlowers.map((flower) => (
              <div key={flower.id} className="animate-fade-in">
                <FlowerCard 
                  flower={{...flower, isFavorite: isFavorite(flower.id)}}
                />
              </div>
            ))}
          </div>

          {filteredAndSortedFlowers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">
                No flowers found in the selected shop.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;