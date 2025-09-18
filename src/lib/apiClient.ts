import { toast } from 'sonner';

// API Error types
export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export class NetworkError extends Error {
  constructor(message: string = 'Error de conexión') {
    super(message);
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends Error {
  constructor(message: string = 'Tiempo de espera agotado') {
    super(message);
    this.name = 'TimeoutError';
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public errors: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Request configuration
interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  showErrorToast?: boolean;
  showSuccessToast?: boolean;
  successMessage?: string;
}

interface APIResponse<T = any> {
  data: T;
  status: number;
  message?: string;
  errors?: Record<string, string[]>;
}

// Utility functions
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const isNetworkError = (error: any): boolean => {
  return !navigator.onLine || 
         error.name === 'NetworkError' ||
         error.message?.includes('fetch') ||
         error.code === 'NETWORK_ERROR';
};

const getErrorMessage = (error: any): string => {
  if (error.message) return error.message;
  if (typeof error === 'string') return error;
  return 'Error desconocido';
};

// Main API client class
export class APIClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private defaultTimeout: number;

  constructor(baseURL: string = '', defaultTimeout: number = 10000) {
    this.baseURL = baseURL;
    this.defaultTimeout = defaultTimeout;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  // Set authentication token
  setAuthToken(token: string) {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  // Remove authentication token
  clearAuthToken() {
    delete this.defaultHeaders['Authorization'];
  }

  // Create request with timeout
  private createRequestWithTimeout(
    url: string,
    options: RequestInit,
    timeout: number
  ): Promise<Response> {
    return new Promise((resolve, reject) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        reject(new TimeoutError());
      }, timeout);

      fetch(url, {
        ...options,
        signal: controller.signal,
      })
        .then(resolve)
        .catch(reject)
        .finally(() => clearTimeout(timeoutId));
    });
  }

  // Process response
  private async processResponse<T>(response: Response): Promise<APIResponse<T>> {
    const contentType = response.headers.get('content-type');
    const isJSON = contentType?.includes('application/json');

    let data: any;
    try {
      data = isJSON ? await response.json() : await response.text();
    } catch (error) {
      throw new APIError('Error al procesar la respuesta', response.status);
    }

    if (!response.ok) {
      // Handle different error status codes
      switch (response.status) {
        case 400:
          if (data.errors) {
            throw new ValidationError(data.message || 'Datos inválidos', data.errors);
          }
          throw new APIError(data.message || 'Solicitud inválida', response.status, 'BAD_REQUEST', data);
        
        case 401:
          // Clear auth token on unauthorized
          this.clearAuthToken();
          throw new APIError(data.message || 'No autorizado', response.status, 'UNAUTHORIZED', data);
        
        case 403:
          throw new APIError(data.message || 'Acceso denegado', response.status, 'FORBIDDEN', data);
        
        case 404:
          throw new APIError(data.message || 'Recurso no encontrado', response.status, 'NOT_FOUND', data);
        
        case 409:
          throw new APIError(data.message || 'Conflicto', response.status, 'CONFLICT', data);
        
        case 422:
          if (data.errors) {
            throw new ValidationError(data.message || 'Datos inválidos', data.errors);
          }
          throw new APIError(data.message || 'Entidad no procesable', response.status, 'UNPROCESSABLE_ENTITY', data);
        
        case 429:
          throw new APIError(data.message || 'Demasiadas solicitudes', response.status, 'RATE_LIMITED', data);
        
        case 500:
          throw new APIError(data.message || 'Error interno del servidor', response.status, 'INTERNAL_ERROR', data);
        
        case 502:
          throw new APIError(data.message || 'Bad Gateway', response.status, 'BAD_GATEWAY', data);
        
        case 503:
          throw new APIError(data.message || 'Servicio no disponible', response.status, 'SERVICE_UNAVAILABLE', data);
        
        default:
          throw new APIError(
            data.message || `Error HTTP ${response.status}`,
            response.status,
            'UNKNOWN_ERROR',
            data
          );
      }
    }

    return {
      data,
      status: response.status,
      message: data.message,
      errors: data.errors,
    };
  }

  // Main request method with retry logic
  private async makeRequest<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<APIResponse<T>> {
    const {
      method = 'GET',
      headers = {},
      body,
      timeout = this.defaultTimeout,
      retries = 3,
      retryDelay = 1000,
      showErrorToast = true,
      showSuccessToast = false,
      successMessage,
    } = config;

    const url = this.baseURL + endpoint;
    const requestHeaders = { ...this.defaultHeaders, ...headers };

    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
    };

    let lastError: Error;

    // Retry logic
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await this.createRequestWithTimeout(url, requestOptions, timeout);
        const result = await this.processResponse<T>(response);

        // Show success toast if configured
        if (showSuccessToast && successMessage) {
          toast.success(successMessage);
        }

        return result;
      } catch (error: any) {
        lastError = error;

        // Don't retry on certain errors
        if (
          error instanceof ValidationError ||
          error instanceof APIError && [400, 401, 403, 404, 422].includes(error.status)
        ) {
          break;
        }

        // Don't retry on last attempt
        if (attempt === retries) {
          break;
        }

        // Only retry on network errors or 5xx errors
        if (
          isNetworkError(error) ||
          (error instanceof APIError && error.status >= 500)
        ) {
          await delay(retryDelay * Math.pow(2, attempt)); // Exponential backoff
          continue;
        }

        break;
      }
    }

    // Handle final error
    if (showErrorToast) {
      this.handleErrorToast(lastError);
    }

    throw lastError;
  }

  // Handle error toasts
  private handleErrorToast(error: Error) {
    if (error instanceof NetworkError) {
      toast.error('Sin conexión a internet. Verifica tu conexión.');
    } else if (error instanceof TimeoutError) {
      toast.error('La solicitud tardó demasiado. Inténtalo de nuevo.');
    } else if (error instanceof ValidationError) {
      toast.error(error.message);
    } else if (error instanceof APIError) {
      switch (error.code) {
        case 'UNAUTHORIZED':
          toast.error('Sesión expirada. Por favor, inicia sesión nuevamente.');
          break;
        case 'FORBIDDEN':
          toast.error('No tienes permisos para realizar esta acción.');
          break;
        case 'NOT_FOUND':
          toast.error('El recurso solicitado no existe.');
          break;
        case 'RATE_LIMITED':
          toast.error('Demasiadas solicitudes. Espera un momento e inténtalo de nuevo.');
          break;
        case 'SERVICE_UNAVAILABLE':
          toast.error('El servicio no está disponible temporalmente.');
          break;
        default:
          toast.error(error.message || 'Ha ocurrido un error inesperado.');
      }
    } else {
      toast.error('Ha ocurrido un error inesperado.');
    }
  }

  // HTTP methods
  async get<T>(endpoint: string, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<APIResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...config, method: 'GET' });
  }

  async post<T>(endpoint: string, body?: any, config?: Omit<RequestConfig, 'method'>): Promise<APIResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...config, method: 'POST', body });
  }

  async put<T>(endpoint: string, body?: any, config?: Omit<RequestConfig, 'method'>): Promise<APIResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...config, method: 'PUT', body });
  }

  async patch<T>(endpoint: string, body?: any, config?: Omit<RequestConfig, 'method'>): Promise<APIResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...config, method: 'PATCH', body });
  }

  async delete<T>(endpoint: string, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<APIResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...config, method: 'DELETE' });
  }
}

// Default API client instance
export const apiClient = new APIClient();

// Utility functions for common patterns
export const withErrorHandling = async <T>(
  apiCall: () => Promise<T>,
  fallbackValue?: T,
  customErrorHandler?: (error: Error) => void
): Promise<T | undefined> => {
  try {
    return await apiCall();
  } catch (error: any) {
    if (customErrorHandler) {
      customErrorHandler(error);
    } else {
      console.error('API Error:', error);
    }
    return fallbackValue;
  }
};

export const isAPIError = (error: any): error is APIError => {
  return error instanceof APIError;
};

export const isValidationError = (error: any): error is ValidationError => {
  return error instanceof ValidationError;
};

export const isNetworkErrorCheck = (error: any): error is NetworkError => {
  return error instanceof NetworkError;
};

export const isTimeoutErrorCheck = (error: any): error is TimeoutError => {
  return error instanceof TimeoutError;
};
