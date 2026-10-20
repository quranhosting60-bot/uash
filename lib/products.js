// Prices are in Pakistani rupees (PKR), all taxes included.
// PHOTOS: save a photo as public/products/<id>.jpg (example: public/products/14.jpg). It shows up automatically.
// Or set image: "/products/anyname.jpg" on a product to use a different file name.
export const PRODUCTS = [
  { id: 12, name: "Ceramic Dinner Plate and Bowl Set", category: "Kitchenware", sub: "Dinner Sets", price: 7990, was: 9990, tag: "sale", desc: "Matt-glaze plates and bowls in assorted colours. Microwave and dishwasher safe." },
  { id: 13, name: "White Ceramic Bowl and Jug Set", category: "Kitchenware", sub: "Dinner Sets", price: 5990, tag: "new", desc: "Ribbed white bowls with a matching jug for serving. Microwave and dishwasher safe." },
  { id: 14, name: "Leaf-Glaze Ceramic Bowls, Set of 4", category: "Kitchenware", sub: "Serveware", price: 3490, tag: "new", desc: "Glazed green bowls with a leaf pattern, ideal for salads and desserts." },
  { id: 15, name: "Silicone Cooking Utensil Set, 8 pieces", category: "Kitchenware", sub: "Cookware", price: 2490, tag: "new", desc: "Heat-resistant silicone heads with wooden handles. Safe for non-stick pans." },
  { id: 16, name: "Wooden Spoons and Chopping Board Set", category: "Kitchenware", sub: "Cookware", price: 2290, desc: "Hand-finished wooden spoons with a serving and chopping board." },
  { id: 17, name: "Ceramic Tea Cup Set, 6 pieces", category: "Kitchenware", sub: "Cups & Mugs", price: 2990, desc: "Stoneware tea cups with a two-tone glaze." },
  { id: 18, name: "Assorted Ceramic Mugs, Set of 6", category: "Kitchenware", sub: "Cups & Mugs", price: 1990, was: 2490, tag: "sale", desc: "Glossy glazed mugs in bold colours and patterns." },
  { id: 19, name: "Ceramic Mug Set with Wooden Stand", category: "Kitchenware", sub: "Cups & Mugs", price: 3790, desc: "Four stoneware mugs with a wooden mug tree on a marble base." },
  { id: 20, name: "Handmade Stoneware Set", category: "Kitchenware", sub: "Serveware", price: 4290, tag: "new", desc: "Handmade stoneware cup, plate and serving bowls with a natural matt finish." },
  { id: 21, name: "Checked Cotton Bed Linen, King Size", category: "Luxury", sub: "Bedding", price: 4990, was: 6490, tag: "sale", desc: "Blue check cotton bedsheet with two matching pillowcases." },
  { id: 22, name: "Cotton Bath Towel, Set of 3", category: "Luxury", sub: "Bath", price: 2490, desc: "Plush, absorbent white cotton towels that dry quickly." },
  { id: 23, name: "Textured Cushion Covers, Set of 2", category: "Decor", sub: "Cushions", price: 1490, tag: "new", desc: "Geometric and metallic-weave cushion covers with a hidden zip." },
  { id: 24, name: "Satin Stripe Bed Linen, King Size", category: "Luxury", sub: "Bedding", price: 5990, tag: "new", desc: "Smooth sateen-stripe bedsheet with matching pillowcases, soft and cool." },
  { id: 25, name: "Striped Terry Towels, Set of 4", category: "Luxury", sub: "Bath", price: 2990, desc: "Thick white terry towels with a navy border stripe." },
  { id: 26, name: "Knot Cushion and Decorative Cushions", category: "Decor", sub: "Cushions", price: 3490, tag: "new", desc: "A bright knot cushion with two woven decorative cushions for sofas and chairs." },
  { id: 27, name: "Woven Striped Cushion Covers, Set of 3", category: "Decor", sub: "Cushions", price: 2490, desc: "Traditional striped woven covers in warm red tones." },
  { id: 28, name: "Plush Sofa Throw, Cream", category: "Luxury", sub: "Throws", price: 4290, tag: "new", desc: "Ultra-soft faux fur throw for sofas and beds. Machine washable." },
  { id: 29, name: "Plush Sofa Throw, Green", category: "Luxury", sub: "Throws", price: 4290, tag: "new", desc: "Ultra-soft faux fur throw in sage green. Machine washable." },
];

export const SHOP = {
  name: "UASH",
  tagline: "Luxury, decor and kitchenware",
  symbol: "Rs",
  freeShippingFrom: 5000,
  shipping: 250,
  codFee: 0, // extra charge for cash on delivery, 0 = none
  whatsapp: "923354272190", // order WhatsApp number: country code, no + sign
  categories: ["Luxury", "Decor", "Kitchenware"],
  info: {
    Luxury: { line: "Premium bedding, bath and plush throws for a hotel-like home.", cta: "Shop luxury" },
    Decor: { line: "Cushions and accents that bring warmth to every room.", cta: "Shop decor" },
    Kitchenware: { line: "Dinner sets, cookware, cups and serveware.", cta: "Shop kitchenware" },
  },
  cities: ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta", "Hyderabad", "Sialkot", "Gujranwala", "Attock", "Hazro", "Abbottabad", "Sargodha", "Bahawalpur"],
};

export const money = (n) => `${SHOP.symbol} ${Math.round(n).toLocaleString("en-US")}`;

export function totals(lines) {
  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const shipping = subtotal === 0 || subtotal >= SHOP.freeShippingFrom ? 0 : SHOP.shipping;
  const cod = subtotal === 0 ? 0 : SHOP.codFee;
  return { subtotal, shipping, cod, total: subtotal + shipping + cod };
}

// Keeps an already-saved catalog in line with the three categories: old Home items move to Luxury or Decor,
// and products from removed categories (Women, Men, Kids) are dropped.
export function normalize(list) {
  return (Array.isArray(list) ? list : []).flatMap((p) => {
    if (SHOP.categories.includes(p.category)) return [p];
    if (p.category === "Home") return [{ ...p, category: /bed|bath|throw|towel/i.test(p.sub || "") ? "Luxury" : "Decor" }];
    return [];
  });
}
