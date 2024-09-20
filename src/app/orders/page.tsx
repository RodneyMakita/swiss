'use client'

import { JSX, SVGProps, useState, useEffect } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { getAuth } from "firebase/auth";
import { db, collection, addDoc, getDocs } from '@/lib/firebase'; // Ensure you have Firestore configured

// Define the Order type
interface Order {
  id: string;
  date: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
}

export default function Orders() {
  const [currentOrders, setCurrentOrders] = useState<Order[]>([]);
  const [pastOrders, setPastOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState("current");

  const auth = getAuth();
  const user = auth.currentUser;

  const handlePaymentSuccess = async (newOrder: Order) => {
    if (!user) {
      console.error("User is not authenticated");
      return;
    }

    try {
      // Save the order to Firestore
      await addDoc(collection(db, 'users', user.uid, 'orders'), newOrder);
      setCurrentOrders((prev) => [...prev, newOrder]);

      // Move the order to past orders after a certain time (e.g., 1 hour)
      setTimeout(() => {
        setPastOrders((prev) => [...prev, newOrder]);
        setCurrentOrders((prev) => prev.filter(order => order.id !== newOrder.id));
      }, 3600000); // 1 hour in milliseconds
    } catch (error) {
      console.error("Error saving order:", error);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      const ordersSnapshot = await getDocs(collection(db, 'users', user.uid, 'orders'));
      const fetchedOrders: Order[] = ordersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as Omit<Order, 'id'>,
      }));

      setCurrentOrders(fetchedOrders);
    };

    fetchOrders();
  }, [user]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">My Orders</h1>
      </header>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="current">Current Orders</TabsTrigger>
          <TabsTrigger value="past">Past Orders</TabsTrigger>
        </TabsList>
        <TabsContent value="current">
          {currentOrders.length > 0 ? (
            <div className="grid gap-4">
              {currentOrders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Order #{order.id}</span>
                      <span className="text-sm text-muted-foreground">{order.date}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="grid gap-2">
                      {order.items.map((item, index) => (
                        <li key={index} className="flex items-center justify-between">
                          <span>{item.name}</span>
                          <span>
                            {item.quantity} x ${item.price}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <Separator className="my-4" />
                    <div className="flex items-center justify-between font-medium">
                      <span>Total</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 py-8">
              <PackageIcon className="h-12 w-12 text-muted-foreground" />
              <p className="text-lg font-medium text-muted-foreground">You have no current orders.</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="past">
          {pastOrders.length > 0 ? (
            <div className="grid gap-4">
              {pastOrders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Order #{order.id}</span>
                      <span className="text-sm text-muted-foreground">{order.date}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="grid gap-2">
                      {order.items.map((item, index) => (
                        <li key={index} className="flex items-center justify-between">
                          <span>{item.name}</span>
                          <span>
                            {item.quantity} x ${item.price}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <Separator className="my-4" />
                    <div className="flex items-center justify-between font-medium">
                      <span>Total</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 py-8">
              <PackageIcon className="h-12 w-12 text-muted-foreground" />
              <p className="text-lg font-medium text-muted-foreground">You have no past orders.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function PackageIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  )
}
