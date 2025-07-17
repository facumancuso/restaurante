
import { getProducts, getCategories } from "@/app/admin/actions";
import PosClientPage from "./client-page";

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Fetch initial data on the server
  const products = await getProducts();
  const categories = await getCategories();

  return (
    <PosClientPage
      initialProducts={products}
      initialCategories={categories}
    />
  );
}
