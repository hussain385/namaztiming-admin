import React from 'react';
import {
    Autocomplete, Box, Grid, TextField,
} from '@mui/material';

const GroupAnnoucemnet = () => {
    return (
        <div>
            <h2 className="page-header">Masjid List</h2>
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card__body">
                            <TextField
                                label="Masjid Name"
                                name="name"
                                value={values.name}
                                onChange={(event) => {
                                    setFieldValue('name', event.target.value);
                                }}
                                error={touched.name && Boolean(errors.name)}
                                helperText={touched.name && errors.name}
                                fullWidth
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GroupAnnoucemnet;
