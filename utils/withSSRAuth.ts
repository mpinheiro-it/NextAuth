import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import { destroyCookie, parseCookies } from "nookies"
import { AuthTokenError } from "../services/errors/AuthTokenError"
import decode from 'jwt-decode'
import { validateUserPermissions } from "./validateUserPermissions"

type WithSSROptions = {
  permissions?: string[]
  roles?: string[]
}

export function withSSRAuth<P>(fn: GetServerSideProps<P>, options?: WithSSROptions){
    return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
        const cookies = parseCookies(ctx)
        const token = cookies['nextauth.token']
        

        if (!token){
          return {
            redirect: {
              destination: '/',
              permanent: false,
            }
          }
    }

    const user = decode(token);

    const userHasValidPermissions = validateUserPermissions({
      user,
      permissions,
      roles
  })

  try {
    return await fn(ctx)
  } catch (err) {
    if (err instanceof AuthTokenError){
      destroyCookie(ctx, 'nextauth.token')
      destroyCookie(ctx, 'nextauth.refreshToken')

      return {
          redirect: {
              destination: '/',
              permanent: false,
              }
            }
          }      
        }    
      }
    }
