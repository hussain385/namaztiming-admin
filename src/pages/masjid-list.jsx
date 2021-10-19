import React from 'react';
import { populate, useFirestoreConnect } from 'react-redux-firebase';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import { ModalProvider } from 'react-simple-hook-modal';
import 'react-simple-hook-modal/dist/styles.css';
import Table from '../components/table/Table';

const customerTableHead = ['ID', 'name', 'address', ''];

const renderHead = (item, index) => <th key={index}>{item}</th>;

const renderBody = (item, index) => (
  <tr key={index}>
    <td>{index + 1}</td>
    <td>{item.name}</td>
    <td>{item.address}</td>
  </tr>
);

function MasjidList() {
  const populates = [{ child: 'adminId', root: 'users', childAlias: 'user' }];
  useFirestoreConnect([
    {
      collection: 'Masjid',
      populates,
    },
  ]);
  const firestore = useSelector(state => state.firestore);
  const masjid = populate(firestore, 'Masjid', populates);
  const masjidData = _.map(masjid, (data, id) => ({ ...data, id: id }));
  console.log(masjidData);
  return (
    <ModalProvider>
      <div>
        <h2 className="page-header">Masjid List</h2>
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card__body">
                <Table
                  limit="10"
                  edit={true}
                  isAddMasjid={true}
                  headData={customerTableHead}
                  renderHead={(item, index) => renderHead(item, index)}
                  renderBody={(item, index) => renderBody(item, index)}
                  bodyData={masjidData}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalProvider>
  );
}

export default MasjidList;
