import {
  MAP_CREATE,
  MASSDK_CREATE,
  MASSMODE_CREATE,
  // MASSROUTE_CREATE,
  // MASSROUTEPRO_CREATE,
  COORDINATES_CREATE,
} from "./types";

import { DateMAP } from "./../interfaceMAP.d";
//import { DateRoute } from "./../interfaceRoute.d";
import { Pointer } from "./../App";
import { NameMode } from "./../App";

export function massdkCreate(massDka: Pointer[] = []) {
  return {
    type: MASSDK_CREATE,
    data: massDka,
  };
}

export function massmodeCreate(massMode: NameMode[] = []) {
  return {
    type: MASSMODE_CREATE,
    data: massMode,
  };
}

export function mapCreate(dateMap: DateMAP) {
  return {
    type: MAP_CREATE,
    data: { dateMap },
  };
}

// export function massrouteCreate(massRouter: DateRoute) {
//   return {
//     type: MASSROUTE_CREATE,
//     data: massRouter,
//   };
// }

// export function massrouteproCreate(massRouterPro: DateRoute) {
//   return {
//     type: MASSROUTEPRO_CREATE,
//     data: massRouterPro,
//   };
// }

export function coordinatesCreate(Coordinates: Array<Array<number>>) {
  return {
    type: COORDINATES_CREATE,
    data: Coordinates,
  };
}
