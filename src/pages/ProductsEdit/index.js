import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import Header from "../../components/Header";
import {
  Typography,
  Button,
  Grid,
  Container,
  Card,
  CardContent,
  TextField,
} from "@mui/material";
import { getProduct, updateProduct } from "../../utils/api_products";
import { uploadImage } from "../../utils/api_images";

export default function ProductsEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");

  // get data from product api: /products/:id
  const {
    data: row,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProduct(id),
  });

  // when data is fetched from API, set the states for all the fields with its current value
  useEffect(() => {
    // if product is not undefined
    if (row) {
      setName(row.name);
      setDescription(row.description);
      setPrice(row.price);
      setCategory(row.category);
      setImage(row.image ? row.image : "");
    }
  }, [row]);

  const updateProductMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      //* redrect to home page
      navigate("/");
      enqueueSnackbar("Product has been successfully edited.", {
        variant: "success",
      });
    },
    onError: (error) => {
      // display error message
      enqueueSnackbar(error.response.data.message, {
        variant: "error",
      });
    },
  });

  const handleFormSubmit = (event) => {
    event.preventDefault();
    // trigger the mutation to call the API
    updateProductMutation.mutate({
      id: id,
      name: name,
      description: description,
      price: price,
      category: category,
      image: image,
    });
  };

  // upload image mutation
  const uploadImageMutation = useMutation({
    mutationFn: uploadImage,
    onSuccess: (data) => {
      setImage(data.image_url);
    },
    onError: (error) => {
      // display error message
      enqueueSnackbar(error.response.data.message, {
        variant: "error",
      });
    },
  });

  const handleImageUpload = (event) => {
    uploadImageMutation.mutate(event.target.files[0]);
  };
  // if API data haven't return yet
  if (isLoading) {
    return <Container>Loading...</Container>;
  }

  // if there is an error in API call
  if (error) {
    return <Container>{error.response.data.message}</Container>;
  }

  return (
    <Container>
      <Header />
      <Card>
        <CardContent>
          <Typography
            variant="h4"
            sx={{
              margin: "20px 0",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Edit Product
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Price"
                variant="outlined"
                fullWidth
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Category"
                variant="outlined"
                fullWidth
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              {image !== "" ? (
                <>
                  <div>
                    <img
                      src={"http://localhost:8888/" + image}
                      width="300px"
                      height="300px"
                    />
                  </div>
                  <Button onClick={() => setImage("")}>Remove Image</Button>
                </>
              ) : (
                <input
                  type="file"
                  multiple={false}
                  onChange={handleImageUpload}
                />
              )}
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" fullWidth onClick={handleFormSubmit}>
                Update
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
}
