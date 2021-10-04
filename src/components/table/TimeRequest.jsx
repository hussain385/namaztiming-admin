import React from "react";
import { Modal, useModal } from "react-simple-hook-modal";
import TimeRequestTable from "../TimeRequestTable/TimeRequestTable";
import {useFirestore} from "react-redux-firebase";

const TimeRequest = ({ index, item, masjidId }) => {
  const { isModalOpen, openModal, closeModal } = useModal();
  const firestore = useFirestore()
  console.log(item)
  if (!item.timing) {
    return null
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
            className="buttonStyle"
            style={{ backgroundColor: "darkred", marginLeft: 15 }}
            onClick={()=>
              firestore.update('Masjid/' + masjidId,{
                requestList: firestore.FieldValue.arrayRemove(item.id)
              }).then(()=> firestore.delete('requests/' + item.id))


            }
          >
            Delete
          </button>
        </td>
      </tr>
      <Modal id="any-unique-identifier" isOpen={isModalOpen}>
        <TimeRequestTable
          preButton={{ onClick: closeModal, text: "Close" }}
          data={item}
          masjidId={masjidId}
        />
      </Modal>
    </>
  );
};

export default TimeRequest;
