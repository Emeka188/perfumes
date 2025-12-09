const Database = require('better-sqlite3');
const db = new Database('./db.sqlite');

// create tables
db.exec(`
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT,
  price INTEGER,
  description TEXT,
  img TEXT,
  variants TEXT
);
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  items TEXT,
  total INTEGER,
  created_at TEXT
);
CREATE TABLE IF NOT EXISTS contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT,
  message TEXT,
  created_at TEXT
);
`);

const products = [
  {id:'p1', name:'Botanical Glow Moisturizer', price:2490, description:'A lightweight daily moisturizer that absorbs quickly to hydrate and restore radiance. Enriched with shea butter and jojoba oil for soft, smooth skin.', img:'assets/product1.jpg', variants: JSON.stringify({size:['50ml','100ml']})},
  {id:'p2', name:'Neroli Facial Oil', price:3200, description:'Cold-pressed neroli and jojoba blend to nourish dry skin and deliver a luminous, even tone. Use a few drops morning and night.', img:'assets/product2.jpg', variants: JSON.stringify({size:['30ml','50ml']})},
  {id:'p3', name:'Clay & Charcoal Soap', price:1200, description:'Clarifying bar soap formulated with kaolin clay and activated charcoal to draw out impurities while preserving natural moisture.', img:'assets/product3.jpg', variants: JSON.stringify({weight:['80g']})},
  {id:'p4', name:'Rose Hydrating Mist', price:980, description:'A refreshing hydrating mist with rose water and glycerin to soothe and revive skin anytime, perfect for setting makeup or a mid-day boost.', img:'assets/product4.jpg', variants: JSON.stringify({size:['100ml']})},
  {id:'p5', name:'Lip Butter Trio', price:750, description:'Small, buttery lip balms made with shea and cocoa butters — three nourishing flavours to keep lips soft and protected.', img:'assets/product5.jpg', variants: JSON.stringify({pack:['3pcs']})},
  {id:'p6', name:'Herbal Body Scrub', price:1800, description:'Exfoliating scrub with coconut sugar and botanical oils to slough away dry skin and reveal smoother, brighter skin.', img:'assets/product6.jpg', variants: JSON.stringify({size:['200g']})}
];

const insert = db.prepare('INSERT OR REPLACE INTO products (id,name,price,description,img,variants) VALUES (@id,@name,@price,@description,@img,@variants)');
const now = new Date().toISOString();
for(const p of products){ insert.run({...p}); }
console.log('DB initialized with sample products.');
