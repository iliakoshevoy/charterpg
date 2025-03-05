import { JetRegistration } from '@/lib/googleSheets';

let cachedRegistrations: JetRegistration[] | null = null;

export async function fetchAllJetRegistrations(): Promise<JetRegistration[]> {
  if (cachedRegistrations) return cachedRegistrations;
  
  try {
    const response = await fetch('/api/jets');
    if (!response.ok) throw new Error('Failed to fetch jet registrations');
    
    const data = await response.json();
    cachedRegistrations = data;
    return data;
  } catch (error) {
    console.error('Error fetching jet registrations:', error);
    return [];
  }
}

export async function searchJetRegistrations(query: string): Promise<JetRegistration[]> {
  if (!query || query.length < 2) return [];
  
  try {
    const allRegistrations = await fetchAllJetRegistrations();
    return allRegistrations.filter(jet => 
      jet.registration.toLowerCase().includes(query.toLowerCase())
    );
  } catch (error) {
    console.error('Error searching jet registrations:', error);
    return [];
  }
}

export async function getJetByRegistration(registration: string): Promise<JetRegistration | null> {
  if (!registration) return null;
  
  try {
    const response = await fetch(`/api/jets/${encodeURIComponent(registration)}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Failed to fetch jet registration');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching jet by registration:', error);
    return null;
  }
}