import { debug, WS } from "./../App";

//=== GsSetPhase ===================================
export const SendSocketCreateRoute = (maskRoutes: any) => {
  console.log("CreateRoute:", maskRoutes);
  const handleSendOpen = () => {
    if (!debug) {
      if (WS.readyState === WebSocket.OPEN) {
        WS.send(
          JSON.stringify({
            type: "createRoute",
            region: maskRoutes.region,
            description: maskRoutes.description,
            listTL: maskRoutes.listTL,
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

export const SendSocketUpdateRoute = (maskRoutes: any) => {
  //console.log("UpdateRoute:", maskRoutes);
  const handleSendOpen = () => {
    if (!debug) {
      if (WS.readyState === WebSocket.OPEN) {
        WS.send(
          JSON.stringify({
            type: "updateRoute",
            region: maskRoutes.region,
            description: maskRoutes.description,
            listTL: maskRoutes.listTL,
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

export const SendSocketDeleteRoute = (maskRoutes: any) => {
  console.log("DeleteRoute:", maskRoutes);
  const handleSendOpen = () => {
    if (!debug) {
      if (WS.readyState === WebSocket.OPEN) {
        WS.send(
          JSON.stringify({
            type: "deleteRoute",
            region: maskRoutes.region,
            description: maskRoutes.description,
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
//=== GsToDoMode ===================================
export const SendSocketRoute = (
  devicesProps: Array<number>,
  turnOnProps: boolean
) => {
  console.log("Route:", devicesProps, turnOnProps);
  const handleSendOpen = () => {
    if (!debug) {
      if (WS.readyState === WebSocket.OPEN) {
        WS.send(
          JSON.stringify({
            type: "route",
            devices: devicesProps,
            turnOn: turnOnProps,
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

export const SendSocketDispatch = (
  idevice: number,
  cmdd: number,
  faza: number
) => {
  //console.log("Dispatch:", cmdd, faza);
  const handleSendOpen = () => {
    if (!debug) {
      if (WS.readyState === WebSocket.OPEN) {
        WS.send(
          JSON.stringify({
            type: "dispatch",
            id: idevice,
            cmd: cmdd,
            param: faza,
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
//=== SendSocket ===================================
export const SendSocketGetPhases = (
  region: string,
  area: string,
  id: number
) => {
  //console.log("SendGetPhases:", id);
  const handleSendOpen = () => {
    if (!debug) {
      if (WS.readyState === WebSocket.OPEN) {
        WS.send(
          JSON.stringify({
            type: "getPhases",
            pos: { region, area, id },
          })
        );
      } else {
        setTimeout(() => {
          handleSendOpen();
        }, 500);
      }
    }
  };
  handleSendOpen();
};

export const SendSocketRouteHistory = (
  descr: string
) => {
  console.log("GetRouteHistory:", descr);
  const handleSendOpen = () => {
    if (!debug) {
      if (WS.readyState === WebSocket.OPEN) {
        WS.send(
          JSON.stringify({
            type: "getRouteHistory",
            description: descr,
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
