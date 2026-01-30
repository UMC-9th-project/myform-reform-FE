import logo from '../../../assets/logos/logo.svg';

interface FooterProps {
  variant: 'dark' | 'light';
}

const Footer = ({ variant = 'dark' }: FooterProps) => {
  const isDark = variant === 'dark';

  return (
    <footer
      className={`${
        isDark
          ? 'bg-[var(--color-gray-50)] text-[var(--color-white)]'
          : 'bg-[var(--color-gray-20)] text-[var(--color-gray-50)]'
      } p-[2.375rem_2.1875rem_1.625rem_2.1875rem] flex flex-col`}
    >
      <div className="w[1370px] flex gap-[5.8125rem]">
        <img src={logo} alt="logo" className="w-[191px] h-[44.621px] " />

        <div className="w-[950px] flex flex-col gap-[2.1875rem]">
          <div className="body-b4-sb flex flex-col items-start gap-[0.625rem]">
            <p className="flex gap-2">
              <span>내폼리폼</span>
              <span>|</span>
              <span>대표이사 홍길동</span>
              <span>|</span>
              <span>사업자등록번호 123-45-67890</span>
              <span>|</span>
              <span>통신판매업신고번호 0000-000-0000</span>
              <span>|</span>
              <span>사업자 정보 확인</span>
              <span>|</span>
              <span>호스팅 사업자: AWS WEB Service</span>
            </p>
            <p>
              <span>이메일 상담 info@myform.kr</span>
              <span className="mx-[0.625rem]">|</span>
              <span className=" cursor-pointer">1:1 문의하기</span>
            </p>
          </div>

          <div className="w-[718px] body-b3-sb flex flex-col gap-[1.25rem] text-[var(--color-gray-40)]">
            <div className="flex flex-col ">
              <p>내폼리폼은 통신판매중개자이며 통신판매 당사자가 아닙니다.</p>
              <p>
                상품, 상품정보, 거래에 관한 의무와 책임은 판매자에게 있으므로,
                각 상품 페이지에서 구체적인 내용을 확인하시기 바랍니다.
              </p>
              <p>
                작업 문의 및 상품에 관한 문의는 판매자에게 직접 문의해주세요.
              </p>
            </div>

            <p>
              내폼리폼 사이트의 상품/이벤트 정보 및 콘텐츠, UI 등에 관한
              무단복제, 전송, 배포, 크롤링 등의 행위는 저작권법, 콘텐츠산업
              진흥법 등 관련 법령에 의하여 엄격히 금지됩니다.
            </p>
          </div>
        </div>
      </div>
      <div className="w-[514px] h-[63px] flex gap-[3.5rem] mt-[2.5rem]">
        <div className="flex flex-col gap-[0.375rem]">
          <p className="body-b0-sb">내폼리폼 고객센터</p>
          <p className="body-b1-sb text-[var(--color-gray-40)]">
            (평일 오전 10시 ~ 오후 6시)
          </p>
        </div>
        <div className="flex flex-col gap-[0.375rem]">
          <p className="body-b0-sb">서비스</p>
          <ul className="body-b1-sb flex gap-[0.875rem] list-none text-[var(--color-gray-40)]">
            <li>리폼마켓</li>
            <li>리폼 요청</li>
            <li>리폼 제안</li>
          </ul>
        </div>
      </div>
      <button className="body-b0-sb w-39 h-[54px] mt-[1.5rem] rounded-[0.625rem] cursor-pointer hover:scale-95 text-[var(--color-black)] bg-[var(--color-white)]">
        문의하기
      </button>
      <div className="mt-[1.6875rem]">
        <div className="flex justify-between items-center">
          <div className="body-b3-sb flex gap-[3.5rem]">
            <span>서비스 이용약관</span>
            <span>리폼러 서비스 이용약관</span>
            <span>개인정보처리방침</span>
          </div>

          <div className="body-b1-sb">
            <span>© myformreform Co., Ltd.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
