'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { SVGProps } from 'react';

interface CartProps {
  onContinueShopping: () => void; // Prop for navigation callback
}

export default function Cart({ onContinueShopping }: CartProps) {
  const [cart, setCart] = useState([
    {
      id: 1,
      name: "Acme Wireless Headphones",
      image: "/placeholder.svg",
      price: 99.99,
      quantity: 1,
    },
    {
      id: 2,
      name: "Ergonomic Office Chair",
      image: "/placeholder.svg",
      price: 249.99,
      quantity: 1,
    },
    {
      id: 3,
      name: "Outdoor Camping Gear Set",
      image: "/placeholder.svg",
      price: 79.99,
      quantity: 2,
    },
  ]);

  const handleQuantityChange = (id: number, quantity: number) => {
    setCart(cart.map((item) => (item.id === id ? { ...item, quantity } : item)));
  };

  const handleRemoveItem = (id: number) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const totalCost = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-9">
      {cart.length === 0 ? (
        <div className="border border-dashed shadow-sm rounded-lg flex flex-col items-center justify-center p-4 md:p-8">
          <div className="flex flex-col items-center gap-2">
            <h3 className="font-bold text-xl md:text-2xl">Your cart is empty</h3>
            <p className="text-sm text-muted-foreground">Add some items to your cart to get started.</p>
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
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-md object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-lg">{item.name}</h3>
                  <div className="text-sm text-muted-foreground">${item.price.toFixed(2)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <MinusIcon className="w-5 h-5" />
                  </Button>
                  <div className="text-center w-12">{item.quantity}</div>
                  <Button size="icon" variant="ghost" onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>
                    <PlusIcon className="w-5 h-5" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => handleRemoveItem(item.id)}>
                    <TrashIcon className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${totalCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>${totalCost.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col md:flex-row gap-2">
              <Button variant="outline" className="flex-1" onClick={onContinueShopping}>
                Continue Shopping
              </Button>
              <Button className="flex-1">Proceed to Checkout</Button>
            </CardFooter>
          </Card>
        </>
      )}
    </div>
  );
}

function MinusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
    </svg>
  );
}

function PlusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function TrashIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}
