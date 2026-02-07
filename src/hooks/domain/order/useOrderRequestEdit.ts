import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { uploadImages } from '../../../api/upload';
import {
  getReformRequestDetail,
  updateReformRequest,
} from '../../../api/order/reformRequest';
import type { ReformRequestDetail } from '../../../types/api/order/reformRequest';

function extractCategoryFromDetail(
  detail: ReformRequestDetail | null,
  rawDetail: ReformRequestDetail | null
) {
  const raw = rawDetail as unknown as Record<string, unknown>;
  let major: string | undefined;
  let sub: string | undefined;
  const cat = raw?.category ?? detail?.category;
  if (typeof cat === 'string') {
    major = cat;
  } else if (cat && typeof cat === 'object') {
    const c = cat as Record<string, unknown>;
    major =
      (c.major as string) ??
      (c.Major as string) ??
      (raw?.category_major as string) ??
      (raw?.categoryMajor as string);
    sub =
      (c.sub as string) ??
      (c.Sub as string) ??
      (raw?.category_sub as string) ??
      (raw?.categorySub as string);
  } else {
    major = (raw?.category_major as string) ?? (raw?.categoryMajor as string);
    sub = (raw?.category_sub as string) ?? (raw?.categorySub as string);
  }
  return {
    major: major != null && major !== '' ? major : null,
    sub: sub != null && sub !== '' ? sub : null,
  };
}

function parseApiErrorMessage(err: unknown): string {
  let message = '요청서 수정에 실패했어요.';
  if (err && typeof err === 'object' && 'response' in err) {
    const res = (err as { response?: { data?: unknown } }).response;
    const data = res?.data;
    if (data != null && typeof data === 'object') {
      const d = data as Record<string, unknown>;
      const errObj = d.error as Record<string, unknown> | undefined;
      const msg =
        (typeof errObj?.message === 'string' && errObj.message) ||
        (typeof d.message === 'string' && d.message) ||
        (typeof d.msg === 'string' && d.msg);
      if (msg) message = msg;
    }
  }
  if (message === '요청서 수정에 실패했어요.' && err instanceof Error)
    message = err.message;
  return message;
}

export function useOrderRequestEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null
  );
  const [showCalendar, setShowCalendar] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isFormReady, setIsFormReady] = useState(false);

  const { data: detailResponse, isLoading, isError } = useQuery({
    queryKey: ['reform-request-detail', id],
    queryFn: () => getReformRequestDetail(id!),
    enabled: !!id,
  });

  const detail =
    detailResponse?.resultType === 'SUCCESS' ? detailResponse.success : null;
  const rawDetail = detailResponse?.success ?? null;
  const isOwner = Boolean(
    rawDetail &&
      (rawDetail.isOwner ?? (rawDetail as { is_owner?: boolean }).is_owner)
  );

  useEffect(() => {
    if (!detail || !isOwner) return;
    setTitle(detail.title);
    setDescription(detail.content);
    setMinBudget(String(detail.minBudget));
    setMaxBudget(String(detail.maxBudget));
    try {
      setDeadline(new Date(detail.dueDate));
    } catch {
      setDeadline(undefined);
    }
    const { major, sub } = extractCategoryFromDetail(detail, rawDetail);
    setSelectedCategory(major);
    setSelectedSubcategory(sub);
    const urls = [...(detail.images ?? [])]
      .sort((a, b) => a.photo_order - b.photo_order)
      .map((img) => img.photo);
    setExistingImageUrls(urls);
    setIsFormReady(true);
  }, [detail, isOwner, rawDetail]);

  const totalImageCount = existingImageUrls.length + newImageFiles.length;
  const canAddMoreImages = totalImageCount < 10;

  const handleAddNewImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && canAddMoreImages) {
      const toAdd = Array.from(files).slice(0, 10 - totalImageCount);
      setNewImageFiles((prev) => [...prev, ...toAdd]);
    }
  };

  const handleRemoveExistingImage = (index: number) => {
    setExistingImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveNewImage = (index: number) => {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const isFormValid =
    totalImageCount > 0 &&
    title.trim() !== '' &&
    description.trim() !== '' &&
    minBudget.trim() !== '' &&
    maxBudget.trim() !== '' &&
    deadline !== undefined &&
    selectedCategory !== null;
  const isButtonEnabled = isFormValid && !isSubmitting;

  const handleSubmit = async () => {
    if (!id || !isFormValid || !deadline || selectedCategory === null) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      let newUrls: string[] = [];
      if (newImageFiles.length > 0) {
        const uploadRes = await uploadImages(newImageFiles);
        if (
          uploadRes.resultType !== 'SUCCESS' ||
          !uploadRes.success?.url?.length
        ) {
          throw new Error('이미지 업로드에 실패했어요.');
        }
        newUrls = uploadRes.success.url;
      }

      const minBudgetNum = Number(minBudget.replace(/,/g, ''));
      const maxBudgetNum = Number(maxBudget.replace(/,/g, ''));
      if (Number.isNaN(minBudgetNum) || Number.isNaN(maxBudgetNum)) {
        throw new Error('희망 예산을 올바르게 입력해주세요.');
      }

      const allImageUrls = [...existingImageUrls, ...newUrls];
      const payload = {
        title: title.trim(),
        contents: description.trim(),
        minBudget: minBudgetNum,
        maxBudget: maxBudgetNum,
        dueDate: deadline.toISOString(),
        category: {
          major: selectedCategory,
          sub: selectedSubcategory ?? '',
        },
        images: allImageUrls,
      };

      const res = await updateReformRequest(id, payload);
      if (res.resultType !== 'SUCCESS') {
        throw new Error(res.error?.message ?? '요청서 수정에 실패했어요.');
      }
      navigate(`/order/requests/${id}`);
    } catch (err: unknown) {
      setSubmitError(parseApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}년 ${month}월 ${day}일`;
  };

  return {
    id,
    detail,
    isLoading,
    isError,
    isOwner,
    isFormReady,
    existingImageUrls,
    newImageFiles,
    totalImageCount,
    canAddMoreImages,
    title,
    setTitle,
    description,
    setDescription,
    minBudget,
    setMinBudget,
    maxBudget,
    setMaxBudget,
    deadline,
    setDeadline,
    selectedCategory,
    setSelectedCategory,
    selectedSubcategory,
    setSelectedSubcategory,
    showCalendar,
    setShowCalendar,
    isSubmitting,
    submitError,
    isFormValid,
    isButtonEnabled,
    handleAddNewImages,
    handleRemoveExistingImage,
    handleRemoveNewImage,
    handleSubmit,
    formatDate,
  };
}
