import * as React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CardMedia from "@mui/material/CardMedia";
import { MdOpenWith } from "react-icons/md";

import { Pointer } from "./../App";

import { FullscreenControl, GeolocationControl } from "react-yandex-maps";
import { RulerControl, SearchControl } from "react-yandex-maps";
import { TrafficControl, TypeSelector, ZoomControl } from "react-yandex-maps";

import { searchControl } from "./MainMapStyle";

export const YandexServices = () => {
  return (
    <>
      <FullscreenControl />
      <GeolocationControl options={{ float: "left" }} />
      <RulerControl options={{ float: "right" }} />
      <SearchControl options={searchControl} />
      <TrafficControl options={{ float: "right" }} />
      <TypeSelector options={{ float: "right" }} />
      <ZoomControl options={{ float: "right" }} />
    </>
  );
};

export const MasskPoint = (debug: boolean, rec: any, imgFaza: string) => {
  let masskPoint: Pointer = {
    ID: -1,
    coordinates: [],
    nameCoordinates: rec.description,
    region: Number(rec.region.num),
    area: Number(rec.area.num),
    phases: rec.phases,
    phSvg: [],
  };
  let img = null;
  masskPoint.ID = rec.ID;
  masskPoint.coordinates[0] = rec.points.Y;
  masskPoint.coordinates[1] = rec.points.X;
  for (let i = 0; i < rec.phases.length; i++) masskPoint.phSvg.push(img);
  return masskPoint;
};

export const DecodingCoord = (coord: string) => {
  return coord.split(",").map(Number);
};

export const CodingCoord = (coord: Array<number>) => {
  return String(coord[0]) + "," + String(coord[1]);
};

export const DoublRoute = (massroute: any, pointA: any, pointB: any) => {
  let flDubl = false;
  let pointAcod = CodingCoord(pointA);
  let pointBcod = CodingCoord(pointB);
  for (let i = 0; i < massroute.length; i++)
    if (massroute[i].starts === pointAcod && massroute[i].stops === pointBcod)
      flDubl = true;
  return flDubl;
};

export const CenterCoord = (aY: number, aX: number, bY: number, bX: number) => {
  let coord0 = (aY - bY) / 2 + bY;
  if (aY < bY) coord0 = (bY - aY) / 2 + aY;
  let coord1 = (aX - bX) / 2 + bX;
  if (aX < bX) coord1 = (bX - aX) / 2 + aX;
  return [coord0, coord1];
};

export const Distance = (coord1: Array<number>, coord2: Array<number>) => {
  if (coord1[0] === coord2[0] && coord1[1] === coord2[1]) {
    return 0;
  } else {
    let radlat1 = (Math.PI * coord1[0]) / 180;
    let radlat2 = (Math.PI * coord2[0]) / 180;
    let theta = coord1[1] - coord2[1];
    let radtheta = (Math.PI * theta) / 180;
    let dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) dist = 1;
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515 * 1609.344;
    return dist;
  }
};

export const Сrossroad = () => {
  return (
    <>
      <Box sx={{ fontSize: 15 }}>
        <MdOpenWith />
      </Box>
      {StrokaHelp("]", 1)}
    </>
  );
};

export const HelpAdd = (soobHelpFiest: string) => {
  return (
    <>
      {StrokaHelp(soobHelpFiest, 0)}
      {Сrossroad()}
    </>
  );
};
//=== Placemark =====================================
export const GetPointData = (
  index: number,
  pointAaIndex: number,
  pointBbIndex: number,
  massdk: any,
  map: any,
  massMem: any
) => {
  let cont1 = massdk[index].nameCoordinates + "<br/>";
  let cont3 = map.tflight[index].tlsost.description + "<br/>";
  let cont2 = "[" + massdk[index].ID + ", " + map.tflight[index].idevice + "]";
  let textBalloon = "";
  let nomInRoute = massMem.indexOf(index);
  if (nomInRoute > 0)
    textBalloon = "Промежуточная точка маршрута №" + (nomInRoute + 1);
  if (index === pointBbIndex) textBalloon = "Конец маршрута";
  if (index === pointAaIndex) textBalloon = "Начало маршрута";

  return {
    hintContent: cont1 + cont3 + cont2 + "<br/>" + textBalloon,
  };
};

// export const GetPointOptions1 = (Hoster: any) => {
//   let imger = window.location.origin + '/free/img/notImage.png';
//   if (Hoster) imger = 'data:image/png;base64,' + Hoster;
//   //console.log("###", imger,Hoster );

