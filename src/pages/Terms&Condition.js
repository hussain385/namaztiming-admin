import React from 'react';
import './login.css';

function TermsCondition(props) {
  return (
    <div className="termsPage">
      <h1>Namaz Timings</h1>
      <div className="termsBox">
        <h1>Terms & Condition</h1>
        <p>
          NamazTimings.pk application aims to helps Muslims in locating nearby
          Masajid and their Namaz timings so that one could reach on time and
          catch the jamat. The objective is to help the travellers in praying
          their namaz on time. Usage of this application is subject to the
          following terms and conditions. If anyone person doesn’t agree with
          the terms, (s)he should uninstall this application and refrain using
          it.
        </p>
        <h3>Data Accuracy </h3>
        <p>
          Data of this application is updated by the volunteers or the admin of
          each Masjid. Whilst the utmost care is taken to ensure the accuracy of
          the content/information provided in the application, the creators of
          this application do not guarantee the accuracy of any details provided
          in the application nor they are responsible for any time and/or wealth
          loss or any personal grievances whatsoever.
        </p>

        <h3>Privacy</h3>
        <p>
          The data collected in the form of user credentials are kept under
          complete privacy. None of the information will be shared with any
          third party for any purpose. In case of any data leak due to the
          system hack/theft or any other external factor, the creators of this
          application are not responsible for any damage whatsoever.
        </p>
      </div>
    </div>
  );
}

export default TermsCondition;
