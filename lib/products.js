// Prices are in Pakistani rupees (PKR), all taxes included.
// PHOTOS: save a photo as public/products/<id>.jpg (example: public/products/14.jpg). It shows up automatically.
// Or set image: "/products/anyname.jpg" on a product to use a different file name.
export const PRODUCTS = [
  { id: 1, name: "Embroidered Mirror-Work Suit, 3 pieces", category: "Women", sub: "Embroidered", price: 6490, tag: "new", sizes: ["XS", "S", "M", "L", "XL"], desc: "Stitched three-piece suit with mirror-work embroidery, matching trousers and a printed dupatta." },
  { id: 2, name: "Printed Kurta and Palazzo Set", category: "Women", sub: "Printed", price: 3490, was: 4490, tag: "sale", sizes: ["XS", "S", "M", "L", "XL"], desc: "Printed kurta with matching palazzo trousers and a delicate lace trim." },
  { id: 3, name: "Cutwork Embroidered Suit with Dupatta", category: "Women", sub: "Embroidered", price: 5990, sizes: ["XS", "S", "M", "L", "XL"], desc: "Cutwork-embroidered shirt in soft cotton with straight trousers and a woven dupatta." },
  { id: 4, name: "Floral Print Suit with Net Sleeves", category: "Women", sub: "Printed", price: 5490, was: 6490, tag: "sale", sizes: ["XS", "S", "M", "L", "XL"], desc: "Floral printed shirt with embroidered net sleeves, trousers and a plain dupatta." },
  { id: 5, name: "Crewneck Sweatshirt", category: "Men", sub: "Sweatshirts", price: 3990, tag: "new", sizes: ["S", "M", "L", "XL"], desc: "Relaxed-fit fleece sweatshirt with ribbed cuffs and hem." },
  { id: 6, name: "Long-Sleeve Polo Shirt", category: "Men", sub: "Shirts", price: 3290, sizes: ["S", "M", "L", "XL"], desc: "Cotton-blend polo with contrast piping and embroidered badges." },
  { id: 7, name: "Open-Front Cardigan", category: "Men", sub: "Cardigans", price: 3490, was: 4490, tag: "sale", sizes: ["S", "M", "L", "XL"], desc: "Knit shawl-collar cardigan, easy to layer over a tee." },
  { id: 8, name: "Printed Polo Shirt", category: "Men", sub: "Shirts", price: 1990, was: 2690, tag: "sale", sizes: ["S", "M", "L", "XL"], desc: "Soft cotton polo with a small all-over print, available in three colours." },
  { id: 9, name: "Boys' Cotton T-Shirt Set, 3 pieces", category: "Kids", sub: "Boys", price: 1990, was: 2490, tag: "sale", sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"], desc: "Three soft cotton tees in assorted colours. Tagless neck." },
  { id: 10, name: "Girls' Printed Frock", category: "Kids", sub: "Girls", price: 2490, tag: "new", sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"], desc: "Cotton frock with a comfortable fit and a playful print." },
  { id: 11, name: "Baby Romper Set", category: "Kids", sub: "Baby", price: 1790, desc: "Soft cotton sleepsuit and button romper for babies, gentle on delicate skin." },
  { id: 12, name: "Ceramic Dinner Plate and Bowl Set", category: "Kitchenware", sub: "Dinner Sets", price: 7990, was: 9990, tag: "sale", desc: "Matt-glaze plates and bowls in assorted colours. Microwave and dishwasher safe." },
  { id: 13, name: "White Ceramic Bowl and Jug Set", category: "Kitchenware", sub: "Dinner Sets", price: 5990, tag: "new", desc: "Ribbed white bowls with a matching jug for serving. Microwave and dishwasher safe." },
  { id: 14, name: "Leaf-Glaze Ceramic Bowls, Set of 4", category: "Kitchenware", sub: "Serveware", price: 3490, tag: "new", desc: "Glazed green bowls with a leaf pattern, ideal for salads and desserts." },
  { id: 15, name: "Silicone Cooking Utensil Set, 8 pieces", category: "Kitchenware", sub: "Cookware", price: 2490, tag: "new", desc: "Heat-resistant silicone heads with wooden handles. Safe for non-stick pans." },
  { id: 16, name: "Wooden Spoons and Chopping Board Set", category: "Kitchenware", sub: "Cookware", price: 2290, desc: "Hand-finished wooden spoons with a serving and chopping board." },
  { id: 17, name: "Ceramic Tea Cup Set, 6 pieces", category: "Kitchenware", sub: "Cups & Mugs", price: 2990, desc: "Stoneware tea cups with a two-tone glaze." },
  { id: 18, name: "Assorted Ceramic Mugs, Set of 6", category: "Kitchenware", sub: "Cups & Mugs", price: 1990, was: 2490, tag: "sale", desc: "Glossy glazed mugs in bold colours and patterns." },
  { id: 19, name: "Ceramic Mug Set with Wooden Stand", category: "Kitchenware", sub: "Cups & Mugs", price: 3790, desc: "Four stoneware mugs with a wooden mug tree on a marble base." },
  { id: 20, name: "Handmade Stoneware Set", category: "Kitchenware", sub: "Serveware", price: 4290, tag: "new", desc: "Handmade stoneware cup, plate and serving bowls with a natural matt finish." },
  { id: 21, name: "Checked Cotton Bed Linen, King Size", category: "Home", sub: "Bedding", price: 4990, was: 6490, tag: "sale", desc: "Blue check cotton bedsheet with two matching pillowcases." },
  { id: 22, name: "Cotton Bath Towel, Set of 3", category: "Home", sub: "Bath", price: 2490, desc: "Plush, absorbent white cotton towels that dry quickly." },
  { id: 23, name: "Textured Cushion Covers, Set of 2", category: "Home", sub: "Decor", price: 1490, tag: "new", desc: "Geometric and metallic-weave cushion covers with a hidden zip." },
  { id: 24, name: "Satin Stripe Bed Linen, King Size", category: "Home", sub: "Bedding", price: 5990, tag: "new", desc: "Smooth sateen-stripe bedsheet with matching pillowcases, soft and cool." },
  { id: 25, name: "Striped Terry Towels, Set of 4", category: "Home", sub: "Bath", price: 2990, desc: "Thick white terry towels with a navy border stripe." },
  { id: 26, name: "Knot Cushion and Decorative Cushions", category: "Home", sub: "Decor", price: 3490, tag: "new", desc: "A bright knot cushion with two woven decorative cushions for sofas and chairs." },
  { id: 27, name: "Woven Striped Cushion Covers, Set of 3", category: "Home", sub: "Decor", price: 2490, desc: "Traditional striped woven covers in warm red tones." },
  { id: 28, name: "Plush Sofa Throw, Cream", category: "Home", sub: "Throws", price: 4290, tag: "new", desc: "Ultra-soft faux fur throw for sofas and beds. Machine washable." },
  { id: 29, name: "Plush Sofa Throw, Green", category: "Home", sub: "Throws", price: 4290, tag: "new", desc: "Ultra-soft faux fur throw in sage green. Machine washable." },
  { id: 30, name: "Cotton Crewneck T-Shirt", category: "Men", sub: "T-Shirts", price: 1490, tag: "new", sizes: ["S", "M", "L", "XL"], desc: "Soft cotton tee with a ribbed crew neck and relaxed fit. Shown in mint." },
];

export const SHOP = {
  name: "Falestix",
  domain: "falestix.store",
  symbol: "Rs",
  freeShippingFrom: 5000,
  shipping: 250,
  codFee: 0, // extra charge for cash on delivery, 0 = none
  whatsapp: "923000000000", // your WhatsApp number with country code, no + sign. Orders can be sent here.
  categories: ["Women", "Men", "Kids", "Kitchenware", "Home"],
  cities: ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta", "Hyderabad", "Sialkot", "Gujranwala", "Attock", "Hazro", "Abbottabad", "Sargodha", "Bahawalpur"],
};

export const money = (n) => `${SHOP.symbol} ${Math.round(n).toLocaleString("en-US")}`;

export function totals(lines) {
  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const shipping = subtotal === 0 || subtotal >= SHOP.freeShippingFrom ? 0 : SHOP.shipping;
  const cod = subtotal === 0 ? 0 : SHOP.codFee;
  return { subtotal, shipping, cod, total: subtotal + shipping + cod };
}
