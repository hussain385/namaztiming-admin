import React from 'react';
import { Modal, useModal } from 'react-simple-hook-modal';
import 'react-simple-hook-modal/dist/styles.css';
import { useFirestore } from 'react-redux-firebase';
import './table.css';
import _ from 'lodash';
import geohash from 'ngeohash';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import TimeRequest from './TimeRequest';
import FormsTable from '../FormsTable/FormsTable';
import { setToggle, setToggleWithData, useGuiReducer } from '../../redux/reducers/GuiReducer';

const Alert = React.forwardRef((props, ref) => <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />);

function RenderCusomerBody({ masjidData }) {
  // const { isModalOpen, openModal, closeModal } = useModal();
  // const [data, setData] = React.useState();
  const { toggle, extras } = useSelector(useGuiReducer);
  const dispatch = useDispatch();

  const column = [
    { field: 'name', headerName: 'Masjid Name', width: 400 },
    {
      field: 'address', headerName: 'Address', width: 400, flex: 1,
    },
    {
      field: 'actions',
      headerName: 'Action',
      width: 120,
      renderCell: (params) => (
        <button
          type="button"
          onClick={() => {
            console.log('clicked');
            dispatch(setToggleWithData({ toggle: true, data: { mList: params.row } }));
            // openModal();
            // setData(params.row);
          }}
            // variant={'contained'}
          className="buttonStyle"
        >
          View
        </button>
      ),
    },
  ];

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
      <Modal id="any-unique-identifier" isOpen={toggle}>
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
              {extras.mList?.requests.map((values, index) => (
                <TimeRequest
                  item={values}
                  index={index}
                  masjidId={extras.mList.id}
                  masjidName={extras.mList.name}
                />
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
            onClick={() => dispatch(setToggle(false))}
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
    {
      field: 'address', headerName: 'Address', width: 400, flex: 1,
    },
    {
      field: 'actions',
      headerName: 'Action',
      width: 120,
      renderCell: (params) => (
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
      ),
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

function Table({
  bodyData, isAddMasjid, edit, timeRequest, limit, renderBody,
}) {
  console.log(bodyData);
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
        {edit ? (
          <RenderBody masjidData={bodyData} handleToast={handleToast} />
        ) : (

          timeRequest ? (
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
          )

        )}
      </div>
    </div>
  );
}

export default Table;
