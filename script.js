// Mock Data for Missing Children
const mockData = [
    {
        id: "MP-1023",
        name: "Rahul Kumar",
        age: 12,
        location: "Mumbai, MH",
        date: "2026-02-12",
        status: "Missing",
        risk: "high-risk",
        description: "Wearing blue school uniform. Last seen near Railway Station.",
        image: "assets/images/child_portrait_boy_12_1776314948404.png"
    },
    {
        id: "MP-1024",
        name: "Ananya Singh",
        age: 8,
        location: "Delhi, DL",
        date: "2026-02-13",
        status: "Missing",
        risk: "high-risk",
        description: "Pink floral dress. Carrying a red backpack.",
        image: "assets/images/child_portrait_girl_8_1776314968852.png"
    },
    {
        id: "MP-1021",
        name: "Unknown Boy",
        age: "approx 10",
        location: "Bangalore, KA",
        date: "2026-02-10",
        status: "Missing",
        risk: "recent",
        description: "Found wandering near Majestic. Currently in safe custody.",
        image: "assets/images/child_portrait_boy_10_1776314986919.png"
    },
    {
        id: "MP-1018",
        name: "Priya Sharma",
        age: 14,
        location: "Pune, MH",
        date: "2026-02-01",
        status: "Missing",
        risk: "medium",
        description: "Height 5'2. Black hair. Last seen at City Mall.",
        image: "assets/images/child_portrait_girl_15_1776315026163.png"
    },
    {
        id: "MP-0992",
        name: "Arjun Das",
        age: 6,
        location: "Kolkata, WB",
        date: "2026-01-28",
        status: "Found",
        risk: "low",
        description: "Reunited with family on Feb 13th.",
        image: "assets/images/child_portrait_boy_6_1776315367108.png"
    }
];

// State
localStorage.removeItem('findmissing_data'); // Force refresh mock data with new images
let items = JSON.parse(localStorage.getItem('findmissing_data')) || [...mockData];
let currentFilter = 'all';

// DOM Elements
const grid = document.getElementById('cardsGrid');
const reportModal = document.getElementById('reportModal');
const sightingModal = document.getElementById('sightingModal');
const searchInput = document.getElementById('searchInput');

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    renderCards(items);
});

// Render Functions
function renderCards(data) {
    grid.innerHTML = '';

    if (data.length === 0) {
        grid.innerHTML = '<div style="text-align:center; grid-column: 1/-1; padding: 3rem;"><h3>No cases found.</h3></div>';
        return;
    }

    data.forEach(person => {
        const card = document.createElement('div');
        card.className = 'card';

        let badgeClass = 'badge-new';
        if (person.status === 'Found') badgeClass = 'badge-found';
        else if (person.risk === 'high-risk') badgeClass = 'badge-risk';

        const badgeLabel = person.status === 'Found' ? 'FOUND' : (person.risk === 'high-risk' ? 'URGENT' : 'ACTIVE');

        card.innerHTML = `
            <div class="card-badge ${badgeClass}">${badgeLabel}</div>
            <div class="card-img-container">
                <img src="${person.image}" alt="${person.name}">
            </div>
            <div class="card-content">
                <h3>${person.name}</h3>
                <div class="info-row"><i class="fas fa-map-marker-alt"></i> ${person.location}</div>
                <div class="info-row"><i class="fas fa-calendar-alt"></i> ${person.date}</div>
                <div class="info-row"><i class="fas fa-user-clock"></i> Age: ${person.age}</div>
                
                ${person.status !== 'Found' ? '<div class="reward-tag"><i class="fas fa-trophy"></i> ₹50,000 Reward</div>' : ''}
                
                <p style="font-size: 0.9rem; color: #666; margin-bottom: 1rem;">${person.description}</p>
                
                <div class="card-actions">
                    <button class="btn-card btn-info" onclick="openSightingModal('${person.id}', '${person.name}')">
                        <i class="fas fa-eye"></i> I Have Info
                    </button>
                    <button class="btn-card btn-share" onclick="shareCard('${person.name}')">
                        <i class="fas fa-share-alt"></i> Share
                    </button>
                    <button class="btn-card" style="grid-column: span 2; background: #FFF7ED; color: #C2410C;" onclick="generatePoster('${person.id}')">
                        <i class="fas fa-print"></i> Download Poster
                    </button>
                </div>
                ${document.body.classList.contains('police-mode') ? `
                    <div style="margin-top: 1rem; padding-top: 0.5rem; border-top: 1px dashed #ddd; display: flex; gap: 0.5rem;">
                        <button onclick="toggleStatus('${person.id}')" style="flex:1; background:#1A3C5B; color:white; border:none; padding:0.5rem; border-radius:4px; cursor:pointer;">
                            ${person.status === 'Found' ? 'Reopen Case' : 'Mark Found'}
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
        grid.appendChild(card);
    });
}

