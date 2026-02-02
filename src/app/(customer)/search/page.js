import Search from '@/components/(customer)/pages/Search'
import React from 'react'

const page = async({searchParams }) => {

    const params = await searchParams;
  const searchValue = params?.search || "";

  return (
   <Search searchValue = {searchValue} />
  )
}

export default page