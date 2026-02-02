export interface Vehicle {
  model: string;
  year: number;
  price: number;
  type: string;
  horsepower: number;
  mpg: number;
}

export interface Brand {
  name: string;
  country: string;
  founded: number;
  vehicles: Vehicle[];
}

export interface CarsData {
  brands: Brand[];
}

export type Paradigm = 'all-data' | 'tree-nav' | 'full-chat';
