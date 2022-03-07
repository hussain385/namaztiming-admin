import React, { useState } from 'react';
import './requestTable.css';
import 'react-simple-hook-modal/dist/styles.css';
import {
  Backdrop, Box, Container, Modal, Slide, Snackbar,
} from '@mui/material';
import { firestoreConnect, useFirebase, useFirestore } from 'react-redux-firebase';
import MuiAlert from '@mui/material/Alert';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { compose } from 'redux';
import { connect } from 'react-redux';
import FormsTable from '../FormsTable/FormsTable';

const Alert = React.forwardRef((props, ref) => <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />);

function TableModal({ params, Firestore, handleToast }) {
  const firebase = useFirebase();

  async function onDelete(item) {
    console.log(item, 'on delete');
    await Firestore.delete(`newMasjid/${item.id}`).then(() => {
      alert('Request deleted successfully');
    });
    await firebase.storage().refFromURL(item.pictureURL).delete();
    // window.location.reload();
  }

  const [model, setModel] = useState(false);
  return (
    <Container>
      <button onClick={() => setModel(true)} className="buttonStyle">
        View
      </button>
      <button
        onClick={() => onDelete(params.row)}
        className="buttonStyle"
        style={{ backgroundColor: 'darkred', marginLeft: 15 }}
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
                text: 'Cancel',
              }}
              variant="request"
            />
          </Box>
        </Slide>
      </Modal>
    </Container>
  );
}

function RequestTable(props) {
  const [open, setOpen] = React.useState(false);
  const { bodyData, isAddMasjid } = props;
  console.log(bodyData);
  const handleToast = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  const Firestore = useFirestore();

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
      valueGetter: (params) => params.row.user.name,
    },
    {
      field: 'userPhone',
      headerName: 'User Contact',
      flex: 1,
      valueGetter: (params) => params.row.user.phone,
    },
    {
      field: 'actions',
      headerName: 'Action',
      flex: 1,
      renderCell: (params) => (
        <TableModal Firestore={Firestore} params={params} handleToast={handleToast} />
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
        {isAddMasjid ? (
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
        rows={bodyData || []}
        pageSize={10}
        autoHeight
        components={{
          Toolbar: GridToolbar,
        }}
      />
      {/* <div className="table-wrapper"> */}
      {/*  <table> */}
      {/*    {props.headData && props.renderHead ? ( */}
      {/*      <thead> */}
      {/*        <tr> */}
      {/*          {props.headData.map((item, index) => */}
      {/*            props.renderHead(item, index), */}
      {/*          )} */}
      {/*        </tr> */}
      {/*      </thead> */}
      {/*    ) : null} */}
      {/*    {props.bodyData && props.renderBody ? ( */}
      {/*      <tbody> */}
      {/*        {dataShow.map((item, index) => ( */}
      {/*          <MyComponent */}
      {/*            handleToast={() => handleToast()} */}
      {/*            index={index} */}
      {/*            item={item} */}
      {/*            key={index} */}
      {/*          /> */}
      {/*        ))} */}
      {/*      </tbody> */}
      {/*    ) : null} */}
      {/*  </table> */}
      {/* </div> */}
      {/* {pages > 1 ? ( */}
      {/*  <div className="table__pagination"> */}
      {/*    {range.map((item, index) => ( */}
      {/*      <div */}
      {/*        key={index} */}
      {/*        className={`table__pagination-item ${ */}
      {/*          currPage === index ? 'active' : '' */}
      {/*        }`} */}
      {/*        onClick={() => selectPage(index)} */}
      {/*      > */}
      {/*        {item + 1} */}
      {/*      </div> */}
      {/*    ))} */}
      {/*  </div> */}
      {/* ) : null} */}
    </div>
  );
}

export default compose(
  firestoreConnect(() => ['newMasjid']),
  connect(({ firestore: { ordered } }) => ({
    bodyData: ordered.newMasjid,
  })),
)(RequestTable);
