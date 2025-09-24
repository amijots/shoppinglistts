const express = require("express");
const List = require("../models/List");
const BSON = require("bson");

const router = express.Router();

//adds an item
router.post(
    "/",
    async(req, res) => {
        const {listId, name, quantity, pinned} = req.body;
        try {
            let listDoc = await List.findOne({listId: listId});
            //listId doesn't exist since this is the first time it's being made
            //not ideal since the list creation should be handled separately but this will do for now
            
            if (!listDoc) {
                // return res.status(400).json({message: "List doesn't exist!"});
                listDoc = new List({
                    listId: listId, 
                    list: [
                        {
                            name, 
                            quantity, 
                            pinned
                        }
                    ]
                })
                await listDoc.save();
                console.log(listDoc);
                return res.status(200).json({message: `${name} successfully added!`})
            }

            //listId exists, so we first check if the item already exists
            let item = listDoc.list.find(item => item.name === name);
            if (item) {
                return res.status(400).json({message: "Item already exists in the list!"});
            }

            listDoc.list.push({name, quantity, pinned})
            await listDoc.save();
            item = listDoc.list.find(item => item.name === name);
            console.log(listDoc);
            return res.status(201).json(item);

        } catch (err) {
            // console.log(err);
            res.status(500).send("Error in saving item!");
        }
    }
);

//updates an item
router.put(
    "/",
    async(req, res) => {
        const {listId, id, name, quantity, pinned, completed} = req.body;
        try {
            let listDoc = await List.findOne({listId: listId});
            if (!listDoc) {
                return res.status(400).json({message: "List couldn't be found!"});
            }

            const nid = BSON.ObjectId.createFromHexString(id);
            let item = listDoc.list.find(item => item._id.equals(nid));
            if (!item) {
                return res.status(400).json({message: "Item doesn't exist! Please try a different item"});
            }

            // if the updated name is different from the name in the database, then check if the new name isn't already taken
            if (item.name !== name) {
                let nameAvailable = listDoc.list.find(item => item.name === name);
                if (nameAvailable) {
                    return res.status(400).json({message: "Item already exists! Please update the item with a different name"});
                }
            }
        
            item.name = name;
            item.quantity = quantity;
            item.pinned = pinned;
            item.completed = completed;
            await listDoc.save();
            // console.log(item);
            res.status(200).json({message: `${name} successfully updated`});

        } catch (err) {
            // console.log(err);
            res.status(500).send("Error in updating item!");
        }
    }
)

//updates a list's name
router.put(
    "/:listId/:listName",
    async(req, res) => {
        const {listId, listName} = req.params;
        try {
            let listDoc = await List.findOne({listId: listId});
            //listId doesn't exist since this is the first time it's being made
            //not ideal since the list creation should be handled separately but this will do for now
            
            if (!listDoc) {
                listDoc = new List({
                    listId: listId, 
                    listName: listName,
                })
                // console.log(listDoc);
                await listDoc.save();
                return res.status(200).json({message: `List successfully named to ${listName}!`})
            }

            listDoc.listName = listName;
            await listDoc.save();
            // console.log(`List successfully renamed to ${listName}`);
            res.status(200).json({message: `List successfully renamed to ${listName}`})

        } catch (err) {
            // console.log(err);
            res.status(500).send("Error in updating list's name!");
        }
    }
)

//deletes a list
router.delete(
    "/:listId",
    async(req, res) => {
        const {listId} = req.params;
        try {
            let listDoc = await List.findOne({listId: listId});
            if (!listDoc) {
                return res.status(400).json({message: "List doesn't exist or couldn't be found!"});
            }
            const result = await List.deleteOne({listId: listId});
            if (result.deletedCount !== 1) {
                return res.status(400).json({message: "List didn't get deleted! Please try again"});
            }
            // console.log(`List: ${listId} deleted`); 
            res.status(200).json({message: `List successfully deleted`})
        } catch (err) {
            // console.log(err);
            res.status(500).send("Error in deleting list");
        }
    }
)

//deletes an item
router.delete(
    "/:listId/:itemId",
    async(req, res) => {
        const {listId, itemId} = req.params;
        try {
            let listDoc = await List.findOne({listId: listId});
            if (!listDoc) {
                return res.status(400).json({message: "List couldn't be found!"});
            }

            const nid = BSON.ObjectId.createFromHexString(itemId);
            let itemIndex = listDoc.list.findIndex(item => item._id.equals(nid));
            if (itemIndex === -1) {
                return res.status(400).json({message: "Item doesn't exist! Please try refreshing"});
            }
            
            const result = await listDoc.list.splice(itemIndex, 1);
            if (result.length === 0) {
                return res.status(400).json({message: "Item didn't get deleted! Please try again"});
            } 

            await listDoc.save();
            // console.log(`List ${listId}, Item ${itemId} deleted`); 
            res.status(200).json({message: `Item successfully deleted`})

        } catch (err) {
            // console.log(err);
            res.status(500).send("Error in deleting item");
        }
    }
)

//gets list
router.get(
    "/:listId", 
    async(req, res) => {
        const {listId} = req.params;
        try {
            let listDoc = await List.findOne({listId: listId});
            res.json(listDoc);
        } catch (e) {
            res.status(500).json({message: "Error in retrieving list!"})
        }
        
    }
)

//gets single item
router.get(
    "/:listId/:name", 
    async(req, res) => {
        const {listId, name} = req.params;
        try {
            let listDoc = await List.findOne({listId: listId});
            if (!listDoc) {
                return res.status(400).json({message: "List couldn't be found!"});
            }

            let item = listDoc.list.find(item => item.name === name);
            if (!item) {
                return res.status(400).json({message: "Item doesn't exist! Please try a different item"});
            }

            res.json(item);
        } catch (e) {
            res.status(500).json({message: "Error in retrieving an item!"})
        }
    }
)

module.exports = router;