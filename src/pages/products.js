import ProductsCard from "../components/ProductCard";
import { Container, Grid, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

import { getProducts } from "../utils/api_products";
import { getCategories } from "../utils/api_categories";
import { useState } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";

export default function Products() {
  const [category, setCategory] = useState("all"); // store the selected category by users

  const { data: rows } = useQuery({
    queryKey: ["products", category],
    queryFn: () => getProducts(category),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  console.log(categories);

  return (
    <>
      <div style={{ paddingTop: "30px", paddingBottom: "10px" }}>
        <Typography variant="h2" textAlign={"center"}>
          Welcome to My Store
        </Typography>
        <hr />
      </div>
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
          <Button variant="contained" color="success" textAlign="start">
            Add New
          </Button>
        </Container>
        <Container maxWidth="xl">
          <FormControl sx={{ width: "150px", mb: 2 }}>
            <InputLabel>Category</InputLabel>
            <Select
              label="Category"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
              }}
            >
              <MenuItem value="all">All Categories</MenuItem>
              {categories.map((category) => {
                return (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Container>

        <ProductsCard
          type="products"
          rows={rows}
          //list
          categories={categories}
          // user choose
          category={category}
        />
      </Container>
    </>
  );
}
