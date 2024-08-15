import React, { useState, useEffect } from "react";
import { Card, Skeleton } from "@nextui-org/react";
import Link from "next/link";
import {
  GemIcon,
  ClubIcon,
  ApertureIcon,
} from '../icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSmoking, faBreadSlice, faCookieBite, faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/app/firebase';

interface Product {
  id: string;
  name: string;
  price: string;
  imageURL: string;
}

export default function Categories() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const productsCollection = collection(db, 'products');
      const snapshot = await getDocs(productsCollection);
      const productsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
      setProducts(productsList);
      setLoading(false);
    };

    fetchProducts();
  }, []);

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
        <section className="py-4 px-4">
          <h2 className="text-lg font-bold mb-2">Featured Products</h2>
          <div className="grid grid-cols-2 gap-4">
            {loading
              ? Array(6).fill(0).map((_, index) => (
                  <Card key={index} className="w-[200px] space-y-5 p-4" radius="lg">
                    <Skeleton className="rounded-lg">
                      <div className="h-24 rounded-lg bg-default-300"></div>
                    </Skeleton>
                    <div className="space-y-3">
                      <Skeleton className="w-3/5 rounded-lg">
                        <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
                      </Skeleton>
                      <Skeleton className="w-4/5 rounded-lg">
                        <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
                      </Skeleton>
                      <Skeleton className="w-2/5 rounded-lg">  
                        <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
                      </Skeleton>
                    </div>
                  </Card>
                ))
              : products.map((product) => (
                  <Link key={product.id} href="#" className="bg-background rounded-md overflow-hidden" prefetch={false}>
                    <img
                      src={product.imageURL}
                      alt={product.name}
                      width={200}
                      height={200}
                      className="w-full h-40 object-cover"
                      style={{ aspectRatio: "200/200", objectFit: "cover" }}
                    />
                    <div className="p-2">
                      <h3 className="text-sm font-medium">{product.name}</h3>
                      <p className="text-xs text-muted-foreground">Product Description</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-bold">R{product.price}</span>
                        <FontAwesomeIcon icon={faCartShopping} className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </div>
                  </Link>
                ))}
          </div>
        </section>
      </main>
    </div>
  );
}
