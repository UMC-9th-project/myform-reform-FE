import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/PageLayout';

const Test = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Test Page</h1>
        <p className="text-gray-600 mb-6">내폼리폼 테스트 화면입니다.</p>

        <button
          className="bg-blue-400 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-500"
          onClick={() => navigate('/')}
        >
          홈으로 돌아가기
        </button>
      </div>
    </Layout>
  );
};

export default Test;
  