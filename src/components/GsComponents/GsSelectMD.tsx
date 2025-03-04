import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { mapCreate, massmodeCreate, statsaveCreate } from "../../redux/actions";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
//import Typography from "@mui/material/Typography";

import GsErrorMessage from "./GsErrorMessage";
import GsLookHistory from "./GsLookHistory";

import { ExitCross } from "../MapServiceFunctions";

import { SendSocketDeleteRoute } from "../MapSocketFunctions";
import { SendSocketRouteHistory } from "../MapSocketFunctions";

import { styleSetSelect, styleModalMenuSelect } from "./GsComponentsStyle";
import { styletSelectTitle, styletSelect01 } from "./GsComponentsStyle";

let knop2 = "удалить";
let soobErr = "";
let oldHistory: any = null;
let oldTrHist: any = null;
let history: any = null;
let nomPlan = -1;
let startSeance = true;

const GsSelectMD = (props: {
  setOpen: Function;
  receive: any;
  history: any;
  trHist: boolean;
  funcHelper: Function;
}) => {
  //== Piece of Redux =======================================
  const map = useSelector((state: any) => {
    const { mapReducer } = state;
    return mapReducer.map.dateMap;
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
  //===========================================================
  const [trigger, setTrigger] = React.useState(true);
  const [openSoobErr, setOpenSoobErr] = React.useState(false);
  const [lookHistory, setLookHistory] = React.useState(false);
  const [openSetMode, setOpenSetMode] = React.useState(true);
  if (!debug) history = props.history;

  if (oldHistory !== props.history || oldTrHist !== props.trHist) {
    if (startSeance) {
      startSeance = false;
    } else setLookHistory(true);
    oldHistory = props.history;
    oldTrHist = props.trHist;
  }

  const handleCloseSetEnd = () => {
    datestat.create = true;
    dispatch(statsaveCreate(datestat));
    props.setOpen(false);
    props.funcHelper(true);
    setOpenSetMode(false);
  };

  const handleCloseEnd = (event: any, reason: string) => {
    if (reason === "escapeKeyDown") handleCloseSetEnd();
  };

  const ClickKnop1 = (idx: number) => {
    if (massmode[idx].delRec) {
      soobErr = "Данный режим помечен к удалению";
      setOpenSoobErr(true);
    } else {
      if (map.routes[idx].listTL.length < 2) {
        soobErr = "Некорректный режим. Количество светофоров = 1";
        setOpenSoobErr(true);
      } else {
        nomPlan = idx;
        props.receive(idx);
        props.setOpen(false);
        setOpenSetMode(false);
      }
    }
  };

  const ClickKnop2 = (idx: number) => {
    SendSocketRouteHistory(debug, ws, massmode[idx].name);
    //========================================================
    if (debug) {
      history = datestat.hist; // для отладки
      setLookHistory(true);
    }
    //========================================================
  };

  const ClickKnop3 = (idx: number) => {
    massmode[idx].delRec = !massmode[idx].delRec;
    dispatch(massmodeCreate(massmode));
    setTrigger(!trigger);
  };

  const DeleteRec = () => {
    let massRab = [];
    let massRoute = [];
    for (let i = 0; i < massmode.length; i++) {
      if (!massmode[i].delRec) {
        massRab.push(massmode[i]);
        massRoute.push(map.routes[i]);
      } else SendSocketDeleteRoute(debug, ws, map.routes[i]);
    }
    massmode = massRab;
    map.routes = massRoute;
    dispatch(massmodeCreate(massmode));
    dispatch(mapCreate(map));
    nomPlan = -1;
    setTrigger(!trigger);
  };

  const LookDel = () => {
    let chDel = 0;
    for (let i = 0; i < massmode.length; i++) if (massmode[i].delRec) chDel++;
    return chDel;
  };

  const StrokaTabl = () => {
    let resStr = [];
    for (let i = 0; i < massmode.length; i++) {
      knop2 = "удалить";
      let fSize = 12;
      let colorRec = "black";
      if (massmode[i].delRec) {
        knop2 = "восстановить";
        fSize = 11;
        colorRec = "red";
      }
      const styleBut01 = {
        fontSize: fSize + 1,
        marginTop: 1,
        bgcolor: "#E6F5D6", // светло-салатовый
        width: "320px",
        height: "22px",
        border: "1px solid #d4d4d4", // серый
        borderRadius: 1,
        color: colorRec,
        textTransform: "unset !important",
        boxShadow: 3,
        justifyContent: "flex-start",
      };

      const styleBut011 = {
        fontSize: fSize + 1,
        marginTop: 1,
        bgcolor: "#82E94A", // ярко-салатовый
        width: "320px",
        height: "22px",
        border: "1px solid #d4d4d4", // серый
        borderRadius: 1,
        color: colorRec,
        textTransform: "unset !important",
        boxShadow: 9,
        justifyContent: "flex-start",
      };

      const styleBut02 = {
        fontSize: fSize,
        marginTop: 1,
        bgcolor: "#E6F5D6", // светло-салатовый
        width: "105px",
        height: "22px",
        border: "1px solid #d4d4d4", // серый
        borderRadius: 1,
        color: colorRec,
        textTransform: "unset !important",
        boxShadow: 3,
      };

      const styleBut03 = {
        fontSize: fSize,
        marginTop: 1,
        bgcolor: "#82E94A", // ярко-салатовый
        width: "105px",
        height: "22px",
        border: "1px solid #d4d4d4", // серый
        borderRadius: 1,
        color: colorRec,
        textTransform: "unset !important",
        boxShadow: 9,
      };

      let illum = massmode[i].delRec ? styleBut03 : styleBut02;
      let ILLUM = nomPlan === i ? styleBut011 : styleBut01;

      resStr.push(
        <Grid key={i} container>
          <Grid item xs={7.1} sx={{ border: 0, textAlign: "center" }}>
            <Button sx={ILLUM} onClick={() => ClickKnop1(i)}>
              {massmode[i].name.slice(0, 36)}
            </Button>
          </Grid>

          <Grid item xs={2.5} sx={{ border:0, textAlign: "center" }}>
            <Button sx={styleBut02} onClick={() => ClickKnop2(i)}>
              история
            </Button>
          </Grid>

          <Grid item xs sx={{ border: 0, textAlign: "center" }}>
            <Button sx={illum} onClick={() => ClickKnop3(i)}>
              {knop2}
            </Button>
          </Grid>
        </Grid>
      );
    }
    return resStr;
  };

  return (
    <Modal open={openSetMode} onClose={handleCloseEnd} hideBackdrop={false}>
      <Box sx={styleSetSelect}>
        {ExitCross(handleCloseSetEnd)}

        <Box sx={styletSelectTitle}>
          <b>Выбор режима ЗУ</b>
        </Box>

        <Box sx={styletSelect01}>{StrokaTabl()}</Box>

        {LookDel() > 0 && (
          <Box sx={{ marginTop: 1, textAlign: "center" }}>
            <Button sx={styleModalMenuSelect} onClick={() => DeleteRec()}>
              Удалить отмеченные
            </Button>
          </Box>
        )}

        {lookHistory && (
          <GsLookHistory
            setOpen={setLookHistory}
            history={history}
            trHist={props.trHist}
          />
        )}
        {openSoobErr && (
          <GsErrorMessage setOpen={setOpenSoobErr} sErr={soobErr} />
        )}
      </Box>
    </Modal>
  );
};

export default GsSelectMD;
