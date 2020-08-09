// Initial welcome page. Delete the following line to remove it.
const body = document.getElementsByTagName('body')[0];

if (window.matchMedia('(prefers-color-scheme:dark)').matches) {
  body.style.color = 'white';
}

const header = document.createElement('h1');
header.innerText = 'En header';
body.appendChild(header);
