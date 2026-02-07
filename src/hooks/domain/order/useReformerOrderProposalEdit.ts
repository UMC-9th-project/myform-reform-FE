import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { updateReformProposal, getReformProposalDetail } from '../../../api/order/reformProposal';
import { uploadImages } from '../../../api/upload';
import type { ReformProposalDetail } from '../../../types/api/order/reformProposal';
import type { ProposalEditImageItem } from '../../../types/domain/order/proposalEdit';
import { getInitialProposalEditImages } from '../../../types/domain/order/proposalEdit';

interface UseReformerOrderProposalEditParams {
  id: string | undefined;
}

export const useReformerOrderProposalEdit = ({ id }: UseReformerOrderProposalEditParams) => {
  const { data: proposalResponse, isLoading, isError } = useQuery({
    queryKey: ['reform-proposal-detail', id],
    queryFn: async () => {
      if (!id) throw new Error('제안 ID가 없습니다.');
      const data = await getReformProposalDetail(id);
      if (data.resultType !== 'SUCCESS' || !data.success) {
        throw new Error(data.error?.message || '제안서를 불러오지 못했어요.');
      }
      return data;
    },
    enabled: !!id,
    staleTime: 1000 * 60,
  });

  const proposalDetail = proposalResponse?.success ?? null;

  return {
    id,
    proposalDetail,
    isLoading,
    isError,
  };
};

interface UseProposalEditFormParams {
  id: string;
  initialData: ReformProposalDetail;
  onSuccess: () => void;
}

export const useProposalEditForm = ({
  id,
  initialData,
  onSuccess,
}: UseProposalEditFormParams) => {
  const queryClient = useQueryClient();
  const [images, setImages] = useState<ProposalEditImageItem[]>(() =>
    getInitialProposalEditImages(initialData)
  );
  const [quotationAmount, setQuotationAmount] = useState(() =>
    String(initialData.price)
  );
  const [deliveryFee, setDeliveryFee] = useState(() =>
    String(initialData.delivery)
  );
  const [description, setDescription] = useState(() => initialData.content ?? '');
  const [workPeriod, setWorkPeriod] = useState(() =>
    String(initialData.expectedWorking)
  );
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { mutate: submitUpdate, isPending: isSubmitting } = useMutation({
    mutationFn: async () => {
      const urlImages = images.filter(
        (i): i is { type: 'url'; url: string } => i.type === 'url'
      );
      const fileImages = images.filter(
        (i): i is { type: 'file'; file: File } => i.type === 'file'
      );

      let allUrls = urlImages.map((i) => i.url);

      if (fileImages.length > 0) {
        const files = fileImages.map((i) => i.file);
        const uploadRes = await uploadImages(files);
        if (uploadRes.resultType !== 'SUCCESS' || !uploadRes.success?.url) {
          throw new Error('이미지 업로드에 실패했어요.');
        }
        allUrls = [...allUrls, ...uploadRes.success.url];
      }

      const payload = {
        images: allUrls,
        title: initialData.title,
        contents: description.trim(),
        price: Number(quotationAmount) || 0,
        delivery: Number(deliveryFee) || 0,
        expectedWorking: Number(workPeriod) || 0,
      };

      await updateReformProposal(id, payload);
    },
    onSuccess: () => {
      setSubmitError(null);
      queryClient.invalidateQueries({ queryKey: ['reform-proposal-detail', id] });
      onSuccess();
    },
    onError: (err: Error) => {
      setSubmitError(err.message || '수정에 실패했어요.');
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newItems: ProposalEditImageItem[] = Array.from(files)
        .slice(0, 10 - images.length)
        .map((file) => ({ type: 'file' as const, file }));
      setImages([...images, ...newItems]);
    }
    e.target.value = '';
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const isButtonEnabled =
    images.length > 0 &&
    quotationAmount.trim() !== '' &&
    deliveryFee.trim() !== '' &&
    description.trim() !== '' &&
    workPeriod.trim() !== '';

  const handleSubmit = () => {
    setSubmitError(null);
    submitUpdate();
  };

  return {
    images,
    quotationAmount,
    setQuotationAmount,
    deliveryFee,
    setDeliveryFee,
    description,
    setDescription,
    workPeriod,
    setWorkPeriod,
    submitError,
    isSubmitting,
    isButtonEnabled,
    handleImageUpload,
    handleRemoveImage,
    handleSubmit,
  };
};
