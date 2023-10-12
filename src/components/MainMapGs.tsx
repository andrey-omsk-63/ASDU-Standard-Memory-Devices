import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { mapCreate, massmodeCreate } from "../redux/actions";
import { massfazCreate, statsaveCreate } from "../redux/actions";

import Grid from "@mui/material/Grid";

import { YMaps, Map, FullscreenControl } from "react-yandex-maps";
import { GeolocationControl, YMapsApi } from "react-yandex-maps";
import { RulerControl, SearchControl } from "react-yandex-maps";
import { TrafficControl, TypeSelector, ZoomControl } from "react-yandex-maps";

import GsSelectMD from "./GsComponents/GsSelectMD";
import GsSetPhase from "./GsComponents/GsSetPhase";
import GsToDoMode from "./GsComponents/GsToDoMode";
import GsErrorMessage from "./GsComponents/GsErrorMessage";
import GsDoPlacemarkDo from "./GsComponents/GsDoPlacemarkDo";

import { getMultiRouteOptions, StrokaHelp } from "./MapServiceFunctions";
import { getReferencePoints, CenterCoord } from "./MapServiceFunctions";
import { ErrorHaveVertex, Distance } from "./MapServiceFunctions";
import { StrokaMenuGlob, StrokaHelpPusto } from "./MapServiceFunctions";

import { SendSocketUpdateRoute } from "./MapSocketFunctions";

import { searchControl } from "./MainMapStyle";

let flagOpen = false;

const zoomStart = 10;
let zoom = zoomStart;
let pointCenter: any = 0;
let pointCenterEt: any = 0;

let massMem: Array<number> = [];
let massCoord: any = [];
let newMode = -1;
let soobErr = "";
let helper = true;

let xsMap = 11.99;
let xsTab = 0.01;
let widthMap = "99.9%";

let modeToDo = 0;
let newCenter: any = [];
let funcContex: any = null;
let funcBound: any = null;

