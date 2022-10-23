import * as React from 'react';
import { useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';

import { styleModalEnd } from './../MainMapStyle';

let newInput = true;
let massFaz: any = [];
let colorRec = 'black';
let knop = 'удалить';
let chDel = 0;

const SmdSetPhase = (props: { setOpen: any; massMem: Array<number>; func: any }) => {
  //== Piece of Redux =======================================
  const map = useSelector((state: any) => {
    const { mapReducer } = state;
    return mapReducer.map;
  });
  //===========================================================
  const styleSetInf = {
    position: 'relative',
    marginTop: 5.5,
    marginLeft: 'auto',
    marginRight: 30,
    width: 777,
    bgcolor: 'background.paper',
    border: '3px solid #000',
    borderColor: 'primary.main',
    borderRadius: 2,
    boxShadow: 24,
    p: 1.5,
  };

  const styleSave = {
    fontSize: 14,
    marginRight: 0.1,
    border: '2px solid #000',
    bgcolor: '#E6F5D6',
    minWidth: '110px',
    maxWidth: '110px',
    maxHeight: '20px',
    minHeight: '20px',
    borderColor: '#E6F5D6',
    borderRadius: 2,
    color: 'black',
    textTransform: 'unset !important',
  };

  const styleModalMenu = {
    marginTop: 0.5,
    marginRight: 1,
    backgroundColor: '#E6F5D6',
    textTransform: 'unset !important',
    color: 'black',
  };

  const [openSetMode, setOpenSetMode] = React.useState(true);
  const [trigger, setTrigger] = React.useState(true);

  if (newInput) {
    massFaz = [];
    for (let i = 0; i < props.massMem.length; i++) {
      let maskFaz = {
        idx: 0,
        faza: 0,
        name: '',
        delRec: false,
      };
      maskFaz.idx = props.massMem[i];
      maskFaz.name = map.dateMap.tflight[maskFaz.idx].description;
      massFaz.push(maskFaz);
    }
    newInput = false;
    chDel = 0;
    console.log('massFaz:', massFaz);
  }

  const handleCloseSetEnd = () => {
    props.setOpen(false);
    setOpenSetMode(false);
    newInput = true;
  };

  const ClickKnop = (idx: number) => {
    if (!massFaz[idx].delRec) {
      massFaz[idx].delRec = true;
      chDel++;
    } else {
      massFaz[idx].delRec = false;
      chDel--;
    }
    setTrigger(!trigger);
  };

  const DelRec = () => {
    let massRab: any = [];
    for (let i = 0; i < massFaz.length; i++) {
      if (!massFaz[i].delRec) massRab.push(massFaz[i]);
    }
    massFaz = [];
    massFaz = massRab;
    setTrigger(!trigger);
  };

  const SaveRec = () => {
    props.func(massFaz);
    handleCloseSetEnd();
  };

  const StrokaTabl = () => {
    let resStr = [];

    for (let i = 0; i < massFaz.length; i++) {
      knop = 'удалить';
      let fSize = 15;
      colorRec = 'black';
      if (massFaz[i].delRec) {
        knop = 'восстановить';
        fSize = 14;
        colorRec = 'red';
      }
      resStr.push(
        <Grid key={i} container sx={{ marginTop: 1, color: colorRec, fontSize: fSize }}>
          <Grid item xs={8} sx={{ paddingLeft: 1 }}>
            {massFaz[i].name}
          </Grid>
          <Grid item xs={2} sx={{ textAlign: 'center' }}>
            {massFaz[i].faza}
          </Grid>
          <Grid item xs={2} sx={{ textAlign: 'center' }}>
            <Button variant="contained" sx={styleSave} onClick={() => ClickKnop(i)}>
              {knop}
            </Button>
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

        <Typography variant="h6" sx={{ textAlign: 'center' }}>
          Таблица фаз
        </Typography>
        <Box sx={{ marginTop: 0.5 }}>
          <Grid container sx={{ bgcolor: '#C0E2C3' }}>
            <Grid item xs={8} sx={{ border: 0, textAlign: 'center' }}>
              <b>Описание</b>
            </Grid>
            <Grid item xs={2} sx={{ border: 0, textAlign: 'center' }}>
              <b>Фаза</b>
            </Grid>
            <Grid item xs={2} sx={{ border: 0, textAlign: 'center' }}>
              <b>Действие</b>
            </Grid>
          </Grid>

          <Box sx={{ overflowX: 'auto', height: '69vh' }}>{StrokaTabl()}</Box>
          <Box sx={{ marginTop: 0.5, textAlign: 'center' }}>
            {chDel > 0 && (
              <Button sx={styleModalMenu} onClick={() => DelRec()}>
                Удалить помеченные
              </Button>
            )}
            <Button sx={styleModalMenu} onClick={() => SaveRec()}>
              Сохранить
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default SmdSetPhase;
