'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, doc, setDoc, deleteDoc, onSnapshot, getDocs, writeBatch } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageURL: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  setCart: (items: CartItem[]) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [userUID, setUserUID] = useState<string | null>(null);

  // Handle Firebase Auth state change to get the current user's UID
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserUID(user.uid);
      } else {
        setUserUID(null);
        setCart([]); // Clear cart on sign out
      }
    });
    return () => unsubscribe();
  }, []);

  // Listen to Firestore cart updates for the logged-in user
  useEffect(() => {
    if (userUID) {
      const cartRef = collection(db, 'users', userUID, 'cart');

      const unsubscribe = onSnapshot(
        cartRef,
        (snapshot) => {
          const cartItems = snapshot.docs.map((doc) => doc.data() as CartItem);
          setCart(cartItems);
        },
        (error) => {
          console.error('Error fetching cart items:', error);
        }
      );

      return () => unsubscribe();
    }
  }, [userUID]);

  const addToCart = async (item: CartItem) => {
    if (userUID) {
      try {
        const itemRef = doc(db, 'users', userUID, 'cart', item.id);
        await setDoc(itemRef, item, { merge: true });
      } catch (error) {
        console.error('Error adding item to cart:', error);
      }
    } else {
      console.error('User ID is not set.');
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (userUID) {
      try {
        const itemRef = doc(db, 'users', userUID, 'cart', id);
        await setDoc(itemRef, { quantity }, { merge: true });
      } catch (error) {
        console.error('Error updating item quantity:', error);
      }
    }
  };

  const removeFromCart = async (id: string) => {
    if (userUID) {
      try {
        const itemRef = doc(db, 'users', userUID, 'cart', id);
        await deleteDoc(itemRef);
      } catch (error) {
        console.error('Error removing item from cart:', error);
      }
    }
  };

  const clearCart = async () => {
    if (userUID) {
      try {
        const cartRef = collection(db, 'users', userUID, 'cart');
        const snapshot = await getDocs(cartRef);
        const batch = writeBatch(db);

        snapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });

        await batch.commit();
        setCart([]);
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart, setCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    console.error('CartProvider is missing in the component tree');
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
