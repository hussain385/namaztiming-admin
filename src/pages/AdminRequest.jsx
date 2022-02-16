import React from 'react';
import {
  firestoreConnect,
  populate,
  useFirestoreConnect,
} from 'react-redux-firebase';
import { ModalProvider } from 'react-simple-hook-modal';
import { connect, useSelector } from 'react-redux';
import AdminTable from '../components/admin-request/AdminTable';
import _ from 'lodash';
import { compose } from 'redux';

const AdminRequest = ({ masjidData }) => {
  // const firestore = useSelector(state => state.firestore);
  // const masjid =
  // const masjidData =
  // const masjidData = firestore.ordered.adminRequest;

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

const populates = [
  { child: 'masjidID', root: 'Masjid', childAlias: 'masjid' }, // replace owner with user object
];

export default compose(
  firestoreConnect(() => [
    {
      collection: 'adminRequest',
      populates,
    },
  ]),
  connect(({ firestore }) => ({
    masjidData: _.map(
      populate(firestore, 'adminRequest', populates),
      (data, id) => ({ ...data, id: id }),
    ),
  })),
)(AdminRequest);
