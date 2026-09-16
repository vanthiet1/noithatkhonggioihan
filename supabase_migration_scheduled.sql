-- Cập nhật bảng categories
ALTER TABLE categories ADD COLUMN status TEXT DEFAULT 'published';
ALTER TABLE categories ADD COLUMN published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Cập nhật bảng products
ALTER TABLE products ADD COLUMN status TEXT DEFAULT 'published';
ALTER TABLE products ADD COLUMN published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();


-- Cập nhật bảng sub_categories
ALTER TABLE sub_categories ADD COLUMN status TEXT DEFAULT 'published';
ALTER TABLE sub_categories ADD COLUMN published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Cập nhật bảng news
ALTER TABLE news ADD COLUMN status TEXT DEFAULT 'published';
ALTER TABLE news ADD COLUMN published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Cập nhật bảng featured_projects
ALTER TABLE featured_projects ADD COLUMN status TEXT DEFAULT 'published';
ALTER TABLE featured_projects ADD COLUMN published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
