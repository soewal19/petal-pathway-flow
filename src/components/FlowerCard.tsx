import { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, Plus, Minus } from 'lucide-react';
import { Flower } from '@/types/flower';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useToast } from '@/hooks/use-toast';

interface FlowerCardProps {
  flower: Flower;
}

const FlowerCard = ({ flower }: FlowerCardProps) => {
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleAddToCart = () => {
    setIsAnimating(true);
    addToCart(flower, quantity);
    toast({
      title: "Added to cart",
      description: `${quantity}x ${flower.name} added to your cart`,
    });
    setQuantity(1);
    
    // Reset animation after a short delay
    setTimeout(() => setIsAnimating(false), 600);
  };

  const handleToggleFavorite = () => {
    toggleFavorite(flower.id);
    toast({
      title: isFavorite(flower.id) ? "Removed from favorites" : "Added to favorites",
      description: `${flower.name} ${isFavorite(flower.id) ? 'removed from' : 'added to'} your favorites`,
    });
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border border-gray-200 h-full flex flex-col">
      <CardContent className="p-0 flex-1 flex flex-col">
        <div className="relative overflow-hidden">
          <img 
            src={flower.image} 
            alt={flower.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {isFavorite(flower.id) && (
            <Badge variant="secondary" className="absolute top-2 left-2 bg-red-100 text-red-600">
              <Heart className="h-3 w-3 mr-1 fill-red-500" />
              Favorite
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/80 hover:bg-white/90 transition-colors"
            onClick={handleToggleFavorite}
          >
            <Heart 
              className={`h-4 w-4 transition-colors ${isFavorite(flower.id) ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'}`} 
            />
          </Button>
        </div>
        
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg text-gray-800">{flower.name}</h3>
              <span className="text-lg font-bold text-blue-600">
                ${flower.price}
              </span>
            </div>
            
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {flower.description}
            </p>
          </div>
          
          <div className="text-xs text-gray-500">
            Shop: {flower.shop}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex items-center gap-2 mt-auto">
        <div className="flex items-center border rounded-md">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="px-3 py-1 text-sm font-medium">{quantity}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setQuantity(quantity + 1)}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        
        <Button 
          onClick={handleAddToCart}
          className={`flex-1 transition-all duration-300 ${isAnimating ? 'animate-pulse bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
          size="sm"
          disabled={isAnimating}
        >
          <ShoppingCart className={`h-4 w-4 mr-2 ${isAnimating ? 'animate-pulse' : ''}`} />
          {isAnimating ? 'Added!' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FlowerCard;