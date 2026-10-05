import { useState } from 'react';
import { DAVID_IMG } from '../../data/assets';

/**
 * Avatar with graceful fallback to initials when the image fails to load
 * (e.g. offline dev environment). David's portrait is a full-body shot, so
 * when it appears in a small circular avatar we zoom to his face.
 */
const Avatar = ({ src, name = '', size = 'md', ring = false, online = false, className = '' }) => {
  const [failed, setFailed] = useState(false);
  const initial = (name || 'U').charAt(0).toUpperCase();
  const showImg = src && !failed;
  const isDavid = src === DAVID_IMG;

  const imgStyle = isDavid
    ? { width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', transform: 'scale(1.9)', transformOrigin: '50% 14%' }
    : { width: '100%', height: '100%', objectFit: 'cover' };

  const inner = (
    <span className={`avatar avatar-${size} ${ring ? 'avatar-ring' : ''} ${className}`} style={{ background: isDavid ? '#fff' : undefined }}>
      {showImg ? (
        <img src={src} alt={name || 'avatar'} onError={() => setFailed(true)} style={imgStyle} />
      ) : (
        initial
      )}
    </span>
  );

  if (!online) return inner;
  return (
    <span className="avatar-wrap">
      {inner}
      <span className="online-dot" aria-label="online" />
    </span>
  );
};

export default Avatar;
