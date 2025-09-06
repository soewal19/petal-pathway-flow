import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
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
    <div className="min-h-screen bg-gradient-soft">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Flower Shops</h1>
          <p className="text-muted-foreground">
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
                    variant={selectedShop === '' ? 'default' : 'outline'}
                    className="w-full justify-start"
                    onClick={() => setSelectedShop('')}
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
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 bg-white rounded-lg shadow-card">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Sort by:</span>
                <Select value={sortBy} onValueChange={(value: 'price' | 'date') => setSortBy(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="date">Date Added</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={sortOrder} onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">
                      {sortBy === 'price' ? 'Low to High' : 'Oldest First'}
                    </SelectItem>
                    <SelectItem value="desc">
                      {sortBy === 'price' ? 'High to Low' : 'Newest First'}
                    </SelectItem>
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
                <FlowerCard 
                  key={flower.id} 
                  flower={flower} 
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>

            {filteredAndSortedFlowers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No flowers found in the selected shop.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Shop;