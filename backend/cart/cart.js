const database = require ('../database/database');
const books = require ('../books/books');

// Returns all cart items; no specified order
const getCartItems = async () => {
    const cartResponse = await database.readEntryArray('cart', {}, {});
    if (cartResponse) {
        return cartResponse;
    }
}

// Adds item to cart collection
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

// Used to empty the cart ALSO decrements the available inventory of
// each book by the amount the user purchased
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

// Updates the quantity of an item in the cart
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

// Increments the quantity of an item in the cart by 1
// Think pressing Add to Cart a second time vs using the quantity dropdowns
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


// deletes and item from the cart
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