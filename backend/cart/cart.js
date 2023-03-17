const database = require ('../database/database');

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
        quantity
    } = data;

    const payload = {
        title: title,
        author: author,
        genre: genre,
        desc: desc,
        cost: cost,
        id: id,
        price: price,
        quantity: quantity
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

module.exports = {
    addItemToCart,
    getCartItems
}