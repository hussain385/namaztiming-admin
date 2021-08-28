import React from 'react';
import {populate, useFirestoreConnect} from "react-redux-firebase";
import {useSelector} from "react-redux";
import _ from "lodash";
import Table from "../components/table/Table";

const customerTableHead = [
    "ID",
    "name",
    "address",
    "admin",
];

const renderHead = (item, index) => <th key={index}>{item}</th>;

const renderBody = (item, index) => (
    <tr key={index}>
        <td>{index+1}</td>
        <td>{item.name}</td>
        <td>{item.address}</td>
        <td>{item.user?.name}</td>
    </tr>
);

function MasjidList(props) {
    const populates = [
        {child: 'adminId', root: 'users', childAlias: 'user'}, // replace owner with user object
    ];
    useFirestoreConnect([{
        collection: 'Masjid',
        populates,
    }]);
    const firestore = useSelector(state => state.firestore);
    const masjid = populate(firestore, 'Masjid', populates);
    const masjidData = _.map(masjid,(data, id) => ({...data,id: id}))
    console.log(masjidData)
    return (
        <div>
            <h2 className="page-header">Masjid List</h2>
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card__body">
                            <Table
                                limit="10"
                                headData={customerTableHead}
                                renderHead={(item, index) => renderHead(item, index)}
                                bodyData={masjidData}
                                renderBody={(item, index) => renderBody(item, index)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MasjidList;
