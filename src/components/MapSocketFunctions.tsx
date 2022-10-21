import { Way } from "./../interfaceRoute";

//=== SendSocket ===================================

export const SendSocketCreatePoint = (
  debugging: boolean,
  ws: WebSocket,
  codCoord: string,
  adress: string
) => {
  const handleSendOpen = () => {
    if (!debugging) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: "createPoint",
            data: {
              position: codCoord,
              name: adress,
            },
          })
        );
      } else {
        setTimeout(() => {
          handleSendOpen();
        }, 1000);
      }
    }
  };
  handleSendOpen();
};

export const SendSocketDeletePoint = (
  debugging: boolean,
  ws: WebSocket,
  id: number
) => {
  const handleSendOpen = () => {
    if (!debugging) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "deletePoint", data: { id } }));
      } else {
        setTimeout(() => {
          handleSendOpen();
        }, 1000);
      }
    }
  };
  handleSendOpen();
};

export const SendSocketCreateVertex = (
  debugging: boolean,
  ws: WebSocket,
  region: number,
  area: number,
  ID: number
) => {
  const handleSendOpen = () => {
    if (!debugging) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: "createVertex",
            data: {
              region: region.toString(),
              area: area.toString(),
              id: ID,
            },
          })
        );
      } else {
        setTimeout(() => {
          handleSendOpen();
        }, 1000);
      }
    }
  };
  handleSendOpen();
};

export const SendSocketDeleteVertex = (
  debugging: boolean,
  ws: WebSocket,
  region: string,
  area: string,
  id: number
) => {
  const handleSendOpen = () => {
    if (!debugging) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({ type: "deleteVertex", data: { region, area, id } })
        );
      } else {
        setTimeout(() => {
          handleSendOpen();
        }, 1000);
      }
    }
  };
  handleSendOpen();
};

export const SendSocketCreateWay = (
  debugging: boolean,
  ws: WebSocket,
  fromCr: any,
  toCr: any,
  massBind: Array<number>,
  reqRoute: any
) => {
  const handleSendOpen = () => {
    if (!debugging) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: "createWay",
            data: {
              fromCross: {
                region: fromCr.pointAaRegin,
                area: fromCr.pointAaArea,
                id: fromCr.pointAaID,
              },
              toCross: {
                region: toCr.pointBbRegin,
                area: toCr.pointBbArea,
                id: toCr.pointBbID,
              },
              lsource: massBind[0],
              ltarget: massBind[1],
              lenght: reqRoute.dlRoute,
              time: reqRoute.tmRoute,
            },
          })
        );
      } else {
        setTimeout(() => {
          handleSendOpen();
        }, 1000);
      }
    }
  };
  handleSendOpen();
};

export const SendSocketDeleteWay = (
  debugging: boolean,
  ws: WebSocket,
  fromCr: any,
  toCr: any
) => {
  const handleSendOpen = () => {
    if (!debugging) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: "deleteWay",
            data: {
              fromCross: {
                region: fromCr.pointAaRegin,
                area: fromCr.pointAaArea,
                id: fromCr.pointAaID,
              },
              toCross: {
                region: toCr.pointBbRegin,
                area: toCr.pointBbArea,
                id: toCr.pointBbID,
              },
            },
          })
        );
      } else {
        setTimeout(() => {
          handleSendOpen();
        }, 1000);
      }
    }
  };
  handleSendOpen();
};

export const SendSocketCreateWayFromPoint = (
  debugging: boolean,
  ws: WebSocket,
  fromCr: any,
  toCr: any,
  massBind: Array<number>,
  reqRoute: any
) => {
  const handleSendOpen = () => {
    if (!debugging) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: "createWayFromPoint",
            data: {
              fromPoint: fromCr.pointAaID,
              toCross: {
                region: toCr.pointBbRegin,
                area: toCr.pointBbArea,
                id: toCr.pointBbID,
              },
              lsource: massBind[0],
              ltarget: massBind[1],
              lenght: reqRoute.dlRoute,
              time: reqRoute.tmRoute,
            },
          })
        );
      } else {
        setTimeout(() => {
          handleSendOpen();
        }, 1000);
      }
    }
  };
  handleSendOpen();
};

export const SendSocketDeleteWayFromPoint = (
  debugging: boolean,
  ws: WebSocket,
  fromCr: any,
  toCr: any
  // lengthRoute: number
) => {
  const handleSendOpen = () => {
    if (!debugging) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: "deleteWayFromPoint",
            data: {
              fromPoint: fromCr.pointAaID,
              toCross: {
                region: toCr.pointBbRegin,
                area: toCr.pointBbArea,
                id: toCr.pointBbID,
              },
              //lenght: lengthRoute,
            },
          })
        );
      } else {
        setTimeout(() => {
          handleSendOpen();
        }, 1000);
      }
    }
  };
  handleSendOpen();
};

