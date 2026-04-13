export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ProfileResponse {
  profile: {
    id: string;
    username: string;
    display_name: string | null;
    bio: string | null;
    avatar_url: string | null;
    theme_color: string;
    background_url: string | null;
    views_count: number;
  };
  social_links: Array<{
    id: string;
    platform: string;
    url: string;
  }>;
  services: Array<{
    id: string;
    name: string;
    description: string | null;
    price: number | null;
    image_url: string | null;
  }>;
}

export interface CreateProfileRequest {
  username: string;
  display_name?: string;
  bio?: string;
  avatar_url?: string;
  theme_color?: string;
  background_url?: string;
}

export interface CreateProfileResponse {
  profile: ProfileResponse['profile'];
  url: string;
}

export interface AddSocialLinkRequest {
  platform: string;
  url: string;
}

export interface AddServiceRequest {
  name: string;
  description?: string;
  price?: number;
  image_url?: string;
}