

export default function ProfilePic({profilePic}) {
  return (
    <div className='rounded-full me-8 flex flex-row justify-center items-center w-14 h-14'>
      {profilePic && <img src={profilePic} alt="pic" className='object-cover rounded-full w-full h-full' />}
    </div>
  )
}