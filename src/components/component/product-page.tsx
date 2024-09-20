'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { useCart } from '@/app/backend/CartContext'
import { Product } from '@/app/types/product'
import Image from 'next/image'
import { ArrowLeft, Heart, Star } from 'lucide-react'
import Link from 'next/link'
import { db, collection, getDocs, query, where, doc, setDoc } from '@/lib/firebase'
import { useToast } from "@/components/ui/use-toast"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from '@/app/auth/AuthContext'

interface ProductPageProps {
  product: Product
}

export default function ProductPage({ product }: ProductPageProps) {
  const { addToCart } = useCart()
  const { user } = useAuth() // Get the current user from the AuthContext
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const [wishlistLoading, setWishlistLoading] = useState(false)
  const [similarProducts, setSimilarProducts] = useState<Product[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      try {
        const q = query(collection(db, "products"), where("category", "==", product.category))
        const querySnapshot = await getDocs(q)
        const products = querySnapshot.docs
          .map(doc => ({ ...doc.data(), id: doc.id } as Product))
          .filter(p => p.id !== product.id)
          .slice(0, 6) // Limit to 6 similar products
        setSimilarProducts(products)
      } catch (error) {
        console.error('Error fetching similar products:', error)
        toast({
          title: "Error",
          description: "Failed to load similar products. Please try again later.",
          variant: "destructive",
        })
      }
    }

    fetchSimilarProducts()
  }, [product, toast])

  const handleAddToCart = async () => {
    setLoading(true)
    try {
      if (!product.id) {
        throw new Error('Product ID is missing')
      }
      await addToCart({ ...product, quantity })
      toast({
        title: "Success",
        description: `Added ${quantity} ${quantity > 1 ? 'items' : 'item'} to your cart.`,
      })
    } catch (error) {
      console.error('Failed to add item to cart:', error)
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddToWishlist = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to add items to your wishlist.",
        variant: "destructive",
      })
      return
    }

    setWishlistLoading(true)
    try {
      const wishlistRef = doc(db, `users/${user.uid}/wishlist`, product.id) // Document path for wishlist
      await setDoc(wishlistRef, { ...product }) // Add the product to the user's wishlist
      toast({
        title: "Success",
        description: "Item added to your wishlist.",
      })
    } catch (error) {
      console.error('Failed to add item to wishlist:', error)
      toast({
        title: "Error",
        description: "Failed to add item to wishlist. Please try again.",
        variant: "destructive",
      })
    } finally {
      setWishlistLoading(false)
    }
  }

  return (
    <div className="w-full">
      <header className="bg-primary text-primary-foreground py-2 px-4 flex items-center h-14">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <ArrowLeft className="h-5 w-5" />
          <span className="text-lg font-bold ml-2">Back to Products</span>
        </Link>
      </header>
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        <section className="grid md:grid-cols-2 gap-8 items-start">
          <div className="space-y-4">
            <Carousel className="w-full max-w-xl mx-auto">
              <CarouselContent>
                {[product.imageURL, ...product.additionalImages || []].map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <Card>
                        <CardContent className="flex aspect-square items-center justify-center p-6">
                          <Image
                            src={image}
                            alt={`${product.name} - Image ${index + 1}`}
                            width={500}
                            height={500}
                            className="object-cover rounded-lg"
                          />
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <p className="text-muted-foreground mt-2">{product.description}</p>
            </div>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= product.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="text-sm text-muted-foreground">({product.reviewCount} reviews)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold">
                {product.price ? `R${Number(product.price).toFixed(2)}` : "Price not available"}
              </span>
              <Badge variant="secondary" className="text-lg">
                {product.category}
              </Badge>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <label htmlFor="quantity" className="text-sm font-medium">
                  Quantity:
                </label>
                <select
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="rounded-md border-gray-300"
                >
                  {[1, 2, 3, 4, 5].map((val) => (
                    <option key={val} value={val}>
                      {val}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={loading}
                  className="w-full sm:w-auto"
                >
                  {loading ? 'Adding...' : 'Add to Cart'}
                </Button>
                <Button
                  size="lg"
                  onClick={handleAddToWishlist}
                  disabled={wishlistLoading}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  <Heart className="mr-2 h-4 w-4" />
                  {wishlistLoading ? 'Adding...' : 'Add to Wishlist'}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {similarProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Similar Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {similarProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <Image
                      src={product.imageURL}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <h3 className="mt-2 text-lg font-semibold line-clamp-1">{product.name}</h3>
                    <p className="text-muted-foreground line-clamp-2">{product.description}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <span className="text-lg font-bold">
                      {product.price ? `R${Number(product.price).toFixed(2)}` : "Price not available"}
                    </span>
                    <Button size="sm" asChild>
                      <Link href={`/products/${product.id}`} legacyBehavior>View Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
