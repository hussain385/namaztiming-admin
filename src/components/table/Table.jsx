import React from 'react';
import { Modal, useModal } from 'react-simple-hook-modal';
import 'react-simple-hook-modal/dist/styles.css';
import { useFirestore } from 'react-redux-firebase';
import './table.css';
import _ from 'lodash';
import geohash from 'ngeohash';
import firebase from 'firebase/compat';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import PropTypes from 'prop-types';
import TimeRequest from './TimeRequest';
import FormsTable from '../FormsTable/FormsTable';
import { MasjidSchema } from '../../services/validation';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function RenderCusomerBody({ masjidData, index }) {
  const { isModalOpen, openModal, closeModal } = useModal();
  const [data, setData] = React.useState();

  const column = [
    { field: 'name', headerName: 'Masjid Name', width: 400 },
    { field: 'address', headerName: 'Address', width: 400, flex: 1 },
    {
      field: 'actions',
      headerName: 'Action',
      width: 120,
      renderCell: params => {
        return (
          <button
            onClick={() => {
              console.log('clicked');
              openModal();
              setData(params.row);
            }}
            // variant={'contained'}
            className="buttonStyle"
          >
            View
          </button>
        );
      },
    },
  ];

  return (
    <>
      {/* <tr key={index}> */}
      {/*  <td>{index + 1}</td> */}
      {/*  <td>{item.name}</td> */}
      {/*  <td>{item.address}</td> */}
      {/*  <td> */}
      {/*    <button onClick={openModal} className="buttonStyle"> */}
      {/*      View */}
      {/*    </button> */}
      {/*  </td> */}
      {/* </tr> */}
      <DataGrid
        columns={column}
        rows={masjidData}
        pageSize={10}
        autoHeight
        components={{
          Toolbar: GridToolbar,
        }}
      />
      <Modal id="any-unique-identifier" isOpen={isModalOpen}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>User Name</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {data?.requests.map((values, index) => (
                <TimeRequest item={values} index={index} masjidId={data.id} />
              ))}
            </tbody>
          </table>
        </div>

        <div
          style={{
            display: 'flex',
            marginTop: 20,
            justifyContent: 'flex-end',
          }}
        >
          <button
            style={{
              width: 70,
              color: 'white',
              borderRadius: 7,
              height: 30,
              marginRight: 20,
              backgroundColor: 'darkred',
            }}
            onClick={closeModal}
          >
            Close
          </button>
        </div>
      </Modal>
    </>
  );
}

function RenderBody({ handleToast, masjidData }) {
  const { isModalOpen, openModal, closeModal } = useModal();
  const Firestore = useFirestore();
  const [data, setData] = React.useState(null);

  const column = [
    { field: 'id', hide: true },
    { field: 'name', headerName: 'Masjid Name', width: 400 },
    { field: 'address', headerName: 'Address', width: 400, flex: 1 },
    {
      field: 'actions',
      headerName: 'Action',
      width: 120,
      renderCell: params => {
        return (
          <button
            onClick={() => {
              console.log('clicked');
              openModal();
              setData(params.row);
            }}
            // variant={'contained'}
            type="button"
            className="buttonStyle"
          >
            View
          </button>
        );
      },
    },
  ];

  function onSubmit(values) {
    const data1 = _.omit(values, ['latitude', 'longitude']);
    Firestore.update(`Masjid/${data1.id}`, {
      ...data1,
      g: {
        geopoint: new Firestore.GeoPoint(values.latitude, values.longitude),
        geohash: geohash.encode(values.latitude, values.longitude, 9),
      },
    }).then(() => closeModal());
  }

  return (
    <>
      <DataGrid
        columns={column}
        rows={masjidData}
        pageSize={10}
        autoHeight
        components={{
          Toolbar: GridToolbar,
        }}
      />
      <Modal id="any-unique-identifier" isOpen={isModalOpen}>
        <FormsTable
          masjidData={data}
          handleToast={() => handleToast()}
          preButton={{ onClick: closeModal, text: 'Close' }}
          onSubmit={onSubmit}
          Label="Save Changes"
          variant="edit"
        />
      </Modal>
    </>
  );
}

RenderBody.propTypes = {
  handleToast: PropTypes.func.isRequired,
  masjidData: PropTypes.arrayOf(MasjidSchema).isRequired,
};
function Table({
  edit,
  bodyData,
  isAddMasjid,
  limit,
  renderBody,
  timeRequest,
}) {
  console.log(bodyData);
  const { isModalOpen, openModal, closeModal } = useModal();
  const [open, setOpen] = React.useState(false);

  const handleToast = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  if (edit) {
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
              Details were saved successfully!
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
        <div>
          <RenderBody masjidData={bodyData} handleToast={handleToast} />
        </div>
      </div>
    );
  }
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
            Details were saved successfully!
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
      <div>
        {timeRequest ? (
          <RenderCusomerBody
            masjidData={bodyData}
            handleToast={() => handleToast()}
          />
        ) : (
          <>
            {(limit && bodyData
              ? bodyData.slice(0, Number(limit))
              : bodyData
            ).map((item, index) => renderBody(item, index))}
          </>
        )}
      </div>
    </div>
  );
}

Table.propTypes = {
  edit: PropTypes.bool,
  bodyData: PropTypes.arrayOf(MasjidSchema).isRequired,
  renderBody: PropTypes.func,
  isAddMasjid: PropTypes.bool,
  limit: PropTypes.number,
  timeRequest: PropTypes.bool,
};

Table.defaultProps = {
  edit: false,
  isAddMasjid: false,
  limit: 0,
  renderBody: null,
  timeRequest: false,
};

export default Table;
