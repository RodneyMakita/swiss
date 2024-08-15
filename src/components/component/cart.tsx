import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FaMinus, FaPlus, FaTrash } from 'react-icons/fa';
import { useCart } from '@/app/backend/CartContext';
import { User } from 'firebase/auth';
import { collection, onSnapshot, setDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import '@/app/globals.css';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageURL: string;
}

interface CartProps {
  onContinueShopping: () => void;
  user: User | null;
}

const Cart: React.FC<CartProps> = ({ onContinueShopping, user }) => {
  const { cart, updateQuantity, removeFromCart, clearCart, setCart } = useCart();
  const [loading, setLoading] = useState(true);
  const totalCost = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  useEffect(() => {
    if (user) {
      const cartRef = collection(db, 'users', user.uid, 'cart');
      
      // Listen for real-time updates to the cart
      const unsubscribe = onSnapshot(cartRef, (snapshot) => {
        const cartItems = snapshot.docs.map((doc) => doc.data() as CartItem);
        setCart(cartItems);
        setLoading(false); // Stop loading when data is fetched
      }, (error) => {
        console.error('Error fetching cart items:', error);
        setLoading(false);
      });

      // Clean up the listener on unmount
      return () => unsubscribe();
    }
  }, [user, setCart]);

  useEffect(() => {
    if (user && cart.length > 0) {
      cart.forEach(item => {
        saveCartItemToFirestore(user, item);
      });
    }
  }, [cart, user]);

  const handleUpdateQuantity = (id: string, quantity: number) => {
    updateQuantity(id, quantity);
  };

  const handleRemoveFromCart = (id: string) => {
    removeFromCart(id);
  };

  const saveCartItemToFirestore = async (user: User, item: CartItem) => {
    try {
      const cartRef = collection(db, 'users', user.uid, 'cart');
      await setDoc(doc(cartRef, item.id), item);
    } catch (error) {
      console.error('Error saving cart item:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loader mx-auto mb-6">
          <span>swiisspants</span>
          <span>swiisspants</span>
        </div>
      </div>
    );
  }

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
                  src={item.imageURL}
                  alt={item.name}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-md object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-lg">{item.name}</h3>
                  <div className="text-sm text-muted-foreground">R{item.price.toFixed(2)}</div>
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
                  <Button size="icon" variant="ghost" onClick={() => handleRemoveFromCart(item.id)}>
                    <FaTrash className="w-5 h-5" />
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
                  <span>R{totalCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>R{totalCost.toFixed(2)}</span>
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
};

export default Cart;
