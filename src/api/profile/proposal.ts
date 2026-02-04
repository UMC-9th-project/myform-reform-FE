import { api } from '../axios';
import type { GetProfileProposalsParams, GetProfileProposalsResponse } from '../../types/domain/profile/proposal';

export const getProfileProposal = async ({
    ownerId,
    cursor,
    limit = 20,
}: GetProfileProposalsParams): Promise<GetProfileProposalsResponse> => {
    const response = await api.get(`/profile/${ownerId}/proposal`, {
        params: {
            cursor,
            limit,
        },
    });
    return response.data;
}