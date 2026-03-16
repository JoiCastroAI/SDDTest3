import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import CompaniesPage from "./pages/CompaniesPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/companies" replace />} />
        <Route path="/companies" element={<CompaniesPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
