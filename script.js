const state = {
  route: location.hash.replace("#","") || "home",
  unit: localStorage.getItem("unit") || "",
  category: "Todos",
  cart: JSON.parse(localStorage.getItem("cart") || "[]"),
  user: JSON.parse(localStorage.getItem("user") || "null"),
  paymentError: false
};

const units = [
  {id:"centro", name:"Curitiba — Centro", address:"Rua das Raízes, 120", time:"11h às 23h"},
  {id:"boqueirao", name:"Curitiba — Boqueirão", address:"Av. Nordeste, 845", time:"11h às 23h"},
  {id:"xaxim", name:"Curitiba — Xaxim", address:"Rua do Sertão, 430", time:"11h às 22h30"},
  {id:"batel", name:"Curitiba — Batel", address:"Alameda do Sol, 90", time:"11h às 00h"}
];

const products = [
  {id:1,name:"Baião da Casa",cat:"Pratos",price:29.90,emoji:"🍛",desc:"Arroz, feijão-de-corda, carne de sol, queijo coalho e temperos da casa."},
  {id:2,name:"Carne de Sol Raiz",cat:"Pratos",price:36.90,emoji:"🥩",desc:"Carne de sol grelhada, mandioca dourada e vinagrete."},
  {id:3,name:"X-Sertão",cat:"Lanches",price:24.90,emoji:"🍔",desc:"Blend bovino, queijo coalho, cebola caramelizada e molho da casa."},
  {id:4,name:"Cuscuz Nordestino",cat:"Pratos",price:19.90,emoji:"🌽",desc:"Cuscuz de milho com ovos, queijo coalho e carne de sol."},
  {id:5,name:"Mandioca Crocante",cat:"Lanches",price:14.90,emoji:"🍟",desc:"Mandioca frita crocante com molho especial."},
  {id:6,name:"Suco de Cajá",cat:"Bebidas",price:9.90,emoji:"🥤",desc:"Suco natural de cajá."},
  {id:7,name:"Café Nordestino",cat:"Bebidas",price:6.90,emoji:"☕",desc:"Café coado servido quente."},
  {id:8,name:"Cartola da Casa",cat:"Sobremesas",price:15.90,emoji:"🍌",desc:"Banana, queijo coalho, canela e açúcar."},
];

