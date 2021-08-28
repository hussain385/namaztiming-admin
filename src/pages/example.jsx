import React from 'react';
import {populate, useFirestoreConnect} from "react-redux-firebase";
import {useSelector} from "react-redux";
import _ from 'lodash'

function Example(props) {
    const populates = [
        {child: 'adminId', root: 'users', childAlias: 'user'}, // replace owner with user object
    ];
    useFirestoreConnect([
        {
            collection: 'Masjid',
            populates,
        },
    ]);
    const firestore = useSelector(state => state.firestore);
    const masjid = populate(firestore, 'Masjid', populates);
    if (masjid) {
        return (
            _.map(masjid,(data, id) => {
                console.log(data, id)
                return <div>{data.name}</div>
            })
            // <div>{masjid}</div>
        );
    }
    return (
        <div>Loading...</div>
    )

}

export default Example;
