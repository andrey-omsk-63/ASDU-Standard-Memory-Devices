import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { massfazCreate, statsaveCreate } from "../../redux/actions";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
//import Typography from "@mui/material/Typography";

import GsFieldOfMiracles from "./GsFieldOfMiracles";

//import { Fazer } from "./../../App";

import { OutputFazaImg, OutputVertexImg } from "../MapServiceFunctions";
import { ExitCross, HeaderTabl, HeadingTabl } from "../MapServiceFunctions";
import { MakeMaskFaz } from "../MapServiceFunctions";

import { SendSocketRoute, SendSocketDispatch } from "../MapSocketFunctions";

import { styleModalMenu, styleStrTablImg01 } from "./GsComponentsStyle";
import { styleToDoMode, styleStrokaTabl01 } from "./GsComponentsStyle";
import { styleStrokaTabl03, styleStrokaTabl04 } from "./GsComponentsStyle";
import { styleStrokaTabl02, styleStrTablImg02 } from "./GsComponentsStyle";
import { styleStrokaTabl10 } from "./GsComponentsStyle";
import { styleToDo01, styleToDo02 } from "./GsComponentsStyle";

let toDoMode = false;
let init = true;
let nomIllum = -1;
let needRend = false;

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
  const DEMO = false; // datestat.demo;
  const dispatch = useDispatch();
  let intervalFaza = datestat.intervalFaza; // Задаваемая длительность фазы ДУ (сек)
  let intervalFazaDop = datestat.intervalFazaDop; // Увеличениение длительности фазы ДУ (сек)
  if (!datestat.counterFaza) intervalFaza = intervalFazaDop = 0; // наличие счётчика длительность фазы ДУ
  let newMode = props.newMode;
  //========================================================
  const [trigger, setTrigger] = React.useState(true);
  const [flagPusk, setFlagPusk] = React.useState(false);

  const CloseVertex = (idx: number) => {
    if (!DEMO) {
      SendSocketDispatch(debug, ws, massfaz[idx].idevice, 9, 9);
      let massIdevice: Array<number> = [];
      massIdevice.push(massfaz[idx].idevice);
      SendSocketRoute(debug, ws, massIdevice, false); // завершенение режима
    }
    for (let i = 0; i < massInt[idx].length; i++) {
      if (massInt[idx][i]) {
        clearInterval(massInt[idx][i]);
        massInt[idx][i] = null;
      }
    }
    timerId[idx] = null;
    massfaz[idx].runRec = DEMO ? 5 : 1;
    massfaz[idx].fazaSist = -1;
    datestat.counterId[idx] = 1;

    console.log(idx + 1 + "-й светофор закрыт!!!", datestat.counterId);

    dispatch(statsaveCreate(datestat));
    dispatch(massfazCreate(massfaz));
  };

  const DoTimerCount = (mode: number) => {
    if (datestat.counterId[mode]) {
      for (let i = 0; i < datestat.massInt[mode].length - 1; i++) {
        if (datestat.massInt[mode][i]) {
          clearInterval(datestat.massInt[mode][i]);
          datestat.massInt[mode][i] = null;
        }
      }
      datestat.massInt[mode] = datestat.massInt[mode].filter(function (
        el: any
      ) {
        return el !== null;
      });

      if (massfaz[mode].fazaSist > 0) datestat.counterId[mode]--; // счётчик

      if (!datestat.counterId[mode]) {
        console.log("Нужно послать КУ на", mode + 1); // остановка и очистка счётчика
        for (let i = 0; i < datestat.massInt[mode].length; i++) {
          if (datestat.massInt[mode][i]) {
            clearInterval(datestat.massInt[mode][i]);
            datestat.massInt[mode][i] = null;
          }
        }
        datestat.timerId[mode] = null;
        CloseVertex(mode); // закрыть светофор
      }
      dispatch(statsaveCreate(datestat));
      needRend = true; // нужен ререндеринг
      setFlagPusk(!flagPusk);
    }
  };

  //=== инициализация ======================================
  if (init) {
    massfaz = [];
    timerId = [];
    datestat.massPath = []; // точки рабочего маршрута
    datestat.counterId = []; // счётчик длительности фаз
    datestat.timerId = []; // массив времени отправки команд на счётчики
    datestat.massInt = []; // массив интервалов отправки команд на счётчики
    nomIllum = -1;

    for (let i = 0; i < props.massMem.length; i++) {
      massfaz.push(MakeMaskFaz(i, props.massMem[i], map, massdk, newMode));
      timerId.push(null);
      datestat.counterId.push(intervalFaza); // длительность фазы ДУ
      datestat.timerId.push(null); // массив времени отправки команд
    }
    for (let i = 0; i < props.massMem.length; i++) {
      massInt.push(JSON.parse(JSON.stringify(timerId)));
      datestat.massInt.push(JSON.parse(JSON.stringify(datestat.timerId)));
    }
    init = false;
    dispatch(massfazCreate(massfaz));
    dispatch(statsaveCreate(datestat));
  }
  //========================================================
  const ForcedClearInterval = () => {
    // сброс таймеров отправки фаз
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
    // сброс таймеров счётчиков длительности фаз
    for (let i = 0; i < datestat.timerId.length; i++) {
      if (datestat.timerId[i]) {
        for (let j = 0; j < datestat.massInt[i].length; j++) {
          if (datestat.massInt[i][j]) {
            clearInterval(datestat.massInt[i][j]);
            datestat.massInt[i][j] = null;
          }
        }
        datestat.timerId[i] = null;
      }
    }
    dispatch(statsaveCreate(datestat));
  };

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
      console.log("Принудительное закрытие!!!");
      ForcedClearInterval(); // обнуление всех интервалов и остановка всех таймеров
      for (let i = 0; i < massfaz.length; i++) {
        if (massfaz[i].runRec === 2) {
          SendSocketDispatch(debug, ws, massfaz[i].idevice, 9, 9);
          massfaz[mode].runRec = 1;
          massIdevice.push(massfaz[i].idevice);
        }
      }
      dispatch(massfazCreate(massfaz));
      !DEMO && SendSocketRoute(debug, ws, massIdevice, false);
      props.funcMode(mode); // закончить исполнение
      props.funcHelper(true);
      handleCloseSetEnd();
    }
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
      if (
        fazer.runRec === 0 || // 0 -начало
        fazer.runRec === 1 || // 1 - финиш
        fazer.runRec === 5 // 5 - финиш Демо
      ) {
        SendSocketDispatch(debug, ws, fazer.idevice, 9, fazer.faza);
        timerId[mode] = setInterval(() => DoTimerId(mode), 60000);
        massInt[mode].push(timerId[mode]);
        fazer.runRec = DEMO ? 4 : 2; // активирование

        // запуск таймеров счётчиков длительности фаз
        if (intervalFaza) {
          datestat.timerId[mode] = setInterval(() => DoTimerCount(mode), 1000);
          datestat.massInt[mode].push(
            JSON.parse(JSON.stringify(datestat.timerId[mode]))
          );
          datestat.counterId[mode] = intervalFaza; // длительность фазы ДУ
          dispatch(statsaveCreate(datestat));
        }

        console.log(mode + 1 + "-й светофор пошёл", datestat.counterId);
      } else {
        SendSocketDispatch(debug, ws, fazer.idevice, 9, 9); // КУ
        for (let i = 0; i < massInt[mode].length; i++) {
          if (massInt[mode][i]) {
            clearInterval(massInt[mode][i]);
            massInt[mode][i] = null;
          }
        }
        timerId[mode] = null;
        fazer.runRec = DEMO ? 5 : 1; // финиш
        fazer.fazaSist = -1;
        datestat.counterId[mode] = 1;

        console.log(mode + 1 + "-й светофор закрыт", datestat.counterId);
      }
      dispatch(massfazCreate(massfaz));
      ClickKnop(mode);
    };

    const ClickAddition = (idx: number) => {
      for (let i = 0; i < datestat.counterId.length - 1; i++) {
        if (i === idx) datestat.counterId[i] += intervalFazaDop;
        if (i > idx && datestat.counterId[i] < datestat.counterId[idx])
          datestat.counterId[i] = datestat.counterId[i - 1] + 1;
      }
      dispatch(statsaveCreate(datestat));
      setTrigger(!trigger);
    };

    let resStr = [];

    for (let i = 0; i < massfaz.length; i++) {
      let runREC = JSON.parse(JSON.stringify(massfaz[i].runRec));
      let bull = runREC === 2 || runREC === 4 ? " •" : " ";
      let hostt =
        window.location.origin.slice(0, 22) === "https://localhost:3000"
          ? "https://localhost:3000/"
          : "./";
      let host = hostt + "18.svg";
      if (DEMO && debug) {
        host = hostt + "1.svg";
        if (bull === " •" && runREC === 2) host = hostt + "2.svg";
        if (bull !== " •" && runREC === 5) host = hostt + "2.svg";
      }
      if (!debug) {
        let num = map.tflight[massfaz[i].idx].tlsost.num.toString();
        if (DEMO) {
          num = "1";
          if (bull === " •" && runREC === 2) num = "2";
          if (bull !== " •" && runREC === 5) num = "2";
        }
        host =
          window.location.origin + "/free/img/trafficLights/" + num + ".svg";
      }

      let takt: number | string = massfaz[i].faza;
      let pad = 1.2;
      let fazaImg: null | string = null;
      massfaz[i].img.length > massfaz[i].faza &&
        (fazaImg = massfaz[i].img[massfaz[i].faza - 1]);
      debug && (fazaImg = datestat.phSvg[massfaz[i].faza - 1]); // для отладки

      let illum = nomIllum === i ? styleStrokaTabl01 : styleStrokaTabl02;
      let illumImg =
        runREC === 4 || runREC !== 2 ? styleStrTablImg01 : styleStrTablImg02;
      let finish = runREC === 4 || runREC === 2 ? true : false;
      let hinter = map.tflight[massfaz[i].idx].tlsost.description;

      const LabelVertex = (props: { i: number }) => {
        const [hint, setHint] = React.useState(false);

        return (
          <>
            <Button
              sx={illumImg}
              onMouseEnter={() => setHint(true)}
              onMouseLeave={() => setHint(false)}
              onClick={() => ClickVertex(i)}
            >
              {OutputVertexImg(host)}
            </Button>
            {hint && <Box sx={styleStrokaTabl04}>{hinter}</Box>}
          </>
        );
      };

      resStr.push(
        <Grid key={i} container sx={styleStrokaTabl03}>
          <Grid item xs={1} sx={{ paddingTop: 0.7, textAlign: "center" }}>
            <Button sx={illum} onClick={() => ClickKnop(i)}>
              {massfaz[i].id}
            </Button>
          </Grid>
          <GsFieldOfMiracles finish={finish} idx={i} func={ClickAddition} />
          <Grid item xs={1.0} sx={{}}>
            {!toDoMode ? <>{OutputVertexImg(host)}</> : <LabelVertex i={i} />}
          </Grid>
          <Grid item xs={0.2} sx={styleToDo02}>
            {bull}
          </Grid>
          <Grid item xs={1.0} sx={styleToDo01}>
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

  if (needRend) {
    needRend = false; // задать ререндеринг
    setFlagPusk(!flagPusk);
  }

  return (
    <>
      <Box sx={styleToDoMode}>
        {!toDoMode && <>{ExitCross(handleCloseSetEnd)}</>}
        {HeadingTabl(DEMO, map, newMode)}
        <Box sx={styleStrokaTabl10}>
          {HeaderTabl()}
          <Box sx={{ overflowX: "auto", height: "84.0vh" }}>{StrokaTabl()}</Box>
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
