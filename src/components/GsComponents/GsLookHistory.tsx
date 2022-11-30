import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
//import { massmodeCreate } from "../../redux/actions";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";

//import GsErrorMessage from "./GsErrorMessage";

//import { SendSocketDeleteRoute } from "../MapSocketFunctions";
//import { SendSocketRouteHistory } from "../MapSocketFunctions";

import { styleModalEnd } from "../MainMapStyle";
//import { styleSetSelect, styleModalMenuSelect } from "./GsComponentsStyle";

//let knop2 = "удалить";
//let soobErr = "";
let oldHistory: any = null;
let history: any = null;

const GsLookHistory = (props: {
  setOpen: Function;
  //receive: any;
  history: any;
  //funcHelper: Function;
}) => {
  console.log("@@@History:", props.history);
  history = props.history.history;
  //== Piece of Redux =======================================
  // const map = useSelector((state: any) => {
  //   const { mapReducer } = state;
  //   return mapReducer.map.dateMap;
  // });
  // let massmode = useSelector((state: any) => {
  //   const { massmodeReducer } = state;
  //   return massmodeReducer.massmode;
  // });
  // let datestat = useSelector((state: any) => {
  //   const { statsaveReducer } = state;
  //   return statsaveReducer.datestat;
  // });
  //const debug = datestat.debug;
  //const ws = datestat.ws;
  //const dispatch = useDispatch();
  //===========================================================
  //const [trigger, setTrigger] = React.useState(true);
  //const [openSoobErr, setOpenSoobErr] = React.useState(false);
  const [lookHistory, setLookHistory] = React.useState(false);
  const [openSetMode, setOpenSetMode] = React.useState(true);

  if (oldHistory !== props.history) {
    setLookHistory(true);
    oldHistory = props.history;
  }

  const handleCloseSetEnd = () => {
    props.setOpen(false);
    //props.funcHelper(true);
    setOpenSetMode(false);
  };

  // const ClickKnop1 = (idx: number) => {
  //   if (massmode[idx].delRec) {
  //     soobErr = "Данный режим помечен к удалению";
  //     setOpenSoobErr(true);
  //   } else {
  //     if (map.routes[idx].listTL.length < 2) {
  //       soobErr = "Некорректный режим. Количество светофоров = 1";
  //       setOpenSoobErr(true);
  //     } else {
  //       props.receive(idx);
  //       props.setOpen(false);
  //       setOpenSetMode(false);
  //     }
  //   }
  // };

  // const ClickKnop2 = (idx: number) => {
  //   SendSocketRouteHistory(debug, ws, massmode[idx].name);

  //   if (debug) {
  //     history = datestat.hist; // для отладки
  //     setLookHistory(true);
  //     //setTrigger(!trigger);
  //   }
  // };

  // const ClickKnop3 = (idx: number) => {
  //   massmode[idx].delRec = !massmode[idx].delRec;
  //   dispatch(massmodeCreate(massmode));
  //   setTrigger(!trigger);
  // };

  // const LookDel = () => {
  //   let chDel = 0;
  //   for (let i = 0; i < massmode.length; i++) {
  //     if (massmode[i].delRec) chDel++;
  //   }
  //   return chDel;
  // };

  const StrokaTabl = () => {
    let resStr = [];
    for (let i = 0; i < history.length; i++) {
      let stroka = new Date(history[i].tm).toLocaleDateString() + " ";
      stroka += new Date(history[i].tm).toLocaleTimeString();
      //knop2 = "удалить";
      let fSize = 12;
      let colorRec = "black";

      const styleBut01 = {
        fontSize: 14,
        marginTop: 1,
        border: "2px solid #000",
        bgcolor: "#E6F5D6",
        width: "320px",
        maxHeight: "20px",
        minHeight: "20px",
        borderColor: "#E6F5D6",
        borderRadius: 2,
        color: colorRec,
        textTransform: "unset !important",
      };
      // const styleBut02 = {
      //   fontSize: 14,
      //   marginTop: 1,
      //   border: "2px solid #000",
      //   bgcolor: "#E6F5D6",
      //   width: "105px",
      //   maxHeight: "20px",
      //   minHeight: "20px",
      //   borderColor: "#E6F5D6",
      //   borderRadius: 2,
      //   color: colorRec,
      //   textTransform: "unset !important",
      // };
      resStr.push(
        <Grid key={i} container>
          <Grid item xs sx={{ border: 0, textAlign: "center" }}>
            <Button
              variant="contained"
              sx={styleBut01}
              //onClick={() => ClickKnop1(i)}
            >
              {stroka}
            </Button>
          </Grid>

          {/* <Grid item xs={2.5} sx={{ border: 0, textAlign: "center" }}>
            <Button
              variant="contained"
              sx={styleBut02}
              onClick={() => ClickKnop2(i)}
            >
              история
            </Button>
          </Grid> */}

          {/* <Grid item xs sx={{ border: 0, textAlign: "center" }}>
            <Button
              variant="contained"
              sx={styleBut02}
              onClick={() => ClickKnop3(i)}
            >
              {knop2}
            </Button>
          </Grid> */}
        </Grid>
      );
    }
    return resStr;
  };

  const styleSetHist = {
    position: "relative",
    marginTop: 6,
    marginLeft: 8,
    marginRight: "auto",
    width: 380,
    //height: "69vh", // для отладки
    bgcolor: "background.paper",
    border: "3px solid #000",
    borderColor: "primary.main",
    borderRadius: 2,
    boxShadow: 24,
    p: 1.5,
  };

  return (
    <Modal open={openSetMode} onClose={handleCloseSetEnd} hideBackdrop>
      <Box sx={styleSetHist}>
        <Button sx={styleModalEnd} onClick={handleCloseSetEnd}>
          <b>&#10006;</b>
        </Button>

        <Typography variant="h6" sx={{ textAlign: "center" }}>
          {history[0].description}
        </Typography>
        <Box sx={{ overflowX: "auto", height: "69vh" }}>{StrokaTabl()}</Box>
        {/* {LookDel() > 0 && (
          <Box sx={{ marginTop: 1, textAlign: "center" }}>
            <Button sx={styleModalMenuSelect} 
            //onClick={() => DeleteRec()}
            >
              Удалить отмеченные
            </Button>
          </Box>
        )} */}
        {/* {lookHistory && <h1>Ku-Ku</h1>} */}
        {/* {openSoobErr && (
          <GsErrorMessage setOpen={setOpenSoobErr} sErr={soobErr} />
        )} */}
      </Box>
    </Modal>
  );
};

export default GsLookHistory;
