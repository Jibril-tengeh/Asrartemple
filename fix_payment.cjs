const fs = require('fs');

const path = 'src/pages/user/PaymentPage.tsx';
let content = fs.readFileSync(path, 'utf8');

const oldCall = `      await PaystackService.initializePaystackPayment(
        user.email,
        10000, // example amount in cents/kobo
        async () => {`;
const newCall = `      await PaystackService.initializePaystackPayment(
        user.email,
        10000, // example amount in cents/kobo
        'XOF', // default currency
        user.uid,
        async (reference) => {`;
content = content.replace(oldCall, newCall);

fs.writeFileSync(path, content);
