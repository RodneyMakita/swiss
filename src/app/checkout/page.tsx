'use client'

import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { db, collection, doc, getDoc } from '@/lib/firebase';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/app/backend/CartContext';
import '@/app/globals.css';
import { Spinner } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface Address {
  firstName: string;
  lastName: string;
  streetAddress: string;
  city: string;
  province: string;
  postalCode: string;
  cellphone: string;
  country: string;
}

export default function Checkout() {
  const { cart } = useCart();
  const [loading, setLoading] = useState<boolean>(false);
  const [address, setAddress] = useState<Address | null>(null);
  const [email, setEmail] = useState<string>('');
  const router = useRouter();

  const totalCost = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const shippingFee = totalCost < 100 ? 10 : 0;
  const totalWithShipping = totalCost + shippingFee;

  useEffect(() => {
    const fetchUserData = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        console.error("User is not authenticated");
        return;
      }

      try {
        setEmail(user.email || '');

        const userId = user.uid;
        const addressDoc = await getDoc(doc(collection(db, 'users', userId, 'Address'), 'addressId'));

        if (addressDoc.exists()) {
          setAddress(addressDoc.data() as Address);
        } else {
          console.log("No address found for the user.");
          router.push('/address');
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Make a request to your backend to initiate the Ozow payment
      const response = await axios.post('/api/initiate-ozow-payment', {
        amount: totalWithShipping.toFixed(2),
        transactionReference: `order-${Date.now()}`, // Unique reference for the transaction
        customer: {
          firstName: address?.firstName,
          lastName: address?.lastName,
          email: email,
          cellphone: address?.cellphone,
        },
        payment: {
          successUrl: `${window.location.origin}/success`,
          errorUrl: `${window.location.origin}/cancel`,
          notifyUrl: `${window.location.origin}/api/ozow-notify`,
        },
      });

      // Redirect the user to Ozow's payment page
      const { paymentUrl } = response.data;
      window.location.href = paymentUrl;

    } catch (error) {
      console.error("Error initiating payment:", error);
      setLoading(false);
    }
  };

  return (
    <div className="bg-background text-foreground p-6 md:p-8 lg:p-12 rounded-lg shadow-lg max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Checkout</h1>
        <p className="text-muted-foreground">Complete your purchase</p>
      </div>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={address ? `${address.firstName} ${address.lastName}` : 'Loading...'}
              readOnly
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email || 'Loading...'}
              readOnly
            />
          </div>
          <div>
            <Label htmlFor="address">Shipping Address</Label>
            <Textarea
              id="address"
              placeholder="Enter your shipping address"
              value={address ? `${address.streetAddress}, ${address.city}, ${address.province}, ${address.postalCode}` : 'Loading...'}
              readOnly
            />
          </div>
        </div>
        <div className="mt-8">
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">Order Summary</h3>
              <div className="text-muted-foreground">
                <span className="font-medium">{cart.length}</span> items
              </div>
            </div>
            <div className="space-y-2">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.name} (x{item.quantity})</span>
                  <span>R{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>R{shippingFee.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">Total</span>
                <span className="text-lg font-medium">R{totalWithShipping.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button type="submit" size="lg" disabled={loading}>
              {loading ? 'Processing...' : 'Place Order'}
            </Button>
          </div>
        </div>
      </form>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50">
          <Spinner size="lg" />
        </div>
      )}
    </div>
  );
}
