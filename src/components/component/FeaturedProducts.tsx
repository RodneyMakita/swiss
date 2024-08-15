import React from 'react';
import { Skeleton } from '@nextui-org/react';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  price: string;
  imageURL: string;
}

interface FeaturedProductsProps {
  products: Product[];
  loading: boolean;
  handleAddToCart: (product: Product) => void;
  animatingId: string | null;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ products, loading, handleAddToCart, animatingId }) => {
  return (
    <section className="py-4 px-4">
      <h2 className="text-lg font-bold mb-4">Featured Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="bg-background rounded-md overflow-hidden shadow-md">
              <Skeleton className="w-full h-40" />
              <div className="p-2">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <div className="flex items-center justify-between mt-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-5 w-5" />
                </div>
              </div>
            </div>
          ))
        ) : (
          products.map((product) => (
            <div key={product.id} className="bg-background rounded-md overflow-hidden shadow-md flex flex-col">
              <Link href={`/product/${product.id}`} legacyBehavior>
                <a>
                  <img
                    src={product.imageURL}
                    alt={product.name}
                    width={200}
                    height={200}
                    className="w-full h-40 object-cover"
                    style={{ aspectRatio: '200/200', objectFit: 'cover' }}
                  />
                  <div className="p-2 flex-1 flex flex-col justify-between">
                    <h3 className="text-sm font-medium truncate">{product.name}</h3>
                  </div>
                </a>
              </Link>
              <div className="p-2 flex items-center justify-between mt-2">
                <span className="text-sm font-bold">R{product.price}</span>
                <AddShoppingCartIcon
                  className={`w-5 h-5 text-muted-foreground cursor-pointer ${animatingId === product.id ? 'bounce-animation' : ''}`}
                  onClick={() => handleAddToCart(product)}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
