/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/lib/actions/blogs.ts
 *
 * Purpose :
 * Blog CMS server actions and public loaders.
 *
 * Version : v0.1.0
 * ============================================================
 */

"use server";

import {
  revalidatePath,
} from "next/cache";

import {
  createClient,
} from "@/lib/supabase/server";

import {
  attachBlogRelatedBlogSchema,
  attachBlogRelatedServiceSchema,
  blogAuthorSchema,
  blogCategorySchema,
  blogContentBlockSchema,
  blogFaqSchema,
  blogGalleryItemSchema,
  blogHighlightSchema,
  createBlogSchema,
  updateBlogSchema,
} from "@/lib/validations/blogs";

import type {
  AttachBlogRelatedBlogInput,
  AttachBlogRelatedServiceInput,
  Blog,
  BlogActionResult,
  BlogAuthor,
  BlogCategory,
  BlogContentBlock,
  BlogDetailData,
  BlogFaq,
  BlogGalleryItem,
  BlogHighlight,
  BlogRelatedBlogWithBlog,
  BlogRelatedServiceWithService,
  BlogWithRelations,
  CreateBlogAuthorInput,
  CreateBlogCategoryInput,
  CreateBlogContentBlockInput,
  CreateBlogFaqInput,
  CreateBlogGalleryItemInput,
  CreateBlogHighlightInput,
  CreateBlogInput,
  UpdateBlogAuthorInput,
  UpdateBlogCategoryInput,
  UpdateBlogContentBlockInput,
  UpdateBlogFaqInput,
  UpdateBlogGalleryItemInput,
  UpdateBlogHighlightInput,
  UpdateBlogInput,
} from "@/lib/types/blogs";

const BLOG_ADMIN_PATH =
  "/admin/website/blogs";
function refreshBlogPaths(
  slug?: string,
): void {
  revalidatePath("/");
  revalidatePath("/blogs");
  revalidatePath("/admin/website/blogs/new");

  if (slug) {
    revalidatePath(
      `/blogs/${slug}`,
    );
  }
}

function validationError<T = undefined>(
  errors: Record<
    string,
    string[] | undefined
  >,
): BlogActionResult<T> {
  return {
    success: false,
    message:
      "Please correct the highlighted fields.",
    errors,
  };
}
function dbError<T = undefined>(
  message: string,
): BlogActionResult<T> {
  return {
    success: false,
    message,
  };
}
export async function getBlogs():
  Promise<BlogWithRelations[]> {
  const supabase =
    await createClient();

  const { data, error } =
    await supabase
      .from("blogs")
      .select(`
        *,
        category:blog_categories(*),
        author:blog_authors(*)
      `)
      .order("is_sticky", {
        ascending: false,
      })
      .order("is_featured", {
        ascending: false,
      })
      .order("display_order", {
        ascending: true,
      })
      .order("created_at", {
        ascending: false,
      });

  if (error) {
    console.error(
      "Failed to load blogs:",
      error,
    );

    return [];
  }

  return (
    data as BlogWithRelations[]
  ) ?? [];
}

export async function getPublishedBlogs():
  Promise<BlogWithRelations[]> {
  try {
    const supabase =
      await createClient();

    const now =
      new Date().toISOString();

    const { data, error } =
      await supabase
        .from("blogs")
        .select(`
          *,
          category:blog_categories!blogs_category_id_fkey(*),
          author:blog_authors!blogs_author_id_fkey(*)
        `)
        .eq("is_active", true)
        .eq("is_published", true)
        .eq("show_in_listing", true)
        .or(
          `publish_date.is.null,publish_date.lte.${now}`,
        )
        .order("is_sticky", {
          ascending: false,
        })
        .order("is_featured", {
          ascending: false,
        })
        .order("display_order", {
          ascending: true,
        })
        .order("publish_date", {
          ascending: false,
          nullsFirst: false,
        });

    if (error) {
      console.error(
        "Failed to load published blogs:",
        {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
        },
      );

      return [];
    }

    return (
      (data as
        | BlogWithRelations[]
        | null) ?? []
    );
  } catch (error) {
    console.error(
      "Unexpected error loading published blogs:",
      error,
    );

    return [];
  }
}
export async function getBlogById(
  id: string,
): Promise<BlogWithRelations | null> {
  const supabase =
    await createClient();

  const { data, error } =
    await supabase
      .from("blogs")
      .select(`
        *,
        category:blog_categories(*),
        author:blog_authors(*)
      `)
      .eq("id", id)
      .maybeSingle();

  if (error) {
    console.error(
      "Failed to load blog:",
      error,
    );

    return null;
  }

  return (
    data as BlogWithRelations | null
  ) ?? null;
}

