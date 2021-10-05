import React, { useEffect, useState } from "react";
import { Modal, useModal } from "react-simple-hook-modal";
import "react-simple-hook-modal/dist/styles.css";
import { useFirestore } from "react-redux-firebase";
import "./table.css";
import FormsTable from "../FormsTable/FormsTable";
import _ from "lodash";
import geohash from "ngeohash";
import firebase from "firebase/compat";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import TimeRequest from "./TimeRequest";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const RenderCusomerBody = ({ item, index }) => {
  const { isModalOpen, openModal, closeModal } = useModal();
  return (
    <>
      <tr key={index}>
        <td>{index + 1}</td>
        <td>{item.name}</td>
        <td>{item.address}</td>
        <td>
          <button onClick={openModal} className="buttonStyle">
            View
          </button>
        </td>
      </tr>
      <Modal id="any-unique-identifier" isOpen={isModalOpen}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>User Name</th>
                <th>{""}</th>
              </tr>
            </thead>
            <tbody>
              <>
                {item.requests.map((values, index) => (
                  <TimeRequest item={values} index={index} masjidId={item.id} />
                ))}
              </>
            </tbody>
          </table>
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 20,
            justifyContent: "flex-end",
          }}
        >
          <button
            style={{
              width: 70,
              color: "white",
              borderRadius: 7,
              height: 30,
              marginRight: 20,
              backgroundColor: "darkred",
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

const RenderBody = ({ handleToast, item, index }) => {
  const { isModalOpen, openModal, closeModal } = useModal();
  const Firestore = useFirestore();
  if (!item) {
    return null;
  }

  function onSubmit(values) {
    const data = _.omit(values, ["latitude", "longitude"]);
    Firestore.update("Masjid/" + item.id, {
      ...data,
      g: {
        geopoint: new Firestore.GeoPoint(values.latitude, values.longitude),
        geohash: geohash.encode(values.latitude, values.longitude, 9),
      },
    }).then((value) => closeModal());
  }

  return (
    <>
      <tr key={index}>
        {/*<td>{index + 1}</td>*/}
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
            onClick={async () => {
              await Firestore.delete("Masjid/" + item.id).catch((e) => {
                console.error(e);
              });
              await firebase
                .storage()
                .refFromURL(item.pictureURL)
                .delete()
                .catch((reason) => console.error(reason));
              window.location.reload(false);
            }}
            className="buttonStyle"
            style={{ backgroundColor: "darkred", marginLeft: 15 }}
          >
            Delete
          </button>
        </td>
      </tr>
      <Modal id="any-unique-identifier" isOpen={isModalOpen}>
        <FormsTable
          masjidData={item}
          handleToast={() => handleToast()}
          preButton={{ onClick: closeModal, text: "Close" }}
          onSubmit={onSubmit}
          Label="Save Changes"
          variant={"edit"}
        />
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
  const [open, setOpen] = React.useState(false);

  const handleToast = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
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
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={open}
        autoHideDuration={1500}
        onClose={handleClose}
      >
        {props.isAddMasjid ? (
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            Details were saved successfully!
          </Alert>
        ) : (
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            Details were edited successfully!
          </Alert>
        )}
      </Snackbar>
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
                    <RenderBody
                      handleToast={() => handleToast()}
                      index={index}
                      item={item}
                    />
                  ))}
                </>
              ) : (
                <>
                  {props.timeRequest ? (
                    <>
                      {dataShow.map((item, index) => (
                        <RenderCusomerBody
                          handleToast={() => handleToast()}
                          index={index}
                          item={item}
                        />
                      ))}
                    </>
                  ) : (
                    <>
                      {dataShow.map((item, index) =>
                        props.renderBody(item, index)
                      )}
                    </>
                  )}
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
