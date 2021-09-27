import React, { useEffect, useState } from "react";
import _ from "lodash";
import { ModalTransition, useModal, Modal } from "react-simple-hook-modal";
import { Formik } from "formik";
import "react-simple-hook-modal/dist/styles.css";
import { useFirestore } from "react-redux-firebase";
import geohash from "ngeohash";
import { MasjidSchema } from "../../services/validation";
import "./table.css";
import FormsTable from "../FormsTable/FormsTable";

const RenderBody = ({ item, index }) => {
  const { isModalOpen, openModal, closeModal } = useModal();
  const firestore = useFirestore();
  if (!item) {
    return null;
  }
  return (
    <>
      <tr key={index}>
        <td>{index + 1}</td>
        <td>{item.name}</td>
        <td style={{ width: "30vw" }}>{item.address}</td>
        <td
          style={{
            flexDirection: "row",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <button onClick={openModal} className="buttonStyle">
            View
          </button>
          <button
            onClick={() => {
              firestore.delete("Masjid/" + item.id).catch((e) => {
                console.log(e);
              });
            }}
            className="buttonStyle"
            style={{ backgroundColor: "darkred", marginLeft: 15 }}
          >
            Delete
          </button>
        </td>
      </tr>
      <Modal
        id="any-unique-identifier"
        isOpen={isModalOpen}
        transition={ModalTransition.BOTTOM_UP}
      >
        <FormsTable item={item} closeModal={() => closeModal()} />
      </Modal>
    </>
  );
};

const Table = (props) => {
  const initDataShow =
    props.limit && props.bodyData
      ? props.bodyData.slice(0, Number(props.limit))
      : props.bodyData;

  const [dataShow, setDataShow] = useState(initDataShow);

  let pages = 1;

  let range = [];

  if (props.limit !== undefined) {
    let page = Math.floor(props.bodyData.length / Number(props.limit));
    pages = props.bodyData.length % Number(props.limit) === 0 ? page : page + 1;
    range = [...Array(pages).keys()];
  }

  const [currPage, setCurrPage] = useState(0);

  const selectPage = (page) => {
    const start = Number(props.limit) * page;
    const end = start + Number(props.limit);

    setDataShow(props.bodyData.slice(start, end));

    setCurrPage(page);
  };

  useEffect(() => {
    setDataShow(
      props.limit && props.bodyData
        ? props.bodyData.slice(0, Number(props.limit))
        : props.bodyData
    );
  }, [props.bodyData, props.limit]);

  return (
    <div>
      <div className="table-wrapper">
        <table>
          {props.headData && props.renderHead ? (
            <thead>
              <tr>
                {props.headData.map((item, index) =>
                  props.renderHead(item, index)
                )}
              </tr>
            </thead>
          ) : null}
          {props.bodyData ? (
            <tbody>
              {props.edit ? (
                <>
                  {dataShow.map((item, index) => (
                    <RenderBody index={index} item={item} />
                  ))}
                </>
              ) : (
                <>
                  {dataShow.map((item, index) => props.renderBody(item, index))}
                </>
              )}
            </tbody>
          ) : null}
        </table>
      </div>
      {pages > 1 ? (
        <div className="table__pagination">
          {range.map((item, index) => (
            <div
              key={index}
              className={`table__pagination-item ${
                currPage === index ? "active" : ""
              }`}
              onClick={() => selectPage(index)}
            >
              {item + 1}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default Table;
