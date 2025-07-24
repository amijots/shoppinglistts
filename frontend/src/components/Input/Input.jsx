import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './Input.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ToggleButton from 'react-bootstrap/ToggleButton';
import { useState } from 'react';
import axios from 'axios';
import pinned from '../../assets/icons8-pin-24.png';

const apiUrl = import.meta.env.VITE_API_URL;
function Input({listId, addItem}) {
  const [checkedValue, setCheckedValue] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [quantityValue, setQuantityValue] = useState(1);

  const handleClick = async (event) => {
    if (!inputValue || !quantityValue) {
      alert('Item\'s name or quantity is blank!')
      return;
    }
    
    const response = await axios.post(apiUrl, {
      listId:listId,
      name:inputValue,
      quantity:quantityValue,
      pinned:checkedValue
    }).catch(error => {
        // console.error('Error adding data to backend');
        alert(error.response.data.message);
        // alert(`Can't add item because ${error.response.data.message.toLowerCase()}`);
    });

    // The standard way to catch null and undefined simultaneously
    if (response != null) {
      addItem([response.data]);
      setCheckedValue(false);
      setInputValue('');
      setQuantityValue(1);
    }
    
    
  };
  return (
    <>
      <Container fluid className='header'>
        <Row style={{flex: 1}}>
          <Col xs={12} md={10} className='my-2'>
            <InputGroup>
              <ToggleButton
                // className="mb-2"
                id="toggle-check"
                type="checkbox"
                variant="outline-secondary"
                checked={checkedValue}
                value="1"
                size="sm"
                style={{"borderTopLeftRadius": "5px","borderBottomLeftRadius": "5px"}}
                onChange={(e) => setCheckedValue(e.currentTarget.checked)}
                ><img src={pinned} />
              </ToggleButton>
              {/* <InputGroup.Checkbox aria-label="Checkbox for pinning item" checked={checkedValue} onChange={(event) => setCheckedValue(event.target.checked)}/> */}
              <Form.Control type="text" placeholder="Item's name" className="w-50" value={inputValue} onChange={(event) => setInputValue(event.target.value)}/>
              <Form.Control type="number" id="typeNumber" min="1" placeholder="#" value={quantityValue} onChange={(event) => setQuantityValue(Number(event.target.value))}/>
              {/* <Button variant="primary">Add</Button> */}
            </InputGroup>
          </Col>
          <Col md={2} className='my-2'>
            <InputGroup>
              <Button variant="primary" onClick={handleClick} style={{flex: 1}}>Add</Button>
            </InputGroup>
          </Col>
        </Row>
      </Container>
      
    </>
  );
}

export default Input;