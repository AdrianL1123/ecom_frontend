import ProductsCard from "../../components/ProductCard";
import { Box, Container, Grid, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import { getProducts } from "../../utils/api_products";
import { getCategories } from "../../utils/api_categories";
import { useState } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
export default function Products() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { role } = currentUser;
  const navigate = useNavigate();
  const [category, setCategory] = useState("all"); // store the selected category by users
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(6);

  const { data: rows = [] } = useQuery({
    queryKey: ["products", category, perPage, page],
    queryFn: () => getProducts(category, perPage, page),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  return (
    <>
      <Header />
      <Container maxWidth="xl">
        <Container
          maxWidth="xl"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            paddingBottom: "20px",
          }}
        >
          <Typography variant="h5">Products</Typography>
          {role && role === "admin" ? (
            <Button
              variant="contained"
              color="success"
              textalign="start"
              onClick={() => {
                navigate("/add");
              }}
            >
              Add New
            </Button>
          ) : null}
        </Container>
        <Container maxWidth="xl">
          <FormControl sx={{ width: "150px", mb: 2 }}>
            <InputLabel>Category</InputLabel>
            <Select
              label="Category"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                // reset the page to 1
                setPage(1);
              }}
            >
              <MenuItem value="all">All Categories</MenuItem>
              {categories.map((category) => {
                return (
                  <MenuItem key={category._id} value={category._id}>
                    {category.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Container>
        <ProductsCard type="products" rows={rows} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            marginTop: "10px",
            padding: "20px 0",
          }}
        >
          <Button
            disabled={page === 1 ? true : false}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <span>Page: {page}</span>
          <Button
            disabled={rows.length === 0 ? true : false}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </Box>
      </Container>
    </>
  );
}
