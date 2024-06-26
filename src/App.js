import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { SnackbarProvider, useSnackbar } from "notistack";
import { CookiesProvider } from "react-cookie";
import Products from "./pages/Products";
import ProductsAddNew from "./pages/ProductsAddNew";
import ProductsEdit from "./pages/ProductsEdit";
import Checkout from "./pages/Checkout";
import Cart from "./pages/Cart";
import Orders from "./pages/Order";
import PaymentVerify from "./pages/PaymentVerify";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Categories from "./pages/Categories";
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CookiesProvider defaultSetOptions={{ path: "/" }}>
        <SnackbarProvider
          maxSnack={3}
          autoHideDuration={1500}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Products />} />
              <Route path="/add" element={<ProductsAddNew />} />
              <Route path="/products/:id" element={<ProductsEdit />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/verify-payment" element={<PaymentVerify />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/categories" element={<Categories />} />
            </Routes>
          </BrowserRouter>
        </SnackbarProvider>
      </CookiesProvider>
    </QueryClientProvider>
  );
}

export default App;
