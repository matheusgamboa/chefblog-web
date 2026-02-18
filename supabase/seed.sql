-- Insert Recipes
INSERT INTO public.recipes (title, description, image_url, time_minutes, difficulty, calories, rating, is_featured, slug)
VALUES 
(
  'Salmão Mediterrâneo com Crosta de Ervas',
  'Uma explosão de sabores frescos do Mediterrâneo. Filé de salmão suculento com uma crosta crocante de ervas frescas e limão siciliano.',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBnoOh6B3NShAujBPFpO-VtbXXatnotLr4Ih6y4V1pbWO8eO_nFwlMx2sjg3ccPxq20zbgr7ul1jnvmVemqDGGm0jH8vww-pixNtP6x9kGq36wzNSUbMua2dH5ODpXZQi6YJZDRd7ejCHZWLrlGgrCsYXj-QzGfyA3TxgAI4XaZCNuimtAaMhjL1g1fnSO22WzMpe6JZlzXHYIiyL4M-Ixt-atT6iJ0RudsP4I5w-dS9QLGXbuLHgwbWnX8JD9eRF6nxmI6SGWSDGI_',
  25,
  'Intermediário',
  340,
  4.8,
  true,
  'salmao-mediterraneo'
);

-- Get the ID of the inserted recipe (assuming it's the first one, but let's use a variable or subquery in a real script. For now, assuming ID 1 or using returning)
-- Since we can't easily capture the ID in a simple SQL script for the user to run without PL/pgSQL, we'll assume ID 1 for simplicity if the table was empty, or we can look it up.
-- Let's use a DO block for safety.

DO $$
DECLARE
  recipe_id bigint;
  cat_populares bigint;
  cat_italiana bigint;
BEGIN
  -- Get Recipe ID
  SELECT id INTO recipe_id FROM public.recipes WHERE title = 'Salmão Mediterrâneo com Crosta de Ervas' LIMIT 1;
  
  -- Get Category IDs
  SELECT id INTO cat_populares FROM public.categories WHERE slug = 'populares';
  SELECT id INTO cat_italiana FROM public.categories WHERE slug = 'italiana';

  -- Insert Recipe Categories
  INSERT INTO public.recipe_categories (recipe_id, category_id) VALUES (recipe_id, cat_populares);

  -- Insert Ingredients
  INSERT INTO public.ingredients (recipe_id, name, amount, icon) VALUES
  (recipe_id, 'Filé de Salmão', '2 unidades (400g)', 'set_meal'),
  (recipe_id, 'Limão Siciliano', '1 unidade', 'nutrition'),
  (recipe_id, 'Ervas Frescas (Salsa, Dill)', '1 xícara', 'eco'),
  (recipe_id, 'Azeite de Oliva', '2 colheres de sopa', 'water_drop'),
  (recipe_id, 'Alho', '2 dentes picados', 'restaurant'),
  (recipe_id, 'Pimenta do Reino', 'a gosto', 'grain');

  -- Insert Steps (Gamification)
  INSERT INTO public.steps (recipe_id, order_index, title, description, xp_reward, timer_seconds) VALUES
  (recipe_id, 1, 'Preparar o Tempero', 'Pique as ervas finamente e misture com o alho picado, sal, pimenta e uma colher de azeite.', 10, null),
  (recipe_id, 2, 'Selar o Salmão', 'Aqueça a frigideira com azeite e sele o salmão com a pele para baixo por 3 minutos.', 20, 180),
  (recipe_id, 3, 'Adicionar a Crosta', 'Vire o salmão e adicione a mistura de ervas sobre a parte superior. Deixe cozinhar por mais 4 minutos.', 20, 240),
  (recipe_id, 4, 'Finalização', 'Regue com suco de limão siciliano e sirva imediatamente.', 50, null);

END $$;
