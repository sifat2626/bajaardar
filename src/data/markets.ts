export interface MarketInfo {
  name: string;
  nameBn: string;
  division: string;
  district: string;
  type: "WHOLESALE" | "RETAIL" | "BOTH";
  description: string;
}

export const BANGLADESH_MARKETS: MarketInfo[] = [
  {
    name: "Karwan Bazar",
    nameBn: "কাওরান বাজার",
    division: "Dhaka",
    district: "Dhaka",
    type: "BOTH",
    description: "The largest central wholesale and retail agricultural hub in Bangladesh.",
  },
  {
    name: "Mirpur-1 Kacha Bazar",
    nameBn: "মিরপুর-১ কাঁচাবাজার",
    division: "Dhaka",
    district: "Dhaka",
    type: "RETAIL",
    description: "Major north-Dhaka kitchen market with extensive fresh vegetable & poultry sections.",
  },
  {
    name: "Mohammadpur Krishi Market",
    nameBn: "মোহাম্মদপুর কৃষি মার্কেট",
    division: "Dhaka",
    district: "Dhaka",
    type: "BOTH",
    description: "Crucial hub for wholesale rice, flour, pulses and daily groceries.",
  },
  {
    name: "Shyambazar Wholesale Market",
    nameBn: "শ্যামবাজার পাইকারি মোকাম",
    division: "Dhaka",
    district: "Dhaka",
    type: "WHOLESALE",
    description: "Historic Old Dhaka wholesale trading center for onions, garlic, ginger and potatoes.",
  },
  {
    name: "Khatunganj Wholesale Hub",
    nameBn: "খাতুনগঞ্জ পাইকারি মোকাম",
    division: "Chattogram",
    district: "Chattogram",
    type: "WHOLESALE",
    description: "Bangladesh's premier commodity trading capital and port import hub.",
  },
  {
    name: "Reazuddin Bazar",
    nameBn: "রিয়াজউদ্দিন বাজার",
    division: "Chattogram",
    district: "Chattogram",
    type: "RETAIL",
    description: "Largest consumer kitchen and seafood market in Chittagong.",
  },
  {
    name: "Shaheb Bazar",
    nameBn: "সাহেব বাজার",
    division: "Rajshahi",
    district: "Rajshahi",
    type: "BOTH",
    description: "Heart of northern agricultural distribution and fresh produce in Rajshahi.",
  },
  {
    name: "Bandar Bazar",
    nameBn: "বন্দর বাজার",
    division: "Sylhet",
    district: "Sylhet",
    type: "BOTH",
    description: "Main commercial market of Sylhet division for local and imported goods.",
  },
  {
    name: "Boro Bazar",
    nameBn: "বড় বাজার",
    division: "Khulna",
    district: "Khulna",
    type: "BOTH",
    description: "Historic trade and fish marketplace of Khulna region.",
  },
];
