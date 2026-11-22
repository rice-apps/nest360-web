import { cookies } from 'next/headers'

import { SIMULATE_FAILURE_COOKIE, type SimulatedFailure } from './searchLoaders'

// A development-only switch for seeing (and testing) what visitors see when search fails, without touching any
// database. While the nest360-simulate-search-failure cookie is set, /resources and /stories act as if:
// - "search": the search index is down (the full lists still load, but any search fails)
// - "database": the database is down (nothing loads)
// Delete the cookie (or press Try again after deleting it) and they work normally again.
//
// It's ignored in production builds (`next build` / `next start`, and the deployed site), so visitors can never
// trigger it. To try it by hand, run in the browser console on localhost:
//   document.cookie = 'nest360-simulate-search-failure=search; path=/'
// and to stop:
//   document.cookie = 'nest360-simulate-search-failure=; path=/; max-age=0'
export async function simulatedFailure(): Promise<SimulatedFailure | null> {
  if (process.env.NODE_ENV === 'production') return null
  const value = (await cookies()).get(SIMULATE_FAILURE_COOKIE)?.value
  return value === 'search' || value === 'database' ? value : null
}
