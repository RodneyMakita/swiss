'use client';

import React, { useState, useEffect } from 'react';
import { Skeleton } from '@nextui-org/react';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import Link from 'next/link';
import { Product } from "@/app/types/product";
import Image from 'next/image';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from "@/app/firebase";
import { ArrowLeft } from 'lucide-react';

interface BakeryProps {
  handleAddToCart: (product: Product) => void;
  animatingId: string | null;
}

const Bakery: React.FC<BakeryProps> = ({ handleAddToCart, animatingId }) => {
  const [BakeryProducts, setBakeryProducts] = useState<Product[]>([]);
  const [loadingBakery, setLoadingBakery] = useState(true);

  useEffect(() => {
    const fetchBakeryProducts = async () => {
      setLoadingBakery(true);
      const BakeryQuery = query(
        collection(db, "products"),
        where("category", "==", "bakery")
      );
      const snapshot = await getDocs(BakeryQuery);
      const BakeryList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
      setBakeryProducts(BakeryList);
      setLoadingBakery(false);
    };

    fetchBakeryProducts();
  }, []);

  return (
    <>
      <header className="bg-primary text-primary-foreground py-2 px-4 flex items-center h-14">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <ArrowLeft className="h-5 w-5" />
          <span className="text-lg font-bold ml-2">Back to Products</span>
        </Link>
      </header>

      <section className="py-4 px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {loadingBakery ? (
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
            BakeryProducts.map((product) => (
              <div
                key={product.id}
                className="bg-background rounded-md overflow-hidden shadow-md flex flex-col"
              >
                <Link href={`/products/${product.id}`} legacyBehavior>
                  <a>
                    <Image
                      src={product.imageURL}
                      alt={product.name}
                      width={200}
                      height={200}
                      className="w-full h-40 object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="p-2 flex-1 flex flex-col justify-between">
                      <h3 className="text-sm font-medium truncate">{product.name}</h3>
                      <span className="text-sm text-muted-foreground truncate">
                        {product.description}
                      </span>
                    </div>
                  </a>
                </Link>
                <div className="p-2 flex items-center justify-between mt-2">
                  <span className="text-sm font-bold">
                    {typeof product.price === 'number'
                      ? `R${product.price.toFixed(2)}`
                      : 'Price not available'}
                  </span>
                  <AddShoppingCartIcon
                    className={`w-5 h-5 text-muted-foreground cursor-pointer ${
                      animatingId === product.id ? 'bounce-animation' : ''
                    }`}
                    onClick={() => handleAddToCart(product)}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
};

export default Bakery;
