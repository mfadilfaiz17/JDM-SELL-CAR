/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Contact Configuration
 * Update these values with your actual contact information
 */

export const CONTACT_CONFIG = {
  // WhatsApp number (format: country code + number without + or spaces)
  // Example: Indonesia +62 812-3456-7890 becomes 6281234567890
  whatsappNumber: '6281234567890',
  
  // Email
  email: 'official@zorajdm.com',
  
  // Phone (display format)
  phone: '+62 812-3456-7890',
  
  // Location
  location: 'Jakarta Center',
  
  // Operating Hours
  operatingHours: {
    weekday: '09:00 - 18:00',
    saturday: '10:00 - 16:00',
    sunday: 'CLOSED'
  }
};

/**
 * Generate WhatsApp URL with pre-filled message
 * @param carName - Name of the car
 * @param carModel - Model details
 * @param price - Price in thousands
 * @returns WhatsApp URL
 */
export const generateWhatsAppUrl = (carName: string, carModel: string, price: number): string => {
  const message = `Hi, I'm interested in ${carName} (${carModel}) - $${price}k. Is it still available?`;
  return `https://wa.me/${CONTACT_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
};

/**
 * Generate general inquiry WhatsApp URL
 * @returns WhatsApp URL
 */
export const generateGeneralInquiryUrl = (): string => {
  const message = `Hi, I'd like to inquire about your JDM cars. Can you provide more information?`;
  return `https://wa.me/${CONTACT_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
};
