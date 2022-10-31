import * as React from "react";
//import { useDispatch, useSelector } from "react-redux";

import Box from "@mui/material/Box";
//import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";

import { styleModalEnd, styleSetInf } from "../MainMapStyle";

const GsMakeMode = (props: { setOpen: any }) => {
  const [openSetMode, setOpenSetMode] = React.useState(true);

  const handleCloseSetEnd = () => {
    props.setOpen(false);
    setOpenSetMode(false);
  };

  return (
    <Modal open={openSetMode} onClose={handleCloseSetEnd} hideBackdrop>
      <Box sx={styleSetInf}>
        <Button sx={styleModalEnd} onClick={handleCloseSetEnd}>
          <b>&#10006;</b>
        </Button>

        <Typography variant="h6" sx={{ textAlign: "center" }}>
          Создать режим
        </Typography>
      </Box>
    </Modal>
  );
};

export default GsMakeMode;
