const destinations = [
  {id:"cox",name:"Cox's Bazar",country:"Bangladesh",region:"bangladesh",type:"Beach escape",tag:"Sea & sunshine",description:"Walk along one of the world's longest natural sandy sea beaches, enjoy ocean views and watch unforgettable sunsets.",image:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=85",best:"November – March"},
  {id:"sajek",name:"Sajek Valley",country:"Bangladesh",region:"bangladesh",type:"Mountain retreat",tag:"Cloud-kissed hills",description:"Wake up above the clouds, explore green hills and enjoy the peaceful scenery of the Chittagong Hill Tracts.",image:"https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=85",best:"October – April"},
  {id:"sylhet",name:"Sylhet",country:"Bangladesh",region:"bangladesh",type:"Nature & culture",tag:"Green countryside",description:"Discover rolling tea gardens, clear rivers, waterfalls and the beautiful green landscapes of northeastern Bangladesh.",image:"https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1000&q=85",best:"October – March"},
  {id:"sundarbans",name:"Sundarbans",country:"Bangladesh",region:"bangladesh",type:"Wildlife adventure",tag:"Into the wild",description:"Explore the world's largest mangrove forest by boat and experience a remarkable landscape of winding waterways and wildlife.",image:"https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1000&q=85",best:"November – February"},
  {id:"dubai",name:"Dubai",country:"United Arab Emirates",region:"world",type:"City adventure",tag:"Future meets tradition",description:"Experience iconic architecture, desert adventures, lively souks and spectacular city views in the UAE.",image:"https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1000&q=85",best:"November – March"},
  {id:"maldives",name:"Maldives",country:"Maldives",region:"world",type:"Island escape",tag:"Ocean paradise",description:"Find turquoise lagoons, white-sand beaches and quiet island moments in this Indian Ocean paradise.",image:"https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1000&q=85",best:"November – April"},
  {id:"paris",name:"Paris",country:"France",region:"world",type:"City & culture",tag:"The art of living",description:"Spend your days among beautiful boulevards, celebrated museums, charming cafés and timeless landmarks.",image:"https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000&q=85",best:"April – June, September – October"},
  {id:"switzerland",name:"Swiss Alps",country:"Switzerland",region:"world",type:"Mountain retreat",tag:"Alpine wonderland",description:"Discover dramatic mountain peaks, scenic train journeys, storybook villages and sparkling alpine lakes.",image:"https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1000&q=85",best:"June – September"},
  {id:"bali",name:"Bali",country:"Indonesia",region:"world",type:"Island & culture",tag:"Island of the gods",description:"Explore lush rice terraces, beautiful temples, tropical beaches and a rich local culture on this Indonesian island.",image:"https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000&q=85",best:"April – October"}
];

const grid=document.getElementById("destinationGrid");
const searchInput=document.getElementById("searchInput");
const regionSelect=document.getElementById("regionSelect");
const sortSelect=document.getElementById("sortSelect");
const resultsCount=document.getElementById("resultsCount");
const emptyState=document.getElementById("emptyState");
const dialog=document.getElementById("destinationDialog");
const dialogContent=document.getElementById("dialogContent");
const toast=document.getElementById("toast");
let activeFilter="all";
let saved=JSON.parse(localStorage.getItem("travelworld-saved")||"[]");
let toastTimer;

function escapeHTML(value){return String(value).replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));}
function showToast(message){toast.textContent=message;toast.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),2300);}
function updateSavedCount(){document.getElementById("savedCount").textContent=saved.length;}
function renderDestinations(){
  const query=searchInput.value.trim().toLowerCase();
  const region=regionSelect.value;
  let list=destinations.filter(place=>(activeFilter==="all"||place.region===activeFilter)&&(region==="all"||place.region===region)&&[place.name,place.country,place.type,place.tag].join(" ").toLowerCase().includes(query));
  if(sortSelect.value==="az")list.sort((a,b)=>a.name.localeCompare(b.name));
  resultsCount.textContent=list.length+" beautiful "+(list.length===1?"place":"places")+" to explore";
  emptyState.hidden=list.length!==0;
  grid.innerHTML=list.map(place=>`<article class="destination-card" data-id="${place.id}" tabindex="0" aria-label="Explore ${escapeHTML(place.name)}">
    <div class="card-image"><img src="${place.image}" alt="${escapeHTML(place.name)} landscape" loading="lazy"><span class="region-pill">${place.region==="bangladesh"?"🇧🇩 Bangladesh":"🌍 Worldwide"}</span><button class="favorite-btn ${saved.includes(place.id)?"saved":""}" data-favorite="${place.id}" aria-label="${saved.includes(place.id)?"Remove from":"Add to"} favorites"><i class="bi ${saved.includes(place.id)?"bi-heart-fill":"bi-heart"}"></i></button></div>
    <div class="card-body"><div class="card-meta"><span>${escapeHTML(place.type)}</span><span><i class="bi bi-geo-alt"></i> ${escapeHTML(place.country)}</span></div><h3>${escapeHTML(place.name)}</h3><p>${escapeHTML(place.description.slice(0,105))}…</p><div class="card-bottom"><span><i class="bi bi-sun"></i> ${escapeHTML(place.best)}</span><button data-details="${place.id}">Explore place <i class="bi bi-arrow-up-right"></i></button></div></div>
  </article>`).join("");
}
function toggleFavorite(id){saved=saved.includes(id)?saved.filter(item=>item!==id):[...saved,id];localStorage.setItem("travelworld-saved",JSON.stringify(saved));updateSavedCount();renderDestinations();showToast(saved.includes(id)?"Added to your saved places":"Removed from saved places");}
function openDetails(id){
  const place=destinations.find(item=>item.id===id);if(!place)return;
  dialogContent.innerHTML=`<img class="dialog-image" src="${place.image}" alt="${escapeHTML(place.name)}"><div class="dialog-body"><div class="eyebrow"><span></span> ${place.region==="bangladesh"?"BANGLADESH":"AROUND THE WORLD"} · ${escapeHTML(place.type.toUpperCase())}</div><h2>${escapeHTML(place.name)}</h2><p>${escapeHTML(place.description)}</p><p><strong>Best time to visit:</strong> ${escapeHTML(place.best)}</p><div class="dialog-actions"><button class="btn btn-primary" data-plan="${place.id}">Plan a visit <i class="bi bi-arrow-up-right"></i></button><button class="btn btn-dark" data-favorite="${place.id}"><i class="bi bi-heart"></i> Save place</button></div></div>`;
  dialog.showModal();
}
grid.addEventListener("click",event=>{
  const favorite=event.target.closest("[data-favorite]");
  if(favorite){event.stopPropagation();toggleFavorite(favorite.dataset.favorite);if(dialog.open)openDetails(favorite.dataset.favorite);return;}
  const details=event.target.closest("[data-details]");
  const card=event.target.closest(".destination-card");
  if(details)openDetails(details.dataset.details);else if(card)openDetails(card.dataset.id);
});
grid.addEventListener("keydown",event=>{if((event.key==="Enter"||event.key===" ")&&event.target.classList.contains("destination-card"))openDetails(event.target.dataset.id);});
document.getElementById("dialogClose").addEventListener("click",()=>dialog.close());
dialog.addEventListener("click",event=>{if(event.target===dialog)dialog.close();});
dialogContent.addEventListener("click",event=>{const button=event.target.closest("[data-plan]");if(button){const id=button.dataset.plan;document.getElementById("planDestination").value=id;dialog.close();document.getElementById("planner").scrollIntoView({behavior:"smooth"});}});
document.querySelectorAll(".filter-btn").forEach(button=>button.addEventListener("click",()=>{document.querySelectorAll(".filter-btn").forEach(item=>item.classList.remove("active"));button.classList.add("active");activeFilter=button.dataset.filter;regionSelect.value="all";renderDestinations();}));
searchInput.addEventListener("input",renderDestinations);
regionSelect.addEventListener("change",()=>{activeFilter="all";document.querySelectorAll(".filter-btn").forEach(item=>item.classList.toggle("active",item.dataset.filter==="all"));renderDestinations();});
sortSelect.addEventListener("change",renderDestinations);
document.getElementById("searchButton").addEventListener("click",()=>document.getElementById("destinations").scrollIntoView({behavior:"smooth"}));
document.getElementById("resetSearch").addEventListener("click",()=>{searchInput.value="";regionSelect.value="all";activeFilter="all";sortSelect.value="featured";document.querySelectorAll(".filter-btn").forEach(item=>item.classList.toggle("active",item.dataset.filter==="all"));renderDestinations();});
const planSelect=document.getElementById("planDestination");
destinations.forEach(place=>{const option=document.createElement("option");option.value=place.id;option.textContent=place.name+" — "+place.country;planSelect.appendChild(option);});
const dateInput=document.getElementById("planDate");dateInput.min=new Date().toISOString().split("T")[0];
document.getElementById("plannerForm").addEventListener("submit",event=>{
  event.preventDefault();
  const place=destinations.find(item=>item.id===planSelect.value);
  const date=dateInput.value;
  const email=document.getElementById("planEmail").value.trim();
  const travelers=document.getElementById("travelers").value;
  const subject=encodeURIComponent("My TravelWorld trip idea — "+place.name);
  const body=encodeURIComponent("Hello TravelWorld!\n\nI'd like to plan a trip.\nDestination: "+place.name+", "+place.country+"\nTravel date: "+date+"\nTravelers: "+travelers+"\nMy email: "+email+"\n\nPlease share some ideas.\n");
  document.getElementById("formSuccess").hidden=false;
  document.getElementById("formSuccess").textContent="Your trip enquiry is ready. Your email app will open so you can send it.";
  window.location.href="mailto:?subject="+subject+"&body="+body;
});
const menuToggle=document.getElementById("menuToggle"),navLinks=document.getElementById("navLinks");
menuToggle.addEventListener("click",()=>{const open=navLinks.classList.toggle("open");menuToggle.setAttribute("aria-expanded",String(open));menuToggle.innerHTML=open?'<i class="bi bi-x-lg"></i>':'<i class="bi bi-list"></i>';});
navLinks.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{navLinks.classList.remove("open");menuToggle.setAttribute("aria-expanded","false");menuToggle.innerHTML='<i class="bi bi-list"></i>';}));
document.getElementById("year").textContent=new Date().getFullYear();
updateSavedCount();renderDestinations();