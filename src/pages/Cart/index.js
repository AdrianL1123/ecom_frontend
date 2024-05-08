import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import {
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableBody,
  Container,
  Button,
  Box,
  Typography,
} from "@mui/material";

import { displayCart, removeItemFromCart } from "../../utils/api_cart";
import Header from "../../components/Header";

export default function Cart() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const { data: carts = [] } = useQuery({
    queryKey: ["cart"],
    queryFn: () => displayCart(),
  });
  console.log(carts);

  const totalInCart = () => {
    let total = 0;
    carts.forEach((cart) => {
      total += cart.price * cart.quantity;
    });
    return total;
  };

  const deleteCartItemMutation = useMutation({
    mutationFn: removeItemFromCart,
    onSuccess: () => {
      // display success message
      enqueueSnackbar("Cart item has been successfully deleted", {
        variant: "success",
      });
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
      // cheating method
      // windows.location = "/";
    },
    onError: (error) => {
      // display error message
      enqueueSnackbar(error.response.data.message, {
        variant: "error",
      });
    },
  });

  const handleRemoveFromCart = (_id) => {
    const answer = window.confirm(
      "Are you sure you want to remove this product from your cart ?"
    );
    if (answer) {
      deleteCartItemMutation.mutate(_id);
    }
  };

  return (
    <Container style={{ maxWidth: "700px", paddingTop: "20px" }}>
      <Header />
      <Container>
        <TableContainer
          component={Paper}
          sx={{ maxWidth: "700px", marginTop: "50px" }}
        >
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Product</TableCell>
                <TableCell>Price</TableCell>
                <TableCell align="center">Quantity</TableCell>
                <TableCell>Total</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            {carts.length > 0 ? (
              <TableBody>
                {carts.map((cart) => (
                  <TableRow key={cart._id}>
                    <TableCell align="center">{cart.name}</TableCell>
                    <TableCell align="center">${cart.price}</TableCell>
                    <TableCell align="center">{cart.quantity}</TableCell>
                    <TableCell>
                      ${(cart.price * cart.quantity).toFixed(2)}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        color="error"
                        onClick={() => {
                          handleRemoveFromCart(cart._id);
                        }}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} align="right">
                    <Typography variant="h6">Total:</Typography>
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    ${totalInCart().toFixed(2)}
                  </TableCell>
                  <TableCell align="center"></TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography variant="h6">
                      No items added to cart yet.
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>
        </TableContainer>
        <Box align="center" sx={{ paddingTop: "20px" }}>
          <Button
            variant="contained"
            onClick={() => {
              navigate("/checkout");
            }}
          >
            Checkout
          </Button>
        </Box>
      </Container>
    </Container>
  );
}
