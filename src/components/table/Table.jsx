import React from 'react';
import {Modal, useModal} from 'react-simple-hook-modal';
import 'react-simple-hook-modal/dist/styles.css';
import {useFirestore} from 'react-redux-firebase';
import './table.css';
import FormsTable from '../FormsTable/FormsTable';
import _ from 'lodash';
import geohash from 'ngeohash';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import TimeRequest from './TimeRequest';
import {DataGrid, GridToolbar} from '@mui/x-data-grid';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const RenderCusomerBody = ({masjidData, index}) => {
    const {isModalOpen, openModal, closeModal} = useModal();
    const [data, setData] = React.useState();

    const column = [
        {field: 'name', headerName: 'Masjid Name', width: 400},
        {field: 'address', headerName: 'Address', width: 400, flex: 1},
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
            <DataGrid
                columns={column}
                rows={masjidData}
                pageSize={10}
                autoHeight={true}
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
                            <th>{''}</th>
                        </tr>
                        </thead>
                        <tbody>
                        <>
                            {data?.requests.map((values, index) => (
                                <TimeRequest
                                    key={values.id}
                                    item={values}
                                    index={index}
                                    masjidId={data.id}
                                    masjidName={data.name}
                                />
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

const RenderBody = ({handleToast, masjidData, index}) => {
    const {isModalOpen, openModal, closeModal} = useModal();
    const Firestore = useFirestore();
    const [data, setData] = React.useState(null);

    const column = [
        {field: 'id', hide: true},
        {field: 'name', headerName: 'Masjid Name', width: 250},
        {field: 'address', headerName: 'Address', width: 300, flex: 1},
        {
            field: 'actions',
            headerName: 'Action',
            width: 200,
            renderCell: params => {
                return (
                    <>
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
                        <button
                            onClick={async () => {
                                await Firestore.delete(`Masjid/${params.row.id}`).then(() => {
                                    alert('Request deleted successfully');
                                })
                            }}
                            style={{backgroundColor: 'darkred', marginLeft: 15}}
                            className={'buttonStyle'}
                        >
                            Delete
                        </button>
                    </>
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
                components={{
                    Toolbar: GridToolbar,
                }}
            />
            <Modal id="any-unique-identifier" isOpen={isModalOpen}>
                <FormsTable
                    masjidData={data}
                    handleToast={() => handleToast()}
                    preButton={{onClick: closeModal, text: 'Close'}}
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
    const {isModalOpen, openModal, closeModal} = useModal();
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
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                open={open}
                autoHideDuration={1500}
                onClose={handleClose}
            >
                {props.isAddMasjid ? (
                    <Alert
                        onClose={handleClose}
                        severity="success"
                        sx={{width: '100%'}}
                    >
                        Details were saved successfully!
                    </Alert>
                ) : (
                    <Alert
                        onClose={handleClose}
                        severity="success"
                        sx={{width: '100%'}}
                    >
                        Details were edited successfully!
                    </Alert>
                )}
            </Snackbar>
            <div>
                {props.edit ? (
                    <RenderBody masjidData={props.bodyData} handleToast={handleToast}/>
                ) : (
                    <>
                        {props.timeRequest ? (
                            <RenderCusomerBody
                                masjidData={props.bodyData}
                                handleToast={() => handleToast()}
                            />
                        ) : (
                            <>
                                {(props.limit && props.bodyData
                                        ? props.bodyData.slice(0, Number(props.limit))
                                        : props.bodyData
                                ).map((item, index) => props.renderBody(item, index))}
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Table;
