

export default function ProfilePic({profilePic, dimensions, className}) {
  return (
    <div className={`rounded-full flex flex-row justify-center items-center avatar ${className}`} style={{width: dimensions, height: dimensions}}>
      {profilePic && <img src={profilePic} alt="pic" className='object-cover rounded-full w-full h-full' />}
    </div>
  )
}