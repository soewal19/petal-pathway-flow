import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, Ticket, Calendar, DollarSign, Percent } from 'lucide-react';
import { coupons } from '@/data/coupons';
import { useToast } from '@/hooks/use-toast';

const Coupons = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { toast } = useToast();

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(code);
      toast({
        title: "Coupon Copied!",
        description: `Code "${code}" has been copied to clipboard`,
      });
      
      setTimeout(() => setCopiedCode(null), 2000);
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short', 
      day: 'numeric'
    });
  };

  const activeCoupons = coupons.filter(coupon => coupon.isActive && coupon.expiryDate > new Date());

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center">
          <Ticket className="w-8 h-8 mr-3 text-primary" />
          Available Coupons
        </h1>
        <p className="text-muted-foreground">
          Save money on your flower purchases with these exclusive discount codes
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeCoupons.map((coupon) => (
          <Card key={coupon.id} className="relative overflow-hidden border-2 hover:shadow-lg transition-all duration-300">
            <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-bl-full flex items-start justify-end p-2">
              <Percent className="w-4 h-4 text-primary" />
            </div>
            
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-lg">
                <span>{coupon.name}</span>
                <Badge variant="secondary" className="ml-2">
                  {coupon.discount}% OFF
                </Badge>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {coupon.description}
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <DollarSign className="w-4 h-4 mr-2" />
                  <span>Min. order: ${coupon.minOrderAmount}</span>
                </div>
                
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Valid until: {formatDate(coupon.expiryDate)}</span>
                </div>
              </div>
              
              <div className="pt-3 border-t">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-mono bg-muted px-3 py-2 rounded border-2 border-dashed border-muted-foreground/30">
                    {coupon.code}
                  </div>
                  
                  <Button
                    onClick={() => copyToClipboard(coupon.code)}
                    size="sm"
                    variant={copiedCode === coupon.code ? "default" : "outline"}
                    className="ml-3"
                  >
                    {copiedCode === coupon.code ? (
                      <>
                        <Check className="w-4 h-4 mr-1" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Click to copy code to clipboard
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {activeCoupons.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Ticket className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Active Coupons</h3>
            <p className="text-muted-foreground">
              Check back later for new discount offers!
            </p>
          </CardContent>
        </Card>
      )}
      
      <div className="mt-12 text-center">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="py-6">
            <h3 className="text-lg font-semibold mb-2">How to use coupons</h3>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              1. Copy the coupon code by clicking the "Copy" button above<br />
              2. Add items to your cart and proceed to checkout<br />
              3. Enter the coupon code in the "Coupon Code" field<br />
              4. Click "Apply" to see your discount applied to the total
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Coupons;