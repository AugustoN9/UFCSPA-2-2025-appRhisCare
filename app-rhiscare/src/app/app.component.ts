import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importe o CommonModule

// --- INTERFACES (MODELOS DE DADOS) ---
interface GeoData {
  name: string;
  lat: number;
  lon: number;
  country: string;
}

interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
  };
}

interface AirPollutionData {
  list: {
    main: {
      aqi: number;
    };
    components: {
      co: number;
      no2: number;
      o3: number;
      so2: number;
      pm2_5: number;
    };
  }[];
}

// --- SERVIÇO (A LÓGICA "BACKEND") ---
class WeatherService {
  private readonly geoApiUrl = 'https://api.openweathermap.org/geo/1.0/direct';
  private readonly weatherApiUrl = 'https://api.openweathermap.org/data/2.5/weather';
  private readonly airPollutionApiUrl = 'https://api.openweathermap.org/data/2.5/air_pollution';

  async getCoordinates(city: string, apiKey: string): Promise<GeoData | null> {
    const encodedCity = encodeURIComponent(city);
    const response = await fetch(`${this.geoApiUrl}?q=${encodedCity},BR&limit=1&appid=${apiKey}`);
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Chave de API inválida ou não ativada. Verifique a chave ou aguarde se for nova.');
      }
      throw new Error(`Erro ao buscar coordenadas: O servidor respondeu com status ${response.status}.`);
    }
    const data: GeoData[] = await response.json();
    return data.length > 0 ? data[0] : null;
  }

  async getCurrentWeather(city: string, apiKey: string): Promise<WeatherData> {
    const encodedCity = encodeURIComponent(city);
    const response = await fetch(`${this.weatherApiUrl}?q=${encodedCity},BR&appid=${apiKey}&units=metric&lang=pt_br`);
    if (!response.ok) {
       if (response.status === 401) {
        throw new Error('Chave de API inválida ou não ativada ao buscar o clima.');
      }
      throw new Error(`Erro ao buscar previsão do tempo: O servidor respondeu com status ${response.status}.`);
    }
    return response.json();
  }

  async getAirPollution(lat: number, lon: number, apiKey: string): Promise<AirPollutionData> {
    const response = await fetch(`${this.airPollutionApiUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}`);
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Chave de API inválida ou não ativada ao buscar dados de poluição.');
      }
      throw new Error(`Erro ao buscar dados de poluição: O servidor respondeu com status ${response.status}.`);
    }
    return response.json();
  }
}

// --- COMPONENTE ---
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  // --- ESTADO DA APLICAÇÃO ---
  // A chave da API agora é uma propriedade interna e privada.
  private apiKey = 'd150d78d3792996302365bee7eb5ea0f'; // <-- IMPORTANTE: Cole sua chave aqui!
  
  city = signal<string>('');
  theme = signal<'light' | 'dark'>('dark');
  weatherData = signal<WeatherData | null>(null);
  airPollutionData = signal<AirPollutionData | null>(null);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  private weatherService = new WeatherService();

  // --- MÉTODOS (AÇÕES DO USUÁRIO) ---

  toggleTheme(): void {
    this.theme.set(this.theme() === 'dark' ? 'light' : 'dark');
  }

  async search(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.weatherData.set(null);
    this.airPollutionData.set(null);
    const currentCity = this.city();

    // A validação da chave da API foi removida daqui.
    if (!currentCity) {
      this.errorMessage.set('Por favor, insira o nome da cidade.');
      this.isLoading.set(false);
      return;
    }

    try {
      // Agora usa a chave interna this.apiKey.
      const geo = await this.weatherService.getCoordinates(currentCity, this.apiKey);
      if (!geo) {
        throw new Error(`Cidade "${currentCity}" não encontrada no Brasil.`);
      }
      const [weather, pollution] = await Promise.all([
        this.weatherService.getCurrentWeather(geo.name, this.apiKey),
        this.weatherService.getAirPollution(geo.lat, geo.lon, this.apiKey)
      ]);
      this.weatherData.set(weather);
      this.airPollutionData.set(pollution);
    } catch (error: any) {
      this.errorMessage.set(error.message || 'Ocorreu um erro desconhecido.');
    } finally {
      this.isLoading.set(false);
    }
  }

  // --- FUNÇÕES AUXILIARES PARA A VIEW ---

  getWeatherIconClass(iconCode: string): string {
    const baseClass = 'display-1';
    let iconClass = '';
    let colorClass = '';

    switch (iconCode) {
      case '01d':
        iconClass = 'bi bi-sun-fill';
        colorClass = 'text-warning';
        break;
      case '01n':
        iconClass = 'bi bi-moon-stars-fill';
        colorClass = this.theme() === 'dark' ? 'text-light' : 'text-primary';
        break;
      case '02d':
        iconClass = 'bi bi-cloud-sun-fill';
        colorClass = 'text-warning';
        break;
      case '02n':
        iconClass = 'bi bi-cloud-moon-fill';
        colorClass = this.theme() === 'dark' ? 'text-light' : 'text-primary';
        break;
      case '03d':
      case '03n':
      case '04d':
      case '04n':
        iconClass = 'bi bi-clouds-fill';
        colorClass = this.theme() === 'dark' ? 'text-white-50' : 'text-secondary';
        break;
      case '09d':
      case '09n':
      case '10d':
      case '10n':
        iconClass = 'bi bi-cloud-rain-heavy-fill';
        colorClass = 'text-info';
        break;
      case '11d':
      case '11n':
        iconClass = 'bi bi-cloud-lightning-rain-fill';
        colorClass = 'text-danger';
        break;
      case '13d':
      case '13n':
        iconClass = 'bi bi-snow2';
        colorClass = 'text-info-emphasis';
        break;
      case '50d':
      case '50n':
        iconClass = 'bi bi-cloud-haze-fill';
        colorClass = this.theme() === 'dark' ? 'text-white-50' : 'text-secondary';
        break;
      default:
        iconClass = 'bi bi-question-circle';
        colorClass = 'text-muted';
        break;
    }
    return `${baseClass} ${iconClass} ${colorClass}`;
  }

  getAqiDescription(aqi: number): string {
    switch (aqi) {
      case 1: return 'Bom';
      case 2: return 'Razoável';
      case 3: return 'Moderado';
      case 4: return 'Ruim';
      case 5: return 'Muito Ruim';
      default: return 'Desconhecido';
    }
  }

  getAqiColor(aqi: number): string {
    switch (aqi) {
      case 1: return 'text-success';
      case 2: return 'text-info';
      case 3: return 'text-warning';
      case 4: return 'text-danger';
      case 5: return 'text-danger fw-bold';
      default: return 'text-muted';
    }
  }
}

