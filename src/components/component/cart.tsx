'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'; // Use for navigation
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import { useCart } from "@/app/backend/CartContext";
import { User } from "firebase/auth";
import Image from "next/image";
import "@/app/globals.css";

interface CartProps {
  onContinueShopping: () => void;
  user: User | null;
}

const Cart: React.FC<CartProps> = ({ onContinueShopping, user }) => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const [loading, setLoading] = useState(true);
  const totalCost = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const router = useRouter(); // Initialize router for navigation

  useEffect(() => {
    if (user) {
      setLoading(false);
    } else {
      console.error('User is not authenticated');
      setLoading(false);
    }
  }, [user]);

  const handleUpdateQuantity = (id: string, quantity: number) => {
    updateQuantity(id, quantity);
  };

  const handleRemoveFromCart = (id: string) => {
    removeFromCart(id);
  };

  const handleCheckout = () => {
    // Navigate to the checkout page
    router.push('/checkout');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loader mx-auto mb-6">
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-9">
      {cart.length === 0 ? (
        <div className="border border-dashed shadow-sm rounded-lg flex flex-col items-center justify-center p-4 md:p-8">
          <div className="flex flex-col items-center gap-2">
            <h3 className="font-bold text-xl md:text-2xl">
              Your cart is empty
            </h3>
            <p className="text-sm text-muted-foreground">
              Add some items to your cart to get started.
            </p>
            <Button className="mt-4" onClick={onContinueShopping}>
              Continue Shopping
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:gap-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex flex-col md:flex-row items-center gap-4 bg-muted/20 rounded-lg p-4 md:p-6"
              >
                <Image
                  src={item.imageURL}
                  alt={item.name}
                  width={128}
                  height={128}
                  className="rounded-md object-cover"
                />

                <div className="flex-1">
                  <h3 className="font-medium text-lg">{item.name}</h3>
                  <div className="text-sm text-muted-foreground">
                    R{item.price.toFixed(2)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <FaMinus className="w-5 h-5" />
                  </Button>
                  <div className="text-center w-12">{item.quantity}</div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                  >
                    <FaPlus className="w-5 h-5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleRemoveFromCart(item.id)}
                  >
                    <FaTrash className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <Separator className="my-4" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-lg font-semibold">Total: R{totalCost.toFixed(2)}</div>
            <Button className="mt-4 md:mt-0" onClick={clearCart}>
              Clear Cart
            </Button>
            <Button
              className="mt-4 md:mt-0"
              variant="default"
              onClick={handleCheckout} 
            >
              Checkout
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
