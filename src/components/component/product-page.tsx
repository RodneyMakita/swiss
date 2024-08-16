'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { Button } from "@nextui-org/react";
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/app/backend/CartContext';
import { Product } from '@/app/types/product';
import '@/app/globals.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

interface ProductPageProps {
  product: {
    id: string;
    name: string;
    price: number;
    imageURL: string;
    description: string;
    reviews: {
      id: string;
      name: string;
      date: string;
      rating: number;
      comment: string;
    }[];
  };
}

const ProductPage: React.FC<ProductPageProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      await addToCart({ ...product, quantity });
      console.log('Item added to cart');
    } catch (error) {
      console.error('Failed to add item to cart:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <header className="bg-primary text-primary-foreground py-2 px-4 flex items-center h-14">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
          <span className="text-lg font-bold ml-2">{product.name}</span>
        </Link>
      </header>
      
      {/* Main Content */}
      <section className="grid md:grid-cols-2 gap-6 lg:gap-12 items-start max-w-6xl px-4 mx-auto py-12 md:py-16 lg:py-24">
        <div className="grid gap-4">
          <img
            src={product.imageURL}
            alt={product.name}
            width={600}
            height={600}
            className="aspect-square object-cover border w-full rounded-lg overflow-hidden"
          />
        </div>
        <div className="grid gap-6 md:gap-10">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">{product.name}</h1>
            <p className="text-muted-foreground text-lg md:text-xl">{product.description}</p>
          </div>
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <span className="text-4xl font-bold">R{product.price}</span>
              <div className="flex items-center gap-2">
                <Label htmlFor="quantity" className="text-base">Quantity</Label>
                <div className="w-24"> {/* Container for styling */}
                  <Select
                    value={quantity.toString()}
                    onValueChange={(value) => setQuantity(parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map(val => (
                        <SelectItem key={val} value={val.toString()}>{val}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <Button 
              size="lg" 
              onClick={handleAddToCart} 
              isLoading={loading}
              disabled={loading} // Disable the button while loading
            >
              {loading ? 'Adding...' : 'Add to Cart'}
            </Button>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-16 lg:py-24 bg-muted">
        <div className="max-w-6xl px-4 mx-auto grid gap-12">
          <div className="grid gap-4">
            <h2 className="text-3xl sm:text-4xl font-bold">Product Details</h2>
            <div className="text-muted-foreground text-lg md:text-xl leading-loose">
              <p>{product.description}</p>
            </div>
          </div>
          <div className="grid gap-4">
            <h2 className="text-3xl sm:text-4xl font-bold">Customer Reviews</h2>
            <div className="mx-auto px-4 md:px-6 max-w-2xl grid gap-12">
              {(Array.isArray(product.reviews) ? product.reviews : []).map((review) => (
                <div key={review.id} className="flex gap-4">
                  <Avatar className="w-10 h-10 border">
                    <AvatarImage src="/placeholder-user.jpg" alt={review.name} />
                    <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="grid gap-4">
                    <div className="flex gap-4 items-start">
                      <div className="grid gap-0.5 text-sm">
                        <h3 className="font-semibold">{review.name}</h3>
                        <time className="text-sm text-muted-foreground">{review.date}</time>
                      </div>
                      <div className="flex items-center gap-0.5 ml-auto">
                        {[...Array(5)].map((_, index) => (
                          <StarIcon
                            key={index}
                            className={`w-5 h-5 ${index < review.rating ? 'fill-primary' : 'fill-muted stroke-muted-foreground'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="text-sm leading-loose text-muted-foreground">
                      <p>{review.comment}</p>
                    </div>
                  </div>
                </div>
              ))}
              <Separator />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const StarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export default ProductPage;
