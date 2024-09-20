'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { GemIcon, ClubIcon, ApertureIcon } from "../icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSmoking, faBreadSlice, faCookieBite } from "@fortawesome/free-solid-svg-icons";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/firebase";
import FeaturedProducts from "../component/FeaturedProducts";
import { useCart } from "@/app/backend/CartContext";
import { Product } from "@/app/types/product"; // Import the shared Product type

export default function Categories() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [animatingId, setAnimatingId] = useState<string | null>(null);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const productsCollection = collection(db, "products");
      const snapshot = await getDocs(productsCollection);
      const productsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
      setProducts(productsList);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    addToCart({ ...product, quantity: 1 });
    setAnimatingId(product.id);
    setTimeout(() => setAnimatingId(null), 500);
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-primary text-primary-foreground py-2 px-4 flex items-center h-14">
        <Link href="#" className="flex items-center gap-2" prefetch={false}>
          <span className="text-lg font-bold">Categories</span>
        </Link>
      </header>
      <main className="flex-1 overflow-auto">
        <section className="bg-muted py-4 px-4">
          <h2 className="text-lg font-bold mb-2">Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link
              href="/cigarettes"
              className="flex flex-col items-center gap-1 bg-background rounded-md p-4 hover:bg-accent hover:text-accent-foreground transition-colors"
              prefetch={false}
            >
              <FontAwesomeIcon icon={faSmoking} className="w-8 h-8" />
              <span className="text-sm font-medium">Cigarettes</span>
            </Link>
            <Link
              href="/bakery"
              className="flex flex-col items-center gap-1 bg-background rounded-md p-4 hover:bg-accent hover:text-accent-foreground transition-colors"
              prefetch={false}
            >
              <FontAwesomeIcon icon={faBreadSlice} className="w-8 h-8" />
              <span className="text-sm font-medium">Bakery</span>
            </Link>
            <Link
              href="/snacks"
              className="flex flex-col items-center gap-1 bg-background rounded-md p-4 hover:bg-accent hover:text-accent-foreground transition-colors"
              prefetch={false}
            >
              <FontAwesomeIcon icon={faCookieBite} className="w-8 h-8" />
              <span className="text-sm font-medium">Snacks</span>
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
}
