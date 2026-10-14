import Store from "@/components/Store";
import { getProducts } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Page() {
  const products = await getProducts();
  return <Store products={products} />;
}
