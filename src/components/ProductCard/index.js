import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Chip, Grid, Container } from "@mui/material";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { deleteProduct } from "../../utils/api_products";
import { useSnackbar } from "notistack";
import { useCookies } from "react-cookie";
import { addToCart } from "../../utils/api_cart";

export default function ProductsCard(props) {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { role, token } = currentUser;
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const { rows = [] } = props;

  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      // display success message
      enqueueSnackbar("Product has been successfully deleted", {
        variant: "success",
      });
      queryClient.invalidateQueries({
        queryKey: ["products"],
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

  const addToCartMutation = useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      // display success message
      enqueueSnackbar("Product has been added to cart successfully.", {
        variant: "success",
      });
      //* reset the card data
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
    onError: (error) => {
      // display error message
      enqueueSnackbar(error.response.data.message, {
        variant: "error",
      });
    },
  });
  const handleCartSubmit = (row) => {
    // console.log(row);
    addToCartMutation.mutate(row);
  };

  return (
    <>
      <Container maxWidth="xl">
        <Grid container spacing={2}>
          {rows.map((row) => (
            <Grid key={row._id} item lg={4} md={6} xs={12}>
              <Card>
                <CardContent>
                  <img
                    src={
                      "http://localhost:8888/" +
                      (row.image && row.image !== ""
                        ? row.image
                        : "uploads/default_image.png")
                    }
                    style={{
                      width: "100%",
                      height: "auto",
                    }}
                  />
                  <Typography variant="h6" gutterBottom>
                    {row.name}
                  </Typography>
                  <CardActions
                    sx={{
                      justifyContent: "center",
                      justifyContent: "space-between",
                      paddingBottom: "20px",
                    }}
                  >
                    <Chip
                      size="small"
                      style={{ backgroundColor: "#EBFBEE", color: "#6ACF7E" }}
                      sx={{ padding: "5px" }}
                      label={`$ ${row.price}`}
                    ></Chip>
                    <Chip
                      sx={{ padding: "5px" }}
                      size="small"
                      style={{ backgroundColor: "#FFF4E6", color: "#FD882B" }}
                      label={
                        row.category && row.category.name
                          ? row.category.name
                          : ""
                      }
                    ></Chip>
                  </CardActions>
                  <Typography variant="body2">
                    <Button
                      size="big"
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={() => {
                        if (currentUser && currentUser.email) {
                          handleCartSubmit(row);
                        } else {
                          enqueueSnackbar("Please login in first !", {
                            variant: "warning",
                          });
                        }
                      }}
                    >
                      Add to cart
                    </Button>
                  </Typography>
                  {role && role === "admin" ? (
                    <CardActions
                      sx={{
                        justifyContent: "center",
                        justifyContent: "space-between",
                        paddingTop: "20px",
                      }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        style={{ borderRadius: "17px" }}
                        onClick={() => {
                          navigate("/products/" + row._id);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        style={{ borderRadius: "17px" }}
                        onClick={() => {
                          const confirm = window.confirm(
                            "Are you sure you want to delete this product ?"
                          );
                          if (confirm) {
                            deleteProductMutation.mutate({
                              id: row._id,
                              token: token,
                            });
                          } else {
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </CardActions>
                  ) : null}
                </CardContent>
              </Card>
            </Grid>
          ))}
          {rows.length === 0 ? (
            <Grid item xs={12}>
              <Typography align="center" sx={{ padding: "10px 0" }}>
                No Items found.
              </Typography>
            </Grid>
          ) : null}
        </Grid>
      </Container>
    </>
  );
}
