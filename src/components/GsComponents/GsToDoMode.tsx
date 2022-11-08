import * as React from "react";
import { useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import CardMedia from "@mui/material/CardMedia";

import { styleModalEnd } from "../MainMapStyle";
import { styleModalMenu, styleStrokaTablImg } from "./GsComponentsStyle";
import { styleToDoMode, styleStrokaTabl } from "./GsComponentsStyle";

let newInput = true;
let massFaz: any = [];

let toDoMode = false;

const GsToDoMode = (props: {
  newMode: number;
  massMem: Array<number>;
  funcMode: any;
  funcSize: any;
  funcCenter: any;
}) => {
  //== Piece of Redux ======================================
  const map = useSelector((state: any) => {
    const { mapReducer } = state;
    return mapReducer.map.dateMap;
  });
  //const dispatch = useDispatch();
  //========================================================
  const [trigger, setTrigger] = React.useState(true);
  let newMode = props.newMode;

  //=== инициализация ======================================
  const MakeMaskFaz = (i: number) => {
    let maskFaz = {
      idx: 0,
      faza: 1,
      phases: [],
      name: "",
      //coordinates: [],
      starRec: false,
      runRec: false,
    };
    maskFaz.idx = props.massMem[i];
    maskFaz.name = map.tflight[maskFaz.idx].description;
    maskFaz.phases = map.tflight[maskFaz.idx].phases;
    // let coor = map.tflight[maskFaz.idx].points
    // maskFaz.coordinates = [coor.Y,coor.X];
    return maskFaz;
  };

  if (newInput) {
    massFaz = [];

    for (let i = 0; i < props.massMem.length; i++) {
      massFaz.push(MakeMaskFaz(i));
    }
    newInput = false;
  } else {
    let massRab: any = [];
    for (let i = 0; i < props.massMem.length; i++) {
      let flagHave = false;
      for (let j = 0; j < massFaz.length; j++) {
        if (massFaz[j].idx === props.massMem[i]) {
          massRab.push(massFaz[j]);
          flagHave = true;
          break;
        }
      }
      if (!flagHave) massRab.push(MakeMaskFaz(i));
    }
    massFaz = massRab;
  }
  //========================================================
  const handleCloseSetEnd = () => {
    props.funcSize(11.99);
    toDoMode = false;
  };

  const ToDoMode = (mode: number) => {
    if (mode) {
      toDoMode = true; // выполнение режима
      props.funcMode(mode);
      setTrigger(!trigger);
    } else {
      props.funcMode(mode);
      handleCloseSetEnd(); // закончить исполнение
    }
  };

  const StrokaHeader = (xss: number, soob: string) => {
    return (
      <Grid item xs={xss} sx={{ fontSize: 14, textAlign: "center" }}>
        <b>{soob}</b>
      </Grid>
    );
  };

  const StrokaTabl = () => {
    const ClickKnop = (mode: number) => {
      let coor = map.routes[newMode].listTL[mode].point;
      let coord = [coor.Y,coor.X];
      massFaz[mode].starRec = !massFaz[mode].starRec;
      props.funcCenter(coord)
      setTrigger(!trigger);
    };

    const ClickImg = (mode: number) => {
      massFaz[mode].runRec = !massFaz[mode].runRec;
      setTrigger(!trigger);
    };

    let resStr = [];

    for (let i = 0; i < massFaz.length; i++) {
      let star = "";
      if (massFaz[i].starRec) star = "*";

      resStr.push(
        <Grid key={i} container sx={{ marginTop: 1 }}>
          <Grid item xs={1} sx={{ paddingTop: 0.7, textAlign: "center" }}>
            <Button
              variant="contained"
              sx={styleStrokaTabl}
              onClick={() => ClickKnop(i)}
            >
              {i + 1}
            </Button>
          </Grid>

          <Grid item xs={1.2} sx={{ fontSize: 27, textAlign: "right" }}>
            {star}
          </Grid>
          <Grid item xs={1.0} sx={{ border: 0 }}>
            <Button
              variant="contained"
              sx={styleStrokaTablImg}
              onClick={() => ClickImg(i)}
            >
              <CardMedia
                component="img"
                sx={{ textAlign: "center", height: 40, width: 30 }}
                image="https://localhost:3000/18.svg"
              />
            </Button>
          </Grid>
          {massFaz[i].runRec && (
            <Grid item xs={1.3} sx={{ fontSize: 30, textAlign: "left" }}>
              &bull;
            </Grid>
          )}
          {!massFaz[i].runRec && (
            <Grid item xs={1.3} sx={{ fontSize: 30, textAlign: "left" }}>
              {" "}
            </Grid>
          )}

          <Grid item xs={1.5} sx={{ border: 0, textAlign: "center" }}>
            --
          </Grid>

          <Grid item xs sx={{ fontSize: 14 }}>
            {massFaz[i].name}
          </Grid>
        </Grid>
      );
    }
    return resStr;
  };

  return (
    <>
      <Box sx={styleToDoMode}>
        {!toDoMode && (
          <Button sx={styleModalEnd} onClick={handleCloseSetEnd}>
            <b>&#10006;</b>
          </Button>
        )}

        <Grid container sx={{ marginTop: 0 }}>
          <Grid item xs sx={{ fontSize: 18, textAlign: "center" }}>
            Режим: <b>{map.routes[newMode].description}</b>
          </Grid>
        </Grid>

        <Box sx={{ marginTop: 1 }}>
          <Grid container sx={{ bgcolor: "#C0E2C3" }}>
            {StrokaHeader(1, "Номер")}
            {StrokaHeader(3.5, "Состояние")}
            {StrokaHeader(1.5, "Фаза")}
            {StrokaHeader(6, "ДК")}
          </Grid>

          <Box sx={{ overflowX: "auto", height: "81vh" }}>{StrokaTabl()}</Box>

          {!toDoMode && (
            <Box sx={{ marginTop: 1.5, textAlign: "center" }}>
              <Button sx={styleModalMenu} onClick={() => ToDoMode(2)}>
                Начать исполнение
              </Button>
            </Box>
          )}

          {toDoMode && (
            <Box sx={{ marginTop: 1.5, textAlign: "center" }}>
              <Button sx={styleModalMenu} onClick={() => ToDoMode(0)}>
                Закончить исполнение
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default GsToDoMode;