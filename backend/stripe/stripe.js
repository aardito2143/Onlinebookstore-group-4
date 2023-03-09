const dotenv = require('dotenv').config();
const stripe = require('stripe')('pk_test_kqHC9ZEH7shB7jdWTNbkluqm');

const products = stripe.products.list({
    limit: 3,
});

console.log(products);