import React, {useState} from 'react';
import {Modal, useModal} from 'react-simple-hook-modal';
import TimeRequestTable from '../TimeRequestTable/TimeRequestTable';
import {useFirestore} from 'react-redux-firebase';
import Loader from 'react-loader-spinner';

const TimeRequest = ({index, item, masjidId, masjidName, closeModal1}) => {
    const [loading, setLoading] = useState(false);
    const {isModalOpen, openModal, closeModal} = useModal();
    const firestore = useFirestore();
    console.log(item);
    if (!item.timing) {
        return null;
    }
    return (
        <>
            <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.userName}</td>
                <td>
                    <button onClick={openModal} className="buttonStyle">
                        View
                    </button>
                    <button
                        disabled={loading}
                        className="buttonStyle"
                        style={{backgroundColor: 'darkred', marginLeft: 15}}
                        onClick={async () => {
                            setLoading(true)
                            await firestore
                                .update('Masjid/' + masjidId, {
                                    requestList: firestore.FieldValue.arrayRemove(item.id),
                                })
                                .then(() => {
                                    firestore.delete('requests/' + item.id)
                                    setLoading(false)
                                    closeModal1()
                                })
                            }
                        }
                    >
                        {loading ? (
                            <Loader type="Puff" color="white" height={12} width={40} />
                        ) : (
                            <p style={{ color: 'white' }}>Delete</p>
                        )}
                    </button>
                </td>
            </tr>
            <Modal id="any-unique-identifier" isOpen={isModalOpen}>
                <TimeRequestTable
                    preButton={{onClick: closeModal, text: 'Close'}}
                    data={item}
                    masjidId={masjidId}
                    masjidName={masjidName}
                />
            </Modal>
        </>
    );
};

export default TimeRequest;
