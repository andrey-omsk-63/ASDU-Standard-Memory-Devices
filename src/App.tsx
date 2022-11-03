import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { mapCreate, massmodeCreate } from "./redux/actions";

import Grid from "@mui/material/Grid";

//import axios from "axios";

import MainMapSMD from "./components/MainMapGs";
import AppSocketError from "./AppSocketError";

import { DateMAP } from './interfaceMAP.d';
//import { DateRoute } from "./interfaceRoute.d";
//import { Tflight } from "./interfaceMAP.d";
import { dataMap } from "./otladkaMaps";
//import { string } from "prop-types";
//import { dataRoute } from "./otladkaRoutes";

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

export interface NameMode  {
  name: string;
  delRec: boolean;
};
export let massMode: NameMode[] = [];

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
let homeRegion: string = "0";
let soob = "";
let flagIni = false;

const App = () => {
  //== Piece of Redux ======================================
  // const map = useSelector((state: any) => {
  //   const { mapReducer } = state;
  //   //return mapReducer.map.dateMap;
  //   return mapReducer.map;
  // });
  //console.log('map:',map)
  let massdk = useSelector((state: any) => {
    const { massdkReducer } = state;
    return massdkReducer.massdk;
  });
  let massmode = useSelector((state: any) => {
    const { massmodeReducer } = state;
    return massmodeReducer.massmode;
  });
  console.log('massmode:',massmode)
  let coordinates = useSelector((state: any) => {
    const { coordinatesReducer } = state;
    return coordinatesReducer.coordinates;
  });
  console.log('coordinates:',coordinates)
  const dispatch = useDispatch();
  //========================================================
  // const IniMassmode = () => {
  //   let ch = 1;
  //   massMode = [];
  //   for (let i = 0; i < dateMapGl.routes.length; i++) {
  //     let nameZU = dateMapGl.routes[i].description;
  //     if (!nameZU) nameZU = "без имени(" + ch++ + ")";
  //     let maskName = {
  //       name: nameZU,
  //       delRec: false,
  //     };
  //     massMode.push(maskName);
  //   }
  //   console.log("massMode:",massMode)
  //   dispatch(massmodeCreate(massMode));
  // }

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
          let massRegion = [];
          for (let key in dateMapGl.regionInfo) {
            if (!isNaN(Number(key))) massRegion.push(Number(key));
          }
          homeRegion = String(massRegion[0]);
          flagIni = true;
          //IniMassmode()
          break;
        default:
          console.log("data_default:", data);
      }
    };
  }, [dispatch, massdk, coordinates]);

  if (WS.url === "wss://localhost:3000/W" && flagOpen) {
    console.log("РЕЖИМ ОТЛАДКИ!!!");
    // axios.get("http://localhost:3000/otladkaMapInfo.json").then(({ data }) => {
    //   console.log("1DATA", data);
    //   // setPointsTfl(data.data.tflight);
    //   // setIsOpenDev(true);
    // });
    dateMapGl = { ...dataMap };
    dispatch(mapCreate(dateMapGl));
    let massRegion = [];
    for (let key in dateMapGl.regionInfo) {
      if (!isNaN(Number(key))) massRegion.push(Number(key));
    }
    homeRegion = String(massRegion[0]);
    // IniMassmode()
    flagOpen = false;
  }

  // if (flagIni) {
  //   IniMassmode()
  //   flagIni = false;
  // }

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
