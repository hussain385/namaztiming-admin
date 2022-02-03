import React from 'react';
import { ModalProvider } from 'react-simple-hook-modal';
import RequestTable from '../components/requestTable/RequestTable';

const Request = () => {
  // useFirestoreConnect([
  //   {
  //     collection: 'newMasjid',
  //   },
  // ]);
  // const firestore = useSelector(state => state.firestore);
  // const masjid = populate(firestore, 'Masjid', populates);
  // const masjidData = firestore.ordered.newMasjid;
  return (
    <ModalProvider>
      <div>
        <h2 className="page-header">Masjid Requests</h2>
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card__body">
                <RequestTable />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalProvider>
  );
};

export default Request;
