import { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, Plus, Minus } from 'lucide-react';
import { Flower } from '@/types/flower';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';

interface FlowerCardProps {
  flower: Flower;
  onToggleFavorite?: (id: string) => void;
}

const FlowerCard = ({ flower, onToggleFavorite }: FlowerCardProps) => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addToCart(flower, quantity);
    toast({
      title: "Added to cart",
      description: `${quantity}x ${flower.name} added to your cart`,
    });
    setQuantity(1);
  };

  return (
    <Card className="group hover:shadow-floral transition-all duration-300 overflow-hidden">
      <CardContent className="p-0">
        <div className="relative overflow-hidden">
          <img 
            src={flower.image} 
            alt={flower.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {flower.isFavorite && (
            <Badge variant="secondary" className="absolute top-2 left-2">
              <Heart className="h-3 w-3 mr-1 fill-floral-pink text-floral-pink" />
              Favorite
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/80 hover:bg-white/90"
            onClick={() => onToggleFavorite?.(flower.id)}
          >
            <Heart 
              className={`h-4 w-4 ${flower.isFavorite ? 'fill-floral-pink text-floral-pink' : 'text-floral-sage'}`} 
            />
          </Button>
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg">{flower.name}</h3>
            <span className="text-lg font-bold text-floral-pink">
              ${flower.price}
            </span>
          </div>
          
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {flower.description}
          </p>
          
          <div className="text-xs text-floral-sage">
            Shop: {flower.shop}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="px-4 pb-4 pt-0 flex items-center gap-2">
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
          className="flex-1"
          size="sm"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FlowerCard;