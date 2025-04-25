import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { mapCreate, massmodeCreate } from "../redux/actions";
import { massfazCreate, statsaveCreate } from "../redux/actions";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import { YMaps, Map, YMapsApi } from "react-yandex-maps";

import GsSelectMD from "./GsComponents/GsSelectMD";
import GsSetPhase from "./GsComponents/GsSetPhase";
import GsToDoMode from "./GsComponents/GsToDoMode";
import GsErrorMessage from "./GsComponents/GsErrorMessage";
import GsDoPlacemarkDo from "./GsComponents/GsDoPlacemarkDo";
import GsSetup from "./GsComponents/GsSetup";
import GsFragments from "./GsComponents/GsFragments";

import { StrokaHelp } from "./MapServiceFunctions";
import { CenterCoordBegin, PutItInAFrame } from "./MapServiceFunctions";
import { ErrorHaveVertex, Distance, SaveZoom } from "./MapServiceFunctions";
import { MenuGl, YandexServices, DrawCircle } from "./MapServiceFunctions";
import { InformalRoutes, FormalRoutes } from "./MapServiceFunctions";

import { SendSocketUpdateRoute } from "./MapSocketFunctions";
import { SendSocketDispatch, SendSocketGetPhases } from "./MapSocketFunctions";

import { YMapsModul, MyYandexKey, GoodCODE } from "./MapConst";

import { styleServisTable } from "./MainMapStyle";

export let DEMO = false;
let flagOpen = false;
let zoom = 0;
let zoomOld = 0;
let pointCenter: any = 0;
let massMem: Array<number> = [];
let massCoord: any = [];
let newMode = -1;
let soobErr = "";
let helper = true;
let modeToDo = 0;
let newCenter: any = [];
let funcContex: any = null;
let funcBound: any = null;
let needDrawCircle = false; // нужно перерисовать окружности вокруг светофора
let circls: any = [null, null];

