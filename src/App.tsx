import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/PageLayout';
import Home from './pages/Home';
import Cart from './pages/cart/Cart';
import Wishlist from './pages/wishlist/wishlist';
import ReformerWishlist from './pages/wishlist-reformer/wishlist';
import ReformerMyPage from './pages/my-page-Reform/ReformerMyPage';
import CreatePage from './pages/my-page-Reform/CreatePage';
import EditProfilePage from './pages/my-page-Reform/EditProfilePage';
import Profile from './pages/Profile';
import NormalMyPage from './pages/my-page/NormalMyPage';
import ReformerSearch from './pages/reformer-search/ReformerSearch';
import ReformerSearchResults from './pages/reformer-search/ReformerSearchResults';
import ReformerListView from './pages/reformer-search/ReformerListView';
import FeedListView from './pages/reformer-search/FeedListView';
import ReviewWritePage from './pages/my-page/ReviewWritePage';
import OrderPage from './pages/order/OrderPage';

import SignupPage from './pages/Signup/SignupPage';
import SignupTypeSelection from './pages/Signup/SignupTypeSelection';
import SignupFormPage from './pages/Signup/SignupFormPage';
import SignupComplete from './pages/Signup/SignupComplete';

function App() {
  return (
    <Routes>
      <Route
        element={
          <Layout
            showHeader={true}
            showNavbar={true}
            showFooter={true}
            footerVariant="light"
          />
        }
      >
        <Route path="/" element={<Home />} />

         {/* 장바구니 페이지 */}
        <Route path="/cart" element={<Cart />} />

         {/* 주문제작 페이지 */}
        <Route path="/order" element={<OrderPage />} />

         {/* 프로필 페이지 */}
        <Route path="/profile" element={<Profile />} />

         {/* 찜 페이지 */}
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/reformer/wishlist" element={<ReformerWishlist />} />

        {/* 리폼러 찾기 페이지 */}
        <Route path="/reformer-search" element={<ReformerSearch />} />
        <Route path="/reformer-search/results" element={<ReformerSearchResults />} />
        <Route path="/reformer-search/all" element={<ReformerListView />} />
        <Route path="/reformer-search/feed" element={<FeedListView />} />

        <Route path="reformer-mypage" element={<ReformerMyPage />} />
        <Route path="/sales/create" element={<CreatePage type="sale" />} />
        <Route path="/custom/create" element={<CreatePage type="order" />} />
        <Route path="/reformer-profile-edit" element={<EditProfilePage />} />
        <Route path="/normal-mypage" element={<NormalMyPage />} />
        <Route path="/normal-profile-edit" element={<EditProfilePage />} />
        <Route path="/mypage/review/write" element={<ReviewWritePage />} />

        {/* 404 처리 */}
        <Route path="*" element={<div>Not Found</div>} />
      </Route>

      <Route
        element={
          <Layout
            showHeader={false}
            showNavbar={false}
            showFooter={false}
          />
        }
      >
        {/* 회원가입 페이지 */}
        <Route path='/signup' element={<SignupPage />} />
        <Route path="/signup/type" element={<SignupTypeSelection />} />
        <Route path="/signup/customer-form" element={<SignupFormPage />} />
        <Route path="/signup/reformer-form" element={<SignupFormPage />} />
        <Route path="/signup/complete" element={<SignupComplete />} />
      </Route>

      {/* 404 처리 */}
      <Route path="*" element={<div>Not Found</div>} />
    </Routes>
  );
}

export default App;
//app.tsx에선 라우팅만 담당
//페이지를 많이 만드는거 xx , 라우팅을 다르게 + 내부 컴포넌트는 재사용 할 수 있도록 설계