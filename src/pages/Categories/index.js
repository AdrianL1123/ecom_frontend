import {
  Divider,
  Typography,
  TextField,
  Button,
  Container,
  Table,
  TableHead,
  TableContainer,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import Header from "../../components/Header";

import {
  getCategories,
  addNewCategories,
  deleteCategory,
  updateCategory,
} from "../../utils/api_categories";

import { useSnackbar } from "notistack";
import { useCookies } from "react-cookie";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function Categories() {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { role, token } = currentUser;

  const [name, setName] = useState("");

  const { data: categories = [] } = useQuery({
    queryKey: ["categories", token],
    queryFn: () => getCategories(token),
  });

  const addNewCategoriesMutation = useMutation({
    mutationFn: addNewCategories,
    onSuccess: () => {
      enqueueSnackbar("Category added.", {
        variant: "success",
      });
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
      setName("");
    },
    onError: (error) => {
      enqueueSnackbar(error.response.data.message, {
        variant: "error",
      });
    },
  });
  const handleAddCategory = () => {
    if (name === "") {
      enqueueSnackbar("Please fill in the details.", {
        variant: "warning",
      });
    } else {
      addNewCategoriesMutation.mutate({ name, token });
    }
  };

  const deleteCategoryMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      // display success message
      enqueueSnackbar("Category has been successfully deleted", {
        variant: "success",
      });
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
    onError: (error) => {
      // display error message
      enqueueSnackbar(error.response.data.message, {
        variant: "error",
      });
    },
  });

  const handleDeleteCategory = (_id) => {
    const answer = window.confirm(
      "Are you sure you want to remove this order?"
    );
    if (answer) {
      deleteCategoryMutation.mutate({ name, token, _id });
    }
  };

  return (
    <>
      <Header />
      <Container>
        <Typography variant="h4">Categories</Typography>
        <Divider />
        <Container
          style={{ display: "flex", paddingTop: "20px", paddingBottom: "20px" }}
        >
          <TextField
            placeholder="Category Name"
            type="text"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <Button variant="contained" onClick={handleAddCategory}>
            Add
          </Button>
        </Container>
        <Divider />
        {categories.length > 0 ? (
          <TableContainer sx={{ maxWidth: "1200px" }} align="center">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="left">Name</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.map((c) => (
                  <TableRow key={c._id}>
                    <TableCell align="left">{c.name}</TableCell>
                    <TableCell align="right">
                      <Button variant="contained" color="primary">
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                          handleDeleteCategory(c._id);
                        }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Container style={{ paddingTop: "20px" }}>
            <Typography variant="h6" align="center">
              No Categories added yet.
            </Typography>
          </Container>
        )}
      </Container>
    </>
  );
}