export async function getBlogBySlug(
  slug: string,
): Promise<BlogWithRelations | null> {
  const supabase =
    await createClient();

  const { data, error } =
    await supabase
      .from("blogs")
      .select(`
        *,
        category:blog_categories(*),
        author:blog_authors(*)
      `)
      .eq("slug", slug)
      .maybeSingle();

  if (error) {
    console.error(
      "Failed to load blog by slug:",
      error,
    );

    return null;
  }

  return (
    data as BlogWithRelations | null
  ) ?? null;
}

export async function getPublishedBlogBySlug(
  slug: string,
): Promise<BlogWithRelations | null> {
  const supabase =
    await createClient();

  const { data, error } =
    await supabase
      .from("blogs")
      .select(`
        *,
        category:blog_categories(*),
        author:blog_authors(*)
      `)
      .eq("slug", slug)
      .eq("is_active", true)
      .eq("is_published", true)
      .or(
        `publish_date.is.null,publish_date.lte.${new Date().toISOString()}`,
      )
      .maybeSingle();

  if (error) {
    console.error(
      "Failed to load published blog:",
      error,
    );

    return null;
  }

  return (
    data as BlogWithRelations | null
  ) ?? null;
}

export async function createBlog(
  input: CreateBlogInput,
): Promise<BlogActionResult<Blog>> {
  const parsed =
    createBlogSchema.safeParse(
      input,
    );

  if (!parsed.success) {
    return validationError<Blog>(
  parsed.error.flatten()
    .fieldErrors,
);
  }

  const supabase =
    await createClient();

  const { data, error } =
    await supabase
      .from("blogs")
      .insert(parsed.data)
      .select("*")
      .single();

  if (error) {
    return dbError<Blog>(
  error.message,
);
  }

  refreshBlogPaths(
    data.slug,
  );

  return {
    success: true,
    message:
      "Blog created successfully.",
    data: data as Blog,
  };
}

export async function updateBlog(
  id: string,
  input: UpdateBlogInput,
): Promise<BlogActionResult<Blog>> {
  const parsed =
    updateBlogSchema.safeParse(
      input,
    );

  if (!parsed.success) {
    return validationError<Blog>(
  parsed.error.flatten()
    .fieldErrors,
);
  }

  const supabase =
    await createClient();

  const existing =
    await getBlogById(id);

  const { data, error } =
    await supabase
      .from("blogs")
      .update(parsed.data)
      .eq("id", id)
      .select("*")
      .single();

  if (error) {
    return dbError<Blog>(
  error.message,
);
  }

  refreshBlogPaths(
    existing?.slug,
  );

  refreshBlogPaths(
    data.slug,
  );

  return {
    success: true,
    message:
      "Blog updated successfully.",
    data: data as Blog,
  };
}

export async function deleteBlog(
  id: string,
): Promise<BlogActionResult> {
  const existing =
    await getBlogById(id);

  const supabase =
    await createClient();

  const { error } =
    await supabase
      .from("blogs")
      .delete()
      .eq("id", id);

  if (error) {
    return dbError(
      error.message,
    );
  }

  refreshBlogPaths(
    existing?.slug,
  );

  return {
    success: true,
    message:
      "Blog deleted successfully.",
  };
}

export async function toggleBlogPublished(
  id: string,
  isPublished: boolean,
): Promise<BlogActionResult<Blog>> {
  return updateBlog(
    id,
    {
      is_published:
        isPublished,
    },
  );
}

