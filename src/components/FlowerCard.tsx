import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
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

  const handleAddToCart = () => {
    addToCart(flower, 1);
    toast({
      title: "Item added",
      description: "The item should added in the Shopping Cart",
    });
  };

  return (
    <Card className="border border-border">
      <CardContent className="p-4">
        <div className="relative mb-3">
          <div className="w-full h-32 bg-gray-100 border flex items-center justify-center mb-2">
            <Heart className="h-8 w-8 text-gray-300" />
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-1 right-1 h-6 w-6 p-0"
            onClick={() => onToggleFavorite?.(flower.id)}
          >
            <Heart 
              className={`h-4 w-4 ${flower.isFavorite ? 'fill-current' : ''}`} 
            />
          </Button>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-medium text-sm">{flower.name}</h3>
          <Button 
            onClick={handleAddToCart}
            className="w-full text-xs py-1 h-7"
            size="sm"
          >
            add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FlowerCard;