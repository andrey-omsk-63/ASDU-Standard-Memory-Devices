//=== GsSetPhase =========================================
export const styleSetInf = {
  position: "absolute",
  left: "46px",
  top: "27px",
  outline: "none",
  width: 550,
  bgcolor: "background.paper",
  border: "1px solid #FFF",
  borderRadius: 1,
  boxShadow: 24,
  p: 1,
};

export const styleModalMenu = {
  marginTop: 0.5,
  marginRight: 1,
  maxHeight: "21px",
  minHeight: "21px",
  padding: "2px 8px 0px 8px",
  bgcolor: "#E6F5D6", // светло-салатовый
  border: "1px solid #d4d4d4", // серый
  borderRadius: 1,
  textTransform: "unset !important",
  color: "black",
  boxShadow: 4,
};

export const styleBoxFormFaza = {
  "& > :not(style)": {
    marginTop: "-10px",
    marginLeft: "-12px",
    width: "36px",
  },
};

export const styleSet = {
  width: "344px",
  maxHeight: "4px",
  minHeight: "4px",
  bgcolor: "#FFFBE5",
  border: "1px solid #d4d4d4", // серый
  borderRadius: 1,
  boxShadow: 4,
  textAlign: "center",
  p: 1,
};

export const styleBoxFormName = {
  "& > :not(style)": {
    marginTop: "-9px",
    marginLeft: "-8px",
    //width: "510px",
    width: "373px",
  },
};

export const styleSaveBlack = {
  fontSize: 13.5,
  marginRight: 0.1,
  bgcolor: "#E6F5D6",
  width: "110px",
  maxHeight: "22px",
  minHeight: "22px",
  border: "1px solid #d4d4d4", // серый
  borderRadius: 1,
  color: "black",
  textTransform: "unset !important",
  boxShadow: 2,
};

export const styleSaveRed = {
  fontSize: 12.9,
  marginRight: 0.1,
  bgcolor: "#BAE186", // тёмно-салатовый
  width: "110px",
  maxHeight: "22px",
  minHeight: "22px",
  border: "1px solid #93D145", // тёмно-салатовый
  borderRadius: 1,
  color: "red",
  textTransform: "unset !important",
  boxShadow: 12,
};

export const styletFaza01 = {
  marginTop: 0.5,
  background: "linear-gradient(180deg, #F1F5FB 59%, #DEE8F5 )",
  border: "1px solid #d4d4d4",
  boxShadow: 6,
  borderRadius: 1,
};

export const styletFaza02 = {
  fontSize: 14,
  color: "#7620a2",
  textShadow: "2px 2px 3px rgba(0,0,0,0.3)",
};
//=== GsToDoMode =========================================
export const styleToDoMode = {
  bgcolor: "background.paper",
  border: "1px solid #fff",
  borderRadius: 1,
  boxShadow: 24,
  padding: "2px 9px 10px 10px",
};

export const styleStrokaTabl00 = {
  color: "#5B1080", // сиреневый
  fontSize: 18,
  textAlign: "center",
  textShadow: "2px 2px 3px rgba(0,0,0,0.3)",
};

export const styleStrokaTabl10 = {
  background: "linear-gradient(180deg, #F1F5FB 59%, #DEE8F5 )",
  border: "1px solid #d4d4d4",
  borderRadius: 1,
  boxShadow: 6,
};

export const styleStrokaTabl01 = {
  maxWidth: "44px",
  minWidth: "1px",
  maxHeight: "21px",
  minHeight: "21px",
  padding: "2px 8px 0px 8px",
  bgcolor: "#82E94A", // ярко-салатовый
  //bgcolor: "#BAE186", // салатовый
  border: "1px solid #d4d4d4", // серый
  borderRadius: 1,
  color: "black",
  textTransform: "unset !important",
  boxShadow: 8,
};

export const styleStrokaTabl02 = {
  maxWidth: "44px",
  minWidth: "1px",
  maxHeight: "21px",
  minHeight: "21px",
  padding: "2px 8px 0px 8px",
  bgcolor: "#E6F5D6", // светло-салатовый
  border: "1px solid #d4d4d4", // серый
  borderRadius: 1,
  color: "black",
  textTransform: "unset !important",
  boxShadow: 2,
};

export const styleStrokaTabl03 = {
  marginTop: 1,
  textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
};

export const styleStrTablImg01 = {
  maxWidth: "33px",
  minWidth: "33px",
  maxHeight: "45px",
  minHeight: "45px",
  bgcolor: "#E6F5D6", // светло-салатовый
  border: "1px solid #d4d4d4", // серый
  borderRadius: 1,
  color: "black",
  textTransform: "unset !important",
  boxShadow: 1,
};

