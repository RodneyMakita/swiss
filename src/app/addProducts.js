const admin = require('firebase-admin');
const serviceAccount = require('./serviceKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const products = [
  { name: 'DORITOS CORN CHPS 145G/150G', price: 'R21,45', imageUrl: 'https://i5-images.massmart.co.za/asr/d6002ea6-66cb-494e-80b5-cd82d80ea80d.8575a73a7cb1897cca338b76955dad89.jpeg?odnHeight=255&odnWidth=278&odnBg=FFFFFF', description: 'Description 1' },

  
];

products.forEach(async (product) => {
  try {
    await db.collection('products').add(product);
    console.log('Product added:', product.name);
  } catch (error) {
    console.error('Error adding product:', error);
  }
});
