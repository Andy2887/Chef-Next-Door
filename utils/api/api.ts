import { createClient } from '@/utils/supabase/client'
import useSWR, { mutate } from 'swr'

// Type definitions
export interface Recipe {
  id: string
  title: string
  description: string | null
  image_url: string | null
  cook_time: number | null
  prep_time: number | null
  servings: number | null
  rating: number
  total_reviews: number
  difficulty_level: string | null
  tags: string[] | null
  featured: boolean
  chef_id: string
  created_at: string
  updated_at: string
  ingredients: string[]
  instructions: string[]
  chef?: {
    id: string
    first_name: string
    last_name: string
    avatar_url: string | null
  }
}

export interface Profile {
  id: string
  email: string
  first_name: string
  last_name: string
  avatar_url: string | null
  bio: string | null
  rating: number
  total_reviews: number
  num_recipes: number
  created_at: string
}

export interface CreateRecipeData {
  title: string
  description?: string
  image_url?: string
  cook_time?: number
  prep_time?: number
  servings?: number
  difficulty_level?: string
  tags?: string[]
  ingredients: string[]
  instructions: string[]
}

export interface UpdateRecipeData extends Partial<CreateRecipeData> {
  id: string
}

// Authentication helpers
export const getCurrentUser = async () => {
  const supabase = createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error) {
    throw new Error(`Authentication error: ${error.message}`)
  }
  
  if (!user) {
    throw new Error('User not authenticated')
  }
  
  return user
}

// Profile API calls
export const profileApi = {
  // Get user profile
  getProfile: async (userId?: string): Promise<Profile> => {
    const supabase = createClient()
    const targetUserId = userId || (await getCurrentUser()).id
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', targetUserId)
      .single()

    if (error) {
      throw new Error(`Failed to fetch profile: ${error.message}`)
    }

    return data
  },

  // Update user profile
  updateProfile: async (profileData: Partial<Profile>): Promise<Profile> => {
    const supabase = createClient()
    const user = await getCurrentUser()
    
    const { data, error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', user.id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update profile: ${error.message}`)
    }

    return data
  },

  // Get current user profile
  getCurrentProfile: async (): Promise<Profile> => {
    const user = await getCurrentUser()
    return profileApi.getProfile(user.id)
  }
}

