import * as React from 'react';
import { useSelector } from 'react-redux';

//import axios from 'axios';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import CardMedia from '@mui/material/CardMedia';
//import TextField from "@mui/material/TextField";
//import Typography from "@mui/material/Typography";
//import MenuItem from "@mui/material/MenuItem";

import { styleModalEnd } from '../MainMapStyle';
import { styleModalMenu } from './GsSetPhaseStyle';

let newInput = true;
let massFaz: any = [];

let toDoMode = false;

const GsToDoMode = (props: {
  region: string;
  setOpen: any;
  newMode: number;
  massMem: Array<number>;
  func: any;
}) => {
  //== Piece of Redux ======================================
  const map = useSelector((state: any) => {
    const { mapReducer } = state;
    return mapReducer.map.dateMap;
  });
  //const dispatch = useDispatch();
  //========================================================
  const [openSetMode, setOpenSetMode] = React.useState(true);
  //const [imgSvg, setImgSvg] = React.useState<any>(null);
  const [trigger, setTrigger] = React.useState(true);

  const [chDel, setChDel] = React.useState(0);

  //=== инициализация ======================================
  const styleSetInf = {
    position: 'relative',
    marginTop: 3,
    marginLeft: 'auto',
    marginRight: 3,
    width: 777,
    bgcolor: 'background.paper',
    border: '3px solid #000',
    borderColor: 'primary.main',
    borderRadius: 2,
    boxShadow: 24,
    p: 1.5,
  };

  const MakeMaskFaz = (i: number) => {
    let maskFaz = {
      idx: 0,
      faza: 1,
      phases: [],
      name: '',
      delRec: false,
    };
    maskFaz.idx = props.massMem[i];
    maskFaz.name = map.tflight[maskFaz.idx].description;
    maskFaz.phases = map.tflight[maskFaz.idx].phases;

    if (props.newMode >= 0) {
      maskFaz.faza = map.routes[props.newMode].listTL[i].phase;
    }
    return maskFaz;
  };

  if (newInput) {
    // axios.get('https://localhost:3000/18.svg').then(({ data }) => {
    //   setImgSvg(data);
    //   //console.log('data:', data);
    // });
    massFaz = [];

    for (let i = 0; i < props.massMem.length; i++) {
      massFaz.push(MakeMaskFaz(i));
    }
    newInput = false;
    setChDel(0);
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
    if (chDel) DelRec();
    props.func(massFaz);
    props.setOpen(false);
    setOpenSetMode(false);
  };

  const DelRec = () => {
    let massRab: any = [];
    for (let i = 0; i < massFaz.length; i++) {
      if (!massFaz[i].delRec) massRab.push(massFaz[i]);
    }
    massFaz = massRab;
    setChDel(0);
  };

  const ToDoMode = (mode: number) => {
    toDoMode = !toDoMode;
    setTrigger(!trigger);
  };

  const StrokaTabl = () => {
    let resStr = [];
    for (let i = 0; i < massFaz.length; i++) {
      resStr.push(
        <Grid key={i} container sx={{ marginTop: 1 }}>
          <Grid item xs={1} sx={{ paddingTop: 2, textAlign: 'center' }}>
            {i + 1}
          </Grid>

          <Grid item xs={1.7} sx={{ border: 0 }}></Grid>
          <Grid item xs={2.3} sx={{ border: 0 }}>
            <CardMedia
              component="img"
              sx={{ textAlign: 'center', height: 60, width: 40 }}
              image="https://localhost:3000/18.svg"
              // image={imgSvg}
            />
          </Grid>

          <Grid item xs sx={{ textAlign: 'center' }}>
            --
          </Grid>

          <Grid item xs={5}>
            {massFaz[i].name}
          </Grid>
        </Grid>,
      );
    }
    return resStr;
  };

  return (
    <Modal open={openSetMode} onClose={handleCloseSetEnd} hideBackdrop>
      <Box sx={styleSetInf}>
        <Button sx={styleModalEnd} onClick={handleCloseSetEnd}>
          <b>&#10006;</b>
        </Button>

        <Grid container sx={{ marginTop: 0 }}>
          <Grid item xs sx={{ fontSize: 18, textAlign: 'center' }}>
            Режим: <b>{map.routes[props.newMode].description}</b>
          </Grid>
        </Grid>

        <Box sx={{ marginTop: 1 }}>
          <Grid container sx={{ bgcolor: '#C0E2C3' }}>
            <Grid item xs={1} sx={{ border: 0, textAlign: 'center' }}>
              <b>Номер</b>
            </Grid>

            <Grid item xs={4} sx={{ border: 0, textAlign: 'center' }}>
              <b>Состояние</b>
            </Grid>

            <Grid item xs={2} sx={{ border: 0, textAlign: 'center' }}>
              <b>Фаза</b>
            </Grid>

            <Grid item xs={5} sx={{ border: 0, textAlign: 'center' }}>
              <b>ДК</b>
            </Grid>
          </Grid>

          <Box sx={{ overflowX: 'auto', height: '77vh' }}>{StrokaTabl()}</Box>

          {!toDoMode && (
            <Box sx={{ marginTop: 0.5, textAlign: 'center' }}>
              <Button sx={styleModalMenu} onClick={() => ToDoMode(0)}>
                Начать исполнение
              </Button>
            </Box>
          )}

          {toDoMode && (
            <Box sx={{ marginTop: 0.5, textAlign: 'center' }}>
              <Button sx={styleModalMenu} onClick={() => ToDoMode(1)}>
                Закончить исполнение
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default GsToDoMode;
