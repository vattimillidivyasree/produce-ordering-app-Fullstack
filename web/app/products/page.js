import { cookies } from "next/headers";
import ProtectedShell from "../../components/ProtectedShell";
import ProductList from "../../components/ProductList";
import { serverRequest } from "../../lib/api";

export default async function ProductsPage() {
  const token = cookies().get("govigi_token")?.value || "";
  const products = await serverRequest("/products", token);

  return (
    <ProtectedShell>
      <div className="card" style={{ marginBottom: 16 }}>
        <h1 className="title">Available produce</h1>
        <p className="subtitle">Browse vegetables and fruits ready for ordering.</p>
      </div>
      <ProductList products={products} />
    </ProtectedShell>
  );
}
