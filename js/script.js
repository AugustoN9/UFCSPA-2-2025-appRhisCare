document.addEventListener("DOMContentLoaded", () => {
  // --- ESTADO DA APLICAÇÃO ---
  const weatherApiKey = "d150d78d3792996302365bee7eb5ea0f";
  const unsplashApiKey = "izArQR2ADfjSFvm9NBVRqNzzh5oMJT2vb_LZiYfLIJg";
  const gnewsApiKey = "87acee65e9ed44e6bc1ad15eb09940f0";
  let currentTheme = "light";
  let selectedAvatarSrc = null;

  // --- SELETORES GERAIS ---
  const themeSwitch = document.getElementById("theme-switch");
  const appMain = document.getElementById("app-main");

  // --- SELETORES DO CLIMA ---
  const cityImage = document.getElementById("city-image");
  const mainCard = document.getElementById("main-card");
  const cityInput = document.getElementById("city-input");
  const searchButton = document.getElementById("search-button");
  const searchIcon = document.getElementById("search-icon");
  const loadingSpinner = document.getElementById("loading-spinner");
  const errorContainer = document.getElementById("error-container");
  const resultsContainer = document.getElementById("results-container");

  // --- SELETORES DE NOTÍCIAS ---
  const newsCarouselInner = document.getElementById("news-carousel-inner");

  // --- SELETORES DOS FORMULÁRIOS ---
  const registrationForm = document.getElementById("registration-form");
  const regNameInput = document.getElementById("reg-name");
  const regEmailInput = document.getElementById("reg-email");
  const regDobInput = document.getElementById("reg-dob");
  const regErrorContainer = document.getElementById("reg-error-container");

  const accountCreationForm = document.getElementById("account-creation-form");
  const profileAvatarDisplay = document.getElementById(
    "profile-avatar-display"
  );
  const avatarChoices = document.querySelectorAll(".avatar-choice");
  const accEmailInput = document.getElementById("acc-email");
  const accPasswordInput = document.getElementById("acc-password");
  const accConfirmPasswordInput = document.getElementById(
    "acc-confirm-password"
  );
  const accountErrorContainer = document.getElementById(
    "account-error-container"
  );

  const loginForm = document.getElementById("login-form");
  const commentForm = document.getElementById("comment-form");

  // --- SELETORES DE TOGGLE ---
  const loginSection = document.getElementById("login-section");
  const accountCreationSection = document.getElementById(
    "account-creation-section"
  );
  const showCreateAccountLink = document.getElementById(
    "show-create-account-link"
  );
  const showLoginLink = document.getElementById("show-login-link");

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

  const toggleAuthView = (viewToShow) => {
    if (viewToShow === "create") {
      loginSection.classList.add("d-none");
      accountCreationSection.classList.remove("d-none");
    } else {
      // 'login'
      loginSection.classList.remove("d-none");
      accountCreationSection.classList.add("d-none");
    }
  };

  // --- FUNÇÕES DE SUBMISSÃO DE FORMULÁRIO ---

  const handleLoginSubmit = (event) => {
    event.preventDefault();
    // Lógica de validação do login aqui
    Swal.fire("Login realizado com sucesso!", "", "success");
    loginForm.reset();
  };

  const handleAvatarSelection = (event) => {
    const choice = event.currentTarget;
    const imgElement = choice.querySelector("img");
    if (!imgElement) return;
    selectedAvatarSrc = imgElement.getAttribute("src");
    profileAvatarDisplay.innerHTML = `<img src="${selectedAvatarSrc}" alt="Avatar Selecionado">`;
    avatarChoices.forEach((c) => c.classList.remove("selected"));
    choice.classList.add("selected");
  };

  const handleAccountCreationSubmit = (event) => {
    event.preventDefault();
    accountErrorContainer.innerHTML = "";
    const email = accEmailInput.value.trim();
    const password = accPasswordInput.value;
    const confirmPassword = accConfirmPasswordInput.value;

    let errors = [];
    if (!selectedAvatarSrc)
      errors.push("Por favor, escolha um avatar de perfil.");
    if (!email) errors.push("O campo Email é obrigatório.");
    else if (!/\S+@\S+\.\S+/.test(email))
      errors.push("Por favor, insira um email válido.");
    if (!password) errors.push("O campo Senha é obrigatório.");
    else if (password.length < 6)
      errors.push("A senha deve ter pelo menos 6 caracteres.");
    if (password !== confirmPassword) errors.push("As senhas não coincidem.");

    if (errors.length > 0) {
      accountErrorContainer.innerHTML = `<div class="alert alert-danger"><strong>Por favor, corrija os seguintes erros:</strong><ul>${errors
        .map((e) => `<li>${e}</li>`)
        .join("")}</ul></div>`;
      return;
    }

    Swal.fire({
      title: "Sucesso!",
      text: "Sua conta foi criada com sucesso.",
      icon: "success",
      confirmButtonText: "Ok",
    });

    accountCreationForm.reset();
    profileAvatarDisplay.innerHTML = `<img src="images/monster-icons/kidaha-01.svg" alt="Avatar Padrão">`;
    avatarChoices.forEach((c) => c.classList.remove("selected"));
    selectedAvatarSrc = null;
  };

  const handleRegistrationSubmit = (event) => {
    event.preventDefault();
    if (regErrorContainer) regErrorContainer.innerHTML = "";

    const name = regNameInput.value.trim();
    const email = regEmailInput.value.trim();
    const dob = regDobInput.value;
    const gender = document.querySelector('input[name="gender"]:checked');

    let errors = [];
    if (!name) errors.push("O campo Nome Completo é obrigatório.");
    if (!email) errors.push("O campo Email é obrigatório.");
    else if (!/\S+@\S+\.\S+/.test(email))
      errors.push("Por favor, insira um email válido.");
    if (!dob) errors.push("O campo Data de Nascimento é obrigatório.");
    if (!gender) errors.push("Por favor, selecione um gênero.");

    if (errors.length > 0) {
      if (regErrorContainer) {
        regErrorContainer.innerHTML = `<div class="alert alert-danger"><strong>Por favor, corrija os seguintes erros:</strong><ul>${errors
          .map((e) => `<li>${e}</li>`)
          .join("")}</ul></div>`;
      }
      return;
    }

    Swal.fire({
      title: "Obrigado!",
      text: "Seu cadastro de bem-estar foi enviado com sucesso.",
      icon: "success",
      confirmButtonText: "Ok",
    });
    registrationForm.reset();
  };

  const handleCommentSubmit = (event) => {
    event.preventDefault();
    const userCommentTextarea = document.getElementById("user-comment");
    const comment = userCommentTextarea.value.trim();

    if (!comment) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Por favor, escreva um comentário antes de enviar.",
      });
      return;
    }
    Swal.fire({
      icon: "success",
      title: "Obrigado!",
      text: "Seu comentário foi enviado com sucesso.",
    });
    commentForm.reset();
  };

  // --- FUNÇÕES DE API E CLIMA ---
  const showLoading = (isLoading) => {
    searchButton.disabled = isLoading;
    loadingSpinner.classList.toggle("d-none", !isLoading);
    searchIcon.classList.toggle("d-none", isLoading);
  };

  const displayError = (message) => {
    errorContainer.innerHTML = `<div class="alert alert-danger text-center animate-fade-in" role="alert"><strong>Ocorreu um erro:</strong><span>${message}</span></div>`;
  };

  const getCityImage = async (city) => {
    const defaultImage =
      "https://images.unsplash.com/photo-1534430480872-3498386e7856?q=80&w=1964&auto=format&fit=crop";
    if (!unsplashApiKey || unsplashApiKey.includes("SUA_CHAVE"))
      return defaultImage;
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${city}&client_id=${unsplashApiKey}&per_page=1&orientation=landscape`
      );
      const data = await response.json();
      return data.results && data.results.length > 0
        ? data.results[0].urls.regular
        : defaultImage;
    } catch {
      return defaultImage;
    }
  };

  const getCoordinates = async (city, key) => {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${city},BR&limit=1&appid=${key}`
    );
    const data = await response.json();
    return data.length > 0 ? data[0] : null;
  };

  const getCurrentWeather = async (city, key) => {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city},BR&appid=${key}&units=metric&lang=pt_br`
    );
    return response.json();
  };

  const getAirPollution = async (lat, lon, key) => {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${key}`
    );
    return response.json();
  };

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
      const geo = await getCoordinates(city, weatherApiKey);
      if (!geo) throw new Error(`Cidade "${city}" não encontrada.`);
      const [weather, pollution, imageUrl] = await Promise.all([
        getCurrentWeather(geo.name, weatherApiKey),
        getAirPollution(geo.lat, geo.lon, weatherApiKey),
        getCityImage(city),
      ]);
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

  // --- FUNÇÃO DE NOTÍCIAS ATUALIZADA PARA RSS (FEED DO G1) ---
  const getNews = async () => {
    // URL do feed RSS de Ciência e Saúde do G1
    const rssFeedUrl = "https://g1.globo.com/rss/g1/ciencia-e-saude/";
    // Usamos um serviço gratuito para converter o RSS para JSON
    const rss2jsonApiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(
      rssFeedUrl
    )}`;

    try {
      const response = await fetch(rss2jsonApiUrl);
      const data = await response.json();

      if (data.status !== "ok") {
        throw new Error("Não foi possível carregar o feed de notícias do G1.");
      }

      renderNews(data.items); // O array de notícias agora se chama "items"
    } catch (error) {
      console.error("Erro ao buscar notícias via RSS:", error);
      let errorMessage = `Erro ao buscar notícias: ${error.message}.`;
      newsCarouselInner.innerHTML = `<div class="carousel-item active"><p class="text-center p-5 text-danger">${errorMessage}</p></div>`;
    }
  };

  // --- FUNÇÃO DE RENDERIZAÇÃO ATUALIZADA PARA O FORMATO RSS ---
  const renderNews = (articles) => {
    if (!articles || articles.length === 0) {
      newsCarouselInner.innerHTML = `<div class="carousel-item active"><p class="text-center p-5">Nenhuma notícia encontrada no feed do G1.</p></div>`;
      return;
    }

    let newsHtml = "";
    // Limita a 5 notícias para o carrossel não ficar muito cheio
    articles.slice(0, 5).forEach((article, index) => {
      // O campo da imagem agora é "thumbnail" e o link é "link"
      const imageUrl =
        article.thumbnail ||
        "https://placehold.co/800x400/007782/FFFFFF?text=G1+Notícias";

      newsHtml += `
        <div class="carousel-item ${index === 0 ? "active" : ""}">
          <img src="${imageUrl}" class="d-block w-100 news-image" alt="${
        article.title
      }">
          <div class="carousel-caption d-none d-md-block">
            <h5>${article.title}</h5>
            <p><a href="${
              article.link
            }" target="_blank" class="btn btn-info btn-sm mt-2">Leia mais no G1</a></p>
          </div>
        </div>
      `;
    });
    newsCarouselInner.innerHTML = newsHtml;
  };

  const renderResults = (weather, pollution) => {
    resultsContainer.innerHTML = `<div class="d-flex flex-column gap-4 animate-fade-in">${renderWeatherCard(
      weather
    )}${renderAirPollutionCard(pollution)}</div>`;
  };

  const renderWeatherCard = (weather) => {
    const isDark = currentTheme === "dark";
    return `<div class="card ${
      isDark
        ? "text-light bg-secondary bg-opacity-10 border-secondary"
        : "bg-light bg-opacity-75 border-secondary-subtle"
    }"><div class="card-body text-center"><h2 class="card-title h4">${
      weather.name
    }</h2><div class="d-flex align-items-center justify-content-around my-3"><div><i class="${getWeatherIconClass(
      weather.weather[0].icon
    )}"></i><p class="text-capitalize mt-2 mb-0">${
      weather.weather[0].description
    }</p></div><div class="display-4 fw-bold">${weather.main.temp.toFixed(
      1
    )}°C</div></div><div class="d-flex justify-content-around small ${
      isDark ? "text-white-50" : "text-body-secondary"
    }"><span>Sensação: ${weather.main.feels_like.toFixed(
      1
    )}°C</span><span>Umidade: ${weather.main.humidity}%</span><span>Vento: ${
      weather.wind.speed
    } m/s</span></div></div></div>`;
  };

  const renderAirPollutionCard = (air) => {
    const isDark = currentTheme === "dark";
    const aqiData = air.list[0];
    return `<div class="card ${
      isDark
        ? "text-light bg-secondary bg-opacity-10 border-secondary"
        : "bg-light bg-opacity-75 border-secondary-subtle"
    }"><div class="card-body"><h3 class="card-title text-center h5 mb-3">Qualidade do Ar</h3><div class="text-center mb-3"><p class="display-6 fw-bold mb-0 ${getAqiColor(
      aqiData.main.aqi
    )}">${getAqiDescription(aqiData.main.aqi)}</p><p class="small ${
      isDark ? "text-white-50" : "text-body-secondary"
    }">(Índice: ${
      aqiData.main.aqi
    })</p></div><div class="row g-2 text-center small">${Object.entries(
      aqiData.components
    )
      .map(
        ([key, value]) =>
          `<div class="col-6 col-md-4"><div class="${
            isDark ? "bg-dark rounded p-2" : "bg-dark-subtle rounded p-2"
          }"><span class="${
            isDark ? "text-white-50" : "text-body-secondary"
          }">${key
            .replace("pm2_5", "PM₂.₅")
            .toUpperCase()}:</span> ${value.toFixed(2)}</div></div>`
      )
      .join("")}</div></div></div>`;
  };

  const getWeatherIconClass = (iconCode) => {
    const baseClass = "display-1";
    let iconClass = "",
      colorClass = "";
    switch (iconCode) {
      case "01d":
        iconClass = "bi bi-sun-fill";
        colorClass = "text-warning";
        break;
      case "01n":
        iconClass = "bi bi-moon-stars-fill";
        colorClass = currentTheme === "dark" ? "text-light" : "text-primary";
        break;
      case "02d":
        iconClass = "bi bi-cloud-sun-fill";
        colorClass = "text-warning";
        break;
      case "02n":
        iconClass = "bi bi-cloud-moon-fill";
        colorClass = currentTheme === "dark" ? "text-light" : "text-primary";
        break;
      case "03d":
      case "03n":
      case "04d":
      case "04n":
        iconClass = "bi bi-clouds-fill";
        colorClass =
          currentTheme === "dark" ? "text-white-50" : "text-secondary";
        break;
      case "09d":
      case "09n":
      case "10d":
      case "10n":
        iconClass = "bi bi-cloud-rain-heavy-fill";
        colorClass = "text-info";
        break;
      case "11d":
      case "11n":
        iconClass = "bi bi-cloud-lightning-rain-fill";
        colorClass = "text-danger";
        break;
      case "13d":
      case "13n":
        iconClass = "bi bi-snow2";
        colorClass = "text-info-emphasis";
        break;
      case "50d":
      case "50n":
        iconClass = "bi bi-cloud-haze-fill";
        colorClass =
          currentTheme === "dark" ? "text-white-50" : "text-secondary";
        break;
      default:
        iconClass = "bi bi-question-circle";
        colorClass = "text-muted";
        break;
    }
    return `${baseClass} ${iconClass} ${colorClass}`;
  };

  const getAqiDescription = (aqi) => {
    const descriptions = {
      1: "Bom",
      2: "Razoável",
      3: "Moderado",
      4: "Ruim",
      5: "Muito Ruim",
    };
    return descriptions[aqi] || "Desconhecido";
  };

  const getAqiColor = (aqi) => {
    const colors = {
      1: "text-success",
      2: "text-info",
      3: "text-warning",
      4: "text-danger",
      5: "text-danger fw-bold",
    };
    return colors[aqi] || "text-muted";
  };

  // --- EVENT LISTENERS ---
  themeSwitch.addEventListener("click", () => {
    currentTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme();
  });

  searchButton.addEventListener("click", search);
  cityInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") search();
  });

  if (loginForm) loginForm.addEventListener("submit", handleLoginSubmit);
  if (accountCreationForm)
    accountCreationForm.addEventListener("submit", handleAccountCreationSubmit);
  if (registrationForm)
    registrationForm.addEventListener("submit", handleRegistrationSubmit);
  if (commentForm) commentForm.addEventListener("submit", handleCommentSubmit);
  if (avatarChoices)
    avatarChoices.forEach((choice) =>
      choice.addEventListener("click", handleAvatarSelection)
    );

  if (showCreateAccountLink) {
    showCreateAccountLink.addEventListener("click", (e) => {
      e.preventDefault();
      toggleAuthView("create");
    });
  }

  if (showLoginLink) {
    showLoginLink.addEventListener("click", (e) => {
      e.preventDefault();
      toggleAuthView("login");
    });
  }

  // --- INICIALIZAÇÃO ---
  applyTheme();
  getNews(); // Carrega as notícias ao iniciar
});
