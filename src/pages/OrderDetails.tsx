import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ArrowLeft, Package } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-soft">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="py-12">
              <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-semibold mb-2">Order not found</h2>
              <p className="text-muted-foreground mb-6">
                The order you're looking for doesn't exist.
              </p>
              <Button asChild>
                <Link to="/">Continue Shopping</Link>
              </Button>
            </CardContent>
          </Card>
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
      minute: '2-digit',
      timeZoneName: 'short'
    }).format(new Date(date));
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Shop
            </Link>
          </Button>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <Card className="mb-6 text-center">
            <CardContent className="py-8">
              <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
              <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
              <p className="text-muted-foreground">
                Thank you for your order. We'll prepare your beautiful flowers with care.
              </p>
            </CardContent>
          </Card>

          {/* Order Details */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Order Details
                <Badge variant="secondary">Order #{order.id}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Order Items */}
              <div>
                <h3 className="font-semibold mb-4">Items Ordered:</h3>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.flower.id} className="flex items-center gap-4 p-3 bg-floral-cream rounded-lg">
                      <img
                        src={item.flower.image}
                        alt={item.flower.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.flower.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          ${item.flower.price} × {item.quantity}
                        </p>
                      </div>
                      <span className="font-medium">
                        ${(item.flower.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Total */}
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total:</span>
                <span className="text-floral-pink">${order.total.toFixed(2)}</span>
              </div>

              <Separator />

              {/* Delivery Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Delivery Address:</h3>
                  <div className="space-y-1 text-sm">
                    <p className="font-medium">{order.customerInfo.name}</p>
                    <p>{order.customerInfo.address}</p>
                    <p>{order.customerInfo.email}</p>
                    <p>{order.customerInfo.phone}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Order Information:</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Date:</span> {formatDate(order.orderDate)}</p>
                    <p><span className="font-medium">Shop:</span> {order.shop.name}</p>
                    <p><span className="font-medium">Location:</span> {order.shop.location}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild className="flex-1">
              <Link to="/">Continue Shopping</Link>
            </Button>
            <Button variant="outline" onClick={() => window.print()}>
              Print Order Details
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderDetails;