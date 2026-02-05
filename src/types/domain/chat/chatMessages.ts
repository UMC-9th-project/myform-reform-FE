export type RoomType = 'FEED' | 'PROPOSAL' | 'REQUEST';

export interface SelectedChat {
  chatRoomId: string;
  roomType: RoomType;
}


