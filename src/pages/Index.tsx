import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flower2, ShoppingBag, Heart, Star, ArrowRight } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-soft">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Flower2 className="h-8 w-8 text-floral-pink" />
            <span className="text-2xl font-bold bg-gradient-floral bg-clip-text text-transparent">
              FlowerHub
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link to="/shop">Browse Flowers</Link>
            </Button>
            <Button asChild>
              <Link to="/cart">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Cart
              </Link>
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <Badge className="mb-6 bg-floral-pink-light text-floral-pink border-floral-pink/20">
          <Heart className="h-3 w-3 mr-1" />
          Fresh & Beautiful Flowers
        </Badge>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-floral bg-clip-text text-transparent">
          Beautiful Flowers
          <br />
          Delivered Fresh
        </h1>
        
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Choose from our curated selection of premium flowers from the best local shops. 
          Perfect for any occasion, delivered with love to your doorstep.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild className="shadow-floral">
            <Link to="/shop">
              Shop Now
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </Button>
          <Button variant="outline" size="lg">
            Learn More
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose FlowerHub?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We partner with the finest flower shops to bring you the freshest, most beautiful blooms.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center shadow-card hover:shadow-floral transition-shadow">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-floral-pink-light rounded-full flex items-center justify-center mx-auto mb-4">
                <Flower2 className="h-6 w-6 text-floral-pink" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fresh Quality</h3>
              <p className="text-muted-foreground">
                Hand-picked flowers from trusted local growers, ensuring maximum freshness and beauty.
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center shadow-card hover:shadow-floral transition-shadow">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-floral-green-light rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="h-6 w-6 text-floral-green" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Ordering</h3>
              <p className="text-muted-foreground">
                Simple and intuitive ordering process with secure checkout and multiple payment options.
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center shadow-card hover:shadow-floral transition-shadow">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-floral-pink-light rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-6 w-6 text-floral-pink" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Service</h3>
              <p className="text-muted-foreground">
                Fast, reliable delivery with careful handling to ensure your flowers arrive in perfect condition.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="text-center bg-gradient-floral text-white shadow-floral">
          <CardContent className="p-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Brighten Someone's Day?</h2>
            <p className="text-white/90 mb-8 text-lg">
              Browse our collection of beautiful flowers and create memorable moments.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/shop">
                Start Shopping
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/50">
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Flower2 className="h-6 w-6 text-floral-pink" />
            <span className="text-xl font-bold bg-gradient-floral bg-clip-text text-transparent">
              FlowerHub
            </span>
          </div>
          <p className="text-muted-foreground">
            Bringing beauty and joy through fresh, premium flowers.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
