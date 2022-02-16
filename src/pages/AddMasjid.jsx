import React from 'react';
import AddMasjidForm from '../components/addMasjidForm/AddMasjidForm';
import { useFirestoreConnect } from 'react-redux-firebase';

function AdminRequest() {
  useFirestoreConnect([
    {
      collection: 'users',
    },
  ]);
  return (
    <div>
      <h2 className="page-header">Add Masjid</h2>
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card__body">
              <AddMasjidForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminRequest;
