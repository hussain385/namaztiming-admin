import React from 'react';
import { populate, useFirestoreConnect } from 'react-redux-firebase';
import { ModalProvider } from 'react-simple-hook-modal';
import { useSelector } from 'react-redux';
import AdminTable from '../components/admin-request/AdminTable';
import _ from 'lodash';

const AdminRequest = () => {
  const populates = [
    { child: 'masjidID', root: 'Masjid', childAlias: 'masjid' }, // replace owner with user object
  ];
  useFirestoreConnect([
    {
      collection: 'adminRequest',
      populates,
    },
  ]);
  const firestore = useSelector(state => state.firestore);
  const masjid = populate(firestore, 'adminRequest', populates);
  const masjidData = _.map(masjid, (data, id) => ({ ...data, id: id }));

  // const masjidData = firestore.ordered.adminRequest;

  console.log(masjidData);
  return (
    <ModalProvider>
      <div>
        <h2 className="page-header">Admin Requests</h2>
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card__body">
                <AdminTable bodyData={masjidData || []} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalProvider>
  );
};

export default AdminRequest;
