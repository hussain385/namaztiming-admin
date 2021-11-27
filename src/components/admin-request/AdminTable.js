import React from 'react';
import { Modal, ModalTransition, useModal } from 'react-simple-hook-modal';
import './adminTable.css';
import 'react-simple-hook-modal/dist/styles.css';
import { useFirestore } from 'react-redux-firebase';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Container } from '@mui/material';
import Forms from '../Forms/Forms';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function AdminTable(props) {
  const [open, setOpen] = React.useState(false);
  const { isModalOpen, openModal, closeModal } = useModal();
  const firestore = useFirestore();
  const column = [
    {
      field: 'masjid.name',
      headerName: 'Masjid Name',
      flex: 2,
      valueGetter: params => {
        return params.row.masjid.name;
      },
    },
    { field: 'userName', headerName: 'User Name', flex: 1 },
    { field: 'userPhone', headerName: 'User Contact', flex: 1 },
    {
      field: 'actions',
      headerName: 'Action',
      flex: 1,
      renderCell: params => {
        return (
          <Container>
            <button onClick={openModal} className="buttonStyle">
              View
            </button>
            <button
              onClick={async () => {
                await firestore
                  .delete(`adminRequest/${params.row.id}`)
                  .then(() => {
                    alert('Request deleted successfully');
                    window.location.reload();
                  })
                  .catch(e => {
                    console.log(e);
                  });
              }}
              className="buttonStyle"
              style={{ backgroundColor: 'darkred', marginLeft: 15 }}
            >
              Delete
            </button>
            <Modal
              id="any-unique-identifier"
              isOpen={isModalOpen}
              transition={ModalTransition.BOTTOM_UP}
            >
              <Forms
                handleToast={() => handleToast()}
                closeModal={() => closeModal()}
                item={params.row}
              />
            </Modal>
          </Container>
        );
      },
    },
  ];

  const handleToast = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={open}
        autoHideDuration={1500}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Email was send successfully!
        </Alert>
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

export default AdminTable;
