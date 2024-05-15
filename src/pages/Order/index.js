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
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import { getOrders, deleteOrder, updateOrder } from "../../utils/api_orders";
import Header from "../../components/Header";

export default function Orders() {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const { data: orders = [] } = useQuery({
    queryKey: ["order"],
    queryFn: () => getOrders(),
  });

  const deleteOrderMutation = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      // display success message
      enqueueSnackbar("Order has been successfully deleted", {
        variant: "success",
      });
      queryClient.invalidateQueries({
        queryKey: ["order"],
      });
    },
    onError: (error) => {
      // display error message
      enqueueSnackbar(error.response.data.message, {
        variant: "error",
      });
    },
  });

  const handleRemoveOrder = (_id) => {
    const answer = window.confirm(
      "Are you sure you want to remove this order?"
    );
    if (answer) {
      deleteOrderMutation.mutate(_id);
    }
  };

  const updateOrderMutation = useMutation({
    mutationFn: updateOrder,
    onSuccess: () => {
      // display success message
      enqueueSnackbar("Order has been successfully updated", {
        variant: "success",
      });
      queryClient.invalidateQueries({
        queryKey: ["order"],
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

  const handleUpdateOrder = (order, status) => {
    updateOrderMutation.mutate({
      ...order,
      status: status,
    });
  };

  return (
    <>
      <Container align="center">
        <Header />
        <TableContainer
          component={Paper}
          sx={{ maxWidth: "1200px", marginTop: "50px" }}
          align="center"
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="left">Customer</TableCell>
                <TableCell>Products</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Payment Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            {orders.length > 0 ? (
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>
                      {order.customerName}
                      <br />({order.customerEmail})
                    </TableCell>

                    <TableCell>
                      {order.products.map((product) => (
                        <Typography variant="p" display={"flex"}>
                          {product.name} ({product.quantity})
                        </Typography>
                      ))}
                    </TableCell>

                    <TableCell>${order.totalPrice}</TableCell>

                    <TableCell>
                      <Select
                        fullWidth
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={order.status}
                        label="status"
                        disabled={order.status === "pending"}
                        onChange={(e) => {
                          handleUpdateOrder(order, e.target.value);
                        }}
                      >
                        <MenuItem value={"paid"}>Paid</MenuItem>
                        <MenuItem value={"pending"}>Pending</MenuItem>
                        <MenuItem value={"failed"}>Failed</MenuItem>
                        <MenuItem value={"completed"}>Completed</MenuItem>
                      </Select>
                    </TableCell>

                    <TableCell>{order.paid_at}</TableCell>
                    <TableCell align="right">
                      {order.status === "pending" && (
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => {
                            handleRemoveOrder(order._id);
                          }}
                        >
                          Remove
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            ) : (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography variant="h6">No orders added yet.</Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>
        </TableContainer>
      </Container>
    </>
  );
}
