import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import { Order } from '@/types/flower';

const OrderDetails = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (orderId) {
      const orders = JSON.parse(localStorage.getItem('flowerOrders') || '[]');
      const foundOrder = orders.find((o: Order) => o.id === orderId);
      setOrder(foundOrder || null);
    }
  }, [orderId]);

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-semibold mb-2">Order not found</h2>
          <Button asChild>
            <Link to="/shop">Continue Shopping</Link>
          </Button>
        </main>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">Order Details</h1>
          <h2 className="text-xl mb-6">Order #{order.id}</h2>

          <Card className="border mb-6">
            <CardContent className="p-6">
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.flower.id} className="flex items-center gap-4 pb-4 border-b last:border-0">
                    <div className="w-16 h-12 bg-gray-100 border flex items-center justify-center">
                      <span className="text-xs text-gray-400">×</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.flower.name}</h4>
                    </div>
                    <div className="text-sm">
                      x {item.quantity}
                    </div>
                  </div>
                ))}
                
                <div className="pt-4">
                  <p className="font-semibold">Total: ${order.total.toFixed(2)}</p>
                </div>
                
                <div className="pt-4 space-y-2">
                  <p><span className="font-medium">Delivery Address:</span> {order.customerInfo.address}</p>
                  <p><span className="font-medium">Date:</span> {formatDate(order.orderDate)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button asChild>
            <Link to="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default OrderDetails;