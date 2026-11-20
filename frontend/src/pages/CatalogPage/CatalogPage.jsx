import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CategoryFilter from "../../components/CategoryFilter/CategoryFilter";
import ProductCard from "../../components/ProductCard/ProductCard";
import { categoryService } from "../../services/categoryService";
import { productService } from "../../services/productService";
import "./CatalogPage.css";

export default function CatalogPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    categoryService
      .list()
      .then((data) => {
        if (active) setCategories(data);
      })
      .catch(() => {
        // The catalog can still be rendered without the category filter.
      });
    return () => {
      active = false;
    };
  }, []);

  const loadProducts = useCallback(async () => {
    setStatus("loading");
    setError("");
    try {
      setProducts(await productService.list({ category: selectedCategory }));
      setStatus("ready");
    } catch {
      setError("No se pudo cargar el catálogo. Comprueba que la API esté activa.");
      setStatus("error");
    }
  }, [selectedCategory]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleDelete = async (product) => {
    if (!window.confirm(`¿Eliminar "${product.name}"?`)) return;
    try {
      await productService.remove(product.id);
      await loadProducts();
    } catch {
      setError("No se pudo eliminar el producto.");
    }
  };

  return (
    <section className="catalog">
      <div className="catalog__header">
        <div>
          <h1>Catálogo de productos</h1>
          <p className="catalog__subtitle">Productos, precios y categorías desde la API.</p>
        </div>
        <Link className="button button--primary" to="/products/new">
          Nuevo producto
        </Link>
      </div>

      <CategoryFilter
        categories={categories}
        value={selectedCategory}
        onChange={setSelectedCategory}
      />

      {status === "loading" && <p className="catalog__status">Cargando productos...</p>}

      {status === "error" && (
        <div className="catalog__status">
          <p className="catalog__error">{error}</p>
          <button className="button button--secondary" type="button" onClick={loadProducts}>
            Reintentar
          </button>
        </div>
      )}

      {status === "ready" && products.length === 0 && (
        <p className="catalog__status">No hay productos para esta categoría.</p>
      )}

      {status === "ready" && products.length > 0 && (
        <div className="catalog__grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </section>
  );
}