export async function toggleBlogActive(
  id: string,
  isActive: boolean,
): Promise<BlogActionResult<Blog>> {
  return updateBlog(
    id,
    {
      is_active:
        isActive,
    },
  );
}

export async function getBlogCategories():
  Promise<BlogCategory[]> {
  const supabase =
    await createClient();

  const { data, error } =
    await supabase
      .from("blog_categories")
      .select("*")
      .order("display_order")
      .order("name");

  if (error) {
    console.error(
      "Failed to load blog categories:",
      error,
    );

    return [];
  }

  return (
    data as BlogCategory[]
  ) ?? [];
}

export async function createBlogCategory(
  input: CreateBlogCategoryInput,
): Promise<BlogActionResult<BlogCategory>> {
  const parsed =
    blogCategorySchema.safeParse(
      input,
    );

  if (!parsed.success) {
    return validationError<BlogCategory>(
  parsed.error.flatten()
    .fieldErrors,
);
  }

  const supabase =
    await createClient();

  const { data, error } =
    await supabase
      .from("blog_categories")
      .insert(parsed.data)
      .select("*")
      .single();

  if (error) {
    return dbError<BlogCategory>(
  error.message,
);
  }

  refreshBlogPaths();

  return {
    success: true,
    message:
      "Category created successfully.",
    data: data as BlogCategory,
  };
}

export async function updateBlogCategory(
  id: string,
  input: UpdateBlogCategoryInput,
): Promise<BlogActionResult<BlogCategory>> {
  const parsed =
    blogCategorySchema
      .partial()
      .safeParse(input);

  if (!parsed.success) {
    return validationError<BlogCategory>(
  parsed.error.flatten()
    .fieldErrors,
);
  }

  const supabase =
    await createClient();

  const { data, error } =
    await supabase
      .from("blog_categories")
      .update(parsed.data)
      .eq("id", id)
      .select("*")
      .single();

  if (error) {
   return dbError<BlogCategory>(
  error.message,
);
  }

  refreshBlogPaths();

  return {
    success: true,
    message:
      "Category updated successfully.",
    data: data as BlogCategory,
  };
}

export async function getBlogAuthors():
  Promise<BlogAuthor[]> {
  const supabase =
    await createClient();

  const { data, error } =
    await supabase
      .from("blog_authors")
      .select("*")
      .order("display_order")
      .order("display_name");

  if (error) {
    console.error(
      "Failed to load blog authors:",
      error,
    );

    return [];
  }

  return (
    data as BlogAuthor[]
  ) ?? [];
}

export async function createBlogAuthor(
  input: CreateBlogAuthorInput,
): Promise<BlogActionResult<BlogAuthor>> {
  const parsed =
    blogAuthorSchema.safeParse(
      input,
    );

  if (!parsed.success) {
    return validationError<BlogAuthor>(
  parsed.error.flatten()
    .fieldErrors,
);
  }

  const supabase =
    await createClient();

  const { data, error } =
    await supabase
      .from("blog_authors")
      .insert(parsed.data)
      .select("*")
      .single();

  if (error) {
    return dbError<BlogAuthor>(
  error.message,
);
  }

  refreshBlogPaths();

  return {
    success: true,
    message:
      "Author created successfully.",
    data: data as BlogAuthor,
  };
}

export async function updateBlogAuthor(
  id: string,
  input: UpdateBlogAuthorInput,
): Promise<BlogActionResult<BlogAuthor>> {
  const parsed =
    blogAuthorSchema
      .partial()
      .safeParse(input);

  if (!parsed.success) {
    return validationError<BlogAuthor>(
  parsed.error.flatten()
    .fieldErrors,
);
  }

  const supabase =
    await createClient();

  const { data, error } =
    await supabase
      .from("blog_authors")
      .update(parsed.data)
      .eq("id", id)
      .select("*")
      .single();

  if (error) {
   return dbError<BlogAuthor>(
  error.message,
);
  }

  refreshBlogPaths();

  return {
    success: true,
    message:
      "Author updated successfully.",
    data: data as BlogAuthor,
  };
}

