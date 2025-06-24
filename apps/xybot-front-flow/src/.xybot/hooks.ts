import { useQuery, QueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import throttle from 'lodash.throttle';
import { getBuryData, addClickEventListener, removeClickEventListener } from '@xybot/bury'

export const queryClient = new QueryClient()

const GLOBAL_KEY = 'GLOBAL'
export interface IGlobalData {
  lang: string
}

export const useGlobal = () => {
  const { data: Global } = useQuery<IGlobalData>({
    queryKey: [GLOBAL_KEY],
    queryFn: async () => ({ lang: 'zh-CN' }),
    initialData: { lang: 'zh-CN' },
    staleTime: Infinity,
  })

  const setGlobal = (props: Partial<IGlobalData>) => {
    queryClient.setQueryData([GLOBAL_KEY], (oldData: IGlobalData) => ({ ...oldData, ...props }))
  }

  return { Global, setGlobal }
}

export const useTokenLogin = () => {
  const [searchParams] = useSearchParams()
  const [checking, setChecking] = useState<boolean>(false)
  const token =
    searchParams.get('token') ||
    searchParams.get('access_token') ||
    searchParams.get('bearer_token') ||
    searchParams.get('jumpToken')

  useEffect(() => {
    if (token) {
      setChecking(true)
      fetch(`${window.YD.API_URL}/api/v1/user/login/getAccessTokenByJumpToken?jumpToken=${token}`)
        .then((res) => res.json())
        .then((res) => {
          console.log('useTokenLogin', res)
          if (res.success) {
            localStorage.setItem('ACCESS_TOKEN', res.data)
            const url = new URL(window.location.href)
            url.searchParams.delete('token')
            url.searchParams.delete('access_token')
            url.searchParams.delete('bearer_token')
            url.searchParams.delete('jumpToken')
            window.history.replaceState(null, '', url.toString())
          } else {
            localStorage.setItem('ACCESS_TOKEN', token)
          }
        })
        .finally(() => {
          setChecking(false)
        })
    }
  }, [token])

  return { checking }
}

export const useRedirect = (checking: boolean) => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const redirect = searchParams.get('redirect')

  useEffect(() => {
    if (!checking) {
      if (redirect) {
        if (redirect.startsWith('http')) {
          window.location.href = redirect
        }
        navigate(redirect, { replace: true })
      }
    }
  }, [checking, redirect, navigate])
}

export const usePV = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    if (window.YD.ENABLE_REPORT) {
      const reportUrl = window.YD.REPORT_URL || '/report-api'
      fetch(reportUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'no-report': 'true',
        },
        body: JSON.stringify({
          level: 'info',
          span: 'pv',
          uuid: localStorage.getItem('uuid') || '',
          user: localStorage.getItem('user') || '',
          userName: localStorage.getItem('userName') || '',
          enterpriseName: localStorage.getItem('enterpriseName') || '',
          href: window.location.href,
          origin: window.location.origin,
          pathname: window.location.pathname,
          search: window.location?.search || '',
        }),
      })
    }
  }, [pathname])
}

export const useEvent = () => {
  useEffect(() => {
    addClickEventListener()

    return () => {
      removeClickEventListener()
    }
  }, [])
}

export const reportCustomEvent = (events: Record<string, string>) => {
  if (window.YD.ENABLE_REPORT) {
    const reportUrl = window.YD.REPORT_URL || '/report-api';
    fetch(reportUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        level: 'info',
        span: 'custom-event',
        uuid: localStorage.getItem('uuid') || '',
        user: localStorage.getItem('user') || '',
        userName: localStorage.getItem('userName') || '',
        enterpriseName: localStorage.getItem('enterpriseName') || '',
        href: window.location.href,
        pathname: window.location.pathname,
        search: window.location?.search || '',
        ...(events || {})
      })
    });
  }
};
