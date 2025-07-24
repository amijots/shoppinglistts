import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import bigTrash from '../../assets/icons8-trash-can-56.png';

function DeleteList({deleteList}) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
        <Button style={{all:'unset', cursor:'pointer', opacity:1}} variant="outline-danger" size="sm" onClick={handleShow}>
            <img src={bigTrash}/>
        </Button>
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Delete List</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to delete this list? This will permanently delete the list!</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                Close
                </Button>
                <Button variant="danger" onClick={() => {
                    handleClose();
                    deleteList();
                }}>
                Delete
                </Button>
            </Modal.Footer>
        </Modal>
    </>
  );
}

export default DeleteList;