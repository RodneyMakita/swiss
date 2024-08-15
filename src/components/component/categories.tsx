import React, { useState, useEffect } from "react";
import Link from "next/link";
import { GemIcon, ClubIcon, ApertureIcon } from "../icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSmoking, faBreadSlice, faCookieBite } from "@fortawesome/free-solid-svg-icons";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/firebase";
import FeaturedProducts from "../component/FeaturedProducts"; // Import the FeaturedProducts component
import { useCart } from "@/app/backend/CartContext"; // Import useCart hook

interface Product {
  id: string;
  name: string;
  price: number;
  imageURL: string;
}

export default function Categories() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [animatingId, setAnimatingId] = useState<string | null>(null);

  // Get cart context
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
    setAnimatingId(product.id); // Trigger animation
    setTimeout(() => setAnimatingId(null), 500); // Remove animation class after animation ends
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
              href="#"
              className="flex flex-col items-center gap-1 bg-background rounded-md p-4 hover:bg-accent hover:text-accent-foreground transition-colors"
              prefetch={false}
            >
              <FontAwesomeIcon icon={faSmoking} className="w-8 h-8" />
              <span className="text-sm font-medium">Cigarettes</span>
            </Link>
            <Link
              href="#"
              className="flex flex-col items-center gap-1 bg-background rounded-md p-4 hover:bg-accent hover:text-accent-foreground transition-colors"
              prefetch={false}
            >
              <FontAwesomeIcon icon={faBreadSlice} className="w-8 h-8" />
              <span className="text-sm font-medium">Bakery</span>
            </Link>
            <Link
              href="#"
              className="flex flex-col items-center gap-1 bg-background rounded-md p-4 hover:bg-accent hover:text-accent-foreground transition-colors"
              prefetch={false}
            >
              <FontAwesomeIcon icon={faCookieBite} className="w-8 h-8" />
              <span className="text-sm font-medium">Snacks</span>
            </Link>
            <Link
              href="#"
              className="flex flex-col items-center gap-1 bg-background rounded-md p-4 hover:bg-accent hover:text-accent-foreground transition-colors"
              prefetch={false}
            >
              <GemIcon className="w-8 h-8" />
              <span className="text-sm font-medium">Beauty</span>
            </Link>
            <Link
              href="#"
              className="flex flex-col items-center gap-1 bg-background rounded-md p-4 hover:bg-accent hover:text-accent-foreground transition-colors"
              prefetch={false}
            >
              <ClubIcon className="w-8 h-8" />
              <span className="text-sm font-medium">Sports</span>
            </Link>
            <Link
              href="#"
              className="flex flex-col items-center gap-1 bg-background rounded-md p-4 hover:bg-accent hover:text-accent-foreground transition-colors"
              prefetch={false}
            >
              <ApertureIcon className="w-8 h-8" />
              <span className="text-sm font-medium">Appliances</span>
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
