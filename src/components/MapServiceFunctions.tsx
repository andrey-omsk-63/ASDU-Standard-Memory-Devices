import * as React from "react";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import CardMedia from "@mui/material/CardMedia";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { MdOpenWith } from "react-icons/md";

import { YMapsApi } from "react-yandex-maps";

import { Pointer } from "./../App";

import { FullscreenControl, GeolocationControl } from "react-yandex-maps";
import { RulerControl, SearchControl } from "react-yandex-maps";
import { TrafficControl, TypeSelector, ZoomControl } from "react-yandex-maps";

import { styleModalEnd } from "./MainMapStyle";
import { searchControl, styleSetPK04 } from "./MainMapStyle";

import { styletSelectTitle } from "./GsComponents/GsComponentsStyle";

const handleKey = (event: any) => {
  if (event.key === "Enter") event.preventDefault();
};

export const YandexServices = () => {
  return (
    <>
      <FullscreenControl />
      <GeolocationControl options={{ float: "left" }} />
      <RulerControl options={{ float: "right" }} />
      <SearchControl options={searchControl} />
      <TrafficControl options={{ float: "right" }} />
      <TypeSelector options={{ float: "right" }} />
      <ZoomControl options={{ float: "right" }} />
    </>
  );
};

export const ExitCross = (func: any) => {
  return (
    <Button sx={styleModalEnd} onClick={() => func()}>
      <b>&#10006;</b>
    </Button>
  );
};

export const FooterContent = (SaveForm: Function) => {
  const styleFormPK03 = {
    maxHeight: "24px",
    minHeight: "24px",
    backgroundColor: "#E6F5D6", // светло салатовый
    border: "1px solid #d4d4d4", // серый
    borderRadius: 1,
    textTransform: "unset !important",
    boxShadow: 6,
    textShadow: "2px 2px 3px rgba(0,0,0,0.3)",
    color: "black",
    padding: "2px 8px 0px 8px",
  };

  return (
    <Box sx={styleSetPK04}>
      <Box sx={{ display: "inline-block", margin: "0px 5px 0px 0px" }}>
        <Button sx={styleFormPK03} onClick={() => SaveForm(0)}>
          Выйти без сохранения
        </Button>
      </Box>
      <Box sx={{ display: "inline-block", margin: "0px 5px 0px 5px" }}>
        <Button sx={styleFormPK03} onClick={() => SaveForm(1)}>
          Сохранить изменения
        </Button>
      </Box>
    </Box>
  );
};

export const MasskPoint = (debug: boolean, rec: any, imgFaza: string) => {
  let masskPoint: Pointer = {
    ID: -1,
    coordinates: [],
    nameCoordinates: rec.description,
    region: Number(rec.region.num),
    area: Number(rec.area.num),
    phases: rec.phases,
    phSvg: [],
  };
  let img: any = debug ? imgFaza : null;
  masskPoint.ID = rec.ID;
  masskPoint.coordinates[0] = rec.points.Y;
  masskPoint.coordinates[1] = rec.points.X;
  for (let i = 0; i < rec.phases.length; i++) masskPoint.phSvg.push(img);
  return masskPoint;
};

export const DecodingCoord = (coord: string) => {
  return coord.split(",").map(Number);
};

export const CodingCoord = (coord: Array<number>) => {
  return String(coord[0]) + "," + String(coord[1]);
};

export const DoublRoute = (massroute: any, pointA: any, pointB: any) => {
  let flDubl = false;
  let pointAcod = CodingCoord(pointA);
  let pointBcod = CodingCoord(pointB);
  for (let i = 0; i < massroute.length; i++)
    if (massroute[i].starts === pointAcod && massroute[i].stops === pointBcod)
      flDubl = true;
  return flDubl;
};

export const CenterCoord = (aY: number, aX: number, bY: number, bX: number) => {
  let coord0 = (aY - bY) / 2 + bY;
  if (aY < bY) coord0 = (bY - aY) / 2 + aY;
  let coord1 = (aX - bX) / 2 + bX;
  if (aX < bX) coord1 = (bX - aX) / 2 + aX;
  return [coord0, coord1];
};

