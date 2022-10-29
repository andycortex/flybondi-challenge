export type Flight = {
  date: string;
  origin: string;
  destination: string;
  price: number;
  availability: number;
};

export type Trip = {
  id: string;
  origin: string;
  destination: string;
  availability: number;
  price: number;
  days: number;
};
