export default function OrdersList({ orders = [] }) {
  if (!orders.length) {
    return (
      <div className="card">
        <p style={{ margin: 0 }}>No orders yet. Place your first order from the order page.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="section-title">Order history</h3>
      {orders.map((order) => (
        <div className="order-item" key={order._id}>
          <div className="row space-between">
            <strong>{order.product?.name}</strong>
            <span className={`badge ${order.status}`}>{order.status}</span>
          </div>
          <div className="row">
            <span className="muted">Quantity: {order.quantity}</span>
            <span className="muted">Delivery: {new Date(order.deliveryDate).toLocaleDateString()}</span>
          </div>
          <div className="row">
            <span className="muted">Category: {order.product?.category}</span>
            <span className="muted">Price: ₹{order.product?.price}/{order.product?.unit}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
