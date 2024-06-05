import { useApp } from "../../hooks/useApp";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserById } from "../../api/api";
import { Loading } from "react-daisyui";
import PropTypes from "prop-types";

/**
 * @param {children: React.FC | Array<React.FC>} props
 * @returns {React.FC}
 */
export default function Authenticated({ children }) {
  const app = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (app.currentUser) {
        const fetchedUser = await getUserById(app.currentUser.id);
        setUser(fetchedUser);
      }
      
      setLoading(false);
    };

    fetchUser();
  }, [app]);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login", { state: location.pathname });
    }
  }, [user, loading, location.pathname, navigate]);

  return loading ? (
    <div className="w-full h-full flex justify-center align-center items-center">
      <Loading />
    </div>
  ) : (
    user && <>{children}</>
  );
}

Authenticated.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};
