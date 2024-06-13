import * as React from "react";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

import { styleModalEnd } from "../MainMapStyle";
import { styleSetFazaLook, styleFazaLook01 } from "./GsComponentsStyle";
import { styleFazaLook02 } from "./GsComponentsStyle";

let history: any = null;

const GsLookFaza = (props: { setOpen: Function; history: any }) => {
  const [openSetMode, setOpenSetMode] = React.useState(true);

  history = props.history;

  const handleCloseSetEnd = () => {
    props.setOpen(false);
    setOpenSetMode(false);
  };

  const StrokaHeader = (xss: number, soob: string) => {
    return (
      <Grid item xs={xss} sx={{ textAlign: "center" }}>
        <b>{soob}</b>
      </Grid>
    );
  };

  const StrokaTabl = () => {
    let resStr: any = [];
    for (let i = 0; i < history.state.length; i++) {
      resStr.push(
        <Grid
          key={i}
          container
          sx={{
            fontSize: 14.4,
            marginTop: 1,
            textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
          }}
        >
          <Grid item xs={8.3} sx={{ paddingLeft: 1 }}>
            {history.state[i].description}
          </Grid>
          <Grid item xs sx={{ textAlign: "center" }}>
            {history.state[i].phase}
          </Grid>
        </Grid>
      );
    }
    return resStr;
  };

  return (
    <Modal open={openSetMode} onClose={handleCloseSetEnd} hideBackdrop>
      <Box sx={styleSetFazaLook}>
        <Button sx={styleModalEnd} onClick={handleCloseSetEnd}>
          <b>&#10006;</b>
        </Button>

        <Grid container sx={{ marginTop: 1 }}>
          <Grid item xs sx={styleFazaLook01}>
            <b>{history.description}</b>
          </Grid>
        </Grid>

        <Box sx={styleFazaLook02}>
          <Grid container sx={{ bgcolor: "#C0E2C3" }}>
            {StrokaHeader(8.3, "Описание")}
            {StrokaHeader(3.7, "Фаза")}
          </Grid>
          <Box sx={{ overflowX: "auto", height: "66.1vh" }}>{StrokaTabl()}</Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default GsLookFaza;
