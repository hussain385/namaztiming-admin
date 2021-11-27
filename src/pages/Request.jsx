import React from 'react';
import { useFirestoreConnect } from 'react-redux-firebase';
import { ModalProvider } from 'react-simple-hook-modal';
import { useSelector } from 'react-redux';
import RequestTable from '../components/requestTable/RequestTable';

function Request() {
  useFirestoreConnect([
    {
      collection: 'newMasjid',
    },
  ]);
  const firestore = useSelector(state => state.firestore);
  // const masjid = populate(firestore, 'Masjid', populates);
  const masjidData = firestore.ordered.newMasjid;
  return (
    <ModalProvider>
      <div>
        <h2 className="page-header">Masjid Requests</h2>
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card__body">
                <RequestTable bodyData={masjidData || []} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalProvider>
  );
}

export default Request;
