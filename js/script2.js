document.addEventListener('DOMContentLoaded', () => {
    // --- ESTADO DA APLICAÇÃO ---
    const apiKey = 'd150d78d3792996302365bee7eb5ea0f'; 
    let currentTheme = 'light';
    let selectedAvatarSrc = null;

    // --- SELETORES GERAIS ---
    const themeSwitch = document.getElementById('theme-switch');
    const appMain = document.getElementById('app-main');
    const mainCard = document.getElementById('main-card');
    const subtitle = document.getElementById('subtitle');
    const appFooter = document.getElementById('app-footer');
    
    // --- SELETORES DO CLIMA ---
    const cityInput = document.getElementById('city-input');
    const searchButton = document.getElementById('search-button');
    const searchIcon = document.getElementById('search-icon');
    const loadingSpinner = document.getElementById('loading-spinner');
    const errorContainer = document.getElementById('error-container');
    const resultsContainer = document.getElementById('results-container');
    
    // --- SELETORES DO FORMULÁRIO DE BEM-ESTAR ---
    const registrationSection = document.getElementById('registration-section');
    const registrationForm = document.getElementById('registration-form');
    const regNameInput = document.getElementById('reg-name');
    const regEmailInput = document.getElementById('reg-email');
    const regDobInput = document.getElementById('reg-dob');
    const regErrorContainer = document.getElementById('reg-error-container'); // Assumindo que você adicionará um container de erro para este form também

    // --- SELETORES DO FORMULÁRIO DE CRIAR CONTA ---
    const accountCreationSection = document.getElementById('account-creation-section');
    const accountCreationForm = document.getElementById('account-creation-form');
    const profileAvatarDisplay = document.getElementById('profile-avatar-display');
    const avatarChoices = document.querySelectorAll('.avatar-choice');
    const accEmailInput = document.getElementById('acc-email');
    const accPasswordInput = document.getElementById('acc-password');
    const accConfirmPasswordInput = document.getElementById('acc-confirm-password');
    const accountErrorContainer = document.getElementById('account-error-container');

    // --- FUNÇÕES DE LÓGICA ---

    const applyTheme = () => {
        const isDark = currentTheme === 'dark';
        
        // Tema para elementos principais
        appMain.classList.toggle('bg-dark', isDark);
        appMain.classList.toggle('text-white', isDark);
        mainCard.classList.toggle('bg-dark', isDark);
        
        // Tema para inputs e seções
        const allCards = document.querySelectorAll('.card');
        allCards.forEach(card => {
            card.classList.toggle('bg-dark', isDark);
            card.classList.toggle('border-secondary', isDark);
        });

        const allInputs = document.querySelectorAll('.form-control, .form-select');
        allInputs.forEach(input => {
            input.classList.toggle('bg-dark', isDark);
            input.classList.toggle('text-white', isDark);
            input.classList.toggle('border-secondary', isDark);
        });
        
        // Atualiza o seletor de tema
        themeSwitch.classList.toggle('active', isDark);
    };

    const handleAvatarSelection = (event) => {
        const choice = event.currentTarget;
        const imgElement = choice.querySelector('img');
        if (!imgElement) return;

        selectedAvatarSrc = imgElement.getAttribute('src');
        profileAvatarDisplay.innerHTML = `<img src="${selectedAvatarSrc}" alt="Avatar Selecionado">`;
        
        avatarChoices.forEach(c => c.classList.remove('selected'));
        choice.classList.add('selected');
    };

    const handleAccountCreationSubmit = (event) => {
        event.preventDefault();
        accountErrorContainer.innerHTML = '';
        
        const email = accEmailInput.value.trim();
        const password = accPasswordInput.value;
        const confirmPassword = accConfirmPasswordInput.value;

        let errors = [];
        if (!selectedAvatarSrc) errors.push('Por favor, escolha um avatar de perfil.');
        if (!email) errors.push('O campo Email é obrigatório.');
        else if (!/\S+@\S+\.\S+/.test(email)) errors.push('Por favor, insira um email válido.');
        if (!password) errors.push('O campo Senha é obrigatório.');
        else if (password.length < 6) errors.push('A senha deve ter pelo menos 6 caracteres.');
        if (password !== confirmPassword) errors.push('As senhas não coincidem.');

        if (errors.length > 0) {
            accountErrorContainer.innerHTML = `
                <div class="alert alert-danger">
                    <strong>Por favor, corrija os seguintes erros:</strong>
                    <ul>${errors.map(e => `<li>${e}</li>`).join('')}</ul>
                </div>`;
            return;
        }
        
        // ADAPTAÇÃO: Usando SweetAlert2 para a mensagem de sucesso
        Swal.fire({
          title: 'Sucesso!',
          text: 'Sua conta foi criada com sucesso.',
          icon: 'success',
          confirmButtonText: 'Ok'
        });
        
        accountCreationForm.reset();
        profileAvatarDisplay.innerHTML = `<img src="images/monster-icons/kidaha-01.svg" alt="Avatar Padrão">`;
        avatarChoices.forEach(c => c.classList.remove('selected'));
        selectedAvatarSrc = null;
    };
    
    // ... (Aqui entraria a função handleRegistrationSubmit para o outro formulário, se necessário) ...
    
    // --- FUNÇÕES DE CLIMA ---
    // ... (Todas as funções de busca de clima: search, renderResults, getCoordinates, etc. permanecem aqui) ...


    // --- EVENT LISTENERS ---
    themeSwitch.addEventListener('click', () => {
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme();
    });
    
    searchButton.addEventListener('click', search);
    cityInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') search();
    });

    accountCreationForm.addEventListener('submit', handleAccountCreationSubmit);
    avatarChoices.forEach(choice => choice.addEventListener('click', handleAvatarSelection));
    // registrationForm.addEventListener('submit', handleRegistrationSubmit); // Listener para o outro formulário

    // --- INICIALIZAÇÃO ---
    applyTheme();
});

// Cole aqui o restante das suas funções de busca de clima e helpers
// Exemplo:
async function search() { /* ... sua lógica de busca ... */ }
// etc.

