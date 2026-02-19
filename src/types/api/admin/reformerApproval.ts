export type ReformerStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type ReformerFilterStatus = ReformerStatus | 'ALL';

export interface ReformerApplicationData {
  owner_id: string;
  name: string;
  nickname: string;
  email: string;
  phone: string;
  introduction: string;
  photos: string[];
  business_number: string;
  status: ReformerStatus;
}

export interface GetReformerApprovalListParams {
  status: ReformerFilterStatus;
  page?: number;
  limit?: number;
  order?: 'desc' | 'asc';
}

export interface GetReformerApprovalListSuccess {
  data: ReformerApplicationData[];
  totalCount: number;
}

export interface GetReformerApprovalListResponse {
  resultType: 'SUCCESS' | 'ERROR';
  error: {
    data: string;
    reason: string;
    errorCode: string;
  } | null;
  success: GetReformerApprovalListSuccess | null;
}

export interface UpdateReformerStatusParams {
  reformerId: string;
  status: ReformerStatus;
}

export interface UpdateReformerStatusSuccess {
  id: string;
  email: string;
  nickname: string;
  role: string;
  auth_status: ReformerStatus;
}

export interface UpdateReformerStatusResponse {
  resultType: 'SUCCESS' | 'ERROR';
  error: {
    data: string;
    reason: string;
    errorCode: string;
  } | null;
  success: UpdateReformerStatusSuccess | null;
}
