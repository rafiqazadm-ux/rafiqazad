(() => {
  const section=document.querySelector('.creative-project-grid');
  const grid=section?.querySelector('.creative-project-cards');if(!grid)return;
  const projects=[...grid.querySelectorAll('.project-grid-card')].map(card=>({title:card.querySelector('h3').textContent,tag:card.querySelector('.project-grid-tag').textContent,description:card.querySelector('.project-grid-description').textContent,image:card.querySelector('img').getAttribute('src'),href:card.getAttribute('href')}));
  const stats={'project-final-overs.html':[['6M+','Reel views'],['1,200+','Followers'],['550+','Game sales']]};
  const showcase=document.createElement('div');showcase.className='rotating-showcase';grid.before(showcase);grid.classList.add('rotating-project-grid');
  showcase.innerHTML='<div class="showcase-copy"><p class="showcase-category"></p><h3></h3><p class="showcase-description"></p><div class="showcase-stats"></div><button type="button" class="showcase-explore">Explore project <span aria-hidden="true">↗</span></button></div><div class="showcase-visual"><img alt=""></div>';
  const dialog=document.createElement('dialog');dialog.className='project-preview-dialog';dialog.setAttribute('aria-labelledby','project-preview-title');dialog.innerHTML='<div class="project-preview-inner"><button type="button" class="project-preview-close" aria-label="Close project details">✕</button><p class="eyebrow">PROJECT PREVIEW</p><h2 id="project-preview-title"></h2><p class="project-preview-description"></p><div class="project-preview-placeholder"><strong>Project details</strong><p>Overview, contribution, impact, tools and selected work will be designed in the next stage.</p></div></div>';document.body.append(dialog);
  const $=s=>showcase.querySelector(s);let current=0,timer=null,paused=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function openProject(index){const p=projects[index];dialog.querySelector('h2').textContent=p.title;dialog.querySelector('.project-preview-description').textContent=p.description;dialog.showModal();}
  function render(){
    const p=projects[current];$('.showcase-category').textContent=p.tag;showcase.querySelector('h3').textContent=p.title;$('.showcase-description').textContent=p.description;$('.showcase-visual img').src=p.image;
    const metrics=$('.showcase-stats');metrics.replaceChildren();(stats[p.href]||[]).forEach(([value,label])=>{const item=document.createElement('div'),strong=document.createElement('strong'),text=document.createElement('span');strong.textContent=value;text.textContent=label;item.append(strong,text);metrics.append(item)});metrics.hidden=!metrics.children.length;
    grid.replaceChildren();for(let offset=1;offset<projects.length;offset++){const index=(current+offset)%projects.length,project=projects[index];const card=document.createElement('article');card.className='rotating-project-card';const art=document.createElement('div');art.className='rotating-project-art';const img=document.createElement('img');img.src=project.image;img.alt='';art.append(img);const tag=document.createElement('p');tag.className='rotating-project-tag';tag.textContent=project.tag;const title=document.createElement('h3');title.textContent=project.title;const description=document.createElement('p');description.className='rotating-project-description';description.textContent=project.description;const button=document.createElement('button');button.type='button';button.className='rotating-project-link';button.textContent='Explore project ↗';button.setAttribute('aria-label',`Explore ${project.title}`);button.addEventListener('click',()=>openProject(index));card.append(art,tag,title,description,button);grid.append(card)}
  }
  let transitioning=false;
  function changeProject(index,direction=1){
    if(transitioning)return;
    if(matchMedia('(prefers-reduced-motion: reduce)').matches){current=index;render();return}
    transitioning=true;section.classList.add('is-project-changing');
    const oldCards=[...grid.children];oldCards.forEach(card=>card.animate([{transform:'translateX(0)'},{transform:`translateX(${-direction*45}px)`}],{duration:300,easing:'ease-in',fill:'forwards'}));
    window.setTimeout(()=>{current=index;render();section.classList.remove('is-project-changing');[...grid.children].forEach(card=>card.animate([{transform:`translateX(${direction*45}px)`},{transform:'translateX(0)'}],{duration:350,easing:'ease-out'}));window.setTimeout(()=>{transitioning=false},350)},300);
  }
  function start(){clearInterval(timer);if(!paused)timer=setInterval(()=>{if(!document.hidden&&!dialog.open&&!section.matches(':hover')&&!section.contains(document.activeElement))changeProject((current+1)%projects.length)},3000)}
  let dragging=false,startX=0,startScroll=0,moved=false;
  grid.addEventListener('pointerdown',event=>{if(event.pointerType!=='mouse'||event.button!==0)return;dragging=true;moved=false;startX=event.clientX;startScroll=grid.scrollLeft;grid.classList.add('is-dragging')});
  window.addEventListener('pointermove',event=>{if(!dragging)return;const delta=event.clientX-startX;if(Math.abs(delta)>5)moved=true;grid.scrollLeft=startScroll-delta});
  window.addEventListener('pointerup',()=>{dragging=false;grid.classList.remove('is-dragging')});
  grid.addEventListener('click',event=>{if(moved){event.preventDefault();event.stopPropagation();moved=false}},true);
  $('.showcase-explore').addEventListener('click',()=>openProject(current));dialog.querySelector('.project-preview-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
  render();start();
})();
