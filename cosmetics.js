// Cosmetics site main JS: product rendering, cart, modal, contact handlers
const PRODUCTS = [
    {id:'p1', name:'Botanical Glow Moisturizer', price:2490, desc:'Lightweight daily moisturizer with shea and jojoba.', img:'assets/product1.svg'},
    {id:'p2', name:'Neroli Facial Oil', price:3200, desc:'Nourishing facial oil for radiant skin.', img:'assets/product2.svg'},
    {id:'p3', name:'Clay & Charcoal Soap', price:1200, desc:'Deep-cleanse bar soap with kaolin clay.', img:'assets/product3.svg'},
    {id:'p4', name:'Rose Hydrating Mist', price:980, desc:'Refreshing facial mist for instant glow.', img:'assets/product4.svg'},
    {id:'p5', name:'Lip Butter Trio', price:750, desc:'Shea butter lip balms — three flavours.', img:'assets/product5.svg'},
    {id:'p6', name:'Herbal Body Scrub', price:1800, desc:'Exfoliating scrub with coconut sugar.', img:'assets/product6.svg'}
];

const formatN = v => '₦' + (v/100).toFixed(2);

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
        card.innerHTML = `
            <img src="${p.img}" alt="${p.name}">
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
    modalBody.innerHTML = `
        <img src="${product.img}" alt="${product.name}">
        <div>
            <h3>${product.name}</h3>
            <p class="muted">${product.desc}</p>
            <p class="price">${formatN(product.price)}</p>
            <p><label>Qty <input type="number" min="1" value="1" id="modalQty"></label></p>
            <div style="display:flex;gap:8px;margin-top:12px;"><button class="btn primary" id="modalAdd">Add to cart</button></div>
        </div>`;
    productModal.setAttribute('aria-hidden','false');
}

function closeModal(){
    productModal.setAttribute('aria-hidden','true');
}

function addToCart(id, qty=1){
    const prod = PRODUCTS.find(p=>p.id===id); if(!prod) return;
    CART[id] = (CART[id]||0) + qty;
    saveCart();
}

function renderCart(){
    // items
    cartItemsEl.innerHTML = '';
    let total=0, count=0;
    Object.keys(CART).forEach(id=>{
        const qty = CART[id];
        const p = PRODUCTS.find(x=>x.id===id);
        if(!p) return;
        const line = document.createElement('div'); line.className='cart-item';
        line.innerHTML = `<img src="${p.img}" alt="${p.name}"><div style="flex:1"><div>${p.name}</div><div class="muted">${formatN(p.price)} × ${qty}</div></div><div><button class='btn ghost' data-dec='${id}'>-</button><button class='btn ghost' data-inc='${id}'>+</button></div>`;
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
        if(prod){ addToCart(prod.id, qty); closeModal(); }
    }
});

openCartBtn.addEventListener('click', ()=>{ cartDrawer.setAttribute('aria-hidden','false'); });
closeCartBtn.addEventListener('click', ()=>{ cartDrawer.setAttribute('aria-hidden','true'); });

cartItemsEl.addEventListener('click', e=>{
    const dec = e.target.dataset.dec; const inc = e.target.dataset.inc;
    if(dec){ CART[dec] = Math.max(0, (CART[dec]||0) -1); if(CART[dec]===0) delete CART[dec]; saveCart(); }
    if(inc){ CART[inc] = (CART[inc]||0) +1; saveCart(); }
});

checkoutBtn.addEventListener('click', ()=>{
    // simulate order
    const order = {id: 'ORD'+Date.now(), items: {...CART}, total: cartTotal.textContent, created: new Date().toISOString()};
    localStorage.setItem('akunne_last_order', JSON.stringify(order));
    CART = {}; saveCart();
    alert('Thank you! Your order has been placed (simulation).');
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
    // simulate send
    contactResult.classList.remove('sr-only'); contactResult.textContent='Sending...';
    setTimeout(()=>{ contactResult.textContent='Message sent — we will reply within 24 hours.'; contactForm.reset(); localStorage.removeItem('contact_draft'); setTimeout(()=>{ contactResult.classList.add('sr-only'); },4000); },900);
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

// init
document.getElementById('year').textContent = new Date().getFullYear();
renderProducts(); renderCart();

// keyboard accessibility
window.addEventListener('keydown', e=>{ if(e.key==='Escape'){ closeModal(); cartDrawer.setAttribute('aria-hidden','true'); } });