-- ResitLog — migrasi awal (Fasa 7.2)
-- Skema ikut 04-DATA-MODEL.md tepat. Jangan tukar nama jadual/medan di sini
-- tanpa kemas kini dokumen itu dahulu (04-DATA-MODEL.md menang bila berbeza
-- dengan CLAUDE.md, rujuk baris pertama CLAUDE.md).

-- =========================================================================
-- 1. Jadual pengguna — profil tambahan bagi auth.users
-- =========================================================================
create table public.pengguna (
  id uuid primary key references auth.users (id) on delete cascade,
  nama text not null,
  emel text not null unique,
  pakej text not null default 'basic' check (pakej in ('basic', 'premium')),
  mod text not null default 'solo' check (mod in ('solo', 'pasangan')),
  isi_rumah_id uuid,
  peranan text not null default 'utama' check (peranan in ('utama', 'kedua')),
  tarikh_mula date not null default now(),
  dashboard_habis_pada date not null default (now() + interval '30 days'),
  pasang_ditunjuk boolean not null default false,
  dicipta_pada timestamptz not null default now()
);

-- =========================================================================
-- 2. Jadual isi_rumah — wadah mod pasangan (Premium sahaja, tapi lajur wujud
--    dari hari pertama ikut 04-DATA-MODEL.md §3)
-- =========================================================================
create table public.isi_rumah (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  pemilik_id uuid not null references public.pengguna (id) on delete cascade,
  dicipta_pada timestamptz not null default now()
);

alter table public.pengguna
  add constraint pengguna_isi_rumah_id_fkey
  foreign key (isi_rumah_id) references public.isi_rumah (id) on delete set null;

-- =========================================================================
-- 3. Jadual resit
-- =========================================================================
create table public.resit (
  id uuid primary key default gen_random_uuid(),
  ref text not null,
  pengguna_id uuid not null references public.pengguna (id) on delete cascade,
  isi_rumah_id uuid references public.isi_rumah (id) on delete set null,
  kedai text not null,
  no_invois text,
  tarikh date not null,
  cara_bayar text not null default 'tunai' check (cara_bayar in ('tunai', 'kad', 'ewallet')),
  jumlah numeric(10, 2) not null,
  sumber text not null check (sumber in ('gambar', 'album', 'manual')),
  gambar_laluan text,
  tiada_bukti boolean not null default false,
  dicipta_pada timestamptz not null default now(),
  dikemas_pada timestamptz not null default now(),
  unique (pengguna_id, ref)
);

create index resit_pengguna_tarikh_idx on public.resit (pengguna_id, tarikh desc);
create index resit_pengguna_kedai_idx on public.resit (pengguna_id, kedai);

-- =========================================================================
-- 4. Jadual item
-- =========================================================================
create table public.item (
  id uuid primary key default gen_random_uuid(),
  resit_id uuid not null references public.resit (id) on delete cascade,
  nama text not null,
  harga numeric(10, 2) not null,
  kategori text not null check (kategori in (
    'makanan', 'minuman', 'dapur', 'bayi', 'pakaian', 'perubatan',
    'elektronik', 'pendidikan', 'pengangkutan', 'utiliti', 'gayahidup', 'lain'
  )),
  pemilik text not null default 'bersama' check (pemilik in ('saya', 'pasangan', 'bersama')),
  susunan integer not null default 0
);

create index item_resit_id_idx on public.item (resit_id);
create index item_kategori_idx on public.item (kategori);

-- =========================================================================
-- 5. dikemas_pada automatik pada resit
-- =========================================================================
create function public.kemaskini_dikemas_pada()
returns trigger
language plpgsql
as $$
begin
  new.dikemas_pada = now();
  return new;
end;
$$;

create trigger resit_dikemas_pada
  before update on public.resit
  for each row
  execute function public.kemaskini_dikemas_pada();

