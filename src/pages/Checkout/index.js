import {
  Container,
  Typography,
  Box,
  Button,
  IconButton,
  Grid,
} from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
  Paper,
  TextField,
} from "@mui/material";
import Header from "../../components/Header";
import { displayCart, emptyCart } from "../../utils/api_cart";
import { addNewOrder } from "../../utils/api_orders";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCookies } from "react-cookie";

export default function Checkout() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const { enqueueSnackbar } = useSnackbar();
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { role, token } = currentUser;

  const { data: cart = [] } = useQuery({
    queryKey: ["cart"],
    queryFn: displayCart,
  });

  const addNewOrderMutation = useMutation({
    mutationFn: addNewOrder,
    onSuccess: (responseData) => {
      // remove all the items from the cart
      emptyCart();
      // get the billplz url (responseData.billplz_url)
      const billplz_url = responseData.billplz_url;
      //redirect user to billplz payment page
      window.location.href = billplz_url;
    },
    onError: (error) => {
      enqueueSnackbar(error.response.data.message, {
        variant: "error",
      });
    },
  });

  const handleCheckout = () => {
    if (name == "" || email === "") {
      enqueueSnackbar("Please fill up all the fields", {
        variant: "error",
      });
    } else if (!(cart && cart.length > 0)) {
      enqueueSnackbar("Your cart is empty", {
        variant: "error",
      });
    } else {
      //* perform the checkout process
      addNewOrderMutation.mutate({
        customerName: name,
        customerEmail: email,
        products: cart,
        totalPrice: totalInCart(),
        token: token,
      });
    }
  };

  const totalInCart = () => {
    let total = 0;
    cart.forEach((cart) => {
      total += cart.price * cart.quantity;
    });
    return total.toFixed(2);
  };

  return (
    <Container>
      <Header />
      <Grid
        container
        spacing={5}
        sx={{
          paddingTop: "20px",
          flexDirection: {
            xs: "column-reverse",
            sm: "column-reverse",
            md: "row",
          },
        }}
      >
        <Grid item lg={6} xs={12}>
          <Typography
            variant="h5"
            align="center"
            sx={{ paddingTop: "20px", paddingBottom: "20px" }}
          >
            Contact Information
          </Typography>
          <Typography>Name *</Typography>
          <TextField
            placeholder="Name"
            variant="outlined"
            disabled
            fullWidth
            value={currentUser.name}
            onChange={(e) => setName(e.target.value)}
          />
          <Typography sx={{ paddingTop: "30px" }}>Email *</Typography>
          <TextField
            placeholder="email address"
            variant="outlined"
            fullWidth
            disabled
            value={currentUser.email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            variant="contained"
            fullWidth
            sx={{ marginTop: "30px" }}
            onClick={handleCheckout}
          >
            Pay ${totalInCart()} now
          </Button>
        </Grid>
        <Grid item lg={6} xs={12}>
          <Typography variant="h6" sx={{ paddingTop: "30px" }}>
            Your order summary
          </Typography>
          {/* .map here */}
          {cart.map((item) => (
            <div
              key={item._id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: "20px",
              }}
            >
              <Typography>{item.name}</Typography>
              <Typography>
                ${(item.price * item.quantity).toFixed(2)}
              </Typography>
            </div>
          ))}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "30px",
            }}
          >
            <Typography variant="h6">Total</Typography>
            <Typography variant="h6">${totalInCart()}</Typography>
          </div>
        </Grid>
      </Grid>
    </Container>
  );
}
