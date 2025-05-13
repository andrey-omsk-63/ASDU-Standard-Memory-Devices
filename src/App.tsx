import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { mapCreate, statsaveCreate } from "./redux/actions";
import { massdkCreate, coordinatesCreate } from "./redux/actions";
import { massmodeCreate, massfazCreate } from "./redux/actions";

import Grid from "@mui/material/Grid";

import MainMapGS from "./components/MainMapGs";
import AppSocketError from "./AppSocketError";

import { MasskPoint } from "./components/MapServiceFunctions";

import { SendSocketDispatch } from "./components/MapSocketFunctions";

import { dataMap } from "./otladkaMaps";
import { imgFaza } from "./otladkaRoutes";
import { dataHistory } from "./otladkaHistory"; // для отладки

import { zoomStart, CLINCH, BadCODE, GoodCODE } from "./components/MapConst";

export let dateMapGl: any;
export let dateRouteGl: any;
export let dateRouteProGl: any;
export interface Stater {
  ws: any;
  debug: boolean;
  demo: boolean;
  region: string;
  phSvg: Array<any>;
  hist: any;
  toDoMode: boolean;
  working: boolean;
  create: boolean;
  typeRoute: boolean; // тип отображаемых связей
  typeVert: number; // тип отображаемых CO на карте: 0 - значки СО 1 - картинка фаз 2 - номер фаз(счётчик)
  counterFaza: boolean; // наличие счётчика длительность фазы ДУ
  intervalFaza: number; // Задаваемая длительность фазы ДУ (сек)
  intervalFazaDop: number; // Увеличениение длительности фазы ДУ (сек)
  massPath: any; // точки рабочего маршрута
  counterId: Array<any>; // счётчик длительности фаз
  timerId: Array<any>; // массив времени отправки команд на счётчики
  massInt: any[][]; // массив интервалов отправки команд на счётчики
  nomIllum: number; // номер нажатого светофора в таблице
}

export let dateStat: Stater = {
  ws: null,
  debug: false,
  demo: false,
  region: "0",
  phSvg: [null, null, null, null, null, null, null, null],
  hist: dataHistory, // для отладки
  toDoMode: false,
  working: false,
  create: true,
  typeRoute: true, // тип отображаемых связей true - mаршрутизированные  false - неформальные
  typeVert: 0, // тип отображаемых CO на карте: 0 - значки СО 1 - картинка фаз 2 - номер фаз(счётчик)
  counterFaza: true, // наличие счётчика длительность фазы ДУ
  intervalFaza: 0, // Задаваемая длительность фазы ДУ (сек)
  intervalFazaDop: 0, // Увеличениение длительности фазы ДУ (сек)
  massPath: null, // точки рабочего маршрута
  counterId: [], // счётчик длительности фаз
  timerId: [], // массив времени отправки команд на счётчики
  massInt: [], // массив интервалов отправки команд на счётчики
  nomIllum: -1, // номер нажатого светофора в таблице
};

export interface Pointer {
  ID: number;
  coordinates: Array<number>;
  nameCoordinates: string;
  region: number;
  area: number;
  phases: Array<number>;
  phSvg: Array<string | null>;
  readIt: boolean;
}
export let massDk: Pointer[] = [];

export interface Fazer {
  kolOpen: number;
  runRec: number; // 0-начало 1-финиш 2-актив 3-хз 4-активДемо 5-финишДемо
  idx: number;
  id: number;
  coordinates: Array<number>;
  faza: number;
  fazaSist: number;
  fazaSistOld: number;
  phases: Array<number>;
  idevice: number;
  name: string;
  starRec: boolean;
  img: Array<string | null>;
  busy: boolean; // светофор занят/не занят другим пользователем
}
export let massFaz: Fazer[] = [];

