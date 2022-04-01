import React, { useCallback } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import FormsTable from '../FormsTable/FormsTable';

const Alert = React.forwardRef((props, ref) => <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />);
function AddMasjidForm() {
  const [open, setOpen] = React.useState(false);

  const handleToast = useCallback(
    () => {
      setOpen(true);
    },
    [open],
  );

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={open}
        autoHideDuration={1500}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Masjid Was Add Successfully!
        </Alert>
      </Snackbar>
      <FormsTable
        handleToast={() => handleToast()}
        Label="Add Masjid"
        variant="new"
      />
    </>
  );
}

export default AddMasjidForm;
