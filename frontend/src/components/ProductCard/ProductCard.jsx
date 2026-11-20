import { Link } from "react-router-dom";
import "./ProductCard.css";

const PLACEHOLDER_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480"><rect width="640" height="480" fill="#e5e7eb"/><text x="320" y="250" text-anchor="middle" fill="#6b7280" font-family="sans-serif" font-size="28">Sin imagen</text></svg>',
)}`;

const priceFormatter = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
});

export default function ProductCard({ product, onDelete }) {
  return (
    <article className="product-card">
      <img
        className="product-card__image"
        src={product.image_url || PLACEHOLDER_IMAGE}
        alt={product.name}
      />
      <div className="product-card__body">
        <span className="product-card__category">
          {product.category?.name || "Sin categoría"}
        </span>
        <h3 className="product-card__title">{product.name}</h3>
        <p className="product-card__description">{product.description}</p>
        <p className="product-card__category-detail">
          {product.category?.description}
        </p>
        <div className="product-card__footer">
          <strong>{priceFormatter.format(Number(product.price))}</strong>
          <span>Stock: {product.stock}</span>
        </div>
        <div className="product-card__actions">
          <Link className="button button--secondary" to={`/products/${product.id}/edit`}>
            Editar
          </Link>
          <button
            className="button button--danger"
            type="button"
            onClick={() => onDelete(product)}
          >
            Eliminar
          </button>
        </div>
      </div>
    </article>
  );
}
