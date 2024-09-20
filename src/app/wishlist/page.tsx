'use client'


import '@/app/globals.css';
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { HeartIcon, ShoppingCartIcon, TrashIcon } from "lucide-react";
import Image from 'next/image';
import { db } from '@/lib/firebase'; // Adjust import if necessary
import { useAuth } from '@/app/auth/AuthContext'; // Adjust import if necessary
import { collection, doc, getDoc, query, where, getDocs, deleteDoc } from 'firebase/firestore';

export default function WishlistPage() {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      // Handle case where user is not logged in
      return;
    }

    const fetchWishlistItems = async () => {
      try {
        // Reference to the user's wishlist in Firestore
        const wishlistRef = collection(db, `users/${user.uid}/wishlist`);
        const q = query(wishlistRef);
        const querySnapshot = await getDocs(q);

        const items = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setWishlistItems(items);
      } catch (error) {
        console.error('Error fetching wishlist items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistItems();
  }, [user]);

  const handleRemoveFromWishlist = async (itemId: string) => {
    if (!user) return;

    try {
      const itemRef = doc(db, `users/${user.uid}/wishlist`, itemId);
      await deleteDoc(itemRef);
      setWishlistItems(wishlistItems.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error removing item from wishlist:', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-background">
      <h1 className="text-2xl font-bold mb-4 text-primary">My Wishlist</h1>
      <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
        {wishlistItems.length === 0 ? (
          <div className="text-center py-8">
            <HeartIcon className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-2 text-lg font-medium text-muted-foreground">Your wishlist is empty</p>
            <p className="mt-1 text-sm text-muted-foreground">Add items to your wishlist to save them for later</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {wishlistItems.map((item) => (
              <li key={item.id} className="flex items-center space-x-4 p-4 bg-muted rounded-lg">
                <div className="relative h-24 w-24 flex-shrink-0">
                  <Image
                    src={item.imageURL}
                    alt={item.name}
                    className="rounded-md object-cover"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-primary truncate">{item.name}</p>
                  <p className="text-sm text-muted-foreground">R{item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    aria-label={`Remove ${item.name} from wishlist`}
                    onClick={() => handleRemoveFromWishlist(item.id)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="default" size="sm" className="whitespace-nowrap">
                    <ShoppingCartIcon className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>

                </div>
              </li>
              
            ))}
          </ul>
        )}
      </div>
      <Button type="button" className="w-full" onClick={() => window.history.back()}>Go Back</Button> 
    </div>
  );
}
