import ErrorComponent from 'components/common/ErrorComponemts'
import React from 'react'
import { withErrorBoundary } from 'react-error-boundary'
import { useRoutes } from 'react-router-dom'
import { routesConfig } from './routesConfig'

const RouteWithSubRoutes = () => {
  const routes = useRoutes(routesConfig);

  return <>{routes}</>
}

export default withErrorBoundary(RouteWithSubRoutes, {
  FallbackComponent: ErrorComponent,
});