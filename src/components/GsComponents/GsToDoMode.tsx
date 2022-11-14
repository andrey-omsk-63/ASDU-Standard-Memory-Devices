import * as React from 'react';
import { useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

import { OutputFazaImg, OutputVertexImg } from '../MapServiceFunctions';
import { SendSocketRoute } from '../MapSocketFunctions';

import { styleModalEnd } from '../MainMapStyle';
import { styleModalMenu, styleStrokaTablImg } from './GsComponentsStyle';
import { styleToDoMode, styleStrokaTabl } from './GsComponentsStyle';

let newInput = true;
let massFaz: any = [];

let toDoMode = false;

const GsToDoMode = (props: {
  newMode: number;
  massMem: Array<number>;
  funcMode: any;
  funcSize: any;
  funcCenter: any;
  funcHelper: any;
}) => {
  //== Piece of Redux ======================================
  const map = useSelector((state: any) => {
    const { mapReducer } = state;
    return mapReducer.map.dateMap;
  });
  let massdk = useSelector((state: any) => {
    const { massdkReducer } = state;
    return massdkReducer.massdk;
  });
  let datestat = useSelector((state: any) => {
    const { statsaveReducer } = state;
    return statsaveReducer.datestat;
  });
  const debug = datestat.debug;
  const ws = datestat.ws;
  //const dispatch = useDispatch();
  //========================================================
  const [trigger, setTrigger] = React.useState(true);
  let newMode = props.newMode;

  //=== инициализация ======================================
  const MakeMaskFaz = (i: number) => {
    let im: Array<string | null> = [];
    let maskFaz = {
      idx: 0,
      faza: 1,
      phases: [],
      idevice: 0,
      name: '',
      starRec: false,
      runRec: false,
      img: im,
    };
    maskFaz.idx = props.massMem[i];
    maskFaz.name = massdk[maskFaz.idx].nameCoordinates;
    maskFaz.phases = massdk[maskFaz.idx].phases;
    maskFaz.idevice = map.tflight[maskFaz.idx].idevice;
    if (!maskFaz.phases.length) {
      maskFaz.img = [null, null, null];
    } else {
      maskFaz.img = massdk[maskFaz.idx].phSvg;
    }
    return maskFaz;
  };

  if (newInput) {
    massFaz = [];
    for (let i = 0; i < props.massMem.length; i++) {
      massFaz.push(MakeMaskFaz(i));
    }
    newInput = false;
  } else {
    let massRab: any = [];
    for (let i = 0; i < props.massMem.length; i++) {
      let flagHave = false;
      for (let j = 0; j < massFaz.length; j++) {
        if (massFaz[j].idx === props.massMem[i]) {
          massRab.push(massFaz[j]);
          flagHave = true;
          break;
        }
      }
      if (!flagHave) massRab.push(MakeMaskFaz(i));
    }
    massFaz = massRab;
  }
  //========================================================
  const handleCloseSetEnd = () => {
    props.funcSize(11.99);
    toDoMode = false;
  };

  const ToDoMode = (mode: number) => {
    let massIdevice: Array<number> = [];
    if (mode) {
      for (let i = 0; i < massFaz.length; i++) {
        massIdevice.push(massFaz[i].idevice);
      }
      SendSocketRoute(debug, ws, massIdevice, true);
      toDoMode = true; // выполнение режима
      props.funcMode(mode);
      setTrigger(!trigger);
    } else {
      SendSocketRoute(debug, ws, massIdevice, false);
      props.funcMode(mode); // закончить исполнение
      props.funcHelper(true);
      handleCloseSetEnd();
      newInput = true;
    }
  };

  const StrokaHeader = (xss: number, soob: string) => {
    return (
      <Grid item xs={xss} sx={{ fontSize: 14, textAlign: 'center' }}>
        <b>{soob}</b>
      </Grid>
    );
  };

  const StrokaTabl = () => {
    const ClickKnop = (mode: number) => {
      let coor = map.routes[newMode].listTL[mode].point;
      let coord = [coor.Y, coor.X];
      massFaz[mode].starRec = !massFaz[mode].starRec;
      props.funcCenter(coord);
      setTrigger(!trigger);
    };

    const ClickImg = (mode: number) => {
      massFaz[mode].runRec = !massFaz[mode].runRec;
      setTrigger(!trigger);
    };

    let resStr = [];

    for (let i = 0; i < massFaz.length; i++) {
      let bull = ' ';
      if (massFaz[i].runRec) bull = ' •';
      let host = 'https://localhost:3000/18.svg';
      if (!debug) {
        let num = map.tflight[massFaz[i].idx].tlsost.num.toString();
        host = window.location.origin + '/free/img/trafficLights/' + num + '.svg';
      }
      let star = '';
      if (massFaz[i].starRec) star = '*';

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
            <Button variant="contained" sx={styleStrokaTablImg} onClick={() => ClickImg(i)}>
              {OutputVertexImg(host)}
            </Button>
          </Grid>
          <Grid item xs={1.3} sx={{ fontSize: 30, marginLeft: 1 }}>
            {bull}
          </Grid>

          <Grid item xs={1.6} sx={{ textAlign: 'center' }}>
            {OutputFazaImg(massFaz[i].img[massFaz[i].faza - 1])}
          </Grid>

          <Grid item xs sx={{ fontSize: 14 }}>
            {massFaz[i].name}
          </Grid>
        </Grid>,
      );
    }
    return resStr;
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
            {StrokaHeader(1.6, 'Фаза')}
            {StrokaHeader(5.8, 'ДК')}
          </Grid>

          <Box sx={{ overflowX: 'auto', height: '81vh' }}>{StrokaTabl()}</Box>

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
