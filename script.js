/**
 * CONFIGURACIÓN DE SUPABASE
 */
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://bhxhpfawxkskglaldirt.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoeGhwZmF3eGtza2dsYWxkaXJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MDI3NTIsImV4cCI6MjA4NDA3ODc1Mn0.6OgVZKorGKfFiBas4KAclor5tzegN-sbAM4231I2WuU';

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── ACCORDION (Opcional, no obligatorio para enviar) ──
window.toggleCard = (id) => {
    const card = document.getElementById(id);
    card.classList.toggle('open');
};

// ── PROGRESS BAR (Puramente Visual) ──
window.updateProgress = () => {
    const chk1 = document.getElementById('chk1').checked;
    const fill = document.getElementById('progressFill');
    const label = document.getElementById('progressLabel');
    const btnSubmit = document.getElementById('btnSubmit');

    // Habilitar botón instantáneamente al marcar el check
    btnSubmit.disabled = !chk1;

    // Actualizar barra visual
    const total = chk1 ? 100 : 30;
    if (fill) fill.style.width = total + '%';
    if (label) label.textContent = chk1 ? '✓ Listo para enviar' : 'Leyendo información…';
};

// ── FORM SUBMISSION (Senior UX Approach) ──
document.addEventListener('DOMContentLoaded', () => {
    const consentForm = document.getElementById('consentForm');
    const btnSubmit = document.getElementById('btnSubmit');

    if (consentForm) {
        consentForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Deshabilitar UI durante el envío
            btnSubmit.classList.add('loading');
            btnSubmit.innerHTML = '<span>Procesando...</span>';
            btnSubmit.disabled = true;

            const formData = {
                representante_nombre: document.getElementById('nombreRepresentante').value.trim(),
                correo: document.getElementById('email').value.trim(),
                grado_interes: document.getElementById('gradoInteres').value,
                aceptado: true,
                fecha_acepta: new Date().toISOString()
            };

            try {
                const { error } = await _supabase
                    .from('consentimientos')
                    .insert([formData]);

                if (error) throw error;

                // Animación de Éxito
                const now = new Date();
                const fecha = now.toLocaleDateString('es-EC', { day: '2-digit', month: 'long', year: 'numeric' });
                const codigo = 'EA-' + Math.random().toString(36).substr(2, 6).toUpperCase();

                document.getElementById('successDetail').innerHTML =
                    `<strong>Representante:</strong> ${formData.representante_nombre}<br/>` +
                    `<strong>Código:</strong> ${codigo}<br/>` +
                    `<strong>Fecha:</strong> ${fecha}`;

                document.getElementById('consentFormSection').style.display = 'none';
                document.getElementById('successPanel').style.display = 'block';
                window.scrollTo({ top: 0, behavior: 'smooth' });

            } catch (error) {
                console.error('Error:', error);
                alert("Ocurrió un error. Por favor, verifica tu conexión.");
                btnSubmit.classList.remove('loading');
                btnSubmit.innerHTML = '<span>Aceptar y Continuar</span>';
                btnSubmit.disabled = false;
            }
        });
    }

    // Permitir clic en el texto para marcar el check
    const labelCheck = document.querySelector('.check-text');
    if (labelCheck) {
        labelCheck.addEventListener('click', () => {
            const chk = document.getElementById('chk1');
            chk.checked = !chk.checked;
            updateProgress();
        });
    }
});
