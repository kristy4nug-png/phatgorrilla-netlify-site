const fs = require('fs');

process.env.PRINTIFY_API_TOKEN = process.env.PRINTIFY_API_TOKEN || '';
process.env.PRINTIFY_SHOP_ID = process.env.PRINTIFY_SHOP_ID || '27674090';

if (!process.env.PRINTIFY_API_TOKEN) {
  throw new Error('Set PRINTIFY_API_TOKEN in your local environment before running this sandbox helper.');
}

const code = fs.readFileSync('./netlify/functions/create-checkout-session.js', 'utf8');
const getLivePrintifyProduct = new Function(
  'require',
  'process',
  code + '; return getLivePrintifyProduct;'
)(require, process);

(async () => {
  const res = await getLivePrintifyProduct('6a19dd531babc69aaa0e422e', '12022');
  console.log('getLivePrintifyProduct Result:', JSON.stringify(res, null, 2));
})();
