import { capitalize, startCase } from 'lodash';

export const isCustomDomain = (domain: string) => {
  // Check if email domain is a custom domain
  const commonEmailProviders = [
    'gmail.com', 
    'yahoo.com', 
    'hotmail.com', 
    'outlook.com'
  ];
  return !commonEmailProviders.includes(domain);
};

export const getOrganizationNameForDomain = (domain: string) => {
  // Get organization name from email domain
  const domainParts = domain.split('.');
  const domainName = domainParts[0];
  // Capitalize name
  const capitalizedDomainName = capitalize(startCase(domainName));
  return capitalizedDomainName;
};
