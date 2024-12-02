import useAsyncAction from 'hooks/useAsyncAction'
import React, { useEffect } from 'react'
import { getCompany } from 'stores/actions/companies'

const Asset = () => {
  const { executeAction, loading } = useAsyncAction()

  const fetchCompanies = async () => {
    await executeAction(() => getCompany(), true)
  }

  useEffect(() => {
    fetchCompanies()
  }, [])
  return (
    <div>
      Asset
    </div>
  )
}

export default Asset
