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
  region: string;
}

export let dateStat: Stater = {
  ws: null,
  region: "",
};

export interface Pointer {
  ID: number;
  coordinates: Array<number>;
  nameCoordinates: string;
  region: number;
  area: number;
  newCoordinates: number;
}
export let massDk: Pointer[] = [];

export interface NameMode {
  name: string;
  delRec: boolean;
}
export let massMode: NameMode[] = [];

export let Coordinates: Array<Array<number>> = []; // массив координат

let flagOpen = true;
let flagOpenWS = true;
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

  if (flagOpenWS) {
    WS = new WebSocket(host);
    dateStat.ws = WS;
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
      console.log("пришло:", allData.type, data);
      switch (allData.type) {
        case "mapInfo":
          dateMapGl = JSON.parse(JSON.stringify(data));
          dispatch(mapCreate(dateMapGl));
          let massRegion = [];
          for (let key in dateMapGl.regionInfo) {
            if (!isNaN(Number(key))) massRegion.push(Number(key));
          }
          homeRegion = String(massRegion[0]);
          dateStat.region = homeRegion;
          dispatch(statsaveCreate(dateStat));
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
    homeRegion = String(massRegion[0]);
    dateStat.region = homeRegion;
    dispatch(statsaveCreate(dateStat));
    flagOpen = false;
  }

  return (
    <Grid container sx={{ height: "100vh", width: "100%", bgcolor: "#E9F5D8" }}>
      <Grid item xs>
        {openSetErr && <AppSocketError sErr={soob} setOpen={setOpenSetErr} />}
        <MainMapGS
          // ws={WS}
          // region={homeRegion}
          // sErr={soob}
          // svg={svg}
          // setSvg={setSvg}
        />
      </Grid>
    </Grid>
  );
};

export default App;
