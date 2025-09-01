document.addEventListener('DOMContentLoaded', () => {
    // --- ESTADO DA APLICAÇÃO ---
    const apiKey = 'd150d78d3792996302365bee7eb5ea0f'; // Chave da API
    const unsplashApiKey = 'izArQR2ADfjSFvm9NBVRqNzzh5oMJT2vb_LZiYfLIJg'; // <-- ACCESS KEY DO UNSPLASH
    let currentTheme = 'light';
    let selectedAvatarSrc = null;

    // --- SELETORES GERAIS ---
    const themeSwitch = document.getElementById('theme-switch');
    const appMain = document.getElementById('app-main');
    
    // --- SELETORES DO CLIMA ---
    const cityImage = document.getElementById('city-image');
    const mainCard = document.getElementById('main-card');
    const cityInput = document.getElementById('city-input');
    const searchButton = document.getElementById('search-button');
    const searchIcon = document.getElementById('search-icon');
    const loadingSpinner = document.getElementById('loading-spinner');
    const errorContainer = document.getElementById('error-container');
    const resultsContainer = document.getElementById('results-container');
    
    // --- SELETORES DO FORMULÁRIO DE BEM-ESTAR ---
    const registrationForm = document.getElementById('registration-form');
    const regNameInput = document.getElementById('reg-name');
    const regEmailInput = document.getElementById('reg-email');
    const regDobInput = document.getElementById('reg-dob');
    const regErrorContainer = document.getElementById('reg-error-container');

    // --- SELETORES DO FORMULÁRIO DE CRIAR CONTA ---
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
        appMain.classList.toggle('newDarkTheme', isDark);
        appMain.classList.toggle('text-white', isDark);
        
        // Tema para todos os cards e inputs
        const allCards = document.querySelectorAll('.card');
        allCards.forEach(card => {
            card.classList.toggle('newDarkTheme', isDark);
            card.classList.toggle('border-secondary', isDark);
            card.classList.toggle('text-light', isDark); 
        });

        const allInputs = document.querySelectorAll('.form-control, .form-select');
        allInputs.forEach(input => {
            input.classList.toggle('newDarkTheme', isDark);
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

    const handleRegistrationSubmit = (event) => {
        event.preventDefault();
        if (regErrorContainer) regErrorContainer.innerHTML = '';

        const name = regNameInput.value.trim();
        const email = regEmailInput.value.trim();
        const dob = regDobInput.value;
        const gender = document.querySelector('input[name="gender"]:checked');

        let errors = [];
        if (!name) errors.push('O campo Nome Completo é obrigatório.');
        if (!email) errors.push('O campo Email é obrigatório.');
        else if (!/\S+@\S+\.\S+/.test(email)) errors.push('Por favor, insira um email válido.');
        if (!dob) errors.push('O campo Data de Nascimento é obrigatório.');
        if (!gender) errors.push('Por favor, selecione um gênero.');

        if (errors.length > 0) {
            if (regErrorContainer) {
                regErrorContainer.innerHTML = `
                    <div class="alert alert-danger">
                        <strong>Por favor, corrija os seguintes erros:</strong>
                        <ul>${errors.map(e => `<li>${e}</li>`).join('')}</ul>
                    </div>`;
            }
            return;
        }

        Swal.fire({
            title: 'Obrigado!',
            text: 'Seu cadastro de bem-estar foi enviado com sucesso.',
            icon: 'success',
            confirmButtonText: 'Ok'
        });

        registrationForm.reset();
    };
    
    // --- FUNÇÕES DE CLIMA ---
    const showLoading = (isLoading) => {
        searchButton.disabled = isLoading;
        loadingSpinner.classList.toggle('d-none', !isLoading);
        searchIcon.classList.toggle('d-none', isLoading);
    };

    const displayError = (message) => {
        errorContainer.innerHTML = `
            <div class="alert alert-danger text-center animate-fade-in" role="alert">
                <strong class="d-block">Ocorreu um erro:</strong>
                <span>${message}</span>
            </div>`;
    };

    const search = async () => {
        const city = cityInput.value.trim();
        if (!city) {
            displayError('Por favor, insira o nome de uma cidade.');
            return;
        }

        showLoading(true);
        errorContainer.innerHTML = '';
        resultsContainer.innerHTML = '';

        try {
            const geo = await getCoordinates(city, apiKey);
            if (!geo) {
                throw new Error(`Cidade "${city}" não encontrada no Brasil.`);
            }

            const [weather, pollution] = await Promise.all([
                getCurrentWeather(geo.name, apiKey),
                getAirPollution(geo.lat, geo.lon, apiKey)
            ]);

            renderResults(weather, pollution);

        } catch (error) {
            displayError(error.message);
        } finally {
           showLoading(false);
        }
    };

    // NOVA FUNÇÃO para buscar imagem da cidade
    const getCityImage = async (city) => {
        const defaultImage = 'https://images.unsplash.com/photo-1534430480872-3498386e7856?q=80&w=1964&auto=format&fit=crop';
        if (!unsplashApiKey || unsplashApiKey === 'izArQR2ADfjSFvm9NBVRqNzzh5oMJT2vb_LZiYfLIJg') {
            console.warn('Chave da API do Unsplash não configurada. Usando imagem padrão.');
            return defaultImage;
        }
        try {
            const response = await fetch(`https://api.unsplash.com/search/photos?query=${city}&client_id=${unsplashApiKey}&per_page=1&orientation=landscape`);
            if (!response.ok) {
                console.error('Erro ao buscar imagem da cidade no Unsplash.');
                return defaultImage;
            }
            const data = await response.json();
            if (data.results && data.results.length > 0) {
                return data.results[0].urls.regular; // Retorna a URL da imagem
            } else {
                return defaultImage; // Retorna a imagem padrão se não encontrar resultados
            }
        } catch (error) {
             console.error('Falha na requisição da imagem:', error);
             return defaultImage;
        }
    };
    
    const renderResults = (weather, pollution) => {
        resultsContainer.innerHTML = `
            <div class="d-flex flex-column gap-4 animate-fade-in">
                ${renderWeatherCard(weather)}
                ${renderAirPollutionCard(pollution)}
            </div>
        `;
    };

    const getCoordinates = async (city, key) => {
        const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city},BR&limit=1&appid=${key}`);
        if (!response.ok) throw new Error(`Erro de rede ao buscar coordenadas: ${response.statusText}`);
        const data = await response.json();
        return data.length > 0 ? data[0] : null;
    };

    const getCurrentWeather = async (city, key) => {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},BR&appid=${key}&units=metric&lang=pt_br`);
        if (!response.ok) throw new Error(`Erro de rede ao buscar clima: ${response.statusText}`);
        return response.json();
    };

    const getAirPollution = async (lat, lon, key) => {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${key}`);
        if (!response.ok) throw new Error(`Erro de rede ao buscar poluição: ${response.statusText}`);
        return response.json();
    };

    const renderWeatherCard = (weather) => {
        const isDark = currentTheme === 'dark';
        return `
            <div class="card ${isDark ? 'text-light bg-secondary bg-opacity-10 border-secondary' : 'bg-light bg-opacity-75 border-secondary-subtle'}">
                <div class="card-body text-center">
                    <h2 class="card-title h4">${weather.name}</h2>
                    <div class="d-flex align-items-center justify-content-around my-3">
                        <div>
                            <i class="${getWeatherIconClass(weather.weather[0].icon)}"></i>
                            <p class="text-capitalize mt-2 mb-0">${weather.weather[0].description}</p>
                        </div>
                        <div class="display-4 fw-bold">${weather.main.temp.toFixed(1)}°C</div>
                    </div>
                    <div class="d-flex justify-content-around small ${isDark ? 'text-white-50' : 'text-body-secondary'}">
                        <span>Sensação: ${weather.main.feels_like.toFixed(1)}°C</span>
                        <span>Umidade: ${weather.main.humidity}%</span>
                        <span>Vento: ${weather.wind.speed} m/s</span>
                    </div>
                </div>
            </div>`;
    };
    
    const renderAirPollutionCard = (air) => {
        const isDark = currentTheme === 'dark';
        const aqiData = air.list[0];
        return `
             <div class="card ${isDark ? 'text-light bg-secondary bg-opacity-10 border-secondary' : 'bg-light bg-opacity-75 border-secondary-subtle'}">
                 <div class="card-body">
                    <h3 class="card-title text-center h5 mb-3">Qualidade do Ar</h3>
                    <div class="text-center mb-3">
                        <p class="display-6 fw-bold mb-0 ${getAqiColor(aqiData.main.aqi)}">
                            ${getAqiDescription(aqiData.main.aqi)}
                        </p>
                        <p class="small ${isDark ? 'text-white-50' : 'text-body-secondary'}">(Índice: ${aqiData.main.aqi})</p>
                    </div>
                    <div class="row g-2 text-center small">
                        ${Object.entries(aqiData.components).map(([key, value]) => `
                            <div class="col-6 col-md-4">
                                <div class="${isDark ? 'bg-dark rounded p-2' : 'bg-dark-subtle rounded p-2'}">
                                    <span class="${isDark ? 'text-white-50' : 'text-body-secondary'}">${key.replace('pm2_5', 'PM₂.₅').toUpperCase()}:</span> 
                                    ${value.toFixed(2)}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                 </div>
              </div>`;
    };

    const getWeatherIconClass = (iconCode) => {
        const baseClass = 'display-1';
        let iconClass = '', colorClass = '';
        switch (iconCode) {
            case '01d': iconClass = 'bi bi-sun-fill'; colorClass = 'text-warning'; break;
            case '01n': iconClass = 'bi bi-moon-stars-fill'; colorClass = currentTheme === 'dark' ? 'text-light' : 'text-primary'; break;
            case '02d': iconClass = 'bi bi-cloud-sun-fill'; colorClass = 'text-warning'; break;
            case '02n': iconClass = 'bi bi-cloud-moon-fill'; colorClass = currentTheme === 'dark' ? 'text-light' : 'text-primary'; break;
            case '03d': case '03n': case '04d': case '04n': iconClass = 'bi bi-clouds-fill'; colorClass = currentTheme === 'dark' ? 'text-white-50' : 'text-secondary'; break;
            case '09d': case '09n': case '10d': case '10n': iconClass = 'bi bi-cloud-rain-heavy-fill'; colorClass = 'text-info'; break;
            case '11d': case '11n': iconClass = 'bi bi-cloud-lightning-rain-fill'; colorClass = 'text-danger'; break;
            case '13d': case '13n': iconClass = 'bi bi-snow2'; colorClass = 'text-info-emphasis'; break;
            case '50d': case '50n': iconClass = 'bi bi-cloud-haze-fill'; colorClass = currentTheme === 'dark' ? 'text-white-50' : 'text-secondary'; break;
            default: iconClass = 'bi bi-question-circle'; colorClass = 'text-muted'; break;
        }
        return `${baseClass} ${iconClass} ${colorClass}`;
    };

    const getAqiDescription = (aqi) => {
        const descriptions = { 1: 'Bom', 2: 'Razoável', 3: 'Moderado', 4: 'Ruim', 5: 'Muito Ruim' };
        return descriptions[aqi] || 'Desconhecido';
    };

    const getAqiColor = (aqi) => {
        const colors = { 1: 'text-success', 2: 'text-info', 3: 'text-warning', 4: 'text-danger', 5: 'text-danger fw-bold' };
        return colors[aqi] || 'text-muted';
    };

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
    registrationForm.addEventListener('submit', handleRegistrationSubmit);

    // --- INICIALIZAÇÃO ---
    applyTheme();
});

