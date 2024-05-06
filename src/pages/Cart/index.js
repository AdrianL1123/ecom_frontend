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
export default function Cart() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const { data: carts = [] } = useQuery({
    queryKey: ["carts"],
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
        queryKey: ["carts"],
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

  return (
    <Container
      style={{
        maxWidth: "700px",
        paddingTop: "20px",
      }}
    >
      <Box align="center">
        <h1 className="h1">Cart</h1>
      </Box>

      <Container align="center">
        <Button
          onClick={() => {
            navigate("/");
          }}
        >
          Home
        </Button>
        <Button variant="disabled">Cart</Button>
      </Container>

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
                <TableCell align="center">Quatity</TableCell>
                <TableCell>Total</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            {carts.length > 0 ? (
              <TableBody>
                {carts.map((cart) => (
                  <TableRow key={cart._id}>
                    <TableCell align="center">{cart.name}</TableCell>
                    <TableCell align="center">{cart.price}</TableCell>
                    <TableCell align="center">{cart.quantity}</TableCell>
                    <TableCell>{cart.price * cart.quantity}</TableCell>
                    <TableCell align="center">
                      <Button
                        color="error"
                        onClick={() => {
                          const answer = window.confirm(
                            "Are you sure you want to remove this product from your cart ?"
                          );
                          if (answer) {
                            deleteCartItemMutation.mutate(cart._id);
                          } else {
                          }
                        }}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell align="center">{}</TableCell>
                  <TableCell align="center">{}</TableCell>
                  <TableCell align="center">{}</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    ${totalInCart()}
                  </TableCell>
                  <TableCell align="center"></TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableRow>
                <Typography variant="h6">
                  No items added to cart yet.
                </Typography>
              </TableRow>
            )}
          </Table>
        </TableContainer>
      </Container>
      <Box align="center" sx={{ paddingTop: "20px" }}>
        <Button variant="contained">Checkout</Button>
      </Box>
    </Container>
  );
}
