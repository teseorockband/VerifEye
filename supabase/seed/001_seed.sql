-- VerifEye — Seed de datos mock (50 productos)
-- IMPORTANTE: Datos de demostración para desarrollo. Requieren verificación
-- con fuentes primarias antes de cualquier publicación.

-- ──────────────────────────────────────────
-- FUENTES
-- ──────────────────────────────────────────

insert into sources (id, name, url, description, last_checked) values
  ('00000000-0000-0000-0000-000000000001', 'UN OHCHR Business Enterprise Database',
   'https://www.ohchr.org/en/hr-bodies/hrc/other-issues/business-and-settlements',
   'Base de datos de la ONU sobre empresas con actividades en asentamientos israelíes', '2024-01-01'),
  ('00000000-0000-0000-0000-000000000002', 'Who Profits Research Center',
   'https://whoprofits.org',
   'ONG israelí que documenta empresas con vínculos en el conflicto', '2024-01-01'),
  ('00000000-0000-0000-0000-000000000003', 'BDS Movement Campaigns',
   'https://bdsmovement.net/act-now/campaigns',
   'Campañas documentadas del movimiento BDS con fuentes citadas', '2024-01-01'),
  ('00000000-0000-0000-0000-000000000004', 'Open Food Facts',
   'https://world.openfoodfacts.org',
   'Base de datos abierta de productos alimentarios', '2024-01-01'),
  ('00000000-0000-0000-0000-000000000005', 'Reuters Corporate Research',
   'https://www.reuters.com',
   'Informes periodísticos verificados sobre relaciones corporativas', '2024-01-01');

-- ──────────────────────────────────────────
-- EMPRESAS
-- ──────────────────────────────────────────

insert into companies (id, name, country, parent_company_id, website) values
  -- Sin vinculo
  ('10000000-0000-0000-0000-000000000001', 'Nestlé S.A.', 'CH', null, 'https://www.nestle.com'),
  ('10000000-0000-0000-0000-000000000002', 'Unilever PLC', 'GB', null, 'https://www.unilever.com'),
  ('10000000-0000-0000-0000-000000000003', 'Procter & Gamble', 'US', null, 'https://www.pg.com'),
  ('10000000-0000-0000-0000-000000000004', 'L''Oréal S.A.', 'FR', null, 'https://www.loreal.com'),
  ('10000000-0000-0000-0000-000000000005', 'Johnson & Johnson', 'US', null, 'https://www.jnj.com'),
  -- Fabricantes israelíes
  ('10000000-0000-0000-0000-000000000006', 'Strauss Group', 'IL', null, 'https://www.strauss-group.com'),
  ('10000000-0000-0000-0000-000000000007', 'Osem Group', 'IL', null, 'https://www.osem.co.il'),
  ('10000000-0000-0000-0000-000000000008', 'Ahava Dead Sea Laboratories', 'IL', null, 'https://www.ahava.com'),
  ('10000000-0000-0000-0000-000000000009', 'Soda-Club / SodaStream', 'IL', null, 'https://www.sodastream.com'),
  ('10000000-0000-0000-0000-000000000010', 'Teva Pharmaceutical', 'IL', null, 'https://www.tevapharm.com'),
  -- Subsidiarias / vínculos directos
  ('10000000-0000-0000-0000-000000000011', 'SodaStream (PepsiCo subsidiary)', 'US', '10000000-0000-0000-0000-000000000009', 'https://www.sodastream.com'),
  ('10000000-0000-0000-0000-000000000012', 'HP Inc.', 'US', null, 'https://www.hp.com'),
  ('10000000-0000-0000-0000-000000000013', 'Motorola Solutions', 'US', null, 'https://www.motorolasolutions.com'),
  ('10000000-0000-0000-0000-000000000014', 'Caterpillar Inc.', 'US', null, 'https://www.caterpillar.com'),
  -- Alternativas limpias
  ('10000000-0000-0000-0000-000000000015', 'Ecoegg Ltd', 'GB', null, 'https://www.ecoegg.com'),
  ('10000000-0000-0000-0000-000000000016', 'Alverde (DM)', 'DE', null, 'https://www.dm.de'),
  ('10000000-0000-0000-0000-000000000017', 'Lidl Private Label', 'DE', null, 'https://www.lidl.com'),
  ('10000000-0000-0000-0000-000000000018', 'Auchan Private Label', 'FR', null, 'https://www.auchan.fr'),
  ('10000000-0000-0000-0000-000000000019', 'Mercadona (Hacendado)', 'ES', null, 'https://www.mercadona.es'),
  ('10000000-0000-0000-0000-000000000020', 'Planeta Huerto', 'ES', null, 'https://www.planetahuerto.es');

