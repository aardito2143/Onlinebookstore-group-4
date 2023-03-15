const dotenv = require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const testCreateProduct = async (data, id) => {
    const { title, desc, price } = data;
    try {
        const product = await stripe.products.create({
            id: id,
            name: title,
            description: desc    
        });

        console.log(product)

        const priceResponse = await setProductPrice(id, price);
        if (priceResponse) {
            return { productId: priceResponse.id };
        } else {
            return false;
        }
    } catch (err) {
        console.log(err);
    }
}

const setProductPrice = async (id, price) => {
    const newPrice = await stripe.prices.create({
        unit_amount_decimal: 199,
        currency: 'usd',
        product: id
    });

    console.log(newPrice);

    return newPrice;
};


module.exports = {
    testCreateProduct
}