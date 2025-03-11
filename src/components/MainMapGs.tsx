import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { mapCreate, massmodeCreate } from "../redux/actions";
import { massfazCreate, statsaveCreate } from "../redux/actions";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import { YMaps, Map, YMapsApi } from "react-yandex-maps";

import GsSelectMD from "./GsComponents/GsSelectMD";
import GsSetPhase from "./GsComponents/GsSetPhase";
import GsToDoMode from "./GsComponents/GsToDoMode";
import GsErrorMessage from "./GsComponents/GsErrorMessage";
import GsDoPlacemarkDo from "./GsComponents/GsDoPlacemarkDo";
import GsSetup from "./GsComponents/GsSetup";
import GsFragments from "./GsComponents/GsFragments";

import { getMultiRouteOptions, StrokaHelp } from "./MapServiceFunctions";
import { CenterCoordBegin, PutItInAFrame } from "./MapServiceFunctions";
import { ErrorHaveVertex, Distance, SaveZoom } from "./MapServiceFunctions";
import { StrokaMenuGlob, HelpAdd, YandexServices } from "./MapServiceFunctions";
import { StrokaMenuDop } from "./MapServiceFunctions";

import { SendSocketUpdateRoute } from "./MapSocketFunctions";
import { SendSocketDispatch } from "./MapSocketFunctions";

import { YMapsModul, MyYandexKey } from "./MapConst";

import { styleServisTable } from "./MainMapStyle";

let flagOpen = false;
let zoom = 0;
let pointCenter: any = 0;

let massMem: Array<number> = [];
let massCoord: any = [];
let newMode = -1;
let soobErr = "";
let helper = true;

let xsMap = 11.99;
let widthMap = "99.9%";
let modeToDo = 0;
let newCenter: any = [];
let funcContex: any = null;
let funcBound: any = null;

