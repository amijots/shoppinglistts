import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Input from './components/Input/Input';
import List from './components/List/List';
import Redirect from './components/Redirect/Redirect';
import DeleteList from './components/DeleteList/DeleteList';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import './App.css'


const Main = () => {
  return (
    <>
      {/* <Navbar></Navbar> */}
      <Routes>
        {/* delete this when you add other parts/paths to website (if you ever do...) */}
        <Route path="/" element={<Redirect/>} />
        <Route path="/list" element={<Redirect/>} />
        <Route path="/list/:listId" element={<Checklist/>} />
        {/* <Route path="/nothome" element={<NotHome/>} /> */}
      </Routes>
    </>
  );
}

function Checklist() {
  interface ShoppingList {
  listId: string;
  listName: string; 
  list: ListItem[];
  }
  interface ListItem {
    name: string;
    quantity: number;
    pinned: boolean;
    completed: boolean;
    _id: string;
  }

  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const {listId} = useParams<string>(); //This works but then I need to change name of listId state variable
  // const params = useParams();
  // const [listId, setlistId] = useState(params.listId);
  const [items, setItems] = useState<ListItem[]>([]);
  const [name, setName] = useState<string>("");
  const [pinnedItems, setPinned] = useState<ListItem[]>([]);
  const [completedItems, setCompleted] = useState<ListItem[]>([]);

  

  const addItem = (allItems: ListItem[]) => {
    let itemsList: ListItem[] = [...items]
    let pinnedList: ListItem[] = [...pinnedItems]
    let completedList: ListItem[] = [...completedItems]
    
    allItems.forEach((item: ListItem) => {
      if (item.completed) {
        completedList.push(item);
      } else if (item.pinned) {
        pinnedList.push(item);
      } else {
        itemsList.push(item)
      }
    });

    setItems(itemsList);
    setPinned(pinnedList);
    setCompleted(completedList);
  }
  
  useEffect(() => {
    axios.get<ShoppingList>(`${apiUrl}${listId}`)
      .then(response => {
        // console.log(response.data);
        setName(response.data.listName);
        setPrevName(response.data.listName);
        addItem(response.data.list);
        // setItems(response.data);
      })
      .catch(error => {
        // console.error('Error fetching data:', error);
        // alert(error.response.data.message);
      });
  }, []);

  const handleDeleteItem = (itemId: string) => {
    setItems(items.filter((t) => t._id !== itemId));
    setPinned(pinnedItems.filter((t) => t._id !== itemId));
    setCompleted(completedItems.filter((t) => t._id !== itemId));
  }

  const handleUpdateItem = (item: ListItem) => {
    items.forEach((i) => {
      if (i._id === item._id) {
        // i have to do this since we can't mutate state directly :(
        if (item.pinned) {     
          setPinned([...pinnedItems, item]);
          setItems(items.filter((t) => t._id !== item._id));
        } else if (item.completed) {
          setCompleted([...completedItems, item]);
          setItems(items.filter((t) => t._id !== item._id));
        } else {
          setItems(items.map((i) => i._id === item._id ? item : i));
        }
        // ends the loop
        return;
      }
    })

    pinnedItems.forEach((i) => {
      if (i._id === item._id) {
        // item is no longer pinned
        if (!item.pinned) {
          setPinned(pinnedItems.filter((t) => t._id !== item._id));
          if (item.completed) {
            setCompleted([...completedItems, item]);
          } else {
            setItems([...items, item]);
          }  
        } else if (item.completed) {
          setCompleted([...completedItems, item]);
          setPinned(pinnedItems.filter((t) => t._id !== item._id));
        } else {
          setPinned(pinnedItems.map((i) => i._id === item._id ? item : i));
        }
        // ends the loop
        return; 
      }
    })

    completedItems.forEach((i) => {
      if (i._id === item._id) {
        if (!item.completed) {
          setCompleted(completedItems.filter((t) => t._id !== item._id));
          if (item.pinned) {
            setPinned([...pinnedItems, item]);
          } else {
            setItems([...items, item]);
          }
        } else {
          setCompleted(completedItems.map((i) => i._id === item._id ? item : i));
        }
        // ends the loop
        return;   
      }
    })


    // setItems(
    //   // REMEMBER THAT THIS "items.map((i) => {i._id === item._id ? item : i });"
    //   // IS INVALID BECAUSE THE {} IN AN ARROW FUNCTION NEEDS AN EXPLICIT RETURN.
    //   // THE ABOVE LINE OF CODE WOULD RETURN undefined.
    //   // THIS IS ALSO VALID "items.map((i) => {return i._id === item._id ? item : i });"
    //   items.map((i) => i._id === item._id ? item : i)
    // );
    // // the issue is that item doesn't get moved to the completed list, when I refresh, the item
    // // is in the completed list because of addItem(). I need to delete it from items and move
    // // it to completed list. 
    // setPinned(pinnedItems.map((i) => i._id === item._id ? item : i));
    // setCompleted(completedItems.map((i) => i._id === item._id ? item : i));
  }

  const deleteItem = async (itemId:string) => {
    await axios.delete(`${apiUrl}${listId}/${itemId}`)
      .then(() => {
        // console.log(response.data.message);
        handleDeleteItem(itemId)
      })
      .catch(error => {
        // console.error(`Error deleting item with ID ${itemId}`);
        alert(error.response.data.message);
      });
  }

  const deleteList = async () => {
    await axios.delete(`${apiUrl}${listId}`)
      .then(response => {
        // console.log(response.data.message);
        navigate(`/list/`, { replace: true });
      })
      .catch(error => {
        // console.error(`Error deleting list`);
        alert(error.response.data.message);
      });
  }

  // used to compare that the new name in the box is different than old name (trying to reduce PUT calls)
  const [prevName, setPrevName] = useState<string>("");
  const saveListName = async () => {
    await axios.put(`${apiUrl}${listId}/${name}`)
      .then(response => {
        setPrevName(name);
      })
      .catch(error => {
        // console.error(`Error saving list's name`);
        alert(error.response.data.message);
      });
  }

  return (
    <>
      <div style={{display: "flex", justifyContent: "space-between", flexDirection: "row"}}  >
        <h1><input
          className='blue-outline title-input'
          type="text"
          value={name || ""}
          placeholder="Untitled List"
          onChange={(e) => setName(e.target.value)}
          onBlur={(name === "" ? () => setName(prevName) : (prevName !== name ? saveListName : () => {}))}
          style={{border:'none', color: name === "" ? '#666': 'black'}}
        /></h1>
        <DeleteList deleteList={deleteList}></DeleteList>
      </div>

      <Input listId={listId} addItem={addItem}></Input>
      
      {/* I realized this makes a ListGroup for each item, vs making a ListGroup for pinnedItems, items, and completedItems */}
      <div className='items'>
        {pinnedItems.map((item) => (
              <List key={item._id} listId={listId} item={item} deleteItem={deleteItem} handleUpdateItem={handleUpdateItem}></List>
            ))
          }
        
        {items.length === 0 && pinnedItems.length === 0 ? (
            <div className='message'>Add a new item to get started!</div>
          ) : (
            items.map((item) => (
              <List key={item._id} listId={listId} item={item} deleteItem={deleteItem} handleUpdateItem={handleUpdateItem}></List>
            ))
          )}
      </div>

      {completedItems.map((item) => (
          <List key={item._id} listId={listId} item={item} deleteItem={deleteItem} handleUpdateItem={handleUpdateItem}></List>
        ))
      }

      <Container fluid className='new-list'>
        <Row style={{flex: 1, flexDirection: 'row-reverse'}}>
          <Col  md={2} className='my-2'>
            <InputGroup>
            {/* Needs to be href and not navigate because when the user goes a page back, 
                href will reload the page but navigate will not.  */}
              <Button variant="secondary" style={{flex: 1}} href="/list/">New List</Button>
            </InputGroup>
          </Col>
        </Row>
      </Container>
       
    </>
  )
}

export default Main
