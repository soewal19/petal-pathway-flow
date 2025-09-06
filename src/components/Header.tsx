import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Heart, Flower2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

const Header = () => {
  const location = useLocation();
  const { getCartItemsCount } = useCart();
  const cartItemsCount = getCartItemsCount();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Flower2 className="h-6 w-6 text-floral-pink" />
          <span className="text-xl font-bold bg-gradient-floral bg-clip-text text-transparent">
            FlowerHub
          </span>
        </Link>

        <nav className="flex items-center space-x-1">
          <Button
            variant={location.pathname === '/shop' ? 'default' : 'ghost'}
            asChild
            className="text-sm"
          >
            <Link to="/shop">Shop</Link>
          </Button>
          
          <Button
            variant={location.pathname === '/cart' ? 'default' : 'ghost'}
            asChild
            className="text-sm relative"
          >
            <Link to="/cart" className="flex items-center space-x-2">
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Cart</span>
              {cartItemsCount > 0 && (
                <Badge variant="secondary" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {cartItemsCount}
                </Badge>
              )}
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;