/* ---------------------- AVATAR AUTO DETECT ---------------------- */
const avatarBox = document.getElementById("avatarBox");
const avatarList = ["avatar.jpg","avatar.png","avatar.jpeg","avatar.webp"];

async function loadAvatar() {
	for (let file of avatarList) {
		try {
			let r = await fetch(file);
			if (r.ok) {
				avatarBox.style.backgroundImage = `url('${file}')`;
				return;
			}
		} catch(e){}
	}
}
loadAvatar();

/* ---------------------- MUSIC AUTO DETECT ---------------------- */
const musicPlayer = document.getElementById("musicPlayer");
const musicList = ["music.mp3","song.mp3","music.wav","song.wav"];

async function loadMusic() {
	for (let file of musicList) {
		try {
			let r = await fetch(file);
			if (r.ok) {
				musicPlayer.src = file;
				initVisualizer();
				loadLyrics();
				return;
			}
		} catch(e){}
	}
}
loadMusic();

/* ---------------------- AUTO PLAY ---------------------- */
document.addEventListener("DOMContentLoaded", () => {
	setTimeout(() => {
		const b = document.createElement("button");
		b.style.display="none";
		document.body.appendChild(b);

		b.addEventListener("click",()=>musicPlayer.play().catch(()=>{}));
		b.click();
		b.remove();
	},800);
});

/* ---------------------- AVATAR REACT TO MUSIC ---------------------- */
function initVisualizer(){
	const ctx = new AudioContext();
	const src = ctx.createMediaElementSource(musicPlayer);
	const ana = ctx.createAnalyser();
	ana.fftSize = 256;

	src.connect(ana);
	ana.connect(ctx.destination);

	const data = new Uint8Array(ana.frequencyBinCount);
	const border = document.getElementById("avatarBorder");

	function loop(){
		ana.getByteFrequencyData(data);
		let avg = data.reduce((a,b)=>a+b)/data.length;
		let color = `hsl(${avg*2},100%,50%)`;

		border.style.boxShadow = `0 0 35px ${color},0 0 60px ${color} inset`;

		requestAnimationFrame(loop);
	}
	loop();
}

/* ---------------------- LYRICS ---------------------- */
let lyrics=[];
function loadLyrics(){
	fetch("lyrics.lrc")
		.then(r=>r.text())
		.then(t=>{
			lyrics = parseLRC(t);
			updateLyrics();
		});
}

function parseLRC(t){
	return t.split("\n").map(l=>{
		let m=l.match(/\[(\d+):(\d+\.\d+)\](.*)/);
		if(!m)return null;
		return {time:parseInt(m[1])*60+parseFloat(m[2]), text:m[3]};
	}).filter(v=>v);
}

function updateLyrics(){
	let t=musicPlayer.currentTime;
	for(let i=lyrics.length-1;i>=0;i--){
		if(t>=lyrics[i].time){
			lyricBox.textContent=lyrics[i].text;
			break;
		}
	}
	requestAnimationFrame(updateLyrics);
}

/* ---------------------- STARFALL EFFECT ---------------------- */
const cvs=document.getElementById("effect"), c=cvs.getContext("2d");
cvs.width=innerWidth; cvs.height=innerHeight;

const icons=["✨","❄","❤️","🌸","⭐"];
const snow=Array.from({length:90},()=>({
  x:Math.random()*cvs.width,
  y:Math.random()*cvs.height,
  size:Math.random()*20+10,
  speed:Math.random()*1+0.6,
  char:icons[Math.floor(Math.random()*icons.length)]
}));

function draw(){
 c.clearRect(0,0,cvs.width,cvs.height);
 snow.forEach(s=>{
   c.font=s.size+"px Arial";
   c.shadowColor="#fff"; c.shadowBlur=25;
   c.fillText(s.char,s.x,s.y);
   s.y+=s.speed; if(s.y>cvs.height)s.y=-20;
 });
 requestAnimationFrame(draw);
}
draw();

/* ---------------------- TIMER ---------------------- */
const start = new Date("2024-10-01 00:00:00");
setInterval(()=>{
  const d=Date.now()-start;
  const day = Math.floor(d/86400000);
  const h = Math.floor(d/3600000)%24;
  const m = Math.floor(d/60000)%60;
  const s = Math.floor(d/1000)%60;

  timer.innerHTML=`Date created: <span style=\"color:#00ffcc\">${day} day ${h} hour ${m} min ${s} sec</span>`;
},1000);