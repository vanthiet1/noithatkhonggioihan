-- Key public chỉ được đọc, gửi liên hệ và gửi đánh giá.
-- Không được thêm, sửa, xóa sản phẩm, tin, danh mục hay file ảnh.

alter table categories enable row level security;
alter table sub_categories enable row level security;
alter table products enable row level security;
alter table news enable row level security;
alter table featured_projects enable row level security;
alter table site_settings enable row level security;
alter table contacts enable row level security;
alter table product_reviews enable row level security;

alter table categories force row level security;
alter table sub_categories force row level security;
alter table products force row level security;
alter table news force row level security;
alter table featured_projects force row level security;
alter table site_settings force row level security;
alter table contacts force row level security;
alter table product_reviews force row level security;

drop policy if exists "public read categories" on categories;
create policy "public read categories" on categories for select to anon, authenticated using (true);
drop policy if exists "public read sub_categories" on sub_categories;
create policy "public read sub_categories" on sub_categories for select to anon, authenticated using (true);
drop policy if exists "public read products" on products;
create policy "public read products" on products for select to anon, authenticated using (true);
drop policy if exists "public read news" on news;
create policy "public read news" on news for select to anon, authenticated using (true);
drop policy if exists "public read featured_projects" on featured_projects;
create policy "public read featured_projects" on featured_projects for select to anon, authenticated using (true);
drop policy if exists "public read contacts" on contacts;
create policy "public read contacts" on contacts for select to anon, authenticated using (true);
drop policy if exists "public read reviews" on product_reviews;
create policy "public read reviews" on product_reviews for select to anon, authenticated using (true);

drop policy if exists "public insert contact" on contacts;
create policy "public insert contact" on contacts for insert to anon, authenticated
  with check (
    name is not null and length(btrim(name)) > 0
    and phone is not null and length(btrim(phone)) > 0
    and (status is null or status = 'pending')
  );

drop policy if exists "public insert review" on product_reviews;
create policy "public insert review" on product_reviews for insert to anon, authenticated
  with check (
    is_approved = false
    and rating between 1 and 5
    and product_id is not null
    and author_name is not null
    and author_email is not null
    and content is not null
  );

revoke insert, update, delete, truncate on table
  categories, sub_categories, products, news, featured_projects, site_settings
  from anon, authenticated;
revoke update, delete, truncate on table
  contacts, product_reviews
  from anon, authenticated;

drop policy if exists "Allow public CRUD for product-images 16wiy3a_2" on storage.objects;
drop policy if exists "Allow public CRUD for product-images 16wiy3a_3" on storage.objects;
