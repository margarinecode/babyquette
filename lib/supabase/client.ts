const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

export async function signUp(email: string, password: string, businessName: string) {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_KEY,
    },
    body: JSON.stringify({
      email,
      password,
      user_metadata: { business_name: businessName },
    }),
  })
  return response.json()
}

export async function signIn(email: string, password: string) {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_KEY,
    },
    body: JSON.stringify({ email, password }),
  })
  return response.json()
}

export async function getUser(token: string) {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
      apikey: SUPABASE_KEY,
    },
  })
  return response.json()
}

export async function signOut() {
  localStorage.removeItem("supabase.auth.token")
  localStorage.removeItem("supabase.auth.user")
  return { success: true }
}

export async function queryTable(table: string, token: string, query = "") {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      apikey: SUPABASE_KEY,
    },
  })
  return response.json()
}

export async function insertRow(table: string, token: string, data: any) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      apikey: SUPABASE_KEY,
    },
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function deleteRow(table: string, token: string, id: string) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      apikey: SUPABASE_KEY,
    },
  })
  return response.json()
}

// Legacy export for compatibility
export const createClient = () => ({
  auth: {
    signInWithPassword: async (credentials: { email: string; password: string }) =>
      signIn(credentials.email, credentials.password),
    signUp: async (data: any) => signUp(data.email, data.password, data.options?.data?.business_name || ""),
    getUser: () => getUser(localStorage.getItem("supabase.auth.token") || ""),
    signOut: () => signOut(),
  },
})
