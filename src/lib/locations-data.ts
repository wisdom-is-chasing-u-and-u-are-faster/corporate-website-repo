export interface OfficeLocation {
  id: string;
  city: string;
  country: string;
  region: 'North America' | 'EMEA' | 'APAC' | 'LATAM';
  address: string;
  phone: string;
  email: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  isHeadquarters?: boolean;
}

export const OFFICE_LOCATIONS: OfficeLocation[] = [
  {
    id: 'nyc-hq',
    city: 'New York',
    country: 'United States',
    region: 'North America',
    address: '350 5th Avenue, Suite 4800, New York, NY 10118',
    phone: '+1 (212) 555-0199',
    email: 'nyc@premiumitservices.com',
    coordinates: { lat: 40.7484, lng: -73.9857 },
    isHeadquarters: true,
  },
  {
    id: 'sf-tech',
    city: 'San Francisco',
    country: 'United States',
    region: 'North America',
    address: '100 Montgomery St, Suite 2200, San Francisco, CA 94104',
    phone: '+1 (415) 555-0144',
    email: 'sf@premiumitservices.com',
    coordinates: { lat: 37.7909, lng: -122.4013 },
  },
  {
    id: 'london-emea',
    city: 'London',
    country: 'United Kingdom',
    region: 'EMEA',
    address: '1 Canada Square, Canary Wharf, London E14 5AA',
    phone: '+44 20 7946 0920',
    email: 'london@premiumitservices.com',
    coordinates: { lat: 51.5050, lng: -0.0201 },
  },
  {
    id: 'frankfurt-emea',
    city: 'Frankfurt',
    country: 'Germany',
    region: 'EMEA',
    address: 'Taunusanlage 8, 60329 Frankfurt am Main',
    phone: '+49 69 9000 1200',
    email: 'frankfurt@premiumitservices.com',
    coordinates: { lat: 50.1109, lng: 8.6720 },
  },
  {
    id: 'singapore-apac',
    city: 'Singapore',
    country: 'Singapore',
    region: 'APAC',
    address: '1 Marina Boulevard, #28-00 One Marina Boulevard, Singapore 018989',
    phone: '+65 6789 0123',
    email: 'singapore@premiumitservices.com',
    coordinates: { lat: 1.2800, lng: 103.8530 },
  },
  {
    id: 'sydney-apac',
    city: 'Sydney',
    country: 'Australia',
    region: 'APAC',
    address: '200 George Street, Sydney NSW 2000',
    phone: '+61 2 9876 5432',
    email: 'sydney@premiumitservices.com',
    coordinates: { lat: -33.8688, lng: 151.2093 },
  },
  {
    id: 'sao-paulo-latam',
    city: 'São Paulo',
    country: 'Brazil',
    region: 'LATAM',
    address: 'Av. Paulista, 1374 - Bela Vista, São Paulo - SP, 01310-100',
    phone: '+55 11 3456 7890',
    email: 'saopaulo@premiumitservices.com',
    coordinates: { lat: -23.5617, lng: -46.6560 },
  }
];
