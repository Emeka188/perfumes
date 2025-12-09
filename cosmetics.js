// Cosmetics site main JS: product rendering, cart, modal, contact handlers
let PRODUCTS = [
    {id:'p1', name:'Botanical Glow Moisturizer', price:6400, desc:'Lightweight daily moisturizer with shea and jojoba.', img:'assets/product1', variants:{size:['50ml','100ml']}},
    {id:'p2', name:'Riggs Luxury Perfume', price:3000, desc:"Luxurious perfumes for luxurious life's.", img:'assets/product2', variants:{size:['30ml','50ml']}},
    {id:'p3', name:'Aqua Perfumes', price:12000, desc:"Perfect if you're looking for a romantic formula.", img:'assets/product3', variants:{weight:['80g']}},
    {id:'p4', name:'NIVEA MEN-cool kick', price:9800, desc:'Kick of freshness-Cool care formula.', img:'assets/product4', variants:{size:['100ml']}},
    {id:'p5', name:'MyScent-eau de parfum', price:7500, desc:'Discover nature in a bottle of gold.', img:'assets/product5', variants:{pack:['3pcs']}},
    {id:'p6', name:'Herbal Body Scrub', price:1800, desc:'Exfoliating scrub with coconut sugar.', img:'assets/product6', variants:{size:['200g']}}
];

// API base helper: if you deploy the API, set `window.AKUNNE_API_URL = 'https://api.example.com'`
// If not set, code will try: relative `/api/...` then `http://localhost:4000/api/...` as fallback.
const API_BASE = window.AKUNNE_API_URL || '';

async function apiFetch(path, options){
    // If explicit API_BASE provided, use it.
    if(API_BASE){
        return fetch(API_BASE.replace(/\/$/,'') + path, options);
    }
    // Try relative first (works when API is hosted on same origin)
    try{
        const r = await fetch(path, options);
        if(r.ok) return r;
    }catch(e){/* ignore */}
    // fallback to localhost:4000
    return fetch('http://localhost:4000' + path, options);
}

const formatN = v => '₦' + (v/1).toFixed(2);

// DOM
const productGrid = document.getElementById('productGrid');
const productModal = document.getElementById('productModal');
const modalBody = document.querySelector('.modal-body');
const cartDrawer = document.getElementById('cartDrawer');
const cartItemsEl = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const openCartBtn = document.getElementById('openCartBtn');
const closeCartBtn = document.getElementById('closeCart');
const checkoutBtn = document.getElementById('checkoutBtn');

let CART = JSON.parse(localStorage.getItem('akunne_cart')||'{}');

function saveCart(){
    localStorage.setItem('akunne_cart', JSON.stringify(CART));
    renderCart();
}

function renderProducts(){
    productGrid.innerHTML = '';
    PRODUCTS.forEach(p=>{
        const card = document.createElement('div'); card.className='card';
        // try JPG first, fallback to SVG if not present
        card.innerHTML = `
            <img src="${p.img}.jpg" onerror="this.onerror=null;this.src='${p.img}.svg'" alt="${p.name}">
            <h3>${p.name}</h3>
            <div class="price">${formatN(p.price)}</div>
            <div class="actions">
                <button class="btn ghost" data-id="${p.id}">Details</button>
                <button class="btn primary" data-buy="${p.id}">Add</button>
            </div>`;
        productGrid.appendChild(card);
    });
}

function openModal(product){
    // build variant UI
    let variantHTML = '';
    if(product.variants){
      Object.keys(product.variants).forEach(key=>{
        const opts = product.variants[key];
        variantHTML += `<label>${key}: <select id="variant_${key}">${opts.map(o=>`<option value="${o}">${o}</option>`).join('')}</select></label>`;
      });
    }

    modalBody.innerHTML = `
        <img class="modal-img" src="${product.img}.jpg" onerror="this.onerror=null;this.src='${product.img}.svg'" alt="${product.name}">
        <div>
            <h3>${product.name}</h3>
            <p class="muted">${product.desc}</p>
            <p class="price">${formatN(product.price)}</p>
            ${variantHTML}
            <p><label>Qty <input type="number" min="1" value="1" id="modalQty"></label></p>
            <div style="display:flex;gap:8px;margin-top:12px;"><button class="btn primary" id="modalAdd">Add to cart</button></div>
        </div>`;
    productModal.setAttribute('aria-hidden','false');
}

