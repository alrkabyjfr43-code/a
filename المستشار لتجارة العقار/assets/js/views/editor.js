
import { storage } from '../storage.js';

export function renderEditor(container, propertyId = null) {
    let property = {
        title: '',
        province: '',
        phone: '',
        type: 'house',
        featured: false,
        specs: [],
        images: []
    };

    if (propertyId) {
        const existing = storage.getProperty(propertyId);
        if (existing) property = { ...property, ...existing };
    }

    container.innerHTML = `
        <div class="editor-page fade-in">
            <div class="header-row">
                <h2>${propertyId ? '<i class="fas fa-edit"></i> تعديل العقار' : '<i class="fas fa-plus-circle"></i> إضافة عقار جديد'}</h2>
                <button class="btn btn-outline" onclick="window.history.back()">إلغاء ❌</button>
            </div>

            <div class="editor-container">
                <!-- Main Info Card -->
                <div class="editor-card glow-border">
                    <div class="section-title"><h3><i class="fas fa-info-circle"></i> البيانات الأساسية</h3></div>
                    
                    <div class="form-grid">
                        <div class="input-group">
                            <label>اسم العقار (عنوان مميز)</label>
                            <input type="text" id="prop-title" value="${property.title}" placeholder="مثال: فيلا ملكية في الجادرية">
                        </div>

                        <div class="input-group">
                            <label>المحافظة / المدينة</label>
                            <input type="text" id="prop-province" value="${property.province}" placeholder="مثال: بغداد، كربلاء...">
                        </div>

                        <div class="input-group">
                            <label>رقم الهاتف للتواصل</label>
                            <input type="text" id="prop-phone" value="${property.phone}" placeholder="07xxxxxxxxx">
                        </div>

                        <div class="input-group">
                            <label>نوع العقار</label>
                            <select id="prop-type">
                                <option value="house" ${property.type === 'house' ? 'selected' : ''}>🏠 منزل</option>
                                <option value="apartment" ${property.type === 'apartment' ? 'selected' : ''}>🏢 شقة</option>
                                <option value="land" ${property.type === 'land' ? 'selected' : ''}>🌍 أرض</option>
                                <option value="custom" ${property.type === 'custom' ? 'selected' : ''}>🧩 مخصص</option>
                            </select>
                        </div>
                        
                        <div class="input-group checkbox-wrapper">
                            <label class="custom-checkbox">
                                <input type="checkbox" id="prop-featured" ${property.featured ? 'checked' : ''}>
                                <span class="checkmark"></span>
                                <span class="label-text">تمييز العقار (Featured) ⭐</span>
                            </label>
                        </div>
                    </div>
                </div>

                <!-- Specs Card -->
                <div class="editor-card glow-border">
                    <div class="section-header">
                        <h3><i class="fas fa-list-ul"></i> المواصفات (Dynamic Specs)</h3>
                        <button class="btn btn-sm btn-gold" id="add-spec-btn"><i class="fas fa-plus"></i> إضافة بند جديد</button>
                    </div>
                    <div class="specs-legend">
                        <span>اسم البند</span>
                        <span>القيمة</span>
                        <span>الوحدة</span>
                        <span></span>
                    </div>
                    <div id="specs-container"></div>
                    <p class="hint-text">* يمكنك إضافة أي عدد من المواصفات (المساحة، الواجهة، إلخ)</p>
                </div>

                <!-- Images Card -->
                <div class="editor-card glow-border">
                    <div class="section-title"><h3><i class="fas fa-images"></i> معرض الصور</h3></div>
                    
                    <div class="upload-area" id="upload-trigger">
                        <i class="fas fa-cloud-upload-alt"></i>
                        <p>اضغط لاختيار الصور أو اسحبها هنا</p>
                        <input type="file" id="img-upload" accept="image/*" multiple hidden>
                    </div>

                    <div id="img-preview" class="img-preview-grid"></div>
                </div>

                <!-- Actions -->
                <div class="actions-bar sticky-bottom">
                    <button class="btn btn-danger" id="delete-btn" ${!propertyId ? 'style="display:none"' : ''}><i class="fas fa-trash-alt"></i> حذف العقار</button>
                    <button class="btn btn-primary btn-lg shine-effect" id="save-btn"><i class="fas fa-save"></i> حفظ التغييرات</button>
                </div>
            </div>
        </div>
    `;

    // Logic Variables
    const specsContainer = document.getElementById('specs-container');
    const images = [...property.images];
    let specs = [...property.specs];

    // Renders
    const renderSpecs = () => {
        specsContainer.innerHTML = '';
        specs.forEach((spec, index) => {
            const row = document.createElement('div');
            row.className = 'spec-row slide-in-right';
            row.innerHTML = `
                <div class="spec-input-wrapper">
                    <input type="text" placeholder="الاسم" value="${spec.label}" class="spec-label-input" data-idx="${index}">
                </div>
                <div class="spec-input-wrapper">
                    <input type="text" placeholder="القيمة" value="${spec.value}" class="spec-value-input" data-idx="${index}">
                </div>
                <div class="spec-input-wrapper">
                    <input type="text" placeholder="الوحدة" value="${spec.unit || ''}" class="spec-unit-input" data-idx="${index}" list="units-list">
                </div>
                <button class="btn-icon remove-spec" data-idx="${index}"><i class="fas fa-minus-circle"></i></button>
            `;
            specsContainer.appendChild(row);
        });
    };

    const renderImages = () => {
        const preview = document.getElementById('img-preview');
        preview.innerHTML = '';
        images.forEach((img, index) => {
            const div = document.createElement('div');
            div.className = 'img-thumb pop-in';
            div.innerHTML = `
                <img src="${img}">
                <div class="thumb-actions">
                    <button data-idx="${index}" class="remove-img"><i class="fas fa-times"></i></button>
                </div>
            `;
            preview.appendChild(div);
        });
    };

    // Event Handlers
    document.getElementById('add-spec-btn').addEventListener('click', () => {
        specs.push({ label: '', value: '', unit: '' });
        renderSpecs();
    });

    specsContainer.addEventListener('input', (e) => {
        const idx = e.target.getAttribute('data-idx');
        if (!idx) return;
        if (e.target.classList.contains('spec-label-input')) specs[idx].label = e.target.value;
        if (e.target.classList.contains('spec-value-input')) specs[idx].value = e.target.value;
        if (e.target.classList.contains('spec-unit-input')) specs[idx].unit = e.target.value;
    });

    specsContainer.addEventListener('click', (e) => {
        if (e.target.closest('.remove-spec')) {
            const idx = e.target.closest('.remove-spec').getAttribute('data-idx');
            specs.splice(idx, 1);
            renderSpecs();
        }
    });

    // Custom Upload Trigger
    const uploadTrigger = document.getElementById('upload-trigger');
    const fileInput = document.getElementById('img-upload');

    uploadTrigger.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (ev) => {
                images.push(ev.target.result);
                renderImages();
            };
            reader.readAsDataURL(file);
        });
    });

    document.getElementById('img-preview').addEventListener('click', (e) => {
        if (e.target.closest('.remove-img')) {
            const idx = e.target.closest('.remove-img').getAttribute('data-idx');
            images.splice(idx, 1);
            renderImages();
        }
    });

    // Save
    document.getElementById('save-btn').addEventListener('click', () => {
        const finalProperty = {
            id: property.id,
            title: document.getElementById('prop-title').value.trim() || 'عقار بدون عنوان',
            province: document.getElementById('prop-province').value.trim(),
            phone: document.getElementById('prop-phone').value.trim(),
            type: document.getElementById('prop-type').value,
            featured: document.getElementById('prop-featured').checked,
            specs: specs.filter(s => s.label.trim() !== ''),
            images: images,
            createdAt: property.createdAt || Date.now()
        };

        const result = storage.saveProperty(finalProperty);
        if (result.success) {
            // Show Toast (To be implemented globally, currently alert)
            alert('✅ تم حفظ العقار بنجاح!');
            window.location.hash = '#admin';
        } else {
            alert('⚠️ ' + result.error);
        }
    });

    const deleteBtn = document.getElementById('delete-btn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            if (confirm('⚠️ هل أنت متأكد تماماً من حذف هذا العقار؟ لا يمكن التراجع.')) {
                storage.deleteProperty(property.id);
                window.location.hash = '#admin';
            }
        });
    }

    // Init
    renderSpecs();
    renderImages();

    // Styles for Editor
    const style = document.createElement('style');
    style.innerHTML = `
        .editor-container { max-width: 900px; margin: 0 auto; display: grid; gap: 30px; }
        .editor-card { background: var(--card-bg); padding: 30px; border-radius: 20px; border: 1px solid var(--glass-border); position: relative; overflow: hidden; }
        .glow-border { box-shadow: 0 0 15px rgba(0,0,0,0.2); transition: 0.3s; }
        .glow-border:hover { box-shadow: 0 0 25px rgba(212, 175, 55, 0.1); border-color: rgba(212, 175, 55, 0.3); }

        .section-title h3 { color: var(--secondary-gold); border-bottom: 2px solid rgba(212, 175, 55, 0.2); display: inline-block; padding-bottom: 10px; margin-bottom: 20px; }
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .input-group.checkbox-wrapper { grid-column: span 2; }
        @media(max-width:600px) { .form-grid { grid-template-columns: 1fr; } }

        label { color: var(--text-muted); margin-bottom: 8px; display: block; font-weight: bold; }
        
        /* Checkbox */
        .custom-checkbox { display: flex; align-items: center; gap: 10px; cursor: pointer; user-select: none; }
        .custom-checkbox input { display: none; }
        .checkmark { width: 25px; height: 25px; background: rgba(255,255,255,0.1); border-radius: 5px; position: relative; transition: 0.3s; }
        .custom-checkbox input:checked ~ .checkmark { background: var(--secondary-gold); }
        .checkmark:after { content: ''; position: absolute; display: none; left: 9px; top: 5px; width: 5px; height: 10px; border: solid #0a192f; border-width: 0 3px 3px 0; transform: rotate(45deg); }
        .custom-checkbox input:checked ~ .checkmark:after { display: block; }
        .label-text { font-size: 1.1rem; color: var(--text-light); }

        /* Specs Table */
        .specs-legend { display: grid; grid-template-columns: 2fr 1.5fr 1fr 40px; gap: 10px; color: var(--text-muted); margin-bottom: 10px; padding: 0 10px; font-size: 0.9rem; }
        .spec-row { display: grid; grid-template-columns: 2fr 1.5fr 1fr 40px; gap: 10px; margin-bottom: 10px; }
        .spec-input-wrapper input { background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); padding: 10px; border-radius: 8px; width: 100%; color: white; transition: 0.3s; }
        .spec-input-wrapper input:focus { border-color: var(--secondary-gold); background: rgba(0,0,0,0.4); }
        .remove-spec { color: #ff6b6b; background: rgba(255,0,0,0.1); border-radius: 5px; width: 100%; height: 100%; transition: 0.3s; }
        .remove-spec:hover { background: #ff6b6b; color: white; }

        /* Images */
        .upload-area { border: 2px dashed var(--glass-border); border-radius: 15px; padding: 40px; text-align: center; cursor: pointer; transition: 0.3s; margin-bottom: 20px; background: rgba(255,255,255,0.02); }
        .upload-area:hover { border-color: var(--secondary-gold); background: rgba(212, 175, 55, 0.05); }
        .upload-area i { font-size: 3rem; color: var(--secondary-gold); margin-bottom: 15px; }

        .img-preview-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 15px; }
        .img-thumb { position: relative; aspect-ratio: 1; border-radius: 10px; overflow: hidden; border: 2px solid var(--glass-border); }
        .img-thumb img { width: 100%; height: 100%; object-fit: cover; }
        .thumb-actions { position: absolute; inset: 0; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; opacity: 0; transition: 0.3s; }
        .img-thumb:hover .thumb-actions { opacity: 1; }
        .remove-img { background: red; color: white; width: 30px; height: 30px; border-radius: 50%; border: none; cursor: pointer; }

        /* Sticky Bottom Actions */
        .actions-bar { display: flex; justify-content: flex-end; gap: 15px; margin-top: 20px; }
        .btn-outline { border: 1px solid var(--text-muted); color: var(--text-muted); }
        .btn-outline:hover { border-color: white; color: white; }

        @keyframes slideInRight { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
        .slide-in-right { animation: slideInRight 0.3s ease-out; }
    `;
    container.appendChild(style);
}
