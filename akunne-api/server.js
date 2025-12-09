const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const dbPath = path.join(__dirname,'db.sqlite');
const db = new Database(dbPath);

// Serve static files for local testing (optional)
app.use('/assets', express.static(path.join(__dirname,'..','assets')));

// Prepared statements
const stmtGetAllProducts = db.prepare('SELECT * FROM products');
const stmtGetProduct = db.prepare('SELECT * FROM products WHERE id = ?');
const stmtInsertOrder = db.prepare('INSERT INTO orders (id,items,total,created_at) VALUES (?,?,?,?)');
const stmtGetOrder = db.prepare('SELECT * FROM orders WHERE id = ?');
const stmtInsertContact = db.prepare('INSERT INTO contacts (name,email,message,created_at) VALUES (?,?,?,?)');

app.get('/api/products', (req,res)=>{
  try{
    const rows = stmtGetAllProducts.all();
    const parsed = rows.map(r=> ({...r, variants: r.variants ? JSON.parse(r.variants) : {}}));
    res.json(parsed);
  }catch(err){ console.error(err); res.status(500).json({error:'Server error'}); }
});

app.get('/api/products/:id', (req,res)=>{
  try{
    const row = stmtGetProduct.get(req.params.id);
    if(!row) return res.status(404).json({error:'Not found'});
    row.variants = row.variants ? JSON.parse(row.variants) : {};
    res.json(row);
  }catch(err){ console.error(err); res.status(500).json({error:'Server error'}); }
});

app.post('/api/orders', (req,res)=>{
  try{
    const {items, total} = req.body;
    if(!items || (typeof total === 'undefined')) return res.status(400).json({error:'Missing items or total'});
    const id = 'ORD'+Date.now();
    const created = new Date().toISOString();
    const totalInt = Number(total) || 0;
    const insert = db.transaction(()=>{
      stmtInsertOrder.run(id, JSON.stringify(items), totalInt, created);
    });
    insert();
    res.json({ok:true, id});
  }catch(err){ console.error(err); res.status(500).json({error:'Server error'}); }
});

app.get('/api/orders/:id', (req,res)=>{
  try{
    const row = stmtGetOrder.get(req.params.id);
    if(!row) return res.status(404).json({error:'Not found'});
    row.items = row.items ? JSON.parse(row.items) : [];
    res.json(row);
  }catch(err){ console.error(err); res.status(500).json({error:'Server error'}); }
});

// list recent orders (admin/debug)
app.get('/api/orders', (req,res)=>{
  try{
    const rows = db.prepare('SELECT * FROM orders ORDER BY created_at DESC LIMIT 50').all();
    const parsed = rows.map(r=> ({...r, items: r.items ? JSON.parse(r.items) : []}));
    res.json(parsed);
  }catch(err){ console.error(err); res.status(500).json({error:'Server error'}); }
});

app.post('/api/contact', (req,res)=>{
  try{
    const {name,email,message} = req.body;
    if(!name || !email || !message) return res.status(400).json({error:'Missing fields'});
    const info = stmtInsertContact.run(name,email,message,new Date().toISOString());
    res.json({ok:true, id: info.lastInsertRowid});
  }catch(err){ console.error(err); res.status(500).json({error:'Server error'}); }
});

// health
app.get('/api/health', (req,res)=>{
  res.json({ok:true, time: new Date().toISOString(), db: dbPath});
});

const port = process.env.PORT || 4000;
app.listen(port, ()=> console.log('Akunne API listening on', port));
