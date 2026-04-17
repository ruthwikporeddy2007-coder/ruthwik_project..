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
        image: "assets/images/rahul_12.png"
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
        image: "assets/images/ananya_8.png"
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
        image: "assets/images/unknown_10.png"
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
        image: "assets/images/priya_14.png"
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
        image: "assets/images/arjun_6.png"
    }
];

// State
localStorage.removeItem('findmissing_data'); // Force refresh mock data with new images
let items = JSON.parse(localStorage.getItem('findmissing_data')) || [...mockData];
let currentFilter = 'all';

// Mock Blockchain Ledger
let ledger = JSON.parse(localStorage.getItem('findmissing_ledger')) || [];

function generateMockHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
    }
    return '0x' + Math.abs(hash).toString(16) + Math.random().toString(16).substring(2, 10);
}

function appendToLedger(action, caseId) {
    const entry = {
        timestamp: new Date().toISOString(),
        action: action,
        caseId: caseId,
        hash: generateMockHash(action + caseId + new Date().getTime())
    };
    ledger.unshift(entry);
    localStorage.setItem('findmissing_ledger', JSON.stringify(ledger));
}
let currentFilter = 'all';

// DOM Elements
const grid = document.getElementById('cardsGrid');
const reportModal = document.getElementById('reportModal');
const sightingModal = document.getElementById('sightingModal');
const searchInput = document.getElementById('searchInput');

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    check48HourStatus();
    renderCards(items);
});

// Logic: Check if older than 48 hours
function check48HourStatus() {
    const now = new Date();
    items.forEach(person => {
        // Mock parsed date (using the fake 'date' property as creation time)
        const caseDate = new Date(person.date);
        const hoursDiff = Math.abs(now - caseDate) / 36e5;
        
        if (hoursDiff > 48 && person.status === 'Missing') {
            person.attentionRequired = true;
        } else {
            person.attentionRequired = false;
        }
    });
}

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
        let badgeLabel = 'ACTIVE';

        if (person.status === 'Found') {
            badgeClass = 'badge-found';
            badgeLabel = 'FOUND';
        } else if (person.attentionRequired) {
            badgeClass = 'badge-expired';
            badgeLabel = 'MANUAL REVIEW';
        } else if (person.risk === 'high-risk') {
            badgeClass = 'badge-risk';
            badgeLabel = 'URGENT';
        }

        if (person.attentionRequired) {
            card.classList.add('case-expired');
        }

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
                
                ${person.status !== 'Found' && !person.attentionRequired ? '<div class="reward-tag"><i class="fas fa-trophy"></i> ₹50,000 Reward</div>' : ''}
                
                <p style="font-size: 0.9rem; color: #666; margin-bottom: 1rem;">${person.description}</p>
                
                ${person.attentionRequired ? '<div class="expired-warning"><i class="fas fa-exclamation-circle"></i> Unverified over 48hrs. WhatsApp fallback activated.</div>' : ''}

                <div class="card-actions" style="margin-top: 15px;">
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
        document.getElementById('policeActions').style.display = 'inline-flex';
        alert("Police Admin Mode Active");
        renderCards(items);
    } else {
        alert("Invalid Access Code");
    }
}

function toggleStatus(id) {
    const person = items.find(p => p.id === id);
    if (person) {
        let actionStr = "";
        if (person.status === 'Found') {
            person.status = 'Missing';
            person.risk = 'high-risk';
            person.attentionRequired = false;
            actionStr = "CASE_REOPENED";
        } else {
            person.status = 'Found';
            person.risk = 'low';
            person.attentionRequired = false;
            actionStr = "CASE_CLOSED";
        }
        appendToLedger(actionStr, person.id);
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
function openLedger() {
    const tbody = document.getElementById('ledgerBody');
    tbody.innerHTML = '';
    
    if(ledger.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center;">No transactions found on the blockchain.</td></tr>';
    } else {
        ledger.forEach(entry => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${new Date(entry.timestamp).toLocaleString()}</td>
                <td><strong>${entry.action}</strong></td>
                <td>${entry.caseId}</td>
                <td class="hash-cell">${entry.hash}</td>
            `;
            tbody.appendChild(tr);
        });
    }
    
    document.getElementById('ledgerModal').style.display = 'flex';
}

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
    appendToLedger("CASE_CREATED", newPerson.id);
    saveData();
    renderCards(items);
    closeModal('reportModal');
    e.target.reset();
    alert('Report filed successfully. Hash generated to blockchain.');
}

function handleSightingSubmit(e) {
    e.preventDefault();
    const caseId = document.getElementById('sightingContext').innerText.split('#')[1].split(':')[0];
    appendToLedger("SIGHTING_REPORTED", caseId);
    closeModal('sightingModal');
    e.target.reset();
    alert('Thank you! Your information has been securely verified via hash and sent to the nearest police station.');
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

// --- Crisis Wizard Logic ---
let currentWizardStep = 1;

window.openWizard = function () {
    const modal = document.getElementById('wizardModal');
    modal.style.display = 'flex';
    currentWizardStep = 1;
    updateWizardUI();
};

window.nextStep = function (step) {
    currentWizardStep = step;
    updateWizardUI();
};

window.prevStep = function (step) {
    currentWizardStep = step;
    updateWizardUI();
};

function updateWizardUI() {
    document.querySelectorAll('.wizard-step').forEach(el => {
        el.style.display = 'none';
    });
    document.getElementById('step-' + currentWizardStep).style.display = 'block';

    const progressFill = document.getElementById('wizard-progress');
    if (progressFill) {
        progressFill.style.width = (currentWizardStep * 25) + '%';
    }
}

window.submitWizard = function () {
    alert("Alert has been securely published to authorities and the active case list!");
    closeModal('wizardModal');

    // Simulate adding case
    const newPerson = {
        id: `MP-${Math.floor(Math.random() * 9000) + 1000}`,
        name: document.getElementById('wiz-name').value || 'Unknown',
        age: document.getElementById('wiz-age').value || 'Unknown',
        location: document.getElementById('wiz-location').value || 'Unknown',
        date: document.getElementById('wiz-date').value || new Date().toISOString().split('T')[0],
        status: "Missing",
        risk: "high-risk",
        description: document.getElementById('wiz-desc').value || '',
        image: "https://placehold.co/400x500?text=Urgent+Alert"
    };
    items.unshift(newPerson);
    appendToLedger("CRISIS_CASE_CREATED", newPerson.id);
    saveData();
    renderCards(items);

    document.getElementById('wiz-name').value = '';
    document.getElementById('wiz-age').value = '';
    document.getElementById('wiz-date').value = '';
    document.getElementById('wiz-location').value = '';
    document.getElementById('wiz-desc').value = '';
    document.getElementById('wiz-contact').value = '';
};
