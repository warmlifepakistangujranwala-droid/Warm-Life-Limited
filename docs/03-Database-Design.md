# Database Design

The platform will use Supabase PostgreSQL.

## Initial Tables

### admin_profiles
Stores approved admin users and roles.

Core fields:
- id
- user_id
- full_name
- role
- is_active
- created_at
- updated_at

### site_settings
Stores global brand and website settings.

Core fields:
- id
- setting_key
- setting_value
- updated_by
- updated_at

### pages
Stores page-level information.

Core fields:
- id
- slug
- title
- status
- seo_title
- seo_description
- canonical_url
- created_at
- updated_at

### page_sections
Stores editable page sections.

Core fields:
- id
- page_id
- section_key
- section_type
- content
- design_settings
- sort_order
- is_visible
- created_at
- updated_at

### services
Stores service content and homepage-scroll settings.

### media
Stores uploaded media metadata.

### logo_items
Stores certification and partner logos.

Suggested fields:
- id
- group_type
- name
- logo_url
- alt_text
- destination_url
- sort_order
- is_active
- created_at
- updated_at

`group_type` values:
- certification
- partner

### seo_records
Stores advanced SEO configuration where page fields are not enough.

### chatbot_documents
Stores chatbot knowledge sources and processing status.

### leads
Stores website and chatbot enquiries.

### audit_logs
Stores important admin actions.

## Security

- Row Level Security will be enabled.
- Public users will receive read-only access to published content.
- Only authenticated and active admins may write.
- Sensitive admin actions will be recorded in `audit_logs`.
