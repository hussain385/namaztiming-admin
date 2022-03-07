import React from 'react';
import { ModalProvider } from 'react-simple-hook-modal';
import RequestTable from '../components/requestTable/RequestTable';

function Request() {
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
}

export default Request;