-- ──────────────────────────────────────────
-- PRODUCTOS (50 registros)
-- ──────────────────────────────────────────

insert into products (id, ean, name, brand, category, country_of_origin, company_id, link_level, link_summary, last_verified) values

-- ── ALIMENTACIÓN con vínculo ────────────────────────────────────────────────
('20000000-0000-0000-0000-000000000001', '7290000066318', 'Elite Coffee Ground', 'Elite', 'food', 'IL',
 '10000000-0000-0000-0000-000000000006', 'produced_in_israel',
 'Fabricado en Israel por Strauss Group. Producción primaria en territorio israelí.', '2024-01-15'),

('20000000-0000-0000-0000-000000000002', '7290010939443', 'Bamba Peanut Snack', 'Osem', 'food', 'IL',
 '10000000-0000-0000-0000-000000000007', 'produced_in_israel',
 'Producto icónico israelí fabricado por Osem Group en Israel.', '2024-01-15'),

('20000000-0000-0000-0000-000000000003', '7290010392735', 'Telma Couscous', 'Telma', 'food', 'IL',
 '10000000-0000-0000-0000-000000000007', 'produced_in_israel',
 'Marca Telma es propiedad de Osem Group, producción en Israel.', '2024-01-10'),

('20000000-0000-0000-0000-000000000004', '7290000066240', 'Strauss Milky Chocolate Pudding', 'Strauss', 'food', 'IL',
 '10000000-0000-0000-0000-000000000006', 'produced_in_israel',
 'Producido por Strauss Group en Israel.', '2024-01-10'),

('20000000-0000-0000-0000-000000000005', '7290003695008', 'Sabra Hummus Classic', 'Sabra', 'food', 'US',
 '10000000-0000-0000-0000-000000000006', 'direct',
 'Sabra es joint venture al 50% entre Strauss Group (Israel) y PepsiCo.', '2024-01-20'),

-- ── COSMÉTICA con vínculo ───────────────────────────────────────────────────
('20000000-0000-0000-0000-000000000006', '7290101342036', 'AHAVA Dead Sea Mud Mask', 'AHAVA', 'cosmetics', 'IL',
 '10000000-0000-0000-0000-000000000008', 'produced_in_settlements',
 'AHAVA extrae minerales del Mar Muerto en territorio palestino ocupado (Mitzpe Shalem). Incluida en lista UN OHCHR.', '2024-01-15'),

('20000000-0000-0000-0000-000000000007', '7290101342012', 'AHAVA Age Control Moisturizer', 'AHAVA', 'cosmetics', 'IL',
 '10000000-0000-0000-0000-000000000008', 'produced_in_settlements',
 'Misma empresa y zona de producción que AHAVA Mud Mask. Fuente: UN OHCHR.', '2024-01-15'),

('20000000-0000-0000-0000-000000000008', '7290101342050', 'AHAVA Mineral Hand Cream', 'AHAVA', 'cosmetics', 'IL',
 '10000000-0000-0000-0000-000000000008', 'produced_in_settlements',
 'Extraído de asentamiento de Mitzpe Shalem. Documentado por Who Profits.', '2024-01-15'),

-- ── TECNOLOGÍA con vínculo ──────────────────────────────────────────────────
('20000000-0000-0000-0000-000000000009', '0193905495048', 'HP LaserJet M110we', 'HP', 'technology', 'US',
 '10000000-0000-0000-0000-000000000012', 'direct',
 'HP Inc. proporciona tecnología biométrica e impresión a ministerios israelíes. Contratos gubernamentales documentados.', '2024-01-12'),

('20000000-0000-0000-0000-000000000010', '0194793700959', 'HP Laptop 15s', 'HP', 'technology', 'US',
 '10000000-0000-0000-0000-000000000012', 'direct',
 'Misma empresa matriz HP Inc. Vínculo documentado por Who Profits.', '2024-01-12'),

