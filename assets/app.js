const MOCK_CASES = [
    {
        id: "C-2026-001",
        name: "Aarav Sharma",
        age: 8,
        location: "Mumbai, Maharashtra",
        missingDate: "2026-03-01",
        reward: "₹ 50,000",
        img: "./images/aarav.png"
    },
    {
        id: "C-2026-002",
        name: "Priya Patel",
        age: 12,
        location: "Delhi, NCR",
        missingDate: "2026-02-28",
        reward: "₹ 1,00,000",
        img: "./images/priya.png"
    },
    {
        id: "C-2026-003",
        name: "Rahul Verma",
        age: 5,
        location: "Pune, Maharashtra",
        missingDate: "2026-03-03",
        reward: "₹ 25,000",
        img: "./images/rahul.png"
    },
    {
        id: "C-2026-004",
        name: "Riya Singh",
        age: 15,
        location: "Bangalore, Karnataka",
        missingDate: "2026-02-15",
        reward: "₹ 75,000",
        img: "./images/riya.png"
    }
];

const MOCK_UPDATES = [
    {
        station: "Mumbai Crime Branch",
        time: "2 hours ago",
        title: "Suspect Identified in Aarav Sharma Case",
        details: "CCTV footage near the station has identified a possible suspect. Please report any details."
    },
    {
        station: "Delhi Police HQ",
        time: "5 hours ago",
        title: "Search expanded for Priya Patel",
        details: "Search operations have been expanded to neighboring districts. Posters distributed at major transit hubs."
    }
];

document.addEventListener('DOMContentLoaded', () => {
    renderCases(MOCK_CASES);
    renderUpdates();
    setupModal();
    setupSearch();
});

function renderCases(cases) {
    const grid = document.getElementById('cases-grid');
    grid.innerHTML = '';

    if (cases.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">No cases found matching your criteria.</p>';
        return;
    }

    cases.forEach(c => {
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `
            <div class="card-img" style="background-image: url('${c.img}')">
                <span class="status-badge">MISSING</span>
            </div>
            <div class="card-body">
                <h3 class="card-title">${c.name} (Age: ${c.age})</h3>
                <div class="card-meta">
                    <p>📍 ${c.location}</p>
                    <p>🕒 Missing since: ${c.missingDate}</p>
                    <p>🆔 Case ID: ${c.id}</p>
                </div>
                <div class="reward">
                    Reward: ${c.reward}
                </div>
                <button class="btn btn-primary" style="width: 100%; margin-top: 15px; background: var(--primary-color)" onclick="openReportModal('${c.id}')">I saw this child</button>
            </div>
        `;
        grid.appendChild(div);
    });
}

function renderUpdates() {
    const feed = document.getElementById('updates-feed');
    feed.innerHTML = '';

    MOCK_UPDATES.forEach(u => {
        const div = document.createElement('div');
        div.className = 'update-item';
        div.innerHTML = `
            <div class="update-meta">${u.station} • ${u.time}</div>
            <div class="update-title">${u.title}</div>
            <div class="update-details">${u.details}</div>
        `;
        feed.appendChild(div);
    });
}

function setupModal() {
    const modal = document.getElementById('report-modal');
    const btn = document.getElementById('report-btn');
    const closeBtn = document.querySelector('.close-modal');
    const form = document.getElementById('report-form');

    btn.onclick = (e) => {
        e.preventDefault();
        modal.classList.add('active');
        document.getElementById('child-id').value = '';
    };

    closeBtn.onclick = () => {
        modal.classList.remove('active');
    };

    window.onclick = (e) => {
        if (e.target == modal) {
            modal.classList.remove('active');
        }
    };

    form.onsubmit = (e) => {
        e.preventDefault();
        alert('Thank you. Your report has been successfully submitted to the authorities.');
        modal.classList.remove('active');
        form.reset();
    };
}

window.openReportModal = function (caseId) {
    const modal = document.getElementById('report-modal');
    modal.classList.add('active');
    document.getElementById('child-id').value = caseId;
}

function setupSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.querySelector('.btn-search');
    const stateFilter = document.getElementById('state-filter');
    if (!searchInput || !searchBtn) return;

    const filterCases = () => {
        const term = searchInput.value.toLowerCase();
        const state = stateFilter.value.toLowerCase();

        const filtered = MOCK_CASES.filter(c => {
            const matchesTerm = c.name.toLowerCase().includes(term) || c.location.toLowerCase().includes(term);
            const matchesState = state === 'all' || c.location.toLowerCase().includes(state);
            return matchesTerm && matchesState;
        });

        renderCases(filtered);
    };

    searchBtn.onclick = filterCases;
    searchInput.onkeyup = (e) => {
        if (e.key === 'Enter') filterCases();
    };
    stateFilter.onchange = filterCases;
}

// Wizard Logic
let currentWizardStep = 1;

window.openWizard = function () {
    const modal = document.getElementById('wizard-modal');
    modal.classList.add('active');
    currentWizardStep = 1;
    updateWizardUI();
};

window.closeWizard = function () {
    const modal = document.getElementById('wizard-modal');
    modal.classList.remove('active');
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
    // Hide all steps
    document.querySelectorAll('.wizard-step').forEach(el => {
        el.style.display = 'none';
    });
    // Show current step
    document.getElementById('step-' + currentWizardStep).style.display = 'block';

    // Update progress bar
    const progressFill = document.getElementById('wizard-progress');
    progressFill.style.width = (currentWizardStep * 25) + '%';
}

window.submitWizard = function () {
    alert("Alert has been securely published to authorities and the active case list!");
    closeWizard();

    // To reset form values realistically
    document.getElementById('wiz-name').value = '';
    document.getElementById('wiz-age').value = '';
    document.getElementById('wiz-date').value = '';
    document.getElementById('wiz-location').value = '';
    document.getElementById('wiz-desc').value = '';
    document.getElementById('wiz-contact').value = '';
};
