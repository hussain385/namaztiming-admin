import React from "react";

import Table from "../components/table/Table";

import {useFirestoreConnect} from "react-redux-firebase";
import {useSelector} from "react-redux";
import Layout from "../components/layout/Layout";

const customerTableHead = [
    "UID",
    "name",
    "address",
    "admin",
];

const renderHead = (item, index) => <th key={index}>{item}</th>;

const renderBody = (item, index) => (
    <tr key={index}>
        <td>{item.id}</td>
        <td>{item.name}</td>
        <td>{item.address}</td>
        <td>{item.user?.name}</td>
    </tr>
);

const Request = (props) => {
    useFirestoreConnect([{
        collection: 'newMasjid',
    }]);
    const firestore = useSelector(state => state.firestore);
    // const masjid = populate(firestore, 'Masjid', populates);
    const masjidData = firestore.ordered.newMasjid
    return (
        // <Layout>
            <div>
                <h2 className="page-header">Masjid Requests</h2>
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card__body">
                                <Table
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
        // </Layout>
    );
};

export default Request;
