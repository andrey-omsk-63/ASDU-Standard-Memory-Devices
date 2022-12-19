import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { massfazCreate, statsaveCreate } from '../../redux/actions';
//import { massmodeCreate } from '../../redux/actions';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

import { Fazer } from './../../App';

import { OutputFazaImg, OutputVertexImg } from '../MapServiceFunctions';
import { SendSocketRoute, SendSocketDispatch } from '../MapSocketFunctions';

import { styleModalEnd } from '../MainMapStyle';
import { styleModalMenu, styleStrokaTablImg } from './GsComponentsStyle';
import { styleToDoMode, styleStrokaTabl } from './GsComponentsStyle';

let toDoMode = false;
let init = true;
let timerId: any[] = [];

let massInt: any[][] = [];

const GsToDoMode = (props: {
  newMode: number;
  massMem: Array<number>;
  funcMode: any;
  funcSize: any;
  funcCenter: any;
  funcHelper: any;
  trigger: boolean;
  changeFaz: boolean;
}) => {
  //console.log('GsToDoMode:', props.newMode);
  //== Piece of Redux ======================================
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
  //console.log('TODOmassfaz', massfaz);
  let datestat = useSelector((state: any) => {
    const { statsaveReducer } = state;
    return statsaveReducer.datestat;
  });
  //console.log("TODOdatestat", datestat);
  // let massmode = useSelector((state: any) => {
  //   const { massmodeReducer } = state;
  //   return massmodeReducer.massmode;
  // });
  const debug = datestat.debug;
  const ws = datestat.ws;
  const dispatch = useDispatch();
  //========================================================
  const [trigger, setTrigger] = React.useState(true);
  //const timer = React.useRef<any>(null);
  let newMode = props.newMode;

  //=== инициализация ======================================
  const MakeMaskFaz = (i: number) => {
    let maskFaz: Fazer = {
      kolOpen: 0,
      runRec: false,
      idx: 0,
      faza: 1,
      fazaSist: -1,
      phases: [],
      idevice: 0,
      name: '',
      starRec: false,
      img: [],
    };
    //maskFaz.kolOpen = massmode[newMode].kolOpen;
    maskFaz.idx = props.massMem[i];
    maskFaz.name = massdk[maskFaz.idx].nameCoordinates;
    maskFaz.phases = massdk[maskFaz.idx].phases;
    maskFaz.idevice = map.tflight[maskFaz.idx].idevice;
    maskFaz.faza = map.routes[newMode].listTL[i].phase;
    if (
      map.tflight[maskFaz.idx].points.X !== map.routes[newMode].listTL[i].point.X ||
      map.tflight[maskFaz.idx].points.Y !== map.routes[newMode].listTL[i].point.Y
    )
      maskFaz.starRec = true; // было изменение координат
    if (!maskFaz.phases.length) {
      maskFaz.img = [null, null, null];
    } else {
      maskFaz.img = massdk[maskFaz.idx].phSvg;
    }
    return maskFaz;
  };
  if (init) {
    massfaz = [];
    timerId = [];
    for (let i = 0; i < props.massMem.length; i++) {
      massfaz.push(MakeMaskFaz(i));
      timerId.push(null);
    }
    for (let i = 0; i < props.massMem.length; i++) {
      massInt.push(JSON.parse(JSON.stringify(timerId)));
    }
    init = false;
    dispatch(massfazCreate(massfaz));
    //console.log('INIT', props.massMem, massfaz);
    //datestat.toDoMode = true;
    //dispatch(statsaveCreate(datestat));
  }
  //========================================================
  const handleCloseSetEnd = () => {
    props.funcSize(11.99);
    toDoMode = false;
    datestat.toDoMode = false;
    dispatch(statsaveCreate(datestat));
    massfaz = [];
    dispatch(massfazCreate(massfaz));
    init = true;
  };

  const ToDoMode = (mode: number) => {
    let massIdevice: Array<number> = [];
    if (mode) {
      ClickKnop(0); // ставим на первый светофор
      for (let i = 0; i < massfaz.length; i++) {
        massIdevice.push(massfaz[i].idevice);
        massfaz[i].kolOpen++;
      }
      dispatch(massfazCreate(massfaz));
      // massmode[newMode].kolOpen++;
      // dispatch(massmodeCreate(massmode));
      SendSocketRoute(debug, ws, massIdevice, true);
      toDoMode = true; // выполнение режима
      datestat.toDoMode = true;
      dispatch(statsaveCreate(datestat));
      props.funcMode(mode);
      setTrigger(!trigger);
    } else {
      // принудительное закрытие
      for (let i = 0; i < timerId.length; i++) {
        if (timerId[i]) {
          for (let j = 0; j < massInt[i].length; j++) {
            if (massInt[i][j]) {
              clearInterval(massInt[i][j]);
              massInt[i][j] = null;
            }
          }
          timerId[i] = null;
        }
      }
      console.log('Финиш', timerId, massInt);
      for (let i = 0; i < massfaz.length; i++) {
        if (massfaz[i].runRec) {
          SendSocketDispatch(debug, ws, massfaz[i].idevice, 9, 9);
          massfaz[mode].runRec = !massfaz[mode].runRec;
        }
      }
      dispatch(massfazCreate(massfaz));
      SendSocketRoute(debug, ws, massIdevice, false);
      props.funcMode(mode); // закончить исполнение
      props.funcHelper(true);
      handleCloseSetEnd();
    }
  };

  const StrokaHeader = (xss: number, soob: string) => {
    return (
      <Grid item xs={xss} sx={{ fontSize: 14, textAlign: 'center' }}>
        <b>{soob}</b>
      </Grid>
    );
  };

  const ClickKnop = (mode: number) => {
    let coor = map.routes[newMode].listTL[mode].point;
    let coord = [coor.Y, coor.X];
    //massfaz[mode].starRec = !massfaz[mode].starRec;
    props.funcCenter(coord);
    setTrigger(!trigger);
  };

  const StrokaTabl = () => {
    const ClickVertex = (mode: number) => {
      let fazer = massfaz[mode];
      ClickKnop(mode);
      if (!fazer.runRec) {
        console.log(mode + 1 + '-й светофор пошёл', timerId[mode]);
        SendSocketDispatch(debug, ws, fazer.idevice, 9, fazer.faza);
        timerId[mode] = setInterval(() => DoTimerId(mode), 60000);
        massInt[mode].push(timerId[mode]);
      } else {
        console.log(mode + 1 + '-й светофор закрыт', timerId[mode]);
        SendSocketDispatch(debug, ws, fazer.idevice, 9, 9);
        for (let i = 0; i < massInt[mode].length; i++) {
          if (massInt[mode][i]) {
            clearInterval(massInt[mode][i]);
            massInt[mode][i] = null;
          }
        }
        timerId[mode] = null;
      }
      massfaz[mode].runRec = !massfaz[mode].runRec;
      dispatch(massfazCreate(massfaz));
      //console.log('MASSFAZ:', mode, massfaz);
      setTrigger(!trigger);
    };

    let resStr = [];

    for (let i = 0; i < massfaz.length; i++) {
      let bull = ' ';
      if (massfaz[i].runRec) bull = ' •';
      let host = 'https://localhost:3000/18.svg';
      if (!debug) {
        let num = map.tflight[massfaz[i].idx].tlsost.num.toString();
        host = window.location.origin + '/free/img/trafficLights/' + num + '.svg';
      }
      let star = '';
      if (massfaz[i].starRec) star = '*';
      let takt: number | string = '';
      let pad = 1.2;
      let fazaImg: null | string = null;
      if (massfaz[i].fazaSist > 0) {
        takt = massfaz[i].fazaSist;
        if (takt === 9) {
          takt = 'пром такт';
          pad = 0;
        }
        if (takt <= massfaz[i].img.length) fazaImg = massfaz[i].img[massfaz[i].fazaSist - 1];
      }
      if (debug) fazaImg = datestat.phSvg; // для отладки

      resStr.push(
        <Grid key={i} container sx={{ marginTop: 1 }}>
          <Grid item xs={1} sx={{ paddingTop: 0.7, textAlign: 'center' }}>
            <Button variant="contained" sx={styleStrokaTabl} onClick={() => ClickKnop(i)}>
              {i + 1}
            </Button>
          </Grid>

          <Grid item xs={1.2} sx={{ fontSize: 27, textAlign: 'right' }}>
            {star}
          </Grid>
          <Grid item xs={1.0} sx={{}}>
            {!toDoMode && <>{OutputVertexImg(host)}</>}
            {toDoMode && (
              <Button variant="contained" sx={styleStrokaTablImg} onClick={() => ClickVertex(i)}>
                {OutputVertexImg(host)}
              </Button>
            )}
          </Grid>
          <Grid item xs={0.4} sx={{ fontSize: 30, marginLeft: 1 }}>
            {bull}
          </Grid>

          <Grid item xs={1.1} sx={{ fontSize: 12, paddingTop: 1.7, textAlign: 'right' }}>
            {takt}
          </Grid>
          <Grid item xs={2} sx={{ paddingTop: pad, textAlign: 'center' }}>
            {OutputFazaImg(fazaImg)}
          </Grid>

          <Grid item xs sx={{ fontSize: 14 }}>
            {massfaz[i].name}
          </Grid>
        </Grid>,
      );
    }
    return resStr;
  };

  const DoTimerId = (mode: number) => {
    let fazer = massfaz[mode];
    console.log('Отправка с ' + String(mode + 1) + '-го', timerId);
    SendSocketDispatch(debug, ws, fazer.idevice, 9, fazer.faza);
    for (let i = 0; i < massInt[mode].length - 1; i++) {
      if (massInt[mode][i]) {
        clearInterval(massInt[mode][i]);
        massInt[mode][i] = null;
      }
    }
    massInt[mode] = massInt[mode].filter(function (el: any) {
      return el !== null;
    });
  };

  return (
    <>
      <Box sx={styleToDoMode}>
        {!toDoMode && (
          <Button sx={styleModalEnd} onClick={handleCloseSetEnd}>
            <b>&#10006;</b>
          </Button>
        )}

        <Grid container sx={{ marginTop: 0 }}>
          <Grid item xs sx={{ fontSize: 18, textAlign: 'center' }}>
            Режим: <b>{map.routes[newMode].description}</b>
          </Grid>
        </Grid>

        <Box sx={{ marginTop: 1 }}>
          <Grid container sx={{ bgcolor: '#C0E2C3' }}>
            {StrokaHeader(1, 'Номер')}
            {StrokaHeader(3.6, 'Состояние')}
            {StrokaHeader(1.9, 'Фаза')}
            {StrokaHeader(5.5, 'ДК')}
          </Grid>

          <Box sx={{ overflowX: 'auto', height: '79vh' }}>{StrokaTabl()}</Box>

          {!toDoMode && (
            <Box sx={{ marginTop: 1.5, textAlign: 'center' }}>
              <Button sx={styleModalMenu} onClick={() => ToDoMode(2)}>
                Начать исполнение
              </Button>
            </Box>
          )}

          {toDoMode && (
            <Box sx={{ marginTop: 1.5, textAlign: 'center' }}>
              <Button sx={styleModalMenu} onClick={() => ToDoMode(0)}>
                Закончить исполнение
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default GsToDoMode;