const MainMapGs = (props: { trigger: boolean; history: any }) => {
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
  const debug = datestat.debug;
  const ws = datestat.ws;
  const dispatch = useDispatch();
  //===========================================================
  const [flagPusk, setFlagPusk] = React.useState(false);
  const [selectMD, setSelectMD] = React.useState(false);
  const [setPhase, setSetPhase] = React.useState(false);
  const [toDoMode, setToDoMode] = React.useState(false);
  const [flagCenter, setFlagCenter] = React.useState(false);
  const [openSoobErr, setOpenSoobErr] = React.useState(false);
  const [risovka, setRisovka] = React.useState(false);
  const [trigger, setTrigger] = React.useState(false);
  const [changeFaz, setChangeFaz] = React.useState(false);

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
      for (let i = 0; i < map.routes[mode].listTL.length; i++) {
        if (!massErrRec.includes(i))
          massRabMap.push(map.routes[mode].listTL[i]);
      }
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
    if (massCoord.length > 1) {
      let multiRoute: any = [];
      if (massCoord.length === 2) {
        multiRoute = new ymaps.multiRouter.MultiRoute(
          getReferencePoints(massCoord[0], massCoord[1]),
          getMultiRouteOptions()
        );
      } else {
        let between = [];
        for (let i = 1; i < massCoord.length - 1; i++) between.push(i);
        multiRoute = new ymaps.multiRouter.MultiRoute(
          {
            referencePoints: massCoord,
            params: { viaIndexes: between },
          },
          { boundsAutoApply: bound, wayPointVisible: false }
        );
      }
      mapp.current.geoObjects.add(multiRoute);
    }
  };

  // const StatusQuo = () => {
  //   massMem = [];
  //   massCoord = [];
  //   newMode = -1;
  //   //mapState.zoom = zoomStart - 0.01;
  //   zoom = zoomStart - 0.01;
  //   datestat.create = true;
  //   dispatch(statsaveCreate(datestat));
  //   ymaps && addRoute(ymaps, false); // перерисовка связей
  //   //NewPointCenter(pointCenterEt);
  //   //pointCenter = pointCenterEt;
  //   //mapState.center = pointCenterEt;
  //   NewPointCenter(pointCenterEt);
  //   console.log("StatusQuo отработал:", mapState);
  //   //setTrigger(!trigger);
  // };

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
    } else {
      StatusQuo();
    }
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
            massfaz[nomInMass].runRec = true; // включить исполнение
            dispatch(massfazCreate(massfaz));
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
      //let nomInMass = -1;
      for (let i = 0; i < massMem.length; i++) {
        let corFromMap = [massfaz[i].coordinates[0], massfaz[i].coordinates[1]];
        let dister = Distance(coord, corFromMap);
        if (dister < 200 && minDist > dister) {
          // нажали правой кнопкой на светофор
          minDist = dister;
          nomInMap = i;
        }
      }
      if (nomInMap < 0) {
        // нажали правой кнопкой в чистое поле
        for (let i = 0; i < massMem.length; i++) {
          if (massfaz[i].runRec) {
            nomInMap = i;
            break;
          }
        }
      }
      if (nomInMap >= 0) {
        massfaz[nomInMap].runRec = false;
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
      };
      mapp.current.events.add("boundschange", funcBound);
      if (flagCenter) {
        pointCenter = newCenter;
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
    xsTab = 0.01;
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
          //StatusQuo();
          ymaps && addRoute(ymaps, false); // перерисовка связей
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
          xsTab = 4.3;
          widthMap = "99.9%";
          modeToDo = 1;
          setToDoMode(true);
          setFlagPusk(!flagPusk);
        }
    }
  };

  //=== инициализация ======================================
  if (!flagOpen && Object.keys(map.tflight).length) {
    pointCenter = CenterCoord(
      map.boxPoint.point0.Y,
      map.boxPoint.point0.X,
      map.boxPoint.point1.Y,
      map.boxPoint.point1.X
    );
    pointCenterEt = pointCenter;
    flagOpen = true;
  }
  //========================================================

  const MenuGl = (mod: number) => {
    let soobHelp = "Выберите перекрёстки для создания нового маршрута";
    let soobHelpFiest = "Добавьте/удалите перекрёстки для создания маршрута [";
    soobHelpFiest += massMem.length + "🔆]";
    let soobInfo = "Подготовка к выпонению режима";
    modeToDo === 2 && (soobInfo = "Происходит выполнение режима");

    return (
      <>
        {/* <Box sx={{ display: "flex", justifyContent: "space-between" }}> */}
        {modeToDo > 0 && <>{StrokaHelp(soobInfo)}</>}
        {modeToDo === 0 && (
          <>
            {StrokaMenuGlob("Существующие ЗУ", PressButton, 42)}

            {massMem.length < 1 && helper && <>{StrokaHelp(soobHelp)}</>}
            {massMem.length === 1 && helper && <>{StrokaHelp(soobHelpFiest)}</>}
            {massMem.length > 1 && (
              <>
                {newMode < 0 && (
                  <>
                    {StrokaMenuGlob("Закрыть режим", PressButton, 43)}
                    {StrokaMenuGlob("Обработка режима", PressButton, 44)}
                  </>
                )}
                {newMode < 0 && <>{StrokaHelp(soobHelpFiest)}</>}
                {newMode >= 0 && (
                  <>
                    {StrokaMenuGlob("Закрыть режим", PressButton, 43)}
                    {StrokaMenuGlob("Удалить режим", PressButton, 41)}
                    {StrokaMenuGlob("Редактировать фазы", PressButton, 44)}
                    {StrokaMenuGlob("Выполнить режим", PressButton, 45)}
                  </>
                )}
              </>
            )}
            {StrokaHelpPusto()}
          </>
        )}
      </>
      // </Box>
    );
  };

  let mapState: any = {
    center: pointCenter,
    zoom: zoom,
  };

  const StatusQuo = () => {
    massMem = [];
    massCoord = [];
    newMode = -1;
    zoom = zoom === zoomStart ? zoomStart - 0.01 : zoomStart;
    datestat.create = true;
    dispatch(statsaveCreate(datestat));
    ymaps && addRoute(ymaps, false); // перерисовка связей
    NewPointCenter(pointCenterEt);
    //console.log("StatusQuo отработал:", zoom, mapState);
    setTrigger(!trigger);
  };

  //console.log("mapState:", zoom, mapState);

  return (
    <Grid container sx={{ border: 0, height: "99.9vh" }}>
      <Grid item xs sx={{ border: 0 }}>
        {!datestat.working && <>{MenuGl(modeToDo)}</>}
        {datestat.working && <>{StrokaHelp(" ")}</>}
        <Grid container sx={{ border: 0, height: "96.9vh" }}>
          <Grid item xs={xsMap} sx={{ border: 0 }}>
            {Object.keys(map.tflight).length && (
              <YMaps
                query={{
                  apikey: "65162f5f-2d15-41d1-a881-6c1acf34cfa1",
                  lang: "ru_RU",
                }}
              >
                <Map
                  modules={[
                    "multiRouter.MultiRoute",
                    "Polyline",
                    "templateLayoutFactory",
                  ]}
                  state={mapState}
                  instanceRef={(ref) => InstanceRefDo(ref)} // обработка действий с правой кнопкой и колёсиком мыши
                  onLoad={(ref) => {
                    ref && setYmaps(ref);
                  }}
                  width={widthMap}
                  height={"99.6%"}
                >
                  {/* сервисы Яндекса */}
                  <FullscreenControl />
                  <GeolocationControl options={{ float: "left" }} />
                  <RulerControl options={{ float: "right" }} />
                  <SearchControl options={searchControl} />
                  <TrafficControl options={{ float: "right" }} />
                  <TypeSelector options={{ float: "right" }} />
                  <ZoomControl options={{ float: "right" }} />
                  {/* служебные компоненты */}
                  {Pererisovka()}
                  <PlacemarkDo />
                  {selectMD && (
                    <GsSelectMD
                      setOpen={setSelectMD}
                      receive={ReceiveIdxGs}
                      history={props.history}
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
                  {openSoobErr && (
                    <GsErrorMessage setOpen={setOpenSoobErr} sErr={soobErr} />
                  )}
                </Map>
              </YMaps>
            )}
          </Grid>
          <Grid item xs={xsTab} sx={{ height: "97.0vh" }}>
            {toDoMode && (
              <GsToDoMode
                newMode={newMode}
                massMem={massMem}
                funcMode={ModeToDo}
                funcSize={OldSizeWind}
                funcCenter={NewPointCenter}
                funcHelper={SetHelper}
                trigger={props.trigger}
                changeFaz={changeFaz}
              />
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default MainMapGs;
