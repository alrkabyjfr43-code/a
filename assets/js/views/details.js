
import { storage } from '../storage.js';
import { getCurrentUser } from '../auth.js';

export function renderDetails(container, id) {
    const property = storage.getProperty(id);
    const user = getCurrentUser();
    const isAdmin = user && user.role === 'admin';

    if (!property) {
        container.innerHTML = `<div class="error-state"><h2>لم يتم العثور على العقار</h2><button onclick="history.back()" class="btn">رجوع</button></div>`;
        return;
    }

    // Fallbacks
    const title = property.title || 'عقار بدون عنوان';
    const province = property.province || 'غير محدد';
    const phone = property.phone || '';
    const images = (property.images && property.images.length) ? property.images : ['https://via.placeholder.com/800x600?text=No+Images'];

    container.innerHTML = `
        <div class="details-page slide-in-bottom">
            <!-- Nav Actions -->
            <div class="details-header">
                <button class="btn-icon-circle" onclick="history.back()"><i class="fas fa-arrow-right"></i></button>
                <div class="actions-group">
                    ${isAdmin ? `<button class="btn btn-outline-gold" id="edit-btn">تعديل <i class="fas fa-edit"></i></button>` : ''}
                    <button class="btn-icon-circle" id="share-btn"><i class="fas fa-share-alt"></i></button>
                </div>
            </div>

            <!-- Main Content Grid -->
            <div class="details-layout">
                
                <!-- Right Column: Gallery -->
                <div class="gallery-column">
                    <div class="main-stage">
                        <img id="main-img" src="${images[0]}" class="magnify-anim">
                        <div class="slider-controls">
                            <button id="prev-btn"><i class="fas fa-chevron-right"></i></button>
                            <button id="next-btn"><i class="fas fa-chevron-left"></i></button>
                        </div>
                        <div class="image-count fa-number">1 / ${images.length}</div>
                    </div>
                    <div class="thumbnails-strip">
                        ${images.map((img, i) => `<div class="thumb ${i === 0 ? 'active' : ''}" onclick="setGalleryImage(${i})"><img src="${img}"></div>`).join('')}
                    </div>
                </div>

                <!-- Left Column: Info -->
                <div class="info-column">
                    <div class="info-header">
                        <span class="type-pill">${getTypeName(property.type)}</span>
                        ${property.featured ? '<span class="feat-pill"><i class="fas fa-star"></i> مميز</span>' : ''}
                        <h1 class="prop-title">${title}</h1>
                        <p class="prop-location"><i class="fas fa-map-marker-alt"></i> ${province}</p>
                    </div>

                    <div class="separator"></div>

                    <div class="specs-grid-box">
                        <h3>تفاصيل العقار</h3>
                        <div class="specs-list">
                            ${property.specs.map(s => `
                            <div class="spec-row">
                                <span class="spec-key">${s.label}</span>
                                <span class="spec-dots"></span>
                                <span class="spec-val">${s.value} <span>${s.unit || ''}</span></span>
                            </div>`).join('')}
                        </div>
                    </div>

                    <div class="contact-section">
                        <div class="price-box">
                            <span class="label">السعر المطلوب</span>
                            <span class="price-val">${getPrice(property)}</span>
                        </div>
                        
                        <div class="contact-actions">
                            ${phone ? `
                            <div class="phone-reveal-wrapper">
                                <button id="show-number-btn" class="btn btn-primary btn-block big-btn">
                                    <i class="fas fa-phone-alt"></i> إظهار رقم الهاتف
                                </button>
                                <div id="number-display" class="number-hidden">
                                    <a href="tel:${phone}" class="phone-link">${phone}</a>
                                    <span class="copy-hint">اضغط للاتصال</span>
                                </div>
                            </div>
                            ` : '<div class="no-phone">رقم الهاتف غير متوفر لهذا العقار</div>'}
                            
                            <button class="btn btn-whatsapp-full big-btn" onclick="window.open('https://wa.me/${phone}?text=استفسار عن عقار: ${title}', '_blank')">
                                <i class="fab fa-whatsapp"></i> تواصل عبر الواتساب
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Logic
    // Gallery
    let curIdx = 0;
    const updateGallery = () => {
        const img = document.getElementById('main-img');
        const count = document.querySelector('.image-count');
        const thumbs = document.querySelectorAll('.thumb');

        img.style.opacity = 0;
        setTimeout(() => {
            img.src = images[curIdx];
            img.style.opacity = 1;
        }, 200);

        count.textContent = `${curIdx + 1} / ${images.length}`;
        thumbs.forEach((t, i) => t.classList.toggle('active', i === curIdx));
    };

    window.setGalleryImage = (idx) => { curIdx = idx; updateGallery(); };

    document.getElementById('next-btn').addEventListener('click', () => { curIdx = (curIdx + 1) % images.length; updateGallery(); });
    document.getElementById('prev-btn').addEventListener('click', () => { curIdx = (curIdx - 1 + images.length) % images.length; updateGallery(); });

    // Phone Reveal
    const showNumBtn = document.getElementById('show-number-btn');
    if (showNumBtn) {
        showNumBtn.addEventListener('click', () => {
            showNumBtn.style.display = 'none';
            document.getElementById('number-display').style.display = 'flex';
        });
    }

    // Edit Redirect
    if (isAdmin) {
        document.getElementById('edit-btn').addEventListener('click', () => {
            window.location.hash = `#editor?id=${id}`;
        });
    }

    // Styles
    const style = document.createElement('style');
    style.innerHTML = `
        .details-page { max-width: 1200px; margin: 0 auto; padding-bottom: 50px; }
        .details-header { display: flex; justify-content: space-between; margin-bottom: 20px; }
        .btn-icon-circle { width: 45px; height: 45px; border-radius: 50%; background: #112240; color: white; border: 1px solid var(--glass-border); cursor: pointer; transition: 0.3s; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; }
        .btn-icon-circle:hover { background: var(--secondary-gold); color: #0a192f; transform: scale(1.1); }
        
        .details-layout { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 40px; }
        @media(max-width: 900px) { .details-layout { grid-template-columns: 1fr; } }

        /* Gallery */
        .gallery-column { display: flex; flex-direction: column; gap: 15px; }
        .main-stage { position: relative; height: 500px; background: #000; border-radius: 20px; overflow: hidden; border: 1px solid var(--glass-border); }
        .main-stage img { width: 100%; height: 100%; object-fit: contain; }
        .slider-controls button { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.5); color: white; border: none; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; z-index: 2; transition: 0.3s; }
        .slider-controls button:hover { background: var(--secondary-gold); color: black; }
        #prev-btn { right: 10px; } #next-btn { left: 10px; }
        .image-count { position: absolute; top: 15px; left: 15px; background: rgba(0,0,0,0.6); color: white; padding: 5px 12px; border-radius: 15px; font-size: 0.9rem; pointer-events: none; }
        
        .thumbnails-strip { display: flex; gap: 10px; overflow-x: auto; padding: 5px 0; }
        .thumb { width: 80px; height: 80px; border-radius: 10px; overflow: hidden; cursor: pointer; opacity: 0.5; transition: 0.3s; border: 2px solid transparent; flex-shrink: 0; }
        .thumb img { width: 100%; height: 100%; object-fit: cover; }
        .thumb.active { opacity: 1; border-color: var(--secondary-gold); transform: translateY(-5px); }

        /* Info */
        .info-column { background: #112240; padding: 30px; border-radius: 20px; border: 1px solid var(--glass-border); height: fit-content; }
        .type-pill { color: var(--secondary-gold); background: rgba(212, 175, 55, 0.1); padding: 5px 12px; border-radius: 8px; font-size: 0.9rem; font-weight: bold; }
        .feat-pill { color: #ff6b6b; margin-right: 10px; font-weight: bold; }
        .prop-title { font-size: 2rem; margin: 15px 0 5px 0; color: white; line-height: 1.3; }
        .prop-location { color: var(--text-muted); font-size: 1.1rem; }
        .separator { height: 1px; background: rgba(255,255,255,0.1); margin: 25px 0; }
        
        .spec-row { display: flex; align-items: baseline; margin-bottom: 15px; font-size: 1.1rem; }
        .spec-key { color: var(--text-muted); min-width: 100px; }
        .spec-dots { flex-grow: 1; border-bottom: 1px dotted rgba(255,255,255,0.2); margin: 0 15px; }
        .spec-val { color: var(--text-light); font-weight: bold; }

        .contact-section { background: rgba(10, 25, 47, 0.5); border-radius: 15px; padding: 20px; margin-top: 30px; border: 1px solid rgba(255,255,255,0.05); }
        .price-box { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .price-box .label { color: var(--text-muted); }
        .price-val { font-size: 1.5rem; color: var(--secondary-gold); font-weight: 800; }
        
        .contact-actions { display: flex; flex-direction: column; gap: 15px; }
        .big-btn { padding: 15px; font-size: 1.1rem; border-radius: 12px; width: 100%; display: flex; justify-content: center; align-items: center; gap: 10px; }
        
        .btn-whatsapp-full { 
            background: linear-gradient(45deg, #25D366, #128C7E); 
            color: white; 
            border: none; 
            box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);
            font-weight: bold;
            transition: 0.3s;
        }
        .btn-whatsapp-full:hover { 
            transform: translateY(-2px); 
            box-shadow: 0 8px 25px rgba(37, 211, 102, 0.5); 
        }
        
        /* Number Reveal */
        .number-hidden { display: none; background: var(--secondary-gold); color: #0a192f; border-radius: 12px; padding: 10px; text-align: center; flex-direction: column; justify-content: center; align-items: center; height: 100%; animation: popIn 0.3s; }
        .phone-link { color: #0a192f; font-weight: 900; font-size: 1.4rem; text-decoration: none; }
        .copy-hint { font-size: 0.8rem; opacity: 0.8; }
        
        @keyframes popIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        
        .actions-group { display: flex; gap: 10px; }
        .btn-outline-gold { border: 1px solid var(--secondary-gold); color: var(--secondary-gold); background: transparent; padding: 0 20px; border-radius: 20px; cursor: pointer; transition: 0.3s; }
        .btn-outline-gold:hover { background: var(--secondary-gold); color: #000; }
    `;
    container.appendChild(style);
}

function getTypeName(t) { return { 'house': 'منزل', 'apartment': 'شقة', 'land': 'أرض', 'custom': 'مخصص' }[t] || t; }
function getPrice(p) {
    const s = p.specs.find(x => x.label.includes('سعر'));
    return s ? `${s.value} <small>${s.unit || ''}</small>` : 'للاستفسار';
}
