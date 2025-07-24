import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import axios from 'axios';
import edit from '../../assets/icons8-edit-24.png';

function Edit({listId, item, handleUpdateItem}) {
    const [show, setShow] = useState(false);
    const [checkedValue, setCheckedValue] = useState(item.pinned);
    const [inputValue, setInputValue] = useState(item.name);
    const [quantityValue, setQuantityValue] = useState(item.quantity);
    const handleClose = () => setShow(false);
    // I chose to reset values back to default in handleShow() because you could see the values
    // being resetted for a brief second in handleClose().
    const handleShow = () => {
        setCheckedValue(item.pinned);
        setInputValue(item.name);
        setQuantityValue(item.quantity);
        setShow(true);
    }
    
    const apiUrl = import.meta.env.VITE_API_URL;
    //CONSIDER CHANGING THIS APPROACH BY USING A REDUCER
    const handleSave = async () => {
        if (!inputValue || !quantityValue) {
            alert('Item\'s name or quantity is blank!')
            return;
        }

        await axios.put(apiUrl, {
            listId:listId,
            id:item._id,
            name:inputValue,
            quantity:quantityValue,
            pinned:checkedValue,
            completed:item.completed
        }).then(response => {
            // THIS APPROACH DOESN'T SAVE THE ITEM'S MOST RECENT updatedAt ATTRIBUTE FOR CLIENT SIDE!
            handleUpdateItem({
                ...item,
                name:inputValue,
                pinned:checkedValue,
                quantity:quantityValue,
                });
            // console.log(response.data.message);
          })
          .catch(error => {
            // console.error('Error updating item');
            alert(error.response.data.message);
          });
        handleClose();
    }

    return (
        <>
        <Button style={{all:'unset', cursor: item.completed ? 'default':'pointer', opacity:item.completed ? 0.4:1}} variant="outline-secondary" onClick={handleShow} size="sm" disabled={item.completed ? true:false}>
            <img src={edit} />
        </Button>
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Edit Item</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form>
                <Container>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Row>
                            <Col md={2} xs={2} >
                                <Form.Label>Pinned</Form.Label>
                                <div className="d-flex" style={{justifyContent: "center"}}>
                                    <Form.Check 
                                        type="switch" 
                                        aria-label="Check to pin" 
                                        checked={checkedValue} 
                                        onChange={(event) => setCheckedValue(event.target.checked)}
                                    />
                                </div> 
                            </Col>
                            <Col>
                                <Form.Label>Item's name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={inputValue}
                                    onChange={(event) => setInputValue(event.target.value)}
                                    autoFocus
                                />
                            </Col>
                            <Col>
                                <Form.Label>Quantity</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={quantityValue}
                                    onChange={(event) => setQuantityValue(Number(event.target.value))}
                                />
                            </Col>
                        </Row>
                    </Form.Group>
                </Container>
            </Form>
            </Modal.Body>
            <Modal.Footer>
            {/* <Button variant="secondary" onClick={handleClose}>
                Close
            </Button> */}
            <Button variant="primary" onClick={handleSave}>
                Save Changes
            </Button>
            </Modal.Footer>
        </Modal>
        </>
    );
}

export default Edit;