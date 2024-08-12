import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  StoreIcon,
  SearchIcon,
  CircuitBoardIcon,
  MusicIcon,
  HomeIcon,
  ListIcon,
  GemIcon,
  ClubIcon,
  CalendarIcon,
  BoltIcon,
  ApertureIcon
} from '../icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSmoking ,faBreadSlice , faCookieBite} from '@fortawesome/free-solid-svg-icons';

export default function Categories() {
  return (
    <div className="flex flex-col h-screen">
      <header className="bg-primary text-primary-foreground py-2 px-4 flex items-center h-14">
        <Link href="#" className="flex items-center gap-2" prefetch={false}>
          <span className="text-lg font-bold">Categories</span>
        </Link>
      </header>
      <main className="flex-1 overflow-auto">
        <section className="bg-muted py-4 px-4">
          <h2 className="text-lg font-bold mb-2"></h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link
              href="#"
              className="flex flex-col items-center gap-1 bg-background rounded-md p-4 hover:bg-accent hover:text-accent-foreground transition-colors"
              prefetch={false}
            >
              <FontAwesomeIcon icon={faSmoking} className="w-8 h-8" />
              <span className="text-sm font-medium">Cigarettes</span>
            </Link>
            <Link
              href="#"
              className="flex flex-col items-center gap-1 bg-background rounded-md p-4 hover:bg-accent hover:text-accent-foreground transition-colors"
              prefetch={false}
            >
             <FontAwesomeIcon icon={faBreadSlice}  className="w-8 h-8"  />
              <span className="text-sm font-medium">Bakery</span>
            </Link>
            <Link
              href="#"
              className="flex flex-col items-center gap-1 bg-background rounded-md p-4 hover:bg-accent hover:text-accent-foreground transition-colors"
              prefetch={false}
            >
              <FontAwesomeIcon icon={faCookieBite}  className="w-8 h-8"/>
              <span className="text-sm font-medium">Snacks</span>
            </Link>
            <Link
              href="#"
              className="flex flex-col items-center gap-1 bg-background rounded-md p-4 hover:bg-accent hover:text-accent-foreground transition-colors"
              prefetch={false}
            >
              <GemIcon className="w-8 h-8" />
              <span className="text-sm font-medium">Beauty</span>
            </Link>
            <Link
              href="#"
              className="flex flex-col items-center gap-1 bg-background rounded-md p-4 hover:bg-accent hover:text-accent-foreground transition-colors"
              prefetch={false}
            >
              <ClubIcon className="w-8 h-8" />
              <span className="text-sm font-medium">Sports</span>
            </Link>
            <Link
              href="#"
              className="flex flex-col items-center gap-1 bg-background rounded-md p-4 hover:bg-accent hover:text-accent-foreground transition-colors"
              prefetch={false}
            >
              <ApertureIcon className="w-8 h-8" />
              <span className="text-sm font-medium">Appliances</span>
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
  );
}
