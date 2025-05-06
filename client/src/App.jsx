import { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import React, { useMemo, lazy, Suspense } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { useSelector } from "react-redux";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import LoginPage from "./scenes/loginPage";
import HomePage from "./scenes/homePage";
import ProfilePage from "./scenes/supplier/profilePage";
import MyProductPage from "./scenes/supplier/myProductPage";
import AddProductPage from "./scenes/supplier/addProductPage";
import ProductDetail from "./scenes/productDetailPage";
import EmployeeProfilePage from "./scenes/employee/employeeprofilePage";
import PaymentPage from "./scenes/employee/paymentPage";
import PredictionPage from "./scenes/employee/predictionsPage";
import DeletePage from "./scenes/deletePage";
import Marketplace from "./scenes/employee/marketplace";
import Inventory from "./scenes/employee/inventory";
function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.token));
  return (
    <div className="App">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<LoginPage></LoginPage>}></Route>

            <Route
              path="/home"
              element={isAuth ? <HomePage /> : <Navigate to="/" />}
            />
            <Route
              path="/employee/:userId"
              element={
                isAuth ? (
                  <EmployeeProfilePage></EmployeeProfilePage>
                ) : (
                  <Navigate to="/" />
                )
              }
            ></Route>
            <Route
              path="/myproduct"
              element={
                isAuth ? <MyProductPage></MyProductPage> : <Navigate to="/" />
              }
            ></Route>
            <Route
              path="/products/:productId/product"
              element={
                isAuth ? <ProductDetail></ProductDetail> : <Navigate to="/" />
              }
            ></Route>

            <Route
              path="/pay"
              element={
                isAuth ? <PaymentPage></PaymentPage> : <Navigate to="/" />
              }
            ></Route>
            <Route
              path="/prediction"
              element={
                isAuth ? <PredictionPage></PredictionPage> : <Navigate to="/" />
              }
            ></Route>
            <Route
              path="/delete"
              element={isAuth ? <DeletePage></DeletePage> : <Navigate to="/" />}
            ></Route>
            <Route
              path="/marketplace"
              element={
                isAuth ? <Marketplace></Marketplace> : <Navigate to="/" />
              }
            ></Route>
            <Route
              path="/inventory"
              element={isAuth ? <Inventory></Inventory> : <Navigate to="/" />}
            ></Route>
            <Route
              path="/addProduct"
              element={
                isAuth ? <AddProductPage></AddProductPage> : <Navigate to="/" />
              }
            ></Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
