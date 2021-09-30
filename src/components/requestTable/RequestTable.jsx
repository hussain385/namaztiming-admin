import React, { useEffect, useState } from "react";
import "./requestTable.css";
import "react-simple-hook-modal/dist/styles.css";
import { Backdrop, Box, Modal, Slide } from "@mui/material";
import FormsTable from "../FormsTable/FormsTable";
import { useFirestore } from "react-redux-firebase";
import firebase from "firebase/compat";


const MyComponent = (props) => {
  const [model, setModel] = useState(false);
  const Firestore = useFirestore();

  async function onDelete() {
    await Firestore.delete(`newMasjid/${props.item.id}`);
    await firebase.storage().refFromURL(props.item.pictureURL).delete()
    window.location.reload(false);
  }

  return (
    <>
      <tr key={props.index}>
        <td>{props.index + 1}</td>
        <td>{props.item.name}</td>
        <td>{props.item.user.name}</td>
        <td>{props.item.user.phone}</td>
        <td style={{ justifyContent: "center", textAlign: "center" }}>
          <button onClick={() => setModel(true)} className="buttonStyle">
            View
          </button>
          <button
            onClick={onDelete}
            className="buttonStyle"
            style={{ backgroundColor: "darkred", marginLeft: 15 }}
          >
            Delete
          </button>
        </td>
      </tr>
      <Modal
        id="any-unique-identifier"
        open={model}
        onClose={() => setModel(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
      >
        <Slide in={model} direction="up" timeout={100}>
          <Box
            sx={{
              position: "absolute",
              margin: 10,
              bgcolor: "background.paper",
              borderRadius: "10px",
              boxShadow: 24,
              p: 4,
            }}
          >
            <FormsTable
              masjidData={props.item}
              preButton={{ onClick: () => setModel(false), text: "cancel" }}
             variant={"request"}/>
          </Box>
        </Slide>
      </Modal>
    </>
  );
};

const RequestTable = (props) => {
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
          {props.bodyData && props.renderBody ? (
            <tbody>
              {dataShow.map((item, index) => (
                <MyComponent index={index} item={item} key={index} />
              ))}
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

export default RequestTable;
