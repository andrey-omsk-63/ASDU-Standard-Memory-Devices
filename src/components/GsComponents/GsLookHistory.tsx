import * as React from "react";
import { useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";

import GsLookFaza from "./GsLookFaza";

import { styleModalEnd } from "../MainMapStyle";
import { styleSetHist, styleButLook } from "./GsComponentsStyle";
import { styleGridLook, styletSelectTitle } from "./GsComponentsStyle";
import { styletSelect01 } from "./GsComponentsStyle";

let history: any = null;
let hist: any = null;

const GsLookHistory = (props: { setOpen: Function; history: any }) => {
  //== Piece of Redux =======================================
  let datestat = useSelector((state: any) => {
    const { statsaveReducer } = state;
    return statsaveReducer.datestat;
  });
  const debug = datestat.debug;
  //===========================================================
  const [openSetMode, setOpenSetMode] = React.useState(true);
  const [lookFaza, setLookFaza] = React.useState(false);
  history = props.history;
  if (debug) history = props.history.history;

  const handleCloseSetEnd = () => {
    props.setOpen(false);
    setOpenSetMode(false);
  };

  const ClickKnop = (mode: number) => {
    hist = history[mode];
    setLookFaza(true);
  };

  const StrokaTabl = () => {
    let resStr = [];
    for (let i = 0; i < history.length; i++) {
      let stroka = new Date(history[i].tm).toLocaleDateString() + " ";
      stroka += new Date(history[i].tm).toLocaleTimeString().slice(0, 5) + " ";

      resStr.push(
        <Grid
          key={i}
          container
          sx={{ textShadow: "1px 1px 2px rgba(0,0,0,0.3)" }}
        >
          <Grid item xs={1.8} sx={styleGridLook}>
            Изменён:
          </Grid>
          <Grid item xs={4.5} sx={{ border: 0, textAlign: "center" }}>
            <Button sx={styleButLook} onClick={() => ClickKnop(i)}>
              {stroka}
            </Button>
          </Grid>
          <Grid item xs sx={{ marginTop: 1, fontSize: 14, textAlign: "left" }}>
            Кем: <b>{history[i].login.slice(0, 21)}</b>
          </Grid>
        </Grid>
      );
    }
    return resStr;
  };

  return (
    <Modal open={openSetMode} onClose={handleCloseSetEnd} hideBackdrop>
      <Box sx={styleSetHist}>
        <Button sx={styleModalEnd} onClick={handleCloseSetEnd}>
          <b>&#10006;</b>
        </Button>

        {history === null && (
          <Typography variant="h6" sx={{ textAlign: "center" }}>
            Нет данных по этому режиму
          </Typography>
        )}

        {history !== null && (
          <>
            <Typography variant="h6" sx={styletSelectTitle}>
              {history[0].description}
            </Typography>
            <Box sx={styletSelect01}>{StrokaTabl()}</Box>
          </>
        )}
        {lookFaza && <GsLookFaza setOpen={setLookFaza} history={hist} />}
      </Box>
    </Modal>
  );
};

export default GsLookHistory;
