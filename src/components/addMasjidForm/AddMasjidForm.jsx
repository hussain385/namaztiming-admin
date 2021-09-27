import React, {useState} from "react";
// import { Modal, ModalTransition, useModal } from "react-simple-hook-modal";
// import "./requestTable.css";
// import "react-simple-hook-modal/dist/styles.css";
import {useFirebase, useFirestore} from "react-redux-firebase";
import _ from "lodash";
import geohash from "ngeohash";
import FormsTable from "../FormsTable/FormsTable";


const ERROR = {
    color: "darkred",
    fontSize: 12,
    marginTop: 5,
};

const INPUT = {
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#eeee",
    width: "100%",
};

const TIMEINPUT = {
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#eeee",
    width: "100%",
    textAlign: "center",
};

const AddMasjidForm = () => {
    const firestore = useFirestore();
    const firebase = useFirebase();
    const filePath = 'MasjidUploads'

    async function onSubmit(values) {
        const filter = ["latitude", "longitude", "pictureURL","userName","userEmail","userPhone"]
        const data = _.omit(values, filter);
        await firebase.uploadFile(filePath, values.pictureURL).then(snapshot => {
            snapshot.uploadTaskSnaphot.ref.getDownloadURL().then(url => {
                firestore.add("Masjid", {
                    ...data,
                    pictureURL: url,
                    g: {
                        geopoint: new firestore.GeoPoint(values.latitude, values.longitude),
                        geohash: geohash.encode(values.latitude, values.longitude, 9),
                    },
                });
                alert('Sent')
            })
            })
        }

    // const uploadedFile = useSelector(({ firebase: { data } }) => data[filePath])

    return <FormsTable onSubmit={onSubmit}/>;
};

export default AddMasjidForm;