//   return {
//     // данный тип макета
//     iconLayout: 'default#image',
//     // изображение иконки метки
//     //iconImageHref: '/faza.png',
//     // iconImageHref: 'data:image/png;base64,' + Hoster,
//     iconImageHref: imger,
//     // размеры метки
//     iconImageSize: [50, 50],
//     // её "ножки" (точки привязки)
//     iconImageOffset: [-25, -25],
//   };
// };

// export const GetPointOptions2 = (index: number, massMem: Array<number>) => {
//   let colorBalloon = "islands#violetCircleDotIcon";
//   let aaa = massMem.indexOf(index);

//   if (aaa >= 0) {
//     colorBalloon = "islands#redCircleDotIcon";
//     if (massMem.length === aaa + 1 && massMem.length) {
//       colorBalloon = "islands#darkBlueStretchyIcon";
//     }
//     if (!aaa && massMem.length) {
//       colorBalloon = "islands#redStretchyIcon";
//     }
//   }

//   return {
//     preset: colorBalloon,
//   };
// };

export const ErrorHaveVertex = (rec: any) => {
  alert(
    "Не существует светофор: Район " +
      rec.area +
      " ID " +
      rec.id +
      ". Устройство будет проигнорировано и удалёно из плана"
  );
};

//=== addRoute =====================================
export const getReferencePoints = (pointA: any, pointB: any) => {
  return {
    referencePoints: [pointA, pointB],
  };
};

export const getMultiRouteOptions = () => {
  return {
    routeActiveStrokeWidth: 4,
    //routeActiveStrokeColor: "#224E1F",
    routeStrokeWidth: 0,
    wayPointVisible: false,
  };
};

//=== GsSetPhase ===================================
export const NameMode = () => {
  let nameMode =
    "(" +
    new Date().toLocaleDateString() +
    " " +
    new Date().toLocaleTimeString() +
    ")";
  return nameMode;
};
//=== GsToDoMode ===================================
export const OutputFazaImg = (img: any, i: number) => {
  let widthHeight = 60;
  if (!img) widthHeight = 30;

  const styleFazaImg = {
    fontSize: 27,
    marginTop: -0.5,
    marginLeft: 1,
    color: "#5B1080", // сиреневый
    textShadow: "2px 2px 3px rgba(0,0,0,0.3)",
  };

  return (
    <>
      {img ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          style={{ width: widthHeight, height: widthHeight }}
        >
          <image
            width={"100%"}
            height={"100%"}
            xlinkHref={"data:image/png;base64," + img}
          />
        </svg>
      ) : (
        <Box sx={styleFazaImg}>{i}</Box>
      )}
    </>
  );
};

export const OutputVertexImg = (host: string) => {
  return (
    <CardMedia
      component="img"
      sx={{ textAlign: "center", height: 40, width: 30 }}
      image={host}
    />
  );
};
//=== Разное =======================================
export const StrokaMenuGlob = (soob: string, func: any, mode: number) => {
  let dlSoob = (soob.length + 5) * 8;
  const styleApp01 = {
    fontSize: 14,
    marginRight: 0.3,
    marginTop: -0.2,
    width: dlSoob,
    maxHeight: "21px",
    minHeight: "21px",
    bgcolor: "#C4EAA2", // салатовый
    border: "1px solid #d4d4d4", // серый
    borderRadius: 1,
    color: "black",
    textTransform: "unset !important",
    boxShadow: 4,
  };

  return (
    <Button sx={styleApp01} onClick={() => func(mode)}>
      <b>{soob}</b>
    </Button>
  );
};

export const StrokaHelp = (soobInfo: string, mode: number) => {
  let moder = mode ? "left" : "right";
  let dl = mode ? 20 : 490;

  const styleInfoSoob = {
    marginTop: "-3px",
    width: dl, // 530
    color: "#E6761B", // оранж
    textAlign: moder,
    textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
    fontWeight: 500,
  };

  return (
    <Box sx={styleInfoSoob}>
      <em>{soobInfo}</em>
    </Box>
  );
};

export const StrokaHelpPusto = () => {
  const styleInfoSoob = {
    maxWidth: "1px",
    minWidth: "1px",
    maxHeight: "21px",
    minHeight: "21px",
    backgroundColor: "#E9F5D8",
    p: 1.5,
  };
  return <Button sx={styleInfoSoob}> </Button>;
};
