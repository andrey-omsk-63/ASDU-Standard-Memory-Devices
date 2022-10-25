import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { massdkCreate } from "./../redux/actions";
import { coordinatesCreate } from "./../redux/actions";

import Grid from "@mui/material/Grid";
// import Box from "@mui/material/Box";
// import Button from "@mui/material/Button";
// import Modal from "@mui/material/Modal";
// import Typography from "@mui/material/Typography";

import { YMaps, Map, Placemark, FullscreenControl } from "react-yandex-maps";
import { GeolocationControl, YMapsApi } from "react-yandex-maps";
import { RulerControl, SearchControl } from "react-yandex-maps";
import { TrafficControl, TypeSelector, ZoomControl } from "react-yandex-maps";

import SmdSelectMD from "./SmdComponents/SmdSelectMD";
import SmdMakeMode from "./SmdComponents/SmdMakeMode";
import SmdSetPhase from "./SmdComponents/SmdSetPhase";

// import { DecodingCoord } from "./MapServiceFunctions";
import { getMultiRouteOptions } from "./MapServiceFunctions";
import { getReferencePoints, CenterCoord } from "./MapServiceFunctions";
//import { CenterCoord } from "./MapServiceFunctions";
// import { getMassPolyRouteOptions } from "./MapServiceFunctions";
// import { getMassMultiRouteOptions } from "./MapServiceFunctions";
// import { getMassMultiRouteInOptions } from "./MapServiceFunctions";
import { getPointData, getPointOptions } from "./MapServiceFunctions";
import { StrokaMenuGlob, MasskPoint } from "./MapServiceFunctions";

import { searchControl } from "./MainMapStyle";

// let coordStart: any = []; // рабочий массив коллекции входящих связей
// let coordStop: any = []; // рабочий массив коллекции входящих связей
// let coordStartIn: any = []; // рабочий массив коллекции исходящих связей
// let coordStopIn: any = []; // рабочий массив коллекции исходящих связей
// let massRoute: any = []; // рабочий массив сети связей
// let masSvg: any = ["", ""];

//let debugging = false;
let flagOpen = false;

//let activeRoute: any = null;

let zoom = 10;
let pointCenter: any = 0;
// let reqRoute: any = {
//   dlRoute: 0,
//   tmRoute: 0,
// };

//let pointAa: any = 0;
let pointAaIndex: number = -1;

//let pointBb: any = 0;
let pointBbIndex: number = -1;

let massMem: Array<number> = [];
let massCoord: any = [];
let coordStart: any = [];
let coordStop: any = [];

