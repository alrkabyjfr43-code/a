
import { login } from '../auth.js';

export function renderLogin(container) {
    const logoURL = "https://scontent.fnjf5-3.fna.fbcdn.net/v/t39.30808-1/217109963_109920621360696_6918028912328205025_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=110&ccb=1-7&_nc_sid=2d3e12&_nc_ohc=H0NJX76cHCIQ7kNvwGuF2Tv&_nc_oc=AdkCckwFyCOp6uTKCDh-RbJMPtlSYFZYWrO8dqD-1eiOmj0JVkxfJnMfL-X94SQtbsk&_nc_zt=24&_nc_ht=scontent.fnjf5-3.fna&_nc_gid=KTowZh5r7KSSN2oGtuTjiQ&oh=00_AfoVJsNoBUcs07IA2VaP-EduxDfu8jhD3Xha2CbNTydfvw&oe=696D575E";

    container.innerHTML = `
        <div class="login-page-bg"></div>
        <div class="login-wrapper fade-in">
            <div class="login-card premium-glass">
                <div class="glow-orb"></div>
                <div class="login-header">
                    <div class="logo-circle">
                        <img src="${logoURL}" alt="Almostashar Logo">
                    </div>
                    <h2>المستشار لتجارة العقار</h2>
                    <p class="subtitle">بوابة النخبة للعقارات المتميزة</p>
                </div>
                
                <form id="login-form">
                    <div class="input-group-modern">
                        <i class="fas fa-key icon"></i>
                        <input type="password" id="access-code" placeholder="أدخل رمز الدخول..." autocomplete="off">
                        <div class="focus-line"></div>
                    </div>
                    
                    <button type="submit" class="btn-login-gold">
                        <span class="btn-text">تسجيل الدخول</span>
                        <div class="btn-shine"></div>
                    </button>
                    
                    <p id="error-msg" class="error-text hidden">
                        <i class="fas fa-exclamation-circle"></i> الرمز غير صحيح
                    </p>
                </form>

                <div class="card-footer">
                    <p>تم التطوير بواسطة <span class="dev-name">جعفر الصادق</span></p>
                    <p class="rights">جميع الحقوق محفوظة © 2026</p>
                </div>
            </div>
        </div>
    `;

    // Events
    const form = document.getElementById('login-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const code = document.getElementById('access-code').value.trim();
        const errorMsg = document.getElementById('error-msg');

        const result = login(code);

        if (result.success) {
            // Success Animation
            document.querySelector('.login-card').style.transform = 'scale(0.95) translateY(20px)';
            document.querySelector('.login-card').style.opacity = '0';
            setTimeout(() => {
                window.location.hash = '#home';
            }, 300);
        } else {
            errorMsg.classList.remove('hidden');
            form.classList.add('shake-anim');
            setTimeout(() => form.classList.remove('shake-anim'), 500);
        }
    });

    // Styles for Login Only
    const style = document.createElement('style');
    style.innerHTML = `
        .login-page-bg { position: fixed; inset: 0; background: radial-gradient(circle at center, #1b3a5f 0%, #020c1b 100%); z-index: -1; }
        .login-wrapper { display: flex; justify-content: center; align-items: center; min-height: 85vh; padding: 20px; }
        
        .login-card {
            width: 100%; max-width: 420px;
            padding: 40px 30px;
            border-radius: 30px;
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            text-align: center;
            position: relative;
            overflow: hidden;
            transition: 0.5s cubic-bezier(0.23, 1, 0.32, 1);
        }
        
        .glow-orb {
            position: absolute; top: -50px; left: 50%; transform: translateX(-50%);
            width: 150px; height: 150px;
            background: var(--secondary-gold);
            filter: blur(80px);
            opacity: 0.2;
            pointer-events: none;
        }

        .logo-circle {
            width: 110px; height: 110px;
            margin: 0 auto 20px;
            border-radius: 50%;
            padding: 5px;
            background: linear-gradient(135deg, var(--secondary-gold), transparent);
            box-shadow: 0 10px 20px rgba(0,0,0,0.3);
        }
        .logo-circle img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; border: 3px solid #0a192f; }
        
        .login-header h2 { color: white; margin-bottom: 5px; font-weight: 800; letter-spacing: -0.5px; }
        .subtitle { color: var(--secondary-gold); font-size: 0.9rem; margin-bottom: 40px; opacity: 0.8; letter-spacing: 1px; }

        .input-group-modern { position: relative; margin-bottom: 25px; text-align: right; }
        .input-group-modern input {
            width: 100%;
            background: rgba(0, 0, 0, 0.2);
            border: none;
            padding: 15px 50px 15px 20px;
            border-radius: 12px;
            color: white;
            font-size: 1rem;
            transition: 0.3s;
        }
        .input-group-modern input:focus { background: rgba(0, 0, 0, 0.4); box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.3); }
        .input-group-modern .icon { position: absolute; right: 20px; top: 50%; transform: translateY(-50%); color: var(--text-muted); }

        .btn-login-gold {
            width: 100%;
            padding: 15px;
            border: none;
            border-radius: 12px;
            background: linear-gradient(90deg, #d4af37, #f3d474);
            color: #0a192f;
            font-weight: 900;
            font-size: 1.1rem;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: 0.3s;
            box-shadow: 0 5px 15px rgba(212, 175, 55, 0.3);
        }
        .btn-login-gold:hover { transform: translateY(-3px); box-shadow: 0 10px 25px rgba(212, 175, 55, 0.5); }
        .btn-shine { position: absolute; top: 0; left: -100%; width: 50%; height: 100%; background: linear-gradient(to right, transparent, rgba(255,255,255,0.4), transparent); transform: skewX(-20deg); animation: shine 3s infinite; }
        
        .error-text { color: #ff6b6b; margin-top: 15px; font-size: 0.9rem; background: rgba(255, 107, 107, 0.1); padding: 5px; border-radius: 5px; }

        .card-footer { margin-top: 30px; font-size: 0.9rem; color: rgba(255,255,255,0.4); }
        .dev-name { color: var(--secondary-gold); font-weight: bold; font-family: 'Cairo', sans-serif; position: relative; display: inline-block; }
        .dev-name::after { content: ''; position: absolute; width: 100%; height: 1px; bottom: -2px; left: 0; background: var(--secondary-gold); transform: scaleX(0); transition: 0.3s; }
        .card-footer:hover .dev-name::after { transform: scaleX(1); }
        .rights { font-size: 0.75rem; opacity: 0.6; margin-top: 5px; }

        @keyframes shine { 0% { left: -100%; } 20% { left: 200%; } 100% { left: 200%; } }
        .shake-anim { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }
    `;
    container.appendChild(style);
}
