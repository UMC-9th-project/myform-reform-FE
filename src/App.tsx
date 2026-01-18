import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/PageLayout';
import Home from './pages/Home';
import Cart from './pages/cart/cart';
import Wishlist from './pages/wishlist/wishlist';
import ReformerWishlist from './pages/wishlist-Reformer/wishlist';
import ReformerMyPage from './pages/MyPage-Reform/ReformerMyPage';
import CreatePage from './pages/MyPage-Reform/CreatePage';
import EditProfilePage from './pages/MyPage-Reform/EditProfilePage';
import Profile from './pages/Profile';
import NormalMyPage from './pages/MyPage/NormalMyPage';

function App() {
  return (
    <Layout
      showHeader={true}
      showNavbar={true}
      showFooter={true}
      footerVariant="light"
    >
      <Routes>
        {/* 기본 홈 */}
        <Route path="/" element={<Home />} />

        {/* 카트 페이지 */}
        <Route path="/cart" element={<Cart />} />

        <Route path="/profile" element={<Profile />} />

        {/* 위시리스트 페이지 */}
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/reformer/wishlist" element={<ReformerWishlist />} />

        {/* 404 처리 */}
        <Route path="*" element={<div>Not Found</div>} />

        <Route path="reformer-mypage" element={<ReformerMyPage />} />
        <Route path="/sales/create" element={<CreatePage type="sale" />} />
        <Route path="/custom/create" element={<CreatePage type="order" />} />
        <Route path="/reformer-profile-edit" element={<EditProfilePage />} />
        <Route path="/normal-mypage" element={<NormalMyPage />} />
        <Route path="/normal-profile-edit" element={<EditProfilePage />} />
      </Routes>
    </Layout>
  );
}

export default App;
//app.tsx에선 라우팅만 담당
//페이지를 많이 만드는거 xx , 라우팅을 다르게 + 내부 컴포넌트는 재사용 할 수 있도록 설계
