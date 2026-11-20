import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router-dom";
import CatalogPage from "./pages/CatalogPage/CatalogPage";
import ProductFormPage from "./pages/ProductFormPage/ProductFormPage";

export default function App() {
  return (
    <BrowserRouter>
      <header className="app-header">
        <div className="app-header__inner">
          <Link className="app-header__brand" to="/">
            E-commerce · Catálogo
          </Link>
          <nav>
            <Link to="/">Productos</Link>
            <Link to="/products/new">Nuevo producto</Link>
          </nav>
        </div>
      </header>
      <main className="app-main">
        <Routes>
          <Route path="/" element={<CatalogPage />} />
          <Route path="/products/new" element={<ProductFormPage />} />
          <Route path="/products/:id/edit" element={<ProductFormPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
