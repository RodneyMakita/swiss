// lib/cartService.ts
import { db } from '@/lib/firebase'; // Firestore setup
import { doc, setDoc, getDoc } from 'firebase/firestore';

// Save cart items to Firestore under the user's UID
export const saveCartItems = async (userId: string, cartItems: any[]) => {
  const cartRef = doc(db, 'carts', userId); // 'carts' collection, userId as the document ID
  await setDoc(cartRef, { items: cartItems });
};

// Load cart items from Firestore based on the user's UID
export const loadCartItems = async (userId: string) => {
  const cartRef = doc(db, 'carts', userId);
  const cartDoc = await getDoc(cartRef);

  if (cartDoc.exists()) {
    return cartDoc.data().items;
  } else {
    return []; // Return empty cart if no cart data exists for this user
  }
};
