import { Link, useLocation } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Package, Heart, Receipt, Ticket } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const Header = () => {
  const location = useLocation();
  const { getCartItemsCount } = useCart();
  const cartItemsCount = getCartItemsCount();

  return (
    <>
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Package className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-800">ELIFTECH</span>
            </Link>
            <div className="text-right text-sm text-gray-600">
              <div>+1 302 543 20 12</div>
              <div>info@eliftech.com</div>
              <div className="text-blue-600">www.eliftech.com</div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex space-x-8">
            <Link 
              to="/shop"
              className={`py-3 px-4 hover:text-blue-600 border-b-2 transition-colors ${
                location.pathname === '/shop' 
                  ? 'text-blue-600 border-blue-600 font-medium'
                  : 'text-gray-600 border-transparent hover:border-blue-600'
              }`}
            >
              Shop
            </Link>
            <Link 
              to="/favorites"
              className={`py-3 px-4 hover:text-blue-600 border-b-2 transition-colors ${
                location.pathname === '/favorites' 
                  ? 'text-blue-600 border-blue-600 font-medium'
                  : 'text-gray-600 border-transparent hover:border-blue-600'
              }`}
            >
              <Heart className="w-4 h-4 inline mr-1" />
              Favorites
            </Link>
            <Link 
              to="/history"
              className={`py-3 px-4 hover:text-blue-600 border-b-2 transition-colors ${
                location.pathname === '/history' 
                  ? 'text-blue-600 border-blue-600 font-medium'
                  : 'text-gray-600 border-transparent hover:border-blue-600'
              }`}
            >
              <Receipt className="w-4 h-4 inline mr-1" />
              History
            </Link>
            <Link 
              to="/coupons"
              className={`py-3 px-4 hover:text-blue-600 border-b-2 transition-colors ${
                location.pathname === '/coupons' 
                  ? 'text-blue-600 border-blue-600 font-medium'
                  : 'text-gray-600 border-transparent hover:border-blue-600'
              }`}
            >
              <Ticket className="w-4 h-4 inline mr-1" />
              Coupons
            </Link>
            <Link 
              to="/cart"
              className={`py-3 px-4 hover:text-blue-600 border-b-2 transition-colors relative ${
                location.pathname === '/cart' 
                  ? 'text-blue-600 border-blue-600 font-medium'
                  : 'text-gray-600 border-transparent hover:border-blue-600'
              }`}
            >
              Shopping Cart
              {cartItemsCount > 0 && (
                <Badge variant="secondary" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-blue-600 text-white animate-scale-in">
                  {cartItemsCount}
                </Badge>
              )}
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;