export const CenterCoordBegin = (map: any) => {
  let mapp = map.tflight;
  let min = 999;
  let max = 0;
  let nomMin = -1;
  let nomMax = -1;
  for (let i = 0; i < mapp.length; i++) {
    if (mapp[i].points.X < min) {
      nomMin = i;
      min = mapp[i].points.X;
    }
    if (mapp[i].points.X > max) {
      nomMax = i;
      max = mapp[i].points.X;
    }
  }

  return CenterCoord(
    mapp[nomMin].points.Y,
    mapp[nomMin].points.X,
    mapp[nomMax].points.Y,
    mapp[nomMax].points.X
  );

  // return CenterCoord(
  //   map.dateMap.boxPoint.point0.Y,
  //   map.dateMap.boxPoint.point0.X,
  //   map.dateMap.boxPoint.point1.Y,
  //   map.dateMap.boxPoint.point1.X
  // );
};

export const SaveZoom = (zoom: number, pointCenter: Array<number>) => {
  window.localStorage.ZoomDU = zoom;
  window.localStorage.PointCenterDU0 = pointCenter[0];
  window.localStorage.PointCenterDU1 = pointCenter[1];
};

export const Distance = (coord1: Array<number>, coord2: Array<number>) => {
  if (coord1[0] === coord2[0] && coord1[1] === coord2[1]) {
    return 0;
  } else {
    let radlat1 = (Math.PI * coord1[0]) / 180;
    let radlat2 = (Math.PI * coord2[0]) / 180;
    let theta = coord1[1] - coord2[1];
    let radtheta = (Math.PI * theta) / 180;
    let dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) dist = 1;
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515 * 1609.344;
    return dist;
  }
};

export const Сrossroad = () => {
  return (
    <>
      <Box sx={{ fontSize: 15, padding: "4px 0px 3px 0px" }}>
        <MdOpenWith />
      </Box>
      {StrokaHelp("]", 1)}
    </>
  );
};

export const HelpAdd = (soobHelpFiest: string) => {
  return (
    <>
      {StrokaHelp(soobHelpFiest, 0)}
      {Сrossroad()}
    </>
  );
};
//=== Placemark =====================================
export const GetPointData = (
  index: number,
  pointAaIndex: number,
  pointBbIndex: number,
  massdk: any,
  map: any,
  massMem: any
) => {
  let cont1 = massdk[index].nameCoordinates + "<br/>";
  let cont3 = map.tflight[index].tlsost.description + "<br/>";
  let cont2 = "[" + massdk[index].ID + ", " + map.tflight[index].idevice + "]";
  let textBalloon = "";
  let nomInRoute = massMem.indexOf(index);
  if (nomInRoute > 0)
    textBalloon = "Промежуточная точка маршрута №" + (nomInRoute + 1);
  if (index === pointBbIndex) textBalloon = "Конец маршрута";
  if (index === pointAaIndex) textBalloon = "Начало маршрута";

  return {
    hintContent: cont1 + cont3 + cont2 + "<br/>" + textBalloon,
  };
};

export const ErrorHaveVertex = (rec: any) => {
  alert(
    "Не существует светофор: Район " +
      rec.area +
      " ID " +
      rec.id +
      ". Устройство будет проигнорировано и удалёно из плана"
  );
};

//=== addRoute =====================================
export const getMultiRouteOptions = () => {
  return {
    // routeActiveStrokeWidth: 4,
    // //routeActiveStrokeColor: "#224E1F",
    // routeStrokeWidth: 0,
    // wayPointVisible: false,
    routeActiveStrokeWidth: 4, // толщина линии
    routeStrokeWidth: 0, // толщина линии альтернативного маршрута
    wayPointVisible: false, // отметки "начало - конец"
    strokeWidth: 4, // толщина линии Polyline
    strokeColor: "#9B59DA", // цвет линии Polyline - сиреневый
  };
};

export const PutItInAFrame = (
  ymaps: YMapsApi | null,
  mapp: any,
  massCoord: Array<Array<number>>
) => {
  if (ymaps) {
    let multiRout = new ymaps.multiRouter.MultiRoute(
      { referencePoints: massCoord },
      {
        boundsAutoApply: true, // вписать в границы
        routeActiveStrokeWidth: 0, // толщина линии
        routeStrokeWidth: 0, // толщина линии альтернативного маршрута
        wayPointVisible: false,
      }
    );
    mapp.current.geoObjects.add(multiRout);
  }
};