const MainMapGs = (props: {
  trigger: boolean;
  history: any;
  trHist: boolean;
}) => {
  //== Piece of Redux =======================================
  const map = useSelector((state: any) => {
    const { mapReducer } = state;
    return mapReducer.map.dateMap;
  });
  let massdk = useSelector((state: any) => {
    const { massdkReducer } = state;
    return massdkReducer.massdk;
  });
  let massfaz = useSelector((state: any) => {
    const { massfazReducer } = state;
    return massfazReducer.massfaz;
  });
  let massmode = useSelector((state: any) => {
    const { massmodeReducer } = state;
    return massmodeReducer.massmode;
  });
  let coordinates = useSelector((state: any) => {
    const { coordinatesReducer } = state;
    return coordinatesReducer.coordinates;
  });
  let datestat = useSelector((state: any) => {
    const { statsaveReducer } = state;
    return statsaveReducer.datestat;
  });
  const typeRoute = datestat.typeRoute; // тип отображаемых связей
  const dispatch = useDispatch();
  DEMO = datestat.demo;
  //===========================================================
  const [flagPusk, setFlagPusk] = React.useState(false);
  const [needSetup, setNeedSetup] = React.useState(false);
  const [fragments, setFragments] = React.useState(false);
  const [selectMD, setSelectMD] = React.useState(false);
  const [setPhase, setSetPhase] = React.useState(false);
  const [toDoMode, setToDoMode] = React.useState(false);
  const [flagCenter, setFlagCenter] = React.useState(false);
  const [openSoobErr, setOpenSoobErr] = React.useState(false);
  const [risovka, setRisovka] = React.useState(false);
  const [trigger, setTrigger] = React.useState(false);
  const [changeFaz, setChangeFaz] = React.useState(false);
  const [stopCount, setStopCount] = React.useState(-1);
  const [startCount, setStartCount] = React.useState(-1);
  const [ymaps, setYmaps] = React.useState<YMapsApi | null>(null);
  const [demoSost, setDemoSost] = React.useState(-1);
  const mapp = React.useRef<any>(null);

  const InsertInMassMem = (idx: number) => {
    if (!massdk[idx].readIt) {
      let region = massdk[idx].region.toString();
      let area = massdk[idx].area.toString();
      SendSocketGetPhases(region, area, massdk[idx].ID);
    }
    massMem.push(idx);
  };

  const addRoute = React.useCallback(
    (ymaps: any, bound: boolean) => {
      mapp.current.geoObjects.removeAll(); // удаление старой коллекции связей
      if (massCoord.length > 1) {
        typeRoute && InformalRoutes(ymaps, mapp, massCoord);
        !typeRoute && FormalRoutes(ymaps, mapp, massCoord);
        bound && PutItInAFrame(ymaps, mapp, massCoord); // перерисовка маршрута в границах экрана
        circls = DrawCircle(ymaps, mapp, massCoord); // нарисовать окружности в начале/конце маршрута
      }
    },
    [typeRoute]
  );

  const ReceiveIdxGs = (mode: number) => {
    let massErrRec = [];
    massMem = [];
    massCoord = [];
    for (let i = 0; i < map.routes[mode].listTL.length; i++) {
      let idx = -1;
      for (let j = 0; j < map.tflight.length; j++) {
        if (
          //map.routes[mode].listTL[i].pos.region === map.tflight[j].region.num &&
          //map.routes[mode].listTL[i].pos.area === map.tflight[j].area.num &&
          map.routes[mode].listTL[i].pos.id === map.tflight[j].ID
        ) {
          idx = j;
          break;
        }
      }
      if (idx < 0) {
        ErrorHaveVertex(map.routes[mode].listTL[i].pos);
        massErrRec.push(i);
      } else {
        let masscoord: any = [];
        masscoord[0] = map.routes[mode].listTL[i].point.Y;
        masscoord[1] = map.routes[mode].listTL[i].point.X;
        InsertInMassMem(idx);
        massCoord.push(masscoord);
      }
    }
    if (massErrRec.length) {
      let massRabMap = []; // редактируем у себя map
      for (let i = 0; i < map.routes[mode].listTL.length; i++) {
        if (!massErrRec.includes(i)) {
          massRabMap.push(map.routes[mode].listTL[i]);
        }
      }
      map.routes[mode].listTL = massRabMap;
      SendSocketUpdateRoute(map.routes[mode]);
      dispatch(mapCreate(map));
    }

    let massBusy = [];
    let soob = "";
    soobErr = "";
    for (let i = 0; i < map.routes[mode].listTL.length; i++) {
      for (let j = 0; j < map.tflight.length; j++) {
        if (map.routes[mode].listTL[i].pos.id === map.tflight[j].ID) {
          let statusVertex = map.tflight[j].tlsost.num;
          let goodCode = GoodCODE.indexOf(statusVertex) < 0 ? false : true; // светофор занят другим пользователем?
          if (goodCode) {
            soob = soob + ", " + map.tflight[j].ID;
            massBusy.push(map.tflight[j].ID);
          }
        }
      }
    }
    if (soob) {
      soob = soob.slice(2);
      soobErr =
        "⚠️Предупреждение\xa0\xa0\xa0" +
        (massBusy.length === 1 ? "Перекрёсток ID " : "Перекрёстки ID ") +
        soob +
        (massBusy.length === 1 ? " управляется" : " управляются") +
        " другим пользователем и " +
        (massBusy.length === 1
          ? "начнёт работать как только освободится"
          : "начнут работать как только освободятся");
      setOpenSoobErr(true);
    }
    console.log("massBusy:", massBusy, soobErr);

    newMode = mode;
    ymaps && addRoute(ymaps, true); // перерисовка связей
    setFlagPusk(!flagPusk);
  };

  const StatusQuo = React.useCallback(() => {
    massMem = [];
    massCoord = [];
    newMode = -1;
    datestat.create = true;
    //datestat.demo = false;
    ymaps && addRoute(ymaps, (datestat.demo = false)); // перерисовка связей
    dispatch(statsaveCreate(datestat));
    setTrigger(!trigger);
  }, [datestat, dispatch, trigger, ymaps, addRoute]);

  const SetFragments = (idx: number) => {
    if (idx >= 0 && ymaps) {
      mapp.current.geoObjects.removeAll(); // удаление старой коллекции связей
      PutItInAFrame(ymaps, mapp, map.fragments[idx].bounds); // расположить фрагмент в границах экрана
    }
    setFragments(false);
  };

  const MakeNewMassMem = (mass: any) => {
    if (mass.length) {
      massMem = [];
      let masRab = [];
      for (let i = 0; i < mass.length; i++) {
        InsertInMassMem(mass[i].idx);
        masRab.push(massdk[mass[i].idx].coordinates);
      }
      massCoord = [];
      massCoord = masRab;
      ymaps && addRoute(ymaps, false); // перерисовка связей
      setFlagPusk(!flagPusk);
    } else StatusQuo();
  };

  const OnPlacemarkClickPoint = (index: number) => {
    datestat.nomIllum = -1;
    if (!datestat.working) {
      let nomInMass = massMem.indexOf(index);
      let masscoord: any = [];
      if (newMode < 0) {
        // создание нового режима
        if (nomInMass < 0) {
          InsertInMassMem(index);
          masscoord[0] = map.tflight[index].points.Y;
          masscoord[1] = map.tflight[index].points.X;
          massCoord.push(masscoord);
        } else {
          massMem.splice(nomInMass, 1);
          massCoord.splice(nomInMass, 1);
        }
        ymaps && addRoute(ymaps, false); // перерисовка связей
        setFlagPusk(!flagPusk);
      } else {
        // работа с существующем режимом
        if (nomInMass >= 0 && nomInMass < massMem.length) {
          datestat.nomIllum = nomInMass;
          if (nomInMass + 1 < massMem.length) {
            masscoord[0] = map.tflight[massMem[nomInMass + 1]].points.Y;
            masscoord[1] = map.tflight[massMem[nomInMass + 1]].points.X;
            NewPointCenter(masscoord);
          }
          if (datestat.toDoMode) {
            massfaz[nomInMass].runRec = datestat.demo ? 4 : 2; // включить исполнение
            dispatch(massfazCreate(massfaz));
            setStartCount(nomInMass); // запрос на запуск отправки фазы
          }
          setChangeFaz(!changeFaz);
        }
      }
    }
    dispatch(statsaveCreate(datestat));
  };
  //=== вывод светофоров ===================================
  const PlacemarkDo = () => {
    return (
      <>
        {flagOpen &&
          coordinates.map((coordinate: any, idx: any) => (
            <GsDoPlacemarkDo
              key={idx}
              ymaps={ymaps}
              coordinate={coordinate}
              idx={idx}
              massMem={massMem}
              OnPlacemarkClickPoint={OnPlacemarkClickPoint}
            />
          ))}
      </>
    );
  };
  //=== обработка instanceRef ==============================
  const FindNearVertex = (coord: Array<number>) => {
    let nomInMap = -1;
    let minDist = 999999;
    if (!datestat.toDoMode) {
      nomInMap = -1;
      for (let i = 0; i < map.tflight.length; i++) {
        let corFromMap = [map.tflight[i].points.Y, map.tflight[i].points.X];
        let dister = Distance(coord, corFromMap);
        if (dister < 100 && minDist > dister) {
          minDist = dister;
          nomInMap = i;
        }
      }
      if (nomInMap < 0) {
        soobErr =
          "В радиусе 100м от указанной точки управляемые перекрёстки отсутствуют";
        setOpenSoobErr(true);
      } else {
        if (massMem.indexOf(nomInMap) >= 0) {
          soobErr = "Перекрёсток [" + massdk[nomInMap].region + ", ";
          soobErr += massdk[nomInMap].area + ", " + massdk[nomInMap].ID + ", ";
          soobErr += map.tflight[nomInMap].idevice + "] уже используется";
          setOpenSoobErr(true);
        } else {
          InsertInMassMem(nomInMap);
          massCoord.push(coord);
          setRisovka(true);
        }
      }
    } else {
      for (let i = 0; i < massMem.length; i++) {
        let corFromMap = [massfaz[i].coordinates[0], massfaz[i].coordinates[1]];
        let dister = Distance(coord, corFromMap);
        if (dister < 200 && minDist > dister) {
          minDist = dister; // нажали правой кнопкой на светофор
          nomInMap = i;
        }
      }
      if (nomInMap < 0) {
        // нажали правой кнопкой в чистое поле
        // нужно найти первый запущенный светофор на маршруте
        for (let i = 0; i < massMem.length; i++) {
          if (massfaz[i].runRec === 2 || massfaz[i].runRec === 4) {
            nomInMap = i;
            break;
          }
        }
      }
      if (nomInMap >= 0) {
        datestat.nomIllum = nomInMap;
        dispatch(statsaveCreate(datestat));
        setStopCount(nomInMap); // запрос на остановку отправки фазы
        setChangeFaz(!changeFaz);
        setRisovka(true);
      }
    }
  };

  const Pererisovka = () => {
    if (risovka) {
      ymaps && addRoute(ymaps, false); // перерисовка связей
      setRisovka(false);
    }
  };

  const InstanceRefDo = (ref: React.Ref<any>) => {
    if (ref) {
      mapp.current = ref;
      mapp.current.events.remove("contextmenu", funcContex);
      funcContex = function (e: any) {
        if (mapp.current.hint && !datestat.working)
          FindNearVertex(e.get("coords")); // нажата правая кнопка мыши
      };
      mapp.current.events.add("contextmenu", funcContex);
      mapp.current.events.remove("boundschange", funcBound);
      funcBound = function () {
        pointCenter = mapp.current.getCenter();
        zoom = mapp.current.getZoom(); // покрутили колёсико мыши
        if (zoomOld !== zoom) {
          needDrawCircle = true;
          zoomOld = zoom;
          setFlagPusk(!flagPusk);
        }
        SaveZoom(zoom, pointCenter);
      };
      mapp.current.events.add("boundschange", funcBound);
      if (flagCenter) {
        pointCenter = newCenter;
        SaveZoom(zoom, pointCenter);
        setFlagCenter(false);
      }
    }
  };
  //========================================================
  const NewPointCenter = (coord: any) => {
    newCenter = coord;
    setFlagCenter(true);
  };

  const OldSizeWind = () => {
    modeToDo = 0;
    setToDoMode(false);
  };

  const ModeToDo = (mod: number) => {
    modeToDo = mod;
    if (!modeToDo) {
      helper = true;
      StatusQuo();
    }
    setFlagPusk(!flagPusk);
  };

  const SetSetPhase = (mode: boolean) => {
    if (!mode) {
      soobErr =
        "⚠️Предупреждение. Произошло изменение названия ЗУ, поэтому пропадёт история изменения параметров.";
      setOpenSoobErr(true);
    }
    setSetPhase(false);
  };

  const SetHelper = (mod: boolean) => {
    helper = mod;
    setFlagPusk(!flagPusk);
  };

  const PressButton = (mode: number) => {
    switch (mode) {
      case 41: // удалить режим
        massmode[newMode].delRec = true;
        dispatch(massmodeCreate(massmode));
        StatusQuo();
        ymaps && addRoute(ymaps, false); // перерисовка связей
        setFlagPusk(!flagPusk);
        break;
      case 42: // выбор режима ЗУ
        StatusQuo();
        if (massMem.length) {
          ymaps && addRoute(ymaps, true); // перерисовка связей
          setFlagPusk(!flagPusk);
        }
        datestat.create = helper = false;
        dispatch(statsaveCreate(datestat));
        setSelectMD(true);
        break;
      case 43: // переход к созданию нового режима
        helper = true;
        StatusQuo();
        break;
      case 44: // назначить фазы
        datestat.working = true;
        dispatch(statsaveCreate(datestat));
        setSetPhase(true);
        break;
      case 45: // выполнить режим
        if (massmode[newMode].delRec) {
          soobErr = "Данный режим помечен к удалению";
          setOpenSoobErr(true);
        } else {
          modeToDo = 1;
          setToDoMode(true);
          setFlagPusk(!flagPusk);
        }
        break;
      case 46: // Настройки
        StatusQuo();
        setNeedSetup((helper = true));
        break;
      case 47: // режим Demo
        StatusQuo();
        if (massMem.length) {
          ymaps && addRoute(ymaps, true); // перерисовка связей
          setFlagPusk(!flagPusk);
        }
        datestat.create = helper = datestat.finish = false;
        setSelectMD((datestat.demo = true));
        dispatch(statsaveCreate(datestat));
        break;
      case 48: // Фрагменты
        soobErr =
          "Нет фрагментов Яндекс-карты для вашего аккаунта, создайте их на главной странице системы";
        if (!map.fragments) {
          setOpenSoobErr(true);
        } else {
          if (map.fragments.length) {
            StatusQuo();
            setFragments((helper = true));
          } else setOpenSoobErr(true);
        }
    }
  };
  //=== инициализация ======================================
  if (!flagOpen && Object.keys(map.tflight).length) {
    let point0 = window.localStorage.PointCenterDU0;
    let point1 = window.localStorage.PointCenterDU1;
    if (!Number(point0) || !Number(point1)) {
      pointCenter = CenterCoordBegin(map); // начальные координаты центра отоброжаемой карты
    } else pointCenter = [Number(point0), Number(point1)];
    zoom = Number(window.localStorage.ZoomDU); // начальный zoom Yandex-карты ДУ
    //============
    helper = false; // это для выхода на выбор существующих режимов
    datestat.create = false;
    dispatch(statsaveCreate(datestat));
    setSelectMD((flagOpen = true));
  }
  //=== обработка Esc ======================================
  const escFunction = React.useCallback(
    (event) => {
      if (event.keyCode === 27 && helper && massCoord.length === 1) StatusQuo();
    },
    [StatusQuo]
  );

  React.useEffect(() => {
    document.addEventListener("keydown", escFunction);
    return () => document.removeEventListener("keydown", escFunction);
  }, [escFunction]);
  //=== Закрытие или перезапуск вкладки ====================
  function removePlayerFromGame() {
    throw new Error("Функция не реализована");
  }

  const ClosingInlay = () => {
    for (let i = 0; i < massfaz.length; i++) {
      if (massfaz[i].runRec === 2)
        !DEMO && SendSocketDispatch(massfaz[i].idevice, 9, 9);
    }
  };

  const handleTabClosing = () => {
    ClosingInlay();
    removePlayerFromGame();
  };

  const alertUser = (event: any) => ClosingInlay();

  React.useEffect(() => {
    window.addEventListener("beforeunload", alertUser);
    window.addEventListener("unload", handleTabClosing);
    return () => {
      window.removeEventListener("beforeunload", alertUser);
      window.removeEventListener("unload", handleTabClosing);
    };
  });
  //========================================================
  let mapState: any = {
    center: pointCenter,
    zoom: zoom,
  };

  const ChangeDemoSost = (mode: number) => setDemoSost(mode + demoSost); // костыль

  if (massCoord.length > 1 && needDrawCircle) {
    needDrawCircle = false;
    circls[0] && mapp.current.geoObjects.remove(circls[0]); // стереть первую окружность
    circls[1] && mapp.current.geoObjects.remove(circls[1]); // стереть вторую окружность
    circls = DrawCircle(ymaps, mapp, massCoord); // нарисовать окружности в начале/конце маршрута
  }

  return (
    <Grid container sx={{ height: "99.9vh" }}>
      <Grid item xs>
        {!datestat.working ? (
          <>{MenuGl(massMem, modeToDo, PressButton, helper, newMode)}</>
        ) : (
          <>{StrokaHelp("Происходит обработка режима", 0)}</>
        )}
        <Grid container sx={{ height: "96.9vh" }}>
          {Object.keys(map.tflight).length && (
            <YMaps query={{ apikey: MyYandexKey, lang: "ru_RU" }}>
              <Map
                modules={YMapsModul}
                state={mapState}
                instanceRef={(ref) => InstanceRefDo(ref)} // обработка действий с правой кнопкой и колёсиком мыши
                onLoad={(ref) => {
                  ref && setYmaps(ref);
                }}
                width={"99.9%"}
                height={"99.9%"}
              >
                {YandexServices()}
                {Pererisovka()}
                <PlacemarkDo />
                {selectMD && (
                  <GsSelectMD
                    setOpen={setSelectMD}
                    receive={ReceiveIdxGs}
                    history={props.history}
                    trHist={props.trHist}
                    funcHelper={SetHelper}
                  />
                )}
                {setPhase && (
                  <GsSetPhase
                    setOpen={SetSetPhase}
                    newMode={newMode}
                    massMem={massMem}
                    massCoord={massCoord}
                    func={MakeNewMassMem}
                  />
                )}
                {fragments && <GsFragments close={SetFragments} />}
                {openSoobErr && (
                  <GsErrorMessage setOpen={setOpenSoobErr} sErr={soobErr} />
                )}
              </Map>
            </YMaps>
          )}
        </Grid>
        {toDoMode && (
          <Box sx={styleServisTable}>
            <GsToDoMode
              newMode={newMode}
              massMem={massMem}
              funcMode={ModeToDo}
              funcSize={OldSizeWind}
              funcCenter={NewPointCenter}
              funcHelper={SetHelper}
              trigger={props.trigger}
              changeFaz={changeFaz}
              start={startCount}
              funcStart={setStartCount}
              stop={stopCount}
              funcStop={setStopCount}
              changeDemo={ChangeDemoSost}
            />
          </Box>
        )}
      </Grid>
      {needSetup && <GsSetup close={setNeedSetup} />}
    </Grid>
  );
};

export default MainMapGs;
