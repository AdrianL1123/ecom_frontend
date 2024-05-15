import { Typography, Divider, Box, Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

export default function Header() {
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
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
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
      <Divider />
    </>
  );
}
