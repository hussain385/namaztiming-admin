import React from "react";
import { populate, useFirestoreConnect } from "react-redux-firebase";
import { ModalProvider } from "react-simple-hook-modal";
import { useSelector } from "react-redux";
import AdminTable from "../components/admin-request/AdminTable";
import _ from "lodash";

const customerTableHead = ["ID", "Masjid ID", "User Name", "User Contact", ""];

const renderHead = (item, index) => <th key={index}>{item}</th>;

const renderBody = (item, index) => (
  <tr key={index}>
    <td>{item.masjidID}</td>
    <td>{item.userEmail}</td>
    <td>{item.userName}</td>
    <td>{item.userPhone}</td>
  </tr>
);


const AdminRequest = () => {
  const populates = [
    { child: "masjidID", root: "Masjid", childAlias: "masjid" }, // replace owner with user object
  ];
  useFirestoreConnect([
    {
      collection: "adminRequest",
      populates,
    },
  ]);
  const firestore = useSelector((state) => state.firestore);
  const masjid = populate(firestore, "adminRequest", populates);
  const masjidData = _.map(masjid, (data, id) => ({ ...data, id: id }));
  // const masjidData = firestore.ordered.adminRequest;
  console.log(masjidData);
  return (
    <ModalProvider>
      <div>
        <h2 className="page-header">Masjid Requests</h2>
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card__body">
                <AdminTable
                  limit="10"
                  headData={customerTableHead}
                  renderHead={(item, index) => renderHead(item, index)}
                  bodyData={masjidData || []}
                  renderBody={(item, index) => renderBody(item, index)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalProvider>
  );
};

export default AdminRequest;
