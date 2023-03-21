const dotenv = require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// This function is still called test but it works perfectly fine
const testCreateProduct = async (data, id) => {
    const { title, desc, price } = data;
    console.log(price);
    // Here we convert the string you added in the form to a number
    // The decimal is removed as that is how stripe represents prices
    // i.e. 4.99 becomes 499
    const modifiedPrice = Number(price.replace(/\./g, ""));
    console.log(modifiedPrice);
    try {
        // Sends the create request to the stripe API
        const product = await stripe.products.create({
            id: id,
            name: title,
            description: desc    
        });

        console.log(product)

        // Store the response stripe sends back
        const priceResponse = await setProductPrice(id, modifiedPrice);
        if (priceResponse) {
            return { productId: priceResponse.id };
        } else {
            return false;
        }
    } catch (err) {
        console.log(err);
    }
}

// Stripe requires you create a "price" for each product
// Basically its another create call so we do that here
const setProductPrice = async (id, price) => {
    const newPrice = await stripe.prices.create({
        unit_amount_decimal: price,
        currency: 'usd',
        product: id
    });

    console.log(newPrice);

    return newPrice;
};


module.exports = {
    testCreateProduct
}