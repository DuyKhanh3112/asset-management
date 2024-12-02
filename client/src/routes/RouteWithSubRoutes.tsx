import ErrorComponent from 'components/common/ErrorComponemts'
import React from 'react'
import { withErrorBoundary } from 'react-error-boundary'
import { useRoutes } from 'react-router-dom'
import { routesConfig } from './routesConfig'
import { useAuth } from 'contexts/useAuthContext'
import Loading from 'components/loading/Loading'

const RouteWithSubRoutes = () => {
  const routes    = useRoutes(routesConfig);
  const {loading} = useAuth()
  const userId = localStorage.getItem('asset_u')

  if(loading && userId === "") return <Loading />

  return <>{routes}</>
}

export default withErrorBoundary(RouteWithSubRoutes, {
  FallbackComponent: ErrorComponent,
});