async function getChildRows<T>(
  table: string,
  blogId: string,
): Promise<T[]> {
  const supabase =
    await createClient();

  const { data, error } =
    await supabase
      .from(table)
      .select("*")
      .eq("blog_id", blogId)
      .order("display_order", {
        ascending: true,
      })
      .order("created_at", {
        ascending: true,
      });

  if (error) {
    console.error(
      `Failed to load ${table}:`,
      error,
    );

    return [];
  }

  return (
    data as T[]
  ) ?? [];
}

export async function getBlogContentBlocks(
  blogId: string,
): Promise<BlogContentBlock[]> {
  return getChildRows<BlogContentBlock>(
    "blog_content_blocks",
    blogId,
  );
}

export async function getBlogHighlights(
  blogId: string,
): Promise<BlogHighlight[]> {
  return getChildRows<BlogHighlight>(
    "blog_highlights",
    blogId,
  );
}

export async function getBlogGallery(
  blogId: string,
): Promise<BlogGalleryItem[]> {
  return getChildRows<BlogGalleryItem>(
    "blog_gallery",
    blogId,
  );
}

export async function getBlogFaqs(
  blogId: string,
): Promise<BlogFaq[]> {
  return getChildRows<BlogFaq>(
    "blog_faqs",
    blogId,
  );
}

async function createChildRow<
  TInput extends object,
  TOutput,
>(
  table: string,
  schema: {
    safeParse: (
      input: unknown,
    ) =>
      | {
          success: true;
          data: TInput;
        }
      | {
          success: false;
          error: {
            flatten: () => {
              fieldErrors: Record<
                string,
                string[] | undefined
              >;
            };
          };
        };
  },
  input: TInput,
  successMessage: string,
): Promise<BlogActionResult<TOutput>> {
  const parsed =
    schema.safeParse(input);

  if (!parsed.success) {
    return validationError(
      parsed.error.flatten()
        .fieldErrors,
    ) as BlogActionResult<TOutput>;
  }

  const supabase =
    await createClient();

  const { data, error } =
    await supabase
      .from(table)
      .insert(parsed.data)
      .select("*")
      .single();

  if (error) {
    return dbError(
      error.message,
    ) as BlogActionResult<TOutput>;
  }

  refreshBlogPaths();

  return {
    success: true,
    message: successMessage,
    data: data as TOutput,
  };
}

export async function createBlogContentBlock(
  input: CreateBlogContentBlockInput,
): Promise<BlogActionResult<BlogContentBlock>> {
  return createChildRow(
    "blog_content_blocks",
    blogContentBlockSchema,
    input,
    "Content block created successfully.",
  );
}

export async function createBlogHighlight(
  input: CreateBlogHighlightInput,
): Promise<BlogActionResult<BlogHighlight>> {
  return createChildRow(
    "blog_highlights",
    blogHighlightSchema,
    input,
    "Highlight created successfully.",
  );
}

export async function createBlogGalleryItem(
  input: CreateBlogGalleryItemInput,
): Promise<BlogActionResult<BlogGalleryItem>> {
  return createChildRow(
    "blog_gallery",
    blogGalleryItemSchema,
    input,
    "Gallery image created successfully.",
  );
}

export async function createBlogFaq(
  input: CreateBlogFaqInput,
): Promise<BlogActionResult<BlogFaq>> {
  return createChildRow(
    "blog_faqs",
    blogFaqSchema,
    input,
    "FAQ created successfully.",
  );
}

async function updateChildRow<
  TInput extends object,
  TOutput,
>(
  table: string,
  id: string,
  input: TInput,
  successMessage: string,
): Promise<BlogActionResult<TOutput>> {
  const supabase =
    await createClient();

  const { data, error } =
    await supabase
      .from(table)
      .update(input)
      .eq("id", id)
      .select("*")
      .single();

  if (error) {
    return dbError(
      error.message,
    ) as BlogActionResult<TOutput>;
  }

  refreshBlogPaths();

  return {
    success: true,
    message: successMessage,
    data: data as TOutput,
  };
}

