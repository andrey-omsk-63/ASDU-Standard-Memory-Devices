import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { massdkCreate, massrouteCreate } from "./../redux/actions";
import { coordinatesCreate, massrouteproCreate } from "./../redux/actions";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";

import { YMaps, Map, Placemark, FullscreenControl } from "react-yandex-maps";
import { GeolocationControl, YMapsApi } from "react-yandex-maps";
import { RulerControl, SearchControl } from "react-yandex-maps";
import { TrafficControl, TypeSelector, ZoomControl } from "react-yandex-maps";

import MapRouteInfo from "./MapComponents/MapRouteInfo";
import MapChangeAdress from "./MapComponents/MapChangeAdress";
import MapPointDataError from "./MapComponents/MapPointDataError";
import MapRouteBind from "./MapComponents/MapRouteBind";
import MapCreatePointVertex from "./MapComponents/MapCreatePointVertex";
import MapRouteProtokol from "./MapComponents/MapRouteProtokol";
import MapReversRoute from "./MapComponents/MapReversRoute";

import { RecordMassRoute } from "./MapServiceFunctions";
import { DecodingCoord, CodingCoord } from "./MapServiceFunctions";
import { getMultiRouteOptions, DoublRoute } from "./MapServiceFunctions";
import { getReferencePoints, CenterCoord } from "./MapServiceFunctions";
import { getMassPolyRouteOptions } from "./MapServiceFunctions";
import { getMassMultiRouteOptions } from "./MapServiceFunctions";
import { getMassMultiRouteInOptions } from "./MapServiceFunctions";
import { getPointData, getPointOptions } from "./MapServiceFunctions";
import { StrokaBalloon, ChangeCrossFunc } from "./MapServiceFunctions";
import { RecevKeySvg, StrokaMenuGlob, MasskPoint } from "./MapServiceFunctions";

import { SendSocketCreatePoint, SocketDeleteWay } from "./MapSocketFunctions";
import { SendSocketCreateVertex } from "./MapSocketFunctions";
import { SendSocketDeletePoint } from "./MapSocketFunctions";
import { SendSocketDeleteVertex } from "./MapSocketFunctions";
import { SendSocketCreateWay, SendSocketGetSvg } from "./MapSocketFunctions";
import { SendSocketCreateWayFromPoint } from "./MapSocketFunctions";
import { SendSocketCreateWayToPoint } from "./MapSocketFunctions";

import { styleSetPoint, styleTypography, searchControl } from "./MainMapStyle";
import { styleModalEndMapGl } from "./MainMapStyle";

let coordStart: any = []; // рабочий массив коллекции входящих связей
let coordStop: any = []; // рабочий массив коллекции входящих связей
let coordStartIn: any = []; // рабочий массив коллекции исходящих связей
let coordStopIn: any = []; // рабочий массив коллекции исходящих связей
let massRoute: any = []; // рабочий массив сети связей
let masSvg: any = ["", ""];

let debugging = false;
let flagOpen = false;
let flagBind = false;
let flagRevers = false;
let needLinkBind = false;
let activeRoute: any = null;
let newPointCoord: any = 0;
let soobError = "";
let oldsErr = "";
let zoom = 10;
let homeRegion = 0;
let pointCenter: any = 0;
let indexPoint: number = -1;
let reqRoute: any = {
  dlRoute: 0,
  tmRoute: 0,
};

let pointAa: any = 0;
let pointAaIndex: number = -1;
let fromCross: any = {
  pointAaRegin: "",
  pointAaArea: "",
  pointAaID: 0,
  pointAcod: "",
};
let pointBb: any = 0;
let pointBbIndex: number = -1;
let toCross: any = {
  pointBbRegin: "",
  pointBbArea: "",
  pointBbID: 0,
  pointBcod: "",
};

