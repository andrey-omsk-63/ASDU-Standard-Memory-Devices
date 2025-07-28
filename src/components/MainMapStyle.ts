export const styleServisTable = {
  outline: "none",
  position: "relative",
  marginTop: "-96.9vh",
  marginLeft: "auto",
  marginRight: "2px",
  width: "440px",
};

export const searchControl = {
  float: "left",
  provider: "yandex#search",
  size: "large",
};

export const styleInfoSoob = {
  fontSize: 14,
  marginRight: 0.1,
  width: 530,
  maxHeight: "21px",
  minHeight: "21px",
  backgroundColor: "#E9F5D8",
  color: "#E6761B",
  textTransform: "unset !important",
  p: 1.5,
};

export const styleModalEnd = {
  position: "absolute",
  top: "0%",
  left: "auto",
  right: "-0%",
  height: "21px",
  maxWidth: "2%",
  minWidth: "2%",
  color: "#7620a2", // сиреневый
  textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
};

export const styleSetInf = {
  position: "absolute",
  marginTop: "15vh",
  marginLeft: "24vh",
  width: 380,
  bgcolor: "background.paper",
  border: "1px solid #fff",
  borderRadius: 1,
  boxShadow: 24,
  p: 1.5, 
};
//=====================================================================
export const styleSetPK01 = (wdth: number, hdth: number) => {
  const styleSetPK01 = {
    outline: "none",
    position: "absolute",
    left: "50%",
    top: "45%",
    transform: "translate(-50%, -50%)",
    width: wdth,
    height: hdth,
    bgcolor: "background.paper",
    border: "1px solid #FFFFFF",
    borderRadius: 1,
    boxShadow: 24,
    textAlign: "center",
    padding: "1px 10px 10px 10px",
    cursor: "default",
  };

  const styleSetPK02 = {
    outline: "none",
    position: "absolute",
    left: "50%",
    top: "45%",
    transform: "translate(-50%, -50%)",
    width: wdth,
    bgcolor: "background.paper",
    border: "1px solid #FFFFFF",
    borderRadius: 1,
    boxShadow: 24,
    textAlign: "center",
    padding: "1px 10px 10px 10px",
    cursor: "default",
  };
  return hdth ? styleSetPK01 : styleSetPK02;
};

export const styleSetPK02 = {
  fontSize: 20,
  textAlign: "center",
  color: "#5B1080", // сиреневый
  margin: "15px 0 10px 0",
  textShadow: "2px 2px 3px rgba(0,0,0,0.3)",
};

export const styleSetPK03 = {
  fontSize: 15,
  textAlign: "left",
  background: "linear-gradient(180deg, #F1F5FB 59%, #DEE8F5 )",
  border: "1px solid #d4d4d4",
  borderRadius: 1,
  color: "black",
  boxShadow: 3,
  margin: "3px 0 1px 0",
  padding: "12px 5px 20px 5px",
  textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
};

export const styleSetPK04 = {
  marginTop: 1.2,
  display: "flex",
  justifyContent: "center",
};

export const styleSetPK05 = {
  overflowX: "auto",
  minHeight: "1vh",
  maxHeight: "69vh",
  width: 321,
  textAlign: "left",
  background: "linear-gradient(180deg, #F1F5FB 59%, #DEE8F5 )",
  border: "1px solid #d4d4d4",
  borderRadius: 1,
  color: "black",
  boxShadow: 3,
  margin: "3px 0 1px 0",
  padding: "4px 5px 14px 5px",
  textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
};

export const styleSetPK06 = {
  fontSize: 15.0,
  marginTop: 1,
  bgcolor: "#E6F5D6",
  width: 315,
  maxHeight: "24px",
  minHeight: "24px",
  border: "1px solid #d4d4d4", // серый
  borderRadius: 1,
  color: "black",
  textTransform: "unset !important",
  boxShadow: 4,
};
