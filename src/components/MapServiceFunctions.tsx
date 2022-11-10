import Button from "@mui/material/Button";

import { Pointer } from "./../App";

import { styleInfoSoob } from "./MainMapStyle";

export const MasskPoint = (rec: any) => {
  let masskPoint: Pointer = {
    ID: -1,
    coordinates: [],
    nameCoordinates: "",
    region: 0,
    area: 0,
    phSvg: [],
  };
  masskPoint.ID = rec.ID;
  masskPoint.coordinates[0] = rec.points.Y;
  masskPoint.coordinates[1] = rec.points.X;
  masskPoint.nameCoordinates = rec.description;
  masskPoint.region = Number(rec.region.num);
  masskPoint.area = Number(rec.area.num);
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
  for (let i = 0; i < massroute.length; i++) {
    if (massroute[i].starts === pointAcod && massroute[i].stops === pointBcod)
      flDubl = true;
  }
  return flDubl;
};

export const CenterCoord = (aY: number, aX: number, bY: number, bX: number) => {
  let coord0 = (aY - bY) / 2 + bY;
  if (aY < bY) coord0 = (bY - aY) / 2 + aY;
  let coord1 = (aX - bX) / 2 + bX;
  if (aX < bX) coord1 = (bX - aX) / 2 + aX;
  return [coord0, coord1];
};

//=== Placemark =====================================
export const getPointData = (
  index: number,
  pointAaIndex: number,
  pointBbIndex: number,
  massdk: any
) => {
  let textBalloon = "";
  if (index === pointBbIndex) textBalloon = "Конец";
  if (index === pointAaIndex) textBalloon = "Начало";

  return {
    hintContent: "ID:" + massdk[index].ID + " " + massdk[index].nameCoordinates, //balloonContent: PressBalloon(index), iconCaption: textBalloon,
    iconContent: textBalloon,
  };
};

export const getPointOptions1 = () => {
  return {
    iconLayout: "default#image",
    iconImageHref: "https://localhost:3000/18.svg",
    iconImageSize: [30, 38],
    iconImageOffset: [-15, -38],
  };
};

export const getPointOptions2 = (index: number, massMem: Array<number>) => {
  let colorBalloon = "islands#violetCircleDotIcon";
  let aaa = massMem.indexOf(index);

  if (aaa >= 0) {
    colorBalloon = "islands#redCircleDotIcon";
    if (massMem.length === aaa + 1 && massMem.length) {
      colorBalloon = "islands#darkBlueStretchyIcon";
    }
    if (!aaa && massMem.length) {
      colorBalloon = "islands#redStretchyIcon";
    }
  }

  return {
    preset: colorBalloon,
  };
};

export const ErrorHaveVertex = (rec: any) => {
  alert(
    "Не существует светофор: Регион " +
      rec.region +
      " Район " +
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

//=== Разное =======================================
// export const RecevKeySvg = (recMassroute: any) => {
//   let keySvg =
//     recMassroute.region.toString() +
//     "-" +
//     recMassroute.area.toString() +
//     "-" +
//     recMassroute.id.toString();
//   return keySvg;
// };

export const StrokaMenuGlob = (soob: string, func: any, mode: number) => {
  let dlSoob = (soob.length + 5) * 8;
  const styleApp01 = {
    fontSize: 14,
    marginRight: 0.1,
    maxWidth: dlSoob,
    minWidth: dlSoob,
    maxHeight: "21px",
    minHeight: "21px",
    backgroundColor: "#D7F1C0",
    color: "black",
    textTransform: "unset !important",
  };

  return (
    <Button sx={styleApp01} onClick={() => func(mode)}>
      <b>{soob}</b>
    </Button>
  );
};

export const StrokaHelp = (soobInfo: string) => {
  return (
    <Button sx={styleInfoSoob}>
      <em>{soobInfo}</em>
    </Button>
  );
};
