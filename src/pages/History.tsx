import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Search, Package, Calendar, MapPin, Mail, Phone, Receipt } from 'lucide-react';
import { Order } from '@/types/flower';

const History = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'email' | 'phone' | 'id'>('email');
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [displayedOrders, setDisplayedOrders] = useState<Order[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load all orders on component mount
  useEffect(() => {
    const loadOrders = () => {
      try {
        const existingOrders = JSON.parse(localStorage.getItem('flowerOrders') || '[]') as Order[];
        setAllOrders(existingOrders);
        setDisplayedOrders(existingOrders);
      } catch (error) {
        console.error('Error loading orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, []);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      // If no search term, show all orders
      setDisplayedOrders(allOrders);
      return;
    }

    setIsSearching(true);

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filter orders based on search criteria
      const filtered = allOrders.filter(order => {
        switch (searchType) {
          case 'email':
            return order.customerInfo.email.toLowerCase().includes(searchTerm.toLowerCase());
          case 'phone':
            return order.customerInfo.phone.includes(searchTerm);
          case 'id':
            return order.id.includes(searchTerm);
          default:
            return false;
        }
      });

      setDisplayedOrders(filtered);
    } catch (error) {
      console.error('Error searching orders:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setDisplayedOrders(allOrders);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center">
          <Receipt className="w-8 h-8 mr-3" />
          Order History
        </h1>
        <p className="text-gray-600">
          Find your flower orders using your email, phone number, or order ID
        </p>
      </div>

      {/* Search Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="w-5 h-5 mr-2" />
            Search Orders
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-48">
              <Label htmlFor="search-term">Search by:</Label>
              <div className="flex gap-2 mt-1">
                <Button
                  variant={searchType === 'email' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSearchType('email')}
                >
                  <Mail className="w-4 h-4 mr-1" />
                  Email
                </Button>
                <Button
                  variant={searchType === 'phone' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSearchType('phone')}
                >
                  <Phone className="w-4 h-4 mr-1" />
                  Phone
                </Button>
                <Button
                  variant={searchType === 'id' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSearchType('id')}
                >
                  <Package className="w-4 h-4 mr-1" />
                  Order ID
                </Button>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Input
              id="search-term"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                searchType === 'email' 
                  ? 'Enter your email address'
                  : searchType === 'phone'
                  ? 'Enter your phone number'
                  : 'Enter order ID'
              }
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={isSearching}>
              {isSearching ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Orders Display */}
      {isLoading ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading orders...</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {displayedOrders.length > 0 ? (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  {searchTerm.trim() ? 'Search Results' : 'All Orders'}
                </h2>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {displayedOrders.length} order{displayedOrders.length !== 1 ? 's' : ''}
                  </Badge>
                  {searchTerm.trim() && (
                    <Button onClick={clearSearch} variant="outline" size="sm">
                      Clear Search
                    </Button>
                  )}
                </div>
              </div>

              {displayedOrders.map((order) => (
                <Card key={order.id} className="animate-fade-in">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center">
                        <Package className="w-5 h-5 mr-2" />
                        Order #{order.id}
                      </CardTitle>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(order.orderDate)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Customer Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Customer Information:</h4>
                        <div className="space-y-1 text-sm">
                          <p><strong>Name:</strong> {order.customerInfo.name}</p>
                          <p><strong>Email:</strong> {order.customerInfo.email}</p>
                          <p><strong>Phone:</strong> {order.customerInfo.phone}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Delivery Address:</h4>
                        <div className="flex items-start">
                          <MapPin className="w-4 h-4 mr-2 mt-0.5 text-gray-500 flex-shrink-0" />
                          <p className="text-sm">{order.customerInfo.address}</p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Order Items */}
                    <div>
                      <h4 className="font-medium mb-3">Order Items:</h4>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                              <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center mr-3">
                                <Package className="w-6 h-6 text-gray-400" />
                              </div>
                              <div>
                                <p className="font-medium">{item.flower.name}</p>
                                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">${(item.flower.price * item.quantity).toFixed(2)}</p>
                              <p className="text-sm text-gray-600">${item.flower.price}/each</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Order Total */}
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Total:</span>
                      <span className="text-2xl font-bold text-primary">${order.total.toFixed(2)}</span>
                    </div>

                    {/* Shop Info */}
                    {order.shop && (
                      <div className="pt-2 border-t">
                        <p className="text-sm text-gray-600">
                          <strong>Shop:</strong> {order.shop.name} - {order.shop.location}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm.trim() ? 'No Orders Found' : 'No Orders Yet'}
                </h3>
                <p className="text-gray-600">
                  {searchTerm.trim() 
                    ? `We couldn't find any orders matching your search criteria. Please check your ${searchType} and try again.`
                    : 'You haven\'t placed any orders yet. Start shopping to see your order history here!'
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default History;