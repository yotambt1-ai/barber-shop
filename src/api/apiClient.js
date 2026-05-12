const API_BASE_URL = 'http://barber-shop-907161570.eu-north-1.elb.amazonaws.com';

export const apiClient = {
  appointments: {
    create: async (data) => {
      const response = await fetch(`${API_BASE_URL}/appointments/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to create appointment');
      }
      
      return response.json();
    },
    getBookedTimes: async (date, barber) => {
      const response = await fetch(`${API_BASE_URL}/appointments/booked?date=${encodeURIComponent(date)}&barber=${encodeURIComponent(barber)}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to fetch booked times');
      }
      return response.json();
    },
    list: async (skip = 0, limit = 100) => {
      const response = await fetch(`${API_BASE_URL}/appointments/?skip=${skip}&limit=${limit}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to fetch appointments');
      }
      return response.json();
    },
    adminList: async () => {
      const response = await fetch(`${API_BASE_URL}/admin/appointments/`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to fetch admin appointments');
      }
      return response.json();
    },
    update: async (id, data) => {
      const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to update appointment');
      }
      return response.json();
    },
    delete: async (id) => {
      const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to delete appointment');
      }
      return response.json();
    }
  }
};