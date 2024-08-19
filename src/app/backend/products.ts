import { db } from '@/lib/firebase'; // Adjust the import based on your setup
import { doc, getDoc } from 'firebase/firestore';

export const fetchProductById = async (id: string) => {
  try {
    const docRef = doc(db, 'products', id); // Access the 'products' collection
    const docSnap = await getDoc(docRef); // Fetch the document

    if (docSnap.exists()) {
      const productData = docSnap.data();
      return {
        id: docSnap.id,
        name: productData.name,
        price: productData.price,
        imageURL: productData.imageURL,
        description: productData.description,
        reviews: productData.reviews || [], // Default to an empty array if reviews don't exist
      };
    } else {
      return null; // Handle case where product does not exist
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};
