import Layout from '../components/layout/PageLayout';

const Home = () => {
  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Reform-FE</h1>
        <p className="text-gray-600 mb-6">내폼리폼 임시화면입니다.</p>

        <section className="mt-4">
          <h2 className="text-2xl font-semibold mt-4">현재 상태</h2>
          <ul className="space-y-2">
            <li className="text-gray-400 mb-8">
              초기 세팅은 어느정도 완료되었습니다.
            </li>
            <li>✅ Vite + React + TypeScript 세팅 완료</li>
            <li>✅ React Router DOM 적용</li>
            <li>✅ React Query (@tanstack/react-query) 전역 세팅</li>
            <li>✅ Tailwind CSS 적용</li>
            <li>✅ Axios 적용</li>
            <li>✅ Zustand 적용</li>
            <li>✅ 라우팅 세팅</li>
            <li>✅ 레이아웃 컴포넌트 세팅</li>
            <li>✅ 폴더,파일구조는 우선 지우지 말아주세요 !!!!</li>
          </ul>
          <div className="mt-10">
            <div className="space-y-1">
              <p>components 내부</p>
              <ul className="list-disc list-inside ml-4">
                <li>common: 재사용 UI</li>
                <li>layout: 페이지 골격</li>
                <li>domain: 기능/페이지 전용 UI</li>
              </ul>

              <p>pages: 라우트 단위</p>
              <p>hooks / stores / utils / types: 역할별 분리</p>
            </div>
          </div>

          <div className="text-red-600 mt-8">
            <p>폴더명은 소문자, 파일명은 파스칼케이스로 작성(대문자) </p>
            <p>
              특히 컴포넌트 폴더의 내부 폴더 또는 파일이 대소문자가 다 각기
              다릅니다. 의도된 것이니 맞게 작성해주세용~!{' '}
            </p>
            <p>
              pages에서 구현x 무조건 컴포넌트에서!! 이 코드는 편리를 위해 여기다
              짠거에요!! 혼동 없으시길 바랍니다ㅎㅎ!
            </p>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Home;