function closeModal(){
    productModal.setAttribute('aria-hidden','true');
}

function addToCart(id, qty=1, variantObj){
    const key = variantObj && Object.keys(variantObj).length ? `${id}::${JSON.stringify(variantObj)}` : id;
    CART[key] = (CART[key]||0) + qty;
    saveCart();
}

function renderCart(){
    // items
    cartItemsEl.innerHTML = '';
    let total=0, count=0;
    Object.keys(CART).forEach(id=>{
        const qty = CART[id];
        // support variant keys like id::{"size":"50ml"}
        const [baseId, variantPart] = id.split('::');
        const p = PRODUCTS.find(x=>x.id===baseId);
        if(!p) return;
        const variantLabel = variantPart ? ` <small>(${variantPart.replace(/\{|\}|\"/g,'')})</small>` : '';
        const line = document.createElement('div'); line.className='cart-item';
        line.innerHTML = `<img src="${p.img}.jpg" onerror="this.onerror=null;this.src='${p.img}.svg'" alt="${p.name}"><div style="flex:1"><div>${p.name}${variantLabel}</div><div class="muted">${formatN(p.price)} × ${qty}</div></div><div><button class='btn ghost' data-dec='${id}'>-</button><button class='btn ghost' data-inc='${id}'>+</button></div>`;
        cartItemsEl.appendChild(line);
        total += p.price * qty; count += qty;
    });
    cartCount.textContent = count;
    cartTotal.textContent = formatN(total);
}

// events
productGrid?.addEventListener('click', e=>{
    const id = e.target.dataset.id || e.target.dataset.buy;
    if(!id) return;
    if(e.target.dataset.id){
        const p = PRODUCTS.find(x=>x.id===id); openModal(p);
    } else if(e.target.dataset.buy){
        addToCart(id,1);
        alert('Added to cart');
    }
});

productModal.addEventListener('click', e=>{
    if(e.target.classList.contains('modal-close') || e.target===productModal) closeModal();
});

productModal.addEventListener('click', e=>{
        if(e.target.id==='modalAdd'){
                const qty = parseInt(document.getElementById('modalQty').value||1,10);
                const name = modalBody.querySelector('h3').textContent;
                const prod = PRODUCTS.find(p=>p.name===name);
                if(prod){
                    // collect variant selections
                    const variantSelections = {};
                    if(prod.variants){
                        Object.keys(prod.variants).forEach(k=>{ const el = document.getElementById('variant_'+k); if(el) variantSelections[k]=el.value; });
                    }
                    addToCart(prod.id, qty, variantSelections);
                    closeModal();
                }
        }
        // image zoom toggle
        if(e.target.classList && e.target.classList.contains('modal-img')){
            e.target.classList.toggle('zoom');
        }
});

openCartBtn.addEventListener('click', ()=>{ cartDrawer.setAttribute('aria-hidden','false'); });
closeCartBtn.addEventListener('click', ()=>{ cartDrawer.setAttribute('aria-hidden','true'); });

cartItemsEl.addEventListener('click', e=>{
    const dec = e.target.dataset.dec; const inc = e.target.dataset.inc;
    if(dec){ CART[dec] = Math.max(0, (CART[dec]||0) -1); if(CART[dec]===0) delete CART[dec]; saveCart(); }
    if(inc){ CART[inc] = (CART[inc]||0) +1; saveCart(); }
});

