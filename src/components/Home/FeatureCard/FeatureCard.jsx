import PropTypes from "prop-types";

/**
 * @param {{img: string, title: string, text: string}} props 
 * @returns {JSX.Element}
 */
export default function FeatureCard({img, title, text}) {
  return (
    <div className="card w-72 bg-base-200 shadow-xl">
    <figure className="px-10 pt-10">
      <img
        src={img}
        alt="img"
        className="rounded-xl"
      />
    </figure>
    <div className="card-body items-center text-center">
      <h2 className="card-title">
        {title}
      </h2>
      <p className="text-sm">
        {text}
      </p>
      <div className="card-actions">
        {/* <button className="btn btn-warning">Buy Now</button> */}
      </div>
    </div>
  </div>
  )
}

FeatureCard.propTypes = {
  img: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
}