import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { mapCreate } from "../../redux/actions";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";

import { styleModalEnd } from "../MainMapStyle";

import { styleSetInf, styleModalMenu } from "./GsSetPhaseStyle";
import { styleSetFaza, styleBoxFormFaza } from "./GsSetPhaseStyle";
import { styleSet, styleBoxFormName } from "./GsSetPhaseStyle";

let newInput = true;
let massFaz: any = [];
let colorRec = "black";
let knop = "удалить";
let nameMode = "";

const GsSetPhase = (props: {
  region: string;
  setOpen: any;
  massMem: Array<number>;
  func: any;
}) => {
  //== Piece of Redux ======================================
  const map = useSelector((state: any) => {
    const { mapReducer } = state;
    return mapReducer.map.dateMap;
  });
  const dispatch = useDispatch();
  //========================================================
  const [openSetMode, setOpenSetMode] = React.useState(true);
  const [trigger, setTrigger] = React.useState(true);
  const [chDel, setChDel] = React.useState(0);
  //=== инициализация ======================================
  const MakeMaskFaz = (i: number) => {
    let maskFaz = {
      idx: 0,
      faza: 1,
      phases: [],
      name: "",
      delRec: false,
    };
    maskFaz.idx = props.massMem[i];
    maskFaz.name = map.tflight[maskFaz.idx].description;
    maskFaz.phases = map.tflight[maskFaz.idx].phases;
    return maskFaz;
  };

  if (newInput) {
    massFaz = [];
    nameMode =
      "Новый ЗУ " +
      new Date().toLocaleDateString() +
      " " +
      new Date().toLocaleTimeString().slice(0, -3);

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

  const ClickKnop = (idx: number) => {
    massFaz[idx].delRec = !massFaz[idx].delRec;
    if (massFaz[idx].delRec) setChDel(chDel + 1);
    if (!massFaz[idx].delRec) setChDel(chDel - 1);
    setTrigger(!trigger);
  };

  const DelRec = () => {
    let massRab: any = [];
    for (let i = 0; i < massFaz.length; i++) {
      if (!massFaz[i].delRec) massRab.push(massFaz[i]);
    }
    massFaz = [];
    massFaz = massRab;
    setChDel(0);
  };

  const SaveRec = (mode: number) => {
    if (!mode) {
      if (chDel) DelRec(); // сохранить

      let maskRoutes = {
        region: props.region,
        description: nameMode,
        box: {
          point0: {
            Y: -1,
            X: -1,
          },
        },
        listTL: [{}],
      };
      for (let i = 0; i < massFaz.length; i++) {
        let maskListTL = {
          num: i,
          description: massFaz[i].name,
          phase: massFaz[i].faza,
          point: map.tflight[massFaz[i].idx].points,
          pos: {
            region: map.tflight[massFaz[i].idx].region.num,
            area: map.tflight[massFaz[i].idx].area.num,
            id: map.tflight[massFaz[i].idx].ID,
          },
        };
        if (i) {
          maskRoutes.listTL.push(maskListTL);
        } else {
          maskRoutes.listTL[0] = maskListTL;
        }
      }
      map.routes.push(maskRoutes);
      dispatch(mapCreate(map));
      console.log("MAP", map);
    }
    massFaz = [];
    handleCloseSetEnd();
    newInput = true;
  };

  const handleKey = (event: any) => {
    if (event.key === "Enter") event.preventDefault();
  };

  const InputFaza = (mode: number) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setCurrency(Number(event.target.value));
      massFaz[mode].faza = massDat[Number(event.target.value)];
    };

    let dat = massFaz[mode].phases;
    console.log("DAT", dat, dat.length);
    if (!dat.length) dat = [1, 2, 3];
    let massKey = [];
    let massDat: any[] = [];
    const currencies: any = [];
    for (let key in dat) {
      massKey.push(key);
      massDat.push(dat[key]);
    }
    for (let i = 0; i < massKey.length; i++) {
      let maskCurrencies = {
        value: "",
        label: "",
      };
      maskCurrencies.value = massKey[i];
      maskCurrencies.label = massDat[i];
      currencies.push(maskCurrencies);
    }

    const [currency, setCurrency] = React.useState(
      dat.indexOf(massFaz[mode].faza)
    );

    return (
      <Box sx={styleSetFaza}>
        {!massFaz[mode].delRec && (
          <Box component="form" sx={styleBoxFormFaza}>
            <TextField
              select
              size="small"
              onKeyPress={handleKey} //отключение Enter
              value={currency}
              onChange={handleChange}
              InputProps={{ style: { fontSize: 14 } }}
              variant="standard"
              color="secondary"
            >
              {currencies.map((option: any) => (
                <MenuItem
                  key={option.value}
                  value={option.value}
                  sx={{ fontSize: 14 }}
                >
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        )}
      </Box>
    );
  };

  const StrokaTabl = () => {
    let resStr = [];

    for (let i = 0; i < massFaz.length; i++) {
      knop = "удалить";
      let fSize = 15;
      colorRec = "black";
      if (massFaz[i].delRec) {
        knop = "восстановить";
        fSize = 12.9;
        colorRec = "red";
      }
      const styleSave = {
        fontSize: fSize,
        marginRight: 0.1,
        border: "2px solid #000",
        bgcolor: "#E6F5D6",
        minWidth: "110px",
        maxWidth: "110px",
        maxHeight: "20px",
        minHeight: "20px",
        borderColor: "#E6F5D6",
        borderRadius: 2,
        color: colorRec,
        textTransform: "unset !important",
      };

      resStr.push(
        <Grid
          key={i}
          container
          sx={{ marginTop: 1, color: colorRec, fontSize: fSize }}
        >
          <Grid item xs={8} sx={{ paddingLeft: 1 }}>
            {massFaz[i].name}
          </Grid>
          <Grid item xs={2}>
            <Box sx={{ textAlign: "center" }}>{InputFaza(i)}</Box>
          </Grid>
          <Grid item xs={2} sx={{ textAlign: "center" }}>
            <Button
              variant="contained"
              sx={styleSave}
              onClick={() => ClickKnop(i)}
            >
              {knop}
            </Button>
          </Grid>
        </Grid>
      );
    }
    return resStr;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValuen(event.target.value.trimStart()); // удаление пробелов в начале строки
    nameMode = event.target.value.trimStart();
  };

  const [valuen, setValuen] = React.useState(nameMode);

  return (
    <Modal open={openSetMode} onClose={handleCloseSetEnd} hideBackdrop>
      <Box sx={styleSetInf}>
        <Button sx={styleModalEnd} onClick={handleCloseSetEnd}>
          <b>&#10006;</b>
        </Button>

        <Grid container sx={{ marginTop: 1 }}>
          <Grid item xs={3.7} sx={{ border: 0, textAlign: "center" }}>
            <b>Введите название нового ЗУ:</b>
          </Grid>
          <Grid item xs sx={{ border: 0, textAlign: "center" }}>
            <Box sx={styleSet}>
              <Box component="form" sx={styleBoxFormName}>
                <TextField
                  size="small"
                  onKeyPress={handleKey} //отключение Enter
                  inputProps={{ style: { fontSize: 14 } }}
                  value={valuen}
                  onChange={handleChange}
                  variant="standard"
                />
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Typography variant="h6" sx={{ marginTop: 1, textAlign: "center" }}>
          Таблица фаз
        </Typography>
        <Box sx={{ marginTop: 0.5 }}>
          <Grid container sx={{ bgcolor: "#C0E2C3" }}>
            <Grid item xs={8} sx={{ border: 0, textAlign: "center" }}>
              <b>Описание</b>
            </Grid>
            <Grid item xs={2} sx={{ border: 0, textAlign: "center" }}>
              <b>Фаза</b>
            </Grid>
            <Grid item xs={2} sx={{ border: 0, textAlign: "center" }}>
              <b>Действие</b>
            </Grid>
          </Grid>

          <Box sx={{ overflowX: "auto", height: "69vh" }}>{StrokaTabl()}</Box>

          <Box sx={{ marginTop: 0.5, textAlign: "center" }}>
            <Button sx={styleModalMenu} onClick={() => SaveRec(0)}>
              Сохранить
            </Button>
            <Button sx={styleModalMenu} onClick={() => SaveRec(1)}>
              Очистить
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default GsSetPhase;
