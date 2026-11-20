import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ProductForm from "../../components/ProductForm/ProductForm";
import { categoryService } from "../../services/categoryService";
import { productService } from "../../services/productService";
import "./ProductFormPage.css";

export default function ProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState(isEdit ? "loading" : "ready");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([
      categoryService.list(),
      isEdit ? productService.get(id) : Promise.resolve(null),
    ])
      .then(([categoryData, productData]) => {
        if (!active) return;
        setCategories(categoryData);
        setProduct(productData);
        setStatus("ready");
      })
      .catch(() => {
        if (!active) return;
        setStatus("error");
        setError("No se pudieron cargar los datos del formulario.");
      });
    return () => {
      active = false;
    };
  }, [id, isEdit]);

  const handleSubmit = async (payload) => {
    setIsSaving(true);
    setError("");
    try {
      if (isEdit) {
        await productService.update(id, payload);
      } else {
        await productService.create(payload);
      }
      navigate("/", { replace: true });
    } catch {
      setError("No se pudo guardar el producto. Revisa los datos e inténtalo de nuevo.");
    } finally {
      setIsSaving(false);
    }
  };

  if (status === "loading") return <p className="product-form-page__status">Cargando...</p>;

  if (status === "error") {
    return (
      <div className="product-form-page__status">
        <p className="product-form-page__error">{error}</p>
        <Link className="button button--secondary" to="/">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  return (
    <section className="product-form-page">
      <h1>{isEdit ? "Editar producto" : "Nuevo producto"}</h1>
      <ProductForm
        product={product}
        categories={categories}
        onSubmit={handleSubmit}
        isSaving={isSaving}
        error={error}
      />
      <Link className="product-form-page__back" to="/">
        ← Volver al catálogo
      </Link>
    </section>
  );
}
