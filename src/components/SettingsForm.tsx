// src/components/SettingsForm.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { CompanySettings } from '@/types/settings';
import ImageUploadArea from '@/components/ImageUploadArea';
import { compressImage } from '@/utils/imageCompression';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

const SettingsForm = () => {
  const { user } = useAuth();
  const defaultDisclaimer = "All options are subject to final availability at the time of booking, flight permits, slots, and owner's approval where applicable. Possible de-Icing, WI-FI and other costs are not included and will be Invoiced, if occurred, after the flight";

  // State declarations
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<CompanySettings>({
    companyName: '',
    address: '',
    vatNumber: '',
    website: '',
    email: '',
    phoneNumber: '',
    disclaimer: defaultDisclaimer,
    logo: null
  });
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  // Fetch settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        console.log('Fetching settings for user:', user.id);
        
        const { data, error } = await supabase
          .from('company_settings')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching settings:', error);
          setError('Failed to load settings');
          return;
        }

        if (data) {
          console.log('Settings loaded:', data);
          setSettings({
            companyName: data.company_name || '',
            address: data.address || '',
            vatNumber: data.vat_number || '',
            website: data.website || '',
            email: data.email || '',
            phoneNumber: data.phone_number || '',
            disclaimer: data.disclaimer || defaultDisclaimer,
            logo: data.logo
          });
          setLogoPreview(data.logo);
        }
      } catch (error) {
        console.error('Error in fetchSettings:', error);
        setError('An unexpected error occurred while loading settings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [user, defaultDisclaimer]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    setSaveStatus('idle');
    setError(null);

    try {
      const settingsData = {
        user_id: user.id,
        company_name: settings.companyName,
        address: settings.address,
        vat_number: settings.vatNumber,
        website: settings.website,
        email: settings.email,
        phone_number: settings.phoneNumber,
        disclaimer: settings.disclaimer,
        logo: settings.logo
      };

      const { error: saveError } = await supabase
        .from('company_settings')
        .upsert(settingsData, { onConflict: 'user_id' });

      if (saveError) {
        throw saveError;
      }

      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveStatus('error');
      setError('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  // Show login required message if no user
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <p className="text-red-600">Please log in to access settings.</p>
        </div>
      </div>
    );
  }

  // Main form render
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center">
        <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Proposal Form
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Company Settings</h2>
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={settings.companyName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Logo
                </label>
                <ImageUploadArea
                  uniqueId="company-logo"
                  imageType="logo"
                  defaultImageUrl={null}
                  isDefault={false}
                  onImageUpload={async (file) => {
                    try {
                      const compressedFile = await compressImage(file);
                      const reader = new FileReader();
                      
                      reader.onloadend = () => {
                        const base64String = reader.result as string;
                        setSettings(prev => ({
                          ...prev,
                          logo: base64String
                        }));
                        setLogoPreview(base64String);
                      };

                      reader.onerror = () => {
                        setError('Failed to read logo file');
                      };

                      reader.readAsDataURL(compressedFile);
                    } catch (error) {
                      console.error('Error processing logo:', error);
                      setError('Failed to process logo');
                    }
                  }}
                  onImageRemove={() => {
                    setSettings(prev => ({
                      ...prev,
                      logo: null
                    }));
                    setLogoPreview(null);
                  }}
                  previewUrl={logoPreview}
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={settings.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                />
              </div>

              <div>
                <label htmlFor="vatNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  VAT Number
                </label>
                <input
                  type="text"
                  id="vatNumber"
                  name="vatNumber"
                  value={settings.vatNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                />
              </div>

              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input
                  type="text"
                  id="website"
                  name="website"
                  value={settings.website}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Main Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={settings.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                />
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={settings.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="disclaimer" className="block text-sm font-medium text-gray-700 mb-1">
                This disclaimer will be added automatically to the generated charter offer at the page bottom
              </label>
              <textarea
                id="disclaimer"
                name="disclaimer"
                value={settings.disclaimer}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              />
            </div>

            <div className="flex items-center justify-end space-x-4">
              {saveStatus === 'success' && (
                <span className="text-green-600 text-sm">Settings saved successfully!</span>
              )}
              {saveStatus === 'error' && (
                <span className="text-red-600 text-sm">Error saving settings</span>
              )}
              <button
                type="submit"
                disabled={isSaving}
                className={`px-4 py-2 rounded-md ${
                  isSaving
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                }`}
              >
                {isSaving ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  'Save Settings'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsForm;