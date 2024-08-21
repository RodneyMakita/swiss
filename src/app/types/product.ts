export interface Product {
  reviewCount: number;
  rating: number;
  additionalImages: never[];
  id: string;
  name: string;
  price: number;
  imageURL: string;
  description: string;
  category: string;
  reviews: {
    id: string;
    name: string;
    date: string;
    rating: number;
    comment: string;
  }[];
  }
  