import React, { useState } from 'react';
import { Button } from "@nextui-org/react";
import { useCart } from '@/app/backend/CartContext';
import { Product } from '@/app/types/product';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

interface ProductPageProps {
  product: Product;
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
                <label htmlFor="quantity" className="text-base">Quantity</label>
                <select
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="border rounded-lg"
                >
                  {[1, 2, 3, 4, 5].map(val => (
                    <option key={val} value={val}>{val}</option>
                  ))}
                </select>
              </div>
            </div>
            <Button 
              size="lg" 
              onClick={handleAddToCart} 
              isLoading={loading}
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add to Cart'}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductPage;
