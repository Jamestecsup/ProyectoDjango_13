import "./CategoryFilter.css";

export default function CategoryFilter({ categories, value, onChange }) {
  return (
    <label className="category-filter">
      Filtrar por categoría
      <select
        className="category-filter__select"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">Todas las categorías</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    </label>
  );
}
