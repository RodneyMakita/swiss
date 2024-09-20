'use client';

import { useState, useEffect, useRef } from 'react';
import { getAuth } from 'firebase/auth';
import { db, collection, doc, getDoc, addDoc } from '@/lib/firebase';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/app/backend/CartContext';
import '@/app/globals.css';
import { Spinner } from '@nextui-org/react';
import { useRouter } from 'next/navigation';

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

interface Order {
  id: string;
  date: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
}

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const [loading, setLoading] = useState<boolean>(false);
  const [address, setAddress] = useState<Address | null>(null);
  const [email, setEmail] = useState<string>('');
  const [conversionRate, setConversionRate] = useState<number>(0);
  const router = useRouter();
  const paypalContainerRef = useRef<HTMLDivElement>(null);

  const totalCost = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const shippingFee = totalCost < 100 ? 10 : 0;
  const totalWithShipping = totalCost + shippingFee;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSuccessfulPayment = async (newOrder: Order) => {
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (!user) {
      console.error("User is not authenticated");
      return; // Exit if user is null
    }
  
    clearCart();
    try {
      await addDoc(collection(db, 'users', user.uid, 'orders'), newOrder);
    } catch (error) {
      console.error("Error saving order:", error);
    }
    router.push('/success');
  };
  
  useEffect(() => {
    const fetchConversionRate = async () => {
      try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/ZAR');
        const data = await response.json();
        setConversionRate(data.rates.USD);
      } catch (error) {
        console.error('Error fetching conversion rate:', error);
      }
    };
    fetchConversionRate();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
  
      if (!user) {
        console.error("User is not authenticated");
        router.push('/login'); // Redirect to login if not authenticated
        return;
      }
  
      try {
        setEmail(user.email || '');
        const addressDoc = await getDoc(doc(collection(db, 'users', user.uid, 'Address'), 'addressId'));
        
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
  
  useEffect(() => {
    if (!address || !paypalContainerRef.current || conversionRate === 0) return;

    const totalInUSD = (totalWithShipping * conversionRate).toFixed(2);
    const paypalScript = document.createElement('script');
    paypalScript.src = `https://www.paypal.com/sdk/js?client-id=Ado1_eoTep86aZ3NEotXjFG_YXHo-RlrmsCtwpNJItwtpmjnnVpjou6hQ52MaL5cILjMWqP_vURdSgWj&currency=USD`;
    paypalScript.addEventListener('load', () => {
      window.paypal.Buttons({
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [{ amount: { value: totalInUSD } }],
          });
        },
        onApprove: (data: any, actions: any) => {
          return actions.order.capture().then((details: any) => {
            console.log('Transaction completed by', details.payer.name.given_name);

            const newOrder: Order = {
              id: details.id,
              date: new Date().toISOString(),
              items: cart.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price,
              })),
              total: totalWithShipping,
            };

            handleSuccessfulPayment(newOrder);
          });
        },
        onCancel: (data: any) => {
          console.warn('PayPal payment was cancelled:', data);
          alert('Payment cancelled. You can try again.');
        },
        onError: (err: any) => {
          console.error('PayPal error', err);
          alert('An error occurred during the transaction. Please try again.');
        },
      }).render(paypalContainerRef.current);
    });

    document.body.appendChild(paypalScript);

    return () => {
      if (paypalScript) document.body.removeChild(paypalScript);
    };
  }, [router, totalWithShipping, address, conversionRate, cart, handleSuccessfulPayment]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setLoading(false);
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
                <span className="text-lg font-medium">Total (ZAR)</span>
                <span className="text-lg font-medium">R{totalWithShipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">Total (USD)</span>
                <span className="text-lg font-medium">${(totalWithShipping * conversionRate).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </form>
      <div ref={paypalContainerRef} className="mt-4"></div>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50">
          <Spinner size="lg" />
        </div>
      )}
    </div>
  );
}
