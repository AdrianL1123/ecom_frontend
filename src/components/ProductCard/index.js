import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Chip, Grid, Container } from "@mui/material";
export default function ProductsCard(props) {
  const { rows = [] } = props;
  return (
    <>
      <Container maxWidth="xl">
        <Grid container spacing={2}>
          {rows.map((row) => (
            <Grid item lg={4} md={6} xs={12}>
              <Card>
                <CardContent>
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
                      color="info"
                      sx={{ padding: "5px" }}
                      label={`MYR ${row.price}`}
                    ></Chip>
                    <Chip
                      sx={{ padding: "5px" }}
                      size="small"
                      color="warning"
                      label={row.category}
                    ></Chip>
                  </CardActions>
                  <Typography variant="body2">
                    <Button
                      size="big"
                      variant="contained"
                      color="primary"
                      fullWidth
                    >
                      Add to cart
                    </Button>
                  </Typography>
                  <CardActions
                    sx={{
                      justifyContent: "center",
                      justifyContent: "space-between",
                      paddingTop: "20px",
                    }}
                  >
                    <Button size="small" variant="contained" color="primary">
                      Edit
                    </Button>
                    <Button size="small" variant="contained" color="error">
                      Delete
                    </Button>
                  </CardActions>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}
