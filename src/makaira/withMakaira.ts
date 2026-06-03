import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'

import { MakairaAuthData } from '@/types/App'
import { getSingleVendorAuth } from '@/utils/getSingleVendorAuth'

type IncomingPageServerSideProp<P> = (
  ctx: GetServerSidePropsContext
) => Promise<GetServerSidePropsResult<P>>

/**
 * Using for APP with install in single Makaira's instance and
 * provided SECRET, SLUG via Environment instead of store in db
 *
 * @param incomingGSSP
 * @returns
 */
export function withMakaira<T>(
  incomingGSSP?: IncomingPageServerSideProp<T> | null
) {
  return async (
    ctx: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<T & MakairaAuthData>> => {
    const url = new URL(ctx.req.url ?? '', `https://${ctx.req.headers.host}`)
    let secretProps = null

    if (
      process.env.MAKAIRA_APP_SECRET_CONTENT_WIDGET ||
      process.env.MAKAIRA_APP_SECRET_CONTENT_MODAL ||
      process.env.MAKAIRA_APP_SECRET
    ) {
      console.debug(
        '[Example-App]: Process app auth with single vendor from ENV'
      )

      const appType = ctx.query.appType as string

      try {
        secretProps = getSingleVendorAuth(url.pathname, {
          ...ctx.query,
          appType,
        })
      } catch {
        secretProps = null
      }

      if (!secretProps) {
        return {
          redirect: {
            permanent: false,
            destination: '/bad-auth',
          },
          props: {} as any,
        }
      }
    } else {
      console.error(
        '[Asset Manager]: Missing Makaira single-tenant env variables (MAKAIRA_APP_SECRET + MAKAIRA_APP_SLUG, or MAKAIRA_APP_SECRET_CONTENT_WIDGET + MAKAIRA_APP_SLUG_CONTENT_WIDGET, or MAKAIRA_APP_SECRET_CONTENT_MODAL + MAKAIRA_APP_SLUG_CONTENT_MODAL)'
      )

      return {
        redirect: {
          permanent: false,
          destination: '/bad-auth',
        },
        props: {} as any,
      }
    }

    if (incomingGSSP) {
      const incomingGSSPResult = await incomingGSSP(ctx)

      if ('props' in incomingGSSPResult) {
        const result = {
          props: {
            ...secretProps,
            ...incomingGSSPResult.props,
          },
        }

        // @ts-ignore
        return result
      }

      if ('redirect' in incomingGSSPResult) {
        return { redirect: { ...incomingGSSPResult.redirect } }
      }

      if ('notFound' in incomingGSSPResult) {
        return { notFound: incomingGSSPResult.notFound }
      }
    }

    return {
      // @ts-ignore
      props: secretProps,
    }
  }
}
