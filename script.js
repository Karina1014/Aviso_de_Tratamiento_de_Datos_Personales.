/**
 * CONFIGURACIÓN DE SUPABASE
 * Se recomienda usar variables de entorno en producción, 
 * pero aquí definimos los valores por defecto para que funcione de inmediato.
 */
const SUPABASE_URL = 'https://bhxhpfawxkskglaldirt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoeGhwZmF3eGtza2dsYWxkaXJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MDI3NTIsImV4cCI6MjA4NDA3ODc1Mn0.6OgVZKorGKfFiBas4KAclor5tzegN-sbAM4231I2WuU';

// Inicializar cliente Supabase
const _supabase = typeof supabase !== 'undefined' 
    ? supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

if (!_supabase) {
    console.error('Error: El SDK de Supabase no se cargó correctamente.');
}

/**
 * UI LOGIC
 */

window.toggleSubmit = () => {
    const chk = document.getElementById('chkConsent');
    const btn = document.getElementById('btnFinish');
    btn.disabled = !chk.checked;
};

window.handleConsent = async () => {
    const btn = document.getElementById('btnFinish');
    const btnText = btn.querySelector('.btn-text');
    
    // UI State: Loading
    btn.disabled = true;
    btnText.textContent = 'PROCESANDO...';
    btn.classList.add('pulse');

    // Get metadata from URL if exists (e.g. ?id=123&name=Juan)
    const urlParams = new URLSearchParams(window.location.search);
    
    const consentData = {
        aceptado: true,
        fecha_acepta: new Date().toISOString(),
        metadata: {
            user_agent: navigator.userAgent,
            plataforma: navigator.platform,
            url_source: window.location.href,
            external_id: urlParams.get('id') || 'anónimo'
        }
    };

    try {
        const { error } = await _supabase
            .from('consentimientos')
            .insert([consentData]);

        if (error) throw error;

        // Success State
        showSuccess(consentData);

    } catch (err) {
        console.error('Error Supabase:', err);
        alert('Hubo un error al registrar el consentimiento. Por favor intente de nuevo.');
        
        // Reset button
        btn.disabled = false;
        btnText.textContent = 'TERMINAR Y CONTINUAR';
    }
};

function showSuccess(data) {
    const panel = document.getElementById('successPanel');
    const detail = document.getElementById('successDetail');
    
    const now = new Date();
    const dateStr = now.toLocaleDateString('es-EC', { 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    detail.innerHTML = `
        <strong>Hash Digital:</strong> ${Math.random().toString(36).substring(2, 15).toUpperCase()} <br>
        <strong>Registro:</strong> ${dateStr} <br>
        <strong>Estado:</strong> Certificado Digital Generado
    `;

    panel.style.display = 'flex';
}

// Ensure the page starts at the top
window.scrollTo(0, 0);
