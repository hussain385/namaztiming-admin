import React from 'react';
import { useFirestoreConnect } from 'react-redux-firebase';
import { useSelector } from 'react-redux';
import '../components/table/table.css';
import { ModalProvider } from 'react-simple-hook-modal';
import 'react-simple-hook-modal/dist/styles.css';
import ContactUsTable from '../components/contactUsTable/ContactUsTable';

const topCustomers = {
  head: ['ID', 'User Name', 'User Email', ''],
};

const renderCusomerHead = (item, index) => <th key={index}>{item}</th>;

function RenderCusomerBody(item, index) {
  return (
    <tr key={index}>
      <td>{index + 1}</td>
      <td>{item.name}</td>
      <td>{item.address}</td>
      <td>
        <button
          className="buttonStyle"
          onClick={() => {
            console.log(item.requests);
          }}
        >
          View
        </button>
      </td>
    </tr>
  );
}

function ContactUS() {
  const firestore = useSelector((state) => state.firestore);
  useFirestoreConnect([
    {
      collection: 'contactForm',
    },
  ]);
  const requestData = firestore.ordered.contactForm;
  console.log(requestData);
  return (
    <ModalProvider>
      <div>
        <h2 className="page-header">Contact Us Requests</h2>
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card__body">
                <ContactUsTable
                  headData={topCustomers.head}
                  renderHead={(item, index) => renderCusomerHead(item, index)}
                  bodyData={requestData}
                  edit={false}
                  contactUS
                  renderBody={(item, index) => RenderCusomerBody(item, index)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalProvider>
  );
}

export default ContactUS;
