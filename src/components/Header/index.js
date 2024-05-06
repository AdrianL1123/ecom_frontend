import { Typography, Divider } from "@mui/material";

export default function Header() {
  return (
    <>
      <Typography
        variant="h6"
        component="div"
        sx={{
          textAlign: "center",
          marginTop: "20px",
          fontWeight: "bold",
          fontSize: "40px",
        }}
      >
        Welcome to My Store
      </Typography>
      <Divider />
    </>
  );
}
