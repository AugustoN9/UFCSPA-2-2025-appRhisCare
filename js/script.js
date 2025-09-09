document.addEventListener("DOMContentLoaded", () => {
  // --- ESTADO DA APLICAÇÃO ---
  const weatherApiKey = "d150d78d3792996302365bee7eb5ea0f";
  const unsplashApiKey = "izArQR2ADfjSFvm9NBVRqNzzh5oMJT2vb_LZiYfLIJg";
  const gnewsApiKey = "87acee65e9ed44e6bc1ad15eb09940f0";
  
  // Variáveis de estado para os seletores
  let currentTheme = localStorage.getItem('theme') || "light";
  let currentApiMode = localStorage.getItem('apiMode') || "prod"; // 'prod' ou 'mock'
  let selectedAvatarSrc = null;

  // --- DADOS MOCKADOS PARA TESTE ---
  const mockApiData = {
    "cidade teste 1": { weather: { main: { temp: 8, humidity: 20, feels_like: 6 }, wind: { speed: 8.3 }, name: "Fornalha Seca", weather: [{ description: "Névoa", icon: "50d" }] }, pollution: { list: [{ main: { aqi: 5 }, components: { pm2_5: 65.0 } }] }, imageUrl: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?q=80&w=1935&auto=format&fit=crop' },
    "cidade teste 2": { weather: { main: { temp: 10, humidity: 25, feels_like: 9 }, wind: { speed: 3.3 }, name: "Pico Congelante", weather: [{ description: "Nublado", icon: "04d" }] }, pollution: { list: [{ main: { aqi: 4 }, components: { pm2_5: 50.1 } }] }, imageUrl: 'https://images.unsplash.com/photo-1438781792686-9a29352e4b85?q=80&w=2070&auto=format&fit=crop' },
    "cidade teste 3": { weather: { main: { temp: 20, humidity: 38, feels_like: 20 }, wind: { speed: 4.1 }, name: "Vale Intermediário", weather: [{ description: "Poucas Nuvens", icon: "02d" }] }, pollution: { list: [{ main: { aqi: 3 }, components: { pm2_5: 38.2 } }] }, imageUrl: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=1950&auto=format&fit=crop' },
    "cidade teste 4": { weather: { main: { temp: 24, humidity: 60, feels_like: 24 }, wind: { speed: 2.7 }, name: "Brisa Pura", weather: [{ description: "Céu Limpo", icon: "01d" }] }, pollution: { list: [{ main: { aqi: 1 }, components: { pm2_5: 10.5 } }] }, imageUrl: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&w=2070&auto=format&fit=crop' },
    "cidade teste 5": { weather: { main: { temp: 28, humidity: 75, feels_like: 30 }, wind: { speed: 1.5 }, name: "Praia Tranquila", weather: [{ description: "Ensolarado", icon: "01d" }] }, pollution: { list: [{ main: { aqi: 1 }, components: { pm2_5: 5.8 } }] }, imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723a9ce6890?q=80&w=2070&auto=format&fit=crop' },
    "cidade teste 6": { weather: { main: { temp: 5, humidity: 15, feels_like: 2 }, wind: { speed: 10 }, name: "Cratera Vulcânica", weather: [{ description: "Cinzas Vulcânicas", icon: "50d" }] }, pollution: { list: [{ main: { aqi: 5 }, components: { pm2_5: 150.0 } }] }, imageUrl: 'https://images.unsplash.com/photo-1604782352199-22776c53547b?q=80&w=1935&auto=format&fit=crop' }
  };

  // --- SELETORES GERAIS E DE ELEMENTOS ---
  const themeSwitch = document.getElementById("theme-switch");
  const apiModeSwitch = document.getElementById("api-mode-switch"); // Novo seletor
  const appMain = document.getElementById("app-main");
  const cityImage = document.getElementById("city-image");
  const cityInput = document.getElementById("city-input");
  const searchButton = document.getElementById("search-button");
  const searchIcon = document.getElementById("search-icon");
  const loadingSpinner = document.getElementById("loading-spinner");
  const errorContainer = document.getElementById("error-container");
  const resultsContainer = document.getElementById("results-container");
  // ... (resto dos seus seletores continua o mesmo)
  const newsCarouselInner = document.getElementById("news-carousel-inner");
  const registrationForm = document.getElementById("registration-form");
  const regNameInput = document.getElementById("reg-name");
  const regEmailInput = document.getElementById("reg-email");
  const regDobInput = document.getElementById("reg-dob");
  const regErrorContainer = document.getElementById("reg-error-container");
  const accountCreationForm = document.getElementById("account-creation-form");
  const profileAvatarDisplay = document.getElementById("profile-avatar-display");
  const avatarChoices = document.querySelectorAll(".avatar-choice");
  const accEmailInput = document.getElementById("acc-email");
  const accPasswordInput = document.getElementById("acc-password");
  const accConfirmPasswordInput = document.getElementById("acc-confirm-password");
  const accountErrorContainer = document.getElementById("account-error-container");
  const loginForm = document.getElementById("login-form");
  const commentForm = document.getElementById("comment-form");
  const loginSection = document.getElementById("login-section");
  const accountCreationSection = document.getElementById("account-creation-section");
  const showCreateAccountLink = document.getElementById("show-create-account-link");
  const showLoginLink = document.getElementById("show-login-link");

  // --- LÓGICA PARA FECHAR O MENU NAVBAR EM TELAS PEQUENAS ---
  const mainNavbar = document.getElementById("mainNavbar");
  const navItems = mainNavbar.querySelectorAll(".nav-link, .theme-switch");
  const bsCollapse = new bootstrap.Collapse(mainNavbar, {
    toggle: false // Evita que o menu abra ou feche na inicialização
  });

  // Adiciona um listener de clique para cada item clicável dentro do menu
  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      // Verifica se o menu está atualmente expandido (visível em telas pequenas).
      // A classe 'show' é adicionada pelo Bootstrap quando o menu está aberto.
      if (mainNavbar.classList.contains("show")) {
        // Usa o método da API do Bootstrap 5 para fechar o menu de forma programática.
        bsCollapse.hide();
      }
    });
  });

  // --- FUNÇÕES DE LÓGICA ---

  const applyTheme = () => {
    const isDark = currentTheme === "dark";
    appMain.classList.toggle("bg-dark", isDark);
    appMain.classList.toggle("text-white", isDark);
    const allCards = document.querySelectorAll(".card");
    allCards.forEach((card) => {
      card.classList.toggle("bg-dark", isDark);
      card.classList.toggle("border-secondary", isDark);
      card.classList.toggle("text-light", isDark);
    });
    const allInputs = document.querySelectorAll(".form-control, .form-select");
    allInputs.forEach((input) => {
      input.classList.toggle("bg-dark", isDark);
      input.classList.toggle("text-white", isDark);
      input.classList.toggle("border-secondary", isDark);
    });
    themeSwitch.classList.toggle("active", isDark);
  };

  // NOVA FUNÇÃO para aplicar o modo de API
  const applyApiMode = () => {
    const isMock = currentApiMode === "mock";
    apiModeSwitch.classList.toggle("active", isMock);
  };

  const toggleAuthView = (viewToShow) => {
    if (viewToShow === "create") {
      loginSection.classList.add("d-none");
      accountCreationSection.classList.remove("d-none");
    } else {
      loginSection.classList.remove("d-none");
      accountCreationSection.add("d-none");
    }
  };

  const getSeasonInfo = () => {
    const today = new Date(); today.setHours(0, 0, 0, 0); const year = today.getFullYear();
    const inicioVerao = new Date(year, 11, 21); const inicioOutono = new Date(year, 2, 20);
    const inicioInverno = new Date(year, 5, 21); const inicioPrimavera = new Date(year, 8, 22);
    let season = "", imagePath = "", message = "";
    if (today >= inicioVerao || today < inicioOutono) { season = "Verão"; imagePath = "images/estacoes/estacao02-verao.png"; message = "Atenção no Verão: Calor e umidade podem influenciar."; } else if (today >= inicioPrimavera) { season = "Primavera"; imagePath = "images/estacoes/estacao01-primavera.png"; message = "Estamos na Primavera: Cuidado com a polinização!"; } else if (today >= inicioInverno) { season = "Inverno"; imagePath = "images/estacoes/estacao04-inverno.png"; message = "Estamos no Inverno: O ar frio e seco exige mais cuidado."; } else { season = "Outono"; imagePath = "images/estacoes/estacao03-outono.png"; message = "Estamos no Outono: Mudanças climáticas podem impactar."; }
    return { season, imagePath, message };
  };

  const renderSeasonDisplay = () => {
    const seasonInfo = getSeasonInfo();
    const seasonIcon = document.getElementById("season-icon");
    const seasonText = document.getElementById("season-text");
    const seasonBadge = document.getElementById("season-badge");
    if (seasonIcon && seasonText && seasonBadge) {
      seasonIcon.src = seasonInfo.imagePath; seasonIcon.alt = `Ícone de ${seasonInfo.season}`;
      seasonIcon.style.display = 'block'; seasonText.textContent = seasonInfo.message;
      seasonBadge.textContent = seasonInfo.season; seasonBadge.className = 'badge';
      if (currentTheme === 'dark') { seasonBadge.classList.add('bg-secondary', 'text-light'); } else { seasonBadge.classList.add('bg-primary', 'text-light'); }
    }
  };

  // ... (todas as suas funções de formulário handle...Submit continuam aqui, inalteradas)
  const handleLoginSubmit = (event) => { event.preventDefault(); Swal.fire("Login realizado com sucesso!", "", "success"); loginForm.reset(); };
  const handleAvatarSelection = (event) => { const choice = event.currentTarget; const imgElement = choice.querySelector("img"); if (!imgElement) return; selectedAvatarSrc = imgElement.getAttribute("src"); profileAvatarDisplay.innerHTML = `<img src="${selectedAvatarSrc}" alt="Avatar Selecionado">`; avatarChoices.forEach((c) => c.classList.remove("selected")); choice.classList.add("selected"); };
  const handleAccountCreationSubmit = (event) => { event.preventDefault(); accountErrorContainer.innerHTML = ""; const email = accEmailInput.value.trim(); const password = accPasswordInput.value; const confirmPassword = accConfirmPasswordInput.value; let errors = []; if (!selectedAvatarSrc) errors.push("Por favor, escolha um avatar de perfil."); if (!email) errors.push("O campo Email é obrigatório."); else if (!/\S+@\S+\.\S+/.test(email)) errors.push("Por favor, insira um email válido."); if (!password) errors.push("O campo Senha é obrigatório."); else if (password.length < 6) errors.push("A senha deve ter pelo menos 6 caracteres."); if (password !== confirmPassword) errors.push("As senhas não coincidem."); if (errors.length > 0) { accountErrorContainer.innerHTML = `<div class="alert alert-danger"><strong>Por favor, corrija os seguintes erros:</strong><ul>${errors.map((e) => `<li>${e}</li>`).join("")}</ul></div>`; return; } Swal.fire({ title: "Sucesso!", text: "Sua conta foi criada com sucesso.", icon: "success", confirmButtonText: "Ok", }); accountCreationForm.reset(); profileAvatarDisplay.innerHTML = `<img src="images/monster-icons/kidaha-01.svg" alt="Avatar Padrão">`; avatarChoices.forEach((c) => c.classList.remove("selected")); selectedAvatarSrc = null; };
  const handleRegistrationSubmit = (event) => { event.preventDefault(); if (regErrorContainer) regErrorContainer.innerHTML = ""; const name = regNameInput.value.trim(); const email = regEmailInput.value.trim(); const dob = regDobInput.value; const gender = document.querySelector('input[name="gender"]:checked'); let errors = []; if (!name) errors.push("O campo Nome Completo é obrigatório."); if (!email) errors.push("O campo Email é obrigatório."); else if (!/\S+@\S+\.\S+/.test(email)) errors.push("Por favor, insira um email válido."); if (!dob) errors.push("O campo Data de Nascimento é obrigatório."); if (!gender) errors.push("Por favor, selecione um gênero."); if (errors.length > 0) { if (regErrorContainer) { regErrorContainer.innerHTML = `<div class="alert alert-danger"><strong>Por favor, corrija os seguintes erros:</strong><ul>${errors.map((e) => `<li>${e}</li>`).join("")}</ul></div>`; } return; } Swal.fire({ title: "Obrigado!", text: "Seu cadastro de bem-estar foi enviado com sucesso.", icon: "success", confirmButtonText: "Ok", }); registrationForm.reset(); };
  const handleCommentSubmit = (event) => { event.preventDefault(); const userCommentTextarea = document.getElementById("user-comment"); const comment = userCommentTextarea.value.trim(); if (!comment) { Swal.fire({ icon: "error", title: "Oops...", text: "Por favor, escreva um comentário antes de enviar.", }); return; } Swal.fire({ icon: "success", title: "Obrigado!", text: "Seu comentário foi enviado com sucesso.", }); commentForm.reset(); };
  

  // --- FUNÇÕES DE API E CLIMA ---
  const calculateRhisAlert = (weather, air) => {
    let scoreTotal = 0;
    const weatherData = weather.main; const windData = weather.wind; const airData = air.list[0].components;
    if (!weatherData || !airData || !airData.pm2_5) { return { nivel: "Indisponível", score: 0, titulo: "Dados insuficientes.", recomendacoes: [] }; }
    const temp = weatherData.temp; const humidity = weatherData.humidity; const wind_speed_kph = windData.speed * 3.6; const pm25 = airData.pm2_5;
    if (pm25 > 55) scoreTotal += 40; else if (pm25 > 35) scoreTotal += 25; else if (pm25 > 15) scoreTotal += 10;
    if (humidity < 30) scoreTotal += 25; else if (humidity > 80) scoreTotal += 15; else if (humidity < 40) scoreTotal += 10;
    if (temp < 12) scoreTotal += 10; if (wind_speed_kph > 25) scoreTotal += 5;
    if (scoreTotal > 75) return { nivel: "Muito Alto", score: scoreTotal, titulo: "Risco Muito Alto: Cuidado Extremo!", recomendacoes: ["Evite atividades ao ar livre.", "Mantenha ambientes internos úmidos.", "Realize lavagem nasal com soro."] };
    if (scoreTotal > 45) return { nivel: "Alto", score: scoreTotal, titulo: "Risco Alto: Previna-se!", recomendacoes: ["Reduza atividades físicas intensas.", "Beba bastante água e lave o nariz.", "Tenha sua medicação por perto."] };
    if (scoreTotal > 20) return { nivel: "Moderado", score: scoreTotal, titulo: "Risco Moderado: Fique Atento.", recomendacoes: ["Pessoas sensíveis podem sentir desconforto.", "Mantenha-se hidratado."] };
    return { nivel: "Baixo", score: scoreTotal, titulo: "Risco Baixo: Dia tranquilo!", recomendacoes: ["Condições favoráveis para atividades ao ar livre."] };
  };
  const getRiskGaugeConfig = (alertData) => { const isDark = currentTheme === 'dark'; const config = { 'Baixo': { color: '#28a745', textColor: 'text-success' }, 'Moderado': { color: '#ffc107', textColor: 'text-warning' }, 'Alto': { color: '#fd7e14', textColor: 'text-orange' }, 'Muito Alto': { color: '#dc3545', textColor: 'text-danger' }, 'Indisponível': { color: '#6c757d', textColor: 'text-secondary' } }; const style = config[alertData.nivel] || config['Indisponível']; style.emptyColor = isDark ? '#495057' : '#e9ecef'; return style; };
  const createRiskGauge = (alertData) => { const canvas = document.getElementById('riskGauge'); if (!canvas) return; const ctx = canvas.getContext('2d'); if (canvas.chart) { canvas.chart.destroy(); } const gaugeConfig = getRiskGaugeConfig(alertData); const score = Math.min(alertData.score, 100); const chartConfig = { type: 'doughnut', data: { datasets: [{ data: [score, 100 - score], backgroundColor: [gaugeConfig.color, gaugeConfig.emptyColor], borderColor: [gaugeConfig.color, gaugeConfig.emptyColor], borderWidth: 0, circumference: 180, rotation: 270, }] }, options: { responsive: true, maintainAspectRatio: true, aspectRatio: 2, cutout: '70%', plugins: { legend: { display: false }, tooltip: { enabled: false } } } }; canvas.chart = new Chart(ctx, chartConfig); const riskScoreText = document.getElementById('risk-score-text'); const riskLevelText = document.getElementById('risk-level-text'); const riskRecommendationsList = document.getElementById('risk-recommendations-list'); if (riskScoreText) riskScoreText.textContent = `${alertData.score.toFixed(0)} / 100`; if (riskLevelText) { riskLevelText.textContent = alertData.titulo; riskLevelText.className = `h5 mt-2 ${gaugeConfig.textColor}`; } if (riskRecommendationsList) { riskRecommendationsList.innerHTML = alertData.recomendacoes.map(rec => `<li>${rec}</li>`).join(''); } };
  const showLoading = (isLoading) => { searchButton.disabled = isLoading; loadingSpinner.classList.toggle("d-none", !isLoading); searchIcon.classList.toggle("d-none", isLoading); };
  const displayError = (message) => { errorContainer.innerHTML = `<div class="alert alert-danger text-center animate-fade-in" role="alert"><strong>Ocorreu um erro:</strong><span>${message}</span></div>`; };
  
  // --- FUNÇÕES DE BUSCA DE DADOS ---
  const getCityImage = async (city) => { const defaultImage = "https://images.unsplash.com/photo-1534430480872-3498386e7856?q=80&w=1964&auto=format&fit=crop"; if (!unsplashApiKey || unsplashApiKey.includes("SUA_CHAVE")) return defaultImage; try { const response = await fetch(`https://api.unsplash.com/search/photos?query=${city}&client_id=${unsplashApiKey}&per_page=1&orientation=landscape`); const data = await response.json(); return data.results && data.results.length > 0 ? data.results[0].urls.regular : defaultImage; } catch { return defaultImage; } };
  const getCoordinates = async (city, key) => { const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city},BR&limit=1&appid=${key}`); const data = await response.json(); return data.length > 0 ? data[0] : null; };
  const getCurrentWeather = async (city, key) => { const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},BR&appid=${key}&units=metric&lang=pt_br`); return response.json(); };
  const getAirPollution = async (lat, lon, key) => { const response = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${key}`); return response.json(); };
  
  // --- FUNÇÕES DE NOTÍCIAS ---
  const getNews = async () => { const rssFeedUrl = "https://g1.globo.com/rss/g1/ciencia-e-saude/"; const rss2jsonApiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssFeedUrl)}`; try { const response = await fetch(rss2jsonApiUrl); const data = await response.json(); if (data.status !== "ok") { throw new Error("Não foi possível carregar o feed de notícias do G1."); } renderNews(data.items); } catch (error) { console.error("Erro ao buscar notícias via RSS:", error); newsCarouselInner.innerHTML = `<div class="carousel-item active"><p class="text-center p-5 text-danger">Erro ao buscar notícias.</p></div>`; } };
  const renderNews = (articles) => { if (!articles || articles.length === 0) { newsCarouselInner.innerHTML = `<div class="carousel-item active"><p class="text-center p-5">Nenhuma notícia encontrada.</p></div>`; return; } let newsHtml = ""; articles.slice(0, 5).forEach((article, index) => { const imageUrl = article.thumbnail || "https://placehold.co/800x400/007782/FFFFFF?text=G1+Notícias"; newsHtml += `<div class="carousel-item ${index === 0 ? "active" : ""}"><img src="${imageUrl}" class="d-block w-100 news-image" alt="${article.title}"><div class="carousel-caption d-none d-md-block"><h5>${article.title}</h5><p><a href="${article.link}" target="_blank" class="btn btn-info btn-sm mt-2">Leia mais no G1</a></p></div></div>`; }); newsCarouselInner.innerHTML = newsHtml; };
  
  // --- FUNÇÕES DE RENDERIZAÇÃO ---
  const renderWeatherCard = (weather) => { const isDark = currentTheme === "dark"; return `<div class="card ${isDark ? "text-light bg-secondary bg-opacity-10 border-secondary" : "bg-light bg-opacity-75 border-secondary-subtle"}"><div class="card-body text-center"><h2 class="card-title h4">${weather.name}</h2><div class="d-flex align-items-center justify-content-around my-3"><div><i class="${getWeatherIconClass(weather.weather[0].icon)}"></i><p class="text-capitalize mt-2 mb-0">${weather.weather[0].description}</p></div><div class="display-4 fw-bold">${weather.main.temp.toFixed(1)}°C</div></div><div class="d-flex justify-content-around small ${isDark ? "text-white-50" : "text-body-secondary"}"><span>Sensação: ${weather.main.feels_like.toFixed(1)}°C</span><span>Umidade: ${weather.main.humidity}%</span><span>Vento: ${weather.wind.speed} m/s</span></div></div></div>`; };
  const renderAirPollutionCard = (air) => { const isDark = currentTheme === "dark"; const aqiData = air.list[0]; return `<div class="card ${isDark ? "text-light bg-secondary bg-opacity-10 border-secondary" : "bg-light bg-opacity-75 border-secondary-subtle"}"><div class="card-body"><h3 class="card-title text-center h5 mb-3">Qualidade do Ar</h3><div class="text-center mb-3"><p class="display-6 fw-bold mb-0 ${getAqiColor(aqiData.main.aqi)}">${getAqiDescription(aqiData.main.aqi)}</p><p class="small ${isDark ? "text-white-50" : "text-body-secondary"}">(Índice: ${aqiData.main.aqi})</p></div><div class="row g-2 text-center small">${Object.entries(aqiData.components).map(([key, value]) => `<div class="col-6 col-md-4"><div class="${isDark ? "bg-dark rounded p-2" : "bg-dark-subtle rounded p-2"}"><span class="${isDark ? "text-white-50" : "text-body-secondary"}">${key.replace("pm2_5", "PM₂.₅").toUpperCase()}:</span> ${value.toFixed(2)}</div></div>`).join("")}</div></div></div>`; };
  const getWeatherIconClass = (iconCode) => { const baseClass = "display-1"; let iconClass = "", colorClass = ""; switch (iconCode) { case "01d": iconClass = "bi bi-sun-fill"; colorClass = "text-warning"; break; case "01n": iconClass = "bi bi-moon-stars-fill"; colorClass = currentTheme === "dark" ? "text-light" : "text-primary"; break; case "02d": iconClass = "bi bi-cloud-sun-fill"; colorClass = "text-warning"; break; case "02n": iconClass = "bi bi-cloud-moon-fill"; colorClass = currentTheme === "dark" ? "text-light" : "text-primary"; break; case "03d": case "03n": case "04d": case "04n": iconClass = "bi bi-clouds-fill"; colorClass = currentTheme === "dark" ? "text-white-50" : "text-secondary"; break; case "09d": case "09n": case "10d": case "10n": iconClass = "bi bi-cloud-rain-heavy-fill"; colorClass = "text-info"; break; case "11d": case "11n": iconClass = "bi bi-cloud-lightning-rain-fill"; colorClass = "text-danger"; break; case "13d": case "13n": iconClass = "bi bi-snow2"; colorClass = "text-info-emphasis"; break; case "50d": case "50n": iconClass = "bi bi-cloud-haze-fill"; colorClass = currentTheme === "dark" ? "text-white-50" : "text-secondary"; break; default: iconClass = "bi bi-question-circle"; colorClass = "text-muted"; break; } return `${baseClass} ${iconClass} ${colorClass}`; };
  const getAqiDescription = (aqi) => { const descriptions = { 1: "Bom", 2: "Razoável", 3: "Moderado", 4: "Ruim", 5: "Muito Ruim" }; return descriptions[aqi] || "Desconhecido"; };
  const getAqiColor = (aqi) => { const colors = { 1: "text-success", 2: "text-info", 3: "text-warning", 4: "text-danger", 5: "text-danger fw-bold" }; return colors[aqi] || "text-muted"; };
  
  /**
   * FUNÇÃO DE BUSCA PRINCIPAL - AGORA COM LÓGICA DE MODO (PROD/MOCK)
   */
  const search = async () => {
    const city = cityInput.value.trim();
    if (!city) {
      displayError("Por favor, insira o nome de uma cidade.");
      return;
    }
    showLoading(true);
    errorContainer.innerHTML = "";
    resultsContainer.innerHTML = "";

    try {
      let weather, pollution, imageUrl;

      if (currentApiMode === 'mock') {
        // --- LÓGICA MOCK ---
        await new Promise(resolve => setTimeout(resolve, 500)); // Simula espera da rede
        const mockCityData = mockApiData[city.toLowerCase()];
        if (!mockCityData) throw new Error(`A cidade de teste "${city}" não existe. Tente "Cidade Teste 1", etc.`);
        weather = mockCityData.weather;
        pollution = mockCityData.pollution;
        imageUrl = mockCityData.imageUrl;
      } else {
        // --- LÓGICA DE PRODUÇÃO (API REAL) ---
        const geo = await getCoordinates(city, weatherApiKey);
        if (!geo) throw new Error(`Cidade "${city}" não encontrada.`);
        [weather, pollution, imageUrl] = await Promise.all([
          getCurrentWeather(geo.name, weatherApiKey),
          getAirPollution(geo.lat, geo.lon, weatherApiKey),
          getCityImage(city),
        ]);
      }

      cityImage.style.opacity = 0;
      setTimeout(() => {
        cityImage.src = imageUrl;
        cityImage.onload = () => (cityImage.style.opacity = 1);
      }, 300);
      renderResults(weather, pollution);

    } catch (error) {
      displayError(error.message);
    } finally {
      showLoading(false);
    }
  };

  const renderResults = (weather, pollution) => {
    const isDark = currentTheme === 'dark';
    const alertData = calculateRhisAlert(weather, pollution);
    const rhisAlertCardHTML = `
        <div class="card ${isDark ? "text-light bg-dark border-secondary" : ""}">
            <div class="card-body text-center">
                <h3 class="card-title text-center h5 mb-3">Riscômetro RhisAlert</h3>
                <div class="position-relative mx-auto" style="max-width: 250px;">
                    <canvas id="riskGauge"></canvas>
                    <div id="risk-score-text" class="position-absolute top-50 start-50 translate-middle fw-bold fs-4"></div>
                </div>
                <div id="risk-level-text" class="h5 mt-2"></div>
                <ul id="risk-recommendations-list" class="list-unstyled small text-start mt-3"></ul>
            </div>
        </div>`;

    resultsContainer.innerHTML = `
        <div class="d-flex flex-column gap-4 animate-fade-in">
            ${renderWeatherCard(weather)}
            ${renderAirPollutionCard(pollution)}
            ${rhisAlertCardHTML}
        </div>`;

    createRiskGauge(alertData);
  };

  // --- EVENT LISTENERS ---
  themeSwitch.addEventListener("click", () => {
    currentTheme = currentTheme === "dark" ? "light" : "dark";
    localStorage.setItem('theme', currentTheme);
    applyTheme();
    renderSeasonDisplay();
  });

  // NOVO EVENT LISTENER para o seletor de modo
  apiModeSwitch.addEventListener("click", () => {
    currentApiMode = currentApiMode === "prod" ? "mock" : "prod";
    localStorage.setItem('apiMode', currentApiMode);
    applyApiMode();
    Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'info',
        title: `Modo de API alterado para: ${currentApiMode.toUpperCase()}`,
        showConfirmButton: false,
        timer: 2000
    });
  });

  searchButton.addEventListener("click", search);
  cityInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") search();
  });

  if (loginForm) loginForm.addEventListener("submit", handleLoginSubmit);
  if (accountCreationForm) accountCreationForm.addEventListener("submit", handleAccountCreationSubmit);
  if (registrationForm) registrationForm.addEventListener("submit", handleRegistrationSubmit);
  if (commentForm) commentForm.addEventListener("submit", handleCommentSubmit);
  if (avatarChoices) avatarChoices.forEach((choice) => choice.addEventListener("click", handleAvatarSelection));
  if (showCreateAccountLink) { showCreateAccountLink.addEventListener("click", (e) => { e.preventDefault(); toggleAuthView("create"); }); }
  if (showLoginLink) { showLoginLink.addEventListener("click", (e) => { e.preventDefault(); toggleAuthView("login"); }); }

  // --- INICIALIZAÇÃO ---
  applyTheme();
  applyApiMode(); // Aplica o modo de API salvo
  getNews(); 
  renderSeasonDisplay();
});

