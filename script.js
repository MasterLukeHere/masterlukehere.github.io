// --- Globale variabelen om de huidige staat bij te houden ---
let currentCategory = '';
let currentStatus = '';

// Oude functie om de kaart te morphen is behouden
function toggleView(showPersonal) {
    const card = document.getElementById('main-card');
    const home = document.getElementById('home-content');
    const personal = document.getElementById('personal-content');

    if (showPersonal) {
        card.classList.add('expanded');
        home.classList.add('fade-out');
        
        setTimeout(() => {
            home.style.display = 'none';
            personal.style.display = 'block';
            requestAnimationFrame(() => {
                personal.classList.add('fade-in');
                initializeTabs(); 
            });
        }, 300);
    } else {
        card.classList.remove('expanded');
        personal.classList.remove('fade-in');
        
        setTimeout(() => {
            personal.style.display = 'none';
            home.style.display = 'block';
            requestAnimationFrame(() => {
                home.classList.remove('fade-out');
            });
        }, 300);
    }
}

// --- Nieuwe Functies voor Tab Navigatie en Content ---

const mainTabsNav = document.getElementById('main-tabs-nav');
const tabContentArea = document.getElementById('tab-content-area');

// 1. Initialiseer Hoofdtenten (Games, Anime, Boeken)
function initializeTabs() {
    mainTabsNav.innerHTML = '';
    const categories = Object.keys(personalData);
    let firstCategory = categories[0];

    categories.forEach(category => {
        const tab = document.createElement('div');
        tab.classList.add('main-tab');
        tab.textContent = category;
        tab.setAttribute('data-category', category);
        tab.onclick = () => showCategory(category);
        mainTabsNav.appendChild(tab);
    });

    // Reset de zoekbalk bij het openen van de Personal-pagina
    document.getElementById('search-input').value = ''; 
    showCategory(firstCategory);
}

// 2. Toon Content van een Hoofdcategorie
function showCategory(category) {
    currentCategory = category; // Update globale variabele
    
    // Activeer de main tab
    document.querySelectorAll('.main-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.getAttribute('data-category') === category) {
            tab.classList.add('active');
        }
    });

    // Bouw de sub-tabs
    const subTabsNav = document.createElement('nav');
    subTabsNav.classList.add('sub-tabs-nav');

    const statuses = personalData[category].statuses;
    const defaultStatus = statuses[0];

    statuses.forEach(status => {
        const subTab = document.createElement('div');
        subTab.classList.add('sub-tab');
        subTab.textContent = status;
        subTab.setAttribute('data-status', status);
        // Gebruik showContentList met de nieuwe handleFilterChange
        subTab.onclick = () => {
            currentStatus = status; // Update globale variabele
            handleFilterChange();
        };
        subTabsNav.appendChild(subTab);
    });

    tabContentArea.innerHTML = '';
    tabContentArea.appendChild(subTabsNav);

    // Zet de initiële status en toon de lijst
    currentStatus = defaultStatus;
    handleFilterChange();
}

// 3. Functie die wordt aangeroepen bij elke filter- of zoekwijziging
function handleFilterChange() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    
    // Activeer de sub-tab op basis van de huidige status
    document.querySelectorAll('.sub-tab').forEach(subTab => {
        subTab.classList.remove('active');
        if (subTab.getAttribute('data-status') === currentStatus) {
            subTab.classList.add('active');
        }
    });

    // Filter de data op zowel Status als Zoekterm
    const allItems = personalData[currentCategory].content;
    
    const filteredItems = allItems.filter(item => {
        const matchesStatus = (item.status === currentStatus);
        const matchesSearch = item.title.toLowerCase().includes(searchTerm) || 
                              item.description.toLowerCase().includes(searchTerm);
        
        return matchesStatus && matchesSearch;
    });

    // Render de gefilterde lijst
    renderList(filteredItems, currentCategory, currentStatus, searchTerm);
}

// 4. Render de Lijst van Items (Afgesplitst van showContentList)
function renderList(items, category, status, searchTerm) {
    let itemList = document.getElementById('current-item-list');
    if (!itemList) {
        itemList = document.createElement('div');
        itemList.id = 'current-item-list';
        itemList.classList.add('item-list');
        tabContentArea.appendChild(itemList);
    }
    itemList.innerHTML = '';

    if (items.length === 0) {
        let message = `Geen items gevonden in de categorie "${category}" met de status "${status}".`;
        if (searchTerm) {
            message += ` (Zoekterm: "${searchTerm}")`;
        }
        itemList.innerHTML = `<p style="opacity: 0.7; padding: 20px;">${message}</p>`;
        return;
    }

    items.forEach(item => {
        const itemHTML = `
            <div class="list-item">
                <img src="${item.image}" alt="${item.title}" class="item-image">
                <div class="item-details">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                    ${item.link ? `<a href="${item.link}" target="_blank" style="color: var(--color-warm-pink); font-size: 0.9em; text-decoration: none;">Meer info →</a>` : ''}
                </div>
            </div>
        `;
        itemList.insertAdjacentHTML('beforeend', itemHTML);
    });
}