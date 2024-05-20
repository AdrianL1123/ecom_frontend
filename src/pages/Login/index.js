import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
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
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar, useSnackbar } from "notistack";
import { useCookies } from "react-cookie";
import { getLogin } from "../../utils/api_login";

export default function Login() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [cookies, setCookie] = useCookies(["currentUser"]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //mutation here
  const loginMutation = useMutation({
    mutationFn: getLogin,
    onSuccess: (data) => {
      //* save current User data
      setCookie("currentUser", data, { maxAge: 60 * 60 * 24 * 30 });
      // 3600 = 1 hour in seconds
      // 60 * 60 * 24 * 30 = 1 month
      navigate("/");
      enqueueSnackbar("Succesfully Logged In !", {
        variant: "success",
      });
    },
    onError: (error) => {
      // if API call is error, do what?
      enqueueSnackbar(error.response.data.message, {
        variant: "error",
      });
    },
  });
  //handle mutation function here
  const handleLogin = (e) => {
    if (email === "" || password === "") {
      enqueueSnackbar("Please fill in the details", {
        variant: "warning",
      });
    } else {
      e.preventDefault();
      loginMutation.mutate({
        email: email,
        password: password,
      });
    }
  };

  return (
    <>
      <Header />
      <Container maxWidth="sm">
        <Card sx={{ marginTop: "40px" }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography>Email</Typography>
                <TextField
                  placeholder="Email"
                  type="email"
                  variant="outlined"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography>Password</Typography>
                <TextField
                  placeholder="password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" fullWidth onClick={handleLogin}>
                  Login
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}
