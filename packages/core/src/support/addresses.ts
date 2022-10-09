import { ethers } from 'ethers';

export const getAddress = (address?: string): string | undefined => {
  return address !== undefined &&
    address !== '' &&
    address.length === ethers.constants.AddressZero.length
    ? ethers.utils.getAddress(address)
    : undefined;
};

export const getAddressStrict = (address: string): string => {
  return ethers.utils.getAddress(address);
};

export const cmpAddresses = (address1?: string, address2?: string): boolean => {
  return getAddress(address1) === getAddress(address2);
};
