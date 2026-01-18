import { createServerClient } from '@supabase/ssr';
import { type NextApiRequest, type NextApiResponse } from 'next';
import { type GetServerSidePropsContext } from 'next';

type CookieData = {
  name: string;
  value: string;
  options: { path?: string };
};

export function createClient(
  context: GetServerSidePropsContext | { req: NextApiRequest; res: NextApiResponse }
) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          // In Pages Router, we parse cookies from the request object
          return Object.keys(context.req.cookies).map((name) => ({
            name,
            value: context.req.cookies[name] || '',
          }));
        },
        setAll(cookiesToSet: CookieData[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            // We set cookies on the response object
            context.res.appendHeader(
              'Set-Cookie',
              `${name}=${value}; Path=${options.path || '/'}; HttpOnly`
            );
          });
        },
      },
    }
  );
}