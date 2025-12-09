// Simple re-seed script for products
const Database = require('better-sqlite3');
const db = new Database('./db.sqlite');

const products = [
  {id:'p1', name:'Botanical Glow Moisturizer', price:2490, description:'Lightweight daily moisturizer with shea and jojoba.', img:'assets/product1.jpg', variants: JSON.stringify({size:['50ml','100ml']})},
  {id:'p2', name:'Neroli Facial Oil', price:3200, description:'Nourishing facial oil for radiant skin.', img:'assets/product2.jpg', variants: JSON.stringify({size:['30ml','50ml']})},
  {id:'p3', name:'Clay & Charcoal Soap', price:1200, description:'Deep-cleanse bar soap with kaolin clay.', img:'assets/product3.jpg', variants: JSON.stringify({weight:['80g']})},
  {id:'p4', name:'Rose Hydrating Mist', price:980, description:'Refreshing facial mist for instant glow.', img:'assets/product4.jpg', variants: JSON.stringify({size:['100ml']})},
  {id:'p5', name:'Lip Butter Trio', price:750, description:'Shea butter lip balms — three flavours.', img:'assets/product5.jpg', variants: JSON.stringify({pack:['3pcs']})},
  {id:'p6', name:'Herbal Body Scrub', price:1800, description:'Exfoliating scrub with coconut sugar.', img:'assets/product6.jpg', variants: JSON.stringify({size:['200g']})}
];

const insert = db.prepare('INSERT OR REPLACE INTO products (id,name,price,description,img,variants) VALUES (@id,@name,@price,@description,@img,@variants)');
for(const p of products) insert.run(p);
console.log('Seeded products.');
