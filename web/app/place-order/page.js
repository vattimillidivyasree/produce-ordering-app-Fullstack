import { cookies } from "next/headers";
import ProtectedShell from "../../components/ProtectedShell";
import PlaceOrderForm from "../../components/PlaceOrderForm";
import { serverRequest } from "../../lib/api";

export default async function PlaceOrderPage() {
  const token = cookies().get("govigi_token")?.value || "";
  const products = await serverRequest("/products", token);

  return (
    <ProtectedShell>
      <div className="card" style={{ marginBottom: 16 }}>
        <h1 className="title">Place bulk order</h1>
        <p className="subtitle">Choose a product, quantity and delivery date.</p>
      </div>
      <PlaceOrderForm products={products} />
    </ProtectedShell>
  );
}
