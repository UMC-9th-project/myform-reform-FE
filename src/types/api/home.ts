// 홈 API 응답 타입
export interface HomeResponse {
  resultType: 'SUCCESS' | 'ERROR';
  error: null | {
    code: string;
    message: string;
  };
  success: {
    result: boolean;
    user_session: {
      is_logged_in: boolean;
      role: string | null;
      user_id: string | null;
      nickname: string | null;
      profile_image: string | null;
      cart_count: number;
    };
    home_data: {
      banners: Array<{
        id: string;
        image_url: string;
      }>;
      trending_items: Array<{
        item_id: string;
        thumbnail: string;
        title: string;
        price: number;
        star: number;
        review_count: number;
        owner_id: string;
        owner_nickname: string;
        is_wished: boolean;
      }>;
      custom_orders: Array<{
        proposal_id: string;
        thumbnail: string;
        title: string;
        min_price: number;
        owner_id: string;
        owner_nickname: string;
      }>;
      best_reformers: Array<{
        owner_id: string;
        nickname: string;
        profile_image: string;
        bio: string;
        keywords: string[];
        avg_star: number;
        review_count: number;
        trade_count: number;
      }>;
    };
  } | null;
}