//=== GsSetPhase ===================================
export const NameMode = () => {
  let nameMode =
    "(" +
    new Date().toLocaleDateString() +
    " " +
    new Date().toLocaleTimeString() +
    ")";
  return nameMode;
};
//=== GsToDoMode ===================================
export const OutputFazaImg = (img: any, i: number) => {
  let widthHeight = 60;
  if (!img) widthHeight = 30;

  const styleFazaImg = {
    fontSize: 27,
    marginTop: -0.5,
    marginLeft: 2,
    height: "68px",
    color: "#5B1080", // сиреневый
    textShadow: "2px 2px 3px rgba(0,0,0,0.3)",
  };

  return (
    <>
      {img ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          style={{ width: widthHeight, height: widthHeight }}
        >
          <image
            width={"100%"}
            height={"100%"}
            xlinkHref={"data:image/png;base64," + img}
          />
        </svg>
      ) : (
        <Box sx={styleFazaImg}>{i}</Box>
      )}
    </>
  );
};

export const OutputVertexImg = (host: string) => {
  return (
    <CardMedia
      component="img"
      sx={{ textAlign: "center", height: 40, width: 30 }}
      image={host}
    />
  );
};

const StrokaHeader = (xss: number, soob: string) => {
  return (
    <>
      {soob !== "id" ? (
        <Grid item xs={xss} sx={{ fontWeight: 500, textAlign: "center" }}>
          {soob}
        </Grid>
      ) : (
        <Grid item xs={xss} sx={{ textAlign: "center" }}>
          <em>[{soob}]</em>
        </Grid>
      )}
    </>
  );
};

export const HeaderTabl = () => {
  return (
    <Grid container sx={{ bgcolor: "#B8CBB9" }}>
      {StrokaHeader(1, "id")}
      {StrokaHeader(3.6, "Состояние")}
      {StrokaHeader(2.1, "Фаза")}
      {StrokaHeader(4.5, "ДК")}
    </Grid>
  );
};

export const HeadingTabl = (DEMO: boolean, map: any, newMode: number) => {
  return (
    <Grid container sx={{}}>
      <Grid item xs sx={styletSelectTitle}>
        Режим:{" "}
        <em>
          <b>{map.routes[newMode].description}</b>
        </em>
        {DEMO && (
          <>
            <Box sx={{ color: "background.paper", display: "inline-block" }}>
              {"."}
            </Box>
            <Box sx={{ fontSize: 15, color: "red", display: "inline-block" }}>
              {" ("}демонстрационный{")"}
            </Box>
          </>
        )}
      </Grid>
    </Grid>
  );
};
//=== MainMapGs ====================================
export const StrokaMenuDop = (soob: string, func: any, mode: number) => {
  let dlSoob = (soob.length + 5) * 8;
  const styleApp01 = {
    fontSize: 14,
    marginRight: 0.3,
    width: dlSoob,
    maxHeight: "21px",
    minHeight: "21px",
    bgcolor: "#C4EAA2", // салатовый
    border: "1px solid #d4d4d4", // серый
    borderRadius: 1,
    color: "black",
    textTransform: "unset !important",
    paddingTop: 1.5,
    paddingBottom: 1.2,
    boxShadow: 6,
  };

  return (
    <Button sx={styleApp01} onClick={() => func(mode)}>
      <b>{soob}</b>
    </Button>
  );
};

