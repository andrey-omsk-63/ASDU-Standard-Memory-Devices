import React from "react";
import { useDispatch } from "react-redux";
import { mapCreate, statsaveCreate } from "./redux/actions";

import Grid from "@mui/material/Grid";

//import axios from "axios";

import MainMapGS from "./components/MainMapGs";
import AppSocketError from "./AppSocketError";

import { dataMap } from "./otladkaMaps";

export let dateMapGl: any;
export let dateRouteGl: any;
export let dateRouteProGl: any;

export interface Stater {
  ws: any;
  debug: boolean;
  region: string;
  phSvg: string;
}

export let dateStat: Stater = {
  ws: null,
  debug: false,
  region: "0",
  phSvg:
    "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"

};

export interface Pointer {
  ID: number;
  coordinates: Array<number>;
  nameCoordinates: string;
  region: number;
  area: number;
  phSvg: Array<string>;
}
export let massDk: Pointer[] = [];

// export interface Fazer {
//   ID: number;
//   coordinates: Array<number>;
//   nameCoordinates: string;
//   region: number;
//   area: number;
//   newCoordinates: number;
// }
// export let massFaz: Fazer[] = [];

export interface NameMode {
  name: string;
  delRec: boolean;
}
export let massMode: NameMode[] = [];

export let Coordinates: Array<Array<number>> = []; // массив координат

let flagOpen = true;
let flagOpenWS = true;
//let openMapInfo = false;
let WS: any = null;
let homeRegion: string = "0";
let soob = "";

const App = () => {
  //== Piece of Redux ======================================
  // let datestat = useSelector((state: any) => {
  //   const { statsaveReducer } = state;
  //   return statsaveReducer.datestat;
  // });
  //console.log("Datestat:",datestat.ws, datestat);
  const dispatch = useDispatch();
  //========================================================

  const host =
    "wss://" +
    window.location.host +
    window.location.pathname +
    "W" +
    window.location.search;

  const [openSetErr, setOpenSetErr] = React.useState(false);
  const [openMapInfo, setOpenMapInfo] = React.useState(false);

  if (flagOpenWS) {
    WS = new WebSocket(host);
    dateStat.ws = WS;
    if (WS.url === "wss://localhost:3000/W") dateStat.debug = true;
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

    WS.onmessage = function (event: any) {
      let allData = JSON.parse(event.data);
      let data = allData.data;
      console.log("пришло:", data.error, allData.type, data);
      switch (allData.type) {
        case "mapInfo":
          dateMapGl = JSON.parse(JSON.stringify(data));
          dispatch(mapCreate(dateMapGl));
          let massRegion = [];
          for (let key in dateMapGl.regionInfo) {
            if (!isNaN(Number(key))) massRegion.push(Number(key));
          }
          homeRegion = massRegion[0].toString();
          dateStat.region = homeRegion;
          dispatch(statsaveCreate(dateStat));
          setOpenMapInfo(true);
          break;
        default:
          console.log("data_default:", data);
      }
    };
  }, [dispatch]);

  if (WS.url === "wss://localhost:3000/W" && flagOpen) {
    console.log("РЕЖИМ ОТЛАДКИ!!!");
    // axios.get("http://localhost:3000/otladkaMapInfo.json").then(({ data }) => {
    //   console.log("1DATA", data);
    //   // setPointsTfl(data.data.tflight);
    //   // setIsOpenDev(true);
    // });
    //dateMapGl = { ...dataMap };
    dateMapGl = JSON.parse(JSON.stringify(dataMap));
    dispatch(mapCreate(dateMapGl));

    console.log("MAP:", dateMapGl);

    let massRegion = [];
    for (let key in dateMapGl.regionInfo) {
      if (!isNaN(Number(key))) massRegion.push(Number(key));
    }
    homeRegion = massRegion[0].toString();
    dateStat.region = homeRegion;
    dispatch(statsaveCreate(dateStat));
    flagOpen = false;
    setOpenMapInfo(true);
  }

  return (
    <Grid container sx={{ height: "100vh", width: "100%", bgcolor: "#E9F5D8" }}>
      <Grid item xs>
        {openSetErr && <AppSocketError sErr={soob} setOpen={setOpenSetErr} />}
        {openMapInfo && <MainMapGS />}
      </Grid>
    </Grid>
  );
};

export default App;
