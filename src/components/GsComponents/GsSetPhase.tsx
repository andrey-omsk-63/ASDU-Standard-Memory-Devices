import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { mapCreate, massmodeCreate } from "../../redux/actions";
import { statsaveCreate } from "../../redux/actions";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

import GsErrorMessage from "./GsErrorMessage";

import { OutputFazaImg, NameMode, InputName } from "../MapServiceFunctions";
import { ExitCross, PointMenu, StrokaFooter } from "../MapServiceFunctions";
import { ChangeFaza } from "../MapServiceFunctions";

import { SendSocketCreateRoute } from "../MapSocketFunctions";
import { SendSocketUpdateRoute } from "../MapSocketFunctions";
import { SendSocketDeleteRoute } from "../MapSocketFunctions";

import { styleSetInf, styletFaza01 } from "./GsComponentsStyle";
import { styleSaveRed } from "./GsComponentsStyle";
import { styleSaveBlack, styletSelectTit } from "./GsComponentsStyle";
import { StyleSetFaza, StyleSetFazaNull } from "./GsComponentsStyle";

let newInput = true;
let massFaz: any = []; // инфа о режиме
let nameMode = "";
let nameModeStart = "";

let soobErr = "";
let chFaz = 0;
let chName = 0;
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
  const DEMO = datestat.demo;
  const dispatch = useDispatch();
  //========================================================
  const [openSoobErr, setOpenSoobErr] = React.useState(false);
  const [trigger, setTrigger] = React.useState(true);
  const [chDel, setChDel] = React.useState(0);

  let massCoord = props.massCoord;
  xsFaza = 2.7;
  if (props.newMode < 0) xsFaza = 0.9;
  let nameZU =
    props.newMode < 0 ? "Введите название ЗУ:" : "Измените название ЗУ:";
  //=== инициализация ======================================
  const MakeMaskFaz = (i: number) => {
    let im: Array<string | null> = [];
    let iDx = props.massMem[i];
    let maskFaz = {
      idx: iDx,
      faza: 1,
      phases: massdk[iDx].phases,
      name: massdk[iDx].nameCoordinates,
      delRec: false,
      img: im,
    };
    if (!maskFaz.phases.length) {
      maskFaz.img = [null, null, null];
    } else maskFaz.img = massdk[iDx].phSvg;
    if (props.newMode >= 0) {
      maskFaz.faza = map.routes[props.newMode].listTL[i].phase;
      if (!maskFaz.faza) maskFaz.faza = 1;
    }
    return maskFaz;
  };

  if (props.newMode >= 0) {
    if (newInput) {
      massFaz = []; // существующий режим
      chFaz = chName = 0;
      for (let i = 0; i < props.massMem.length; i++)
        massFaz.push(MakeMaskFaz(i));
      newInput = false;
      nameMode = JSON.parse(
        JSON.stringify(map.routes[props.newMode].description)
      );
      nameModeStart = JSON.parse(
        JSON.stringify(map.routes[props.newMode].description)
      );
    }
  } else {
    if (newInput) {
      massFaz = []; // новый режим
      chFaz = chName = 0;
      nameMode = "Режим ЗУ" + NameMode();
      nameModeStart = JSON.parse(JSON.stringify(nameMode));
      for (let i = 0; i < props.massMem.length; i++)
        massFaz.push(MakeMaskFaz(i));
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
  const [valuen, setValuen] = React.useState(nameMode);

  const handleCloseSetEnd = (mode: boolean) => {
    if (chDel) DelRec();
    props.func(massFaz);
    props.setOpen(mode);
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

  const SaveFaz = (mode: number) => {
    let end = true;
    let maskRoutes = JSON.parse(JSON.stringify(map.routes[props.newMode]));
    let maskRoutesOld = JSON.parse(JSON.stringify(map.routes[props.newMode]));
    for (let i = 0; i < massFaz.length; i++)
      maskRoutes.listTL[i].phase = massFaz[i].faza; // перезапись фаз
    maskRoutes.description = nameMode; // перезапись названия ЗУ
    if (mode) {
      // Сохранить как новый режим ЗУ
      map.routes.push(maskRoutes);
      dispatch(mapCreate(map));
      !DEMO && SendSocketCreateRoute(maskRoutes);
      massmode.push({
        name: nameMode,
        delRec: false,
        kolOpen: 0,
      });
    } else {
      // Сохранить изменения в старом ЗУ
      map.routes[props.newMode] = maskRoutes;
      if (nameMode === nameModeStart) {
        // было тоько изменение фаз
        !DEMO && SendSocketUpdateRoute(maskRoutes);
      } else {
        massmode[props.newMode].name = nameMode;
        !DEMO && SendSocketDeleteRoute(maskRoutesOld); // удаление ЗУ со старым названием
        !DEMO && SendSocketCreateRoute(maskRoutes); // создание ЗУ с новым названием
        end = false;
      }
    }
    dispatch(massmodeCreate(massmode));
    dispatch(mapCreate(map));
    dispatch(massmodeCreate(massmode));
    handleCloseSetEnd(end);
    chFaz = chName = 0;
    massFaz = [];
  };

  const SaveRec = (mode: number) => {
    if (!mode) {
      if (chDel) DelRec(); // сохранить
      if (massFaz.length < 2) {
        soobErr =
          "Некорректный режим - количество светофоров не может быть меньше двух";
        setOpenSoobErr(true);
      } else {
        for (let i = 0; i < map.routes.length; i++)
          if (nameMode === map.routes[i].description) nameMode += NameMode();
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
          } else maskRoutes.listTL[0] = maskListTL;
        }
        map.routes.push(maskRoutes);
        dispatch(mapCreate(map));
        !DEMO && SendSocketCreateRoute(maskRoutes);
        massmode.push({
          name: nameMode,
          delRec: false,
          kolOpen: 0,
        });
        dispatch(massmodeCreate(massmode));
        massFaz = [];
        handleCloseSetEnd(true);
      }
    } else {
      if (mode === 1) massFaz = []; // очистить таблицу
      handleCloseSetEnd(true);
    }
  };

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    let eventTargeValue = event.target.value.trimStart(); // удаление пробелов в начале строки
    if (eventTargeValue && nameMode !== eventTargeValue) {
      nameMode = eventTargeValue;
      setValuen(nameMode);
      chName++;
    }
  };

  const InputFaza = (mode: number) => {
    const handleChangeFaza = (event: React.ChangeEvent<HTMLInputElement>) => {
      chFaz++;
      setCurrency(Number(event.target.value));
      massFaz[mode].faza = massDat[Number(event.target.value)];
    };

    const mesto = props.newMode < 0 ? "12%" : "0%";
    const styleSetFaza = StyleSetFaza(mesto);
    const styleSetFazaNull = StyleSetFazaNull(mesto);
    const styleFaz = massFaz[mode].delRec ? styleSetFazaNull : styleSetFaza;
    let dat = massFaz[mode].phases;
    if (!dat.length) dat = [1, 2, 3];
    let massKey = [];
    let massDat: any[] = [];
    const currencies: any = [];
    for (let key in dat) {
      massKey.push(key);
      massDat.push(dat[key]);
    }
    for (let i = 0; i < massKey.length; i++)
      currencies.push({ value: massKey[i], label: massDat[i] });

    const [currency, setCurrency] = React.useState(
      dat.indexOf(massFaz[mode].faza)
    );

    return (
      <Box sx={styleFaz}>
        {!massFaz[mode].delRec && (
          <>{ChangeFaza(currency, currencies, handleChangeFaza)}</>
        )}
      </Box>
    );
  };

  const StrokaTabl = () => {
    let resStr = [];
    for (let i = 0; i < massFaz.length; i++) {
      let knop = "удалить";
      let fSize = 14;
      let colorRec = "black";
      if (massFaz[i].delRec) {
        knop = "восстановить";
        fSize = 12.9;
        colorRec = "red";
      }
      let illum = massFaz[i].delRec ? styleSaveRed : styleSaveBlack;
      let recMF = massFaz[i].faza - 1;

      const styleTabl01 = {
        marginTop: 1,
        color: colorRec,
        fontSize: fSize,
      };

      resStr.push(
        <Grid key={i} container sx={styleTabl01}>
          <Grid item xs={7.3} sx={{ fontSize: 14, paddingLeft: 1 }}>
            {massFaz[i].name}
          </Grid>
          <Grid item xs={xsFaza}>
            <Box sx={{ textAlign: "center" }}>{InputFaza(i)}</Box>
          </Grid>
          <Grid item xs={1} sx={{}}>
            {!massFaz[i].delRec && (
              <>{OutputFazaImg(massFaz[i].img[recMF], massFaz[i].faza)}</>
            )}
          </Grid>
          {props.newMode < 0 && (
            <Grid item xs={2.8} sx={{ textAlign: "center" }}>
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

  const FooterMenu = () => {
    let soob = "Сохранить как новый режим ЗУ";
    return (
      <>
        {props.newMode < 0 ? (
          <Box sx={{ marginTop: 0.5, textAlign: "center" }}>
            {StrokaFooter(SaveRec, 0, "Сохранить режим")}
            {StrokaFooter(SaveRec, 2, "Продолжить создание")}
            {StrokaFooter(SaveRec, 1, "Отмена режима")}
          </Box>
        ) : (
          <>
            {!!chFaz || (!!chName && nameModeStart !== nameMode.trimEnd()) ? (
              <Box sx={{ marginTop: 0.5, textAlign: "center" }}>
                {!!chName && nameModeStart !== nameMode.trimEnd() && (
                  <>{StrokaFooter(SaveFaz, 1, soob)}</>
                )}
                {StrokaFooter(SaveFaz, 0, "Сохранить изменения")}
              </Box>
            ) : (
              <Box sx={{ height: "29px" }}> </Box>
            )}
          </>
        )}
      </>
    );
  };

  return (
    <Box sx={styleSetInf}>
      {ExitCross(handleCloseSetEnd)}
      {InputName(valuen, handleChangeName, nameZU)}
      <Box sx={styletSelectTit}>
        <b>Таблица фаз</b>
      </Box>
      <Box sx={styletFaza01}>
        <Grid container sx={{ fontSize: 14, bgcolor: "#B8CBB9" }}>
          {PointMenu(7.3, "Описание")}
          {PointMenu(xsFaza + 1, "Фаза")}
          {props.newMode < 0 && <>{PointMenu(2.8, "Действие")}</>}
        </Grid>
        <Box sx={{ overflowX: "auto", height: "540px" }}>{StrokaTabl()}</Box>
      </Box>
      {FooterMenu()}
      {openSoobErr && (
        <GsErrorMessage setOpen={setOpenSoobErr} sErr={soobErr} />
      )}
    </Box>
  );
};

export default GsSetPhase;
