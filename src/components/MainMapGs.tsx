import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { mapCreate, massmodeCreate } from '../redux/actions';
import { massfazCreate } from '../redux/actions';

import Grid from '@mui/material/Grid';

import { YMaps, Map, FullscreenControl } from 'react-yandex-maps';
import { GeolocationControl, YMapsApi } from 'react-yandex-maps';
import { RulerControl, SearchControl } from 'react-yandex-maps';
import { TrafficControl, TypeSelector, ZoomControl } from 'react-yandex-maps';

import GsSelectMD from './GsComponents/GsSelectMD';
import GsSetPhase from './GsComponents/GsSetPhase';
import GsToDoMode from './GsComponents/GsToDoMode';
import GsErrorMessage from './GsComponents/GsErrorMessage';
import GsDoPlacemarkDo from './GsComponents/GsDoPlacemarkDo';

import { getMultiRouteOptions, StrokaHelp } from './MapServiceFunctions';
import { getReferencePoints, CenterCoord } from './MapServiceFunctions';
import { ErrorHaveVertex, Distance } from './MapServiceFunctions';
import { StrokaMenuGlob } from './MapServiceFunctions';

import { SendSocketUpdateRoute } from './MapSocketFunctions';

import { searchControl } from './MainMapStyle';

let flagOpen = false;

const zoomStart = 10;
let zoom = zoomStart;
let pointCenter: any = 0;
let pointCenterEt: any = 0;

let massMem: Array<number> = [];
let massCoord: any = [];
let newMode = -1;
let soobErr = '';
let helper = true;

let xsMap = 11.99;
let xsTab = 0.01;
let widthMap = '99.9%';

let modeToDo = 0;
let newCenter: any = [];
let funcContex: any = null;
//let funcMouse: any = null;
let funcBound: any = null;

