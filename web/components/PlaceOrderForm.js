"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "../lib/api";

export default function PlaceOrderForm({ products = [] }) {
  const router = useRouter();
  const [formData, setFormData] = useState({ productId: products[0]?._id || "", quantity: "", deliveryDate: "" });
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedProduct = useMemo(() => products.find((product) => product._id === formData.productId), [products, formData.productId]);

  const handleChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      await apiRequest("/orders", { method: "POST", body: JSON.stringify(formData) });
      setMessage("Order placed successfully.");
      setFormData({ productId: products[0]?._id || "", quantity: "", deliveryDate: "" });
      setTimeout(() => router.push("/orders"), 700);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-2">
      <div className="card">
        <h3 className="section-title">Order details</h3>
        <form className="form" onSubmit={handleSubmit}>
          <select className="select" name="productId" value={formData.productId} onChange={handleChange} required>
            {products.map((product) => (
              <option key={product._id} value={product._id}>{product.name} — ₹{product.price}/{product.unit}</option>
            ))}
          </select>
          <input className="input" name="quantity" type="number" min="1" placeholder="Quantity" value={formData.quantity} onChange={handleChange} required />
          <input className="input" name="deliveryDate" type="date" value={formData.deliveryDate} onChange={handleChange} required />
          <button className="button" type="submit" disabled={isSubmitting}>{isSubmitting ? "Placing order..." : "Place order"}</button>
        </form>
        {message ? <p style={{ color: message.includes("successfully") ? "#267342" : "#c0392b" }}>{message}</p> : null}
      </div>

      <div className="card">
        <h3 className="section-title">Selected product</h3>
        {selectedProduct ? (
          <>
            <p style={{ marginTop: 0 }}><strong>{selectedProduct.name}</strong></p>
            <p className="muted">Category: {selectedProduct.category}</p>
            <p className="muted">Price: ₹{selectedProduct.price} / {selectedProduct.unit}</p>
            <p className="muted" style={{ marginBottom: 0 }}>Perfect for bulk retailer ordering with a scheduled delivery date.</p>
          </>
        ) : <p>No product selected.</p>}
      </div>
    </div>
  );
}
