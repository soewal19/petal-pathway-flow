import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Header = () => {
  const location = useLocation();

  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4">
        <nav className="flex items-center space-x-8 py-2">
          <Button
            variant={location.pathname === '/shop' ? 'default' : 'ghost'}
            asChild
            className="text-sm px-4 py-2"
          >
            <Link to="/shop">Shop</Link>
          </Button>
          
          <Button
            variant={location.pathname === '/cart' ? 'default' : 'ghost'}
            asChild
            className="text-sm px-4 py-2"
          >
            <Link to="/cart">Shopping Cart</Link>
          </Button>

          <div className="ml-auto text-sm text-muted-foreground">
            Main page
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;