-- =========================================================================
-- 6. Baris pengguna dicipta automatik selepas pendaftaran auth.users
--    (bukan dalam skop 04-DATA-MODEL.md secara eksplisit, tapi diperlukan
--    supaya jadual pengguna sentiasa ada baris sepadan — dicatat dalam
--    DEV-LOG semasa Fasa 7 dilaksanakan)
-- =========================================================================
create function public.cipta_profil_pengguna()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.pengguna (id, nama, emel)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'nama', split_part(new.email, '@', 1)),
    new.email
  );
  return new;
end;
$$;

create trigger selepas_daftar_auth_users
  after insert on auth.users
  for each row
  execute function public.cipta_profil_pengguna();

-- =========================================================================
-- 7. Row Level Security — WAJIB sebelum sebarang data dimasukkan
-- =========================================================================
alter table public.pengguna enable row level security;
alter table public.isi_rumah enable row level security;
alter table public.resit enable row level security;
alter table public.item enable row level security;

-- pengguna: baca & kemas kini profil sendiri sahaja
create policy pengguna_baca_sendiri on public.pengguna
  for select using (id = auth.uid());

create policy pengguna_kemaskini_sendiri on public.pengguna
  for update using (id = auth.uid());

-- isi_rumah: ahli isi rumah sahaja
create policy isi_rumah_baca on public.isi_rumah
  for select using (id = (select isi_rumah_id from public.pengguna where id = auth.uid()));

-- resit: mod solo — rekod sendiri; mod pasangan — rekod isi rumah yang sama
create policy resit_baca on public.resit
  for select using (
    pengguna_id = auth.uid()
    or (
      isi_rumah_id is not null
      and isi_rumah_id = (select isi_rumah_id from public.pengguna where id = auth.uid())
    )
  );

create policy resit_tambah on public.resit
  for insert with check (pengguna_id = auth.uid());

create policy resit_kemaskini on public.resit
  for update using (
    pengguna_id = auth.uid()
    or (
      isi_rumah_id is not null
      and isi_rumah_id = (select isi_rumah_id from public.pengguna where id = auth.uid())
    )
  );

create policy resit_padam on public.resit
  for delete using (
    pengguna_id = auth.uid()
    or (
      isi_rumah_id is not null
      and isi_rumah_id = (select isi_rumah_id from public.pengguna where id = auth.uid())
    )
  );

-- item: ikut kebenaran resit induknya
create policy item_baca on public.item
  for select using (
    exists (
      select 1 from public.resit r
      where r.id = item.resit_id
        and (
          r.pengguna_id = auth.uid()
          or (
            r.isi_rumah_id is not null
            and r.isi_rumah_id = (select isi_rumah_id from public.pengguna where id = auth.uid())
          )
        )
    )
  );

create policy item_tambah on public.item
  for insert with check (
    exists (
      select 1 from public.resit r
      where r.id = item.resit_id and r.pengguna_id = auth.uid()
    )
  );

create policy item_kemaskini on public.item
  for update using (
    exists (
      select 1 from public.resit r
      where r.id = item.resit_id
        and (
          r.pengguna_id = auth.uid()
          or (
            r.isi_rumah_id is not null
            and r.isi_rumah_id = (select isi_rumah_id from public.pengguna where id = auth.uid())
          )
        )
    )
  );

create policy item_padam on public.item
  for delete using (
    exists (
      select 1 from public.resit r
      where r.id = item.resit_id
        and (
          r.pengguna_id = auth.uid()
          or (
            r.isi_rumah_id is not null
            and r.isi_rumah_id = (select isi_rumah_id from public.pengguna where id = auth.uid())
          )
        )
    )
  );

-- =========================================================================
-- 8. Storage — bucket peribadi untuk gambar resit
-- =========================================================================
insert into storage.buckets (id, name, public)
values ('resit-gambar', 'resit-gambar', false)
on conflict (id) do nothing;

create policy resit_gambar_muat_naik on storage.objects
  for insert with check (
    bucket_id = 'resit-gambar'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy resit_gambar_baca on storage.objects
  for select using (
    bucket_id = 'resit-gambar'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy resit_gambar_padam on storage.objects
  for delete using (
    bucket_id = 'resit-gambar'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
