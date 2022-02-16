import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { populate, useFirestoreConnect } from "react-redux-firebase";
import _ from "lodash";
import StatusCard from "../components/status-card/StatusCard";
import Table from "../components/table/Table";


const topCustomers = {
  head: ["ID", "name", "address", "admin"]
};

const renderCusomerHead = (item, index) => <th key={index}>{item}</th>;

const renderCusomerBody = (item, index) => (
  <tr key={index}>
    <td>{index + 1}</td>
    <td>{item.name}</td>
    <td>{item.address}</td>
    <td>{item.user?.name}</td>
  </tr>
);

const Dashboard = () => {
  const populates = [{ child: "adminId", root: "users", childAlias: "user" }];
  useFirestoreConnect([
    {
      collection: "Masjid"
    },
    {
      collection: "adminRequest"
    },
    {
      collection: "users"
    },
    {
      collection: "newMasjid"
    }
  ]);

  const firestore = useSelector(state => state.firestore);
  const masjid = populate(firestore, "Masjid", populates);
  const masjidData = _.map(masjid, (data, id) => ({ ...data, id: id }));
  // const requestData = firestore.ordered.requests
  const newMasjidLength = firestore.ordered.newMasjid;
  const adminUsers = firestore.ordered.users;
  const RequestsLength = _.sum(_.map(masjid, data => data.requestList?.length));
  const AnnouncementLength = _.sum(
    _.map(masjid, data => data.announcementList?.length)
  );
  const adminRequests = firestore.ordered.adminRequest?.length;

  return (
    <div>
      <h2 className="page-header">Dashboard</h2>
      <div className="row">
        <div className="screenStyle">
          <div className="row">
            <div className="col-4">
              <Link
                // onClick={() => props.clickOpen()}
                style={{ color: "#455560" }}
                to="masjidlist"
                // key={index}
              >
                <StatusCard
                  icon="fas fa-mosque"
                  count={masjidData.length}
                  title="No. Of Masjid Registered"
                />
              </Link>
            </div>
            <div className="col-4">
              <Link
                // onClick={() => props.clickOpen()}
                to="request"
                style={{ color: "#455560" }}
                // key={index}
              >
                <StatusCard
                  icon="fas fa-mosque"
                  count={newMasjidLength?.length || 0}
                  title="No. Of Masjid Requests"
                />
              </Link>
            </div>
            <div className="col-4">
              <Link
                // onClick={() => props.clickOpen()}
                to="#"
                style={{ color: "#455560" }}
                // key={index}
              >
                <StatusCard
                  icon="fas fa-mosque"
                  count={AnnouncementLength || 0}
                  title="News & Announcement"
                />
              </Link>
            </div>
            <div className="col-4">
              <Link
                // onClick={() => props.clickOpen()}
                to="admin-request"
                style={{ color: "#455560" }}
                // key={index}
              >
                <StatusCard
                  icon="fas fa-mosque"
                  count={adminRequests || 0}
                  title="No. Of admin Requests"
                />
              </Link>
            </div>
            <div className="col-4">
              <Link
                // onClick={() => props.clickOpen()}
                to="time-requests"
                style={{ color: "#455560" }}
                // key={index}
              >
                <StatusCard
                  icon="fas fa-mosque"
                  count={RequestsLength || 0}
                  title="Edit Time Request"
                />
              </Link>
            </div>
            <div className="col-4">
              <Link
                // onClick={() => props.clickOpen()}
                to="#"
                style={{ color: "#455560" }}
                // key={index}
              >
                <StatusCard
                  icon="fas fa-mosque"
                  count={adminUsers?.length || 0}
                  title="Total no. of current Admins"
                />
              </Link>
            </div>
          </div>
        </div>
        <div className="">
          <div className="card">
            <div className="card__header">
              <h3>Masjid List</h3>
            </div>
            <div className="card__body">
              <Table
                headData={topCustomers.head}
                renderHead={(item, index) => renderCusomerHead(item, index)}
                bodyData={masjidData}
                edit={false}
                limit={10}
                renderBody={(item, index) => renderCusomerBody(item, index)}
              />
            </div>
            <div className="card__footer">
              <Link to="/masjidList">view all</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