let maskFaz: Fazer = {
  kolOpen: 0,
  runRec: 0, // 0-начало 1-финиш 2-актив 3-хз 4-активДемо 5-финишДемо
  idx: 0,
  id: -1, // id cветофора
  coordinates: [],
  faza: 1,
  fazaSist: -1,
  fazaSistOld: -1,
  phases: [],
  idevice: 0, // idevice cветофора
  name: "",
  starRec: false,
  img: [],
  busy: false, // светофор занят/не занят другим пользователем
};

export interface NameMode {
  name: string;
  delRec: boolean;
  kolOpen: number;
}
export let massMode: NameMode[] = [];

export let debug = false;
export let WS: any = null;

export let Coordinates: Array<Array<number>> = []; // массив координат

let flagOpen = true;
let flagOpenWS = true;
let homeRegion: string = "0";
let soob = "";
let flagInit = false;
let flagChange = false;

const App = () => {
  //== Piece of Redux ======================================
  let massdk = useSelector((state: any) => {
    const { massdkReducer } = state;
    return massdkReducer.massdk;
  });
  let massfaz = useSelector((state: any) => {
    const { massfazReducer } = state;
    return massfazReducer.massfaz;
  });
  let coordinates = useSelector((state: any) => {
    const { coordinatesReducer } = state;
    return coordinatesReducer.coordinates;
  });
  let massmode = useSelector((state: any) => {
    const { massmodeReducer } = state;
    return massmodeReducer.massmode;
  });
  const dispatch = useDispatch();
  //========================================================
  const Initialisation = () => {
    console.log("dateMapGl:", dateMapGl);
    for (let i = 0; i < dateMapGl.tflight.length; i++) {
      let masskPoint = MasskPoint(debug, dateMapGl.tflight[i], imgFaza);
      if (debug) masskPoint.phSvg = dateStat.phSvg; // костыль
      massdk.push(masskPoint);
      coordinates.push(masskPoint.coordinates);
    }
    let ch = 1;
    for (let i = 0; i < dateMapGl.routes.length; i++) {
      let nameZU = dateMapGl.routes[i].description;
      if (!nameZU) nameZU = "без имени(" + ch++ + ")"; // защита от дурака
      massmode.push({
        name: nameZU,
        delRec: false,
        kolOpen: 0,
      });
    }
    massfaz.push(maskFaz); // заготовка для massfaz
    dispatch(massdkCreate(massdk));
    dispatch(massfazCreate(massfaz));
    dispatch(coordinatesCreate(coordinates));
    dispatch(massmodeCreate(massmode));
  };

  // достать тип отображаемых связей из LocalStorage
  if (window.localStorage.typeRoute === undefined)
    window.localStorage.typeRoute = 0;
  dateStat.typeRoute = Number(window.localStorage.typeRoute) ? true : false;

  // достать тип отображаемых фаз на карте из LocalStorage
  if (window.localStorage.typeVert === undefined)
    window.localStorage.typeVert = 0;
  dateStat.typeVert = Number(window.localStorage.typeVert);

  // достать наличие счётчика длительность фазы ДУ из LocalStorage
  if (window.localStorage.counterFazaD === undefined)
    window.localStorage.counterFazaD = "0";
  dateStat.counterFaza = Number(window.localStorage.counterFazaD)
    ? true
    : false;

  // достать длительность фазы ДУ из LocalStorage
  if (window.localStorage.intervalFazaD === undefined)
    window.localStorage.intervalFazaD = "0";
  dateStat.intervalFaza = Number(window.localStorage.intervalFazaD);

  // достать увеличениение длительности фазы ДУ из LocalStorage
  if (window.localStorage.intervalFazaDopD === undefined)
    window.localStorage.intervalFazaDopD = "0";
  dateStat.intervalFazaDop = !dateStat.intervalFaza
    ? 0
    : Number(window.localStorage.intervalFazaDopD);

  // достать начальный zoom Yandex-карты ДУ из LocalStorage
  if (window.localStorage.ZoomDU === undefined)
    window.localStorage.ZoomDU = zoomStart;

  // достать центр координат [0] Yandex-карты ДУ из LocalStorage
  if (window.localStorage.PointCenterDU0 === undefined)
    window.localStorage.PointCenterDU0 = 0;

  // достать центр координат [1] Yandex-карты ДУ из LocalStorage
  if (window.localStorage.PointCenterDU1 === undefined)
    window.localStorage.PointCenterDU1 = 0;

  const host =
    "wss://" +
    window.location.host +
    window.location.pathname +
    "W" +
    window.location.search;

  const [openSetErr, setOpenSetErr] = React.useState(false);
  const [openMapInfo, setOpenMapInfo] = React.useState(false);
  const [history, setHistory] = React.useState(null);
  const [trigger, setTrigger] = React.useState(false);
  const [trHist, setTrHist] = React.useState(false);
  //=== инициализация ======================================
  if (flagOpenWS) {
    WS = new WebSocket(host);
    dateStat.ws = WS;
    if (
      WS.url.slice(0, 20) === "wss://localhost:3000" ||
      WS.url.slice(0, 27) === "wss://andrey-omsk-63.github"
    )
      dateStat.debug = debug = true;
    dispatch(statsaveCreate(dateStat));
    flagOpenWS = false;
  }

  React.useEffect(() => {
    WS.onopen = function (event: any) {
      console.log("WS.current.onopen:", event);
    };

    WS.onclose = function (event: any) {
      console.log("WS.current.onclose:", event);
    };

    WS.onerror = function (event: any) {
      console.log("WS.current.onerror:", event);
    };

    const ActionOnPhases = (data: any) => {
      if (!dateStat.demo) {
        flagChange = false;
        for (let i = 0; i < data.phases.length; i++) {
          for (let j = 0; j < massfaz.length; j++) {
            if (massfaz[j].idevice === data.phases[i].device) {
              let dtf = data.phases[i].phase;
              let statusVertex = dateMapGl.tflight[massfaz[j].idx].tlsost.num;
              let clinch = CLINCH.indexOf(statusVertex) < 0 ? false : true;
              let badCode = BadCODE.indexOf(statusVertex) < 0 ? false : true;
              if (!clinch && !badCode && dateStat.toDoMode) {
                if (dtf && massfaz[j].fazaSist !== dtf && !massfaz[j].busy) {
                  massfaz[j].fazaSist = dtf;
                  flagChange = true;
                }
              }
            }
          }
        }
        if (flagChange) {
          dispatch(massfazCreate(massfaz));
          !dateStat.demo && setTrigger(!trigger);
        }
      }
    };

    const ActionOnTflight = (data: any) => {
      let flagChange = false;
      for (let i = 0; i < data.tflight.length; i++) {
        for (let j = 0; j < dateMapGl.tflight.length; j++) {
          if (dateMapGl.tflight[j].idevice === data.tflight[i].idevice) {
            dateMapGl.tflight[j].tlsost = data.tflight[i].tlsost;
            flagChange = true;
            // проверка на то, что занятый другим пользователем светофор освободился
            let statusVertex = dateMapGl.tflight[j].tlsost.num;
            let clinch = CLINCH.indexOf(statusVertex) < 0 ? false : true;
            let badCode = BadCODE.indexOf(statusVertex) < 0 ? false : true;
            let goodCode = GoodCODE.indexOf(statusVertex) < 0 ? false : true;
            if (!clinch && !badCode && !dateStat.demo) {
              for (let jj = 0; jj < massfaz.length; jj++) {
                let fz = massfaz[jj];
                if (dateMapGl.tflight[j].idevice === fz.idevice) {
                  if (!goodCode) {
                    if (fz.busy || !fz.runRec) {
                      fz.busy = false; // светофор освобождён другим пользоватем
                      if (fz.kolOpen) {
                        SendSocketDispatch(fz.idevice, 4, 1); // начало работы
                        SendSocketDispatch(fz.idevice, 9, fz.faza); // послать фазу на не занятый светофор
                        fz.runRec = 2; // светофор активирован
                        console.log("ID", fz.id, " светофор АКТИВИРОВАН", fz);
                      }
                      dispatch(massfazCreate(massfaz));
                    }
                  }
                }
              }
            }
          }
        }
      }
      if (flagChange) {
        dispatch(mapCreate(dateMapGl));
        setTrigger(!trigger);
      }
    };

    WS.onmessage = function (event: any) {
      let allData = JSON.parse(event.data);
      let data = allData.data;
      //console.log("пришло:", data.error, allData.type, data);
      switch (allData.type) {
        case "tflight":
          //console.log("Tflight:", data, data.tflight);
          ActionOnTflight(data);
          break;
        case "phases":
          //console.log("phases:", data, massfaz);
          ActionOnPhases(data);
          break;
        case "mapInfo":
          dateMapGl = JSON.parse(JSON.stringify(data));
          dispatch(mapCreate(dateMapGl));
          homeRegion = dateMapGl.tflight[0].region.num;
          dateStat.region = homeRegion;
          dispatch(statsaveCreate(dateStat));
          flagInit = true;
          setOpenMapInfo(true);
          break;
        case "getPhases":
          //console.log("getPhases:", data);
          for (let i = 0; i < massdk.length; i++) {
            if (massdk[i].ID === data.pos.id) {
              massdk[i].readIt = true; // флаг прочтения картинок фаз
              if (data.images) {
                if (data.images.length) {
                  for (let j = 0; j < data.images.length; j++) {
                    let k = Number(data.images[j].num);
                    if (k <= massdk[i].phSvg.length)
                      massdk[i].phSvg[k - 1] = data.images[j].phase;
                  }
                  dispatch(massdkCreate(massdk));
                }
                break;
              }
              // else {
              //   massdk[i].phSvg[0] = imgFaza; // костыль
              //   massdk[i].phSvg[1] = null;
              //   massdk[i].phSvg[2] = imgFaza;
              //   massdk[i].phSvg[3] = null;
              //   massdk[i].phSvg[4] = imgFaza;
              // }
            }
          }
          break;
        case "getRouteHistory":
          console.log("getRouteHistory:", data, data.history);
          setTrHist(!trHist);
          setHistory(data.history);
          break;
        default:
          console.log("data_default:", allData.type, data);
      }
    };
  }, [dispatch, massdk, massfaz, trigger, trHist]);

  if (dateStat.debug && flagOpen) {
    console.log("РЕЖИМ ОТЛАДКИ!!!");
    dateMapGl = JSON.parse(JSON.stringify(dataMap));
    dispatch(mapCreate(dateMapGl));
    let massRegion = [];
    for (let key in dateMapGl.regionInfo)
      if (!isNaN(Number(key))) massRegion.push(Number(key));
    homeRegion = massRegion[0].toString();
    dateStat.region = homeRegion;
    dateStat.phSvg[0] = imgFaza;
    dateStat.phSvg[1] = null;
    dateStat.phSvg[2] = imgFaza;
    dateStat.phSvg[3] = null;
    dateStat.phSvg[4] = imgFaza;
    dispatch(statsaveCreate(dateStat));
    flagInit = true;
    flagOpen = false;
    setOpenMapInfo(true);
  }

  if (flagInit && !flagOpenWS) {
    Initialisation();
    flagInit = false;
  }

  return (
    <Grid container sx={{ height: "100vh", width: "100%", bgcolor: "#E9F5D8" }}>
      <Grid item xs>
        {openSetErr && <AppSocketError sErr={soob} setOpen={setOpenSetErr} />}
        {openMapInfo && (
          <MainMapGS trigger={trigger} history={history} trHist={trHist} />
        )}
      </Grid>
    </Grid>
  );
};

export default App;
