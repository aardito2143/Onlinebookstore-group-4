const database = require ('../database/database');
const books = require ('../books/books');

const getCartItems = async () => {
    const cartResponse = await database.readEntryArray('cart', {}, {});
    if (cartResponse) {
        return cartResponse;
    }
}

const addItemToCart = async (data) => {
    console.log(data);
    const {
        title,
        author,
        genre,
        desc,
        cost,
        id,
        price,
        quantity,
        avail_inventory
    } = data;

    const payload = {
        title: title,
        author: author,
        genre: genre,
        desc: desc,
        cost: cost,
        id: id,
        price: price,
        quantity: quantity,
        avail_inventory: avail_inventory
    }

    try {
        const addReponse = await database.createEntry('cart', payload);
        if (addReponse) {
            console.log(addReponse);
            return true;
        }
    } catch (err) {
        console.log(err);
        return false;
    }
}

const clearCart = async () => {
    console.log("Decrementing the available inventory for each item...");
    const cart = await getCartItems();
    const updatedBooks = await Promise.all(cart.map(async (item) => {
        await books.updateBookInventory(item.title, item.quantity);
    }));
    console.log(updatedBooks);
    try {
        const deleteResponse = await database.deleteAll('cart', {});
        if (deleteResponse) {
            return deleteResponse;
        } else {
            return false;
        }
    } catch (err) {
        console.log(err);
        return false;
    }
}

const updateQuantity = async (id, newQuantity) => {
    try {
        const updateResponse = await database.updateEntry('cart', { id: id }, 'set', Number(newQuantity), 'quantity');
        if (updateResponse) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.log(err);
        return false;
    }
}

const incrementQuantity = async (id) => {
    try {
        const updateResponse = await database.updateEntry('cart', { id: id }, 'inc', 1, 'quantity');
        if (updateResponse) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.log(err);
        return false;
    }
}

const deleteItem = async (id) => {
    try {
        const deleteResponse = await database.deleteEntry('cart', { id: id });
        if (deleteResponse) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        return false;
    }
}

module.exports = {
    addItemToCart,
    getCartItems,
    clearCart,
    updateQuantity,
    incrementQuantity,
    deleteItem
}