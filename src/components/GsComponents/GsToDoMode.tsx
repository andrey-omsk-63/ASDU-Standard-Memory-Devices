import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { massfazCreate } from '../../redux/actions';

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

import { Fazer } from "./../../App";

import { OutputFazaImg, OutputVertexImg } from "../MapServiceFunctions";
import { SendSocketRoute } from "../MapSocketFunctions";

import { styleModalEnd } from "../MainMapStyle";
import { styleModalMenu, styleStrokaTablImg } from "./GsComponentsStyle";
import { styleToDoMode, styleStrokaTabl } from "./GsComponentsStyle";

//let massFaz: any = [];
let toDoMode = false;
let init = true;

const GsToDoMode = (props: {
  newMode: number;
  massMem: Array<number>;
  funcMode: any;
  funcSize: any;
  funcCenter: any;
  funcHelper: any;
}) => {
  //== Piece of Redux ======================================
  const map = useSelector((state: any) => {
    const { mapReducer } = state;
    return mapReducer.map.dateMap;
  });
  let massdk = useSelector((state: any) => {
    const { massdkReducer } = state;
    return massdkReducer.massdk;
  });
  let massfaz = useSelector((state: any) => {
    const { massfazReducer } = state;
    return massfazReducer.massfaz;
  });
  console.log("TODOmassfaz", massfaz);
  let datestat = useSelector((state: any) => {
    const { statsaveReducer } = state;
    return statsaveReducer.datestat;
  });
  const debug = datestat.debug;
  const ws = datestat.ws;
  const dispatch = useDispatch();
  //========================================================
  const [trigger, setTrigger] = React.useState(true);
  let newMode = props.newMode;

  //=== инициализация ======================================
  const MakeMaskFaz = (i: number) => {
    //let im: Array<string | null> = [];
    let maskFaz: Fazer = {
      idx: 0,
      faza: 1,
      phases: [],
      idevice: 0,
      name: "",
      starRec: false,
      runRec: false,
      img: [],
    };
    maskFaz.idx = props.massMem[i];
    maskFaz.name = massdk[maskFaz.idx].nameCoordinates;
    maskFaz.phases = massdk[maskFaz.idx].phases;
    maskFaz.idevice = map.tflight[maskFaz.idx].idevice;
    maskFaz.faza = map.routes[newMode].listTL[i].phase;
    if (!maskFaz.phases.length) {
      maskFaz.img = [null, null, null];
    } else {
      maskFaz.img = massdk[maskFaz.idx].phSvg;
    }
    return maskFaz;
  };
  if (init) {
    massfaz = [];
    for (let i = 0; i < props.massMem.length; i++) {
      massfaz.push(MakeMaskFaz(i));
    }
    init = false;
    dispatch(massfazCreate(massfaz));
  }

  //========================================================
  const handleCloseSetEnd = () => {
    props.funcSize(11.99);
    toDoMode = false;
    init = true;
  };

  const ToDoMode = (mode: number) => {
    let massIdevice: Array<number> = [];
    if (mode) {
      for (let i = 0; i < massfaz.length; i++) {
        massIdevice.push(massfaz[i].idevice);
      }
      SendSocketRoute(debug, ws, massIdevice, true);
      toDoMode = true; // выполнение режима
      props.funcMode(mode);
      setTrigger(!trigger);
    } else {
      SendSocketRoute(debug, ws, massIdevice, false);
      props.funcMode(mode); // закончить исполнение
      props.funcHelper(true);
      handleCloseSetEnd();
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
      let coord = [coor.Y, coor.X];
      massfaz[mode].starRec = !massfaz[mode].starRec;
      props.funcCenter(coord);
      setTrigger(!trigger);
    };

    const ClickImg = (mode: number) => {
      massfaz[mode].runRec = !massfaz[mode].runRec;
      setTrigger(!trigger);
    };

    let resStr = [];

    for (let i = 0; i < massfaz.length; i++) {
      let bull = " ";
      if (massfaz[i].runRec) bull = " •";
      let host = "https://localhost:3000/18.svg";
      if (!debug) {
        let num = map.tflight[massfaz[i].idx].tlsost.num.toString();
        host =
          window.location.origin + "/free/img/trafficLights/" + num + ".svg";
      }
      let star = "";
      if (massfaz[i].starRec) star = "*";
      let takt = "пром такт";
      let pad = 1.2;
      if (i !== 1) {
        takt = massfaz[i].faza;
        pad = 0;
      } 

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
          <Grid item xs={1.0} sx={{}}>
            <Button
              variant="contained"
              sx={styleStrokaTablImg}
              onClick={() => ClickImg(i)}
            >
              {OutputVertexImg(host)}
            </Button>
          </Grid>
          <Grid item xs={0.4} sx={{ border: 0, fontSize: 30, marginLeft: 1 }}>
            {bull}
          </Grid>

          <Grid
            item
            xs={1.1}
            sx={{ fontSize: 12, paddingTop: 1.7, textAlign: "right" }}
          >
            {takt}
          </Grid>
          <Grid item xs={2} sx={{ paddingTop: pad, textAlign: "center" }}>
            {OutputFazaImg(massfaz[i].img[massfaz[i].faza - 1])}
          </Grid>

          <Grid item xs sx={{ fontSize: 14 }}>
            {massfaz[i].name}
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
            {StrokaHeader(3.6, "Состояние")}
            {StrokaHeader(1.9, "Фаза")}
            {StrokaHeader(5.5, "ДК")}
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
