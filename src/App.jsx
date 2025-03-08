import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/home/HomePage.jsx";
import CategoryPage from "./pages/category/CategoryPage";
import EmployeePage from "./pages/employee/EmployeePage";
import CostomerPage from "./pages/costomer/CostomerPage.jsx";
import MasterLayout from "./components/layout/MasterLayout.jsx";
import MasterLayoutAuth from "./components/layout/MasterLayoutAuth.jsx";
import LoginPage from "./pages/auth/LoginPage.jsx";
import RegisterPage from "./pages/auth/RegisterPage.jsx";
import UserPage from "./pages/user/UserPage.jsx";
import RolePage from "./pages/role/RolePage.jsx";
import SupplierPage from "./pages/supplier/SupplierPage.jsx";
import ProductPage from "./pages/product/ProductPage.jsx";


const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>

          <Route element={<MasterLayout/>}>
            <Route path="/" element={<HomePage />} />
            <Route path="product/category" element={<CategoryPage />} />
            <Route path="/employee" element={<EmployeePage />} />
            <Route path="/customer" element={<CostomerPage />} />
            <Route path="/user" element={<UserPage />} />
            <Route path="/role" element={<RolePage />} />
            <Route path="/supplier" element={<SupplierPage />} />
            <Route path="/product" element={<ProductPage />} />
            <Route path="*" element={<h1>404-Page Not found</h1>} />
            
          </Route>

          <Route element={<MasterLayoutAuth/>}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
