import React, {useState} from 'react';
import {Modal, useModal} from 'react-simple-hook-modal';
import 'react-simple-hook-modal/dist/styles.css';
import '../table/table.css';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import {DataGrid, GridToolbar} from '@mui/x-data-grid';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {TextField} from '@mui/material';
import Loader from 'react-loader-spinner';
import {init, send} from '@emailjs/browser';
import {useFirestore} from 'react-redux-firebase';

init('user_k4PQLbwynLReSen9I1q0c');
const ERROR = {
    color: 'darkred',
    fontSize: 12,
    marginTop: 5,
};

const INPUT = {
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#eeee',
    width: '100%',
};

const Alert = React.forwardRef((props, ref) => <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />);

function RenderCusomerBody({masjidData, handleToast, handleToast1}) {
    const {isModalOpen, openModal, closeModal} = useModal();
    const firestore = useFirestore();
    const [data, setData] = React.useState();
    console.log(masjidData);
    const column = [
        {field: 'userName', headerName: 'User Name', width: 400},
        {
            field: 'userEmail', headerName: 'User Email', width: 300, flex: 1,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            renderCell: (params) => {
                const [loading, setLoading] = useState(false);
                return (
                    <>
                        <button
                            onClick={() => {
                                openModal();
                                setData(params.row);
                            }}
                            // variant={'contained'}
                            className="buttonStyle"
                        >
                            Reply
                        </button>
                        <button
                            onClick={async () => {
                                setLoading(true)
                                await firestore.delete('contactForm/' + params.row.id).then(() => {
                                    window.alert("The message is successfully deleted")
                                    setLoading(false)
                                })
                            }}
                            style={{
                                marginLeft: '10px',
                                backgroundColor: 'darkred'
                            }}
                            className="buttonStyle"
                        >
                            {loading ? (
                                <Loader type="Puff" color="white" height={12} width={40}/>
                            ) : (
                                <p style={{color: 'white'}}>Delete</p>
                            )}
                        </button>
                    </>)
            },
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
            <Modal id="any-unique-identifier" isOpen={isModalOpen}>
                <MessageDisplay
                    handleToast1={() => handleToast1()}
                    handleToast={() => handleToast()}
                    data={data}
                    preButton={{onClick: closeModal, text: 'Close'}}
                />
            </Modal>
        </>
    );
}

function MessageDisplay(props) {
    const {isModalOpen, openModal, closeModal} = useModal();
    console.log(props.data);
    return (
        <>
            <h1 style={{textAlign: 'center', marginBottom: '20px'}}>Contact Us</h1>
            <TextField
                label="User Email"
                name="userEmail"
                value={props.data.userEmail}
                fullWidth
                disabled
            />
            <TextField
                label="Subject"
                name="userSubject"
                value={props.data.options}
                fullWidth
                style={{marginTop: '20px'}}
                disabled
            />
            <TextField
                label="Message"
                name="userMessage"
                value={props.data.message}
                fullWidth
                multiline
                rows={7.5}
                style={{marginTop: '20px'}}
                disabled
            />
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
                    onClick={props.preButton.onClick}
                >
                    Close
                </button>
                <button
                    style={{
                        paddingRight: 10,
                        paddingLeft: 10,
                        color: 'white',
                        backgroundColor: 'green',
                        borderRadius: 7,
                        height: 30,
                    }}
                    onClick={openModal}
                >
                    <p>Reply</p>
                </button>
            </div>
            <Modal id="any-unique-identifier" isOpen={isModalOpen}>
                <MessageReply
                    handleToast1={() => props.handleToast1()}
                    handleToast={() => props.handleToast()}
                    data={props.data}
                    closeOldModal={props.preButton.onClick}
                    preButton={{onClick: closeModal, text: 'Close'}}
                />
            </Modal>
        </>
    );
}

function MessageReply(props) {
    const Firestore = useFirestore();
    return (
        <Formik
            initialValues={{
                userEmail: props.data.userEmail,
                userMessage: '',
                userSubject: '',
            }}
            validationSchema={Yup.object().shape({
                userMessage: Yup.string().required('Message is required'),
            })}
            onSubmit={(values) => {
                send('service_nqjmqcg', 'template_vpq7rpr', {
                    from_name: 'Namaz Timings Team',
                    message: `${values.userMessage}`,
                    reply_to: `${values.userEmail}`,
                    type: `${values.userSubject}`,
                })
                    .then(async () => {
                        await Firestore.delete(`contactForm/${props.data.id}`).then(() => {
                            props.handleToast();
                            props.closeOldModal();
                            props.preButton.onClick();
                        });
                    })
                    .catch((e) => {
                        props.handleToast1();
                        props.preButton.onClick();
                    });
            }}
        >
            {({
                  handleChange,
                  handleSubmit,
                  handleBlur,
                  values,
                  errors,
                  touched,
                  setFieldValue,
                  isSubmitting,
                  /* and other goodies */
              }) => (
                <>
                    <h1 style={{textAlign: 'center', marginBottom: '20px'}}>
                        Contact Us
                    </h1>
                    <TextField
                        label="User Email"
                        name="userEmail"
                        value={values.userEmail}
                        onChange={(event) => {
                            setFieldValue('userEmail', event.target.value);
                        }}
                        onBlur={handleBlur}
                        error={touched.userEmail && Boolean(errors.userEmail)}
                        helperText={touched.userEmail && errors.userEmail}
                        fullWidth
                        disabled
                    />
                    <TextField
                        label="Subject"
                        name="userSubject"
                        value={values.userSubject}
                        onChange={(event) => {
                            setFieldValue('userSubject', event.target.value);
                        }}
                        onBlur={handleBlur}
                        error={touched.userSubject && Boolean(errors.userSubject)}
                        helperText={touched.userSubject && errors.userSubject}
                        fullWidth
                        style={{marginTop: '20px'}}
                    />
                    <TextField
                        label="Message"
                        name="userMessage"
                        value={values.userMessage}
                        onChange={(event) => {
                            setFieldValue('userMessage', event.target.value);
                        }}
                        onBlur={handleBlur}
                        error={touched.userMessage && Boolean(errors.userMessage)}
                        helperText={touched.userMessage && errors.userMessage}
                        fullWidth
                        multiline
                        rows={7.5}
                        style={{marginTop: '20px'}}
                    />
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
                            onClick={props.preButton.onClick}
                        >
                            Close
                        </button>
                        <button
                            style={{
                                paddingRight: 10,
                                paddingLeft: 10,
                                color: 'white',
                                backgroundColor: 'green',
                                borderRadius: 7,
                                height: 30,
                            }}
                            type="submit"
                            disabled={isSubmitting}
                            onClick={handleSubmit}
                        >
                            {isSubmitting ? (
                                <Loader type="Puff" color="white" height={12} width={40}/>
                            ) : (
                                <p>Send Message</p>
                            )}
                        </button>
                    </div>
                </>
            )}
        </Formik>
    );
}

function ContactUsTable(props) {
    console.log(props.bodyData);
    const {isModalOpen, openModal, closeModal} = useModal();
    const [open, setOpen] = React.useState(false);
    const [open1, setOpen1] = React.useState(false);

    const handleToast = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const handleToast1 = () => {
        setOpen1(true);
    };

    const handleClose1 = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen1(false);
    };
    return (
        <div>
            <Snackbar
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                open={open}
                autoHideDuration={1500}
                onClose={handleClose}
            >
                <Alert onClose={handleClose} severity="success" sx={{width: '100%'}}>
                    Email was send successfully and message was also deleted!
                </Alert>
            </Snackbar>
            <Snackbar
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                open={open1}
                autoHideDuration={1500}
                onClose={handleClose1}
            >
                <Alert onClose={handleClose1} severity="error" sx={{width: '100%'}}>
                    Some error accrued please try again later!
                </Alert>
            </Snackbar>
            <div>
                {props.contactUS && (
                    <RenderCusomerBody
                        masjidData={props.bodyData}
                        handleToast={() => handleToast()}
                        handleToast1={() => handleToast1()}
                    />
                )}
            </div>
        </div>
    );
}

export default ContactUsTable;
