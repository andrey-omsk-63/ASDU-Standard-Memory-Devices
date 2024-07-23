import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { mapCreate, massmodeCreate } from "../../redux/actions";
import { statsaveCreate } from "../../redux/actions";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";

import GsErrorMessage from "./GsErrorMessage";

import { OutputFazaImg, NameMode } from "../MapServiceFunctions";
import { SendSocketCreateRoute } from "../MapSocketFunctions";
import { SendSocketUpdateRoute } from "../MapSocketFunctions";

import { styleModalEnd } from "../MainMapStyle";

import { styleSetInf, styleModalMenu } from "./GsComponentsStyle";
import { styleBoxFormFaza, styleSaveRed } from "./GsComponentsStyle";
import { styleSaveBlack, styletFazaTitle } from "./GsComponentsStyle";
import { styleSet, styleBoxFormName, styletFaza01 } from "./GsComponentsStyle";
import { StyleSetFaza, StyleSetFazaNull } from "./GsComponentsStyle";
//import { styletSelectTitle } from "./GsComponentsStyle";

let newInput = true;
let massFaz: any = [];
let nameMode = "";
let soobErr = "";
let chFaz = 0;
let xsFaza = 2;

const GsSetPhase = (props: {
  setOpen: any;
  newMode: number;
  massMem: Array<number>;
  massCoord: any;
  func: any;
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
  let massmode = useSelector((state: any) => {
    const { massmodeReducer } = state;
    return massmodeReducer.massmode;
  });
  let datestat = useSelector((state: any) => {
    const { statsaveReducer } = state;
    return statsaveReducer.datestat;
  });
  const debug = datestat.debug;
  const ws = datestat.ws;
  const dispatch = useDispatch();
  //========================================================
  //const [openSetMode, setOpenSetMode] = React.useState(true);
  const [openSoobErr, setOpenSoobErr] = React.useState(false);
  const [trigger, setTrigger] = React.useState(true);
  const [chDel, setChDel] = React.useState(0);
  // const [valuen, setValuen] = React.useState(nameMode);
  let massCoord = props.massCoord;
  //=== инициализация ======================================
  const MakeMaskFaz = (i: number) => {
    chFaz = 0;
    let im: Array<string | null> = [];
    let maskFaz = {
      idx: 0,
      faza: 1,
      phases: [],
      name: "",
      delRec: false,
      img: im,
    };
    maskFaz.idx = props.massMem[i];
    maskFaz.name = massdk[maskFaz.idx].nameCoordinates;
    maskFaz.phases = massdk[maskFaz.idx].phases;
    if (!maskFaz.phases.length) {
      maskFaz.img = [null, null, null];
    } else {
      maskFaz.img = massdk[maskFaz.idx].phSvg;
    }
    if (props.newMode >= 0) {
      maskFaz.faza = map.routes[props.newMode].listTL[i].phase;
      if (!maskFaz.faza) maskFaz.faza = 1;
    }
    return maskFaz;
  };
  if (props.newMode >= 0) {
    if (newInput) {
      massFaz = []; // существующий режим
      for (let i = 0; i < props.massMem.length; i++) {
        massFaz.push(MakeMaskFaz(i));
      }
      newInput = false;
    }
  } else {
    if (newInput) {
      massFaz = []; // новый режим
      nameMode = "Режим ЗУ" + NameMode();
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
  }
  //========================================================
  const handleCloseSetEnd = () => {
    if (chDel) DelRec();
    props.func(massFaz);
    props.setOpen(false);
    //setOpenSetMode(false);
    newInput = true;
    datestat.working = false;
    dispatch(statsaveCreate(datestat));
  };

  const ClickKnop = (idx: number) => {
    massFaz[idx].delRec = !massFaz[idx].delRec;
    if (massFaz[idx].delRec) setChDel(chDel + 1);
    if (!massFaz[idx].delRec) setChDel(chDel - 1);
    setTrigger(!trigger);
  };

  const DelRec = () => {
    let massRab: any = [];
    let massCoordRab: any = [];
    for (let i = 0; i < massFaz.length; i++) {
      if (!massFaz[i].delRec) {
        massRab.push(massFaz[i]);
        massCoordRab.push(massCoord[i]);
      }
    }
    massFaz = massRab;
    massCoord = massCoordRab;
    setChDel(0);
  };

  const SaveFaz = () => {
    for (let i = 0; i < massFaz.length; i++) {
      map.routes[props.newMode].listTL[i].phase = massFaz[i].faza;
    }
    dispatch(mapCreate(map));
    SendSocketUpdateRoute(debug, ws, map.routes[props.newMode]);
    chFaz = 0;
    handleCloseSetEnd();
  };

  const SaveRec = (mode: number) => {
    if (!mode) {
      if (chDel) DelRec(); // сохранить
      if (massFaz.length < 2) {
        soobErr =
          "Некорректный режим - количество светофоров не может быть меньше двух";
        setOpenSoobErr(true);
      } else {
        for (let i = 0; i < map.routes.length; i++) {
          if (nameMode === map.routes[i].description) {
            nameMode += NameMode();
          }
        }
        let maskRoutes = {
          region: datestat.region,
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
          let pointt = { Y: 0, X: 0 };
          pointt.Y = massCoord[i][0];
          pointt.X = massCoord[i][1];
          let maskListTL = {
            num: i,
            description: massFaz[i].name,
            phase: massFaz[i].faza,
            point: pointt,
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
        SendSocketCreateRoute(debug, ws, maskRoutes);
        let maskName = {
          name: nameMode,
          delRec: false,
          kolOpen: 0,
        };
        massmode.push(maskName);
        dispatch(massmodeCreate(massmode));
        massFaz = [];
        handleCloseSetEnd();
      }
    } else {
      if (mode === 1) {
        massFaz = []; // очистить таблицу
      }
      handleCloseSetEnd();
    }
  };

  const handleKey = (event: any) => {
    if (event.key === "Enter") event.preventDefault();
  };

  const InputFaza = (mode: number) => {
    let mesto = props.newMode < 0 ? "12%" : "0%";
    const styleSetFaza = StyleSetFaza(mesto);
    const styleSetFazaNull = StyleSetFazaNull(mesto);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      chFaz++;
      setCurrency(Number(event.target.value));
      massFaz[mode].faza = massDat[Number(event.target.value)];
    };

    let dat = massFaz[mode].phases;
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

    let styleFaz = massFaz[mode].delRec ? styleSetFazaNull : styleSetFaza;

    return (
      <Box sx={styleFaz}>
        {!massFaz[mode].delRec && (
          <Box component="form" sx={styleBoxFormFaza}>
            <TextField
              select
              size="small"
              onKeyPress={handleKey} //отключение Enter
              value={currency}
              onChange={handleChange}
              InputProps={{ disableUnderline: true, style: { fontSize: 14 } }}
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
      let knop = "удалить";
      let fSize = 15;
      let colorRec = "black";
      if (massFaz[i].delRec) {
        knop = "восстановить";
        fSize = 12.9;
        colorRec = "red";
      }
      let illum = massFaz[i].delRec ? styleSaveRed : styleSaveBlack;

      resStr.push(
        <Grid
          key={i}
          container
          sx={{ marginTop: 1, color: colorRec, fontSize: fSize }}
        >
          <Grid item xs={8.3} sx={{ paddingLeft: 1 }}>
            {massFaz[i].name}
          </Grid>

          <Grid item xs={xsFaza}>
            <Box sx={{ textAlign: "center" }}>{InputFaza(i)}</Box>
          </Grid>
          <Grid item xs={1} sx={{ border: 0 }}>
            {!massFaz[i].delRec && (
              <>
                {OutputFazaImg(
                  massFaz[i].img[massFaz[i].faza - 1],
                  massFaz[i].faza
                )}
              </>
            )}
          </Grid>

          {props.newMode < 0 && (
            <Grid item xs={2} sx={{ textAlign: "center" }}>
              <Button sx={illum} onClick={() => ClickKnop(i)}>
                {knop}
              </Button>
            </Grid>
          )}
        </Grid>
      );
    }
    return resStr;
  };

  const StrokaHeader = (xss: number, soob: string) => {
    return (
      <Grid item xs={xss} sx={{ border: 0, textAlign: "center" }}>
        <b>{soob}</b>
      </Grid>
    );
  };

  const InputName = () => {
    return (
      <Grid container sx={{ marginTop: 1 }}>
        <Grid item xs={3.5} sx={{ fontSize: 14, textAlign: "center" }}>
          <b>Введите название нового ЗУ:</b>
        </Grid>
        <Grid item xs sx={{ border: 0, textAlign: "center" }}>
          <Box sx={styleSet}>
            <Box component="form" sx={styleBoxFormName}>
              <TextField
                size="small"
                onKeyPress={handleKey} //отключение Enter
                InputProps={{ disableUnderline: true }}
                inputProps={{
                  style: {
                    cursor: "pointer",
                    paddingLeft: "3px",
                    fontSize: 12.9,
                  },
                }}
                value={valuen}
                onChange={handleChange}
                variant="standard"
              />
            </Box>
          </Box>
        </Grid>
      </Grid>
    );
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value) {
      setValuen(event.target.value.trimStart()); // удаление пробелов в начале строки
      nameMode = event.target.value.trimStart();
    }
  };

  xsFaza = 2.7;
  if (props.newMode < 0) xsFaza = 0.7;
  const [valuen, setValuen] = React.useState(nameMode);

  return (
    <Box sx={styleSetInf}>
      <Button sx={styleModalEnd} onClick={handleCloseSetEnd}>
        <b>&#10006;</b>
      </Button>

      {props.newMode < 0 ? (
        <>{InputName()}</>
      ) : (
        <Grid container sx={{}}>
          <Grid item xs sx={{ fontSize: 14, textAlign: "left" }}>
            Режим: <b>{map.routes[props.newMode].description.slice(0, 90)}</b>
          </Grid>
        </Grid>
      )}

      <Typography variant="h6" sx={styletFazaTitle}>
        Таблица фаз
      </Typography>
      <Box sx={styletFaza01}>
        <Grid container sx={{ bgcolor: "#C0E2C3" }}>
          {StrokaHeader(8.3, "Описание")}
          {StrokaHeader(xsFaza + 1, "Фаза")}
          {props.newMode < 0 && <>{StrokaHeader(2, "Действие")}</>}
        </Grid>
        <Box sx={{ overflowX: "auto", height: "540px" }}>{StrokaTabl()}</Box>
      </Box>
      {props.newMode < 0 && (
        <Box sx={{ marginTop: 0.5, textAlign: "center" }}>
          <Button sx={styleModalMenu} onClick={() => SaveRec(0)}>
            Сохранить режим
          </Button>

          {chDel > 0 && (
            <Button sx={styleModalMenu} onClick={() => SaveRec(2)}>
              Удалить помеченные
            </Button>
          )}

          <Button sx={styleModalMenu} onClick={() => SaveRec(1)}>
            Отмена режима
          </Button>
        </Box>
      )}
      {props.newMode >= 0 && (
        <>
          {chFaz > 0 ? (
            <Box sx={{ marginTop: 0.5, textAlign: "center" }}>
              <Button sx={styleModalMenu} onClick={() => SaveFaz()}>
                Сохранить изменения
              </Button>
            </Box>
          ) : (
            <Box sx={{ height: "27px" }}> </Box>
          )}
        </>
      )}
      {openSoobErr && (
        <GsErrorMessage setOpen={setOpenSoobErr} sErr={soobErr} />
      )}
    </Box>
  );
};

export default GsSetPhase;