// Recipe API calls
export const recipeApi = {
  // Get all recipes (public)
  getAllRecipes: async (options?: {
    limit?: number
    offset?: number
    featured?: boolean
    difficulty?: string
    tags?: string[]
  }): Promise<Recipe[]> => {
    const supabase = createClient()
    let query = supabase
      .from('recipes')
      .select(`
        *,
        chef:profiles!chef_id (
          id,
          first_name,
          last_name,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false })

    if (options?.limit) {
      query = query.limit(options.limit)
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
    }

    if (options?.featured !== undefined) {
      query = query.eq('featured', options.featured)
    }

    if (options?.difficulty) {
      query = query.eq('difficulty_level', options.difficulty)
    }

    if (options?.tags && options.tags.length > 0) {
      query = query.overlaps('tags', options.tags)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(`Failed to fetch recipes: ${error.message}`)
    }

    return data || []
  },

  // Get user's recipes
  getUserRecipes: async (userId?: string): Promise<Recipe[]> => {
    const supabase = createClient()
    const targetUserId = userId || (await getCurrentUser()).id
    
    const { data, error } = await supabase
      .from('recipes')
      .select(`
        *,
        chef:profiles!chef_id (
          id,
          first_name,
          last_name,
          avatar_url
        )
      `)
      .eq('chef_id', targetUserId)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch user recipes: ${error.message}`)
    }

    return data || []
  },

  // Get recipe by ID
  getRecipeById: async (recipeId: string): Promise<Recipe> => {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('recipes')
      .select(`
        *,
        chef:profiles!chef_id (
          id,
          first_name,
          last_name,
          avatar_url
        )
      `)
      .eq('id', recipeId)
      .single()

    if (error) {
      throw new Error(`Failed to fetch recipe: ${error.message}`)
    }

    return data
  },

  // Create new recipe
  createRecipe: async (recipeData: CreateRecipeData): Promise<Recipe> => {
    const supabase = createClient()
    const user = await getCurrentUser()
    
    const { data, error } = await supabase
      .from('recipes')
      .insert({
        ...recipeData,
        chef_id: user.id,
        rating: 0,
        total_reviews: 0,
        featured: false
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create recipe: ${error.message}`)
    }

    // Update profile recipe count
    await supabase.rpc('increment_recipe_count', {
      user_id: user.id
    })

    return data
  },

  // Update recipe
  updateRecipe: async (recipeData: UpdateRecipeData): Promise<Recipe> => {
    const supabase = createClient()
    const user = await getCurrentUser()
    const { id, ...updateData } = recipeData
    
    const { data, error } = await supabase
      .from('recipes')
      .update(updateData)
      .eq('id', id)
      .eq('chef_id', user.id) // Ensure user can only update their own recipes
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update recipe: ${error.message}`)
    }

    return data
  },

  // Delete recipe
  deleteRecipe: async (recipeId: string): Promise<void> => {
    const supabase = createClient()
    const user = await getCurrentUser()
    
    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', recipeId)
      .eq('chef_id', user.id) // Ensure user can only delete their own recipes

    if (error) {
      throw new Error(`Failed to delete recipe: ${error.message}`)
    }

    // Update profile recipe count
    const { error: profileError } = await supabase.rpc('decrement_recipe_count', {
      user_id: user.id
    })
    
    if (profileError) {
      console.error('Error updating profile recipe count:', profileError)
    }
  },

  // Search recipes
  searchRecipes: async (query: string, options?: {
    limit?: number
    difficulty?: string
    tags?: string[]
  }): Promise<Recipe[]> => {
    const supabase = createClient()
    
    let dbQuery = supabase
      .from('recipes')
      .select(`
        *,
        chef:profiles!chef_id (
          id,
          first_name,
          last_name,
          avatar_url
        )
      `)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false })

    if (options?.limit) {
      dbQuery = dbQuery.limit(options.limit)
    }

    if (options?.difficulty) {
      dbQuery = dbQuery.eq('difficulty_level', options.difficulty)
    }

    if (options?.tags && options.tags.length > 0) {
      dbQuery = dbQuery.overlaps('tags', options.tags)
    }

    const { data, error } = await dbQuery

    if (error) {
      throw new Error(`Failed to search recipes: ${error.message}`)
    }

    return data || []
  },

  // Rate recipe
  rateRecipe: async (recipeId: string, rating: number): Promise<void> => {
    const supabase = createClient()
    const user = await getCurrentUser()
    
    // This would typically involve a ratings table, but for now we'll update the recipe directly
    // In a real app, you'd want to track individual ratings and calculate averages
    const { error } = await supabase
      .from('recipe_ratings')
      .upsert({
        recipe_id: recipeId,
        user_id: user.id,
        rating: rating
      })

    if (error) {
      throw new Error(`Failed to rate recipe: ${error.message}`)
    }
  }
}

