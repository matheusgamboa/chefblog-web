-- Limpar dados existentes para evitar duplicidade (Opcional, mas útil para o seed)
-- DELETE FROM public.steps;
-- DELETE FROM public.ingredients;
-- DELETE FROM public.recipe_categories;
-- DELETE FROM public.recipes WHERE id > 1;

DO $$
DECLARE
  r_id bigint;
  cat_populares bigint := 1;
  cat_italiana bigint := 2;
  cat_fitness bigint := 3;
  cat_sobremesas bigint := 4;
  cat_vegetariana bigint := 5;
BEGIN

  -- 1. Fettuccine Alfredo
  INSERT INTO public.recipes (title, description, image_url, time_minutes, difficulty, calories, rating, slug)
  VALUES ('Fettuccine Alfredo', 'Clássico italiano cremoso com manteiga e parmesão.', 'https://images.unsplash.com/photo-1645112481338-3560e99b3521?q=80&w=1470&auto=format&fit=crop', 20, 'Fácil', 450, 4.7, 'fettuccine-alfredo')
  RETURNING id INTO r_id;
  INSERT INTO public.recipe_categories (recipe_id, category_id) VALUES (r_id, cat_italiana), (r_id, cat_populares);
  INSERT INTO public.ingredients (recipe_id, name, amount, icon) VALUES (r_id, 'Fettuccine', '500g', 'restaurant'), (r_id, 'Manteiga', '100g', 'opacity'), (r_id, 'Parmesão', '200g', 'cheese');
  INSERT INTO public.steps (recipe_id, order_index, title, description, xp_reward, timer_seconds) VALUES (r_id, 1, 'Cozinhar Massa', 'Cozinhe em água salgada até ficar al dente.', 10, 600);

  -- 2. Lasanha à Bolonhesa
  INSERT INTO public.recipes (title, description, image_url, time_minutes, difficulty, calories, rating, slug)
  VALUES ('Lasanha à Bolonhesa', 'Lasanha tradicional com molho de carne e bechamel.', 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=1632&auto=format&fit=crop', 60, 'Intermediário', 600, 4.9, 'lasanha-bolonhesa')
  RETURNING id INTO r_id;
  INSERT INTO public.recipe_categories (recipe_id, category_id) VALUES (r_id, cat_italiana);
  INSERT INTO public.ingredients (recipe_id, name, amount, icon) VALUES (r_id, 'Massa de Lasanha', '1 pacote', 'layers'), (r_id, 'Carne Moída', '500g', 'set_meal');

  -- 3. Risoto de Cogumelos
  INSERT INTO public.recipes (title, description, image_url, time_minutes, difficulty, calories, rating, slug)
  VALUES ('Risoto de Cogumelos', 'Risoto cremoso com mix de cogumelos frescos.', 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=1470&auto=format&fit=crop', 40, 'Intermediário', 380, 4.6, 'risoto-cogumelos')
  RETURNING id INTO r_id;
  INSERT INTO public.recipe_categories (recipe_id, category_id) VALUES (r_id, cat_vegetariana), (r_id, cat_italiana);

  -- 4. Frango com Batata Doce
  INSERT INTO public.recipes (title, description, image_url, time_minutes, difficulty, calories, rating, slug)
  VALUES ('Frango com Batata Doce', 'O clássico do mundo fitness, equilibrado e nutritivo.', 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?q=80&w=1470&auto=format&fit=crop', 30, 'Fácil', 320, 4.5, 'frango-batata-doce')
  RETURNING id INTO r_id;
  INSERT INTO public.recipe_categories (recipe_id, category_id) VALUES (r_id, cat_fitness);

  -- 5. Salada de Quinoa
  INSERT INTO public.recipes (title, description, image_url, time_minutes, difficulty, calories, rating, slug)
  VALUES ('Salada de Quinoa', 'Salada refrescante e rica em proteínas vegetais.', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1470&auto=format&fit=crop', 15, 'Fácil', 250, 4.8, 'salada-quinoa')
  RETURNING id INTO r_id;
  INSERT INTO public.recipe_categories (recipe_id, category_id) VALUES (r_id, cat_fitness), (r_id, cat_vegetariana);

  -- 6. Torta de Limão
  INSERT INTO public.recipes (title, description, image_url, time_minutes, difficulty, calories, rating, slug)
  VALUES ('Torta de Limão', 'Equilíbrio perfeito entre o azedinho e o doce.', 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?q=80&w=1374&auto=format&fit=crop', 45, 'Intermediário', 350, 4.9, 'torta-de-limao')
  RETURNING id INTO r_id;
  INSERT INTO public.recipe_categories (recipe_id, category_id) VALUES (r_id, cat_sobremesas);

  -- 7. Petit Gâteau
  INSERT INTO public.recipes (title, description, image_url, time_minutes, difficulty, calories, rating, slug)
  VALUES ('Petit Gâteau', 'Bolo de chocolate com recheio cremoso irresistível.', 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=1470&auto=format&fit=crop', 15, 'Difícil', 420, 5.0, 'petit-gateau')
  RETURNING id INTO r_id;
  INSERT INTO public.recipe_categories (recipe_id, category_id) VALUES (r_id, cat_sobremesas), (r_id, cat_populares);

  -- 8. Moqueca de Banana da Terra
  INSERT INTO public.recipes (title, description, image_url, time_minutes, difficulty, calories, rating, slug)
  VALUES ('Moqueca de Banana da Terra', 'Sabor brasileiro em uma versão vegetariana deliciosa.', 'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=1471&auto=format&fit=crop', 40, 'Intermediário', 280, 4.7, 'moqueca-banana')
  RETURNING id INTO r_id;
  INSERT INTO public.recipe_categories (recipe_id, category_id) VALUES (r_id, cat_vegetariana);

  -- 9. Hambúrguer Artesanal
  INSERT INTO public.recipes (title, description, image_url, time_minutes, difficulty, calories, rating, slug)
  VALUES ('Hambúrguer Artesanal', 'O melhor burger que você vai fazer em casa.', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1398&auto=format&fit=crop', 25, 'Fácil', 550, 4.8, 'burger-artesanal')
  RETURNING id INTO r_id;
  INSERT INTO public.recipe_categories (recipe_id, category_id) VALUES (r_id, cat_populares);

  -- 10. Sushi Variado
  INSERT INTO public.recipes (title, description, image_url, time_minutes, difficulty, calories, rating, slug)
  VALUES ('Sushi Variado', 'Aprenda os segredos para um sushi perfeito.', 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1470&auto=format&fit=crop', 90, 'Difícil', 300, 4.9, 'sushi-variado')
  RETURNING id INTO r_id;
  INSERT INTO public.recipe_categories (recipe_id, category_id) VALUES (r_id, cat_populares);

  -- 11. Omelete de Claras
  INSERT INTO public.recipes (title, description, image_url, time_minutes, difficulty, calories, rating, slug)
  VALUES ('Omelete de Claras', 'Proteína pura para começar o dia com energia.', 'https://images.unsplash.com/photo-1510627489930-0c1b0baead1c?q=80&w=1470&auto=format&fit=crop', 10, 'Fácil', 180, 4.4, 'omelete-de-claras')
  RETURNING id INTO r_id;
  INSERT INTO public.recipe_categories (recipe_id, category_id) VALUES (r_id, cat_fitness);

  -- 12. Estrogonofe de Grão de Bico
  INSERT INTO public.recipes (title, description, image_url, time_minutes, difficulty, calories, rating, slug)
  VALUES ('Estrogonofe de Grão de Bico', 'Versão nutritiva e reconfortante do clássico.', 'https://images.unsplash.com/photo-1540660290370-8af90a4364ba?q=80&w=1374&auto=format&fit=crop', 30, 'Fácil', 310, 4.6, 'estrogonofe-grao-bico')
  RETURNING id INTO r_id;
  INSERT INTO public.recipe_categories (recipe_id, category_id) VALUES (r_id, cat_vegetariana);

  -- 13. Brownie de Chocolate
  INSERT INTO public.recipes (title, description, image_url, time_minutes, difficulty, calories, rating, slug)
  VALUES ('Brownie de Chocolate', 'Crocante por fora, úmido por dentro.', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=1471&auto=format&fit=crop', 35, 'Fácil', 380, 4.8, 'brownie-chocolate')
  RETURNING id INTO r_id;
  INSERT INTO public.recipe_categories (recipe_id, category_id) VALUES (r_id, cat_sobremesas);

  -- 14. Poke de Atum
  INSERT INTO public.recipes (title, description, image_url, time_minutes, difficulty, calories, rating, slug)
  VALUES ('Poke de Atum', 'Prato havaiano fresco e completo.', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1480&auto=format&fit=crop', 20, 'Fácil', 350, 4.7, 'poke-de-atum')
  RETURNING id INTO r_id;
  INSERT INTO public.recipe_categories (recipe_id, category_id) VALUES (r_id, cat_populares), (r_id, cat_fitness);

  -- 15. Pizza Margherita
  INSERT INTO public.recipes (title, description, image_url, time_minutes, difficulty, calories, rating, slug)
  VALUES ('Pizza Margherita', 'A simplicidade italiana em forma de pizza.', 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?q=80&w=1471&auto=format&fit=crop', 40, 'Intermediário', 450, 4.9, 'pizza-margherita')
  RETURNING id INTO r_id;
  INSERT INTO public.recipe_categories (recipe_id, category_id) VALUES (r_id, cat_italiana);

  -- 16. Berinjela à Parmegiana
  INSERT INTO public.recipes (title, description, image_url, time_minutes, difficulty, calories, rating, slug)
  VALUES ('Berinjela à Parmegiana', 'Camadas de sabor sem carne.', 'https://images.unsplash.com/photo-1625938146369-adc83368bda7?q=80&w=1325&auto=format&fit=crop', 50, 'Intermediário', 320, 4.5, 'berinjela-parmegiana')
  RETURNING id INTO r_id;
  INSERT INTO public.recipe_categories (recipe_id, category_id) VALUES (r_id, cat_italiana), (r_id, cat_vegetariana);

  -- 17. Smoothie de Frutas
  INSERT INTO public.recipes (title, description, image_url, time_minutes, difficulty, calories, rating, slug)
  VALUES ('Smoothie de Frutas', 'Batido energético para qualquer hora.', 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?q=80&w=1470&auto=format&fit=crop', 5, 'Fácil', 150, 4.3, 'smoothie-de-frutas')
  RETURNING id INTO r_id;
  INSERT INTO public.recipe_categories (recipe_id, category_id) VALUES (r_id, cat_fitness);

  -- 18. Pudim de Leite
  INSERT INTO public.recipes (title, description, image_url, time_minutes, difficulty, calories, rating, slug)
  VALUES ('Pudim de Leite', 'O clássico preferido dos domingos.', 'https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?q=80&w=1470&auto=format&fit=crop', 90, 'Intermediário', 400, 4.9, 'pudim-de-leite')
  RETURNING id INTO r_id;
  INSERT INTO public.recipe_categories (recipe_id, category_id) VALUES (r_id, cat_sobremesas);

  -- 19. Tacos de Carne
  INSERT INTO public.recipes (title, description, image_url, time_minutes, difficulty, calories, rating, slug)
  VALUES ('Tacos de Carne', 'Fiesta mexicana direto na sua cozinha.', 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=1380&auto=format&fit=crop', 30, 'Fácil', 420, 4.7, 'tacos-de-carne')
  RETURNING id INTO r_id;
  INSERT INTO public.recipe_categories (recipe_id, category_id) VALUES (r_id, cat_populares);

  -- 20. Cheesecake de Frutas
  INSERT INTO public.recipes (title, description, image_url, time_minutes, difficulty, calories, rating, slug)
  VALUES ('Cheesecake de Frutas', 'Sobremesa sofisticada e refrescante.', 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=1470&auto=format&fit=crop', 120, 'Difícil', 450, 4.8, 'cheesecake-frutas')
  RETURNING id INTO r_id;
  INSERT INTO public.recipe_categories (recipe_id, category_id) VALUES (r_id, cat_sobremesas);

END $$;
