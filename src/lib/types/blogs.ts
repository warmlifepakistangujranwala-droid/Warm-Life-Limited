/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/lib/types/blogs.ts
 *
 * Purpose :
 * Shared Blog CMS types.
 *
 * Version : v0.1.1
 * ============================================================
 */

export type BlogHeroType =
  | "image"
  | "video";

export type BlogContentBlockType =
  | "paragraph"
  | "heading"
  | "image"
  | "quote"
  | "video"
  | "checklist"
  | "numbered_list"
  | "table"
  | "code"
  | "callout";

export type BlogHighlightType =
  | "takeaway"
  | "tip";

export type BlogCalloutStyle =
  | "information"
  | "success"
  | "warning"
  | "important";

export interface BlogCategory {
  id: string;
  internal_name: string;
  name: string;
  slug: string;
  description: string | null;
  display_order: number;
  is_active: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface BlogAuthor {
  id: string;
  internal_name: string;
  display_name: string;
  job_title: string | null;
  biography: string | null;
  profile_image_url: string | null;
  profile_image_storage_path: string | null;
  profile_image_alt: string | null;
  linkedin_url: string | null;
  website_url: string | null;
  display_order: number;
  is_active: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Blog {
  id: string;

  internal_name: string;
  title: string;
  slug: string;
  eyebrow: string | null;
  excerpt: string | null;
  introduction: string | null;

  category_id: string | null;
  author_id: string | null;

  reading_time_minutes: number;
  publish_date: string | null;

  featured_image_url: string | null;
  featured_image_storage_path: string | null;
  featured_image_alt: string | null;

  show_in_listing: boolean;
  show_read_button: boolean;
  read_button_text: string;
  open_in_new_tab: boolean;

  has_detail_page: boolean;

  hero_type: BlogHeroType;
  hero_eyebrow: string | null;
  hero_heading: string | null;
  hero_description: string | null;
  hero_image_url: string | null;
  hero_image_storage_path: string | null;
  hero_image_alt: string | null;
  hero_video_url: string | null;
  hero_video_storage_path: string | null;
  hero_poster_url: string | null;
  hero_poster_storage_path: string | null;

  hero_heading_size: number;
  hero_heading_size_mobile: number;
  section_heading_size: number;
  section_heading_size_mobile: number;
  card_heading_size: number;
  cta_heading_size: number;
  cta_heading_size_mobile: number;

  key_takeaways_enabled: boolean;
  key_takeaways_heading: string;

  tips_enabled: boolean;
  tips_heading: string;

  faq_enabled: boolean;
  faq_heading: string;

  gallery_enabled: boolean;
  gallery_heading: string;

  related_services_enabled: boolean;
  related_services_heading: string;

  related_blogs_enabled: boolean;
  related_blogs_heading: string;

  cta_enabled: boolean;
  cta_heading: string;
  cta_description: string | null;
  cta_button_text: string;
  cta_button_link: string;
  cta_button_open_in_new_tab: boolean;

  seo_title: string | null;
  meta_description: string | null;
  focus_keyword: string | null;
  canonical_url: string | null;

  og_title: string | null;
  og_description: string | null;
  og_image_url: string | null;
  og_image_storage_path: string | null;
  og_image_alt: string | null;

  twitter_title: string | null;
  twitter_description: string | null;
  twitter_image_url: string | null;
  twitter_image_storage_path: string | null;

  no_index: boolean;
  no_follow: boolean;

  display_order: number;
  is_featured: boolean;
  is_sticky: boolean;
  is_active: boolean;
  is_published: boolean;

  created_at: string;
  updated_at: string;
}

export interface BlogWithRelations extends Blog {
  category?: BlogCategory | null;
  author?: BlogAuthor | null;
}

export interface BlogContentBlock {
  id: string;
  blog_id: string;
  internal_name: string | null;
  block_type: BlogContentBlockType;
  heading: string | null;
  content: string | null;
  heading_level: number | null;
  image_url: string | null;
  image_storage_path: string | null;
  image_alt: string | null;
  image_caption: string | null;
  video_url: string | null;
  video_storage_path: string | null;
  video_poster_url: string | null;
  quote_author: string | null;
  quote_role: string | null;
  callout_style: BlogCalloutStyle | null;
  display_order: number;
  is_active: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface BlogHighlight {
  id: string;
  blog_id: string;
  highlight_type: BlogHighlightType;
  internal_name: string | null;
  title: string | null;
  description: string;
  icon_name: string;
  display_order: number;
  is_active: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface BlogGalleryItem {
  id: string;
  blog_id: string;
  internal_name: string | null;
  image_url: string | null;
  image_storage_path: string | null;
  image_alt: string | null;
  caption: string | null;
  display_order: number;
  is_active: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface BlogFaq {
  id: string;
  blog_id: string;
  internal_name: string | null;
  question: string;
  answer: string;
  display_order: number;
  is_active: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface BlogRelatedService {
  id: string;
  blog_id: string;
  service_id: string;
  display_order: number;
  created_at: string;
}

export interface BlogRelatedBlog {
  id: string;
  blog_id: string;
  related_blog_id: string;
  display_order: number;
  created_at: string;
}

export interface BlogRelatedServiceWithService
  extends BlogRelatedService {
  service?: {
    id: string;
    service_name: string;
    slug: string;
    short_description: string | null;
    featured_image_url: string | null;
    featured_image_alt: string | null;
    explore_button_text: string | null;
  } | null;
}

export interface BlogRelatedBlogWithBlog
  extends BlogRelatedBlog {
  related_blog?: BlogWithRelations | null;
}

export type CreateBlogInput =
  Omit<
    Blog,
    "id" | "created_at" | "updated_at"
  >;

export type UpdateBlogInput =
  Partial<CreateBlogInput>;

export type CreateBlogCategoryInput =
  Omit<
    BlogCategory,
    "id" | "created_at" | "updated_at"
  >;

export type UpdateBlogCategoryInput =
  Partial<CreateBlogCategoryInput>;

export type CreateBlogAuthorInput =
  Omit<
    BlogAuthor,
    "id" | "created_at" | "updated_at"
  >;

export type UpdateBlogAuthorInput =
  Partial<CreateBlogAuthorInput>;

export type CreateBlogContentBlockInput =
  Omit<
    BlogContentBlock,
    "id" | "created_at" | "updated_at"
  >;

export type UpdateBlogContentBlockInput =
  Partial<
    Omit<
      CreateBlogContentBlockInput,
      "blog_id"
    >
  >;

export type CreateBlogHighlightInput =
  Omit<
    BlogHighlight,
    "id" | "created_at" | "updated_at"
  >;

export type UpdateBlogHighlightInput =
  Partial<
    Omit<
      CreateBlogHighlightInput,
      "blog_id"
    >
  >;

export type CreateBlogGalleryItemInput =
  Omit<
    BlogGalleryItem,
    "id" | "created_at" | "updated_at"
  >;

export type UpdateBlogGalleryItemInput =
  Partial<
    Omit<
      CreateBlogGalleryItemInput,
      "blog_id"
    >
  >;

export type CreateBlogFaqInput =
  Omit<
    BlogFaq,
    "id" | "created_at" | "updated_at"
  >;

export type UpdateBlogFaqInput =
  Partial<
    Omit<
      CreateBlogFaqInput,
      "blog_id"
    >
  >;

export type AttachBlogRelatedServiceInput = {
  blog_id: string;
  service_id: string;
  display_order: number;
};

export type AttachBlogRelatedBlogInput = {
  blog_id: string;
  related_blog_id: string;
  display_order: number;
};

export interface BlogActionResult<T = undefined> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<
    string,
    string[] | undefined
  >;
}

export interface BlogDetailData {
  blog: BlogWithRelations | null;
  contentBlocks: BlogContentBlock[];
  highlights: BlogHighlight[];
  galleryItems: BlogGalleryItem[];
  faqs: BlogFaq[];
  relatedServices:
    BlogRelatedServiceWithService[];
  relatedBlogs:
    BlogRelatedBlogWithBlog[];
}