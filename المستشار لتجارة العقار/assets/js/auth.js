
import { storage } from './storage.js';

const ADMIN_CODE = 'ADMIN-ALMOSTASHAR';
const VISITOR_CODE = 'VISITOR-ALMOSTASHAR';

export function login(code) {
    if (code === ADMIN_CODE) {
        storage.saveUser('admin');
        return { success: true, role: 'admin' };
    } else if (code === VISITOR_CODE) {
        storage.saveUser('visitor');
        return { success: true, role: 'visitor' };
    } else {
        return { success: false, message: 'الرمز غير صحيح' };
    }
}

export function logout() {
    storage.clearUser();
    window.location.hash = '#login';
    window.location.reload();
}

export function getCurrentUser() {
    return storage.getUser();
}

export function checkAuth() {
    const user = getCurrentUser();
    if (!user) {
        window.location.hash = '#login';
        return false;
    }
    return user;
}
