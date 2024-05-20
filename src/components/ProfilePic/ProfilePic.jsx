

export default function ProfilePic({profilePic, dimensions}) {
  return (
    <div className='rounded-full me-8 flex flex-row justify-center items-center avatar' style={{width: dimensions, height: dimensions}}>
      {profilePic && <img src={profilePic} alt="pic" className='object-cover rounded-full w-full h-full' />}
    </div>
  )
}