const MainMapSMD = (props: {
  ws: WebSocket;
  region: any;
  sErr: string;
  svg: any;
  setSvg: any;
}) => {
  //if (WS.url === "wss://localhost:3000/W") debugging = true;
  //== Piece of Redux =======================================
  let massdk = useSelector((state: any) => {
    const { massdkReducer } = state;
    return massdkReducer.massdk;
  });
  let coordinates = useSelector((state: any) => {
    const { coordinatesReducer } = state;
    return coordinatesReducer.coordinates;
  });
  const map = useSelector((state: any) => {
    const { mapReducer } = state;
    return mapReducer.map.dateMap;
  });
  const dispatch = useDispatch();
  //===========================================================
  const [flagPusk, setFlagPusk] = React.useState(false);
  const [selectMD, setSelectMD] = React.useState(false);
  const [makeMode, setMakeMode] = React.useState(false);
  const [setPhase, setSetPhase] = React.useState(false);

  const [ymaps, setYmaps] = React.useState<YMapsApi | null>(null);
  const mapp = React.useRef<any>(null);

  const PressButton = (mode: number) => {
    switch (mode) {
      case 42: // выбор ЗУ
        setSelectMD(true);
        break;
      case 43: // создать режим
        setMakeMode(true);
        break;
      case 44: // назначить фазы
        setSetPhase(true);
    }
  };

  const addRoute = (ymaps: any) => {
    console.log("!!!###", massCoord);
    if (massCoord.length > 1) {
      mapp.current.geoObjects.removeAll(); // удаление старой коллекции связей
      let multiRoute: any = [];
      if (massCoord.length === 2) {
        multiRoute = new ymaps.multiRouter.MultiRoute(
          getReferencePoints(massCoord[0], massCoord[1]),
          getMultiRouteOptions()
        );
      } else {
        let between = []
        for (let i = 1; i < massCoord.length-1; i++) {
          between.push(i)
        }
        multiRoute = new ymaps.multiRouter.MultiRoute(
          {
            referencePoints: massCoord,
            params: {
              viaIndexes: between,
            },
          }
          // {
          //   boundsAutoApply: true,
          // }
        );
      }
      mapp.current.geoObjects.add(multiRoute);
    }
  };

  const MakeNewMassMem = (mass: any) => {
    massMem = [];
    let masRab = []
    for (let i = 0; i < mass.length; i++) {
      massMem.push(mass[i].idx);
      masRab.push(massCoord[i])
    }
    massCoord = [];
    massCoord = masRab;
    ymaps && addRoute(ymaps); // перерисовка связей
    setFlagPusk(!flagPusk);
  };

  const OnPlacemarkClickPoint = (index: number) => {
    let nomInMass = massMem.indexOf(index);
    if (nomInMass < 0) {
      massMem.push(index);
      let masscoord: any = [];
      masscoord[0] = map.tflight[index].points.Y;
      masscoord[1] = map.tflight[index].points.X;
      massCoord.push(masscoord);
    } else {
      massMem.splice(nomInMass, 1);
      massCoord.splice(nomInMass, 1);
    }
    ymaps && addRoute(ymaps); // перерисовка связей
    setFlagPusk(!flagPusk);
  };

  const PlacemarkDo = () => {
    let pAaI = pointAaIndex;
    let pBbI = pointBbIndex;

    const DoPlacemarkDo = (props: { coordinate: any; idx: number }) => {
      const MemoPlacemarkDo = React.useMemo(
        () => (
          <Placemark
            key={props.idx}
            geometry={props.coordinate}
            properties={getPointData(props.idx, pAaI, pBbI, massdk)}
            options={getPointOptions(props.idx, massMem)}
            modules={["geoObject.addon.balloon", "geoObject.addon.hint"]}
            onClick={() => OnPlacemarkClickPoint(props.idx)}
          />
        ),
        [props.coordinate, props.idx]
      );
      return MemoPlacemarkDo;
    };

    return (
      <>
        {flagOpen &&
          coordinates.map((coordinate: any, idx: any) => (
            <DoPlacemarkDo key={idx} coordinate={coordinate} idx={idx} />
          ))}
      </>
    );
  };

  const InstanceRefDo = (ref: React.Ref<any>) => {
    if (ref) {
      mapp.current = ref;
      // mapp.current.events.add("contextmenu", function (e: any) {
      //   if (mapp.current.hint) {
      //     newPointCoord = e.get("coords"); // нажата правая кнопка мыши (созд-е новой точки)
      //     setOpenSetCreate(true);
      //   }
      // });
      mapp.current.events.add("mousedown", function (e: any) {
        pointCenter = mapp.current.getCenter(); // нажата левая/правая кнопка мыши 0, 1 или 2 в зависимости от того, какая кнопка мыши нажата (В IE значение может быть от 0 до 7).
      });
      mapp.current.events.add(["boundschange"], function () {
        pointCenter = mapp.current.getCenter();
        zoom = mapp.current.getZoom(); // покрутили колёсико мыши
      });
    }
  };
  //=== инициализация ======================================
  if (!flagOpen && Object.keys(map.tflight).length) {
    console.log("map:", map);

    for (let i = 0; i < map.tflight.length; i++) {
      let masskPoint = MasskPoint();
      masskPoint.ID = map.tflight[i].ID;
      masskPoint.coordinates[0] = map.tflight[i].points.Y;
      masskPoint.coordinates[1] = map.tflight[i].points.X;
      masskPoint.nameCoordinates = map.tflight[i].description;
      masskPoint.region = Number(map.tflight[i].region.num);
      masskPoint.area = Number(map.tflight[i].area.num);
      masskPoint.newCoordinates = 0;
      massdk.push(masskPoint);
      coordinates.push(masskPoint.coordinates);
    }
    dispatch(massdkCreate(massdk));
    dispatch(coordinatesCreate(coordinates));
    pointCenter = CenterCoord(
      map.boxPoint.point0.Y,
      map.boxPoint.point0.X,
      map.boxPoint.point1.Y,
      map.boxPoint.point1.X
    );
    flagOpen = true;
  }
  //========================================================
  let mapState: any = {
    center: pointCenter,
    zoom,
  };

  return (
    <Grid container sx={{ border: 0, height: "99.9vh" }}>
      {StrokaMenuGlob("Управление картой", PressButton, 41)}
      {StrokaMenuGlob("Выбор ЗУ", PressButton, 42)}
      {/* {StrokaMenuGlob("Создать режим", PressButton, 43)} */}
      {massMem.length > 0 && (
        <>{StrokaMenuGlob("Создать режим", PressButton, 44)}</>
      )}
      {Object.keys(map.tflight).length && (
        <YMaps
          query={{
            apikey: "65162f5f-2d15-41d1-a881-6c1acf34cfa1",
            lang: "ru_RU",
          }}
        >
          <Map
            modules={["multiRouter.MultiRoute", "Polyline"]}
            state={mapState}
            instanceRef={(ref) => InstanceRefDo(ref)}
            onLoad={(ref) => {
              ref && setYmaps(ref);
            }}
            width={"99.8%"}
            height={"97%"}
          >
            {/* сервисы Яндекса */}
            <FullscreenControl />
            <GeolocationControl options={{ float: "left" }} />
            <RulerControl options={{ float: "right" }} />
            <SearchControl options={searchControl} />
            <TrafficControl options={{ float: "right" }} />
            <TypeSelector options={{ float: "right" }} />
            <ZoomControl options={{ float: "right" }} />
            {/* служебные компоненты */}
            <PlacemarkDo />
            {/* <ModalPressBalloon /> */}
            {selectMD && <SmdSelectMD setOpen={setSelectMD} />}
            {makeMode && <SmdMakeMode setOpen={setMakeMode} />}
            {setPhase && (
              <SmdSetPhase
                setOpen={setSetPhase}
                massMem={massMem}
                func={MakeNewMassMem}
              />
            )}
          </Map>
        </YMaps>
      )}
    </Grid>
  );
};

export default MainMapSMD;
