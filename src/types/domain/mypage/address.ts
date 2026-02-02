export interface AddressItem {
  addressId: string;
  postalCode: string;
  address: string;
  addressDetail: string;
  isDefault: boolean;
  phone: string;
  recipient: string;
  addressName: string;
  createdAt: string;
}

export interface GetAddressesResponse {
  resultType: string;
  error: {
    data: string;
    reason: string;
    errorCode: string;
  } | null;
  success: AddressItem[] | null;
}
