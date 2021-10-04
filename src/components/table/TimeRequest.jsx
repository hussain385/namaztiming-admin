import React from "react";
import { Modal, useModal } from "react-simple-hook-modal";
import TimeRequestTable from "../TimeRequestTable/TimeRequestTable";

const TimeRequest = ({ index, item }) => {
  const { isModalOpen, openModal, closeModal } = useModal();

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
          >
            Delete
          </button>
        </td>
      </tr>
      <Modal id="any-unique-identifier" isOpen={isModalOpen}>
        <TimeRequestTable
          preButton={{ onClick: closeModal, text: "Close" }}
          data={item}
        />
      </Modal>
    </>
  );
};

export default TimeRequest;
