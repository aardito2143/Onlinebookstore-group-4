import { loadStripe } from '@stripe/stripe-js';

let stripePromise;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe("pk_test_kqHC9ZEH7shB7jdWTNbkluqm");
  }
  return stripePromise;
};

export default getStripe;
