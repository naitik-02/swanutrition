import React from 'react'
import VideoSlider from './VideoSlider';

const VideoSection = ({data}) => {




  return (
<div className='px-5 md:px-20 my-10 '>
        <h3 className='text-center font-medium pb-10 text-3xl'>India’s Leading Multivitamin & Nutritional Supplement 
</h3>

<VideoSlider products={data}/>
    </div>
  )
}

export default VideoSection