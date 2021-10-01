import React from "react";
import FormsTable from "../FormsTable/FormsTable";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const AddMasjidForm = () => {
  const [open, setOpen] = React.useState(false);

  const handleToast = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={open}
        autoHideDuration={1500}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Masjid Was Add Successfully!
        </Alert>
      </Snackbar>
      <FormsTable handleToast={() => handleToast()} Label="Add Masjid" variant={"new"} />
    </>
  );
};

export default AddMasjidForm;
