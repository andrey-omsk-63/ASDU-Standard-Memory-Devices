import * as React from "react";
import { useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";

import { styleModalEnd } from "../MainMapStyle";

let massName: any = [];
let flagBegin = true;
let knop2 = "удалить";
let dlRoute = 0;

const GsSelectMD = (props: { setOpen: any; idx: any }) => {
  //== Piece of Redux =======================================
  const map = useSelector((state: any) => {
    const { mapReducer } = state;
    return mapReducer.map.dateMap;
  });
  //===========================================================
  const [trigger, setTrigger] = React.useState(true);
  const [chDel, setChDel] = React.useState(0);
  //const [editMode, setEditMode] = React.useState(false);

  const styleSetInf = {
    position: "relative",
    marginTop: 4,
    marginLeft: "auto",
    marginRight: 69,
    width: 444,
    bgcolor: "background.paper",
    border: "3px solid #000",
    borderColor: "primary.main",
    borderRadius: 2,
    boxShadow: 24,
    p: 1.5,
  };

  const styleModalMenu = {
    marginRight: 1,
    backgroundColor: "#E6F5D6",
    textTransform: "unset !important",
    color: "black",
  };
  //=== инициализация ======================================
  if (flagBegin || dlRoute !== map.routes.length) {
    let ch = 1;
    massName = [];
    for (let i = 0; i < map.routes.length; i++) {
      let nameZU = map.routes[i].description;
      if (!nameZU) nameZU = "без имени(" + ch++ + ")";
      let maskName = {
        name: nameZU,
        delRec: false,
      };
      massName.push(maskName);
    }
    flagBegin = false;
    dlRoute = map.routes.length;
  }

  const [openSetMode, setOpenSetMode] = React.useState(true);

  const handleCloseSetEnd = () => {
    props.setOpen(false);
    setOpenSetMode(false);
  };

  const ClickKnop1 = (idx: number) => {
    props.idx(idx)
    props.setOpen(false);
    setOpenSetMode(false);
  };

  const ClickKnop2 = (idx: number) => {
    massName[idx].delRec = !massName[idx].delRec;
    if (massName[idx].delRec) setChDel(chDel + 1);
    if (!massName[idx].delRec) setChDel(chDel - 1);
    setTrigger(!trigger);
  };

  const DeleteRec = () => {
    let massRab = [];
    let massRoute = [];
    for (let i = 0; i < massName.length; i++) {
      if (!massName[i].delRec) {
        massRab.push(massName[i]);
        massRoute.push(map.routes[i]);
      }
    }
    massName = massRab;
    map.routes = massRoute;
    setChDel(0);
    setTrigger(!trigger);
  };

  const StrokaTabl = () => {
    let resStr = [];
    for (let i = 0; i < massName.length; i++) {
      knop2 = "удалить";
      let fSize = 12;
      let colorRec = "black";
      if (massName[i].delRec) {
        knop2 = "восстановить";
        fSize = 11;
        colorRec = "red";
      }
      const styleBut01 = {
        fontSize: fSize + 2,
        marginTop: 1,
        border: "2px solid #000",
        bgcolor: "#E6F5D6",
        width: "320px",
        maxHeight: "20px",
        minHeight: "20px",
        borderColor: "#E6F5D6",
        borderRadius: 2,
        color: colorRec,
        textTransform: "unset !important",
      };
      const styleBut02 = {
        fontSize: fSize,
        marginTop: 1,
        border: "2px solid #000",
        bgcolor: "#E6F5D6",
        width: "105px",
        maxHeight: "20px",
        minHeight: "20px",
        borderColor: "#E6F5D6",
        borderRadius: 2,
        color: colorRec,
        textTransform: "unset !important",
      };
      resStr.push(
        <Grid key={i} container>
          <Grid item xs={8.9} sx={{ border: 0, textAlign: "center" }}>
            <Button
              variant="contained"
              sx={styleBut01}
              onClick={() => ClickKnop1(i)}
            >
              {massName[i].name}
            </Button>
          </Grid>
          <Grid item xs sx={{ border: 0, textAlign: "center" }}>
            <Button
              variant="contained"
              sx={styleBut02}
              onClick={() => ClickKnop2(i)}
            >
              {knop2}
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
        <Box sx={{ overflowX: "auto", height: "69vh" }}>{StrokaTabl()}</Box>
        {chDel > 0 && (
          <Box sx={{ marginTop: 1, textAlign: "center" }}>
            <Button sx={styleModalMenu} onClick={() => DeleteRec()}>
              Удалить отмеченные
            </Button>
          </Box>
        )}
        {/* {editMode && <EditMode />} */}
      </Box>
    </Modal>
  );
};

export default GsSelectMD;
