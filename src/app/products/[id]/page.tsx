'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; 
import { getDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ProductPage from '@/components/component/product-page';
import type { Product } from '@/app/types/product';
import Loader from '@/components/component/Loader';

const ProductPageById = () => {
  const { id } = useParams();  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const productId = Array.isArray(id) ? id[0] : id; // Ensure id is a string

    if (productId) {
      const fetchProduct = async () => {
        try {
          const docRef = doc(db, 'products', productId as string);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const productData = docSnap.data() as Omit<Product, 'id'>;
            setProduct({ id: productId, ...productData }); // Use productId here
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
    } else {
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return <Loader />;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return <ProductPage product={product} />;
};

export default ProductPageById;
