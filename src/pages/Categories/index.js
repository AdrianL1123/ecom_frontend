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
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

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
  const [openEditModal, setOpenEditModal] = useState(false);
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { role, token } = currentUser;

  const [name, setName] = useState("");
  const [editName, setEditName] = useState("");
  const [editNameID, setEditNameID] = useState("");

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

  const updateCategoryMutation = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      // display success message
      enqueueSnackbar("Category has been updated successfully.", {
        variant: "success",
      });
      // reset the categories data
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
      // close modal
      setOpenEditModal(false);
    },
    onError: (error) => {
      // display error message
      enqueueSnackbar(error.response.data.message, {
        variant: "error",
      });
    },
  });

  return (
    <>
      <Header />
      <Container style={{ paddingTop: "20px" }}>
        <Typography variant="h4">Categories</Typography>
        <Container
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "10px",
            padding: "20px",
            marginBottom: "20px",
          }}
        >
          <TextField
            label="Category Name"
            type="text"
            variant="outlined"
            sx={{ width: "100%" }}
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
                  <TableCell width={"70%"}>Name</TableCell>
                  <TableCell align="left">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.map((c) => (
                  <TableRow key={c._id}>
                    <TableCell width={"70%"}>{c.name}</TableCell>
                    <TableCell align="left">
                      <Button
                        variant="contained"
                        color="info"
                        onClick={() => {
                          // open the edit modal
                          setOpenEditModal(true);
                          // set the edit category field to its name as value
                          setEditName(c.name);
                          // set the edit category id so that we know wh
                          setEditNameID(c._id);
                        }}
                      >
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
        <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)}>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogContent>
            <TextField
              placeholder="Category"
              variant="outlined"
              sx={{ width: "100%" }}
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="success"
              onClick={() => {
                setOpenEditModal(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="success"
              value={editName}
              onClick={() => {
                updateCategoryMutation.mutate({
                  _id: editNameID,
                  name: editName,
                  token: token,
                });
              }}
            >
              Edit
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}
