import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getProducts(filters = {}) {
  let query = supabase.from('products').select('*').order('created_at', { ascending: false });

  if (filters.category) {
    query = query.eq('category', filters.category);
  }
  if (filters.fabric) {
    query = query.eq('fabric', filters.fabric);
  }
  if (filters.isNewArrival) {
    query = query.eq('is_new_arrival', true);
  }
  if (filters.isFestive) {
    query = query.eq('is_festive', true);
  }
  if (filters.isTrending) {
    query = query.eq('is_trending', true);
  }
  if (filters.search) {
    query = query.ilike('name', `%${filters.search}%`);
  }

  const { data, error } = await query;
  return { data, error };
}

export async function getProductById(id) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  return { data, error };
}

export async function getWishlist() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { data: null, error: 'Not authenticated' };

  const { data, error } = await supabase
    .from('wishlists')
    .select(`
      id,
      created_at,
      product:products(*)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return { data, error };
}

export async function addToWishlist(productId) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { data: null, error: 'Not authenticated' };

  const { data, error } = await supabase
    .from('wishlists')
    .insert({ user_id: user.id, product_id: productId })
    .select()
    .single();

  return { data, error };
}

export async function removeFromWishlist(productId) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { data: null, error: 'Not authenticated' };

  const { error } = await supabase
    .from('wishlists')
    .delete()
    .eq('user_id', user.id)
    .eq('product_id', productId);

  return { error };
}

export async function isInWishlist(productId) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return false;

  const { data } = await supabase
    .from('wishlists')
    .select('id')
    .eq('user_id', user.id)
    .eq('product_id', productId)
    .maybeSingle();

  return !!data;
}

export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  return { data, error };
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function isAdmin() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return false;

  const { data } = await supabase
    .from('admin_users')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  return !!data;
}

export async function createProduct(product) {
  const { data, error } = await supabase
    .from('products')
    .insert(product)
    .select()
    .single();

  return { data, error };
}

export async function updateProduct(id, product) {
  const { data, error } = await supabase
    .from('products')
    .update(product)
    .eq('id', id)
    .select()
    .single();

  return { data, error };
}

export async function deleteProduct(id) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  return { error };
}
