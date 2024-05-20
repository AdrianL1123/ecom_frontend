import { Typography, Divider, Box, Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { emptyCart } from "../../utils/api_cart";

export default function Header() {
  const [cookies, removeCookie] = useCookies(["currentUser"]);
  //* setCookies will not be used in header component thats why we dont need it
  const { currentUser } = cookies;
  const location = useLocation();
  const navigate = useNavigate();

  let pageTitle = "Welcome to My Store";

  if (location.pathname === "/cart") {
    pageTitle = "Cart";
  } else if (location.pathname === "/checkout") {
    pageTitle = "Checkout";
  } else if (location.pathname === "/orders") {
    pageTitle = "My Orders";
  } else if (location.pathname === "/login") {
    pageTitle = "Login to Your Account";
  } else if (location.pathname === "/signup") {
    pageTitle = "Create a New Account";
  }

  const handleLogout = () => {
    //* remove the currentUser cookie
    removeCookie("currentUser");
    //* empty the cart
    emptyCart();
    //* redirect back to home
    navigate("/login");
  };

  return (
    <>
      <Typography
        variant="h6"
        component="div"
        sx={{
          textAlign: "center",
          marginTop: "20px",
          marginBottm: "20px",
          fontWeight: "bold",
          fontSize: "40px",
        }}
      >
        {pageTitle}
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <Box sx={{ display: "flex" }}>
          <Button
            onClick={() => {
              navigate("/");
            }}
          >
            Home
          </Button>
          <Button
            onClick={() => {
              navigate("/cart");
            }}
          >
            Cart
          </Button>
          <Button
            onClick={() => {
              navigate("/orders");
            }}
          >
            My Orders
          </Button>
          {currentUser && currentUser.role === "admin" ? (
            <Button
              onClick={() => {
                navigate("/categories");
              }}
            >
              Categories
            </Button>
          ) : null}
        </Box>
        {currentUser ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span>Current User: {currentUser.name}</span>
            <Button onClick={handleLogout}>Log Out</Button>
          </Box>
        ) : (
          <Box sx={{ display: "flex" }}>
            <Button
              onClick={() => {
                navigate("/login");
              }}
            >
              Login
            </Button>

            <Button
              onClick={() => {
                navigate("/signup");
              }}
            >
              Signup
            </Button>
          </Box>
        )}
      </Box>
      <Divider />
    </>
  );
}
