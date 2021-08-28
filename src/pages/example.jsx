import React from 'react';
import {populate, useFirestoreConnect} from "react-redux-firebase";
import {useSelector} from "react-redux";

function Example(props) {
    const populates = [
        { child: 'adminId', root: 'users', childAlias: 'user' }, // replace owner with user object
    ];
    useFirestoreConnect([
        {
            collection: 'Masjid',
            populates,
        },
    ]);
    const firestore = useSelector(state => state.firestore);
    const masjid = populate(firestore, 'Masjid', populates);
    return (
        <div>{JSON.parse(masjid)}</div>
    );
}

export default Example;