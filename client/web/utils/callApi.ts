import axios, { AxiosResponse } from 'axios';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface ApiResponse<T = any> {
  data: T | null;
  status: number;
  message?: string;
}

const callApi = async <T = any>(
  method: HttpMethod, 
  endpoint: string, 
  body?: any
): Promise<ApiResponse<T>> => {
  const prefix = "http://localhost:8080";
  
  try {
    const token = localStorage.getItem('auth');
    
    const config = {
      method: method.toLowerCase(),
      url: `${prefix}${endpoint}`,
      data: body,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
    };

    const response: AxiosResponse<T> = await axios(config);
    
    return {
      data: response.data,
      status: response.status,
      message: 'Success'
    };
  } catch (error: any) {
    if (error.response) {
      return {
        data: error.response.data,
        status: error.response.status,
        message: error.response.data?.message || 'Server error'
      };
    } else if (error.request) {
      return {
        data: null,
        status: 0,
        message: 'Network error - no response from server'
      };
    } else {
      return {
        data: null,
        status: 0,
        message: error.message || 'Unknown error occurred'
      };
    }
  }
};

export default callApi;