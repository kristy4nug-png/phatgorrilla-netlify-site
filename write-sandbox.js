const fs = require('fs');

process.env.PRINTIFY_API_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzN2Q0YmQzMDM1ZmUxMWU5YTgwM2FiN2VlYjNjY2M5NyIsImp0aSI6IjRiZjAyY2U2MzFiM2RkMzRjNDc3ZjE0NDI2MjkyY2NkZGU1Njk4ZjZmZTVkMTZkNDlkY2FmOWVkYzNmNDU4MjVhNzc2OWI4NzExNjc1OGNiIiwiaWF0IjoxNzgwMjE2NjgxLjAzMDQ3MywibmJmIjoxNzgwMjE2NjgxLjAzMDQ3NSwiZXhwIjoxODExNzUyNjgxLjAyNTAxOSwic3ViIjoiMjczOTYyMzAiLCJzY29wZXMiOlsic2hvcHMubWFuYWdlIiwic2hvcHMucmVhZCIsImNhdGFsb2cucmVhZCIsIm9yZGVycy5yZWFkIiwib3JkZXJzLndyaXRlIiwicHJvZHVjdHMucmVhZCIsInByb2R1Y3RzLndyaXRlIiwid2ViaG9va3MucmVhZCIsIndlYmhvb2tzLndyaXRlIiwidXBsb2Fkcy5yZWFkIiwidXBsb2Fkcy53cml0ZSIsInByaW50X3Byb3ZpZGVycy5yZWFkIiwidXNlci5pbmZvIl19.f5C-YzqWXpbvsAOQA-r45yrI5Odj2ZAZIoGdSSbSClCTR1JPorx_peWvZ8bwCOrNtYfWD4mlXTZkjWJVHADVGV9xxWNjz47II-fhgke08qHVbR9UzzfVj-WqWblYjOxbcs3HskhWYoshsGvNtkfrKgTWd2gU6aANc7ro8daZgwZtdDMaT4aau4WDCOCFZ73oWruhcH3HybpjB6JleIgbE10W4V24Cy19HZv2oRXbgx1lx2wbKq2wFO14B703OG9vN3k0kQE4cAjXdeKtWRzrnFU3Cinl6UOBoAYuuL5E5Byoms8BeNkA258FPWWEwAwWBUdKocPDiVr1iKKHqAw2l7UGFrT0EgqSdAGKrCBeHGgzcAw--zo7D8JO6mGKYsyfQ1YCRWHg2bGTO3YI_zoKLwt4NQYm5iYyOVI57fxpQasVzxdZZKvhply_Y-w0V1g3_wLnlMlOEVK4_4q9msxnYFxAZ3iu3topWtWqdEjkU-wPHMv9ame50ERwEAEXs13WxUN0S6SZEbOmbQ9Zf_EBEGNjey32hn9XTRz9MGY3194U7ayDD9YnTDrEG3XDbjTwmQpcKExgG-EzymHEa6PHknJv1r9X30jDdTdlrmyq8SGwNoMAEqs1AbDnXtDFxU_-Roi6S2C9d1Ib-ZrOLrY5nCmbcIo2CnnYejHAwBkiTdA";
process.env.PRINTIFY_SHOP_ID = "27674090";

const code = fs.readFileSync('./netlify/functions/create-checkout-session.js', 'utf8');

const testScript = `
${code.substring(0, code.indexOf('exports.handler'))}

async function test() {
  try {
    const res = await getLivePrintifyProduct("6a19dd531babc69aaa0e422e", "12022");
    console.log("getLivePrintifyProduct Result:", JSON.stringify(res, null, 2));
  } catch (err) {
    console.error("Internal function failed:", err);
  }
}
test();
`;

fs.writeFileSync('./test-sandbox.js', testScript);
console.log("Workspace sandbox script written.");
