import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import StoreIcon from "@/components/icons/StoreIcon"
import CircuitBoardIcon from "@/components/icons/CircuitBoardIcon"
import GemIcon from "@/components/icons/GemIcon"
import HomeIcon from "@/components/icons/HomeIcon"
import ListIcon from "@/components/icons/ListIcon"
import MusicIcon from "@/components/icons/MusicIcon"
import SearchIcon from "@/components/icons/SearchIcon"
import ShoppingCartIcon from "@/components/icons/ShoppingCartIcon"
import UserIcon from "@/components/icons/UserIcon"
import { faSmoking ,faBreadSlice , faCookieBite} from '@fortawesome/free-solid-svg-icons';


export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      <header className="bg-primary text-primary-foreground py-2 px-4 flex items-center">
        <Link href="#" className="flex items-center gap-2" prefetch={false}>
          <StoreIcon className="w-8 h-8" />
          <span className="text-lg font-bold">swiisspants</span>
        </Link>
        <div className="relative flex-1 ml-4">
          <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for products..."
            className="bg-primary-foreground/10 rounded-md pl-8 pr-4 py-2 text-sm w-full"
          />
        </div>
      </header>
      <main className="flex-1 overflow-auto">
        <section className="bg-muted py-4 px-4">
          <h2 className="text-lg font-bold mb-2">Categories</h2>
          <div className="grid grid-cols-4 gap-4">
            <Link href="/Categories" className="flex flex-col items-center gap-1" prefetch={false}>
              <CircuitBoardIcon className="w-8 h-8" />
              <span className="text-sm">Electronics</span>
            </Link>
            <Link href="#" className="flex flex-col items-center gap-1" prefetch={false}>
              <MusicIcon className="w-8 h-8" />
              <span className="text-sm">Fashion</span>
            </Link>
            <Link href="#" className="flex flex-col items-center gap-1" prefetch={false}>
              <HomeIcon className="w-8 h-8" />
              <span className="text-sm">Home</span>
            </Link>
            <Link href="#" className="flex flex-col items-center gap-1" prefetch={false}>
              <GemIcon className="w-8 h-8" />
              <span className="text-sm">Beauty</span>
            </Link>
          </div>
        </section>
        <section className="py-4 px-4">
          <h2 className="text-lg font-bold mb-2">Featured Products</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link href="#" className="bg-background rounded-md overflow-hidden" prefetch={false}>
              <img
                src="/placeholder.svg"
                alt="Product Image"
                width={200}
                height={200}
                className="w-full h-40 object-cover"
                style={{ aspectRatio: "200/200", objectFit: "cover" }}
              />
              <div className="p-2">
                <h3 className="text-sm font-medium">Product Name</h3>
                <p className="text-xs text-muted-foreground">Product Description</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-bold">R99.99</span>
                  <Button size="sm" variant="outline">
                    Add to Cart
                  </Button>
                </div>
              </div>
            </Link>
            <Link href="#" className="bg-background rounded-md overflow-hidden" prefetch={false}>
              <img
                src="/placeholder.svg"
                alt="Product Image"
                width={200}
                height={200}
                className="w-full h-40 object-cover"
                style={{ aspectRatio: "200/200", objectFit: "cover" }}
              />
              <div className="p-2">
                <h3 className="text-sm font-medium">Product Name</h3>
                <p className="text-xs text-muted-foreground">Product Description</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-bold">R199.99</span>
                  <Button size="sm" variant="outline">
                    Add to Cart
                  </Button>
                </div>
              </div>
            </Link>
          </div>
        </section>
      </main>

    </div>
  )
}
