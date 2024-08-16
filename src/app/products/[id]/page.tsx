'use client';


import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // Ensure this import is correct
import { getDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // Adjust path to your Firebase setup
import ProductPage from '@/components/component/product-page'; // Ensure this path is correct
import type { Product } from '@/app/types/product';
import Loader from '@/components/component/Loader';


const ProductPageById = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const docRef = doc(db, 'products', id as string);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setProduct(docSnap.data() as Product);
          } else {
            console.log("No such product!");
          }
        } catch (error) {
          console.error("Error fetching product:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return <Loader />; // Use the Loader component here
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return <ProductPage product={product} />;
};

export default ProductPageById;