('20000000-0000-0000-0000-000000000011', '0854590005061', 'Motorola Moto G54', 'Motorola', 'technology', 'US',
 '10000000-0000-0000-0000-000000000013', 'direct',
 'Motorola Solutions provee comunicaciones a fuerzas de seguridad israelíes desde 2006. Documentado por Who Profits.', '2024-01-18'),

-- ── ALIMENTACIÓN sin vínculo ────────────────────────────────────────────────
('20000000-0000-0000-0000-000000000012', '8410376043440', 'Hacendado Garbanzos Cocidos', 'Hacendado', 'food', 'ES',
 '10000000-0000-0000-0000-000000000019', 'none', null, '2024-01-01'),

('20000000-0000-0000-0000-000000000013', '4056489112137', 'Lidl Bio Arroz Integral', 'Bio Organic', 'food', 'DE',
 '10000000-0000-0000-0000-000000000017', 'none', null, '2024-01-01'),

('20000000-0000-0000-0000-000000000014', '3256220084748', 'Auchan Lentilles Vertes', 'Auchan', 'food', 'FR',
 '10000000-0000-0000-0000-000000000018', 'none', null, '2024-01-01'),

('20000000-0000-0000-0000-000000000015', '4056489034766', 'Lidl Pâtes Penne Rigate', 'Combino', 'food', 'IT',
 '10000000-0000-0000-0000-000000000017', 'none', null, '2024-01-01'),

-- ── SodaStream (vínculo indirecto via PepsiCo) ──────────────────────────────
('20000000-0000-0000-0000-000000000016', '7290108820003', 'SodaStream Terra Sparkling Water Maker', 'SodaStream', 'household', 'IL',
 '10000000-0000-0000-0000-000000000009', 'produced_in_israel',
 'Fabricado en Israel. PepsiCo adquirió SodaStream en 2018. Planta principal en Beer Sheva, Israel.', '2024-01-20'),

('20000000-0000-0000-0000-000000000017', '7290108820027', 'SodaStream CO2 Cylinder 60L', 'SodaStream', 'household', 'IL',
 '10000000-0000-0000-0000-000000000009', 'produced_in_israel',
 'Accesorio fabricado en Israel por SodaStream (PepsiCo).', '2024-01-20'),

-- ── COSMÉTICA sin vínculo ───────────────────────────────────────────────────
('20000000-0000-0000-0000-000000000018', '4010355564573', 'Alverde Feuchtigkeitscreme', 'Alverde', 'cosmetics', 'DE',
 '10000000-0000-0000-0000-000000000016', 'none', null, '2024-01-01'),

('20000000-0000-0000-0000-000000000019', '4010355022288', 'Alverde Shampoo Aloe Vera', 'Alverde', 'cosmetics', 'DE',
 '10000000-0000-0000-0000-000000000016', 'none', null, '2024-01-01'),

('20000000-0000-0000-0000-000000000020', '8470001625908', 'Mercadona Crema Hidratante', 'Deliplus', 'cosmetics', 'ES',
 '10000000-0000-0000-0000-000000000019', 'none', null, '2024-01-01'),

-- ── ALIMENTACIÓN — vínculo indirecto (Nestlé) ───────────────────────────────
('20000000-0000-0000-0000-000000000021', '7613035352988', 'Nescafé Classic Instant Coffee', 'Nescafé', 'food', 'CH',
 '10000000-0000-0000-0000-000000000001', 'indirect',
 'Nestlé tiene participación en Osem Group (Israel). Vínculo indirecto via subsidiaria israelí.', '2024-01-22'),

('20000000-0000-0000-0000-000000000022', '7613036256582', 'KitKat 4 Fingers', 'KitKat', 'food', 'GB',
 '10000000-0000-0000-0000-000000000001', 'indirect',
 'Nestlé tiene participación en Osem Group. Vínculo indirecto.', '2024-01-22'),

('20000000-0000-0000-0000-000000000023', '7613035402195', 'Nestlé Milo Powder', 'Milo', 'food', 'CH',
 '10000000-0000-0000-0000-000000000001', 'indirect',
 'Misma empresa matriz Nestlé con participación en Osem.', '2024-01-22'),

