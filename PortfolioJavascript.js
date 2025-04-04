// Firebase Config (replace with your own for full functionality)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Typed Intro Animation
const roles = ["Geospatial Engineer", "Data Analyst", "Software Engineering Enthusiast"];
let roleIndex = 0, charIndex = 0;
const typedText = document.getElementById('typed-text');

function type() {
    if (charIndex < roles[roleIndex].length) {
        typedText.textContent += roles[roleIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, 100);
    } else {
        setTimeout(erase, 2000);
    }
}
function erase() {
    if (charIndex > 0) {
        typedText.textContent = roles[roleIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(erase, 50);
    } else {
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(type, 500);
    }
}
type();

// Contact Form
const contactForm = document.getElementById('contact-form');
const messageList = document.getElementById('message-list');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const message = document.getElementById('message').value;

    await db.collection('messages').add({
        name,
        message,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });

    contactForm.reset();
    loadMessages();
});

async function loadMessages() {
    messageList.innerHTML = '';
    const snapshot = await db.collection('messages').orderBy('timestamp', 'desc').get();
    snapshot.forEach(doc => {
        const data = doc.data();
        const li = document.createElement('li');
        li.textContent = `${data.name}: ${data.message}`;
        messageList.appendChild(li);
    });
}
loadMessages();

// Skills Radar Chart
const ctx = document.getElementById('skills-chart').getContext('2d');
const skillsData = [85, 80, 75, 70, 90]; // GIS, Surveying, Programming, Visualization, Modeling
let angle = 0;

function drawRadar() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.beginPath();
    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height / 2;
    const radius = 100;

    skillsData.forEach((value, i) => {
        const rad = (2 * Math.PI / 5) * i + angle;
        const x = centerX + (value / 100) * radius * Math.cos(rad);
        const y = centerY + (value / 100) * radius * Math.sin(rad);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fillStyle = 'rgba(52, 152, 219, 0.5)';
    ctx.fill();
    ctx.strokeStyle = '#3498db';
    ctx.stroke();

    angle += 0.01;
    requestAnimationFrame(drawRadar);
}
drawRadar();