// Search API calls
export const searchApi = {
  // Global search across recipes and profiles
  globalSearch: async (query: string, options?: {
    includeRecipes?: boolean
    includeProfiles?: boolean
    limit?: number
  }): Promise<{
    recipes: Recipe[]
    profiles: Profile[]
  }> => {
    const results = {
      recipes: [] as Recipe[],
      profiles: [] as Profile[]
    }

    if (options?.includeRecipes !== false) {
      results.recipes = await recipeApi.searchRecipes(query, { limit: options?.limit })
    }

    if (options?.includeProfiles !== false) {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,bio.ilike.%${query}%`)
        .limit(options?.limit || 10)

      if (!error) {
        results.profiles = data || []
      }
    }

    return results
  }
}

// SWR Keys - centralized key management
export const SWR_KEYS = {
  PROFILE: 'profile',
  USER_RECIPES: 'user-recipes',
  RECIPE: (id: string) => `recipe-${id}`,
  ALL_RECIPES: 'all-recipes',
  SEARCH_RECIPES: (query: string) => `search-recipes-${query}`,
  GLOBAL_SEARCH: (query: string) => `global-search-${query}`,
} as const

// SWR Fetcher function
export const fetcher = {
  profile: async (): Promise<Profile> => {
    return await profileApi.getCurrentProfile()
  },
  
  userRecipes: async (): Promise<Recipe[]> => {
    return await recipeApi.getUserRecipes()
  },
  
  recipe: async (id: string): Promise<Recipe> => {
    return await recipeApi.getRecipeById(id)
  },
  
  allRecipes: async (options?: Parameters<typeof recipeApi.getAllRecipes>[0]): Promise<Recipe[]> => {
    return await recipeApi.getAllRecipes(options)
  },
  
  searchRecipes: async ({ query, options }: { 
    query: string
    options?: Parameters<typeof recipeApi.searchRecipes>[1] 
  }): Promise<Recipe[]> => {
    return await recipeApi.searchRecipes(query, options)
  },
  
  globalSearch: async ({ query, options }: { 
    query: string
    options?: Parameters<typeof searchApi.globalSearch>[1] 
  }) => {
    return await searchApi.globalSearch(query, options)
  }
}

// SWR Custom Hooks
export const useProfile = () => {
  return useSWR(SWR_KEYS.PROFILE, fetcher.profile, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    errorRetryCount: 3,
    errorRetryInterval: 1000,
  })
}

export const useUserRecipes = () => {
  return useSWR(SWR_KEYS.USER_RECIPES, fetcher.userRecipes, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    errorRetryCount: 3,
  })
}

export const useRecipe = (id: string) => {
  return useSWR(id ? SWR_KEYS.RECIPE(id) : null, () => fetcher.recipe(id), {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  })
}

export const useAllRecipes = (options?: Parameters<typeof recipeApi.getAllRecipes>[0]) => {
  const key = options ? `${SWR_KEYS.ALL_RECIPES}-${JSON.stringify(options)}` : SWR_KEYS.ALL_RECIPES
  return useSWR(key, () => fetcher.allRecipes(options), {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  })
}

export const useSearchRecipes = (query: string, options?: Parameters<typeof recipeApi.searchRecipes>[1]) => {
  const key = query ? SWR_KEYS.SEARCH_RECIPES(query) + (options ? `-${JSON.stringify(options)}` : '') : null
  return useSWR(
    key,
    () => fetcher.searchRecipes({ query, options }),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 5000, // Dedupe requests within 5 seconds
    }
  )
}

export const useGlobalSearch = (query: string, options?: Parameters<typeof searchApi.globalSearch>[1]) => {
  const key = query ? SWR_KEYS.GLOBAL_SEARCH(query) + (options ? `-${JSON.stringify(options)}` : '') : null
  return useSWR(
    key,
    () => fetcher.globalSearch({ query, options }),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 5000,
    }
  )
}

// SWR Mutation helpers
export const swrMutations = {
  // Profile mutations
  updateProfile: async (profileData: Partial<Profile>) => {
    const updatedProfile = await profileApi.updateProfile(profileData)
    // Optimistic update
    mutate(SWR_KEYS.PROFILE, updatedProfile, false)
    return updatedProfile
  },

  // Recipe mutations
  createRecipe: async (recipeData: CreateRecipeData) => {
    const newRecipe = await recipeApi.createRecipe(recipeData)
    // Revalidate related data
    mutate(SWR_KEYS.USER_RECIPES)
    mutate(SWR_KEYS.PROFILE)
    mutate(SWR_KEYS.ALL_RECIPES)
    return newRecipe
  },

  updateRecipe: async (recipeData: UpdateRecipeData) => {
    const updatedRecipe = await recipeApi.updateRecipe(recipeData)
    // Update specific recipe and revalidate lists
    mutate(SWR_KEYS.RECIPE(recipeData.id), updatedRecipe, false)
    mutate(SWR_KEYS.USER_RECIPES)
    mutate(SWR_KEYS.ALL_RECIPES)
    return updatedRecipe
  },

  deleteRecipe: async (recipeId: string) => {
    await recipeApi.deleteRecipe(recipeId)
    // Remove from cache and revalidate related data
    mutate(SWR_KEYS.RECIPE(recipeId), undefined, false)
    mutate(SWR_KEYS.USER_RECIPES)
    mutate(SWR_KEYS.PROFILE)
    mutate(SWR_KEYS.ALL_RECIPES)
  },

  rateRecipe: async (recipeId: string, rating: number) => {
    await recipeApi.rateRecipe(recipeId, rating)
    // Revalidate the specific recipe
    mutate(SWR_KEYS.RECIPE(recipeId))
  }
}

// Export all APIs
export const api = {
  profile: profileApi,
  recipe: recipeApi,
  search: searchApi,
  auth: {
    getCurrentUser
  },
  swr: {
    keys: SWR_KEYS,
    fetcher,
    hooks: {
      useProfile,
      useUserRecipes,
      useRecipe,
      useAllRecipes,
      useSearchRecipes,
      useGlobalSearch,
    },
    mutations: swrMutations
  }
}

export default api
