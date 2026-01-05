import pencil from '../../../assets/icons/pencil.svg';
import trash from '../../../assets/icons/trash.svg';

export default function ProductMoreMenu() {
  return (
    <div className="w-[170px] h-[120px] flex flex-col shadow-[0_4px_10.7px_0_rgba(0,0,0,0.22)] rounded-[1.25rem] body-b1-rg">
      <div className="flex gap-[0.625rem] items-center pt-[0.625rem] pl-[1.25rem] cursor-pointer ">
        <img src={pencil} alt="pencil" />
        <p>수정하기</p>
      </div>
      <div className="flex gap-[0.625rem] items-center pt-[0.625rem] pl-[1.25rem] cursor-pointer">
        <img src={trash} alt="trash" />
        <p>삭제하기</p>
      </div>
    </div>
  );
}