const MainMap = (props: {
  ws: WebSocket;
  region: any;
  sErr: string;
  svg: any;
  setSvg: any;
}) => {
  const WS = props.ws;
  if (WS.url === "wss://localhost:3000/W") debugging = true;
  //== Piece of Redux =======================================
  let massdk = useSelector((state: any) => {
    const { massdkReducer } = state;
    return massdkReducer.massdk;
  });
  let massroute = useSelector((state: any) => {
    const { massrouteReducer } = state;
    return massrouteReducer.massroute;
  });
  let massroutepro = useSelector((state: any) => {
    const { massrouteproReducer } = state;
    return massrouteproReducer.massroutepro;
  });
  let coordinates = useSelector((state: any) => {
    const { coordinatesReducer } = state;
    return coordinatesReducer.coordinates;
  });
  const map = useSelector((state: any) => {
    const { mapReducer } = state;
    return mapReducer.map;
  });
  const dispatch = useDispatch();
  //===========================================================
  const [openSetInf, setOpenSetInf] = React.useState(false);
  const [openSetPro, setOpenSetPro] = React.useState(false);
  const [openSetEr, setOpenSetEr] = React.useState(false);
  const [openSetBind, setOpenSetBind] = React.useState(false);
  const [flagDemo, setFlagDemo] = React.useState(false);
  const [flagPro, setFlagPro] = React.useState(false);
  const [flagPusk, setFlagPusk] = React.useState(false);
  const [flagRoute, setFlagRoute] = React.useState(false);
  const [revers, setRevers] = React.useState(false);
  const [openSet, setOpenSet] = React.useState(false);
  const [openSetCreate, setOpenSetCreate] = React.useState(false);
  const [openSetAdress, setOpenSetAdress] = React.useState(false);
  const [openSetRevers, setOpenSetRevers] = React.useState(false);
  const [makeRevers, setMakeRevers] = React.useState(false);
  const [needRevers, setNeedRevers] = React.useState(0);
  const [ymaps, setYmaps] = React.useState<YMapsApi | null>(null);
  const mapp = React.useRef<any>(null);

  const DelCollectionRoutes = () => {
    coordStart = [];
    coordStop = [];
    coordStartIn = [];
    coordStopIn = [];
  };

  const ZeroRoute = (mode: boolean) => {
    pointAa = 0;
    pointBb = 0;
    pointAaIndex = -1;
    pointBbIndex = -1;
    DelCollectionRoutes();
    flagBind = false;
    setFlagRoute(false);
    setFlagPusk(mode);
    ymaps && addRoute(ymaps); // перерисовка связей
  };

  const SoobOpenSetEr = (soob: string) => {
    soobError = soob;
    setOpenSetEr(true);
  };

  const MakeRecordMassRoute = (mode: boolean, mass: any) => {
    let aRou = reqRoute;
    let debug = debugging;
    fromCross.pointAcod = CodingCoord(pointAa);
    toCross.pointBcod = CodingCoord(pointBb);
    if (DoublRoute(massroute.ways, pointAa, pointBb)) {
      SoobOpenSetEr("Дубликатная связь");
    } else {
      let mask = RecordMassRoute(fromCross, toCross, mass, aRou);
      massroute.ways.push(mask);
      massroutepro.ways.push(mask);
      dispatch(massrouteCreate(massroute));
      dispatch(massrouteproCreate(massroutepro));
      if (massroute.vertexes[pointAaIndex].area === 0) {
        SendSocketCreateWayFromPoint(debug, WS, fromCross, toCross, mass, aRou);
      } else {
        if (massroute.vertexes[pointBbIndex].area === 0) {
          SendSocketCreateWayToPoint(debug, WS, fromCross, toCross, mass, aRou);
        } else {
          SendSocketCreateWay(debug, WS, fromCross, toCross, mass, aRou);
        }
      }
      setFlagPro(true); //включение протокола
    }
    if (flagRevers && needRevers !== 3) {
      setOpenSetRevers(true);
      flagRevers = false;
    } else {
      ZeroRoute(mode);
    }
    setNeedRevers(0);
  };

  const MakeСollectionRoute = () => {
    DelCollectionRoutes();
    for (let i = 0; i < massroute.ways.length; i++) {
      if (massroute.ways[i].starts === CodingCoord(pointAa)) {
        coordStop.push(DecodingCoord(massroute.ways[i].stops)); // исходящие связи
        coordStart.push(pointAa);
      }
      if (massroute.ways[i].stops === CodingCoord(pointAa)) {
        coordStartIn.push(DecodingCoord(massroute.ways[i].starts)); // входящие связи
        coordStopIn.push(pointAa);
      }
    }
    ymaps && addRoute(ymaps); // перерисовка связей
  };

  const ReversRoute = () => {
    let noDoublRoute = true;
    let pa = pointAa;
    pointAa = pointBb;
    pointBb = pa;
    pa = pointAaIndex;
    pointAaIndex = pointBbIndex;
    pointBbIndex = pa;
    ChangeCrossFunc(fromCross, toCross); // поменялось внутри func через ссылки React
    if (DoublRoute(massroute.ways, pointAa, pointBb)) {
      SoobOpenSetEr("Дубликатная связь");
      ZeroRoute(false);
      noDoublRoute = false;
    } else {
      MakeСollectionRoute();
      setRevers(!revers);
    }
    return noDoublRoute;
  };

  const LinkBind = () => {
    let arIn = massroute.vertexes[pointAaIndex].area;
    let idIn = massroute.vertexes[pointAaIndex].id;
    let arOn = massroute.vertexes[pointBbIndex].area;
    let idOn = massroute.vertexes[pointBbIndex].id;
    SendSocketGetSvg(debugging, WS, homeRegion, arIn, idIn, arOn, idOn);
    flagBind = true;
    setOpenSetBind(true);
  };

  const PressButton = (mode: number) => {
    switch (mode) {
      case 3: // режим включения Demo сети связей
        massRoute = massroute.ways;
        setFlagDemo(true);
        ymaps && addRoute(ymaps); // перерисовка связей
        break;
      case 6: // режим отмены Demo сети связей
        massRoute = [];
        setFlagDemo(false);
        ymaps && addRoute(ymaps); // перерисовка связей
        break;
      case 12: // реверс связи
        ReversRoute();
        break;
      case 24: // вывод протокола
        setOpenSetPro(true);
        break;
      case 33: // привязка направлений + сохранение связи
        LinkBind();
        flagRevers = true;
        break;
      case 35: // отказ от создания реверсной связи
        flagRevers = false;
        setMakeRevers(false);
        ZeroRoute(false);
        break;
      case 36: // реверс связи + привязка направлений + сохранение связи
        if (ReversRoute()) LinkBind();
        setMakeRevers(false);
        break;
      case 37: // реверс связи + редактирование
        if (ReversRoute()) {
          const ReadyRoute = () => {
            if (activeRoute) {
              needLinkBind = true;
              setOpenSetInf(true);
            } else {
              setTimeout(() => {
                ReadyRoute();
              }, 100);
            }
          };
          ReadyRoute();
        }
        setMakeRevers(false);
        setNeedRevers(3);
        break;
      case 69: // редактирование связи
        setOpenSetInf(true);
        setNeedRevers(0);
        break;
      case 77: // удаление связи / отмена назначений
        ZeroRoute(false);
    }
  };

  const addRoute = (ymaps: any) => {
    mapp.current.geoObjects.removeAll(); // удаление старой коллекции связей
    let massPolyRoute: any = []; // cеть связей
    for (let i = 0; i < massRoute.length; i++) {
      massPolyRoute[i] = new ymaps.Polyline(
        [DecodingCoord(massRoute[i].starts), DecodingCoord(massRoute[i].stops)],
        { balloonContent: "Ломаная линия" },
        getMassPolyRouteOptions()
      );
      mapp.current.geoObjects.add(massPolyRoute[i]);
    }
    let massMultiRoute: any = []; // исходящие связи
    for (let i = 0; i < coordStart.length; i++) {
      massMultiRoute[i] = new ymaps.multiRouter.MultiRoute(
        getReferencePoints(coordStart[i], coordStop[i]),
        getMassMultiRouteOptions()
      );
      mapp.current.geoObjects.add(massMultiRoute[i]);
    }
    let massMultiRouteIn: any = []; // входящие связи
    for (let i = 0; i < coordStartIn.length; i++) {
      massMultiRouteIn[i] = new ymaps.multiRouter.MultiRoute(
        getReferencePoints(coordStartIn[i], coordStopIn[i]),
        getMassMultiRouteInOptions()
      );
      mapp.current.geoObjects.add(massMultiRouteIn[i]);
    }
    const multiRoute = new ymaps.multiRouter.MultiRoute(
      getReferencePoints(pointAa, pointBb),
      getMultiRouteOptions()
    );
    activeRoute = null;
    mapp.current.geoObjects.add(multiRoute); // основная связь
    multiRoute.model.events.add("requestsuccess", function () {
      activeRoute = multiRoute.getActiveRoute();
      if (activeRoute) {
        reqRoute.dlRoute = Math.round(
          activeRoute.properties.get("distance").value
        );
        reqRoute.tmRoute = Math.round(
          activeRoute.properties.get("duration").value
        );
      }
    });
  };

  const SetReqRoute = (mode: any, need: boolean) => {
    reqRoute = JSON.parse(JSON.stringify(mode));
    if (need) LinkBind();
    needLinkBind = false;
  };

  const UpdateAddRoute = () => {
    ymaps && addRoute(ymaps); // перерисовка связей
  };

  const OnPlacemarkClickPoint = (index: number) => {
    if (pointAa === 0) {
      pointAaIndex = index; // начальная точка
      pointAa = [massdk[index].coordinates[0], massdk[index].coordinates[1]];
      fromCross.pointAaRegin = massdk[index].region.toString();
      fromCross.pointAaArea = massdk[index].area.toString();
      fromCross.pointAaID = massdk[index].ID;
      MakeСollectionRoute();
      setFlagPusk(true);
    } else {
      if (pointBb === 0) {
        if (pointAaIndex === index) {
          SoobOpenSetEr("Начальная и конечная точки совпадают");
        } else {
          pointBbIndex = index; // конечная точка
          if (
            massroute.vertexes[pointAaIndex].area === 0 &&
            massroute.vertexes[pointBbIndex].area === 0
          ) {
            pointBbIndex = 0; // конечная точка
            SoobOpenSetEr("Связь между двумя точками создовать нельзя");
          } else {
            pointBb = [
              massdk[index].coordinates[0],
              massdk[index].coordinates[1],
            ];
            toCross.pointBbRegin = massdk[index].region.toString();
            toCross.pointBbArea = massdk[index].area.toString();
            toCross.pointBbID = massdk[index].ID;
            if (DoublRoute(massroute.ways, pointAa, pointBb)) {
              SoobOpenSetEr("Дубликатная связь");
              ZeroRoute(false);
            } else {
              setFlagRoute(true);
              ymaps && addRoute(ymaps); // перерисовка связей
            }
          }
        }
      } else {
        indexPoint = index;
        setOpenSet(true); // переход в меню работы с точками
      }
    }
  };

  const ModalPressBalloon = () => {
    const [openSetErBall, setOpenSetErBall] = React.useState(false);
    let pointRoute: any = 0;
    let soobDel = "Удаление точки";
    let areaPoint = -1;
    if (indexPoint >= 0) areaPoint = massdk[indexPoint].area;
    if (indexPoint >= 0 && indexPoint < massdk.length) {
      if (areaPoint) soobDel = "Удаление перекрёстка";
      pointRoute = [
        massdk[indexPoint].coordinates[0],
        massdk[indexPoint].coordinates[1],
      ];
    }

    const handleClose = (param: number) => {
      switch (param) {
        case 1: // Начальная точка
          if (pointBbIndex === indexPoint) {
            soobError = "Начальная и конечная точки совпадают";
            setOpenSetErBall(true);
          } else {
            pointAaIndex = indexPoint;
            pointAa = pointRoute;
            fromCross.pointAaRegin = massdk[pointAaIndex].region.toString();
            fromCross.pointAaArea = massdk[pointAaIndex].area.toString();
            fromCross.pointAaID = massdk[pointAaIndex].ID;
            MakeСollectionRoute();
            setOpenSet(false);
          }
          break;
        case 2: // Конечная точка
          if (pointAaIndex === indexPoint) {
            soobError = "Начальная и конечная точки совпадают";
            setOpenSetErBall(true);
          } else {
            if (
              massroute.vertexes[pointAaIndex].area === 0 &&
              massroute.vertexes[indexPoint].area === 0
            ) {
              SoobOpenSetEr("Связь между двумя точками создовать нельзя");
            } else {
              pointBbIndex = indexPoint;
              pointBb = pointRoute;
              toCross.pointBbRegin = massdk[pointBbIndex].region.toString();
              toCross.pointBbArea = massdk[pointBbIndex].area.toString();
              toCross.pointBbID = massdk[pointBbIndex].ID;
              if (DoublRoute(massroute.ways, pointAa, pointBb)) {
                SoobOpenSetEr("Дубликатная связь");
                ZeroRoute(false);
              }
              setOpenSet(false);
              ymaps && addRoute(ymaps); // перерисовка связей
            }
          }
          break;
        case 3: // Удаление точки/перекрёстка
          console.log("Удаление");
          if (pointAaIndex === indexPoint || pointBbIndex === indexPoint) {
            soobError = "Начальную и конечную точки связи удалять нельзя";
            setOpenSetErBall(true);
          } else {
            let massRouteRab: any = []; // удаление из массива сети связей
            let coordPoint = massroute.vertexes[indexPoint].dgis;
            let idPoint = massroute.vertexes[indexPoint].id;
            let regionV = massroute.vertexes[indexPoint].region.toString();
            let areaV = massroute.vertexes[indexPoint].area.toString();
            for (let i = 0; i < massroute.ways.length; i++) {
              if (
                coordPoint !== massroute.ways[i].starts &&
                coordPoint !== massroute.ways[i].stops
              ) {
                massRouteRab.push(massroute.ways[i]);
              } else {
                SocketDeleteWay(debugging, WS, massroute.ways[i]);
              }
            }
            massroute.ways.splice(0, massroute.ways.length); // massroute = [];
            massroute.ways = massRouteRab;
            if (flagDemo) massRoute = massroute.ways;
            DelCollectionRoutes(); // удаление колекции связей
            massdk.splice(indexPoint, 1); // удаление самой точки/перекрёстка
            massroute.vertexes.splice(indexPoint, 1);
            dispatch(massdkCreate(massdk));
            dispatch(massrouteCreate(massroute));
            let oldPointAa = coordinates[pointAaIndex];
            let oldPointBb = coordinates[pointBbIndex];
            coordinates.splice(indexPoint, 1);
            dispatch(coordinatesCreate(coordinates));
            for (let i = 0; i < coordinates.length; i++) {
              if (coordinates[i] === oldPointAa) pointAaIndex = i;
              if (coordinates[i] === oldPointBb) pointBbIndex = i;
            }
            if (areaV === "0") {
              SendSocketDeletePoint(debugging, WS, idPoint);
            } else {
              SendSocketDeleteVertex(debugging, WS, regionV, areaV, idPoint);
            }
            setOpenSet(false);
            indexPoint = -1;
            ymaps && addRoute(ymaps); // перерисовка связей
          }
          break;
        case 4: // Редактирование адреса
          setOpenSetAdress(true);
      }
    };

    return (
      <Modal open={openSet} onClose={() => setOpenSet(false)} hideBackdrop>
        <Box sx={styleSetPoint}>
          <Button sx={styleModalEndMapGl} onClick={() => setOpenSet(false)}>
            <b>&#10006;</b>
          </Button>
          <Box sx={{ marginTop: 2, textAlign: "center" }}>
            {StrokaBalloon(soobDel, handleClose, 3)}
            {!areaPoint && (
              <>{StrokaBalloon("Редактирование адреса", handleClose, 4)}</>
            )}
          </Box>
          <Typography variant="h6" sx={styleTypography}>
            Перестроение связи:
          </Typography>
          <Box sx={{ marginTop: 1, textAlign: "center" }}>
            {StrokaBalloon("Начальная точка", handleClose, 1)}
            {StrokaBalloon("Конечная точка", handleClose, 2)}
          </Box>
          {openSetAdress && (
            <MapChangeAdress
              debug={debugging}
              ws={WS}
              iPoint={indexPoint}
              setOpen={setOpenSetAdress}
              zeroRoute={ZeroRoute}
            />
          )}
          {openSetErBall && (
            <MapPointDataError
              sErr={soobError}
              setOpen={setOpenSetErBall}
              debug={debugging}
              ws={WS}
              fromCross={fromCross}
              toCross={toCross}
              update={UpdateAddRoute}
            />
          )}
        </Box>
      </Modal>
    );
  };

  const MakeNewPoint = (coords: any) => {
    let coor: string = CodingCoord(coords);
    let areaV = massroute.vertexes[massroute.vertexes.length - 1].area;
    let idV = massroute.vertexes[massroute.vertexes.length - 1].id;
    let adress = massroute.vertexes[massroute.vertexes.length - 1].name;
    coordinates.push(coords);
    dispatch(coordinatesCreate(coordinates));
    if (areaV) {
      SendSocketCreateVertex(debugging, WS, homeRegion, areaV, idV);
    } else {
      SendSocketCreatePoint(debugging, WS, coor, adress);
    }
    setOpenSetCreate(false);
  };

  const PlacemarkDo = () => {
    let pAaI = pointAaIndex;
    let pBbI = pointBbIndex;

    const DoPlacemarkDo = (props: { coordinate: any; idx: number }) => {
      const MemoPlacemarkDo = React.useMemo(
        () => (
          <Placemark
            key={props.idx}
            geometry={props.coordinate}
            properties={getPointData(props.idx, pAaI, pBbI, massdk)}
            options={getPointOptions(
              props.idx,
              pAaI,
              pBbI,
              massdk,
              massroute,
              coordStartIn,
              coordStop
            )}
            modules={["geoObject.addon.balloon", "geoObject.addon.hint"]}
            onClick={() => OnPlacemarkClickPoint(props.idx)}
          />
        ),
        [props.coordinate, props.idx]
      );
      return MemoPlacemarkDo;
    };

    return (
      <>
        {flagOpen &&
          coordinates.map((coordinate: any, idx: any) => (
            <DoPlacemarkDo key={idx} coordinate={coordinate} idx={idx} />
          ))}
      </>
    );
  };

  const InstanceRefDo = (ref: React.Ref<any>) => {
    if (ref) {
      mapp.current = ref;
      mapp.current.events.add("contextmenu", function (e: any) {
        if (mapp.current.hint) {
          newPointCoord = e.get("coords"); // нажата правая кнопка мыши (созд-е новой точки)
          setOpenSetCreate(true);
        }
      });
      mapp.current.events.add("mousedown", function (e: any) {
        pointCenter = mapp.current.getCenter(); // нажата левая/правая кнопка мыши 0, 1 или 2 в зависимости от того, какая кнопка мыши нажата (В IE значение может быть от 0 до 7).
      });
      mapp.current.events.add(["boundschange"], function () {
        pointCenter = mapp.current.getCenter();
        zoom = mapp.current.getZoom(); // покрутили колёсико мыши
      });
    }
  };
  //=== инициализация ======================================
  if (!flagOpen && Object.keys(massroute).length) {
    console.log("massroute:", massroute);
    if (props.region) homeRegion = props.region;
    if (!props.region && massroute.vertexes.length)
      homeRegion = massroute.vertexes[0].region;
    for (let i = 0; i < massroute.points.length; i++) {
      massroute.vertexes.push(massroute.points[i]);
    }
    for (let i = 0; i < massroute.vertexes.length; i++) {
      let masskPoint = MasskPoint();
      masskPoint.ID = massroute.vertexes[i].id;
      masskPoint.coordinates = DecodingCoord(massroute.vertexes[i].dgis);
      masskPoint.nameCoordinates = massroute.vertexes[i].name;
      masskPoint.region = massroute.vertexes[i].region;
      masskPoint.area = massroute.vertexes[i].area;
      masskPoint.newCoordinates = 0;
      massdk.push(masskPoint);
      coordinates.push(DecodingCoord(massroute.vertexes[i].dgis));
    }
    dispatch(massdkCreate(massdk));
    dispatch(massrouteCreate(massroute));
    dispatch(coordinatesCreate(coordinates));
    pointCenter = CenterCoord(
      map.dateMap.boxPoint.point0.Y,
      map.dateMap.boxPoint.point0.X,
      map.dateMap.boxPoint.point1.Y,
      map.dateMap.boxPoint.point1.X
    );
    flagOpen = true;
  }
  //========================================================
  let mapState: any = {
    center: pointCenter,
    zoom,
    //yandexMapDisablePoiInteractivity: true,
  };

  if (props.sErr && props.sErr !== oldsErr) {
    ymaps && addRoute(ymaps); // перерисовка связей
    oldsErr = props.sErr;
  }

  masSvg = ["", ""];
  if (!debugging) {
    if (props.svg) {
      masSvg[0] = props.svg[RecevKeySvg(massroute.vertexes[pointAaIndex])];
      masSvg[1] = props.svg[RecevKeySvg(massroute.vertexes[pointBbIndex])];
    } else {
      masSvg = null;
    }
  }

  return (
    <Grid container sx={{ border: 0, height: "99.9vh" }}>
      {makeRevers && needRevers === 0 && <>{PressButton(35)}</>}
      {makeRevers && needRevers === 1 && <>{PressButton(36)}</>}
      {makeRevers && needRevers === 2 && <>{PressButton(37)}</>}
      {flagPusk && !flagBind && (
        <>{StrokaMenuGlob("Отмена назначений", PressButton, 77)}</>
      )}
      {flagPusk && flagRoute && !flagBind && (
        <>
          {StrokaMenuGlob("Сохранить связь", PressButton, 33)}
          {StrokaMenuGlob("Реверc связи", PressButton, 12)}
          {StrokaMenuGlob("Редактир.связи", PressButton, 69)}
        </>
      )}
      {flagPusk && flagRoute && flagBind && (
        <>
          {StrokaMenuGlob("Сохранить связь", PressButton, 33)}
          {StrokaMenuGlob("Отменить связь", PressButton, 77)}
          {StrokaMenuGlob("Редактир.связи", PressButton, 69)}
        </>
      )}
      {!flagDemo && <>{StrokaMenuGlob("Demo сети", PressButton, 3)}</>}
      {flagDemo && <>{StrokaMenuGlob("Откл Demo", PressButton, 6)}</>}
      {flagPro && <>{StrokaMenuGlob("Протокол", PressButton, 24)}</>}
      {Object.keys(massroute).length && (
        <YMaps
          query={{
            apikey: "65162f5f-2d15-41d1-a881-6c1acf34cfa1",
            lang: "ru_RU",
          }}
        >
          <Map
            modules={["multiRouter.MultiRoute", "Polyline"]}
            state={mapState}
            instanceRef={(ref) => InstanceRefDo(ref)}
            onLoad={(ref) => {
              ref && setYmaps(ref);
            }}
            width={"99.8%"}
            height={"97%"}
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
            <PlacemarkDo />
            <ModalPressBalloon />
            {openSetPro && <MapRouteProtokol setOpen={setOpenSetPro} />}
            {openSetEr && (
              <MapPointDataError
                sErr={soobError}
                setOpen={setOpenSetEr}
                debug={debugging}
                ws={WS}
                fromCross={fromCross}
                toCross={toCross}
                update={UpdateAddRoute}
              />
            )}
            {openSetInf && (
              <MapRouteInfo
                activeRoute={activeRoute}
                idxA={pointAaIndex}
                idxB={pointBbIndex}
                setOpen={setOpenSetInf}
                reqRoute={reqRoute}
                setReqRoute={SetReqRoute}
                needLinkBind={needLinkBind}
              />
            )}
            {openSetBind && (
              <MapRouteBind
                debug={debugging}
                setOpen={setOpenSetBind}
                svg={masSvg}
                setSvg={props.setSvg}
                idxA={pointAaIndex}
                idxB={pointBbIndex}
                func={MakeRecordMassRoute}
              />
            )}
            {openSetCreate && (
              <MapCreatePointVertex
                setOpen={setOpenSetCreate}
                region={homeRegion}
                coord={newPointCoord}
                createPoint={MakeNewPoint}
              />
            )}
            {openSetRevers && (
              <MapReversRoute
                setOpen={setOpenSetRevers}
                makeRevers={setMakeRevers}
                needRevers={setNeedRevers}
              />
            )}
          </Map>
        </YMaps>
      )}
    </Grid>
  );
};

export default MainMap;
