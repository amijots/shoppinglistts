import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Edit from '../Edit/Edit.js';
import Badge from 'react-bootstrap/Badge';
import pinned from '../../assets/icons8-pin-24.png';
import trash from '../../assets/icons8-trash-24.png';
import {useState} from 'react'
import axios from 'axios';

interface ListItem {
  name: string;
  quantity: number;
  pinned: boolean;
  completed: boolean;
  _id: string;
}
interface ListProps {
  listId: string|undefined;
  item: ListItem;
  deleteItem: (itemId:string) => void;
  handleUpdateItem: (item: ListItem) => void;
}

function List({listId, item, deleteItem, handleUpdateItem}: ListProps) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [checkedValue, setCheckedValue] = useState(item.completed);
  
  const handleChecked = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setCheckedValue(e.target.checked);
    await axios.put(apiUrl, {
        listId:listId,
        id:item._id,
        name:item.name,
        quantity:item.quantity,
        pinned:item.pinned,
        completed:e.target.checked
    }).then(response => {
        // THIS APPROACH DOESN'T SAVE THE ITEM'S MOST RECENT updatedAt ATTRIBUTE FOR CLIENT SIDE!
        handleUpdateItem({...item, completed: e.target.checked});
        // console.log(response.data.message);
      })
      .catch(error => {
        // console.error('Error updating item');
        setCheckedValue(!e.target.checked);
        alert(error.response.data.message);
      });
  
    

  }
  return (
    <ListGroup as="ul" className="my-3 logo" variant="flush">
        <ListGroup.Item as="li" className="d-flex justify-content-between align-items-start">
          <div>
            <Form.Check inline aria-label="Check to pin" checked={checkedValue} onChange={(event) => handleChecked(event)}/>
            <span className={item.completed ? 'text-muted' : ''}>{item.name}</span> <Badge bg="secondary" pill>{item.quantity}</Badge> {item.pinned ? <img src={pinned} className="img-fluid" alt="pinned image" />:""}
          </div>
          <div> 
            <Edit listId={listId} item={item} handleUpdateItem={handleUpdateItem}></Edit>
            <Button style={{all:'unset', cursor: item.pinned ? 'default':'pointer', opacity:item.pinned ? 0.4:1}} variant="outline-danger" size="sm" onClick={() => deleteItem(item._id)} disabled={item.pinned ? true:false}>
              <img src={trash} />
            </Button>
          </div>
        </ListGroup.Item>
    </ListGroup>
    
    
  );
}

export default List;