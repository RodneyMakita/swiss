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
  }
  