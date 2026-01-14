
// Main Application Module

import { checkAuth, getCurrentUser, logout } from './auth.js';
import { renderLogin } from './views/login.js';
import { renderDashboard } from './views/dashboard.js';
import { renderDetails } from './views/details.js';
import { renderEditor } from './views/editor.js';

const app = {
    init() {
        this.setupRouter();
        this.setupGlobalEvents();
        this.route();
    },

    setupRouter() {
        window.addEventListener('hashchange', () => this.route());
        // Handle init load
        if (!window.location.hash) {
            window.location.hash = '#home';
        }
    },

    setupGlobalEvents() {
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                logout();
            });
        }
    },

    route() {
        const hash = window.location.hash;
        const mainContent = document.getElementById('main-content');
        const user = getCurrentUser();
        const navbar = document.getElementById('navbar');
        const logoutBtn = document.getElementById('logout-btn');

        // Show/Hide Navbar Elements based on Auth
        const footer = document.getElementById('main-footer');
        if (user) {
            navbar.classList.remove('hidden');
            if (logoutBtn) logoutBtn.classList.remove('hidden');
            if (footer) footer.classList.remove('hidden');
        } else {
            if (logoutBtn) logoutBtn.classList.add('hidden');
            // Hide global footer on login page to avoid double footer
            if (footer) footer.classList.add('hidden');
        }

        mainContent.innerHTML = ''; // Clear current view

        // Routing Logic
        if (!user && hash !== '#login') {
            window.location.hash = '#login';
            return;
        }

        if (hash === '#login') {
            renderLogin(mainContent);
        } else if (hash.startsWith('#home') || hash === '#admin') {
            if (!user) { window.location.hash = '#login'; return; }
            renderDashboard(mainContent, user);
        } else if (hash.startsWith('#details')) {
            if (!user) { window.location.hash = '#login'; return; }
            const id = new URLSearchParams(hash.split('?')[1]).get('id');
            renderDetails(mainContent, id);
        } else if (hash.startsWith('#editor')) {
            if (!user || user.role !== 'admin') { window.location.hash = '#home'; return; }
            const id = new URLSearchParams(hash.split('?')[1]).get('id');
            renderEditor(mainContent, id);
        } else {
            // 404 or default
            window.location.hash = '#home';
        }
    }
};

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