// Logic Functions
function openPoliceLogin() {
    const code = prompt("Enter Police Access Code (Try: 1234)");
    if (code === "1234") {
        document.body.classList.add('police-mode');
        alert("Police Admin Mode Active");
        renderCards(items);
    } else {
        alert("Invalid Access Code");
    }
}

function toggleStatus(id) {
    const person = items.find(p => p.id === id);
    if (person) {
        if (person.status === 'Found') {
            person.status = 'Missing';
            person.risk = 'high-risk';
        } else {
            person.status = 'Found';
            person.risk = 'low';
        }
        saveData();
        renderCards(items);
    }
}

function saveData() {
    localStorage.setItem('findmissing_data', JSON.stringify(items));
}

function generatePoster(id) {
    const person = items.find(p => p.id === id);
    if (!person) return;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>MISSING: ${person.name}</title>
            <style>
                body { font-family: sans-serif; text-align: center; padding: 2rem; border: 5px solid #FF0000; margin: 0; }
                h1 { font-size: 4rem; color: #FF0000; margin: 0; line-height: 1; }
                h2 { font-size: 2rem; margin: 1rem 0; }
                img { width: 100%; max-width: 400px; height: auto; border: 2px solid #000; margin: 1rem 0; }
                .details { font-size: 1.5rem; text-align: left; max-width: 600px; margin: 0 auto; line-height: 1.6; }
                .highlight { font-weight: bold; color: #FF0000; }
                .footer { margin-top: 3rem; font-size: 1.2rem; background: #eee; padding: 1rem; }
            </style>
        </head>
        <body>
            <h1>MISSING</h1>
            <p style="font-size: 1.5rem;">HAVE YOU SEEN THIS CHILD?</p>
            
            <img src="${person.image}" alt="${person.name}">
            
            <h2>${person.name}</h2>
            
            <div class="details">
                <p><strong>Age:</strong> ${person.age}</p>
                <p><strong>Last Seen:</strong> ${person.location}</p>
                <p><strong>Missing Since:</strong> ${person.date}</p>
                <p><strong>Description:</strong> ${person.description}</p>
            </div>

            <div class="footer">
                <p>If you have any information, please contact immediately:</p>
                <h3>POLICE: 100</h3>
                <p>Or visit: FindMissing.in</p>
            </div>
            
            <script>
                window.onload = function() { window.print(); }
            </script>
        </body>
        </html>
    `);
    printWindow.document.close();
}

// Logic Functions
function filterCards() {
    const query = searchInput.value.toLowerCase();
    const filtered = items.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(query) ||
            item.location.toLowerCase().includes(query) ||
            item.id.toLowerCase().includes(query);
        const matchesFilter = currentFilter === 'all' ||
            (currentFilter === 'recent' && item.risk !== 'low') || // Simplified logic
            (currentFilter === 'high-risk' && item.risk === 'high-risk');
        return matchesSearch && matchesFilter;
    });
    renderCards(filtered);
}

function setFilter(type) {
    currentFilter = type;
    // Update UI active state
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.innerText.toLowerCase().includes(type.replace('-', ' ')) || (type === 'all' && btn.innerText === 'All'));
    });
    filterCards();
}

// Modal Functions
function openReportModal() {
    reportModal.style.display = 'flex';
}

function openSightingModal(id, name) {
    document.getElementById('sightingContext').innerText = `Reporting info for Case #${id}: ${name}`;
    sightingModal.style.display = 'flex';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Form Handling
function handleReportSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newPerson = {
        id: `MP-${Math.floor(Math.random() * 9000) + 1000}`,
        name: formData.get('name'),
        age: formData.get('age'),
        location: formData.get('location'),
        date: new Date().toISOString().split('T')[0],
        status: "Missing",
        risk: "high-risk",
        description: formData.get('description'),
        image: "https://placehold.co/400x500?text=New+Report"
    };

    items.unshift(newPerson); // Add to top
    saveData();
    renderCards(items);
    closeModal('reportModal');
    e.target.reset();
    alert('Report filed successfully. Police verification pending.');
}

function handleSightingSubmit(e) {
    e.preventDefault();
    closeModal('sightingModal');
    e.target.reset();
    alert('Thank you! Your information has been sent to the nearest police station securely.');
}

function shareCard(name) {
    if (navigator.share) {
        navigator.share({
            title: `Help Find ${name}`,
            text: `Please help find ${name}. Check the details here.`,
            url: window.location.href
        });
    } else {
        alert('Link copied to clipboard!');
    }
}

// Close modal on outside click
window.onclick = function (event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = "none";
    }
}
