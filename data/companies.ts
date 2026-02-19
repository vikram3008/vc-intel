export interface Company {
  id: string;
  name: string;
  website: string;
  sector: string;
  location: string;
  founded: number;
}

export const companies: Company[] = [
  {
    id: "1",
    name: "Stripe",
    website: "https://stripe.com",
    sector: "Fintech",
    location: "USA",
    founded: 2010,
  },
  {
    id: "2",
    name: "Notion",
    website: "https://notion.so",
    sector: "Productivity",
    location: "USA",
    founded: 2016,
  },
  {
    id: "3",
    name: "Figma",
    website: "https://figma.com",
    sector: "Design",
    location: "USA",
    founded: 2012,
  },
  {
    id: "4",
    name: "Razorpay",
    website: "https://razorpay.com",
    sector: "Fintech",
    location: "India",
    founded: 2014,
  },
];
