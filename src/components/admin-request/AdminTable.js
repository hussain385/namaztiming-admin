import React, {useEffect, useState} from "react";
import {Modal, ModalTransition, useModal} from "react-simple-hook-modal";
import "./adminTable.css";
import "react-simple-hook-modal/dist/styles.css";
import {useFirestore} from "react-redux-firebase";
import Forms from "../Forms/Forms";
// import {useFirebase} from "react-redux-firebase"

const MyComponent = (props) => {
    const {isModalOpen, openModal, closeModal} = useModal();
    const firestore = useFirestore();
    // const firebase = useFirebase();
    return (
        <>
            <tr key={props.index}>
                <td>{props.index + 1}</td>
                <td>{props.item.masjidID}</td>
                <td>{props.item.userName}</td>
                <td>{props.item.userPhone}</td>
                <td style={{justifyContent: "center", textAlign: "center"}}>
                    <button onClick={openModal} className="buttonStyle">
                        View
                    </button>
                    <button
                        onClick={() => {
                            firestore.delete("adminRequest/" + props.item.id).catch((e) => {
                                console.log(e);
                            });
                        }}
                        className="buttonStyle"
                        style={{backgroundColor: "darkred", marginLeft: 15}}
                    >
                        Delete
                    </button>
                </td>
            </tr>
            <Modal
                id="any-unique-identifier"
                isOpen={isModalOpen}
                transition={ModalTransition.BOTTOM_UP}
            >
                <Forms closeModal={() => closeModal()} item={props.item}/>
            </Modal>
        </>
    );
};

const AdminTable = (props) => {
    const initDataShow =
        props.limit && props.bodyData
            ? props.bodyData.slice(0, Number(props.limit))
            : props.bodyData;

    const [dataShow, setDataShow] = useState(initDataShow);

    let pages = 1;

    let range = [];

    if (props.limit !== undefined) {
        let page = Math.floor(props.bodyData.length / Number(props.limit));
        pages = props.bodyData.length % Number(props.limit) === 0 ? page : page + 1;
        range = [...Array(pages).keys()];
    }

    const [currPage, setCurrPage] = useState(0);

    const selectPage = (page) => {
        const start = Number(props.limit) * page;
        const end = start + Number(props.limit);

        setDataShow(props.bodyData.slice(start, end));

        setCurrPage(page);
    };

    useEffect(() => {
        setDataShow(
            props.limit && props.bodyData
                ? props.bodyData.slice(0, Number(props.limit))
                : props.bodyData
        );
    }, [props.bodyData, props.limit]);

    return (
        <div>
            <div className="table-wrapper">
                <table>
                    {props.headData && props.renderHead ? (
                        <thead>
                        <tr>
                            {props.headData.map((item, index) =>
                                props.renderHead(item, index)
                            )}
                        </tr>
                        </thead>
                    ) : null}
                    {props.bodyData && props.renderBody ? (
                        <tbody>
                        {dataShow.map((item, index) => (
                            <MyComponent key={index} index={index} item={item}/>
                        ))}
                        </tbody>
                    ) : null}
                </table>
            </div>
            {pages > 1 ? (
                <div className="table__pagination">
                    {range.map((item, index) => (
                        <div
                            key={index}
                            className={`table__pagination-item ${
                                currPage === index ? "active" : ""
                            }`}
                            onClick={() => selectPage(index)}
                        >
                            {item + 1}
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    );
};

export default AdminTable;
