import * as React from "react";
import { useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { AiTwotoneRightCircle } from "react-icons/ai";

import { OutputVertexImg } from "../MapServiceFunctions";

import { styleStrokaTabl04, styleStrokaTabl05 } from "./GsComponentsStyle";
import { styleStrTablImg01, styleStrTablImg02 } from "./GsComponentsStyle";
import { styleStrokaTabl06 } from "./GsComponentsStyle";

const GsFieldOfMiracles = (props: {
  //finish: boolean;
  idx: number;
  func: Function;
  ClVert: Function;
}) => {
  //== Piece of Redux =======================================
  const map = useSelector((state: any) => {
    const { mapReducer } = state;
    return mapReducer.map.dateMap;
  });
  let massfaz = useSelector((state: any) => {
    const { massfazReducer } = state;
    return massfazReducer.massfaz;
  });
  let datestat = useSelector((state: any) => {
    const { statsaveReducer } = state;
    return statsaveReducer.datestat;
  });
  //========================================================
  const debug = datestat.debug;
  const DEMO = datestat.demo;
  const IDX = props.idx;
  const ClickVertex = props.ClVert;
  const runREC = JSON.parse(JSON.stringify(massfaz[IDX].runRec));

  const intervalFazaDop = datestat.intervalFazaDop; // Увеличениение длительности фазы ДУ (сек)
  const [hintCounter, setHintCounter] = React.useState(false);
  const [hintVertex, setHintVertex] = React.useState(false);

  let intervalfaza = datestat.counterId[props.idx]; // Задаваемая длительность фазы ДУ (сек)

  let bull = runREC === 2 || runREC === 4 ? " •" : " ";
  let hostt =
    window.location.origin.slice(0, 22) === "https://localhost:3000"
      ? "https://localhost:3000/"
      : "./";
  let host = hostt + "18.svg";
  if (DEMO && debug) {
    host = hostt + "1.svg";
    if (bull === " •") host = hostt + "2.svg";
    if (bull !== " •") host = hostt + "1.svg";
  }
  if (!debug) {
    let num = map.tflight[massfaz[IDX].idx].tlsost.num.toString();
    if (DEMO) {
      num = "1";
      if (bull === " •" && runREC === 2) num = "2";
      if (bull === " •" && runREC === 4) num = "2";
    }
    host = window.location.origin + "/free/img/trafficLights/" + num + ".svg";
  }

  let illumImg =
    runREC === 4 || runREC === 2 ? styleStrTablImg01 : styleStrTablImg02;
  let hinter = map.tflight[massfaz[IDX].idx].tlsost.description;
  let finish = runREC === 4 || runREC === 2 ? true : false;

  return (
    <>
      <Grid item xs={1.8} sx={styleStrokaTabl06}>
        {finish && massfaz[props.idx].fazaSist && intervalfaza > 0 && (
          <Grid
            container
            sx={{ cursor: "pointer" }}
            onClick={() => props.func(props.idx)}
            onMouseEnter={() => setHintCounter(true)}
            onMouseLeave={() => setHintCounter(false)}
          >
            <Grid item xs={7} sx={{ textAlign: "right" }}>
              {intervalFazaDop > 0 && (
                <>
                  <Box sx={{ fontSize: 21 }}>
                    <AiTwotoneRightCircle />
                  </Box>
                  {hintCounter && (
                    <Box sx={styleStrokaTabl05}>
                      Увеличить на {intervalFazaDop}сек
                    </Box>
                  )}
                </>
              )}
            </Grid>
            <Grid item xs sx={{ padding: "4px 0 0 0", textAlign: "center" }}>
              {intervalfaza}
            </Grid>
          </Grid>
        )}
      </Grid>
      <Grid item xs={1.0} sx={{ cursor: "pointer" }}>
        <Grid
          container
          onMouseEnter={() => setHintVertex(true)}
          onMouseLeave={() => setHintVertex(false)}
        >
          {!datestat.toDoMode || massfaz[IDX].fazaSist < 0 || !finish ? (
            <>{OutputVertexImg(host)}</>
          ) : (
            <Button sx={illumImg} onClick={() => ClickVertex(IDX)}>
              {OutputVertexImg(host)}
            </Button>
          )}
          {hintVertex && <Box sx={styleStrokaTabl04}>{hinter}</Box>}
        </Grid>
      </Grid>
    </>
  );
};

export default GsFieldOfMiracles;
