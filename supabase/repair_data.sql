-- Limpar ingredientes e passos bugados para reconstrução limpa
DELETE FROM public.ingredients;
DELETE FROM public.steps;

DO $$
DECLARE
  r_id bigint;
BEGIN

  -- 1. SALMÃO MEDITERRÂNEO
  SELECT id INTO r_id FROM public.recipes WHERE slug = 'salmao-mediterraneo';
  INSERT INTO public.ingredients (recipe_id, name, amount, icon) VALUES 
  (r_id, 'Filé de Salmão', '200g', 'set_meal'),
  (r_id, 'Ervas Finas', '1 colher', 'grass'),
  (r_id, 'Azeite de Oliva', '10ml', 'water_drop');
  INSERT INTO public.steps (recipe_id, order_index, title, description, xp_reward) VALUES 
  (r_id, 1, 'Temperar o Salmão', 'Tempere com sal, pimenta e as ervas.', 20);

  -- 2. FETTUCCINE ALFREDO
  SELECT id INTO r_id FROM public.recipes WHERE slug = 'fettuccine-alfredo';
  INSERT INTO public.ingredients (recipe_id, name, amount, icon) VALUES 
  (r_id, 'Fettuccine', '500g', 'ramen_dining'),
  (r_id, 'Manteiga', '100g', 'nutrition'),
  (r_id, 'Creme de Leite', '200ml', 'opacity'),
  (r_id, 'Parmesão', '150g', 'nutrition');
  INSERT INTO public.steps (recipe_id, order_index, title, description, xp_reward) VALUES 
  (r_id, 1, 'Ferver Água', 'Ferva a água com bastante sal.', 10),
  (r_id, 2, 'Preparar o Molho', 'Derreta a manteiga e misture o creme de leite.', 20);

  -- 3. LASANHA À BOLONHESA
  SELECT id INTO r_id FROM public.recipes WHERE slug = 'lasanha-bolonhesa';
  INSERT INTO public.ingredients (recipe_id, name, amount, icon) VALUES 
  (r_id, 'Massa Lasanha', '1 pacote', 'layers'),
  (r_id, 'Carne Moída', '500g', 'set_meal'),
  (r_id, 'Molho de Tomate', '300ml', 'nutrition');
  INSERT INTO public.steps (recipe_id, order_index, title, description, xp_reward) VALUES 
  (r_id, 1, 'Montagem', 'Faça camadas de massa e molho.', 30);

  -- 4. RISOTO DE COGUMELOS
  SELECT id INTO r_id FROM public.recipes WHERE slug = 'risoto-cogumelos';
  INSERT INTO public.ingredients (recipe_id, name, amount, icon) VALUES 
  (r_id, 'Arroz Arbóreo', '250g', 'grain'),
  (r_id, 'Cogumelos Mix', '200g', 'grass'),
  (r_id, 'Caldo de Legumes', '1L', 'opacity');
  INSERT INTO public.steps (recipe_id, order_index, title, description, xp_reward) VALUES 
  (r_id, 1, 'Refogar Cogumelos', 'Refogue até dourar bem.', 15);

  -- 5. FRANGO COM BATATA DOCE
  SELECT id INTO r_id FROM public.recipes WHERE slug = 'frango-batata-doce';
  INSERT INTO public.ingredients (recipe_id, name, amount, icon) VALUES 
  (r_id, 'Peito de Frango', '150g', 'set_meal'),
  (r_id, 'Batata Doce', '200g', 'nutrition');
  INSERT INTO public.steps (recipe_id, order_index, title, description, xp_reward) VALUES 
  (r_id, 1, 'Grelhar', 'Cozinhe a batata e grelhe o frango.', 20);

  -- 6. SALADA DE QUINOA
  SELECT id INTO r_id FROM public.recipes WHERE slug = 'salada-quinoa';
  INSERT INTO public.ingredients (recipe_id, name, amount, icon) VALUES 
  (r_id, 'Quinoa Cozida', '1 xícara', 'grain'),
  (r_id, 'Tomate Cereja', '100g', 'nutrition'),
  (r_id, 'Pepino', '1 unidade', 'grass');
  INSERT INTO public.steps (recipe_id, order_index, title, description, xp_reward) VALUES 
  (r_id, 1, 'Misturar', 'Misture todos os ingredientes.', 10);

  -- 7. TORTA DE LIMÃO
  SELECT id INTO r_id FROM public.recipes WHERE slug = 'torta-de-limao';
  INSERT INTO public.ingredients (recipe_id, name, amount, icon) VALUES 
  (r_id, 'Biscoito Maria', '1 pacote', 'cookie'),
  (r_id, 'Leite Condensado', '1 lata', 'opacity'),
  (r_id, 'Suco de Limão', '1/2 xícara', 'nutrition');
  INSERT INTO public.steps (recipe_id, order_index, title, description, xp_reward) VALUES 
  (r_id, 1, 'Base', 'Triture o biscoito e forre a forma.', 20);

  -- 8. PETIT GÂTEAU
  SELECT id INTO r_id FROM public.recipes WHERE slug = 'petit-gateau';
  INSERT INTO public.ingredients (recipe_id, name, amount, icon) VALUES 
  (r_id, 'Chocolate Amargo', '200g', 'nutrition'),
  (r_id, 'Ovos', '2 unidades', 'egg'),
  (r_id, 'Manteiga', '2 colheres', 'nutrition');
  INSERT INTO public.steps (recipe_id, order_index, title, description, xp_reward) VALUES 
  (r_id, 1, 'Derreter', 'Derreta o chocolate com manteiga.', 20);

  -- 9. MOQUECA DE BANANA
  SELECT id INTO r_id FROM public.recipes WHERE slug = 'moqueca-banana';
  INSERT INTO public.ingredients (recipe_id, name, amount, icon) VALUES 
  (r_id, 'Banana da Terra', '3 unidades', 'nutrition'),
  (r_id, 'Leite de Coco', '200ml', 'opacity'),
  (r_id, 'Dendê', '1 colher', 'water_drop');
  INSERT INTO public.steps (recipe_id, order_index, title, description, xp_reward) VALUES 
  (r_id, 1, 'Cozimento', 'Cozinhe até a banana ficar macia.', 15);

  -- 10. HAMBÚRGUER ARTESANAL
  SELECT id INTO r_id FROM public.recipes WHERE slug = 'burger-artesanal';
  INSERT INTO public.ingredients (recipe_id, name, amount, icon) VALUES 
  (r_id, 'Blend de Carne', '180g', 'set_meal'),
  (r_id, 'Pão de Brioche', '1 unidade', 'bakery_dining'),
  (r_id, 'Cheddar', '2 fatias', 'nutrition');
  INSERT INTO public.steps (recipe_id, order_index, title, description, xp_reward, timer_seconds) VALUES 
  (r_id, 1, 'Moldar', 'Molde a carne sem apertar.', 20, 120),
  (r_id, 2, 'Grelhar', 'Grelhe por 3 minutos de cada lado.', 30, 180);

  -- 11. SUSHI VARIADO
  SELECT id INTO r_id FROM public.recipes WHERE slug = 'sushi-variado';
  INSERT INTO public.ingredients (recipe_id, name, amount, icon) VALUES 
  (r_id, 'Arroz Gohan', '2 xícaras', 'grain'),
  (r_id, 'Salmão Fresco', '200g', 'set_meal'),
  (r_id, 'Nori', '3 folhas', 'layers');
  INSERT INTO public.steps (recipe_id, order_index, title, description, xp_reward) VALUES 
  (r_id, 1, 'Preparar Gohan', 'Lave e cozinhe o arroz.', 20);

  -- 12. OMELETE DE CLARAS
  SELECT id INTO r_id FROM public.recipes WHERE slug = 'omelete-de-claras';
  INSERT INTO public.ingredients (recipe_id, name, amount, icon) VALUES 
  (r_id, 'Claras de Ovo', '4 unidades', 'egg'),
  (r_id, 'Espinafre', '1 punhado', 'grass');
  INSERT INTO public.steps (recipe_id, order_index, title, description, xp_reward) VALUES 
  (r_id, 1, 'Bater', 'Bata as claras suavemente.', 10);

  -- 13. ESTROGONOFE GRÃO DE BICO
  SELECT id INTO r_id FROM public.recipes WHERE slug = 'estrogonofe-grao-bico';
  INSERT INTO public.ingredients (recipe_id, name, amount, icon) VALUES 
  (r_id, 'Grão de Bico', '200g', 'grain'),
  (r_id, 'Creme de Leite de Castanha', '200ml', 'opacity');
  INSERT INTO public.steps (recipe_id, order_index, title, description, xp_reward) VALUES 
  (r_id, 1, 'Cozinhar', 'Misture o molho e deixe apurar.', 15);

  -- 14. BROWNIE CHOCOLATE
  SELECT id INTO r_id FROM public.recipes WHERE slug = 'brownie-chocolate';
  INSERT INTO public.ingredients (recipe_id, name, amount, icon) VALUES 
  (r_id, 'Chocolate pó', '1 xícara', 'nutrition'),
  (r_id, 'Açúcar', '1 xícara', 'nutrition'),
  (r_id, 'Farinha', '1/2 xícara', 'grain');
  INSERT INTO public.steps (recipe_id, order_index, title, description, xp_reward) VALUES 
  (r_id, 1, 'Mistura Seca', 'Misture os pós primeiro.', 20);

  -- 15. POKE DE ATUM
  SELECT id INTO r_id FROM public.recipes WHERE slug = 'poke-de-atum';
  INSERT INTO public.ingredients (recipe_id, name, amount, icon) VALUES 
  (r_id, 'Atum em Cubos', '150g', 'set_meal'),
  (r_id, 'Abacate', '1/2 unidade', 'nutrition');
  INSERT INTO public.steps (recipe_id, order_index, title, description, xp_reward) VALUES 
  (r_id, 1, 'Temperar Peixe', 'Use shoyu e óleo de gergelim.', 20);

  -- 16. PIZZA MARGHERITA
  SELECT id INTO r_id FROM public.recipes WHERE slug = 'pizza-margherita';
  INSERT INTO public.ingredients (recipe_id, name, amount, icon) VALUES 
  (r_id, 'Massa de Pizza', '1 disco', 'bakery_dining'),
  (r_id, 'Mussarela', '200g', 'nutrition'),
  (r_id, 'Manjericão', '1 punhado', 'grass');
  INSERT INTO public.steps (recipe_id, order_index, title, description, xp_reward) VALUES 
  (r_id, 1, 'Recheio', 'Distribua o queijo e o manjericão.', 15);

  -- 17. BERINJELA PARMEGIANA
  SELECT id INTO r_id FROM public.recipes WHERE slug = 'berinjela-parmegiana';
  INSERT INTO public.ingredients (recipe_id, name, amount, icon) VALUES 
  (r_id, 'Berinjela', '2 unidades', 'nutrition'),
  (r_id, 'Molho Tomate', '1 xícara', 'nutrition');
  INSERT INTO public.steps (recipe_id, order_index, title, description, xp_reward) VALUES 
  (r_id, 1, 'Grelhar Rodelas', 'Sele as rodelas na chapa.', 20);

  -- 18. SMOOTHIE DE FRUTAS
  SELECT id INTO r_id FROM public.recipes WHERE slug = 'smoothie-de-frutas';
  INSERT INTO public.ingredients (recipe_id, name, amount, icon) VALUES 
  (r_id, 'Bananas Congeladas', '2 unidades', 'nutrition'),
  (r_id, 'Morangos', '5 unidades', 'nutrition'),
  (r_id, 'Iogurte', '100ml', 'opacity');
  INSERT INTO public.steps (recipe_id, order_index, title, description, xp_reward) VALUES 
  (r_id, 1, 'Bater tudo', 'Use o liquidificador na velocidade máxima.', 10);

  -- 19. PUDIM DE LEITE
  SELECT id INTO r_id FROM public.recipes WHERE slug = 'pudim-de-leite';
  INSERT INTO public.ingredients (recipe_id, name, amount, icon) VALUES 
  (r_id, 'Leite Condensado', '1 lata', 'opacity'),
  (r_id, 'Leite Integral', '400ml', 'opacity'),
  (r_id, 'Ovos', '3 unidades', 'egg');
  INSERT INTO public.steps (recipe_id, order_index, title, description, xp_reward) VALUES 
  (r_id, 1, 'Caramelo', 'Faça a calda com açúcar e água.', 30);

  -- 20. TACOS DE CARNE
  SELECT id INTO r_id FROM public.recipes WHERE slug = 'tacos-de-carne';
  INSERT INTO public.ingredients (recipe_id, name, amount, icon) VALUES 
  (r_id, 'Tortilhas', '4 unidades', 'bakery_dining'),
  (r_id, 'Carne Picada', '200g', 'set_meal'),
  (r_id, 'Guacamole', '100g', 'nutrition');
  INSERT INTO public.steps (recipe_id, order_index, title, description, xp_reward) VALUES 
  (r_id, 1, 'Aquecer Tortilha', 'Aqueça levemente antes de servir.', 15);

  -- 21. CHEESECAKE FRUTAS
  SELECT id INTO r_id FROM public.recipes WHERE slug = 'cheesecake-frutas';
  INSERT INTO public.ingredients (recipe_id, name, amount, icon) VALUES 
  (r_id, 'Cream Cheese', '300g', 'nutrition'),
  (r_id, 'Geléia de Frutas', '100g', 'nutrition'),
  (r_id, 'Biscoito', '150g', 'cookie');
  INSERT INTO public.steps (recipe_id, order_index, title, description, xp_reward) VALUES 
  (r_id, 1, 'Creme', 'Bata o cream cheese com açúcar.', 25);

END $$;
