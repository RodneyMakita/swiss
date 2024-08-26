'use client';

import { useState, useEffect } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';
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

const stripePromise: Promise<Stripe | null> = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

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
  const [email, setEmail] = useState<string>(''); // State for storing the user's email
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
        // Set the user's email
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

    const stripe = await stripePromise;

    if (!stripe) {
      alert("Stripe initialization failed");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cart.map(item => ({
            price_data: {
              currency: 'zar',
              product_data: {
                name: item.name,
              },
              unit_amount: Math.round(item.price * 100),
            },
            quantity: item.quantity,
          })),
        }),
      });

      const session = await response.json();

      if (response.ok && session.id) {
        const result = await stripe.redirectToCheckout({
          sessionId: session.id,
        });

        if (result.error) {
          alert(result.error.message);
        }
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error redirecting to checkout:', error);
      alert('An error occurred while processing your order.');
    } finally {
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
              value={email || 'Loading...'} // Bind the email value
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
        <div className="space-y-4">
          <div>
            <Label htmlFor="card-number">Card Number</Label>
            <Input id="card-number" type="text" placeholder="Card details will be entered on Stripe" disabled />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiration">Expiration Date</Label>
              <Input id="expiration" type="text" placeholder="MM/YY" disabled />
            </div>
            <div>
              <Label htmlFor="cvv">CVV</Label>
              <Input id="cvv" type="text" placeholder="CVV" disabled />
            </div>
          </div>
          <div>
            <Label htmlFor="discount-code">Discount Code</Label>
            <div className="flex items-center">
              <Input id="discount-code" placeholder="Enter discount code" />
              <Button variant="outline" className="ml-2">
                Apply
              </Button>
            </div>
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
