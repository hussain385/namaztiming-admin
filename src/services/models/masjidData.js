import PropTypes from 'prop-types';

export const MasjidDataModel = PropTypes.shape({
  user: PropTypes.shape({
    id: PropTypes.string,
    phone: PropTypes.string,
    name: PropTypes.string,
    isAdmin: PropTypes.bool,
    email: PropTypes.string,
  }),
  adminId: PropTypes.string,
  name: PropTypes.string,
  g: PropTypes.shape({
    geohash: PropTypes.string,
    geopoint: PropTypes.shape({
      latitude: PropTypes.number,
      longitude: PropTypes.number,
    }),
  }),
  pictureURL: PropTypes.string,
  address: PropTypes.string,
  id: PropTypes.string,
  timing: PropTypes.shape({
    isha: PropTypes.string,
    fajar: PropTypes.string,
    zohar: PropTypes.string,
    asar: PropTypes.string,
    magrib: PropTypes.string,
  }),
});
