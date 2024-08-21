export interface Product {
  id: string;
  name: string;
  price: number;
  imageURL: string;
  description: string;
  reviews: {
    id: string;
    name: string;
    date: string;
    rating: number;
    comment: string;
  }[];
  reviewCount: number;         // Add missing property
  rating: number;              // Add missing property
  additionalImages: string[]; // Add missing property
  category: string;            // Add missing property
}
