import React, { useEffect, useRef, useState } from 'react';
import moreVertical from '@/assets/icons/morevertical.svg';
import Pencil from '@/assets/icons/pencil.svg';
import Trash from '@/assets/icons/trash.svg';
import { getMyReformRequests, deleteReformRequests } from '@/api/mypage/reformRequestApi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

const MyReformRequest: React.FC = () => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['myReformRequests'],
    queryFn: () => getMyReformRequests(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteReformRequests(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myReformRequests']});
    },
    onError: () => {
      alert('삭제에 실패했습니다. 다시 시도해주세요.');
    }
  })

  const handleDelete = (id: string) => {
    const confirmDelete = window.confirm('정말 이 리폼 요청을 삭제할까요?');
    if (!confirmDelete) return;

    deleteMutation.mutate(id);
  };

    useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpenMenuId(null);
      }
    };
  
    if (openMenuId !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }
  
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuId]);

  if (isLoading) {
    return (
      <div className="text-center py-20 text-gray-400 body-b1-rg">
        로딩중...
      </div>
    );
  }
  const requests = data?.requestData ?? [];


  return (
    <div className="bg-white py-10 relative">

      {/* ───────── 리폼 요청글 리스트 ───────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10">
        {requests.map((item) => (
          <div key={item.reformRequestId} className="flex flex-col group cursor-pointer">
            <div className="relative aspect-square mb-3 overflow-hidden rounded-[1.25rem] bg-white">
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            <div className="space-y-1">
              <h3 className="body-b0-sb text-black line-clamp-2 min-h-[2.5rem]">{item.title}</h3>
              <div
                className="heading-h4-bd text-black"
              >
                {item.minBudget === item.maxBudget
                  ? <span>{item.minBudget.toLocaleString()}원</span>
                  : <span>{item.minBudget.toLocaleString()}~{item.maxBudget.toLocaleString()}원</span>
                }
              </div>
              <div className="flex justify-end relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenMenuId(openMenuId === item.reformRequestId ? null : item.reformRequestId);
                }}
                className="p-1"
              >
                <img src={moreVertical} alt="더보기 버튼" className="w-7 h-7" />
              </button>

              {/* 드롭다운 */}
              {openMenuId === item.reformRequestId && (
                <div
                  ref={menuRef}
                  className="absolute right-0 top-full mt-2 p-1 w-40
                            rounded-[1.385rem]
                            bg-white
                            shadow-[0px_4px_10.7px_0px_#00000038]
                            overflow-hidden z-10 space-y-1"
                >
                        <button
                          className="w-full px-4 py-2 text-left body-b1-rg flex gap-2 items-center"
                          onClick={() => {
                            setOpenMenuId(null);
                            // 여기서 navigate로 이동
                            navigate(`/order/requests/${item.reformRequestId}/edit`);
                          }}
                        ><img src={Pencil} alt="수정" className="w-8" />
                          수정하기</button>

                  <button
                    className="w-full px-4 py-2 text-left body-b1-rg flex gap-2 items-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(null);
                      handleDelete(item.reformRequestId);
                    }}
                  >
                    <img src={Trash} alt="삭제" className="w-8" />
                    <span>삭제하기</span>
                  </button>
                </div>
              )}
            </div>

              <div className="pt-1">
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default MyReformRequest;
