import PropTypes from 'prop-types';

const Timing = PropTypes.shape({
  isha: PropTypes.string.isRequired,
  fajar: PropTypes.string.isRequired,
  zohar: PropTypes.string.isRequired,
  asar: PropTypes.string.isRequired,
  magrib: PropTypes.string.isRequired,
  jummah: PropTypes.string,
  eidUlAddah: PropTypes.string,
  eidUlFitr: PropTypes.string,
});

export const MasjidFormModel = PropTypes.shape({
  name: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  gLink: PropTypes.string,
  pictureURL: PropTypes.string,
  userEmail: PropTypes.string,
  userName: PropTypes.string,
  userPhone: PropTypes.string,
  latitude: PropTypes.string.isRequired,
  longitude: PropTypes.string.isRequired,
  timing: Timing.isRequired,
});

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
  timing: Timing,
});
