import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ProductPage from '@/components/component/product-page'; // Corrected import statement
import { useCart } from '@/app/backend/CartContext'; // Adjust path if needed

interface Product {
  id: string;
  name: string;
  price: number;
  imageURL: string;
  description: string;
  reviews: {
    id: string;
    name: string;
    date: string;
    rating: number;
    comment: string;
  }[];
}

const ProductDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (id) {
      // Fetch product data by id (replace with actual fetch logic)
      const fetchProductById = async (productId: string) => {
        // Example product data, replace with actual fetched data
        const productData: Product = {
          id: productId,
          name: 'Acme Prism T-Shirt',
          price: 49.99,
          imageURL: '/tshirt.png',
          description: 'A stylish and comfortable t-shirt.',
          reviews: [
            {
              id: '1',
              name: 'Sarah Johnson',
              date: '2 days ago',
              rating: 3,
              comment: 'I love this t-shirt! It fits well and looks great.',
            },
            {
              id: '2',
              name: 'Alex Smith',
              date: '3 weeks ago',
              rating: 4,
              comment: 'Great quality and design. Will buy again!',
            },
          ],
        };
        setProduct(productData);
      };

      fetchProductById(id as string);
    }
  }, [id]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return <ProductPage product={product} />;
};

export default ProductDetailPage;
