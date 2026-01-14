
import { storage } from '../storage.js';

export function renderDashboard(container, user) {
    const properties = storage.getProperties();
    const isAdmin = user.role === 'admin';

    container.innerHTML = `
        <div class="dashboard fade-in">
            <div class="hero-header">
                <div class="hero-bg-anim"></div>
                <div class="hero-content">
                    <h1>المستشار لتجارة العقار</h1>
                    <p>التميز • الفخامة • الثقة</p>
                    ${isAdmin ? `
                    <button id="add-prop-btn" class="btn btn-gold glow-effect">
                        <i class="fas fa-plus-circle"></i> إضافة عقار جديد
                    </button>
                    ` : ''}
                </div>
            </div>
            
            <div class="search-bar-container floating-glass">
                <div class="search-wrap">
                    <i class="fas fa-search search-icon"></i>
                    <input type="text" id="smart-search" placeholder="ابحث باسم العقار، المحافظة، أو المواصفات (مثال: بغداد، 250 متر)">
                </div>
                <div class="filter-tools">
                    <select id="filter-type">
                        <option value="">كل الأنواع</option>
                        <option value="house">🏠 منزل</option>
                        <option value="apartment">🏢 شقة</option>
                        <option value="land">🌍 أرض</option>
                        <option value="custom">🧩 مخصص</option>
                    </select>
                    <label class="toggle-btn" title="مميز فقط">
                        <input type="checkbox" id="filter-featured">
                        <span><i class="fas fa-star"></i></span>
                    </label>
                </div>
            </div>

            <div class="results-info">
                <span id="prop-count">0</span> عقار متوفر
            </div>

            <div id="property-grid" class="property-grid">
                <!-- Cards -->
            </div>
        </div>
    `;

    const grid = document.getElementById('property-grid');
    const searchInput = document.getElementById('smart-search');
    const typeFilter = document.getElementById('filter-type');
    const featuredFilter = document.getElementById('filter-featured');
    const countLabel = document.getElementById('prop-count');

    const renderCards = (props) => {
        grid.innerHTML = '';
        countLabel.textContent = props.length;

        if (props.length === 0) {
            grid.innerHTML = `
                <div class="no-data fade-in">
                    <i class="far fa-folder-open"></i>
                    <h3>لا توجد عقارات مطابقة</h3>
                    <p>حاول تغيير كلمات البحث أو الفلاتر</p>
                </div>`;
            return;
        }

        props.forEach((prop, index) => {
            const card = document.createElement('div');
            card.className = 'property-card fade-up';
            card.style.animationDelay = `${index * 0.05}s`;
            card.onclick = () => window.location.hash = `#details?id=${prop.id}`;

            // Intelligence: Extract key info
            const priceSpec = prop.specs.find(s => s.label.includes('سعر') || s.label.includes('السعر')) || { value: 'للاستفسار', unit: '' };
            const areaSpec = prop.specs.find(s => s.label.includes('مساحة')) || { value: '', unit: '' };
            const img = (prop.images && prop.images.length > 0) ? prop.images[0] : 'assets/css/placeholder.png'; // Use a better placeholder logic

            // Fallbacks for new fields if old data exists
            const title = prop.title || getTypeName(prop.type);
            const province = prop.province || 'غير محدد';

            card.innerHTML = `
                <div class="card-image-box">
                    <img src="${img}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'">
                    ${prop.featured ? '<span class="tag-featured"><i class="fas fa-crown"></i> مميز</span>' : ''}
                    <span class="tag-type">${getTypeName(prop.type)}</span>
                    <div class="image-overlay"></div>
                </div>
                <div class="card-content">
                    <div class="card-header-flex">
                        <h3 class="card-title">${title}</h3>
                        <span class="card-price">${priceSpec.value} <small>${priceSpec.unit || ''}</small></span>
                    </div>
                    <div class="card-location">
                        <i class="fas fa-map-marker-alt"></i> ${province}
                    </div>
                    <div class="card-specs-row">
                        ${areaSpec.value ? `<span class="spec-badge"><i class="fas fa-vector-square"></i> ${areaSpec.value} ${areaSpec.unit}</span>` : ''}
                        <span class="spec-badge more-badge">المزيد...</span>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });
    };

    const applyFilters = () => {
        const query = searchInput.value.toLowerCase();
        const type = typeFilter.value;
        const isFeatured = featuredFilter.checked;

        const filtered = properties.filter(p => {
            const specText = p.specs.map(s => `${s.label} ${s.value} ${s.unit}`).join(' ').toLowerCase();
            const title = (p.title || '').toLowerCase();
            const province = (p.province || '').toLowerCase();

            const matchQuery = !query ||
                title.includes(query) ||
                province.includes(query) ||
                specText.includes(query) ||
                getTypeName(p.type).includes(query);

            const matchType = !type || p.type === type;
            const matchFeatured = !isFeatured || p.featured;

            return matchQuery && matchType && matchFeatured;
        });

        renderCards(filtered);
    };

    // Events
    searchInput.addEventListener('input', applyFilters);
    typeFilter.addEventListener('change', applyFilters);
    featuredFilter.addEventListener('change', applyFilters);

    if (isAdmin) {
        document.getElementById('add-prop-btn').addEventListener('click', () => window.location.hash = '#editor');
    }

    applyFilters();

    // Styles
    const style = document.createElement('style');
    style.innerHTML = `
        .hero-header { position: relative; padding: 60px 20px; text-align: center; border-radius: 0 0 30px 30px; margin-bottom: -40px; background: linear-gradient(to bottom, #020c1b, #0a192f); overflow: hidden; }
        .hero-content { position: relative; z-index: 2; }
        .hero-content h1 { color: var(--secondary-gold); font-size: 2.5rem; margin-bottom: 10px; font-weight: 900; }
        .hero-content p { color: var(--text-muted); font-size: 1.2rem; margin-bottom: 20px; letter-spacing: 2px; }
        
        .search-bar-container { background: rgba(17, 34, 64, 0.9); backdrop-filter: blur(15px); padding: 15px 25px; border-radius: 50px; max-width: 800px; margin: 0 auto 30px auto; border: 1px solid var(--glass-border); box-shadow: 0 15px 35px rgba(0,0,0,0.3); display: flex; align-items: center; gap: 15px; position: relative; z-index: 10; }
        
        .search-wrap { flex-grow: 1; display: flex; align-items: center; gap: 10px; }
        .search-wrap input { background: transparent; border: none; font-size: 1.1rem; color: white; width: 100%; padding: 5px; }
        .search-wrap input::placeholder { color: rgba(255,255,255,0.4); }
        .search-icon { color: var(--secondary-gold); font-size: 1.2rem; }
        
        .filter-tools { display: flex; align-items: center; gap: 15px; border-right: 1px solid rgba(255,255,255,0.1); padding-right: 15px; }
        .filter-tools select { background: transparent; border: none; color: white; width: auto; font-weight: bold; cursor: pointer; }
        .filter-tools option { background: #0a192f; color: white; }
        
        .toggle-btn { cursor: pointer; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: rgba(255,255,255,0.05); transition: 0.3s; }
        .toggle-btn input { display: none; }
        .toggle-btn:hover { background: rgba(255,255,255,0.1); }
        .toggle-btn input:checked + span { color: var(--secondary-gold); text-shadow: 0 0 10px var(--secondary-gold); }

        .results-info { text-align: center; color: var(--text-muted); margin-bottom: 20px; font-size: 0.9rem; }
        
        .property-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 30px; padding-bottom: 50px; }
        .property-card { background: #112240; border-radius: 20px; overflow: hidden; border: 1px solid transparent; transition: 0.4s; cursor: pointer; position: relative; }
        .property-card:hover { transform: translateY(-10px) scale(1.02); border-color: var(--glass-border); box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
        
        .card-image-box { height: 240px; position: relative; overflow: hidden; }
        .card-image-box img { width: 100%; height: 100%; object-fit: cover; transition: 0.6s; }
        .property-card:hover .card-image-box img { transform: scale(1.1) rotate(1deg); }
        .tag-featured { position: absolute; top: 15px; right: 15px; background: linear-gradient(45deg, #d4af37, #b5952f); color: #000; font-weight: bold; padding: 5px 12px; border-radius: 20px; font-size: 0.8rem; box-shadow: 0 5px 15px rgba(0,0,0,0.3); z-index: 2; }
        .tag-type { position: absolute; bottom: 15px; right: 15px; background: rgba(0,0,0,0.7); backdrop-filter: blur(5px); color: white; padding: 5px 10px; border-radius: 8px; font-size: 0.8rem; z-index: 2; }
        
        .card-content { padding: 20px; }
        .card-header-flex { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
        .card-title { color: white; font-size: 1.2rem; font-weight: bold; margin: 0; line-height: 1.4; }
        .card-price { color: var(--secondary-gold); font-size: 1.1rem; font-weight: 800; white-space: nowrap; margin-right: 10px; }
        .card-location { color: var(--text-muted); font-size: 0.95rem; margin-bottom: 15px; display: flex; align-items: center; gap: 5px; }
        
        .card-specs-row { display: flex; gap: 10px; }
        .spec-badge { background: rgba(255,255,255,0.05); padding: 5px 10px; border-radius: 6px; font-size: 0.85rem; color: #a8b2d1; }
        .more-badge { margin-right: auto; background: transparent; color: var(--secondary-gold); }

        .btn-gold { background: var(--secondary-gold); color: #0a192f; border: none; font-weight: bold; box-shadow: 0 5px 15px rgba(212, 175, 55, 0.3); margin-top: 20px; }
        
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.6s ease-out backwards; }
        
        @media(max-width: 600px) {
            .search-bar-container { flex-direction: column; padding: 20px; border-radius: 20px; }
            .filter-tools { width: 100%; justify-content: space-between; border-right: none; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 15px; border-right: none; padding-right: 0;}
        }
    `;
    container.appendChild(style);
}

function getTypeName(type) {
    const map = { 'house': 'منزل', 'apartment': 'شقة', 'land': 'أرض', 'custom': 'مخصص' };
    return map[type] || type;
}
