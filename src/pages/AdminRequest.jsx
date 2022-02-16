import React from 'react';
import { firestoreConnect, populate } from 'react-redux-firebase';
import { ModalProvider } from 'react-simple-hook-modal';
import { connect } from 'react-redux';
import _ from 'lodash';
import { compose } from 'redux';
import AdminTable from '../components/admin-request/AdminTable';

function AdminRequest({ masjidData }) {
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
}

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
      (data, id) => ({ ...data, id }),
    ),
  })),
)(AdminRequest);