-- ── TECNOLOGÍA sin vínculo ──────────────────────────────────────────────────
('20000000-0000-0000-0000-000000000024', '4948570174866', 'Sony WH-1000XM5 Headphones', 'Sony', 'technology', 'JP',
 null, 'none', null, '2024-01-01'),

('20000000-0000-0000-0000-000000000025', '4549292160468', 'Sony A7 IV Camera', 'Sony', 'technology', 'JP',
 null, 'none', null, '2024-01-01'),

('20000000-0000-0000-0000-000000000026', '0194252679685', 'Samsung Galaxy S24', 'Samsung', 'technology', 'KR',
 null, 'none', null, '2024-01-01'),

-- ── MODA ────────────────────────────────────────────────────────────────────
('20000000-0000-0000-0000-000000000027', '2900002019459', 'Zara Basic T-Shirt', 'Zara', 'fashion', 'ES',
 null, 'none', null, '2024-01-01'),

('20000000-0000-0000-0000-000000000028', '2900002076940', 'Zara Slim Jeans', 'Zara', 'fashion', 'ES',
 null, 'none', null, '2024-01-01'),

-- ── HOGAR ────────────────────────────────────────────────────────────────────
('20000000-0000-0000-0000-000000000029', '0036000291452', 'Swiffer WetJet Starter Kit', 'Swiffer', 'household', 'US',
 '10000000-0000-0000-0000-000000000003', 'none', null, '2024-01-01'),

('20000000-0000-0000-0000-000000000030', '4015400545354', 'Fairy Platinum Dishwasher Tablets', 'Fairy', 'household', 'DE',
 '10000000-0000-0000-0000-000000000003', 'none', null, '2024-01-01'),

-- ── MÁS ALIMENTACIÓN con vínculo ────────────────────────────────────────────
('20000000-0000-0000-0000-000000000031', '7290106620014', 'Yotvata Chocolate Milk', 'Yotvata', 'food', 'IL',
 null, 'produced_in_israel',
 'Marca de lácteos israelí, producción en Israel (kibbutz Yotvata).', '2024-01-10'),

('20000000-0000-0000-0000-000000000032', '7290003153109', 'Tivall Veggie Schnitzel', 'Tivall', 'food', 'IL',
 '10000000-0000-0000-0000-000000000001', 'produced_in_israel',
 'Tivall es subsidiaria de Nestlé, producción en Israel.', '2024-01-22'),

-- ── COSMÉTICA — L''Oréal (vínculo indirecto) ────────────────────────────────
('20000000-0000-0000-0000-000000000033', '3600541174719', 'L''Oréal Elvive Shampoo', 'L''Oréal', 'cosmetics', 'FR',
 '10000000-0000-0000-0000-000000000004', 'indirect',
 'L''Oréal adquirió Yves Saint Laurent Beauté que opera en Israel. Vínculo indirecto via operaciones comerciales.', '2024-01-18'),

('20000000-0000-0000-0000-000000000034', '3600541174733', 'Garnier Fructis Shampoo', 'Garnier', 'cosmetics', 'FR',
 '10000000-0000-0000-0000-000000000004', 'indirect',
 'Garnier es marca de L''Oréal. Mismo vínculo indirecto via L''Oréal Israel.', '2024-01-18'),

('20000000-0000-0000-0000-000000000035', '3600541174740', 'Maybelline SuperStay Foundation', 'Maybelline', 'cosmetics', 'US',
 '10000000-0000-0000-0000-000000000004', 'indirect',
 'Maybelline es subsidiaria de L''Oréal. Mismo vínculo indirecto.', '2024-01-18'),

-- ── ALIMENTACIÓN extra sin vínculo ──────────────────────────────────────────
('20000000-0000-0000-0000-000000000036', '8410188011122', 'Gallo Arroz Redondo', 'Gallo', 'food', 'ES',
 null, 'none', null, '2024-01-01'),

('20000000-0000-0000-0000-000000000037', '8480000593078', 'Carrefour Aceite de Oliva', 'Carrefour', 'food', 'ES',
 null, 'none', null, '2024-01-01'),

('20000000-0000-0000-0000-000000000038', '8000500037560', 'Barilla Spaghetti No. 5', 'Barilla', 'food', 'IT',
 null, 'none', null, '2024-01-01'),

