/* Sketchfab oEmbed thumbnails: use a local gallery image as fallback if unavailable. */
const ceramicFallback='../assets/images/marta-anglada/Marta%20Anglada%20-%20gallery%20test%206.png';
const ceramicThumbs=new Map();
async function getCeramicThumbnail(model){
  if(ceramicThumbs.has(model))return ceramicThumbs.get(model);
  const request=fetch('https://sketchfab.com/oembed?url='+encodeURIComponent('https://sketchfab.com/models/'+model),{mode:'cors'})
    .then(response=>{if(!response.ok)throw Error('Thumbnail unavailable');return response.json()})
    .then(data=>typeof data.thumbnail_url==='string'&&data.thumbnail_url.startsWith('https://')?data.thumbnail_url:ceramicFallback)
    .catch(()=>ceramicFallback);
  ceramicThumbs.set(model,request);
  return request;
}
function setCeramicPreview(img,model){
  img.src=ceramicFallback;
  getCeramicThumbnail(model).then(url=>{if(img.isConnected)img.src=url});
}
function createCeramicPlaceholder(number,model){
  const placeholder=document.createElement('div');placeholder.className='embed-placeholder embed-preview';
  const img=document.createElement('img');img.className='embed-preview-image';img.alt='';img.setAttribute('aria-hidden','true');
  const span=document.createElement('span');span.textContent='CERAMIC '+String(number).padStart(2,'0')+' / INTERACTIVE 3D';
  const button=document.createElement('button');button.type='button';button.className='load-embed';button.textContent='LOAD 3D MODEL ↗';
  const small=document.createElement('small');small.textContent='External content hosted by Sketchfab';
  placeholder.append(img,span,button,small);setCeramicPreview(img,model);
  button.addEventListener('click',()=>{const iframe=document.createElement('iframe');iframe.src='https://sketchfab.com/models/'+model+'/embed?autostart=0';iframe.title='Marta Anglada ceramic '+number;iframe.allow='autoplay; fullscreen; xr-spatial-tracking';iframe.allowFullscreen=true;iframe.referrerPolicy='strict-origin-when-cross-origin';document.getElementById('ceramic-viewer').replaceChildren(iframe)});
  return placeholder;
}
const initial=document.querySelector('.ceramic-choice.active');if(initial){const img=document.querySelector('#ceramic-viewer .embed-preview-image');if(img)setCeramicPreview(img,initial.dataset.model)}
document.querySelectorAll('.ceramic-choice').forEach(choice=>choice.addEventListener('click',()=>{
  const number=Number(choice.dataset.number),model=choice.dataset.model;
  document.querySelectorAll('.ceramic-choice').forEach(button=>{const selected=button===choice;button.classList.toggle('active',selected);button.setAttribute('aria-pressed',String(selected))});
  document.getElementById('ceramic-viewer').replaceChildren(createCeramicPlaceholder(number,model));
  document.getElementById('ceramic-title').textContent='Ceramic '+String(number).padStart(2,'0');
  document.getElementById('ceramic-external').href='https://sketchfab.com/models/'+model;
}));