'use client'; 

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  faMagnifyingGlass,
  faSmoking,
  faBreadSlice,
  faCookieBite,
} from "@fortawesome/free-solid-svg-icons";
import { collection, getDocs } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { db } from "@/lib/firebase";
import { useCart } from "@/app/backend/CartContext";
import StoreIcon from "@/components/icons/StoreIcon";
import FeaturedProducts from "@/components/component/FeaturedProducts";
import GemIcon from "@/components/icons/GemIcon";
import { Skeleton } from "@nextui-org/react";
import Link from "next/link";
import "@/app/globals.css";
import { Product } from "@/app/types/product"; // Make sure this import is correct

const Home: React.FC = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [animatingId, setAnimatingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(db, "products");
        const snapshot = await getDocs(productsCollection);
        const productsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Product, 'id'>), // Ensure all required fields are present
        })) as Product[];
        setProducts(productsList);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    addToCart({ ...product, quantity: 1 });
    setAnimatingId(product.id); // Trigger animation
    setTimeout(() => setAnimatingId(null), 500); // Remove animation class after animation ends
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-primary text-primary-foreground py-2 px-4 flex items-center">
        <StoreIcon className="w-8 h-8" />
        <span className="text-lg font-bold">swiisspants</span>
        <div className="relative flex-1 ml-4">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="search"
            placeholder="Search for products..."
            className="bg-primary-foreground/10 rounded-md pl-8 pr-4 py-2 text-sm w-full"
          />
        </div>
      </header>
      <main className="flex-1 overflow-auto">
        <section className="bg-muted py-4 px-4">
          <h2 className="text-lg font-bold mb-2">Categories</h2>
          <div className="grid grid-cols-4 gap-4">
            <Link
              href="/cigarettes"
              className="flex flex-col items-center gap-1"
              prefetch={false}
            >
              <FontAwesomeIcon icon={faSmoking} className="w-8 h-8" />
              <span className="text-sm">Cigarettes</span>
            </Link>
            <Link
              href="/bakery"
              className="flex flex-col items-center gap-1"
              prefetch={false}
            >
              <FontAwesomeIcon icon={faBreadSlice} className="w-8 h-8" />
              <span className="text-sm">Bakery</span>
            </Link>
            <Link
              href="/snacks"
              className="flex flex-col items-center gap-1"
              prefetch={false}
            >
              <FontAwesomeIcon icon={faCookieBite} className="w-8 h-8" />
              <span className="text-sm">Snacks</span>
            </Link>
   
          </div>
        </section>
        <FeaturedProducts
          products={products}
          loading={loading}
          handleAddToCart={handleAddToCart}
          animatingId={animatingId}
        />
      </main>
    </div>
  );
};

export default Home;
