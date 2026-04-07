import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { createClient } from '@supabase/supabase-js';
import { env } from '../../config/env';

// Supabase client
const supabase = createClient(env.supabaseUrl, env.supabaseAnonKey);

interface LeadData {
  name: string;
  phone: string;
  email: string;
  propertyType: string;
  sourcePage: string;
}

const AkshayTritiyaOffer: React.FC = () => {
  const [location] = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState<LeadData>({
    name: '',
    phone: '',
    email: '',
    propertyType: '',
    sourcePage: '/design-studio'
  });
  const [errors, setErrors] = useState<Partial<LeadData>>({});

  // Send data to Google Sheets via webhook
  const sendToGoogleSheet = async (data: LeadData) => {
    try {
      // Direct Google Apps Script webhook
      const webhookUrl = 'https://script.google.com/macros/s/AKfycby0VUKW6idgXDHoSjV0nWYOiKfzGuOgp5a1J6Yi8K3k16Q7eaanrCXb7a31ZDkVfQ9S/exec';

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          email: data.email,
          propertyType: data.propertyType,
          source: data.sourcePage
        }),
        mode: 'no-cors' // This prevents CORS errors but won't give us response details
      });

      console.log('Google Sheets request sent (no-cors mode)');

    } catch (error) {
      console.error('Error sending to Google Sheets:', error);
      // Don't throw error - allow form submission to succeed even if Google Sheets fails
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Partial<LeadData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit Indian phone number';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.propertyType) {
      newErrors.propertyType = 'Property type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Insert into Supabase
      const { data: insertData, error } = await supabase
        .from('akshay_tritiya_leads')
        .insert({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          property_type: formData.propertyType,
          source_page: formData.sourcePage,
          created_at: new Date().toISOString()
        })
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      console.log('Lead saved successfully:', insertData);

      // Send to Google Sheets (non-blocking)
      sendToGoogleSheet(formData);

      // Show success message
      setShowSuccess(true);

      // Reset form
      setFormData({
        name: '',
        phone: '',
        email: '',
        propertyType: '',
        sourcePage: '/design-studio'
      });

      // Close modal after 3 seconds
      setTimeout(() => {
        setIsModalOpen(false);
        setShowSuccess(false);
      }, 3000);

    } catch (error) {
      console.error('Error submitting form:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Error submitting form: ${errorMessage}. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error for this field
    if (errors[name as keyof LeadData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Only render on design-studio page
  if (location !== '/design-studio') {
    return null;
  }

  return (
    <>
      {/* Offer Ticker */}
      <div className="akshay-tritiya-ticker">
        <div className="akshay-ticker-content" onClick={() => setIsModalOpen(true)}>
          <span className="akshay-ticker-text">
            ✨ Akshay Tritiya Special • Book your interior project for ₹999 •
            🎁 Complimentary Gifts: AC | TV | Fridge | Washing Machine •
            🏡 Luxury Interiors Designed for Your Dream Home Starting at just 2.99L*•
            ⏳ Offer Valid Till 20 April • Click to Claim Offer
          </span>
        </div>
      </div>

      {/* Popup Modal */}
      {isModalOpen && (
        <div className="akshay-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="akshay-modal-card" onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button 
              className="akshay-close-button" 
              onClick={() => setIsModalOpen(false)}
              aria-label="Close modal"
            >
              ×
            </button>

            {/* Modal Content */}
            <div className="akshay-modal-content">
              {showSuccess ? (
                <div className="akshay-success-message">
                  <div className="akshay-success-icon">🎉</div>
                  <h2>Offer Claimed Successfully!</h2>
                  <p>Our team will contact you shortly with your exclusive Akshay Tritiya offer details.</p>
                </div>
              ) : (
                <>
                  <div className="akshay-modal-header">
                    <h2>Akshay Tritiya Interior Offer</h2>
                    <p>Book your interior project for ₹999 and receive exclusive festive gifts.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="akshay-offer-form">
                    <div className="akshay-form-group">
                      <label htmlFor="name">Name *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={errors.name ? 'error' : ''}
                        placeholder="Enter your full name"
                      />
                      {errors.name && <span className="akshay-error-message">{errors.name}</span>}
                    </div>

                    <div className="akshay-form-group">
                      <label htmlFor="phone">Phone Number *</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={errors.phone ? 'error' : ''}
                        placeholder="Enter 10-digit phone number"
                        maxLength={10}
                      />
                      {errors.phone && <span className="akshay-error-message">{errors.phone}</span>}
                    </div>

                    <div className="akshay-form-group">
                      <label htmlFor="email">Email *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={errors.email ? 'error' : ''}
                        placeholder="Enter your email address"
                      />
                      {errors.email && <span className="akshay-error-message">{errors.email}</span>}
                    </div>

                    <div className="akshay-form-group">
                      <label htmlFor="propertyType">Property Type *</label>
                      <select
                        id="propertyType"
                        name="propertyType"
                        value={formData.propertyType}
                        onChange={handleInputChange}
                        className={errors.propertyType ? 'error' : ''}
                      >
                        <option value="">Select property type</option>
                        <option value="1 BHK">1 BHK</option>
                        <option value="2 BHK">2 BHK</option>
                        <option value="3 BHK">3 BHK</option>
                        <option value="4 BHK">4 BHK</option>
                        <option value="Villa">Villa</option>
                      </select>
                      {errors.propertyType && <span className="akshay-error-message">{errors.propertyType}</span>}
                    </div>

                    <button
                      type="submit"
                      className="akshay-submit-button"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : 'Claim Offer'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        /* Ticker Styles */
        .akshay-tritiya-ticker {
          position: fixed;
          top: 65px;
          left: 0;
          right: 0;
          background: linear-gradient(135deg, #0F1B2B 0%, #1a2332 100%);
          color: #D4AF37;
          padding: 12px 0;
          z-index: 30;
          overflow: hidden;
          box-shadow: 0 2px 20px rgba(212, 175, 55, 0.3);
          border-bottom: 2px solid #D4AF37;
        }

        .akshay-ticker-content {
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-block;
          padding: 0 20px;
        }

        .akshay-ticker-content:hover {
          transform: scale(1.02);
          filter: brightness(1.2);
        }

        .akshay-ticker-text {
          display: inline-block;
          font-size: 16px;
          font-weight: 600;
          white-space: nowrap;
          animation: akshay-scroll-left 25s linear infinite;
          letter-spacing: 1px;
        }

        @keyframes akshay-scroll-left {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        .akshay-tritiya-ticker:hover .akshay-ticker-text {
          animation-play-state: paused;
        }

        /* Modal Styles */
        .akshay-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 27, 43, 0.85);
          backdrop-filter: blur(10px);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: akshay-fadeIn 0.3s ease;
        }

        @keyframes akshay-fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .akshay-modal-card {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(15, 27, 43, 0.3), 0 0 0 1px rgba(212, 175, 55, 0.2);
          max-width: 500px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          animation: akshay-slideUp 0.3s ease;
        }

        @keyframes akshay-slideUp {
          from {
            transform: translateY(50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .akshay-close-button {
          position: absolute;
          top: 15px;
          right: 15px;
          width: 40px;
          height: 40px;
          border: none;
          background: rgba(15, 27, 43, 0.1);
          border-radius: 50%;
          font-size: 24px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          color: #0F1B2B;
        }

        .akshay-close-button:hover {
          background: rgba(15, 27, 43, 0.2);
          transform: rotate(90deg);
        }

        .akshay-modal-content {
          padding: 40px 30px 30px;
        }

        .akshay-modal-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .akshay-modal-header h2 {
          color: #0F1B2B;
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 10px;
          background: linear-gradient(135deg, #0F1B2B, #D4AF37);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .akshay-modal-header p {
          color: #64748b;
          font-size: 16px;
          line-height: 1.5;
        }

        .akshay-form-group {
          margin-bottom: 20px;
        }

        .akshay-form-group label {
          display: block;
          margin-bottom: 8px;
          color: #0F1B2B;
          font-weight: 600;
          font-size: 14px;
        }

        .akshay-form-group input,
        .akshay-form-group select {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 16px;
          transition: all 0.3s ease;
          background: white;
          color: #0F1B2B;
        }

        .akshay-form-group input:focus,
        .akshay-form-group select:focus {
          outline: none;
          border-color: #D4AF37;
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
        }

        .akshay-form-group input.error,
        .akshay-form-group select.error {
          border-color: #ef4444;
        }

        .akshay-error-message {
          display: block;
          color: #ef4444;
          font-size: 12px;
          margin-top: 5px;
        }

        .akshay-submit-button {
          width: 100%;
          padding: 14px 24px;
          background: linear-gradient(135deg, #D4AF37 0%, #f4d03f 100%);
          color: #0F1B2B;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 1px;
          box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
        }

        .akshay-submit-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4);
        }

        .akshay-submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .akshay-success-message {
          text-align: center;
          padding: 20px;
        }

        .akshay-success-icon {
          font-size: 60px;
          margin-bottom: 20px;
          animation: akshay-bounce 0.6s ease;
        }

        @keyframes akshay-bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-20px);
          }
          60% {
            transform: translateY(-10px);
          }
        }

        .akshay-success-message h2 {
          color: #0F1B2B;
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .akshay-success-message p {
          color: #64748b;
          font-size: 16px;
          line-height: 1.5;
        }

        /* Responsive Design */
        @media (max-width: 640px) {
          .akshay-tritiya-ticker {
            padding: 10px 0;
          }

          .akshay-ticker-text {
            font-size: 14px;
          }

          .akshay-modal-card {
            margin: 10px;
            max-height: 95vh;
          }

          .akshay-modal-content {
            padding: 30px 20px 20px;
          }

          .akshay-modal-header h2 {
            font-size: 24px;
          }

          .akshay-form-group input,
          .akshay-form-group select {
            padding: 10px 14px;
            font-size: 16px; /* Prevents zoom on iOS */
          }
        }

        @media (max-width: 480px) {
          .akshay-ticker-text {
            font-size: 12px;
          }

          .akshay-modal-header h2 {
            font-size: 20px;
          }

          .akshay-modal-header p {
            font-size: 14px;
          }
        }
      `}</style>
    </>
  );
};

export default AkshayTritiyaOffer;