export async function updateBlogContentBlock(
  id: string,
  input: UpdateBlogContentBlockInput,
): Promise<BlogActionResult<BlogContentBlock>> {
  const parsed =
    blogContentBlockSchema
      .omit({ blog_id: true })
      .partial()
      .safeParse(input);

  if (!parsed.success) {
    return validationError(
      parsed.error.flatten()
        .fieldErrors,
    ) as BlogActionResult<BlogContentBlock>;
  }

  return updateChildRow(
    "blog_content_blocks",
    id,
    parsed.data,
    "Content block updated successfully.",
  );
}

export async function updateBlogHighlight(
  id: string,
  input: UpdateBlogHighlightInput,
): Promise<BlogActionResult<BlogHighlight>> {
  const parsed =
    blogHighlightSchema
      .omit({ blog_id: true })
      .partial()
      .safeParse(input);

  if (!parsed.success) {
    return validationError(
      parsed.error.flatten()
        .fieldErrors,
    ) as BlogActionResult<BlogHighlight>;
  }

  return updateChildRow(
    "blog_highlights",
    id,
    parsed.data,
    "Highlight updated successfully.",
  );
}

export async function updateBlogGalleryItem(
  id: string,
  input: UpdateBlogGalleryItemInput,
): Promise<BlogActionResult<BlogGalleryItem>> {
  const parsed =
    blogGalleryItemSchema
      .omit({ blog_id: true })
      .partial()
      .safeParse(input);

  if (!parsed.success) {
    return validationError(
      parsed.error.flatten()
        .fieldErrors,
    ) as BlogActionResult<BlogGalleryItem>;
  }

  return updateChildRow(
    "blog_gallery",
    id,
    parsed.data,
    "Gallery item updated successfully.",
  );
}

export async function updateBlogFaq(
  id: string,
  input: UpdateBlogFaqInput,
): Promise<BlogActionResult<BlogFaq>> {
  const parsed =
    blogFaqSchema
      .omit({ blog_id: true })
      .partial()
      .safeParse(input);

  if (!parsed.success) {
    return validationError(
      parsed.error.flatten()
        .fieldErrors,
    ) as BlogActionResult<BlogFaq>;
  }

  return updateChildRow(
    "blog_faqs",
    id,
    parsed.data,
    "FAQ updated successfully.",
  );
}

export async function deleteBlogChildItem(
  table:
    | "blog_content_blocks"
    | "blog_highlights"
    | "blog_gallery"
    | "blog_faqs",
  id: string,
): Promise<BlogActionResult> {
  const supabase =
    await createClient();

  const { error } =
    await supabase
      .from(table)
      .delete()
      .eq("id", id);

  if (error) {
    return dbError(
      error.message,
    );
  }

  refreshBlogPaths();

  return {
    success: true,
    message:
      "Item deleted successfully.",
  };
}

export async function attachBlogRelatedService(
  input: AttachBlogRelatedServiceInput,
): Promise<BlogActionResult> {
  const parsed =
    attachBlogRelatedServiceSchema.safeParse(
      input,
    );

  if (!parsed.success) {
    return validationError(
      parsed.error.flatten()
        .fieldErrors,
    );
  }

  const supabase =
    await createClient();

  const { error } =
    await supabase
      .from("blog_related_services")
      .insert(parsed.data);

  if (error) {
    return dbError(
      error.message,
    );
  }

  refreshBlogPaths();

  return {
    success: true,
    message:
      "Related service attached successfully.",
  };
}

export async function detachBlogRelatedService(
  id: string,
): Promise<BlogActionResult> {
  const supabase =
    await createClient();

  const { error } =
    await supabase
      .from("blog_related_services")
      .delete()
      .eq("id", id);

  if (error) {
    return dbError(
      error.message,
    );
  }

  refreshBlogPaths();

  return {
    success: true,
    message:
      "Related service removed successfully.",
  };
}

