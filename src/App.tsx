import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Test from './pages/Test';
import Cart from './pages/cart/cart';

function App() {
  return (
    <Routes>
      {/* 기본 홈 */}
      <Route path="/" element={<Home />} />

      {/* 임시 테스트용 */}
      <Route path="/test" element={<Test />} />

      {/* 카트 페이지 */}
      <Route path="/cart" element={<Cart />} />

      {/* 404 처리 */}
      <Route path="*" element={<div>Not Found</div>} />
    </Routes>
  );
}

export default App;
//app.tsx에선 라우팅만 담당
//페이지를 많이 만드는거 xx , 라우팅을 다르게 + 내부 컴포넌트는 재사용 할 수 있도록 설계
