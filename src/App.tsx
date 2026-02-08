import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from './components/layout/PageLayout';
import Home from './pages/home/Home';
import Cart from './pages/cart/Cart';
import Market from './pages/market/Market';
import MarketProductDetailPage from './pages/market/MarketProductDetailPage';
import MarketPurchasePage from './pages/market/MarketPurchasePage';
import MarketPurchaseCompletePage from './pages/market/MarketPurchaseCompletePage';
import Wishlist from './pages/wishlist/Wishlist';
import ReformerWishlist from './pages/wishlist-reformer/Wishlist';
import ReformerMyPage from './pages/my-page-Reform/ReformerMyPage';
import CreatePage from './pages/my-page-Reform/CreatePage';
import EditProfilePage from './pages/my-page-Reform/EditProfilePage';
import Profile from './pages/Profile';
import NormalMyPage from './pages/my-page/NormalMyPage';
import ReformerSearch from './pages/reformer-search/ReformerSearch';
import ReformerSearchResults from './pages/reformer-search/ReformerSearchResults';
import ReformerListView from './pages/reformer-search/ReformerListView';
import FeedListView from './pages/reformer-search/FeedListView';
import Search from './pages/search/Search';
import ReviewWritePage from './pages/my-page/ReviewWritePage';
import OrderPage from './pages/order/OrderPage';
import OrderRequestListPage from './pages/order/OrderRequestListPage';
import OrderRequestDetailPage from './pages/order/OrderRequestDetailPage';
import OrderRequestCreatePage from './pages/order/OrderRequestCreatePage';
import OrderProposalListPage from './pages/order/OrderProposalListPage';
import OrderProposalDetailPage from './pages/order/OrderProposalDetailPage';
import ReformerOrderPage from './pages/order/reformer/ReformerOrderPage';
import ReformerOrderRequestListPage from './pages/order/reformer/ReformerOrderRequestListPage';
import ReformerOrderRequestDetailPage from './pages/order/reformer/ReformerOrderRequestDetailPage';
import ReformerOrderEstimateCreatePage from './pages/order/reformer/ReformerOrderEstimateCreatePage';
import ReformerOrderProposalListPage from './pages/order/reformer/ReformerOrderProposalListPage';
import ReformerOrderProposalDetailPage from './pages/order/reformer/ReformerOrderProposalDetailPage';

import SignupPage from './pages/signup/SignupPage';
import SignupTypeSelection from './pages/signup/SignupTypeSelection';
import SignupFormPage from './pages/signup/SignupFormPage';
import SignupComplete from './pages/signup/SignupComplete';
import ReformerRegistration from './pages/signup/reformer/ReformerRegistration';
import ReformerRegistrationComplete from './pages/signup/reformer/ReformerRegistrationComplete';

 {/* 로그인 페이지 */}
import Login from './pages/login/Login';

import ChatPage from './pages/chat/ChatPage';
import ChatQuotationDetailPage from './pages/chat/ChatQuotationDetailPage';
import ChatQuotationFormPage from './pages/chat/ChatQuotationFormPage';
import ChatRequestFormPage from './pages/chat/ChatRequestFormPage';

import LandingPage from './pages/LandingPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>

      <Route
        element={
          <Layout
            showHeader={true}
            showNavbar={true}
            showFooter={true}
            footerVariant="dark"
          />
        }
      >
        {/* 홈 페이지 */}
        <Route path="/" element={<Home />} />
      </Route>

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

         {/* 장바구니 페이지 */}
        <Route path="/cart" element={<Cart />} />

         {/* 주문제작 페이지 (일반 유저) */}
        <Route path="/order" element={<OrderPage />} />
        <Route path="/order/requests" element={<OrderRequestListPage />} />
        <Route path="/order/requests/:id" element={<OrderRequestDetailPage />} />
        <Route path="/order/proposals" element={<OrderProposalListPage />} />
        <Route path="/order/proposals/:id" element={<OrderProposalDetailPage />} />

         {/* 주문제작 페이지 (리폼러) */}
        <Route path="/reformer/order" element={<ReformerOrderPage />} />
        <Route path="/reformer/order/requests" element={<ReformerOrderRequestListPage />} />
        <Route path="/reformer/order/requests/:id" element={<ReformerOrderRequestDetailPage />} />
        <Route path="/reformer/order/proposals" element={<ReformerOrderProposalListPage />} />
        <Route path="/reformer/order/proposals/:id" element={<ReformerOrderProposalDetailPage />} />

         {/* 프로필 페이지 */}
        <Route path="/profile/:ownerId" element={<Profile />} />

         {/* 찜 페이지 */}
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/reformer/wishlist" element={<ReformerWishlist />} />

        {/* 마켓 페이지 */}
        <Route path="/market" element={<Market />} />
        <Route path="/market/product/:id" element={<MarketProductDetailPage />} />
        <Route path="/market/product/:id/purchase" element={<MarketPurchasePage />} />
        <Route path="/market/product/:id/purchase/complete" element={<MarketPurchaseCompletePage />} />
        

        {/* 검색 페이지 */}
        <Route path="/search" element={<Search />} />

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
        <Route path="/chat/quotation/detail/:requestId" element={<ChatQuotationDetailPage />} />

        {/* 404 처리 */}
        <Route path="*" element={<div>Not Found</div>} />
      </Route>

      <Route
        element={
          <Layout
            showHeader={true}
            showNavbar={true}
            showFooter={false}
          />
        }
      >
        {/* 푸터 x */}
        <Route path="/order/requests/create" element={<OrderRequestCreatePage />} />
        <Route path="/reformer/order/requests/:id/estimate" element={<ReformerOrderEstimateCreatePage />} />
      </Route>

      <Route
      element={
        <Layout
          showHeader={false}
          showNavbar={false}
          showFooter={true}
          footerVariant="dark"
        />
      }
      >
       <Route path="/landing" element={<LandingPage />} />

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
        <Route path="/signup/user-form" element={<SignupFormPage />} />
        <Route path="/signup/reformer-form" element={<SignupFormPage />} />
        <Route path="/signup/reformer-registration" element={<ReformerRegistration />} />
        <Route path="/signup/reformer-complete" element={<ReformerRegistrationComplete />} />
        <Route path="/signup/complete" element={<SignupComplete />} />


        {/* 로그인 페이지 */}
        <Route path="/login" element={<Login />} />
        <Route path="/login/reformer" element={<Login />} />
        <Route path="/login/type" element={<SignupTypeSelection />} />
      </Route>

      {/*채팅 창 푸터 없음 */}
      <Route
        element={
          <Layout
            showHeader={true}
            showNavbar={true}
            showFooter={false}
          />
        }>
        <Route path="/chat/reformer/:chatId?" element={<ChatPage role="REFORMER" />} />
        <Route path="/chat/normal/:chatId?" element={<ChatPage role="USER" />} />
        <Route path="/chat/create/quotation/:chatRoomId" element={<ChatQuotationFormPage />} />
        <Route path="/chat/create/request/:chatRoomId" element={<ChatRequestFormPage />} />
      </Route>


      {/* 404 처리 */}
      <Route path="*" element={<div>Not Found</div>} />
    </Routes>
    </>
  );
}

export default App;
