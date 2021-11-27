import React, { useState } from 'react';
import './requestTable.css';
import 'react-simple-hook-modal/dist/styles.css';
import {
  Backdrop,
  Box,
  Container,
  Modal,
  Slide,
  Snackbar,
} from '@mui/material';
import { useFirestore } from 'react-redux-firebase';
import firebase from 'firebase/compat';
import MuiAlert from '@mui/material/Alert';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import FormsTable from '../FormsTable/FormsTable';

const Alert = React.forwardRef((props, ref) => (
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

function RequestTable(props) {
  const [open, setOpen] = React.useState(false);
  // eslint-disable-next-line react/prop-types,react/destructuring-assignment
  console.log(props.bodyData);
  const handleToast = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const [model, setModel] = useState(false);
  const Firestore = useFirestore();

  async function onDelete(item) {
    await Firestore.delete(`newMasjid/${item.id}`).then(() => {
      alert('Request deleted successfully');
    });
    await firebase.storage().refFromURL(item.pictureURL).delete();
    window.location.reload();
  }

  const column = [
    {
      field: 'name',
      headerName: 'Masjid Name',
      flex: 2,
    },
    {
      field: 'userName',
      headerName: 'User Name',
      flex: 1,
      valueGetter: params => params.row.user.name,
    },
    {
      field: 'userPhone',
      headerName: 'User Contact',
      flex: 1,
      valueGetter: params => params.row.user.phone,
    },
    {
      field: 'actions',
      headerName: 'Action',
      flex: 1,
      renderCell: params => (
        <Container>
          <button
            onClick={() => setModel(true)}
            className="buttonStyle"
            type="button"
          >
            View
          </button>
          <button
            onClick={onDelete}
            className="buttonStyle"
            style={{ backgroundColor: 'darkred', marginLeft: 15 }}
            type="button"
          >
            Delete
          </button>
          <Modal
            id="any-unique-identifier"
            open={model}
            onClose={() => setModel(false)}
            closeAfterTransition
            BackdropComponent={Backdrop}
          >
            <Slide in={model} direction="up" timeout={100}>
              <Box
                sx={{
                  position: 'absolute',
                  margin: 10,
                  bgcolor: 'background.paper',
                  borderRadius: '10px',
                  boxShadow: 24,
                  p: 4,
                }}
              >
                <FormsTable
                  masjidData={params.row}
                  handleToast={() => handleToast()}
                  preButton={{
                    onClick: () => setModel(false),
                    text: 'cancel',
                  }}
                  variant="request"
                />
              </Box>
            </Slide>
          </Modal>
        </Container>
      ),
    },
  ];

  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={open}
        autoHideDuration={1500}
        onClose={handleClose}
      >
        {props.isAddMasjid ? (
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{ width: '100%' }}
          >
            Masjid Add Successfully.
          </Alert>
        ) : (
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{ width: '100%' }}
          >
            Details were edited successfully!
          </Alert>
        )}
      </Snackbar>
      <DataGrid
        columns={column}
        rows={props.bodyData}
        pageSize={10}
        autoHeight
        components={{
          Toolbar: GridToolbar,
        }}
      />
    </div>
  );
}

// RequestTable.propTypes = {
//   bodyData: PropTypes.objectOf(
//
//   ).isRequired,
// };

export default RequestTable;
