import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { massfazCreate, statsaveCreate } from "../../redux/actions";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

import GsErrorMessage from "./GsErrorMessage";
import GsFieldOfMiracles from "./GsFieldOfMiracles";

import { OutputFazaImg, MakeMaskFaz } from "../MapServiceFunctions";
import { ExitCross, HeaderTabl, HeadingTabl } from "../MapServiceFunctions";
import { FooterContentToDo } from "../MapServiceFunctions";

import { SendSocketRoute, SendSocketDispatch } from "../MapSocketFunctions";

import { NoClose, CLINCH, BadCODE, GoodCODE } from "./../MapConst";

import { styleToDoMode, styleStrokaTabl01 } from "./GsComponentsStyle";
import { styleStrokaTabl03, styleStrokaTabl02 } from "./GsComponentsStyle";
import { styleStrokaTabl10 } from "./GsComponentsStyle";
import { styleToDo01, styleToDo02 } from "./GsComponentsStyle";

let toDoMode = false; // флаг выполнение режима
let init = true;
let nomIllum = -1;
let needRend = false;
let soobError = "";
let timerId: any[] = [];
let massInt: any[][] = [];

const GsToDoMode = (props: {
  newMode: number;
  massMem: Array<number>;
  funcMode: any;
  funcCenter: any;
  funcHelper: any;
  trigger: boolean;
  changeFaz: boolean;
  start: number; // номер запускемого светофора в massfaz
  funcStart: Function; // функция возврата запуска светофора
  stop: number; // номер останавливаемого светофора в massfaz
  funcStop: Function; // функция возврата остановки светофора
  begin: boolean; // первый вход в режим
  funcBegin: Function; // функция сброса признака первого входа
  changeDemo: Function;
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
  const DEMO = datestat.demo;
  const dispatch = useDispatch();
  let intervalFaza = datestat.intervalFaza; // Задаваемая длительность фазы ДУ (сек)
  let intervalFazaDop = datestat.intervalFazaDop; // Увеличениение длительности фазы ДУ (сек)
  if (!datestat.counterFaza) intervalFaza = intervalFazaDop = 0; // наличие счётчика длительность фазы ДУ
  const newMode = props.newMode;
  const timer = debug || DEMO ? 20000 : 60000;
  //========================================================
  const [trigger, setTrigger] = React.useState(true);
  const [flagPusk, setFlagPusk] = React.useState(false);
  const [openSoobErr, setOpenSoobErr] = React.useState(false);
  const scRef: any = React.useRef(null);
  const divRef: any = React.useRef(null);

  const StopSendFaza = (idx: number) => {
    for (let i = 0; i < massInt[idx].length; i++) {
      if (massInt[idx][i]) {
        clearInterval(massInt[idx][i]);
        massInt[idx][i] = null;
      }
    }
    timerId[idx] = null;
  };

  const StopCounter = (i: number) => {
    for (let j = 0; j < datestat.massInt[i].length; j++) {
      if (datestat.massInt[i][j]) {
        clearInterval(datestat.massInt[i][j]);
        datestat.massInt[i][j] = null;
      }
    }
    datestat.timerId[i] = null;
  };

  const ForcedClearInterval = () => {
    for (let i = 0; i < timerId.length; i++) if (timerId[i]) StopSendFaza(i); // сброс таймеров отправки фаз
    for (let i = 0; i < datestat.timerId.length; i++)
      if (datestat.timerId[i]) StopCounter(i); // сброс таймеров счётчиков длительности фаз
    dispatch(statsaveCreate(datestat));
  };

  const handleCloseSetEnd = () => {
    ForcedClearInterval(); // обнуление всех интервалов и остановка всех таймеров
    props.funcMode(0);
    props.funcHelper(true);
    toDoMode = datestat.working = datestat.toDoMode = false; // флаг выполнение режима
    massfaz = [];
    init = true;
    dispatch(massfazCreate(massfaz));
    dispatch(statsaveCreate(datestat));
  };

  const ToDoMode = (mode: number) => {
    let massIdevice: Array<number> = [];
    if (mode) {
      ClickKnop(0); // ставим на первый светофор
      for (let i = 0; i < massfaz.length; i++) {
        massIdevice.push(massfaz[i].idevice);
        let statusVertex = map.tflight[massfaz[i].idx].tlsost.num;
        massfaz[i].busy = GoodCODE.indexOf(statusVertex) < 0 ? false : true; // светофор занят другим пользователем?
      }
      dispatch(massfazCreate(massfaz));
      !DEMO && SendSocketRoute(massIdevice, true); // открыть маршрут
      toDoMode = datestat.toDoMode = true; // флаг выполнение режима
      dispatch(statsaveCreate(datestat));
      props.funcMode(mode);
      setTrigger(!trigger);
    } else {
      // принудительное закрытие
      console.log("Принудительное закрытие!!!");
      ForcedClearInterval(); // обнуление всех интервалов и остановка всех таймеров
      for (let i = 0; i < massfaz.length; i++) {
        if (massfaz[i].runRec === 2) {
          if (!DEMO) {
            SendSocketDispatch(massfaz[i].idevice, 9, 9); // КУ
            SendSocketDispatch(massfaz[i].idevice, 4, 0); // закрытие id
          }
        }
      }
      dispatch(massfazCreate(massfaz));
      handleCloseSetEnd(); // закончить исполнение
    }
  };

  const CloseVertex = (idx: number) => {
    if (idx) {
      let RunRec = massfaz[idx - 1].runRec;
      if (RunRec === 2 || RunRec === 4) {
        soobError = NoClose;
        setOpenSoobErr(true);
        return;
      }
    }
    StopSendFaza(idx);
    if (!DEMO) {
      SendSocketDispatch(massfaz[idx].idevice, 9, 9); // КУ
      SendSocketDispatch(massfaz[idx].idevice, 4, 0); // закрытие id
    }
    massfaz[idx].runRec = DEMO ? 5 : 1;
    massfaz[idx].fazaSist = massfaz[idx].fazaSistOld = -1;
    datestat.counterId[idx] = -1;
    dispatch(statsaveCreate(datestat));
    dispatch(massfazCreate(massfaz));
    console.log(idx + 1 + "-й светофор закрыт! ID", massfaz[idx].id);
    let ch = 0;
    if (massfaz.length > 2) {
      for (let i = 0; i < massfaz.length; i++)
        if (massfaz[i].runRec === 2 || massfaz[i].runRec === 4) ch++;
    }
    if (!ch) handleCloseSetEnd(); // закончить исполнение
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
      let statusVertex = map.tflight[massfaz[mode].idx].tlsost.num;
      let clinch = CLINCH.indexOf(statusVertex) < 0 ? false : true;
      let badCode = BadCODE.indexOf(statusVertex) < 0 ? false : true;
      if (massfaz[mode].runRec !== 5 && massfaz[mode].runRec !== 1) {
        if (DEMO) {
          datestat.counterId[mode]--; // счётчик
        } else if (!clinch && !badCode) datestat.counterId[mode]--; // счётчик
      }
      if (datestat.counterId[mode] <= 0) {
        // остановка и очистка счётчика "Прекращена отправка с", mode + 1
        StopCounter(mode);
        if (!datestat.counterId[mode]) {
          CloseVertex(mode); // закрыть светофор при достижении сч-ка 0
          props.changeDemo(mode);
        }
      }
      dispatch(statsaveCreate(datestat));
      needRend = true; // нужен ререндеринг
      setFlagPusk(!flagPusk);
    }
  };

  const DoTimerId = (mode: number) => {
    let fazer = massfaz[mode];
    if (!DEMO) {
      fazer.runRec === 2 && SendSocketDispatch(fazer.idevice, 9, fazer.faza);
    } else {
      if (!fazer.runRec || fazer.runRec === 5 || fazer.runRec === 1) {
        fazer.fazaSist = fazer.faza; // начало или финиш
      } else {
        if (fazer.fazaSist < 0) {
          massfaz[mode].fazaSist = 1;
        } else fazer.fazaSist = fazer.fazaSist === 2 ? 1 : 2;
      }
      dispatch(massfazCreate(massfaz));
      props.changeDemo(mode);
    }
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

  const StartVertex = (mode: number) => {
    let fazer = massfaz[mode];
    let statusVertex = map.tflight[fazer.idx].tlsost.num;
    let clinch = CLINCH.indexOf(statusVertex) < 0 ? false : true;
    let badCode = BadCODE.indexOf(statusVertex) < 0 ? false : true;
    if (!DEMO) {
      if (!fazer.busy && !clinch && !badCode) {
        SendSocketDispatch(fazer.idevice, 4, 1); // начало работы
        SendSocketDispatch(fazer.idevice, 9, fazer.faza);
        fazer.runRec = 2; // активирование
      }
    } else {
      fazer.runRec = 4; // активирование
      if (fazer.fazaSist < 0) massfaz[mode].fazaSist = massfaz[mode].faza;
      props.changeDemo(mode);
    }
    fazer.kolOpen++;
    timerId[mode] = setInterval(() => DoTimerId(mode), timer);
    massInt[mode].push(timerId[mode]);
    // запуск таймеров счётчиков длительности фаз
    if (intervalFaza) {
      datestat.timerId[mode] = setInterval(() => DoTimerCount(mode), 1000);
      datestat.massInt[mode].push(
        JSON.parse(JSON.stringify(datestat.timerId[mode]))
      );
      datestat.counterId[mode] = intervalFaza; // длительность фазы ДУ
      dispatch(statsaveCreate(datestat));
    }
    console.log(mode + 1 + "-й светофор пошёл", fazer.busy, fazer.id);
  };

  const ClickKnop = (mode: number) => {
    nomIllum = mode;
    datestat.nomIllum = mode;
    dispatch(statsaveCreate(datestat));
    let coor = map.routes[newMode].listTL[mode].point;
    let coord = [coor.Y, coor.X];
    props.funcCenter(coord);
    setTrigger(!trigger);
  };
  //=== инициализация ======================================
  if (init && !toDoMode && props.begin) {
    massfaz = [];
    timerId = [];
    datestat.massPath = []; // точки рабочего маршрута
    datestat.counterId = []; // счётчик длительности фаз
    datestat.timerId = []; // массив времени отправки команд на счётчики
    datestat.massInt = []; // массив интервалов отправки команд на счётчики
    for (let i = 0; i < props.massMem.length; i++) {
      massfaz.push(
        MakeMaskFaz(i, props.massMem[i], map, massdk, newMode, DEMO)
      );
      timerId.push(null);
      datestat.counterId.push(intervalFaza); // длительность фазы ДУ
      datestat.timerId.push(null); // массив времени отправки команд
    }
    for (let i = 0; i < props.massMem.length; i++) {
      massInt.push(JSON.parse(JSON.stringify(timerId)));
      datestat.massInt.push(JSON.parse(JSON.stringify(datestat.timerId)));
    }
    init = false;
    props.funcBegin(); // сброс признака первого входа из MainMapGs для этого режима
    dispatch(massfazCreate(massfaz));
    dispatch(statsaveCreate(datestat));
    ClickKnop(0); // ставим на первый светофор
  }
  // это для подсветки эл-та и скролла в таблице StrokaTabl
  if (datestat.nomIllum >= 0) {
    nomIllum = datestat.nomIllum;
    if (datestat.nomIllum > 5) {
      scRef.current && scRef.current.scrollTo(0, nomIllum * 56);
    } else if (props.stop < 6)
      scRef.current && scRef.current.scrollTo(0, nomIllum * 56);
  }
  if (props.start >= 0) {
    !massfaz[props.start].kolOpen && toDoMode && StartVertex(props.start); // запустить светофор
    props.funcStart(-1);
  }
  if (props.stop >= 0 && toDoMode) {
    CloseVertex(props.stop); // закрыть светофор
    props.funcStop(-1);
  }
  //========================================================
  const StrokaTabl = () => {
    const ClickVertex = (mode: number) => {
      if (
        massfaz[mode].runRec === 0 || // 0 -начало
        massfaz[mode].runRec === 1 || // 1 - финиш
        massfaz[mode].runRec === 5 // 5 - финиш Демо
      ) {
        StartVertex(mode);
      } else CloseVertex(mode); // закрыть светофор
      dispatch(massfazCreate(massfaz));
      ClickKnop(mode);
    };

    const ClickAddition = (idx: number) => {
      for (let i = 0; i < datestat.counterId.length; i++)
        if (i === idx) datestat.counterId[i] += intervalFazaDop;
      dispatch(statsaveCreate(datestat));
      setTrigger(!trigger);
    };

    let resStr = [];
    datestat.nomIllum = -1;
    dispatch(statsaveCreate(datestat));
    for (let i = 0; i < massfaz.length; i++) {
      let runREC = JSON.parse(JSON.stringify(massfaz[i].runRec));
      let bull = runREC === 2 || runREC === 4 ? " •" : " ";
      let takt: number | string = massfaz[i].faza;
      let fazaImg: null | string = null;
      massfaz[i].img.length >= massfaz[i].faza &&
        (fazaImg = massfaz[i].img[massfaz[i].faza - 1]);
      debug && (fazaImg = datestat.phSvg[massfaz[i].faza - 1]); // для отладки
      let illum = nomIllum === i ? styleStrokaTabl01 : styleStrokaTabl02;

      resStr.push(
        <Grid key={i} container sx={styleStrokaTabl03}>
          <Grid item xs={1} sx={{ paddingTop: 0.7, textAlign: "center" }}>
            <Button sx={illum} onClick={() => ClickKnop(i)}>
              {massfaz[i].id}
            </Button>
          </Grid>
          <GsFieldOfMiracles
            idx={i}
            func={ClickAddition}
            ClVert={ClickVertex}
          />
          <Grid item xs={0.2} sx={styleToDo02}>
            {bull}
          </Grid>
          <Grid item xs={1.0} sx={styleToDo01}>
            {takt}
          </Grid>
          <Grid item xs={2} sx={{ paddingTop: 1.2, textAlign: "center" }}>
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
          <Box ref={scRef} sx={{ overflowX: "auto", height: "82.5vh" }}>
            {StrokaTabl()}
            <div ref={divRef} />
          </Box>
        </Box>
        {FooterContentToDo(toDoMode, ToDoMode)}
      </Box>
      {openSoobErr && (
        <GsErrorMessage setOpen={setOpenSoobErr} sErr={soobError} />
      )}
    </>
  );
};

export default GsToDoMode;
