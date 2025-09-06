import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FlowerCard from '@/components/FlowerCard';
import Header from '@/components/Header';
import { flowers, shops } from '@/data/flowers';
import { Flower } from '@/types/flower';

const Shop = () => {
  const [selectedShop, setSelectedShop] = useState<string>('');
  const [sortBy, setSortBy] = useState<'price' | 'date'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [flowersData, setFlowersData] = useState<Flower[]>(flowers);

  const handleToggleFavorite = (flowerId: string) => {
    setFlowersData(prev =>
      prev.map(flower =>
        flower.id === flowerId 
          ? { ...flower, isFavorite: !flower.isFavorite }
          : flower
      )
    );
  };

  const filteredAndSortedFlowers = useMemo(() => {
    let filtered = flowersData;

    // Filter by shop
    if (selectedShop) {
      filtered = filtered.filter(flower => flower.shop === selectedShop);
    }

    // Sort flowers
    const sorted = [...filtered].sort((a, b) => {
      // Favorites always come first regardless of sort
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;

      // Then sort by selected criteria
      if (sortBy === 'price') {
        return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
      } else {
        const aDate = new Date(a.dateAdded).getTime();
        const bDate = new Date(b.dateAdded).getTime();
        return sortOrder === 'asc' ? aDate - bDate : bDate - aDate;
      }
    });

    return sorted;
  }, [flowersData, selectedShop, sortBy, sortOrder]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-48">
            <Card className="border">
              <CardContent className="p-4">
                <h3 className="font-medium mb-4 text-sm">Shops:</h3>
                <div className="space-y-2">
                  <Button
                    variant={selectedShop === 'Flowery Fragrant' ? 'default' : 'outline'}
                    className="w-full justify-center text-xs py-1 h-8"
                    onClick={() => setSelectedShop('Flowery Fragrant')}
                  >
                    Flowery Fragrant
                  </Button>
                  <Button
                    variant={selectedShop === 'Bloomwell' ? 'default' : 'outline'}
                    className="w-full justify-center text-xs py-1 h-8"
                    onClick={() => setSelectedShop('Bloomwell')}
                  >
                    Bloomwell
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-center text-xs py-1 h-8"
                  >
                    etc..
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-center text-xs py-1 h-8"
                  >
                    etc..
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-center text-xs py-1 h-8"
                  >
                    etc..
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Filters */}
            <div className="flex items-center justify-end gap-4 mb-6">
              <Button
                variant={sortBy === 'price' ? 'default' : 'ghost'}
                className="text-sm"
                onClick={() => setSortBy('price')}
              >
                Sort by price
              </Button>
              <Button
                variant={sortBy === 'date' ? 'default' : 'ghost'}
                className="text-sm"
                onClick={() => setSortBy('date')}
              >
                Sort by date
              </Button>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredAndSortedFlowers.map((flower) => (
                <FlowerCard 
                  key={flower.id} 
                  flower={flower} 
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Shop;