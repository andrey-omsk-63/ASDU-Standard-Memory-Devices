import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  mapCreate,
  massrouteCreate,
  massrouteproCreate,
  coordinatesCreate,
  massdkCreate,
} from "./redux/actions";

import Grid from "@mui/material/Grid";

import MainMapSMD from "./components/MainMapSMD";
import AppSocketError from "./AppSocketError";
import {
  SoobErrorCreateWay,
  SoobErrorDeleteWay,
  SoobErrorCreateWayToPoint,
  SoobErrorDeleteWayToPoint,
  SoobErrorCreateWayFromPoint,
  SoobErrorDeleteWayFromPoint,
} from "./components/MapSocketFunctions";

//import { DateMAP } from './interfaceMAP.d';
//import { DateRoute } from "./interfaceRoute.d";
//import { Tflight } from "./interfaceMAP.d";
import { dataMap } from "./otladkaMaps";
import { dataRoute } from "./otladkaRoutes";

export let dateMapGl: any;
export let dateRouteGl: any;
export let dateRouteProGl: any;

export interface Pointer {
  ID: number;
  coordinates: Array<number>;
  nameCoordinates: string;
  region: number;
  area: number;
  newCoordinates: number;
}
export let massDk: Pointer[] = [];

export interface Router {
  region: number;
  sourceArea: number;
  sourceID: number;
  targetArea: number;
  targetID: number;
  lsource: number;
  ltarget: number;
  starts: string;
  stops: string;
  lenght: number;
  time: number;
}
export let massRoute: Router[] = [];
export let massRoutePro: Router[] = [];
export let Coordinates: Array<Array<number>> = []; // массив координат

let flagOpen = true;
let flagOpenWS = true;
let WS: any = null;
let homeRegion: any = "";
let soob = "";