('20000000-0000-0000-0000-000000000039', '4003014010403', 'Tchibo Espresso Milano', 'Tchibo', 'food', 'DE',
 null, 'none', null, '2024-01-01'),

('20000000-0000-0000-0000-000000000040', '5000112637922', 'Coca-Cola Original 330ml', 'Coca-Cola', 'food', 'US',
 null, 'none', null, '2024-01-01'),

-- ── TECNOLOGÍA vínculo directo (Caterpillar) ────────────────────────────────
('20000000-0000-0000-0000-000000000041', '0716112855477', 'CAT S75 Smartphone', 'CAT', 'technology', 'US',
 '10000000-0000-0000-0000-000000000014', 'direct',
 'Caterpillar provee maquinaria de demolición usada en territorio palestino. Documentado por Who Profits y Amnesty International.', '2024-01-25'),

-- ── HOGAR adicional ──────────────────────────────────────────────────────────
('20000000-0000-0000-0000-000000000042', '8410375030339', 'Domestos Regular Bleach', 'Domestos', 'household', 'ES',
 '10000000-0000-0000-0000-000000000002', 'none', null, '2024-01-01'),

('20000000-0000-0000-0000-000000000043', '8712561498003', 'Dove Original Bar Soap', 'Dove', 'cosmetics', 'NL',
 '10000000-0000-0000-0000-000000000002', 'none', null, '2024-01-01'),

('20000000-0000-0000-0000-000000000044', '8712566310082', 'AXE Black Deodorant', 'AXE', 'cosmetics', 'NL',
 '10000000-0000-0000-0000-000000000002', 'none', null, '2024-01-01'),

-- ── Más Israel ───────────────────────────────────────────────────────────────
('20000000-0000-0000-0000-000000000045', '7290106213025', 'Tnuva Butter 200g', 'Tnuva', 'food', 'IL',
 null, 'produced_in_israel',
 'Tnuva es el mayor grupo lácteo de Israel. Producción íntegramente en Israel.', '2024-01-10'),

('20000000-0000-0000-0000-000000000046', '7290000011585', 'Wissotzky Green Tea', 'Wissotzky', 'food', 'IL',
 null, 'produced_in_israel',
 'Empresa fundada en Israel, producción en Israel.', '2024-01-10'),

('20000000-0000-0000-0000-000000000047', '7290010664433', 'Sunfrost Frozen Corn', 'Sunfrost', 'food', 'IL',
 null, 'produced_in_israel',
 'Marca israelí de congelados.', '2024-01-10'),

-- ── Alternativas cosméticas limpias ─────────────────────────────────────────
('20000000-0000-0000-0000-000000000048', '5052197050325', 'Ecoegg Laundry Egg 70 Washes', 'Ecoegg', 'household', 'GB',
 '10000000-0000-0000-0000-000000000015', 'none', null, '2024-01-01'),

('20000000-0000-0000-0000-000000000049', '8436567310023', 'Azalea Champú Sólido Romero', 'Azalea', 'cosmetics', 'ES',
 null, 'none', null, '2024-01-01'),

('20000000-0000-0000-0000-000000000050', '8425552134533', 'La Chinata Jabón Natural Oliva', 'La Chinata', 'cosmetics', 'ES',
 null, 'none', null, '2024-01-01');

-- ──────────────────────────────────────────
-- RELACIONES (vínculos documentados)
-- ──────────────────────────────────────────

insert into relationships (subject_type, subject_id, object_type, object_id, link_type, description, source_id, verified_at) values

-- AHAVA → asentamientos (UN OHCHR)
('product', '20000000-0000-0000-0000-000000000006', 'country', 'IL-settlements',
 'produced_in_settlements',
 'AHAVA extrae recursos naturales (minerales del Mar Muerto) en el asentamiento de Mitzpe Shalem (Cisjordania ocupada). Su dirección registrada es en el asentamiento.',
 '00000000-0000-0000-0000-000000000001', '2024-01-15'),

('product', '20000000-0000-0000-0000-000000000007', 'country', 'IL-settlements',
 'produced_in_settlements',
 'Mismo fabricante AHAVA. Recursos extraídos en territorio ocupado.',
 '00000000-0000-0000-0000-000000000001', '2024-01-15'),

