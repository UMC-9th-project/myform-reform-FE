import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-800">
              Reform-FE
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              홈
            </Link>
            <button
              onClick={() => navigate('/test')}
              className="bg-blue-400 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-500 cursor-pointer"
            >
              라우팅테스트
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