const App = () => {
  //== Piece of Redux ======================================
  let massdk = useSelector((state: any) => {
    const { massdkReducer } = state;
    return massdkReducer.massdk;
  });

  let coordinates = useSelector((state: any) => {
    const { coordinatesReducer } = state;
    return coordinatesReducer.coordinates;
  });

  const dispatch = useDispatch();
  //========================================================
  const host =
    "wss://" +
    window.location.host +
    window.location.pathname +
    "W" +
    window.location.search;

  const [openSetErr, setOpenSetErr] = React.useState(false);
  const [svg, setSvg] = React.useState<any>(null);

  if (flagOpenWS) {
    WS = new WebSocket(host);
    flagOpenWS = false;
    let pageUrl = new URL(window.location.href);
    homeRegion = Number(pageUrl.searchParams.get("Region"));
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

    WS.onmessage = function (event: any) {
      let allData = JSON.parse(event.data);
      let data = allData.data;
      console.log("пришло:", allData.type, data);
      switch (allData.type) {
        case "mapInfo":
          dateMapGl = data;
          dispatch(mapCreate(dateMapGl));
          break;
        // case "graphInfo":
        //   let pointRab = JSON.parse(JSON.stringify(data));
        //   pointRab.points = []; // массив протоколов
        //   pointRab.vertexes = [];
        //   pointRab.ways = [];
        //   dateRouteGl = JSON.parse(JSON.stringify(data));
        //   dateRouteProGl = JSON.parse(JSON.stringify(pointRab));
        //   dispatch(massrouteCreate(dateRouteGl));
        //   dispatch(massrouteproCreate(dateRouteProGl));
        //   break;
        // case "createPoint":
        //   if (data.status) {
        //     dateRouteGl.vertexes[dateRouteGl.vertexes.length - 1].id = data.id;
        //     massdk[massdk.length - 1].ID = data.id;
        //   } else {
        //     dateRouteGl.vertexes.splice(dateRouteGl.vertexes.length - 1, 1);
        //     massdk.splice(massdk.length - 1, 1);
        //     coordinates.splice(coordinates.length - 1, 1);
        //     soob = "Произошла ошибка при создании точки";
        //     setOpenSetErr(true);
        //     dispatch(coordinatesCreate(coordinates));
        //   }
        //   dispatch(massrouteCreate(dateRouteGl));
        //   dispatch(massdkCreate(massdk));
        //   break;
        // case "deletePoint":
        //   if (!data.status) {
        //     soob = "Произошла ошибка при удалении точки";
        //     setOpenSetErr(true);
        //   }
        //   break;
        // case "createVertex":
        //   if (!data.status) {
        //     dateRouteGl.vertexes.splice(dateRouteGl.vertexes.length - 1, 1);
        //     massdk.splice(massdk.length - 1, 1);
        //     coordinates.splice(coordinates.length - 1, 1);
        //     soob = "Произошла ошибка при создании перекрёстка";
        //     setOpenSetErr(true);
        //     dispatch(coordinatesCreate(coordinates));
        //     dispatch(massrouteCreate(dateRouteGl));
        //     dispatch(massdkCreate(massdk));
        //   }
        //   break;
        // case "deleteVertex":
        //   if (!data.status) {
        //     soob = "Произошла ошибка при удалении перекрёстка";
        //     setOpenSetErr(true);
        //   }
        //   break;
        // case "createWay":
        //   if (!data.status) {
        //     soob = SoobErrorCreateWay(data);
        //     dateRouteGl.ways.splice(dateRouteGl.ways.length - 1, 1);
        //     dateRouteProGl.ways.splice(dateRouteGl.ways.length - 1, 1);
        //     dispatch(massrouteproCreate(dateRouteProGl));
        //     dispatch(massrouteCreate(dateRouteGl));
        //     setOpenSetErr(true);
        //   }
        //   break;
        // case "deleteWay":
        //   if (!data.status) {
        //     soob = SoobErrorDeleteWay(data);
        //     setOpenSetErr(true);
        //   }
        //   break;
        // case "createWayToPoint":
        //   if (!data.status) {
        //     soob = SoobErrorCreateWayToPoint(data);
        //     dateRouteGl.ways.splice(dateRouteGl.ways.length - 1, 1);
        //     dispatch(massrouteCreate(dateRouteGl));
        //     dateRouteProGl.ways.splice(dateRouteGl.ways.length - 1, 1);
        //     dispatch(massrouteproCreate(dateRouteProGl));
        //     setOpenSetErr(true);
        //   }
        //   break;
        // case "deleteWayToPoint":
        //   if (!data.status) {
        //     soob = SoobErrorDeleteWayToPoint(data);
        //     setOpenSetErr(true);
        //   }
        //   break;
        // case "createWayFromPoint":
        //   if (!data.status) {
        //     soob = SoobErrorCreateWayFromPoint(data);
        //     console.log("soob:", soob);
        //     dateRouteGl.ways.splice(dateRouteGl.ways.length - 1, 1);
        //     dispatch(massrouteCreate(dateRouteGl));
        //     dateRouteProGl.ways.splice(dateRouteGl.ways.length - 1, 1);
        //     dispatch(massrouteproCreate(dateRouteProGl));
        //     setOpenSetErr(true);
        //   }
        //   break;
        // case "deleteWayFromPoint":
        //   if (!data.status) {
        //     soob = SoobErrorDeleteWayFromPoint(data);
        //     setOpenSetErr(true);
        //   }
        //   break;
        // case "getSvg":
        //   if (!data.status) {
        //     soob = "Ошибка при получении изображений перекрёстков";
        //     setOpenSetErr(true);
        //     setSvg(0);
        //   } else {
        //     setSvg(data.svg);
        //   }
        //   break;
        default:
          console.log("data_default:", data);
      }
    };
  }, [dispatch, massdk, coordinates, svg]);

  if (WS.url === "wss://localhost:3000/W" && flagOpen) {
    console.log("РЕЖИМ ОТЛАДКИ!!!");
    dateMapGl = { ...dataMap };
    dispatch(mapCreate(dateMapGl));
    // dateRouteGl = { ...dataRoute.data };
    // dateRouteProGl = { ...dataRoute.data };
    // dateRouteProGl.points = []; // массив протоколов
    // dateRouteProGl.vertexes = [];
    // dateRouteProGl.ways = [];
    flagOpen = false;
    // dispatch(massrouteCreate(dateRouteGl));
    // dispatch(massrouteproCreate(dateRouteProGl));
  }

  return (
    <Grid container sx={{ height: "100vh", width: "100%", bgcolor: "#E9F5D8" }}>
      <Grid item xs>
        {openSetErr && <AppSocketError sErr={soob} setOpen={setOpenSetErr} />}
        <MainMapSMD
          ws={WS}
          region={homeRegion}
          sErr={soob}
          svg={svg}
          setSvg={setSvg}
        />
      </Grid>
    </Grid>
  );
};

export default App;
