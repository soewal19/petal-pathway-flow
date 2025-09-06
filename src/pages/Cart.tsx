import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Header from '@/components/Header';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { shops } from '@/data/flowers';

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
}

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const { toast } = useToast();
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const handleInputChange = (field: keyof CustomerInfo) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSubmitOrder = () => {
    // Validate form
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.address) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (cartItems.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to your cart before placing an order",
        variant: "destructive"
      });
      return;
    }

    // Generate order ID and create order
    const orderId = Date.now().toString();
    const order = {
      id: orderId,
      items: cartItems,
      total: getCartTotal(),
      customerInfo,
      orderDate: new Date(),
      shop: shops[0] // For now, use first shop
    };

    // Save order to localStorage (simulating database)
    const existingOrders = JSON.parse(localStorage.getItem('flowerOrders') || '[]');
    existingOrders.push(order);
    localStorage.setItem('flowerOrders', JSON.stringify(existingOrders));

    // Clear cart and navigate to order details
    clearCart();
    
    toast({
      title: "Order Placed Successfully!",
      description: `Order #${orderId} has been created`,
    });

    navigate(`/order/${orderId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex gap-8">
          {/* Form */}
          <div className="w-80">
            <Card className="border">
              <CardContent className="p-6 space-y-4">
                <div>
                  <Label className="text-sm">Name:</Label>
                  <Input
                    value={customerInfo.name}
                    onChange={handleInputChange('name')}
                    placeholder="Input"
                    className="mt-1 text-xs h-8"
                  />
                </div>
                
                <div>
                  <Label className="text-sm">Email:</Label>
                  <Input
                    type="email"
                    value={customerInfo.email}
                    onChange={handleInputChange('email')}
                    placeholder="Input"
                    className="mt-1 text-xs h-8"
                  />
                </div>
                
                <div>
                  <Label className="text-sm">Phone:</Label>
                  <Input
                    value={customerInfo.phone}
                    onChange={handleInputChange('phone')}
                    placeholder="Input"
                    className="mt-1 text-xs h-8"
                  />
                </div>
                
                <div>
                  <Label className="text-sm">Address:</Label>
                  <Input
                    value={customerInfo.address}
                    onChange={handleInputChange('address')}
                    placeholder="Input"
                    className="mt-1 text-xs h-8"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cart Items */}
          <div className="flex-1 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.flower.id} className="border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-12 bg-gray-100 border flex items-center justify-center">
                      <span className="text-xs text-gray-400">×</span>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{item.flower.name}</h3>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm w-8 text-center">{item.quantity}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="text-right">
              <p className="text-lg font-medium mb-4">
                Total price: {getCartTotal().toFixed(0)}
              </p>
              <Button 
                onClick={handleSubmitOrder}
                className="px-8"
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cart;