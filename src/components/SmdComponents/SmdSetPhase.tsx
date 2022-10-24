import * as React from "react";
import { useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";

import { styleModalEnd } from "./../MainMapStyle";

let newInput = true;
let massFaz: any = [];
let colorRec = "black";
let knop = "удалить";
//let fSize = 15;
//let chDel = 0;

const SmdSetPhase = (props: {
  setOpen: any;
  massMem: Array<number>;
  func: any;
}) => {
  //== Piece of Redux =======================================
  const map = useSelector((state: any) => {
    const { mapReducer } = state;
    return mapReducer.map.dateMap;
  });
  //===========================================================
  const styleSetInf = {
    position: "relative",
    marginTop: 5.5,
    marginLeft: "auto",
    marginRight: 30,
    width: 777,
    bgcolor: "background.paper",
    border: "3px solid #000",
    borderColor: "primary.main",
    borderRadius: 2,
    boxShadow: 24,
    p: 1.5,
  };

  const styleSave = {
    fontSize: 14,
    marginRight: 0.1,
    border: "2px solid #000",
    bgcolor: "#E6F5D6",
    minWidth: "110px",
    maxWidth: "110px",
    maxHeight: "20px",
    minHeight: "20px",
    borderColor: "#E6F5D6",
    borderRadius: 2,
    color: "black",
    textTransform: "unset !important",
  };

  const styleModalMenu = {
    marginTop: 0.5,
    marginRight: 1,
    backgroundColor: "#E6F5D6",
    textTransform: "unset !important",
    color: "black",
  };

  const styleSetFaza = {
    position: "relative",
    left: "37%",
    width: "12px",
    maxHeight: "3px",
    minHeight: "3px",
    bgcolor: "#FFFBE5",
    boxShadow: 3,
    p: 1.5,
  };

  const styleBoxFormFaza = {
    "& > :not(style)": {
      marginTop: "-10px",
      marginLeft: "-12px",
      width: "36px",
    },
  };

  const styleSet = {
    width: "563px",
    maxHeight: "4px",
    minHeight: "4px",
    bgcolor: "#FFFBE5",
    boxShadow: 3,
    textAlign: "center",
    p: 1,
  };

  const [openSetMode, setOpenSetMode] = React.useState(true);
  const [trigger, setTrigger] = React.useState(true);
  const [chDel, setChDel] = React.useState(0);

  if (newInput) {
    massFaz = [];
    for (let i = 0; i < props.massMem.length; i++) {
      let maskFaz = {
        idx: 0,
        faza: 1,
        name: "",
        delRec: false,
      };
      maskFaz.idx = props.massMem[i];
      maskFaz.name = map.tflight[maskFaz.idx].description;
      massFaz.push(maskFaz);
    }
    newInput = false;
    setChDel(0);
    console.log("massFaz:", massFaz);
  }

  const handleCloseSetEnd = () => {
    props.setOpen(false);
    setOpenSetMode(false);
    newInput = true;
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
    console.log("111:", massFaz);
    //setTrigger(!trigger);
  };

  const SaveRec = () => {
    if (chDel) DelRec();
    props.func(massFaz);
    handleCloseSetEnd();
  };

  const handleKey = (event: any) => {
    if (event.key === "Enter") event.preventDefault();
  };

  const InputFaza = (mode: number) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setCurrency(Number(event.target.value));
      massFaz[mode].faza = massDat[Number(event.target.value)];
    };

    let dat = [1, 2, 3];
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

    const [currency, setCurrency] = React.useState(0);

    return (
      <Box sx={styleSetFaza}>
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
        fSize = 13.5;
        colorRec = "red";
      }
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
  };

  const [valuen, setValuen] = React.useState(
    "Новое ЗУ " +
      new Date().toLocaleDateString() +
      " " +
      new Date().toLocaleTimeString().slice(0, -3)
  );

  const styleBoxForm = {
    "& > :not(style)": {
      marginTop: "-9px",
      marginLeft: "-8px",
      width: "580px",
    },
  };

  return (
    <Modal open={openSetMode} onClose={handleCloseSetEnd} hideBackdrop>
      <Box sx={styleSetInf}>
        <Button sx={styleModalEnd} onClick={handleCloseSetEnd}>
          <b>&#10006;</b>
        </Button>

        <Grid container sx={{ marginTop: 1 }}>
          <Grid item xs={3} sx={{ border: 0, textAlign: "center" }}>
            <b>Название нового ЗУ:</b>
          </Grid>
          <Grid item xs sx={{ border: 0, textAlign: "center" }}>
            <Box sx={styleSet}>
              <Box component="form" sx={styleBoxForm}>
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
            {/* {chDel > 0 && (
              <Button sx={styleModalMenu} onClick={() => DelRec()}>
                Удалить помеченные
              </Button>
            )} */}
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
