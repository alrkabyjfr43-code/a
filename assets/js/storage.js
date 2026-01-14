
// Storage Service handles all interactions with LocalStorage
// Data Shape:
// Property: { id, type, specs: [{label, value, unit}], images: [], featured: boolean, date: timestamp }

const STORAGE_KEY_PROPERTIES = 'almostashar_properties';
const STORAGE_KEY_USER = 'almostashar_user';

export const storage = {
    // === User Management ===
    saveUser(role) {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify({ role, timestamp: Date.now() }));
    },

    getUser() {
        const data = localStorage.getItem(STORAGE_KEY_USER);
        return data ? JSON.parse(data) : null;
    },

    clearUser() {
        localStorage.removeItem(STORAGE_KEY_USER);
    },

    // === Property Management ===
    getProperties() {
        const data = localStorage.getItem(STORAGE_KEY_PROPERTIES);
        return data ? JSON.parse(data) : [];
    },

    getProperty(id) {
        const properties = this.getProperties();
        return properties.find(p => p.id === id);
    },

    saveProperty(property) {
        const properties = this.getProperties();

        if (property.id) {
            // Update existing
            const index = properties.findIndex(p => p.id === property.id);
            if (index !== -1) {
                properties[index] = { ...properties[index], ...property };
            } else {
                properties.push(property);
            }
        } else {
            // Create new
            property.id = Date.now().toString(36) + Math.random().toString(36).substr(2);
            property.createdAt = Date.now();
            properties.unshift(property); // Add to top
        }

        try {
            localStorage.setItem(STORAGE_KEY_PROPERTIES, JSON.stringify(properties));
            return { success: true };
        } catch (error) {
            console.error("Storage limit reached", error);
            return { success: false, error: 'Storage full! Try reducing image sizes.' };
        }
    },

    deleteProperty(id) {
        let properties = this.getProperties();
        properties = properties.filter(p => p.id !== id);
        localStorage.setItem(STORAGE_KEY_PROPERTIES, JSON.stringify(properties));
    },

    // Seed Demo Data if empty
    seedData() {
        if (this.getProperties().length === 0) {
            const demoData = [
                {
                    id: 'demo1',
                    type: 'house',
                    featured: true,
                    specs: [
                        { label: 'المساحة', value: '250', unit: 'متر' },
                        { label: 'الواجهة', value: '10', unit: 'متر' },
                        { label: 'السعر', value: '350', unit: 'مليون' }
                    ],
                    images: ['https://images.unsplash.com/photo-1600596542815-e32cb518753e?q=80&w=600&auto=format&fit=crop'], // Placeholder
                    createdAt: Date.now()
                }
            ];
            localStorage.setItem(STORAGE_KEY_PROPERTIES, JSON.stringify(demoData));
        }
    }
};