('product', '20000000-0000-0000-0000-000000000008', 'country', 'IL-settlements',
 'produced_in_settlements',
 'Mismo fabricante AHAVA. Documentado por Who Profits Research Center.',
 '00000000-0000-0000-0000-000000000002', '2024-01-15'),

-- HP → contratos gubernamentales israelíes (Who Profits)
('company', '10000000-0000-0000-0000-000000000012', 'country', 'IL',
 'direct',
 'HP Inc. suministra tecnología de impresión de permisos y control biométrico a la administración civil israelí en Cisjordania. Documentado por Who Profits.',
 '00000000-0000-0000-0000-000000000002', '2024-01-12'),

-- Sabra → Strauss joint venture
('product', '20000000-0000-0000-0000-000000000005', 'company', '10000000-0000-0000-0000-000000000006',
 'direct',
 'Sabra Dipping Company es una joint venture al 50% entre PepsiCo y Strauss Group (Israel). Strauss tiene participación mayoritaria en la marca.',
 '00000000-0000-0000-0000-000000000005', '2024-01-20'),

-- Nestlé → Osem participación
('company', '10000000-0000-0000-0000-000000000001', 'company', '10000000-0000-0000-0000-000000000007',
 'indirect',
 'Nestlé posee aproximadamente el 53.8% de Osem Group, el mayor grupo de alimentación israelí. Fuente: Reuters / informes anuales Nestlé.',
 '00000000-0000-0000-0000-000000000005', '2024-01-22'),

-- Motorola → comunicaciones militares israelíes
('company', '10000000-0000-0000-0000-000000000013', 'country', 'IL',
 'direct',
 'Motorola Solutions proporciona sistemas de comunicación (radios, infraestructura) a las Fuerzas de Defensa de Israel desde al menos 2006. Documentado extensamente por Who Profits.',
 '00000000-0000-0000-0000-000000000002', '2024-01-18'),

-- Caterpillar → demoliciones
('company', '10000000-0000-0000-0000-000000000014', 'country', 'IL',
 'direct',
 'Maquinaria de Caterpillar (especialmente D9 bulldozers) es usada por el ejército israelí en demoliciones de viviendas palestinas. Documentado por Amnesty International y Human Rights Watch.',
 '00000000-0000-0000-0000-000000000003', '2024-01-25'),

-- L''Oréal → operaciones en Israel
('company', '10000000-0000-0000-0000-000000000004', 'country', 'IL',
 'indirect',
 'L''Oréal opera filial comercial en Israel (L''Oréal Israel). No produce en asentamientos pero mantiene actividad comercial regular.',
 '00000000-0000-0000-0000-000000000005', '2024-01-18');

-- ──────────────────────────────────────────
-- ALTERNATIVAS SUGERIDAS
-- ──────────────────────────────────────────

insert into alternatives (product_id, alternative_product_id, reason) values
-- AHAVA → Alverde o Azalea
('20000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000018', 'Crema hidratante de origen alemán, certificada natural, sin vínculos detectados.'),
('20000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000049', 'Cosmética natural española, producción local.'),
('20000000-0000-0000-0000-000000000007', '20000000-0000-0000-0000-000000000019', 'Alternativa de cosmética española Alverde, sin vínculos.'),
('20000000-0000-0000-0000-000000000008', '20000000-0000-0000-0000-000000000050', 'Jabón natural de La Chinata (España), aceite de oliva.'),
-- SodaStream → sin alternativa directa clara (producto muy específico)
-- HP → Sony
('20000000-0000-0000-0000-000000000009', '20000000-0000-0000-0000-000000000024', 'Sony no tiene vínculos documentados con Israel.'),
-- Nestlé → Tchibo / Gallo
('20000000-0000-0000-0000-000000000021', '20000000-0000-0000-0000-000000000039', 'Café Tchibo, empresa alemana sin vínculos detectados.'),
('20000000-0000-0000-0000-000000000022', '20000000-0000-0000-0000-000000000036', 'Alternativa española sin vínculos.'),
-- L''Oréal → Alverde
('20000000-0000-0000-0000-000000000033', '20000000-0000-0000-0000-000000000019', 'Champú Alverde (DM), cosmética natural alemana sin vínculos.'),
('20000000-0000-0000-0000-000000000034', '20000000-0000-0000-0000-000000000019', 'Alternativa Alverde para Garnier Fructis.');