const MainMapGs = (props: {
  trigger: boolean;
  history: any;
  trHist: boolean;
}) => {
  //== Piece of Redux =======================================
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
  let massmode = useSelector((state: any) => {
    const { massmodeReducer } = state;
    return massmodeReducer.massmode;
  });
  let coordinates = useSelector((state: any) => {
    const { coordinatesReducer } = state;
    return coordinatesReducer.coordinates;
  });
  let datestat = useSelector((state: any) => {
    const { statsaveReducer } = state;
    return statsaveReducer.datestat;
  });
  const typeRoute = datestat.typeRoute; // тип отображаемых связей
  const debug = datestat.debug;
  const ws = datestat.ws;
  const dispatch = useDispatch();
  const DEMO = datestat.demo;
  //===========================================================
  const [flagPusk, setFlagPusk] = React.useState(false);
  const [needSetup, setNeedSetup] = React.useState(false);
  const [fragments, setFragments] = React.useState(false);
  const [selectMD, setSelectMD] = React.useState(false);
  const [setPhase, setSetPhase] = React.useState(false);
  const [toDoMode, setToDoMode] = React.useState(false);
  const [flagCenter, setFlagCenter] = React.useState(false);
  const [openSoobErr, setOpenSoobErr] = React.useState(false);
  const [risovka, setRisovka] = React.useState(false);
  const [trigger, setTrigger] = React.useState(false);
  const [changeFaz, setChangeFaz] = React.useState(false);
  const [stopCount, setStopCount] = React.useState(-1);
  const [startCount, setStartCount] = React.useState(-1);
  const [ymaps, setYmaps] = React.useState<YMapsApi | null>(null);
  const mapp = React.useRef<any>(null);

  const ReceiveIdxGs = (mode: number) => {
    let massErrRec = [];
    massMem = [];
    massCoord = [];
    for (let i = 0; i < map.routes[mode].listTL.length; i++) {
      let idx = -1;
      for (let j = 0; j < map.tflight.length; j++) {
        if (
          map.routes[mode].listTL[i].pos.region === map.tflight[j].region.num &&
          map.routes[mode].listTL[i].pos.area === map.tflight[j].area.num &&
          map.routes[mode].listTL[i].pos.id === map.tflight[j].ID
        ) {
          idx = j;
          break;
        }
      }
      if (idx < 0) {
        ErrorHaveVertex(map.routes[mode].listTL[i].pos);
        massErrRec.push(i);
      } else {
        let masscoord: any = [];
        masscoord[0] = map.routes[mode].listTL[i].point.Y;
        masscoord[1] = map.routes[mode].listTL[i].point.X;
        massMem.push(idx);
        massCoord.push(masscoord);
      }
    }
    if (massErrRec.length) {
      let massRabMap = []; // редактируем у себя map
      for (let i = 0; i < map.routes[mode].listTL.length; i++)
        if (!massErrRec.includes(i))
          massRabMap.push(map.routes[mode].listTL[i]);
      map.routes[mode].listTL = massRabMap;
      SendSocketUpdateRoute(debug, ws, map.routes[mode]);
      dispatch(mapCreate(map));
    }
    newMode = mode;
    ymaps && addRoute(ymaps, true); // перерисовка связей
    setFlagPusk(!flagPusk);
  };

  const addRoute = (ymaps: any, bound: boolean) => {
    mapp.current.geoObjects.removeAll(); // удаление старой коллекции связей
    let massMultiPath: any = []; // исходящие связи
    if (massCoord.length > 1) {
      let multiRoute: any = [];
      if (typeRoute) {
        let between = [];
        for (let i = 1; i < massCoord.length - 1; i++) between.push(i);
        multiRoute = new ymaps.multiRouter.MultiRoute(
          {
            referencePoints: massCoord,
            params: { viaIndexes: between },
          },
          getMultiRouteOptions()
        );
        mapp.current.geoObjects.add(multiRoute);
      } else {
        for (let i = 0; i < massCoord.length - 1; i++) {
          massMultiPath[i] = new ymaps.Polyline( // формальные связи
            [massCoord[i], massCoord[i + 1]],
            {},
            getMultiRouteOptions()
          );
          mapp.current.geoObjects.add(massMultiPath[i]);
        }
      }
      bound && PutItInAFrame(ymaps, mapp, massCoord);
    }
  };

  const StatusQuo = () => {
    massMem = [];
    massCoord = [];
    newMode = -1;
    datestat.create = true;
    dispatch(statsaveCreate(datestat));
    ymaps && addRoute(ymaps, false); // перерисовка связей
    setTrigger(!trigger);
  };

  const SetFragments = (idx: number) => {
    if (idx >= 0 && ymaps) {
      mapp.current.geoObjects.removeAll(); // удаление старой коллекции связей
      PutItInAFrame(ymaps, mapp, massCoord); // расположить фрагмент в границах экрана
    }
    setFragments(false);
  };

  const MakeNewMassMem = (mass: any) => {
    if (mass.length) {
      massMem = [];
      let masRab = [];
      for (let i = 0; i < mass.length; i++) {
        massMem.push(mass[i].idx);
        masRab.push(massdk[mass[i].idx].coordinates);
      }
      massCoord = [];
      massCoord = masRab;
      ymaps && addRoute(ymaps, false); // перерисовка связей
      setFlagPusk(!flagPusk);
    } else StatusQuo();
  };

  const OnPlacemarkClickPoint = (index: number) => {
    if (!datestat.working) {
      let nomInMass = massMem.indexOf(index);
      let masscoord: any = [];
      if (newMode < 0) {
        // создание нового режима
        if (nomInMass < 0) {
          massMem.push(index);
          masscoord[0] = map.tflight[index].points.Y;
          masscoord[1] = map.tflight[index].points.X;
          massCoord.push(masscoord);
        } else {
          massMem.splice(nomInMass, 1);
          massCoord.splice(nomInMass, 1);
        }
        ymaps && addRoute(ymaps, false); // перерисовка связей
        setFlagPusk(!flagPusk);
      } else {
        // работа с существующем режимом
        if (nomInMass >= 0 && nomInMass < massMem.length) {
          if (nomInMass + 1 < massMem.length) {
            masscoord[0] = map.tflight[massMem[nomInMass + 1]].points.Y;
            masscoord[1] = map.tflight[massMem[nomInMass + 1]].points.X;
            NewPointCenter(masscoord);
          }
          if (datestat.toDoMode) {
            massfaz[nomInMass].runRec = datestat.demo ? 4 : 2; // включить исполнение
            dispatch(massfazCreate(massfaz));
            setStartCount(nomInMass); // запрос на запуск отправки фазы
            setChangeFaz(!changeFaz);
          }
        }
      }
    }
  };
  //=== вывод светофоров ===================================
  const PlacemarkDo = () => {
    return (
      <>
        {flagOpen &&
          coordinates.map((coordinate: any, idx: any) => (
            <GsDoPlacemarkDo
              key={idx}
              ymaps={ymaps}
              coordinate={coordinate}
              idx={idx}
              massMem={massMem}
              OnPlacemarkClickPoint={OnPlacemarkClickPoint}
            />
          ))}
      </>
    );
  };
  //=== обработка instanceRef ==============================
  const FindNearVertex = (coord: Array<number>) => {
    let nomInMap = -1;
    let minDist = 999999;
    if (!datestat.toDoMode) {
      nomInMap = -1;
      for (let i = 0; i < map.tflight.length; i++) {
        let corFromMap = [map.tflight[i].points.Y, map.tflight[i].points.X];
        let dister = Distance(coord, corFromMap);
        if (dister < 100 && minDist > dister) {
          minDist = dister;
          nomInMap = i;
        }
      }
      if (nomInMap < 0) {
        soobErr =
          "В радиусе 100м от указанной точки управляемые перекрёстки отсутствуют";
        setOpenSoobErr(true);
      } else {
        if (massMem.indexOf(nomInMap) >= 0) {
          soobErr = "Перекрёсток [" + massdk[nomInMap].region + ", ";
          soobErr += massdk[nomInMap].area + ", " + massdk[nomInMap].ID + ", ";
          soobErr += map.tflight[nomInMap].idevice + "] уже используется";
          setOpenSoobErr(true);
        } else {
          massMem.push(nomInMap);
          massCoord.push(coord);
          setRisovka(true);
        }
      }
    } else {
      for (let i = 0; i < massMem.length; i++) {
        let corFromMap = [massfaz[i].coordinates[0], massfaz[i].coordinates[1]];
        let dister = Distance(coord, corFromMap);
        if (dister < 200 && minDist > dister) {
          minDist = dister; // нажали правой кнопкой на светофор
          nomInMap = i;
        }
      }
      if (nomInMap < 0) {
        // нажали правой кнопкой в чистое поле
        for (let i = 0; i < massMem.length; i++) {
          if (massfaz[i].runRec === 2) {
            nomInMap = i;
            break;
          }
        }
      }
      if (nomInMap >= 0) {
        setStopCount(nomInMap); // запрос на остановку отправки фазы
        dispatch(massfazCreate(massfaz));
        setChangeFaz(!changeFaz);
        setRisovka(true);
      }
    }
  };

  const Pererisovka = () => {
    if (risovka) {
      ymaps && addRoute(ymaps, false); // перерисовка связей
      setRisovka(false);
    }
  };

  const InstanceRefDo = (ref: React.Ref<any>) => {
    if (ref) {
      mapp.current = ref;
      mapp.current.events.remove("contextmenu", funcContex);
      funcContex = function (e: any) {
        if (mapp.current.hint && !datestat.working)
          FindNearVertex(e.get("coords")); // нажата правая кнопка мыши
      };
      mapp.current.events.add("contextmenu", funcContex);
      mapp.current.events.remove("boundschange", funcBound);
      funcBound = function () {
        pointCenter = mapp.current.getCenter();
        zoom = mapp.current.getZoom(); // покрутили колёсико мыши
        SaveZoom(zoom, pointCenter);
      };
      mapp.current.events.add("boundschange", funcBound);
      if (flagCenter) {
        pointCenter = newCenter;
        SaveZoom(zoom, pointCenter);
        setFlagCenter(false);
      }
    }
  };
  //========================================================
  const NewPointCenter = (coord: any) => {
    newCenter = coord;
    setFlagCenter(true);
  };

  const OldSizeWind = (size: number) => {
    xsMap = size;
    widthMap = "99.9%";
    modeToDo = 0;
    setToDoMode(false);
    setFlagPusk(!flagPusk);
  };

  const ModeToDo = (mod: number) => {
    modeToDo = mod;
    if (!modeToDo) StatusQuo();
    setFlagPusk(!flagPusk);
  };

  const SetHelper = (mod: boolean) => {
    helper = mod;
    setFlagPusk(!flagPusk);
  };

  const PressButton = (mode: number) => {
    console.log("Mode:", mode);
    switch (mode) {
      case 41: // удалить режим
        massmode[newMode].delRec = true;
        dispatch(massmodeCreate(massmode));
        StatusQuo();
        ymaps && addRoute(ymaps, false); // перерисовка связей
        setFlagPusk(!flagPusk);
        break;
      case 42: // выбор режима ЗУ
        StatusQuo();
        if (massMem.length) {
          ymaps && addRoute(ymaps, true); // перерисовка связей
          setFlagPusk(!flagPusk);
        }
        helper = false;
        datestat.create = false;
        dispatch(statsaveCreate(datestat));
        setSelectMD(true);
        break;
      case 43: // переход к созданию нового режима
        helper = true;
        StatusQuo();
        break;
      case 44: // назначить фазы
        datestat.working = true;
        dispatch(statsaveCreate(datestat));
        setSetPhase(true);
        break;
      case 45: // выполнить режим
        if (massmode[newMode].delRec) {
          soobErr = "Данный режим помечен к удалению";
          setOpenSoobErr(true);
        } else {
          xsMap = 7.7;
          widthMap = "99.9%";
          modeToDo = 1;
          setToDoMode(true);
          setFlagPusk(!flagPusk);
        }
        break;
      case 46: // Настройки
        helper = true;
        StatusQuo();
        setNeedSetup(true);
        break;
      case 47: // режим Demo
        soobErr = "Данный режим пока не реализован";
        setOpenSoobErr(true);
        break;
      case 48: // Фрагменты
        soobErr =
          "Нет фрагментов Яндекс-карты для вашего аккаунта, создайте их на главной странице системы";
        if (!map.fragments) {
          setOpenSoobErr(true);
        } else {
          if (map.fragments.length) {
            helper = true;
            StatusQuo();
            setFragments(true);
          } else setOpenSoobErr(true);
        }
    }
  };

  //=== инициализация ======================================
  if (!flagOpen && Object.keys(map.tflight).length) {
    let point0 = window.localStorage.PointCenterDU0;
    let point1 = window.localStorage.PointCenterDU1;
    if (!Number(point0) || !Number(point1)) {
      pointCenter = CenterCoordBegin(map); // начальные координаты центра отоброжаемой карты
    } else pointCenter = [Number(point0), Number(point1)];
    zoom = Number(window.localStorage.ZoomDU); // начальный zoom Yandex-карты ДУ
    flagOpen = true;
  }
  //========================================================
  const MenuGl = () => {
    let soobHelp = "Выберите перекрёстки для создания нового маршрута";
    let soobHelpFiest = "Добавьте/удалите перекрёстки для создания маршрута [";
    soobHelpFiest += massMem.length;
    let soobInfo = "Подготовка к выпонению режима";
    modeToDo === 2 && (soobInfo = "Происходит выполнение режима");

    return (
      <Box sx={{ display: "flex" }}>
        {modeToDo > 0 && <>{StrokaHelp(soobInfo, 0)}</>}
        {modeToDo === 0 && (
          <>
            {StrokaMenuGlob(PressButton)}
            {massMem.length < 1 && helper && <>{StrokaHelp(soobHelp, 0)}</>}
            {massMem.length === 1 && helper && <>{HelpAdd(soobHelpFiest)}</>}
            {massMem.length > 1 && (
              <>
                {newMode < 0 && (
                  <>
                    {StrokaMenuDop("Закрыть режим", PressButton, 43)}
                    {StrokaMenuDop("Обработка режима", PressButton, 44)}
                  </>
                )}
                {newMode < 0 && <>{HelpAdd(soobHelpFiest)}</>}
                {newMode >= 0 && (
                  <>
                    {StrokaMenuDop("Закрыть режим", PressButton, 43)}
                    {StrokaMenuDop("Удалить режим", PressButton, 41)}
                    {StrokaMenuDop("Редактировать фазы", PressButton, 44)}
                    {StrokaMenuDop("Выполнить режим", PressButton, 45)}
                  </>
                )}
              </>
            )}
          </>
        )}
      </Box>
    );
  };
  //=== Закрытие или перезапуск вкладки ====================
  function removePlayerFromGame() {
    throw new Error("Функция не реализована");
  }

  const Closing = () => {
    for (let i = 0; i < massfaz.length; i++) {
      if (massfaz[i].runRec === 2)
        !DEMO && SendSocketDispatch(debug, ws, massfaz[i].idevice, 9, 9);
    }
  };

  const handleTabClosing = () => {
    Closing();
    removePlayerFromGame();
  };

  const alertUser = (event: any) => {
    Closing();
  };

  React.useEffect(() => {
    window.addEventListener("beforeunload", alertUser);
    window.addEventListener("unload", handleTabClosing);

    return () => {
      window.removeEventListener("beforeunload", alertUser);
      window.removeEventListener("unload", handleTabClosing);
    };
  });
  //========================================================
  let mapState: any = {
    center: pointCenter,
    zoom: zoom,
  };

  return (
    <Grid container sx={{ height: "99.9vh" }}>
      <Grid item xs>
        {!datestat.working && <>{MenuGl()}</>}
        {datestat.working && (
          <>{StrokaHelp("Происходит обработка режима", 0)}</>
        )}
        <Grid container sx={{ border: 0, height: "96.9vh" }}>
          <Grid item xs={xsMap} sx={{ border: 0 }}>
            {Object.keys(map.tflight).length && (
              <YMaps query={{ apikey: MyYandexKey, lang: "ru_RU" }}>
                <Map
                  modules={YMapsModul}
                  state={mapState}
                  instanceRef={(ref) => InstanceRefDo(ref)} // обработка действий с правой кнопкой и колёсиком мыши
                  onLoad={(ref) => {
                    ref && setYmaps(ref);
                  }}
                  width={widthMap}
                  height={"99.9%"}
                >
                  {YandexServices()}
                  {Pererisovka()}
                  <PlacemarkDo />
                  {selectMD && (
                    <GsSelectMD
                      setOpen={setSelectMD}
                      receive={ReceiveIdxGs}
                      history={props.history}
                      trHist={props.trHist}
                      funcHelper={SetHelper}
                    />
                  )}
                  {setPhase && (
                    <GsSetPhase
                      setOpen={setSetPhase}
                      newMode={newMode}
                      massMem={massMem}
                      massCoord={massCoord}
                      func={MakeNewMassMem}
                    />
                  )}
                  {fragments && <GsFragments close={SetFragments} />}
                  {openSoobErr && (
                    <GsErrorMessage setOpen={setOpenSoobErr} sErr={soobErr} />
                  )}
                </Map>
              </YMaps>
            )}
          </Grid>
        </Grid>
        {toDoMode && (
          <Box sx={styleServisTable}>
            <GsToDoMode
              newMode={newMode}
              massMem={massMem}
              funcMode={ModeToDo}
              funcSize={OldSizeWind}
              funcCenter={NewPointCenter}
              funcHelper={SetHelper}
              trigger={props.trigger}
              changeFaz={changeFaz}
              start={startCount}
              funcStart={setStartCount}
              stop={stopCount}
              funcStop={setStopCount}
            />
          </Box>
        )}
      </Grid>
      {needSetup && <GsSetup close={setNeedSetup} />}
    </Grid>
  );
};

export default MainMapGs;
