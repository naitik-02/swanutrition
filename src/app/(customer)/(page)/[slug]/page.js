import PageLayout from '@/components/Layout/pageLayout'
import React from 'react'

const page = async ({params}) => {
   const { slug } = await  params;
  return (
   <PageLayout slug={slug}/>
  )
}

export default page