checkoutBtn.addEventListener('click', async ()=>{
        // attempt server-side checkout, fallback to local simulation
        const items = {...CART};
        const totalRaw = cartTotal.textContent.replace(/[^0-9.-]/g,'');
        const total = Math.round(parseFloat(totalRaw) * 100) || 0;
        const payload = {items, total};
        let ok = false;
        try{
            // first try relative path
            let res = await fetch('/api/orders', {method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify(payload)});
            if(!res.ok){
                // try localhost default port 4000
                res = await fetch('http://localhost:4000/api/orders', {method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify(payload)});
            }
            if(res.ok){
                const data = await res.json();
                ok = true;
                localStorage.setItem('akunne_last_order', JSON.stringify({id:data.id, items, total, created:new Date().toISOString()}));
                alert('Order placed — ID: '+data.id);
            }
        }catch(err){ console.warn('Order API failed', err); }

        if(!ok){
            // local fallback
            const order = {id: 'ORD'+Date.now(), items, total, created: new Date().toISOString()};
            localStorage.setItem('akunne_last_order', JSON.stringify(order));
            alert('Thank you! Your order has been placed (local simulation).');
        }
        CART = {}; saveCart();
        cartDrawer.setAttribute('aria-hidden','true');
});

// contact form
const contactForm = document.getElementById('contactForm');
const contactResult = document.getElementById('contactResult');
const contactSave = document.getElementById('contactSave');
contactForm.addEventListener('submit', e=>{
    e.preventDefault();
    const data = new FormData(contactForm);
    const payload = Object.fromEntries(data.entries());
        // try server send then fallback
        contactResult.classList.remove('sr-only'); contactResult.textContent='Sending...';
        (async ()=>{
            try{
                let res = await fetch('/api/contact', {method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify(payload)});
                if(!res.ok) res = await fetch('http://localhost:4000/api/contact', {method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify(payload)});
                if(res.ok){ contactResult.textContent='Message sent — we will reply within 24 hours.'; contactForm.reset(); localStorage.removeItem('contact_draft'); setTimeout(()=>{ contactResult.classList.add('sr-only'); },4000); return; }
            }catch(err){ console.warn('Contact API failed', err); }
            // fallback
            setTimeout(()=>{ contactResult.textContent='Message saved locally — we will respond soon.'; contactForm.reset(); localStorage.removeItem('contact_draft'); setTimeout(()=>{ contactResult.classList.add('sr-only'); },4000); },900);
        })();
});
contactSave.addEventListener('click', ()=>{
    const data = new FormData(contactForm); localStorage.setItem('contact_draft', JSON.stringify(Object.fromEntries(data.entries()))); alert('Draft saved locally');
});

// newsletter
const newsletterForm = document.getElementById('newsletterForm');
newsletterForm.addEventListener('submit', e=>{ e.preventDefault(); const em = document.getElementById('newsletterEmail').value; if(!em) return alert('Enter email'); localStorage.setItem('newsletter', em); alert('Subscribed — check your email!'); newsletterForm.reset(); });

// theme
const themeToggle = document.getElementById('themeToggle');
function applyTheme(t){ if(t==='dark'){ document.documentElement.classList.add('dark'); themeToggle.textContent='Light'; themeToggle.setAttribute('aria-pressed','true'); } else { document.documentElement.classList.remove('dark'); themeToggle.textContent='Dark'; themeToggle.setAttribute('aria-pressed','false'); } localStorage.setItem('akunne_theme', t); }
themeToggle.addEventListener('click', ()=>{ applyTheme(document.documentElement.classList.contains('dark') ? 'light' : 'dark'); });
applyTheme(localStorage.getItem('akunne_theme')||'light');

// try to load products from API (fallback to local PRODUCTS)
async function fetchProductsFromApi(){
    try{
        let res = await fetch('/api/products');
        if(!res.ok) res = await fetch('http://localhost:4000/api/products');
        if(res.ok){
            const data = await res.json();
            if(Array.isArray(data) && data.length){ PRODUCTS = data.map(d=> ({...d, variants: d.variants || {}})); renderProducts(); renderCart(); }
        }
    }catch(err){ /* ignore, fallback to local */ }
}

document.getElementById('year').textContent = new Date().getFullYear();
fetchProductsFromApi().finally(()=>{ renderProducts(); renderCart(); });

// keyboard accessibility
window.addEventListener('keydown', e=>{ if(e.key==='Escape'){ closeModal(); cartDrawer.setAttribute('aria-hidden','true'); } });