export const SendSocketCreateWayToPoint = (
  debugging: boolean,
  ws: WebSocket,
  fromCr: any,
  toCr: any,
  massBind: Array<number>,
  reqRoute: any
) => {
  const handleSendOpen = () => {
    if (!debugging) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: "createWayToPoint",
            data: {
              fromCross: {
                region: fromCr.pointAaRegin,
                area: fromCr.pointAaArea,
                id: fromCr.pointAaID,
              },
              toPoint: toCr.pointBbID,
              lsource: massBind[0],
              ltarget: massBind[1],
              lenght: reqRoute.dlRoute,
              time: reqRoute.tmRoute,
            },
          })
        );
      } else {
        setTimeout(() => {
          handleSendOpen();
        }, 1000);
      }
    }
  };
  handleSendOpen();
};

export const SendSocketDeleteWayToPoint = (
  debugging: boolean,
  ws: WebSocket,
  fromCr: any,
  toCr: any
  // reqRoute: any
) => {
  const handleSendOpen = () => {
    if (!debugging) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: "deleteWayToPoint",
            data: {
              fromCross: {
                region: fromCr.pointAaRegin,
                area: fromCr.pointAaArea,
                id: fromCr.pointAaID,
              },
              toPoint: toCr.pointBbID,
              // lenght: reqRoute.dlRoute,
            },
          })
        );
      } else {
        setTimeout(() => {
          handleSendOpen();
        }, 1000);
      }
    }
  };
  handleSendOpen();
};

export const SendSocketGetSvg = (
  debugging: boolean,
  ws: WebSocket,
  region: number,
  areaIn: number,
  idIn: number,
  areaOn: number,
  idOn: number
) => {
  const handleSendOpen = () => {
    if (!debugging) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: "getSvg",
            data: {
              devices: [
                {
                  region: region.toString(),
                  area: areaIn.toString(),
                  id: idIn,
                },
                {
                  region: region.toString(),
                  area: areaOn.toString(),
                  id: idOn,
                },
              ],
            },
          })
        );
      } else {
        setTimeout(() => {
          handleSendOpen();
        }, 1000);
      }
    }
  };
  handleSendOpen();
};
//==================================================
export const SocketDeleteWay = (
  debugging: boolean,
  WS: WebSocket,
  ways: Way
) => {
  let fromCross: any = {
    pointAaRegin: "",
    pointAaArea: "",
    pointAaID: 0,
    pointAcod: "",
  };
  let toCross: any = {
    pointBbRegin: "",
    pointBbArea: "",
    pointBbID: 0,
    pointBcod: "",
  };

  fromCross.pointAaRegin = ways.region.toString();
  fromCross.pointAaArea = ways.sourceArea.toString();
  fromCross.pointAaID = ways.sourceID;
  fromCross.pointAcod = ways.starts;
  toCross.pointBbRegin = ways.region.toString();
  toCross.pointBbArea = ways.targetArea.toString();
  toCross.pointBbID = ways.targetID;
  toCross.pointBcod = ways.stops;
  if (ways.sourceArea === 0) {
    SendSocketDeleteWayFromPoint(debugging, WS, fromCross, toCross);
  } else {
    if (ways.targetArea === 0) {
      SendSocketDeleteWayToPoint(debugging, WS, fromCross, toCross);
    } else {
      SendSocketDeleteWay(debugging, WS, fromCross, toCross);
    }
  }
};

//=== SoobErrorSocket ==============================

export const SoobErrorCreateWay = (data: any) => {
  let soob =
    "Произошла ошибка при создании связи перекрёстка (район:" +
    data.fromCross.area +
    " ID:" +
    data.fromCross.id +
    ") c перекрёстком (район:" +
    data.toCross.area +
    " ID:" +
    data.toCross.id +
    ")";
  return soob;
};

export const SoobErrorDeleteWay = (data: any) => {
  let soob =
    "Произошла ошибка при удалении связи перекрёстка (район:" +
    data.fromCross.area +
    " ID:" +
    data.fromCross.id +
    ") c перекрёстком (район:" +
    data.toCross.area +
    " ID:" +
    data.toCross.id +
    ")";
  return soob;
};

export const SoobErrorCreateWayToPoint = (data: any) => {
  let soob =
    "Произошла ошибка при создании связи перекрёстка (район:" +
    data.fromCross.area +
    " ID:" +
    data.fromCross.id +
    ") c точкой";
  return soob;
};

export const SoobErrorDeleteWayToPoint = (data: any) => {
  let soob =
    "Произошла ошибка при удалении связи перекрёстка (район:" +
    data.fromCross.area +
    " ID:" +
    data.fromCross.id +
    ") c точкой";
  return soob;
};

export const SoobErrorCreateWayFromPoint = (data: any) => {
  let soob =
    "Произошла ошибка при создании связи точки с перекрёстком (район:" +
    data.toCross.area +
    " ID:" +
    data.toCross.id +
    ")";
  return soob;
};

export const SoobErrorDeleteWayFromPoint = (data: any) => {
  let soob =
    "Произошла ошибка при удалении связи точки с перекрёстком (район:" +
    data.toCross.area +
    " ID:" +
    data.toCross.id +
    ")";
  return soob;
};
