export default function ProductList({ products = [] }) {
  return (
    <div className="grid grid-3">
      {products.map((product) => (
        <div className="card" key={product._id}>
          <div className="row space-between">
            <strong>{product.name}</strong>
            <span>{product.category}</span>
          </div>
          <p className="product-price">₹{product.price} / {product.unit}</p>
          <p className="muted" style={{ marginBottom: 0 }}>Fresh {product.category.toLowerCase()} supply for retailers.</p>
        </div>
      ))}
    </div>
  );
}
