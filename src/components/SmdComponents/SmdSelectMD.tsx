import * as React from "react";
import { useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";

import { styleModalEnd, styleSetInf } from "./../MainMapStyle";

const SmdSelectMD = (props: { setOpen: any }) => {
  //== Piece of Redux =======================================
  const map = useSelector((state: any) => {
    const { mapReducer } = state;
    return mapReducer.map.dateMap;
  });
  //===========================================================
  const styleSetInf = {
    position: "relative",
    marginTop: 4,
    marginLeft: "auto",
    marginRight: 69,
    width: 420,
    bgcolor: "background.paper",
    border: "3px solid #000",
    borderColor: "primary.main",
    borderRadius: 2,
    boxShadow: 24,
    p: 1.5,
  };

  const styleBut01 = {
    fontSize: 14,
    marginTop: 1,
    border: "2px solid #000",
    bgcolor: "#E6F5D6",
    minWidth: "300px",
    maxWidth: "300px",
    maxHeight: "20px",
    minHeight: "20px",
    borderColor: "#E6F5D6",
    borderRadius: 2,
    color: "black",
    textTransform: "unset !important",
  };

  const styleBut02 = {
    fontSize: 12,
    marginTop: 1,
    border: "2px solid #000",
    bgcolor: "#E6F5D6",
    minWidth: "12px",
    maxWidth: "120px",
    maxHeight: "20px",
    minHeight: "20px",
    borderColor: "#E6F5D6",
    borderRadius: 2,
    color: "black",
    textTransform: "unset !important",
  };

  const styleModalMenu = {
    marginTop: 0.5,
    marginRight: 1,
    backgroundColor: '#E6F5D6',
    textTransform: 'unset !important',
    color: 'black',
  };

  const [openSetMode, setOpenSetMode] = React.useState(true);

  const handleCloseSetEnd = () => {
    props.setOpen(false);
    setOpenSetMode(false);
  };

  const StrokaTabl = () => {
    let resStr = [];
    let ch = 1;
    for (let i = 0; i < map.routes.length; i++) {
      let nameZU = map.routes[i].description;
      if (!nameZU) nameZU = "без имени(" + ch++ + ")";
      resStr.push(
        <Grid key={i} container>
          <Grid item xs={9} sx={{ border: 1, textAlign: "center" }}>
            <Button
              variant="contained"
              sx={styleBut01}
              //onClick={() => ClickKnop(i)}
            >
              {nameZU}
            </Button>
          </Grid>
          <Grid item xs={3} sx={{ border: 1, textAlign: "center" }}>
            <Button
              variant="contained"
              sx={styleBut02}
              //onClick={() => ClickKnop(i)}
            >
              удалить
            </Button>
          </Grid>
        </Grid>
      );
    }
    return resStr;
  };

  return (
    <Modal open={openSetMode} onClose={handleCloseSetEnd} hideBackdrop>
      <Box sx={styleSetInf}>
        <Button sx={styleModalEnd} onClick={handleCloseSetEnd}>
          <b>&#10006;</b>
        </Button>

        <Typography variant="h6" sx={{ textAlign: "center" }}>
          Выбор ЗУ
        </Typography>
        <Box sx={{ overflowX: "auto", height: "36vh" }}>{StrokaTabl()}</Box>
        <Button sx={styleModalMenu}>Удалить отмеченные</Button>
        <br />
      </Box>
    </Modal>
  );
};

export default SmdSelectMD;
