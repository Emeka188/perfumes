// Simple re-seed script for products
const Database = require('better-sqlite3');
const db = new Database('./db.sqlite');

const products = [
    {id:'p1', name:'Botanical Glow Moisturizer', price:6400, desc:'Lightweight daily moisturizer with shea and jojoba.', img:'assets/product1', variants:{size:['50ml','100ml']}},
    {id:'p2', name:'Riggs Luxury Perfume', price:3000, desc:"Luxurious perfumes for luxurious life's.", img:'assets/product2', variants:{size:['30ml','50ml']}},
    {id:'p3', name:'Aqua Perfumes', price:12000, desc:"Perfect if you're looking for a romantic formula.", img:'assets/product3', variants:{weight:['80g']}},
    {id:'p4', name:'NIVEA MEN-cool kick', price:9800, desc:'Kick of freshness-Cool care formula.', img:'assets/product4', variants:{size:['100ml']}},
    {id:'p5', name:'MyScent-eau de parfum', price:7500, desc:'Discover nature in a bottle of gold.', img:'assets/product5', variants:{pack:['3pcs']}},
    {id:'p6', name:'Herbal Body Scrub', price:1800, desc:'Exfoliating scrub with coconut sugar.', img:'assets/product6', variants:{size:['200g']}}
];

const insert = db.prepare('INSERT OR REPLACE INTO products (id,name,price,description,img,variants) VALUES (@id,@name,@price,@description,@img,@variants)');
for(const p of products) insert.run(p);
console.log('Seeded products.');
