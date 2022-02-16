import React from 'react';
import { Modal, ModalTransition } from 'react-simple-hook-modal';
import './adminTable.css';
import 'react-simple-hook-modal/dist/styles.css';
import { useFirestore } from 'react-redux-firebase';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import {
  setToggle,
  setToggleWithData,
  useGuiReducer,
} from '../../redux/reducers/GuiReducer';
import Forms from '../Forms/Forms';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const AdminTable = props => {
  const [open, setOpen] = React.useState(false);
  const { toggle, extras } = useSelector(useGuiReducer);
  const dispatch = useDispatch();

  // const { isModalOpen, openModal, closeModal } = useModal();
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
      type: 'actions',
      flex: 1,
      getActions: params => [
        <button
          onClick={() =>
            dispatch(setToggleWithData({ toggle: true, data: params.row }))
          }
          className="buttonStyle"
        >
          View
        </button>,
        <button
          onClick={async () => {
            await firestore
              .delete('adminRequest/' + params.row.id)
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
        </button>,
      ],
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
        autoHeight={true}
        components={{
          Toolbar: GridToolbar,
        }}
      />
      <Modal
        isOpen={toggle}
        transition={ModalTransition.BOTTOM_UP}
        id={'anything'}
      >
        <Forms
          handleToast={() => handleToast()}
          closeModal={() => dispatch(setToggle(false))}
          item={extras}
        />
      </Modal>
    </div>
  );
};

export default AdminTable;
