//=== GsSetPhase =========================================
export const styleSetInf = {
  // position: 'relative',
  // marginTop: 4,
  // marginLeft: 'auto',
  // marginRight: 69,
  //======
  position: "absolute",
  left: "421px",
  top: "358px",
  transform: "translate(-50%, -50%)",
  //======
  width: 730,
  bgcolor: "background.paper",
  border: "1px solid #FFF",
  //borderColor: "primary.main",
  borderRadius: 1,
  boxShadow: 24,
  p: 1,
};

export const styleModalMenu = {
  marginTop: 0.5,
  marginRight: 1,
  maxHeight: "21px",
  minHeight: "21px",
  bgcolor: "#E6F5D6", // светло-салатовый
  border: "1px solid #000",
  borderColor: "#d4d4d4", // серый
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
  width: "495px",
  maxHeight: "4px",
  minHeight: "4px",
  bgcolor: "#FFFBE5",
  border: "1px solid #000",
  borderColor: "#d4d4d4", // серый
  borderRadius: 1,
  boxShadow: 4,
  textAlign: "center",
  p: 1,
};

export const styleBoxFormName = {
  "& > :not(style)": {
    marginTop: "-9px",
    marginLeft: "-8px",
    width: "510px",
  },
};

export const styleSaveBlack = {
  fontSize: 15,
  marginRight: 0.1,
  border: "1px solid #000",
  bgcolor: "#E6F5D6",
  width: "110px",
  maxHeight: "20px",
  minHeight: "20px",
  borderColor: "#d4d4d4", // серый
  borderRadius: 1,
  color: "black",
  textTransform: "unset !important",
  boxShadow: 2,
};

export const styleSaveRed = {
  fontSize: 12.9,
  marginRight: 0.1,
  border: "1px solid #000",
  bgcolor: "#BAE186", // тёмно-салатовый
  width: "110px",
  maxHeight: "20px",
  minHeight: "20px",
  borderColor: "#93D145",
  borderRadius: 1,
  color: "red",
  textTransform: "unset !important",
  boxShadow: 12,
};

export const styletFazaTitle = {
  color: "#5B1080",
  marginTop: -0.5,
  textAlign: "center",
  textShadow: "2px 2px 3px rgba(0,0,0,0.3)",
};

export const styletFaza01 = {
  marginTop: 0.5,
  bgcolor: "#F1F5FB", // светло серый
  border: "1px solid #d4d4d4",
  boxShadow: 6,
  borderRadius: 1,
};
//=== GsToDoMode =========================================
export const styleToDoMode = {
  position: "relative",
  marginTop: 0.1,
  marginLeft: "auto",
  marginRight: 1,
  width: "96%",
  bgcolor: "background.paper",
  border: "1px solid #FFF",
  borderRadius: 1,
  boxShadow: 24,
  p: 1.0,
};

export const styleStrokaTabl00 = {
  color: "#5B1080",
  fontSize: 18,
  textAlign: "center",
  textShadow: "2px 2px 3px rgba(0,0,0,0.3)",
};

export const styleStrokaTabl01 = {
  maxWidth: "33px",
  minWidth: "33px",
  maxHeight: "21px",
  minHeight: "21px",
  bgcolor: "#BAE186", // тёмно-салатовый
  border: "1px solid #000",
  borderColor: "#93D145",
  borderRadius: 1,
  color: "black",
  textTransform: "unset !important",
  boxShadow: 8,
};

export const styleStrokaTabl02 = {
  maxWidth: "33px",
  minWidth: "33px",
  maxHeight: "21px",
  minHeight: "21px",
  bgcolor: "#E6F5D6", // светло-салатовый
  border: "1px solid #000",
  borderColor: "#d4d4d4", // серый
  borderRadius: 1,
  color: "black",
  textTransform: "unset !important",
  boxShadow: 2,
};

export const styleStrokaTablImg01 = {
  maxWidth: "33px",
  minWidth: "33px",
  maxHeight: "45px",
  minHeight: "45px",
  bgcolor: "#BAE186", // тёмно-салатовый
  border: "1px solid #000",
  borderColor: "#93D145",
  borderRadius: 1,
  color: "black",
  textTransform: "unset !important",
  boxShadow: 12,
};
export const styleStrokaTablImg02 = {
  border: "1px solid #000",
  bgcolor: "#E6F5D6", // светло-салатовый
  maxWidth: "33px",
  minWidth: "33px",
  maxHeight: "45px",
  minHeight: "45px",
  borderColor: "#d4d4d4", // серый
  borderRadius: 1,
  color: "black",
  textTransform: "unset !important",
  boxShadow: 2,
};

export const styleStrokaTakt = {
  fontSize: 12,
  paddingTop: 1.7,
  textAlign: "right",
};

export const styleToDo01 = {
  fontSize: 12,
  paddingTop: 1.7,
  textAlign: "right",
};

export const styleToDo02 = {
  color: "blue",
  fontSize: 30,
  marginLeft: 1,
};

export const StyleSetFaza = (mesto: string) => {
  const styleSetFaza = {
    position: "relative",
    left: mesto,
    width: "12px",
    maxHeight: "3px",
    minHeight: "3px",
    bgcolor: "#FFFBE5", // молочный
    border: "1px solid #000",
    borderColor: "#d4d4d4", // серый
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
    maxHeight: "8px",
    minHeight: "8px",
    p: 1.5,
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
  width: 580,
  bgcolor: "background.paper",
  border: "1px solid #FFF",
  borderRadius: 1,
  boxShadow: 24,
  p: 1.5,
};

export const styleModalMenuSelect = {
  marginRight: 1,
  maxHeight: "21px",
  minHeight: "21px",
  bgcolor: "#E6F5D6", // светло-салатовый
  border: "1px solid #000",
  borderColor: "#d4d4d4", // серый
  borderRadius: 1,
  textTransform: "unset !important",
  color: "black",
  boxShadow: 4,
};

export const styletSelectTitle = {
  textShadow: "2px 2px 3px rgba(0,0,0,0.3)",
  color: "#5B1080",
  textAlign: "center",
};

export const styletSelect01 = {
  overflowX: "auto",
  height: "69vh",
  bgcolor: "#F1F5FB",
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
  //borderColor: "primary.main",
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
  border: "1px solid #000",
  borderColor: "#d4d4d4", // серый
  borderRadius: 1,
  color: "black",
  textTransform: "unset !important",
  boxShadow: 4,
};

export const styleGridLook = {
  border: 0,
  marginTop: 1,
  fontSize: 14,
  textAlign: "left",
};
//=== GsLookFaza =========================================
export const styleSetFaza = {
  outline: "none",
  position: "relative",
  marginTop: 8,
  marginLeft: 10,
  marginRight: "auto",
  width: 430,
  bgcolor: "background.paper",
  border: "1px solid #000",
  borderColor: "primary.main",
  borderRadius: 1,
  boxShadow: 24,
  p: 1.5,
};
//========================================================