export async function attachBlogRelatedBlog(
  input: AttachBlogRelatedBlogInput,
): Promise<BlogActionResult> {
  const parsed =
    attachBlogRelatedBlogSchema.safeParse(
      input,
    );

  if (!parsed.success) {
    return validationError(
      parsed.error.flatten()
        .fieldErrors,
    );
  }

  const supabase =
    await createClient();

  const { error } =
    await supabase
      .from("blog_related_blogs")
      .insert(parsed.data);

  if (error) {
    return dbError(
      error.message,
    );
  }

  refreshBlogPaths();

  return {
    success: true,
    message:
      "Related blog attached successfully.",
  };
}

export async function detachBlogRelatedBlog(
  id: string,
): Promise<BlogActionResult> {
  const supabase =
    await createClient();

  const { error } =
    await supabase
      .from("blog_related_blogs")
      .delete()
      .eq("id", id);

  if (error) {
    return dbError(
      error.message,
    );
  }

  refreshBlogPaths();

  return {
    success: true,
    message:
      "Related blog removed successfully.",
  };
}

export async function getBlogRelatedServices(
  blogId: string,
): Promise<BlogRelatedServiceWithService[]> {
  const supabase =
    await createClient();

  const { data, error } =
    await supabase
      .from("blog_related_services")
      .select(`
        *,
        service:services(
          id,
          service_name,
          slug,
          short_description,
          featured_image_url,
          featured_image_alt,
          explore_button_text
        )
      `)
      .eq("blog_id", blogId)
      .order("display_order");

  if (error) {
    console.error(
      "Failed to load blog related services:",
      error,
    );

    return [];
  }

  return (
    data as BlogRelatedServiceWithService[]
  ) ?? [];
}

export async function getBlogRelatedBlogs(
  blogId: string,
): Promise<BlogRelatedBlogWithBlog[]> {
  try {
    const supabase =
      await createClient();

    const { data, error } =
      await supabase
        .from("blog_related_blogs")
        .select(`
          *,
          related_blog:blogs!blog_related_blogs_related_blog_id_fkey(
            *,
            category:blog_categories!blogs_category_id_fkey(*),
            author:blog_authors!blogs_author_id_fkey(*)
          )
        `)
        .eq("blog_id", blogId)
        .order("display_order", {
          ascending: true,
        });

    if (error) {
      console.error(
        "Failed to load related blogs:",
        {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
        },
      );

      return [];
    }

    return (
      (data as BlogRelatedBlogWithBlog[] | null) ??
      []
    );
  } catch (error) {
    console.error(
      "Unexpected error loading related blogs:",
      error,
    );

    return [];
  }
}

export async function getBlogDetailData(
  blogId: string,
): Promise<BlogDetailData> {
  const [
    blog,
    contentBlocks,
    highlights,
    galleryItems,
    faqs,
    relatedServices,
    relatedBlogs,
  ] = await Promise.all([
    getBlogById(blogId),
    getBlogContentBlocks(blogId),
    getBlogHighlights(blogId),
    getBlogGallery(blogId),
    getBlogFaqs(blogId),
    getBlogRelatedServices(blogId),
    getBlogRelatedBlogs(blogId),
  ]);

  return {
    blog,
    contentBlocks,
    highlights,
    galleryItems,
    faqs,
    relatedServices,
    relatedBlogs,
  };
}

export async function getPublishedBlogDetailData(
  slug: string,
): Promise<BlogDetailData> {
  const blog =
    await getPublishedBlogBySlug(
      slug,
    );

  if (!blog) {
    return {
      blog: null,
      contentBlocks: [],
      highlights: [],
      galleryItems: [],
      faqs: [],
      relatedServices: [],
      relatedBlogs: [],
    };
  }

  const [
    contentBlocks,
    highlights,
    galleryItems,
    faqs,
    relatedServices,
    relatedBlogs,
  ] = await Promise.all([
    getBlogContentBlocks(blog.id),
    getBlogHighlights(blog.id),
    getBlogGallery(blog.id),
    getBlogFaqs(blog.id),
    getBlogRelatedServices(blog.id),
    getBlogRelatedBlogs(blog.id),
  ]);

  return {
    blog,
    contentBlocks,
    highlights,
    galleryItems,
    faqs,
    relatedServices,
    relatedBlogs,
  };
}