export const styleStrTablImg02 = {
  maxWidth: "33px",
  minWidth: "33px",
  maxHeight: "45px",
  minHeight: "45px",
  bgcolor: "#d0f0c0", // зелёный чай
  border: "1px solid #d4d4d4", // серый
  borderRadius: 1,
  color: "black",
  textTransform: "unset !important",
  boxShadow: 15,
};

export const styleStrokaTakt = {
  fontSize: 12,
  paddingTop: 1.7,
  textAlign: "right",
};

export const styleToDo01 = {
  fontSize: 14.0,
  paddingTop: 1.7,
  textAlign: "right",
  color: "#5B1080", // сиреневый
  textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
  fontWeight: 500,
};

export const styleToDo02 = {
  fontSize: 30,
  color: "#7620A2", // тёмно-сереневый
  marginLeft: 1,
  marginTop: "-2px",
  textShadow: "2px 2px 3px rgba(0,0,0,0.3)",
};

export const StyleSetFaza = (mesto: string) => {
  const styleSetFaza = {
    position: "relative",
    left: mesto,
    width: "12px",
    maxHeight: "3px",
    minHeight: "3px",
    bgcolor: "#FFFBE5", // молочный
    border: "1px solid #d4d4d4", // серый
    borderRadius: 1,
    boxShadow: 4,
    p: 1.5,
  };
  return styleSetFaza;
};

export const StyleSetFazaNull = (mesto: string) => {
  const styleSetFazaNull = {
    position: "relative",
    left: mesto,
    width: "12px",
    maxHeight: "36px",
    minHeight: "36px",
  };
  return styleSetFazaNull;
};
//=== GsSelectMD =========================================
export const styleSetSelect = {
  outline: "none",
  position: "relative",
  marginTop: 4,
  marginLeft: 6,
  marginRight: "auto",
  //======
  // position: 'absolute',
  // left: '23%',
  // top: '43%',
  // transform: 'translate(-50%, -50%)',
  //======
  width: 550,
  height: "601px",
  bgcolor: "background.paper",
  border: "1px solid #FFF",
  borderRadius: 1,
  boxShadow: 24,
  p: 1.5,
};

export const styleModalMenuSelect = {
  fontSize: 13.5,
  marginRight: 1,
  height: "24px",
  bgcolor: "#E6F5D6", // светло-салатовый
  border: "1px solid #d4d4d4", // серый
  borderRadius: 1,
  textTransform: "unset !important",
  color: "black",
  padding: "2px 8px 0px 8px",
  boxShadow: 4,
};

export const styletSelectTitle = {
  fontSize: 16,
  textAlign: "center",
  color: "#7620a2", // сиреневый
  textShadow: "2px 2px 3px rgba(0,0,0,0.3)",
  //display: "inline-block",
};

export const styletSelect01 = {
  overflowX: "auto",
  marginTop: 1,
  //height: "358px",
  height: "540px",
  //top: "358px",
  background: "linear-gradient(180deg, #F1F5FB 59%, #DEE8F5 )",
  border: "1px solid #d4d4d4",
  borderRadius: 1,
  boxShadow: 6,
};
//=== GsLookHistory ======================================
export const styleSetHist = {
  outline: "none",
  position: "relative",
  marginTop: 6,
  marginLeft: 8,
  marginRight: "auto",
  width: 430,
  bgcolor: "background.paper",
  border: "1px solid #d4d4d4",
  borderRadius: 1,
  boxShadow: 24,
  p: 1.5,
};

export const styleButLook = {
  fontSize: 13.4,
  marginTop: 1,
  bgcolor: "#E6F5D6",
  width: "150px",
  maxHeight: "20px",
  minHeight: "20px",
  border: "1px solid #d4d4d4", // серый
  borderRadius: 1,
  color: "black",
  textTransform: "unset !important",
  boxShadow: 4,
};

export const styleGridLook = {
  border: 0,
  marginTop: 1,
  marginLeft: 0.5,
  fontSize: 14,
  textAlign: "left",
};
//=== GsLookFaza =========================================
export const styleSetFazaLook = {
  outline: "none",
  position: "relative",
  marginTop: 8,
  marginLeft: 10,
  marginRight: "auto",
  width: 430,
  bgcolor: "background.paper",
  border: "1px solid #fff",
  borderRadius: 1,
  boxShadow: 24,
  p: 1.5,
};

export const styleFazaLook01 = {
  color: "#5B1080",
  fontSize: 18,
  textAlign: "center",
  textShadow: "2px 2px 3px rgba(0,0,0,0.3)",
};

export const styleFazaLook02 = {
  overflowX: "auto",
  background: "linear-gradient(180deg, #F1F5FB 59%, #DEE8F5 )",
  border: "1px solid #d4d4d4",
  borderRadius: 1,
  boxShadow: 6,
};
//========================================================
