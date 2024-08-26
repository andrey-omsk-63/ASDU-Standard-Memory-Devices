import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { massfazCreate, statsaveCreate } from "../../redux/actions";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import { Fazer } from "./../../App";

import { OutputFazaImg, OutputVertexImg } from "../MapServiceFunctions";
import { SendSocketRoute, SendSocketDispatch } from "../MapSocketFunctions";

import { styleModalEnd } from "../MainMapStyle";
import { styleModalMenu, styleStrokaTablImg01 } from "./GsComponentsStyle";
import { styleToDoMode, styleStrokaTabl01 } from "./GsComponentsStyle";
import { styleStrokaTabl03 } from "./GsComponentsStyle";
import { styleStrokaTabl02, styleStrokaTablImg02 } from "./GsComponentsStyle";
import { styletSelectTitle, styleStrokaTabl10 } from "./GsComponentsStyle";
import { styleToDo01, styleToDo02 } from "./GsComponentsStyle";

let toDoMode = false;
let init = true;
let nomIllum = -1;

let timerId: any[] = [];
let massInt: any[][] = [];

const GsToDoMode = (props: {
  newMode: number;
  massMem: Array<number>;
  funcMode: any;
  funcSize: any;
  funcCenter: any;
  funcHelper: any;
  trigger: boolean;
  changeFaz: boolean;
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
    let iDx = props.massMem[i]
    let maskFaz: Fazer = {
      kolOpen: 0,
      runRec: false,
      idx: iDx,
      coordinates: [],
      faza: map.routes[newMode].listTL[i].phase,
      fazaSist: -1,
      fazaSistOld: -1,
      phases: massdk[iDx].phases,
      idevice: map.tflight[iDx].idevice,
      name: massdk[iDx].nameCoordinates,
      starRec: false,
      img: [],
    };

    nomIllum = -1;
    if (debug) maskFaz.fazaSist = 1;
    maskFaz.coordinates[0] = map.tflight[iDx].points.Y;
    maskFaz.coordinates[1] = map.tflight[iDx].points.X;
    if (
      map.tflight[maskFaz.idx].points.X !==
        map.routes[newMode].listTL[i].point.X ||
      map.tflight[maskFaz.idx].points.Y !==
        map.routes[newMode].listTL[i].point.Y
    )
      maskFaz.starRec = true; // было изменение координат
    if (!maskFaz.phases.length) {
      maskFaz.img = [null, null, null];
    } else maskFaz.img = massdk[maskFaz.idx].phSvg;
    return maskFaz;
  };

  if (init) {
    massfaz = [];
    timerId = [];
    for (let i = 0; i < props.massMem.length; i++) {
      massfaz.push(MakeMaskFaz(i));
      timerId.push(null);
    }
    for (let i = 0; i < props.massMem.length; i++)
      massInt.push(JSON.parse(JSON.stringify(timerId)));
    init = false;
    dispatch(massfazCreate(massfaz));
  }
  //========================================================
  const handleCloseSetEnd = () => {
    props.funcSize(11.99);
    toDoMode = false;
    datestat.toDoMode = false;
    datestat.working = false;
    dispatch(statsaveCreate(datestat));
    massfaz = [];
    dispatch(massfazCreate(massfaz));
    init = true;
  };

  const ToDoMode = (mode: number) => {
    let massIdevice: Array<number> = [];
    if (mode) {
      ClickKnop(0); // ставим на первый светофор
      for (let i = 0; i < massfaz.length; i++) {
        massIdevice.push(massfaz[i].idevice);
        massfaz[i].kolOpen++;
      }
      dispatch(massfazCreate(massfaz));
      SendSocketRoute(debug, ws, massIdevice, true);
      toDoMode = true; // выполнение режима
      datestat.toDoMode = true;
      dispatch(statsaveCreate(datestat));
      props.funcMode(mode);
      setTrigger(!trigger);
    } else {
      // принудительное закрытие
      for (let i = 0; i < timerId.length; i++) {
        if (timerId[i]) {
          for (let j = 0; j < massInt[i].length; j++) {
            if (massInt[i][j]) {
              clearInterval(massInt[i][j]);
              massInt[i][j] = null;
            }
          }
          timerId[i] = null;
        }
      }
      for (let i = 0; i < massfaz.length; i++) {
        if (massfaz[i].runRec) {
          SendSocketDispatch(debug, ws, massfaz[i].idevice, 9, 9);
          massfaz[mode].runRec = !massfaz[mode].runRec;
        }
      }
      dispatch(massfazCreate(massfaz));
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

  const ClickKnop = (mode: number) => {
    nomIllum = mode;
    let coor = map.routes[newMode].listTL[mode].point;
    let coord = [coor.Y, coor.X];
    props.funcCenter(coord);
    setTrigger(!trigger);
  };

  const StrokaTabl = () => {
    const ClickVertex = (mode: number) => {
      let fazer = massfaz[mode];
      if (!fazer.runRec) {
        console.log(mode + 1 + "-й светофор пошёл", timerId[mode]);
        SendSocketDispatch(debug, ws, fazer.idevice, 9, fazer.faza);
        timerId[mode] = setInterval(() => DoTimerId(mode), 60000);
        massInt[mode].push(timerId[mode]);
      } else {
        console.log(mode + 1 + "-й светофор закрыт", timerId[mode]);
        SendSocketDispatch(debug, ws, fazer.idevice, 9, 9);
        for (let i = 0; i < massInt[mode].length; i++) {
          if (massInt[mode][i]) {
            clearInterval(massInt[mode][i]);
            massInt[mode][i] = null;
          }
        }
        timerId[mode] = null;
      }
      massfaz[mode].runRec = !massfaz[mode].runRec;
      dispatch(massfazCreate(massfaz));
      ClickKnop(mode);
    };

    let resStr = [];

    for (let i = 0; i < massfaz.length; i++) {
      let bull = " ";
      if (massfaz[i].runRec) bull = " •";
      let hostt =
        window.location.origin.slice(0, 22) === "https://localhost:3000"
          ? "https://localhost:3000/"
          : "./";
      let host = hostt + "18.svg";

      if (!debug) {
        let num = map.tflight[massfaz[i].idx].tlsost.num.toString();
        host =
          window.location.origin + "/free/img/trafficLights/" + num + ".svg";
      }
      let star = "";
      if (massfaz[i].starRec) star = "*";
      let takt: number | string = massfaz[i].faza;
      let pad = 1.2;
      let fazaImg: null | string = null;
      massfaz[i].img.length > massfaz[i].faza &&
        (fazaImg = massfaz[i].img[massfaz[i].faza - 1]);
      debug && (fazaImg = datestat.phSvg); // для отладки
      let illum = nomIllum === i ? styleStrokaTabl01 : styleStrokaTabl02;
      let illumImg = massfaz[i].runRec
        ? styleStrokaTablImg01
        : styleStrokaTablImg02;

      resStr.push(
        <Grid key={i} container sx={styleStrokaTabl03}>
          <Grid item xs={1} sx={{ paddingTop: 0.7, textAlign: "center" }}>
            <Button sx={illum} onClick={() => ClickKnop(i)}>
              {i + 1}
            </Button>
          </Grid>
          <Grid item xs={1.2} sx={{ fontSize: 27, textAlign: "right" }}>
            {star}
          </Grid>
          <Grid item xs={1.0} sx={{}}>
            {!toDoMode ? (
              <>{OutputVertexImg(host)}</>
            ) : (
              <Button sx={illumImg} onClick={() => ClickVertex(i)}>
                {OutputVertexImg(host)}
              </Button>
            )}
          </Grid>
          <Grid item xs={0.4} sx={styleToDo02}>
            {bull}
          </Grid>
          <Grid item xs={1.1} sx={styleToDo01}>
            {takt}
          </Grid>
          <Grid item xs={2} sx={{ paddingTop: pad, textAlign: "center" }}>
            {OutputFazaImg(fazaImg, massfaz[i].faza)}
          </Grid>
          <Grid item xs sx={{ fontSize: 14 }}>
            {massfaz[i].name}
          </Grid>
        </Grid>
      );
    }
    return resStr;
  };

  const DoTimerId = (mode: number) => {
    let fazer = massfaz[mode];
    console.log("Отправка с " + String(mode + 1) + "-го", timerId);
    SendSocketDispatch(debug, ws, fazer.idevice, 9, fazer.faza);
    for (let i = 0; i < massInt[mode].length - 1; i++) {
      if (massInt[mode][i]) {
        clearInterval(massInt[mode][i]);
        massInt[mode][i] = null;
      }
    }
    massInt[mode] = massInt[mode].filter(function (el: any) {
      return el !== null;
    });
  };

  return (
    <>
      <Box sx={styleToDoMode}>
        {!toDoMode && (
          <Button sx={styleModalEnd} onClick={handleCloseSetEnd}>
            <b>&#10006;</b>
          </Button>
        )}

        <Typography variant="h6" sx={styletSelectTitle}>
          Режим: <b>{map.routes[newMode].description}</b>
        </Typography>

        <Box sx={styleStrokaTabl10}>
          <Grid container sx={{ bgcolor: "#B8CBB9" }}>
            {StrokaHeader(1, "Номер")}
            {StrokaHeader(3.6, "Состояние")}
            {StrokaHeader(1.9, "Фаза")}
            {StrokaHeader(5.5, "ДК")}
          </Grid>
          <Box sx={{ overflowX: "auto", height: "84.5vh" }}>{StrokaTabl()}</Box>
        </Box>

        <Box sx={{ marginTop: 0.5, textAlign: "center" }}>
          {!toDoMode ? (
            <Button sx={styleModalMenu} onClick={() => ToDoMode(2)}>
              Начать исполнение
            </Button>
          ) : (
            <Button sx={styleModalMenu} onClick={() => ToDoMode(0)}>
              Закончить исполнение
            </Button>
          )}
        </Box>
      </Box>
    </>
  );
};

export default GsToDoMode;
