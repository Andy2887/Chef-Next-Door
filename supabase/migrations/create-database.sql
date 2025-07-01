CREATE TABLE public.comments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  reviewer_id uuid NOT NULL,
  recipe_id uuid NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT comments_pkey PRIMARY KEY (id),
  CONSTRAINT comments_reviewer_id_fkey FOREIGN KEY (reviewer_id) REFERENCES public.profiles(id),
  CONSTRAINT comments_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES public.recipes(id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  email text NOT NULL UNIQUE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  avatar_url text,
  bio text,
  rating numeric DEFAULT 0.00,
  total_reviews integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  num_recipes integer DEFAULT 0,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.recipes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  chef_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  ingredients jsonb NOT NULL,
  instructions jsonb NOT NULL,
  prep_time integer,
  cook_time integer,
  servings integer,
  difficulty_level text CHECK (difficulty_level = ANY (ARRAY['easy'::text, 'medium'::text, 'hard'::text])),
  cuisine_type text,
  tags jsonb,
  image_url text,
  rating numeric DEFAULT 0.00,
  total_reviews integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  featured boolean NOT NULL DEFAULT false,
  CONSTRAINT recipes_pkey PRIMARY KEY (id),
  CONSTRAINT recipes_chef_id_fkey FOREIGN KEY (chef_id) REFERENCES public.profiles(id)
);