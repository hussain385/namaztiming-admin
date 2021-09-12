import React from "react";
import { Link } from "react-router-dom";
import Chart from "react-apexcharts";
import { useSelector } from "react-redux";
import StatusCard from "../components/status-card/StatusCard";
import Table from "../components/table/Table";
import { populate, useFirestoreConnect } from "react-redux-firebase";
import _ from "lodash";

const chartOptions = {
  series: [
    {
      name: "Online Customers",
      data: [40, 70, 20, 90, 36, 80, 30, 91, 60],
    },
    {
      name: "Store Customers",
      data: [40, 30, 70, 80, 40, 16, 40, 20, 51, 10],
    },
  ],
  options: {
    color: ["#6ab04c", "#2980b9"],
    chart: {
      background: "transparent",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
      ],
    },
    grid: {
      show: false,
    },
  },
};

const topCustomers = {
  head: ["ID", "name", "address", "admin"],
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
  const populates = [
    {child: "adminId", root: "users", childAlias: "user"},
  ];
  useFirestoreConnect([
    {
      collection: "Masjid",
      populates,
    },
  ]);
  useFirestoreConnect([
    {
      collection: "adminRequest",
    },
  ]);
  const firestore = useSelector((state) => state.firestore);
  const masjid = populate(firestore, "Masjid", populates);
  const masjidData = _.map(masjid, (data, id) => ({...data, id: id}));
  const RequestsLength = _.sum(_.map(masjid, (data) => (data.requestList?.length)));
  const AnnouncementLength = _.sum(_.map(masjid, (data) => (data.announcementList?.length)));
  const adminRequests = firestore.ordered.adminRequest.length
  const themeReducer = useSelector((state) => state.ThemeReducer.mode);
  return (
      <div>
        <h2 className="page-header">Dashboard</h2>
        <div className="row">
          <div className="screenStyle">
            <div className="row">
              <div className="col-6">
                <StatusCard
                    icon="fas fa-mosque"
                count={masjidData.length}
                title="No. Of Masjid"
              />
            </div>
            <div className="col-6">
                <StatusCard
                    icon="fas fa-mosque"
                    count={RequestsLength}
                    title="No. Of Requests"
                />
            </div>
            <div className="col-6">
              <StatusCard
                  icon="fas fa-mosque"
                  count={AnnouncementLength}
                  title="News & Announcement"
              />
            </div>
            <div className="col-6">
              <StatusCard
                  icon="fas fa-mosque"
                  count={adminRequests}
                  title="No. Of admin Requests"
              />
            </div>
          </div>
          <div className="col-6">
            <div className="card full-height">
              {/* chart */}
              <Chart
                options={
                  themeReducer === "theme-mode-dark"
                    ? {
                        ...chartOptions.options,
                        theme: { mode: "dark" },
                      }
                    : {
                        ...chartOptions.options,
                        theme: { mode: "light" },
                      }
                }
                series={chartOptions.series}
                type="line"
                height="100%"
              />
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
