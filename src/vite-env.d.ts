/// <reference types="vite/client" />

declare module '*.svg?react' {
  import React from 'react';
  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}

declare module 'swiper/css';
declare module 'swiper/css/navigation';

declare module 'react-daum-postcode' {
  import { ComponentType } from 'react';

  export interface AddressData {
    zonecode: string;
    roadAddress: string;
    jibunAddress?: string;
    address: string;
    [key: string]: string | undefined;
  }

  export interface DaumPostcodeProps {
    onComplete?: (data: AddressData) => void;
    onSearch?: (data: AddressData) => void;
    autoClose?: boolean;
    defaultQuery?: string;
    style?: React.CSSProperties;
    className?: string;
    [key: string]: unknown;
  }

  const DaumPostcode: ComponentType<DaumPostcodeProps>;
  export default DaumPostcode;
}

