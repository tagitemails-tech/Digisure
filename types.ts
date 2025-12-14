export enum UserRole {
  STUDENT = 'student',
  VENDOR = 'vendor',
  ADMIN = 'admin'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  walletBalance: number;
}

export enum ProductType {
  COURSE = 'course',
  DOWNLOAD = 'download',
  ACADEMIC = 'academic'
}

export interface BaseProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  thumbnail: string;
  rating: number;
  reviewsCount: number;
  author: string;
  type: ProductType;
  tags: string[];
}

export interface Course extends BaseProduct {
  type: ProductType.COURSE;
  duration: string;
  lectures: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface DigitalDownload extends BaseProduct {
  type: ProductType.DOWNLOAD;
  fileFormat: string;
  fileSize: string;
  version: string;
}

export interface AcademicResource extends BaseProduct {
  type: ProductType.ACADEMIC;
  grade: string;
  subject: string;
  format: 'PDF' | 'DOCX' | 'PPT';
}

export type Product = Course | DigitalDownload | AcademicResource;

export type CartItem = Product & {
  cartId: string;
};

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'Completed' | 'Pending' | 'Refunded';
}