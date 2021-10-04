import React from "react";
import Table from "../components/table/Table";
import { populate, useFirestoreConnect } from "react-redux-firebase";
import { useSelector } from "react-redux";
import _ from "lodash";
import "../components/table/table.css";
import { ModalProvider } from "react-simple-hook-modal";
import "react-simple-hook-modal/dist/styles.css";

const topCustomers = {
  head: ["ID", "Name", "Address", ""],
};

const renderCusomerHead = (item, index) => <th key={index}>{item}</th>;

const RenderCusomerBody = (item, index) => {
  return (
    <>
      <tr key={index}>
        <td>{index + 1}</td>
        <td>{item.name}</td>
        <td>{item.address}</td>
        <td>
          <button
            className="buttonStyle"
            onClick={() => {
              console.log(item.requests);
            }}
          >
            View
          </button>
        </td>
      </tr>
    </>
  );
};

const TimeRequests = () => {
  const firestore = useSelector((state) => state.firestore);
  const populates = [
    { child: "requestList", root: "requests", childAlias: "requests" },
  ];
  useFirestoreConnect([
    {
      collection: "Masjid",
      populates,
      storeAs: "requestList",
    },
  ]);
  const timeRequest = populate(firestore, "requestList", populates);
  const requestData = [];
  _.forEach(timeRequest, (data, id) => {
    if (data.requests?.length >= 1) {
      requestData.push({ ...data, id: id });
    }
  });
  console.log(requestData);
  return (
    <ModalProvider>
      <div>
        <h2 className="page-header">Edit Time Requests</h2>
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card__body">
                <Table
                  headData={topCustomers.head}
                  renderHead={(item, index) => renderCusomerHead(item, index)}
                  bodyData={requestData}
                  edit={false}
                  timeRequest={true}
                  renderBody={(item, index) => RenderCusomerBody(item, index)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalProvider>
  );
};

export default TimeRequests;