const MainMapGs = (props: { trigger: boolean; history: any }) => {
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
  const debug = datestat.debug;
  const ws = datestat.ws;
  const dispatch = useDispatch();
  //===========================================================
  const [flagPusk, setFlagPusk] = React.useState(false);
  const [selectMD, setSelectMD] = React.useState(false);
  const [setPhase, setSetPhase] = React.useState(false);
  const [toDoMode, setToDoMode] = React.useState(false);
  const [flagCenter, setFlagCenter] = React.useState(false);
  const [openSoobErr, setOpenSoobErr] = React.useState(false);
  const [risovka, setRisovka] = React.useState(false);
  const [changeFaz, setChangeFaz] = React.useState(false);

  const [ymaps, setYmaps] = React.useState<YMapsApi | null>(null);
  const mapp = React.useRef<any>(null);

  const ReceiveIdxGs = (mode: number) => {
    let massErrRec = [];
    massMem = [];
    massCoord = [];
    for (let i = 0; i < map.routes[mode].listTL.length; i++) {
      let idx = -1;
      for (let j = 0; j < map.tflight.length; j++) {
        if (
          map.routes[mode].listTL[i].pos.region === map.tflight[j].region.num &&
          map.routes[mode].listTL[i].pos.area === map.tflight[j].area.num &&
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
        massMem.push(idx);
        massCoord.push(masscoord);
      }
    }
    if (massErrRec.length) {
      let massRabMap = []; // ?????????????????????? ?? ???????? map
      for (let i = 0; i < map.routes[mode].listTL.length; i++) {
        if (!massErrRec.includes(i)) {
          massRabMap.push(map.routes[mode].listTL[i]);
        }
      }
      map.routes[mode].listTL = massRabMap;
      SendSocketUpdateRoute(debug, ws, map.routes[mode]);
      dispatch(mapCreate(map));
    }
    newMode = mode;
    ymaps && addRoute(ymaps, true); // ?????????????????????? ????????????
    setFlagPusk(!flagPusk);
  };

  const addRoute = (ymaps: any, bound: boolean) => {
    mapp.current.geoObjects.removeAll(); // ???????????????? ???????????? ?????????????????? ????????????
    if (massCoord.length > 1) {
      let multiRoute: any = [];
      if (massCoord.length === 2) {
        multiRoute = new ymaps.multiRouter.MultiRoute(
          getReferencePoints(massCoord[0], massCoord[1]),
          getMultiRouteOptions(),
        );
      } else {
        let between = [];
        for (let i = 1; i < massCoord.length - 1; i++) {
          between.push(i);
        }
        multiRoute = new ymaps.multiRouter.MultiRoute(
          {
            referencePoints: massCoord,
            params: { viaIndexes: between },
          },
          { boundsAutoApply: bound, wayPointVisible: false },
        );
      }
      mapp.current.geoObjects.add(multiRoute);
    }
  };

  const StatusQuo = () => {
    massMem = [];
    massCoord = [];
    newMode = -1;
    zoom = zoomStart - 0.01;
    ymaps && addRoute(ymaps, false); // ?????????????????????? ????????????
    NewPointCenter(pointCenterEt);
  };

  const MakeNewMassMem = (mass: any) => {
    if (mass.length) {
      massMem = [];
      let masRab = [];
      for (let i = 0; i < mass.length; i++) {
        massMem.push(mass[i].idx);
        masRab.push(massdk[mass[i].idx].coordinates);
      }
      massCoord = [];
      massCoord = masRab;
      ymaps && addRoute(ymaps, false); // ?????????????????????? ????????????
      setFlagPusk(!flagPusk);
    } else {
      StatusQuo();
    }
  };

  const OnPlacemarkClickPoint = (index: number) => {
    let nomInMass = massMem.indexOf(index);
    let masscoord: any = [];
    if (newMode < 0) {
      // ???????????????? ???????????? ????????????
      if (nomInMass < 0) {
        massMem.push(index);
        masscoord[0] = map.tflight[index].points.Y;
        masscoord[1] = map.tflight[index].points.X;
        massCoord.push(masscoord);
      } else {
        massMem.splice(nomInMass, 1);
        massCoord.splice(nomInMass, 1);
      }
      ymaps && addRoute(ymaps, false); // ?????????????????????? ????????????
      setFlagPusk(!flagPusk);
    } else {
      // ???????????? ?? ???????????????????????? ??????????????
      if (nomInMass >= 0 && nomInMass < massMem.length) {
        if (nomInMass + 1 < massMem.length) {
          masscoord[0] = map.tflight[massMem[nomInMass + 1]].points.Y;
          masscoord[1] = map.tflight[massMem[nomInMass + 1]].points.X;
          NewPointCenter(masscoord);
        }
        if (datestat.toDoMode) {
          massfaz[nomInMass].runRec = true; // ???????????????? ????????????????????
          dispatch(massfazCreate(massfaz));
          setChangeFaz(!changeFaz);
        }
      }
    }
  };
  //=== ?????????? ???????????????????? ===================================
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
  //=== ?????????????????? instanceRef ==============================
  const FindNearVertex = (coord: Array<number>) => {
    let nomInMap = -1;
    if (!datestat.toDoMode) {
      let minDist = 999999;
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
        soobErr = '?? ?????????????? 100?? ???? ?????????????????? ?????????? ?????????????????????? ?????????????????????? ??????????????????????';
        setOpenSoobErr(true);
      } else {
        if (massMem.indexOf(nomInMap) >= 0) {
          soobErr = '?????????????????????? [' + massdk[nomInMap].region + ', ';
          soobErr += massdk[nomInMap].area + ', ' + massdk[nomInMap].ID + ', ';
          soobErr += map.tflight[nomInMap].idevice + '] ?????? ????????????????????????';
          setOpenSoobErr(true);
        } else {
          massMem.push(nomInMap);
          massCoord.push(coord);
          setRisovka(true);
        }
      }
    } else {
      let nomInMass = -1;
      for (let i = 0; i < massMem.length; i++) {
        if (massfaz[i].runRec) {
          nomInMass = i;
          break;
        }
      }
      if (nomInMass >= 0) {
        massfaz[nomInMass].runRec = false;
        dispatch(massfazCreate(massfaz));
        // if (nomInMass + 1 < massMem.length) {
        //   let masscoord: any = [];
        //   masscoord[0] = map.tflight[massMem[nomInMass + 1]].points.Y;
        //   masscoord[1] = map.tflight[massMem[nomInMass + 1]].points.X;
        //   NewPointCenter(masscoord);
        // }
        setChangeFaz(!changeFaz);
        setRisovka(true);
      }
    }
  };

  const Pererisovka = () => {
    if (risovka) {
      ymaps && addRoute(ymaps, false); // ?????????????????????? ????????????
      setRisovka(false);
    }
  };

  const InstanceRefDo = (ref: React.Ref<any>) => {
    if (ref) {
      mapp.current = ref;
      mapp.current.events.remove('contextmenu', funcContex);
      funcContex = function (e: any) {
        if (mapp.current.hint) {
          FindNearVertex(e.get('coords')); // ???????????? ???????????? ???????????? ????????
        }
      };
      mapp.current.events.add('contextmenu', funcContex);
      //mapp.current.events.stopPropagation();
      mapp.current.events.remove('boundschange', funcBound);
      funcBound = function () {
        pointCenter = mapp.current.getCenter();
        zoom = mapp.current.getZoom(); // ?????????????????? ???????????????? ????????
      };
      mapp.current.events.add('boundschange', funcBound);

      if (flagCenter) {
        pointCenter = newCenter;
        setFlagCenter(false);
      }
    }
  };
  //========================================================
  const NewPointCenter = (coord: any) => {
    newCenter = coord;
    setFlagCenter(true);
  };

  const OldSizeWind = (size: number) => {
    xsMap = size;
    xsTab = 0.01;
    widthMap = '99.9%';
    modeToDo = 0;
    setToDoMode(false);
    setFlagPusk(!flagPusk);
  };

  const ModeToDo = (mod: number) => {
    modeToDo = mod;
    if (!modeToDo) StatusQuo();
    setFlagPusk(!flagPusk);
  };

  const SetHelper = (mod: boolean) => {
    helper = mod;
    setFlagPusk(!flagPusk);
  };

  const PressButton = (mode: number) => {
    switch (mode) {
      case 41: // ?????????????? ??????????
        massmode[newMode].delRec = true;
        dispatch(massmodeCreate(massmode));
        StatusQuo();
        ymaps && addRoute(ymaps, false); // ?????????????????????? ????????????
        setFlagPusk(!flagPusk);
        break;
      case 42: // ?????????? ???????????? ????
        if (massMem.length) {
          StatusQuo();
          ymaps && addRoute(ymaps, false); // ?????????????????????? ????????????
          setFlagPusk(!flagPusk);
        }
        helper = false;
        setSelectMD(true);
        break;
      case 43: // ?????????????? ?? ???????????????? ???????????? ????????????
        helper = true;
        StatusQuo();
        break;
      case 44: // ?????????????????? ????????
        setSetPhase(true);
        break;
      case 45: // ?????????????????? ??????????
        if (massmode[newMode].delRec) {
          soobErr = '???????????? ?????????? ?????????????? ?? ????????????????';
          setOpenSoobErr(true);
        } else {
          //xsMap = 7.8;
          //xsTab = 4.2;
          xsMap = 7.7;
          xsTab = 4.3;
          widthMap = '99.9%';
          modeToDo = 1;
          setToDoMode(true);
          setFlagPusk(!flagPusk);
        }
    }
  };

  //=== ?????????????????????????? ======================================
  if (!flagOpen && Object.keys(map.tflight).length) {
    pointCenter = CenterCoord(
      map.boxPoint.point0.Y,
      map.boxPoint.point0.X,
      map.boxPoint.point1.Y,
      map.boxPoint.point1.X,
    );
    pointCenterEt = pointCenter;
    flagOpen = true;
  }
  //========================================================
  let mapState: any = {
    center: pointCenter,
    zoom,
  };

  const MenuGl = (mod: number) => {
    let soobHelp = '???????????????? ?????????????????????? ?????? ???????????????? ???????????? ????????????????';
    let soobHelpFiest = '????????????????/?????????????? ?????????????????????? ?????? ???????????????? ???????????????? [';
    soobHelpFiest += massMem.length + '????]';
    let soobInfo = '???????????????????? ?? ?????????????????? ????????????';
    modeToDo === 2 && (soobInfo = '???????????????????? ???????????????????? ????????????');

    return (
      <>
        {modeToDo > 0 && <>{StrokaHelp(soobInfo)}</>}
        {modeToDo === 0 && (
          <>
            {StrokaMenuGlob('???????????????????????? ????', PressButton, 42)}
            {massMem.length < 1 && helper && <>{StrokaHelp(soobHelp)}</>}
            {massMem.length === 1 && helper && <>{StrokaHelp(soobHelpFiest)}</>}

            {massMem.length > 1 && (
              <>
                {newMode < 0 && <>{StrokaMenuGlob('?????????????????? ????????????', PressButton, 44)}</>}
                {newMode < 0 && <>{StrokaHelp(soobHelpFiest)}</>}
                {newMode >= 0 && (
                  <>
                    {StrokaMenuGlob('?????????????? ??????????', PressButton, 43)}
                    {StrokaMenuGlob('?????????????? ??????????', PressButton, 41)}
                    {StrokaMenuGlob('?????????????????????????? ????????', PressButton, 44)}
                    {StrokaMenuGlob('?????????????????? ??????????', PressButton, 45)}
                  </>
                )}
              </>
            )}
          </>
        )}
      </>
    );
  };

  return (
    <Grid container sx={{ border: 0, height: '99.9vh' }}>
      <Grid item xs sx={{ border: 0 }}>
        {MenuGl(modeToDo)}
        <Grid container sx={{ border: 0, height: '96.9vh' }}>
          <Grid item xs={xsMap} sx={{ border: 0 }}>
            {Object.keys(map.tflight).length && (
              <YMaps
                query={{
                  apikey: '65162f5f-2d15-41d1-a881-6c1acf34cfa1',
                  lang: 'ru_RU',
                }}>
                <Map
                  modules={['multiRouter.MultiRoute', 'Polyline', 'templateLayoutFactory']}
                  state={mapState}
                  instanceRef={(ref) => InstanceRefDo(ref)}
                  onLoad={(ref) => {
                    ref && setYmaps(ref);
                  }}
                  width={widthMap}
                  height={'99.6%'}>
                  {/* ?????????????? ?????????????? */}
                  <FullscreenControl />
                  <GeolocationControl options={{ float: 'left' }} />
                  <RulerControl options={{ float: 'right' }} />
                  <SearchControl options={searchControl} />
                  <TrafficControl options={{ float: 'right' }} />
                  <TypeSelector options={{ float: 'right' }} />
                  <ZoomControl options={{ float: 'right' }} />
                  {/* ?????????????????? ???????????????????? */}
                  {Pererisovka()}
                  <PlacemarkDo />
                  {selectMD && (
                    <GsSelectMD
                      setOpen={setSelectMD}
                      receive={ReceiveIdxGs}
                      history={props.history}
                      funcHelper={SetHelper}
                    />
                  )}
                  {setPhase && (
                    <GsSetPhase
                      setOpen={setSetPhase}
                      newMode={newMode}
                      massMem={massMem}
                      massCoord={massCoord}
                      func={MakeNewMassMem}
                    />
                  )}
                  {openSoobErr && <GsErrorMessage setOpen={setOpenSoobErr} sErr={soobErr} />}
                </Map>
              </YMaps>
            )}
          </Grid>
          <Grid item xs={xsTab} sx={{ height: '97.0vh' }}>
            {toDoMode && (
              <GsToDoMode
                newMode={newMode}
                massMem={massMem}
                funcMode={ModeToDo}
                funcSize={OldSizeWind}
                funcCenter={NewPointCenter}
                funcHelper={SetHelper}
                trigger={props.trigger}
                changeFaz={changeFaz}
              />
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default MainMapGs;