export const InputDirect = (props: { func: any }) => {
  const styleSetNapr = {
    width: "185px",
    maxHeight: "1px",
    minHeight: "1px",
    bgcolor: "#BAE186", // салатовый,
    border: "1px solid #d4d4d4", // серый
    borderRadius: 1,
    paddingTop: 1.4,
    paddingBottom: 1.2,
    textAlign: "center",
    boxShadow: 6,
  };

  const styleBoxFormNapr = {
    "& > :not(style)": {
      marginTop: "-12px",
      width: "185px",
    },
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //let curr = currency
    setCurrency(Number(event.target.value));
    switch (Number(event.target.value)) {
      case 0: // // заголовок
        props.func(43);
        setCurrency(1);
        break;
      case 1: // созданию нового режима
        props.func(43);
        break;
      case 2: // выбор режима ЗУ
        props.func(42);
        break;
      case 3: // Настройки
        props.func(46);
        setCurrency(1);
        break;
      case 4: // режим Demo
        props.func(47);
        setCurrency(1);
        break;
      case 5: // Фрагменты
        props.func(48);
        setCurrency(1);
    }
  };

  let dat = [
    "Режимы работы:",
    "● Создание новой ЗУ",
    "● Существующие ЗУ",
    "● Настройки",
    "● Режим Демо",
    "● Фрагменты",
  ];
  let massKey = [];
  let massDat: any[] = [];
  const currencies: any = [];
  for (let key in dat) {
    massKey.push(key);
    massDat.push(dat[key]);
  }
  for (let i = 0; i < massKey.length; i++)
    currencies.push({ value: massKey[i], label: massDat[i] });

  const [currency, setCurrency] = React.useState(1);

  return (
    <Box sx={styleSetNapr}>
      <Box component="form" sx={styleBoxFormNapr}>
        <TextField
          select
          size="small"
          onKeyPress={handleKey} //отключение Enter
          value={currency}
          onChange={handleChange}
          InputProps={{
            disableUnderline: true,
            style: {
              fontSize: 15,
              fontWeight: 500,
              color: currency === 4 ? "red" : currency === 0 ? "blue" : "black",
            },
          }}
          variant="standard"
          color="secondary"
        >
          {currencies.map((option: any) => (
            <MenuItem
              key={option.value}
              value={option.value}
              sx={{
                fontSize: 15,
                color:
                  option.label === "● Режим Демо"
                    ? "red"
                    : option.label === "Режимы работы:"
                    ? "blue"
                    : "black",
                cursor: option.label === "Режимы работы:" ? "none" : "pointer",
                fontWeight: option.label === "Режимы работы:" ? 800 : 300,
              }}
            >
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>
    </Box>
  );
};

export const StrokaMenuGlob = (func: any) => {
  const styleApp01 = {
    fontSize: 12.9,
    marginRight: 0.5,
    //marginLeft: 0.1,
    width: 185,
    maxHeight: "26px",
    minHeight: "26px",
    //border: 1,
  };

  return (
    <Box sx={styleApp01}>
      <InputDirect func={func} />
    </Box>
  );
};

export const StrokaHelp = (soobInfo: string, mode: number) => {
  let moder = mode ? "left" : "right";
  let dl = mode ? 20 : 490;

  const styleInfoSoob = {
    width: dl, // 530
    maxHeight: "26px",
    minHeight: "26px",
    color: "#E6761B", // оранж
    textAlign: moder,
    textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
    fontWeight: 500,
  };

  return (
    <Box sx={styleInfoSoob}>
      <em>{soobInfo}</em>
    </Box>
  );
};

export const StrokaHelpPusto = () => {
  const styleInfoSoob = {
    maxWidth: "1px",
    minWidth: "1px",
    maxHeight: "26px",
    minHeight: "26px",
    backgroundColor: "#E9F5D8",
  };
  return <Button sx={styleInfoSoob}> </Button>;
};
//=== GsSetup ======================================
export const BadExit = (badExit: boolean, handleCloseEnd: Function) => {
  const styleSetPoint = {
    outline: "none",
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "#fff6d2", // светло-жёлтый
    border: "1px solid #fff6d2", // светло-жёлтый
    borderRadius: 1,
    textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
    boxShadow: 24,
    textAlign: "center",
    p: 1,
  };

  const styleModalMenu = {
    marginTop: 0.5,
    maxHeight: "24px",
    minHeight: "24px",
    backgroundColor: "#E6F5D6",
    border: "1px solid #d4d4d4", // серый
    borderRadius: 1,
    boxShadow: 6,
    textTransform: "unset !important",
    lineHeight: 2.0,
    color: "black",
  };

  const handleClose = (mode: boolean) => handleCloseEnd(mode);

  return (
    <Modal open={badExit} onClose={() => handleClose(false)}>
      <Box sx={styleSetPoint}>
        {ExitCross(() => handleClose(false))}
        <Typography variant="h6" sx={{ color: "red" }}>
          ⚠️Предупреждение
        </Typography>
        <Box sx={{ marginTop: 0.5 }}>
          <Box sx={{ marginBottom: 1.2 }}>
            Будет произведён выход без сохранения. Продолжать?
          </Box>
          <Button sx={styleModalMenu} onClick={() => handleClose(true)}>
            Да
          </Button>
          &nbsp;
          <Button sx={styleModalMenu} onClick={() => handleClose(false)}>
            Нет
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export const StrTablVert = (
  mode: boolean,
  xss: number,
  recLeft: string,
  recRight: any
) => {
  let coler = mode ? "black" : "#A8A8A8";
  return (
    <>
      <Grid container sx={{ marginTop: 1 }}>
        <Grid item xs={0.25}></Grid>

        <Grid item xs={xss} sx={{ color: coler }}>
          <b>{recLeft}</b>
        </Grid>

        {typeof recRight === "object" ? (
          <Grid item xs>
            {recRight}
          </Grid>
        ) : (
          <Grid item xs sx={{ fontSize: 15, color: "#5B1080", border: 8 }}>
            <b>{recRight}</b>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export const ShiftOptimal = (
  mode: boolean,
  ChangeOptimal: Function,
  shift: number
) => {
  const styleOptimalNo = {
    marginTop: shift,
    marginRight: 1,
    maxHeight: "27px",
    minHeight: "27px",
    maxWidth: 58,
    minWidth: 58,
    backgroundColor: "#E6F5D6", // светло салатовый
    border: "1px solid #d4d4d4", // серый
    borderRadius: 1,
    textTransform: "unset !important",
    boxShadow: 2,
    color: "black",
  };

  const styleOptimalYes = {
    marginTop: shift,
    marginRight: 1,
    maxHeight: "27px",
    minHeight: "27px",
    maxWidth: 58,
    minWidth: 58,
    backgroundColor: "#bae186", // тёмно салатовый
    border: "1px solid #bae186", // тёмно салатовый
    borderRadius: 1,
    textTransform: "unset !important",
    boxShadow: 6,
    color: "black",
  };

  let illum = mode ? styleOptimalYes : styleOptimalNo;
  let soob = mode ? "Да" : "Нет";

  return (
    <Button sx={illum} onClick={() => ChangeOptimal()}>
      {soob}
    </Button>
  );
};

export const PreparCurrenciesDispVert = () => {
  const currencies: any = [];
  let dat = ["значками светофоров", "картинками фаз", "номерами фаз"];
  let massKey: any = [];
  let massDat: any = [];
  for (let key in dat) {
    massKey.push(key);
    massDat.push(dat[key]);
  }
  for (let i = 0; i < massKey.length; i++)
    currencies.push({ value: massKey[i], label: massDat[i] });
  return currencies;
};

export const WaysInput = (
  idx: number,
  VALUE: any,
  SetValue: Function,
  MIN: number,
  MAX: number
) => {
  let value = VALUE;

  const styleSetID = {
    width: "33px",
    maxHeight: "1px",
    minHeight: "1px",
    border: "1px solid #d4d4d4", // серый
    borderRadius: 1,
    bgcolor: "#FFFBE5", // топлёное молоко
    boxShadow: 6,
    textAlign: "center",
    p: 1.5,
  };

  const styleBoxFormID = {
    "& > :not(style)": {
      marginTop: "3px",
      marginLeft: "-9px",
      width: "53px",
    },
  };

  const handleChange = (event: any) => {
    let valueInp = event.target.value.replace(/^0+/, "");
    if (Number(valueInp) < MIN) valueInp = MIN;
    if (valueInp === "") valueInp = MIN;
    valueInp = Math.trunc(Number(valueInp));
    if (valueInp <= MAX) {
      value = valueInp.toString();
      SetValue(valueInp, idx);
    }
  };

  return (
    <Box sx={styleSetID}>
      <Box component="form" sx={styleBoxFormID}>
        <TextField
          size="small"
          onKeyPress={handleKey} //отключение Enter
          type="number"
          InputProps={{ disableUnderline: true }}
          inputProps={{
            style: {
              marginTop: "-16px",
              padding: "4px 0px 0px 0px",
              fontSize: 14,
              backgroundColor: "#FFFBE5", // топлёное молоко
              cursor: "pointer",
            },
          }}
          value={value}
          onChange={handleChange}
          variant="standard"
          color="secondary"
        />
      </Box>
    </Box>
  );
};

export const InputFromList = (func: any, currency: any, currencies: any) => {
  const styleSet = {
    width: "165px",
    maxHeight: "6px",
    minHeight: "6px",
    bgcolor: "#FFFBE5",
    border: "1px solid #d4d4d4", // серый
    borderRadius: 1,
    textAlign: "left",
    p: 1.45,
    boxShadow: 6,
  };

  const styleBoxForm = {
    "& > :not(style)": {
      marginTop: "-7px",
      marginLeft: "-12px",
      width: "175px",
      padding: "0px 0px 0px 5px",
    },
  };

  return (
    <Box sx={styleSet}>
      <Box component="form" sx={styleBoxForm}>
        <TextField
          select
          size="small"
          onKeyPress={handleKey} //отключение Enter
          value={currency}
          onChange={func}
          InputProps={{ disableUnderline: true, style: { fontSize: 14 } }}
          variant="standard"
          color="secondary"
        >
          {currencies.map((option: any) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>
    </Box>
  );
};
//==================================================
