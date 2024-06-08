import PropTypes from "prop-types";

/**
 * 
 * @param {{profilePic: string, dimensions: string, className: string}} props 
 * @returns {React.FC}
 */
export default function ProfilePic({ profilePic, dimensions, className }) {
  return (
    <div className={`rounded-full flex flex-row justify-center items-center avatar ${className}`} style={{ width: dimensions, height: dimensions }}>
      {profilePic && <img src={profilePic} alt="pic" className='object-cover rounded-full w-full h-full' />}
    </div>
  )
}

ProfilePic.propTypes = {
  profilePic: PropTypes.string.isRequired,
  dimensions: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
};