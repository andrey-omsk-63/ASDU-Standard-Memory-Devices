import Button from '@mui/material/Button';

// import { Pointer, Router } from "./../App";
import { Pointer } from './../App';
import { Vertex } from './../interfaceRoute';

//import { styleModalMenu } from "./MainMapStyle";

export const MapssdkNewPoint = (
  homeRegion: number,
  coords: any,
  name: string,
  area: number,
  id: number,
) => {
  let masskPoint: Pointer = {
    ID: 0,
    coordinates: [],
    nameCoordinates: '',
    region: 0,
    area: 0,
    newCoordinates: 0,
  };

  masskPoint.ID = id;
  masskPoint.coordinates = coords;
  masskPoint.nameCoordinates = name;
  masskPoint.region = homeRegion;
  masskPoint.area = area;
  masskPoint.newCoordinates = 1;
  return masskPoint;
};

export const MassrouteNewPoint = (
  homeRegion: number,
  coords: any,
  name: string,
  area: number,
  id: number,
) => {
  let masskPoint: Vertex = {
    region: 0,
    area: 0,
    id: 0,
    dgis: '',
    scale: 0,
    lin: [],
    lout: [],
    name: '',
  };

  masskPoint.region = homeRegion;
  masskPoint.area = area;
  masskPoint.id = id;
  masskPoint.dgis = CodingCoord(coords);
  masskPoint.name = name;
  masskPoint.scale = 0;
  return masskPoint;
};

// export const RecordMassRoute = (
//   fromCross: any,
//   toCross: any,
//   massBind: Array<number>,
//   reqRoute: any
// ) => {
//   let masskRoute: Router = {
//     region: 0,
//     sourceArea: 0,
//     sourceID: 0,
//     targetArea: 0,
//     targetID: 0,
//     lsource: 0,
//     ltarget: 0,
//     starts: "",
//     stops: "",
//     lenght: 0,
//     time: 0,
//   };

//   masskRoute.region = Number(fromCross.pointAaRegin);
//   masskRoute.sourceArea = Number(fromCross.pointAaArea);
//   masskRoute.sourceID = fromCross.pointAaID;
//   masskRoute.targetArea = Number(toCross.pointBbArea);
//   masskRoute.targetID = toCross.pointBbID;
//   masskRoute.starts = fromCross.pointAcod;
//   masskRoute.stops = toCross.pointBcod;
//   masskRoute.lsource = massBind[0];
//   masskRoute.ltarget = massBind[1];
//   masskRoute.lenght = reqRoute.dlRoute;
//   masskRoute.time = reqRoute.tmRoute;

//   return masskRoute;
// };

export const DecodingCoord = (coord: string) => {
  return coord.split(',').map(Number);
};

export const CodingCoord = (coord: Array<number>) => {
  return String(coord[0]) + ',' + String(coord[1]);
};

export const DoublRoute = (massroute: any, pointA: any, pointB: any) => {
  let flDubl = false;
  let pointAcod = CodingCoord(pointA);
  let pointBcod = CodingCoord(pointB);
  for (let i = 0; i < massroute.length; i++) {
    if (massroute[i].starts === pointAcod && massroute[i].stops === pointBcod) flDubl = true;
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
  massdk: any,
) => {
  let textBalloon = '';
  if (index === pointBbIndex) textBalloon = 'Конец';
  if (index === pointAaIndex) textBalloon = 'Начало';

  //console.log("3massdk:",index,massdk)

  return {
    hintContent: 'ID:' + massdk[index].ID + ' ' + massdk[index].nameCoordinates, //balloonContent: PressBalloon(index), iconCaption: textBalloon,
    iconContent: textBalloon,
  };
};

export const getPointOptions1 = () => {
  return {
    iconLayout: 'default#image',
    iconImageHref: 'https://localhost:3000/18.svg',
    iconImageSize: [30, 38],
    iconImageOffset: [-15, -38],
  };
};

export const getPointOptions2 = (index: number, massMem: Array<number>) => {
  let colorBalloon = 'islands#violetCircleDotIcon';
  let aaa = massMem.indexOf(index);

  if (aaa >= 0) {
    colorBalloon = 'islands#redCircleDotIcon';
    if (massMem.length === aaa + 1 && massMem.length) {
      colorBalloon = 'islands#darkBlueStretchyIcon';
    }
    if (!aaa && massMem.length) {
      colorBalloon = 'islands#redStretchyIcon';
    }
  }

  return {
    preset: colorBalloon,
  };
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

// export const getMassPolyRouteOptions = () => {
//   return {
//     balloonCloseButton: false,
//     strokeColor: "#1A9165",
//     strokeWidth: 1,
//   };
// };

// export const getMassMultiRouteOptions = () => {
//   return {
//     balloonCloseButton: false,
//     routeStrokeStyle: "dot",
//     strokeColor: "#1A9165",
//     routeActiveStrokeWidth: 2,
//     routeStrokeWidth: 0,
//   };
// };

// export const getMassMultiRouteInOptions = () => {
//   return {
//     routeActiveStrokeWidth: 2,
//     routeStrokeStyle: "dot",
//     routeActiveStrokeColor: "#E91427",
//     routeStrokeWidth: 0,
//   };
// };

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
  let dlSoob = (soob.length + 5) * 7.5;
  const styleApp01 = {
    fontSize: 14,
    marginRight: 0.1,
    maxWidth: dlSoob,
    minWidth: dlSoob,
    maxHeight: '21px',
    minHeight: '21px',
    backgroundColor: '#D7F1C0',
    color: 'black',
    textTransform: 'unset !important',
  };

  return (
    <Button sx={styleApp01} onClick={() => func(mode)}>
      <b>{soob}</b>
    </Button>
  );
};

// export const StrokaBalloon = (soob: string, func: any, mode: number) => {
//   return (
//     <Button sx={styleModalMenu} onClick={() => func(mode)}>
//       <b>{soob}</b>
//     </Button>
//   );
// };

export const MasskPoint = () => {
  let masskPoint: Pointer = {
    ID: -1,
    coordinates: [],
    nameCoordinates: '',
    region: 0,
    area: 0,
    newCoordinates: 0,
  };
  return masskPoint;
};

// export const ChangeCrossFunc = (fromCross: any, toCross: any) => {
//   let cross: any = {
//     Region: "",
//     Area: "",
//     ID: 0,
//     Cod: "",
//   };
//   cross.Region = fromCross.pointAaRegin;
//   cross.Area = fromCross.pointAaArea;
//   cross.ID = fromCross.pointAaID;
//   cross.Cod = fromCross.pointAcod;
//   fromCross.pointAaRegin = toCross.pointBbRegin;
//   fromCross.pointAaArea = toCross.pointBbArea;
//   fromCross.pointAaID = toCross.pointBbID;
//   fromCross.pointAcod = toCross.pointBcod;
//   toCross.pointBbRegin = cross.Region;
//   toCross.pointBbArea = cross.Area;
//   toCross.pointBbID = cross.ID;
//   toCross.pointBcod = cross.Cod;
//   let mass: any = [];
//   mass.push(fromCross);
//   mass.push(toCross);
//   return mass;
// };
