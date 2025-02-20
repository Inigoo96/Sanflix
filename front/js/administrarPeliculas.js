document.addEventListener('DOMContentLoaded', function() {
    // Verificar si el usuario es admin
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (!usuario || usuario.username !== 'ADMIN') {
        window.location.href = '../html/dashboard.html';
        return;
    }
});