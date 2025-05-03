// API utility functions for communicating with the backend

// API Base URL - Change this based on your deployment environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export type LieDetectionResult = {
  prediction: 'Truth' | 'Fake';
  confidence: number;
  is_dummy_model?: boolean;  // Flag to indicate if this is a dummy model result
  features: {
    facialExpressions: number;
    voiceAnalysis: number;
    microGestures: number;
  }
}

/**
 * Upload a video file and get lie detection results
 */
export async function uploadVideo(file: File): Promise<LieDetectionResult> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to upload video');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error uploading video:', error);
    throw error;
  }
}

/**
 * Get model status information
 */
export async function getModelStatus(): Promise<{
  model_loaded: boolean;
  last_trained: string;
  accuracy: number;
  version: string;
}> {
  try {
    console.log('Fetching model status from:', `${API_BASE_URL}/model/status`);
    const response = await fetch(`${API_BASE_URL}/model/status`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      cache: 'no-cache', // Don't cache this request
    });
    
    if (!response.ok) {
      throw new Error('Failed to get model status');
    }
    
    const data = await response.json();
    console.log('Model status received:', data);
    
    return data;
  } catch (error) {
    console.error('Error getting model status:', error);
    throw error;
  }
}

/**
 * Check if the API is available
 */
export async function checkApiAvailability(): Promise<boolean> {
  try {
    console.log('Checking API availability at:', API_BASE_URL);
    
    try {
      // Simple fetch with a short timeout to check if API is available
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
      
      const response = await fetch(`${API_BASE_URL}/`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        cache: 'no-cache',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      const result = response.ok;
      console.log('API availability check result:', result);
      return result;
    } catch (fetchError) {
      console.log('Fetch error during API check:', fetchError);
      // Return false on any fetch error - network issues, timeout, etc.
      return false;
    }
  } catch (error) {
    console.error('API availability check failed with unexpected error:', error);
    return false;
  }
}
