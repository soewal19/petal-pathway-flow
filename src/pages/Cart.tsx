import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash2, Plus, Minus, ShoppingBag, Package, X, ShoppingCart, MapPin, Ticket, Tag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { shops } from '@/data/flowers';
import { coupons } from '@/data/coupons';
import { Coupon, AppliedCoupon } from '@/types/coupon';
import MapboxMap from '@/components/MapboxMap';

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  coordinates?: [number, number];
}

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const { toast } = useToast();
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
    address: '',
    coordinates: undefined
  });
  const [errors, setErrors] = useState<Partial<CustomerInfo>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [useMapAddress, setUseMapAddress] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [couponError, setCouponError] = useState('');

  const validateForm = () => {
    const newErrors: Partial<CustomerInfo> = {};
    
    if (!customerInfo.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!customerInfo.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!customerInfo.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }
    
    if (!customerInfo.address.trim()) {
      newErrors.address = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof CustomerInfo) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const applyCoupon = () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    const coupon = coupons.find(c => 
      c.code.toLowerCase() === couponCode.toLowerCase() && 
      c.isActive && 
      c.expiryDate > new Date()
    );

    if (!coupon) {
      setCouponError('Invalid or expired coupon code');
      return;
    }

    const cartTotal = getCartTotal();
    if (coupon.minOrderAmount && cartTotal < coupon.minOrderAmount) {
      setCouponError(`Minimum order amount is $${coupon.minOrderAmount} for this coupon`);
      return;
    }

    const discountAmount = (cartTotal * coupon.discount) / 100;
    setAppliedCoupon({ coupon, discountAmount });
    setCouponError('');
    
    toast({
      title: "Coupon Applied!",
      description: `You saved $${discountAmount.toFixed(2)} with code "${coupon.code}"`,
    });
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  const getFinalTotal = () => {
    const cartTotal = getCartTotal();
    return appliedCoupon ? cartTotal - appliedCoupon.discountAmount : cartTotal;
  };

  const handleAddressSelect = (address: string, coordinates: [number, number]) => {
    setCustomerInfo(prev => ({
      ...prev,
      address,
      coordinates
    }));
    if (errors.address) {
      setErrors(prev => ({ ...prev, address: '' }));
    }
  };

  const handleSubmitOrder = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!validateForm()) return;
    
    if (cartItems.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to your cart before placing an order",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Generate order ID and create order
      const orderId = Date.now().toString();
      const order = {
        id: orderId,
        items: cartItems,
        total: getFinalTotal(),
        customerInfo,
        orderDate: new Date(),
        shop: shops[0], // For now, use first shop
        appliedCoupon: appliedCoupon?.coupon || null,
        originalTotal: getCartTotal(),
        discountAmount: appliedCoupon?.discountAmount || 0
      };

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));

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
      
    } catch (error) {
      console.error('Error submitting order:', error);
      toast({
        title: "Error",
        description: "Error submitting order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center py-16">
          <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl text-gray-500">Your cart is empty</h2>
          <p className="text-gray-400">Add some products to get started</p>
          <Button onClick={() => navigate('/shop')} className="mt-4">
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
          <ShoppingCart className="w-6 h-6 mr-2" />
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Customer Information Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Customer Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name:
                </label>
                <Input
                  type="text"
                  value={customerInfo.name}
                  onChange={handleInputChange('name')}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your name"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email:
                </label>
                <Input
                  type="email"
                  value={customerInfo.email}
                  onChange={handleInputChange('email')}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone:
                </label>
                <Input
                  type="tel"
                  value={customerInfo.phone}
                  onChange={handleInputChange('phone')}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your phone number"
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Address:
                </label>
                <Tabs value={useMapAddress ? "map" : "text"} onValueChange={(value) => setUseMapAddress(value === "map")}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="text">Type Address</TabsTrigger>
                    <TabsTrigger value="map">
                      <MapPin className="w-4 h-4 mr-1" />
                      Use Map
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="text" className="mt-3">
                    <Textarea
                      value={customerInfo.address}
                      onChange={handleInputChange('address')}
                      rows={3}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                        errors.address ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your delivery address"
                    />
                  </TabsContent>
                  <TabsContent value="map" className="mt-3">
                    <MapboxMap 
                      onAddressSelect={handleAddressSelect}
                      initialAddress={customerInfo.address}
                    />
                  </TabsContent>
                </Tabs>
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                )}
              </div>
            </div>
          </div>

          {/* Cart Items */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Order Items</h2>
            
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.flower.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center border-2 border-dashed border-gray-300">
                      <Package className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{item.flower.name}</h3>
                      <p className="text-gray-600">${item.flower.price}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.flower.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    
                    <button
                      onClick={() => updateQuantity(item.flower.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => removeFromCart(item.flower.id)}
                      className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center transition-colors ml-2"
                    >
                      <X className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              {/* Coupon Section */}
              <div className="mb-4">
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Have a coupon code?
                </Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value);
                      setCouponError('');
                    }}
                    className={`flex-1 ${couponError ? 'border-red-500' : ''}`}
                  />
                  <Button 
                    onClick={applyCoupon}
                    variant="outline"
                    disabled={!couponCode.trim()}
                  >
                    <Tag className="w-4 h-4 mr-1" />
                    Apply
                  </Button>
                </div>
                {couponError && (
                  <p className="text-red-500 text-xs mt-1">{couponError}</p>
                )}
                {appliedCoupon && (
                  <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-800">
                          <Ticket className="w-4 h-4 inline mr-1" />
                          {appliedCoupon.coupon.name} Applied
                        </p>
                        <p className="text-xs text-green-600">
                          You saved ${appliedCoupon.discountAmount.toFixed(2)}
                        </p>
                      </div>
                      <Button
                        onClick={removeCoupon}
                        size="sm"
                        variant="ghost"
                        className="text-green-700 hover:text-green-900"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal:</span>
                  <span>${getCartTotal().toFixed(2)}</span>
                </div>
                
                {appliedCoupon && (
                  <div className="flex justify-between items-center text-green-600">
                    <span>Discount ({appliedCoupon.coupon.code}):</span>
                    <span>-${appliedCoupon.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                
                <Separator />
                
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-800">Total:</span>
                  <span className="text-2xl font-bold text-blue-600">${getFinalTotal().toFixed(2)}</span>
                </div>
              </div>
              <Button
                onClick={handleSubmitOrder}
                disabled={isSubmitting || cartItems.length === 0}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-md transition-colors flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Processing...
                  </>
                ) : (
                  'Submit Order'
                )}
              </Button>
            </div>
          </div>
        </div>
    </div>
  );
};

export default Cart;