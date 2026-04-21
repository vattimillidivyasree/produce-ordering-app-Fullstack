import { cookies } from "next/headers";
import ProtectedShell from "../../components/ProtectedShell";
import OrdersList from "../../components/OrdersList";
import { serverRequest } from "../../lib/api";

export default async function OrdersPage() {
  const token = cookies().get("govigi_token")?.value || "";
  const orders = await serverRequest("/orders", token);

  return (
    <ProtectedShell>
      <div className="card" style={{ marginBottom: 16 }}>
        <h1 className="title">My orders</h1>
        <p className="subtitle">Track each order and its current status.</p>
      </div>
      <OrdersList orders={orders} />
    </ProtectedShell>
  );
}
