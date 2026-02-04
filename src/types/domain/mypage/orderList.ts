export interface orderListItem {
  orderId: string;
  targetId: string;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED';
  price: number;
  deliveryFee: number;
  userName: string;
  createdAt: string;
  title: string;
  thumbnail: string;
  type: 'ITEM' | 'REFORM'; // ITEM = 판매, REFORM = 주문제작
}