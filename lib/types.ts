export type MenuItem = {
  _id: string;
  itemName: string;
  category: string;
  price: number;
  location: string;
  images: string[];
  vendor: {
    name: string;
    businessName?: string;
    subscriptionPlan?: "free" | "premium";
  };
};