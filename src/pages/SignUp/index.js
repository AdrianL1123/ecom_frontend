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
import { getSignUp } from "../../utils/api_signup";

export default function SignUp() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  //mutation here
  const SignUpMutation = useMutation({
    mutationFn: getSignUp,
    onSuccess: (data) => {
      // if API call is success, do what?
      navigate("/login");
      enqueueSnackbar("Sign Up Success, Now log in !!!", {
        variant: "success",
      });
      console.log(data);
    },
    onError: (error) => {
      // if API call is error, do what?
      enqueueSnackbar(error.response.data.message, {
        variant: "error",
      });
    },
  });
  //handle mutation function here
  const handleSignUp = (e) => {
    if (confirmPassword !== password) {
      enqueueSnackbar("Password is not matched !!", {
        variant: "error",
      });
    } else {
      e.preventDefault();
      SignUpMutation.mutate({
        name: name,
        email: email,
        password: password,
      });
    }
  };

  return (
    <>
      <Header />
      <Container maxWidth="sm">
        <Card
          sx={{
            marginTop: "30px",
          }}
        >
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography>Name</Typography>
                <TextField
                  placeholder="Name"
                  type="text"
                  variant="outlined"
                  fullWidth
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Grid>
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
                  type="text"
                  variant="outlined"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography>Confirm Password</Typography>
                <TextField
                  placeholder="confirm password"
                  type="text"
                  variant="outlined"
                  fullWidth
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" fullWidth onClick={handleSignUp}>
                  Sign up
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}
