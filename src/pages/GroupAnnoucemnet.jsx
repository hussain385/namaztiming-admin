import React from 'react';
import {TextField} from '@mui/material';

const GroupAnnoucemnet = () => {
    return (
        <div>
            <h2 className="page-header">Masjid List</h2>
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card__body">
                            <TextField
                                label="Public Annoucement"
                                name="annoucement"
                                sx={{width: '100%'}}
                            />
                            <TextField
                                label="Message"
                                name="userMessage"
                                fullWidth
                                multiline
                                rows={7.5}
                                style={{marginTop: '20px'}}
                            />
                            <button
                                style={{
                                    paddingRight: 10,
                                    paddingLeft: 10,
                                    width: '100%',
                                    color: 'white',
                                    marginTop: '10px',
                                    backgroundColor: 'green',
                                    borderRadius: 7,
                                    height: 30,
                                }}
                            >
                                <p>Send</p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GroupAnnoucemnet;
