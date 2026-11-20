import { useEffect, useState } from "react";
import "./ProductForm.css";

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  stock: "0",
  category_id: "",
};

export default function ProductForm({ product, categories, onSubmit, isSaving, error }) {
  const [values, setValues] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    setValues(
      product
        ? {
            name: product.name,
            description: product.description || "",
            price: product.price,
            stock: String(product.stock),
            category_id: String(product.category?.id ?? ""),
          }
        : EMPTY_FORM,
    );
    setImageFile(null);
  }, [product]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = new FormData();
    Object.entries(values).forEach(([key, value]) => payload.append(key, value));
    if (imageFile) payload.append("image", imageFile);
    onSubmit(payload);
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <label className="product-form__field">
        Nombre
        <input
          name="name"
          value={values.name}
          onChange={handleChange}
          required
          maxLength={150}
        />
      </label>

      <label className="product-form__field">
        Descripción
        <textarea
          name="description"
          value={values.description}
          onChange={handleChange}
          rows={3}
        />
      </label>

      <div className="product-form__row">
        <label className="product-form__field">
          Precio
          <input
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={values.price}
            onChange={handleChange}
            required
          />
        </label>

        <label className="product-form__field">
          Existencias
          <input
            name="stock"
            type="number"
            min="0"
            step="1"
            value={values.stock}
            onChange={handleChange}
            required
          />
        </label>
      </div>

      <label className="product-form__field">
        Categoría
        <select
          name="category_id"
          value={values.category_id}
          onChange={handleChange}
          required
        >
          <option value="">Selecciona una categoría</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>

      <label className="product-form__field">
        Imagen {product?.image_url && "(deja vacío para conservar la actual)"}
        <input
          type="file"
          accept="image/*"
          onChange={(event) => setImageFile(event.target.files?.[0] || null)}
        />
      </label>

      {error && <p className="product-form__error">{error}</p>}

      <button className="button button--primary" type="submit" disabled={isSaving}>
        {isSaving ? "Guardando..." : product ? "Guardar cambios" : "Crear producto"}
      </button>
    </form>
  );
}
