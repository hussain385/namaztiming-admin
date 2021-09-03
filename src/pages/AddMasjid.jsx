import React from "react";
import AddMasjidForm from "../components/addMasjidForm/AddMasjidForm";

const AdminRequest = () => {
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
};

export default AdminRequest;
