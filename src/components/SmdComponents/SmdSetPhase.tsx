import * as React from "react";
import { useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";

import { styleModalEnd } from "./../MainMapStyle";

let newInput = true;
let massFaz: any = [];

const SmdSetPhase = (props: { setOpen: any; massMem: Array<number> }) => {
  //== Piece of Redux =======================================
  const map = useSelector((state: any) => {
    const { mapReducer } = state;
    return mapReducer.map;
  });
  //===========================================================
  const styleSetInf = {
    position: "relative",
    marginTop: 10.5,
    marginLeft: "auto",
    marginRight: 30,
    width: 777,
    bgcolor: "background.paper",
    border: "3px solid #000",
    borderColor: "primary.main",
    borderRadius: 2,
    boxShadow: 24,
    p: 1.5,
  };

  const styleModalMenu = {
    marginTop: 0.5,
    marginRight: 1,
    backgroundColor: "#E6F5D6",
    textTransform: "unset !important",
    color: "black",
  };

  const styleSave = {
    fontSize: 14,
    marginRight: 0.1,
    border: "2px solid #000",
    bgcolor: "#E6F5D6",
    minWidth: "110px",
    maxWidth: "110px",
    maxHeight: "20px",
    minHeight: "20px",
    borderColor: "#E6F5D6",
    borderRadius: 2,
    color: "black",
    textTransform: "unset !important",
  };

  const [openSetMode, setOpenSetMode] = React.useState(true);

  if (newInput) {
    massFaz = [];
    for (let i = 0; i < props.massMem.length; i++) {
      let maskFaz = {
        idx: 0,
        faza: 0,
        name: "",
        delRec: false,
      };
      maskFaz.idx = props.massMem[i];
      maskFaz.name = map.dateMap.tflight[maskFaz.idx].description;
      massFaz.push(maskFaz);
    }
    newInput = false;
    console.log("massFaz:", massFaz);
  }

  const handleCloseSetEnd = () => {
    props.setOpen(false);
    setOpenSetMode(false);
    newInput = true;
  };

  return (
    <Modal open={openSetMode} onClose={handleCloseSetEnd} hideBackdrop>
      <Box sx={styleSetInf}>
        <Button sx={styleModalEnd} onClick={handleCloseSetEnd}>
          <b>&#10006;</b>
        </Button>

        <Typography variant="h6" sx={{ textAlign: "center" }}>
          Таблица фаз
        </Typography>
        <Box sx={{ marginTop: 0.5 }}>
          <Grid container sx={{ bgcolor: "#C0E2C3" }}>
            <Grid item xs={8} sx={{ border: 0, textAlign: "center" }}>
              <b>Описание</b>
            </Grid>
            <Grid item xs={2} sx={{ border: 0, textAlign: "center" }}>
              <b>Фаза</b>
            </Grid>
            <Grid item xs={2} sx={{ border: 0, textAlign: "center" }}>
              <b>Действие</b>
            </Grid>
          </Grid>

          <Grid container>
            <Grid item xs={8} sx={{ border: 0 }}>
              {map.dateMap.tflight[0].description}
            </Grid>
            <Grid item xs={2} sx={{ border: 0, textAlign: "center" }}>
              Фаза
            </Grid>
            <Grid item xs={2} sx={{ border: 0, textAlign: "center" }}>
              <Button variant="contained" sx={styleSave}>
                удалить
              </Button>
            </Grid>
          </Grid>

          <Grid container sx={{ color: "red" }}>
            <Grid item xs={8} sx={{ border: 0 }}>
              {map.dateMap.tflight[1].description}
            </Grid>
            <Grid item xs={2} sx={{ border: 0, textAlign: "center" }}>
              Фаза
            </Grid>
            <Grid item xs={2} sx={{ border: 0, textAlign: "center" }}>
              <Button variant="contained" sx={styleSave}>
                восстановить
              </Button>
            </Grid>
          </Grid>

          <Box sx={{ marginTop: 0.5, textAlign: "center" }}>
            <Button sx={styleModalMenu}>Удалить помеченные</Button>
            <Button sx={styleModalMenu}>Сохранить</Button>
          </Box>
          {/* <Box sx={{ border: 0, overflowX: "auto", height: "73vh" }}>
            {StrokaProtokol()}
          </Box> */}
        </Box>
      </Box>
    </Modal>
  );
};

export default SmdSetPhase;
