export type RoomType = 'FEED' | 'PROPOSAL' | 'REQUEST';

export interface SelectedChat {
  chatRoomId: string;
  roomType: RoomType;
  image: string;
  title: string;
}


