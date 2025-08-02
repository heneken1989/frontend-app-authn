import { useEffect, useState } from 'react';

import { getConfig } from '@edx/frontend-platform';
import { fetchAuthenticatedUser, getAuthenticatedUser } from '@edx/frontend-platform/auth';
import PropTypes from 'prop-types';

import {
  DEFAULT_REDIRECT_URL,
} from '../data/constants';

/**
 * This wrapper redirects the requester to our default redirect url if they are
 * already authenticated.
 */
const UnAuthOnlyRoute = ({ children }) => {
  const [authUser, setAuthUser] = useState({});
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    fetchAuthenticatedUser({ forceRefresh: !!getAuthenticatedUser() }).then((authenticatedUser) => {
      setAuthUser(authenticatedUser);
      setIsReady(true);
    });
  }, []);

  if (isReady) {
    if (authUser && authUser.username) {
      // Redirect to MFE_BASE_URL instead of LMS_BASE_URL
      const redirectUrl = getConfig().BASE_URL || getConfig().LMS_BASE_URL;
      global.location.href = redirectUrl;
      return null;
    }

    return children;
  }

  return null;
};

UnAuthOnlyRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default UnAuthOnlyRoute;