function money(v){ return v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"}); }
function save(){ localStorage.setItem("cart",JSON.stringify(state.cart)); if(state.unit)localStorage.setItem("unit",state.unit); }
function unit(){ return units.find(u=>u.id===state.unit) || units[0]; }
function cartCount(){return state.cart.reduce((s,i)=>s+i.qty,0)}
function cartTotal(){return state.cart.reduce((s,i)=>s+i.price*i.qty,0)}
function go(route){ location.hash=route; state.route=route; render(); window.scrollTo({top:0,behavior:"smooth"}); }

function header(){
 return `<header class="topbar"><nav class="nav">
   <button class="brand" onclick="go('home')"><span class="brand-mark">🌵</span><span>Raízes do Nordeste</span></button>
   <div class="nav-links">
     <button class="nav-btn desktop-only" onclick="go('menu')">Cardápio</button>
     <button class="nav-btn desktop-only" onclick="go('promos')">Promoções</button>
     <button class="nav-btn desktop-only" onclick="go('loyalty')">Fidelidade</button>
     <button class="icon-btn" onclick="go('cart')">🛒 <span class="cart-badge">${cartCount()}</span></button>
     <button class="icon-btn" onclick="go('profile')">👤</button>
   </div>
 </nav></header>`;
}
function footer(){
 return `<footer class="footer"><div class="footer-inner">
   <div><strong>🌵 Raízes do Nordeste</strong><div class="small">Sabor, tradição e tecnologia.</div></div>
   <div class="small">Privacidade • Atendimento • Projeto Front-end</div>
 </div></footer>`;
}
function page(title,content,lead=""){
 return `<main><div class="section-head"><div><h2>${title}</h2>${lead?`<p class="lead">${lead}</p>`:""}</div></div>${content}</main>`;
}

function home(){
 const u=unit();
 return `<main>
   <section class="hero"><div class="hero-content">
     <div class="eyebrow">Sabor que vem das nossas raízes</div>
     <h1>Comida boa, do nosso jeito.</h1>
     <p>Escolha sua unidade, monte seu pedido e acompanhe tudo pelo celular ou pelo nosso atendimento digital.</p>
     <div class="actions"><button class="btn btn-primary" onclick="go('units')">Fazer pedido</button><button class="btn btn-secondary" onclick="go('menu')">Ver cardápio</button></div>
   </div></section>
   <section class="section">
     <div class="banner row"><div><strong>📍 Sua unidade</strong><div class="small">${u.name} • ${u.address}</div></div><button class="btn btn-outline" onclick="go('units')">Trocar</button></div>
   </section>
   <section class="section"><div class="section-head"><div><h2>🔥 Promoções</h2><p class="lead">Ofertas selecionadas para hoje.</p></div><button class="btn btn-outline" onclick="go('promos')">Ver todas</button></div>
     <div class="grid">${products.slice(0,3).map((p,i)=>productCard(p,i)).join("")}</div>
   </section>
   <section class="section"><div class="card card-body"><div class="row"><div><span class="pill">⭐ Fidelidade</span><h2 style="margin:10px 0 4px">Você tem 1.250 pontos</h2><p class="muted">Faltam 250 pontos para liberar um benefício.</p></div><button class="btn btn-primary" onclick="go('loyalty')">Ver recompensas</button></div></div></section>
 </main>`;
}
function productCard(p,i=0){
 return `<article class="card"><div class="food-image ${i%3===1?"alt":i%3===2?"blue":""}">${p.emoji}</div><div class="card-body">
   <div class="row"><div class="food-title">${p.name}</div><span class="pill">${p.cat}</span></div>
   <p class="muted small">${p.desc}</p><div class="row"><span class="price">${money(p.price)}</span><button class="btn btn-primary" onclick="addToCart(${p.id})">Adicionar</button></div>
 </div></article>`;
}
function unitsPage(){
 return page("Escolha sua unidade",`<div class="unit-list">${units.map(u=>`<button class="unit ${state.unit===u.id?"selected":""}" onclick="selectUnit('${u.id}')"><div class="row"><strong>${u.name}</strong>${state.unit===u.id?"<span class='pill'>Selecionada</span>":""}</div><p class="muted">${u.address}</p><span class="small">🕐 ${u.time}</span></button>`).join("")}</div><div class="actions"><button class="btn btn-primary" onclick="go('menu')">Continuar para o cardápio</button></div>`);
}
function selectUnit(id){state.unit=id;save();toast("Unidade selecionada.");go("menu")}
function menu(){
 const cats=["Todos","Lanches","Pratos","Bebidas","Sobremesas"];
 const list=state.category==="Todos"?products:products.filter(p=>p.cat===state.category);
 return page("Cardápio",`<div class="banner"><strong>📍 ${unit().name}</strong><div class="small">${unit().address} • ${unit().time}</div></div>
 <div class="section"><div class="catbar">${cats.map(c=>`<button class="btn ${state.category===c?"active":"btn-outline"}" onclick="setCat('${c}')">${c}</button>`).join("")}</div></div>
 <div class="grid section">${list.map((p,i)=>productCard(p,i)).join("")}</div>`);
}
function setCat(c){state.category=c;render()}
function addToCart(id){
 const p=products.find(x=>x.id===id); const found=state.cart.find(x=>x.id===id);
 if(found) found.qty++; else state.cart.push({...p,qty:1});
 save();toast(`${p.name} foi adicionado ao carrinho.`);
 render();
}
function changeQty(id,d){
 const item=state.cart.find(x=>x.id===id); if(!item)return; item.qty+=d;
 if(item.qty<=0) state.cart=state.cart.filter(x=>x.id!==id); save();render();
}
function cart(){
 if(!state.cart.length)return page("Seu carrinho",`<div class="card card-body" style="text-align:center"><div style="font-size:60px">🛒</div><h2>Seu carrinho está vazio</h2><p class="muted">Escolha alguns sabores para começar.</p><button class="btn btn-primary" onclick="go('menu')">Ir para o cardápio</button></div>`);
 return page("Carrinho",`<div class="layout-2"><section class="card card-body">${state.cart.map(i=>`<div class="cart-line"><div><strong>${i.name}</strong><div class="small muted">${money(i.price)} cada</div></div><div class="qty"><button onclick="changeQty(${i.id},-1)">−</button><strong>${i.qty}</strong><button onclick="changeQty(${i.id},1)">+</button></div><strong>${money(i.price*i.qty)}</strong></div>`).join("")}<div class="actions"><button class="btn btn-outline" onclick="go('menu')">Continuar comprando</button></div></section>
 <aside class="total-box"><div class="small">Resumo do pedido</div><h2>${money(cartTotal())}</h2><p>Retirada em <strong>${unit().name}</strong>.</p><button class="btn btn-primary" style="width:100%" onclick="go('login')">Continuar</button></aside></div>`);
}
function login(){
 return page("Identificação",`<div class="form"><div class="field"><label>Nome</label><input id="name" placeholder="Seu nome"></div><div class="field"><label>E-mail</label><input id="email" type="email" placeholder="voce@email.com"></div><div class="field"><label>Telefone</label><input id="phone" placeholder="(41) 99999-9999"></div>
 <label style="display:flex;gap:9px;align-items:flex-start;font-size:13px;margin:10px 0 18px"><input id="consent" type="checkbox" style="margin-top:4px"> Concordo com o uso dos meus dados para cadastro e atendimento, conforme o aviso de privacidade.</label>
 <button class="btn btn-primary" style="width:100%" onclick="saveUser()">Continuar</button><div class="small muted" style="margin-top:12px">Os dados são utilizados apenas para as finalidades informadas nesta interface.</div></div>`);
}
function saveUser(){
 const name=document.querySelector("#name").value.trim(), email=document.querySelector("#email").value.trim(), phone=document.querySelector("#phone").value.trim(), consent=document.querySelector("#consent").checked;
 if(!name||!email||!phone){toast("Preencha todos os campos.");return}
 if(!consent){toast("É necessário aceitar o aviso de privacidade.");return}
 state.user={name,email,phone};localStorage.setItem("user",JSON.stringify(state.user));go("checkout");
}
function checkout(){
 return page("Checkout",`<div class="layout-2"><section class="card card-body"><span class="pill">👤 ${state.user?.name||"Cliente"}</span><h3>Retirada</h3><div class="unit selected"><strong>${unit().name}</strong><p class="muted">${unit().address}</p><span class="small">Seu pedido será preparado nesta unidade.</span></div><h3>Pedido</h3>${state.cart.map(i=>`<div class="row small" style="padding:7px 0"><span>${i.qty}× ${i.name}</span><strong>${money(i.price*i.qty)}</strong></div>`).join("")}</section><aside class="total-box"><span class="small">Total</span><h2>${money(cartTotal())}</h2><button class="btn btn-primary" style="width:100%" onclick="go('payment')">Ir para pagamento</button></aside></div>`);
}
function payment(){
 return page("Pagamento",`<div class="form"><div class="banner"><strong>🔒 Pagamento externo</strong><p class="small">Esta atividade utiliza uma simulação. Nenhum pagamento real será realizado.</p></div><div class="field"><label>Método</label><select id="method"><option>PIX</option><option>Cartão</option></select></div><div class="field"><label>Identificador da transação</label><input id="tx" value="RAIZ-${Date.now().toString().slice(-8)}" readonly></div>
 ${state.paymentError?'<div class="error">Não foi possível concluir o pagamento. Revise os dados ou tente novamente.</div>':""}
 <div class="actions"><button class="btn btn-primary" style="width:100%" onclick="processPayment()">Enviar para serviço externo</button></div><p class="small muted">O sistema envia a solicitação ao serviço externo e aguarda o retorno de aprovação ou recusa.</p></div>`);
}
function processPayment(){
 if(!document.querySelector("#method").value){state.paymentError=true;render();return}
 state.paymentError=false; localStorage.setItem("lastOrder",JSON.stringify({number:"RN-"+Math.floor(1000+Math.random()*9000),total:cartTotal(),unit:unit().name,time:new Date().toLocaleString("pt-BR")}));go("success");
}
function success(){
 const o=JSON.parse(localStorage.getItem("lastOrder")||"{}");
 return page("Pedido confirmado",`<div class="card card-body" style="text-align:center"><div style="font-size:64px">✅</div><h2>Pagamento aprovado</h2><p class="muted">Seu pedido <strong>${o.number}</strong> foi enviado para a unidade.</p><div class="banner"><strong>${o.unit}</strong><div class="small">Total: ${money(o.total)}</div></div><div class="actions" style="justify-content:center"><button class="btn btn-primary" onclick="go('tracking')">Acompanhar pedido</button><button class="btn btn-outline" onclick="go('home')">Voltar ao início</button></div></div>`);
}
function tracking(){
 return page("Acompanhamento do pedido",`<div class="layout-2"><section class="card card-body"><div class="row"><div><span class="pill">Pedido RN-2487</span><h2 style="margin:8px 0">Estamos preparando seu pedido</h2></div><span style="font-size:38px">🍛</span></div><div class="status-track section">
 ${[
 ["done","Pedido recebido","Pagamento confirmado."],
 ["current","Em preparação","A cozinha está preparando seu pedido."],
 ["","Pronto para retirada","Aguardando finalização."],
 ["","Retirado","Pedido entregue ao cliente."]
 ].map(s=>`<div class="status ${s[0]}"><div class="status-dot">${s[0]==="done"?"✓":"•"}</div><div><strong>${s[1]}</strong><div class="small muted">${s[2]}</div></div></div>`).join("")}</div></section>
 <aside class="card card-body"><span class="pill">📍 Retirada</span><h3>${unit().name}</h3><p class="muted">${unit().address}</p><button class="btn btn-outline" onclick="go('home')">Voltar</button></aside></div>`);
}
function loyalty(){
 return page("Fidelidade",`<div class="grid"><div class="card card-body"><span class="pill">⭐ Saldo</span><div class="points">1.250</div><p class="muted">pontos disponíveis</p></div><div class="card card-body"><span class="pill">🎯 Próximo benefício</span><h2>1.500 pontos</h2><p class="muted">Faltam 250 pontos para liberar a recompensa.</p></div></div><div class="section"><h2>Recompensas</h2><div class="grid">${[
 ["☕","Café Nordestino","500 pontos"],
 ["🍟","Mandioca Crocante","900 pontos"],
 ["🍛","Baião da Casa","1.500 pontos"]
].map((r,i)=>`<div class="reward ${i===2?"locked":""}"><div style="font-size:42px">${r[0]}</div><strong>${r[1]}</strong><p class="small muted">${r[2]}</p><button class="btn btn-outline" ${i===2?"disabled":""}>${i===2?"Bloqueado":"Resgatar"}</button></div>`).join("")}</div></div>`);
}
function promos(){
 return page("Promoções e campanhas",`<div class="grid">${[
 ["🔥","Combo Raízes","Baião + Suco de Cajá por R$ 34,90.","34,90"],
 ["🌽","Quarta do Cuscuz","10% de desconto no Cuscuz Nordestino.","10% OFF"],
 ["⭐","Bônus de pontos","Ganhe pontos extras em pedidos acima de R$ 50.","+100 pts"]
].map(x=>`<div class="card card-body"><div style="font-size:48px">${x[0]}</div><h3>${x[1]}</h3><p class="muted">${x[2]}</p><span class="pill">${x[3]}</span></div>`).join("")}</div>`);
}
function profile(){
 const u=state.user;
 return page("Minha conta",u?`<div class="card card-body"><span class="pill">👤 Cliente</span><h2>${u.name}</h2><p class="muted">${u.email}<br>${u.phone}</p><div class="actions"><button class="btn btn-outline" onclick="go('privacy')">Privacidade e dados</button><button class="btn btn-danger" onclick="logout()">Sair</button></div></div>`:`<div class="card card-body" style="text-align:center"><h2>Entre para acessar sua conta</h2><button class="btn btn-primary" onclick="go('login')">Entrar / cadastrar</button></div>`);
}
function logout(){state.user=null;localStorage.removeItem("user");toast("Sessão encerrada.");go("home")}
function privacy(){
 return page("Privacidade e LGPD",`<div class="layout-2"><section class="card card-body"><h3>Como usamos seus dados</h3><p>Os dados informados no cadastro são utilizados para identificar o cliente, processar o atendimento e acompanhar o pedido, de acordo com as finalidades apresentadas nesta interface.</p><h3>Seu consentimento</h3><p>O consentimento é solicitado de forma clara antes do avanço do cadastro. O usuário pode consultar estas informações posteriormente.</p><h3>Dados utilizados</h3><ul><li>Nome</li><li>E-mail</li><li>Telefone</li><li>Informações relacionadas ao pedido</li></ul></section><aside class="card card-body"><span class="pill">🔐 Privacidade</span><p class="muted">A interface evita solicitar dados desnecessários para o fluxo demonstrado.</p><button class="btn btn-outline" onclick="go('profile')">Voltar ao perfil</button></aside></div>`);
}
function toast(msg){const e=document.createElement("div");e.className="toast";e.textContent=msg;document.body.appendChild(e);setTimeout(()=>e.remove(),2600)}
function render(){
 const app=document.querySelector("#app");
 let content="";
 switch(state.route){
  case"home":content=home();break;case"units":content=unitsPage();break;case"menu":content=menu();break;case"cart":content=cart();break;
  case"login":content=login();break;case"checkout":content=checkout();break;case"payment":content=payment();break;case"success":content=success();break;
  case"tracking":content=tracking();break;case"loyalty":content=loyalty();break;case"promos":content=promos();break;case"profile":content=profile();break;
  case"privacy":content=privacy();break;default:content=home();
 }
 app.innerHTML=`${header()}${content}${footer()}`;
}
window.addEventListener("hashchange",()=>{state.route=location.hash.replace("#","")||"home";render()});
render();
