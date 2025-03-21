import * as React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";

const GsErrorMessage = (props: { sErr: string; setOpen: any }) => {
  const [openSet, setOpenSet] = React.useState(true);

  let coler = props.sErr.slice(0, 3) === "⚠️П" ? "#fff6d2" : "#ffe16e"; // светло-жёлтый/жёлтый

  const styleSetInf = {
    outline: "none",
    position: "absolute",
    marginTop: "15vh",
    marginLeft: "24vh",
    width: 380,
    bgcolor: coler,
    border: "1px solid #FFEDA6", // блендно-жёлтый
    borderRadius: 1,
    color: "black",
    boxShadow: 24,
    textShadow: "2px 2px 3px rgba(0,0,0,0.3)",
    p: 1.5,
  };

  const styleModalEnd = {
    position: "absolute",
    top: "0%",
    left: "auto",
    right: "-0%",
    height: "21px",
    maxWidth: "2%",
    minWidth: "2%",
    color: "black",
  };

  const handleClose = () => {
    props.setOpen(false);
    setOpenSet(false);
  };

  return (
    <Modal open={openSet} onClose={handleClose} hideBackdrop={false}>
      <Box sx={styleSetInf}>
        <Button sx={styleModalEnd} onClick={handleClose}>
          <b>&#10006;</b>
        </Button>
        <Typography variant="h6" sx={{ textAlign: "center" }}>
          {props.sErr}
        </Typography>
      </Box>
    </Modal>
  );
};

export default GsErrorMessage;
