import React from 'react';
import { Modal, useModal } from 'react-simple-hook-modal';
import 'react-simple-hook-modal/dist/styles.css';
import { useFirestore } from 'react-redux-firebase';
import './table.css';
import FormsTable from '../FormsTable/FormsTable';
import _ from 'lodash';
import geohash from 'ngeohash';
import firebase from 'firebase/compat';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import TimeRequest from './TimeRequest';
import { DataGrid } from '@mui/x-data-grid';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const RenderCusomerBody = ({ masjidData, index }) => {
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
            className={'buttonStyle'}
          >
            View
          </button>
        );
      },
    },
  ];

  return (
    <>
      {/*<tr key={index}>*/}
      {/*  <td>{index + 1}</td>*/}
      {/*  <td>{item.name}</td>*/}
      {/*  <td>{item.address}</td>*/}
      {/*  <td>*/}
      {/*    <button onClick={openModal} className="buttonStyle">*/}
      {/*      View*/}
      {/*    </button>*/}
      {/*  </td>*/}
      {/*</tr>*/}
      <DataGrid
        columns={column}
        rows={masjidData}
        pageSize={10}
        autoHeight={true}
      />
      <Modal id="any-unique-identifier" isOpen={isModalOpen}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>User Name</th>
                <th>{''}</th>
              </tr>
            </thead>
            <tbody>
              <>
                {data?.requests.map((values, index) => (
                  <TimeRequest item={values} index={index} masjidId={data.id} />
                ))}
              </>
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
};

const RenderBody = ({ handleToast, masjidData, index }) => {
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
            className={'buttonStyle'}
          >
            View
          </button>
        );
      },
    },
  ];

  function onSubmit(values) {
    const data = _.omit(values, ['latitude', 'longitude']);
    Firestore.update('Masjid/' + data.id, {
      ...data,
      g: {
        geopoint: new Firestore.GeoPoint(values.latitude, values.longitude),
        geohash: geohash.encode(values.latitude, values.longitude, 9),
      },
    }).then(value => closeModal());
  }

  return (
    <>
      <DataGrid
        columns={column}
        rows={masjidData}
        pageSize={10}
        autoHeight={true}
      />
      <Modal id="any-unique-identifier" isOpen={isModalOpen}>
        <FormsTable
          masjidData={data}
          handleToast={() => handleToast()}
          preButton={{ onClick: closeModal, text: 'Close' }}
          onSubmit={onSubmit}
          Label="Save Changes"
          variant={'edit'}
        />
      </Modal>
    </>
  );
};

const Table = props => {
  console.log(props.bodyData);
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

  // return (
  //   <div>
  //     <DataGrid
  //       columns={column}
  //       rows={props.bodyData}
  //       pageSize={props.limit}
  //       autoHeight={true}
  //     />
  //     <Modal id="any-unique-identifier" isOpen={isModalOpen}>
  //       <FormsTable
  //         masjidData={data}
  //         handleToast={() => {}}
  //         preButton={{ onClick: closeModal, text: 'Close' }}
  //         onSubmit={() => {}}
  //         Label="Save Changes"
  //         variant={'edit'}
  //       />
  //     </Modal>
  //   </div>
  // );
  // const initDataShow =
  //   props.limit && props.bodyData
  //     ? props.bodyData.slice(0, Number(props.limit))
  //     : props.bodyData;
  //
  // const [dataShow, setDataShow] = useState(initDataShow);
  //
  // let pages = 1;
  //
  // let range = [];
  //
  // if (props.limit !== undefined) {
  //   let page = Math.floor(props.bodyData.length / Number(props.limit));
  //   pages = props.bodyData.length % Number(props.limit) === 0 ? page : page + 1;
  //   range = [...Array(pages).keys()];
  // }
  //
  // const [currPage, setCurrPage] = useState(0);
  // const [open, setOpen] = React.useState(false);
  //
  // const handleToast = () => {
  //   setOpen(true);
  // };
  //
  // const handleClose = (event, reason) => {
  //   if (reason === "clickaway") {
  //     return;
  //   }
  //
  //   setOpen(false);
  // };
  // const selectPage = (page) => {
  //   const start = Number(props.limit) * page;
  //   const end = start + Number(props.limit);
  //
  //   setDataShow(props.bodyData.slice(start, end));
  //
  //   setCurrPage(page);
  // };
  //
  // useEffect(() => {
  //   setDataShow(
  //     props.limit && props.bodyData
  //       ? props.bodyData.slice(0, Number(props.limit))
  //       : props.bodyData
  //   );
  // }, [props.bodyData, props.limit]);
  //
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
        {props.edit ? (
          <RenderBody masjidData={props.bodyData} handleToast={handleToast} />
        ) : (
          <>
            {props.timeRequest ? (
              <RenderCusomerBody
                masjidData={props.bodyData}
                handleToast={() => handleToast()}
              />
            ) : (
              // <>
              //   {dataShow.map((item, index) => (
              //     <RenderCusomerBody
              //       handleToast={() => handleToast()}
              //       index={index}
              //       item={item}
              //     />
              //   ))}
              // </>
              <>
                {props.bodyData
                  .slice(0, Number(props.limit))
                  .map((item, index) => props.renderBody(item, index))}
              </>
            )}
          </>
        )}
      </div>
      {/*{pages > 1 ? (*/}
      {/*  <div className="table__pagination">*/}
      {/*    {range.map((item, index) => (*/}
      {/*      <div*/}
      {/*        key={index}*/}
      {/*        className={`table__pagination-item ${*/}
      {/*          currPage === index ? 'active' : ''*/}
      {/*        }`}*/}
      {/*        onClick={() => selectPage(index)}*/}
      {/*      >*/}
      {/*        {item + 1}*/}
      {/*      </div>*/}
      {/*    ))}*/}
      {/*  </div>*/}
      {/*) : null}*/}
    </div>
  );
};

export default Table;
