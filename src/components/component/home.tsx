import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { faMagnifyingGlass, faSmoking, faBreadSlice, faCookieBite } from '@fortawesome/free-solid-svg-icons';
import { collection, getDocs } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { db } from '@/lib/firebase';
import { useCart } from '@/app/backend/CartContext';
import StoreIcon from '@/components/icons/StoreIcon';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import GemIcon from '@/components/icons/GemIcon';
import { Skeleton } from '@nextui-org/react';
import Link from 'next/link';
import '@/app/globals.css';

interface Product {
  id: string;
  name: string;
  price: number;
  imageURL: string;
}

const Home: React.FC = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [animatingId, setAnimatingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
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
          <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
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
            <Link href="/Categories" className="flex flex-col items-center gap-1" prefetch={false}>
              <FontAwesomeIcon icon={faSmoking} className="w-8 h-8" />
              <span className="text-sm">Cigarettes</span>
            </Link>
            <Link href="#" className="flex flex-col items-center gap-1" prefetch={false}>
              <FontAwesomeIcon icon={faBreadSlice} className="w-8 h-8" />
              <span className="text-sm">Bakery</span>
            </Link>
            <Link href="#" className="flex flex-col items-center gap-1" prefetch={false}>
              <FontAwesomeIcon icon={faCookieBite} className="w-8 h-8" />
              <span className="text-sm">Snacks</span>
            </Link>
            <Link href="#" className="flex flex-col items-center gap-1" prefetch={false}>
              <GemIcon className="w-8 h-8" />
              <span className="text-sm">Beauty</span>
            </Link>
          </div>
        </section>
        <section className="py-4 px-4">
          <h2 className="text-lg font-bold mb-2">Featured Products</h2>
          <div className="grid grid-cols-2 gap-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-background rounded-md overflow-hidden">
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
                <div key={product.id} className="bg-background rounded-md overflow-hidden">
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
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-bold">R{product.price}</span>
                      <AddShoppingCartIcon
                        className={`w-5 h-5 text-muted-foreground cursor-pointer ${animatingId === product.id ? 'bounce-animation' : ''}`}
                        onClick={() => handleAddToCart(product)}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
