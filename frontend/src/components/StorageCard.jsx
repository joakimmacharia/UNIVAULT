import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Star, MapPin, ShieldCheck } from 'lucide-react';
import { roomImage } from '../data/assets';

/** Horizontal storage listing card (matches the browse listing rows). */
const StorageCard = ({ unit, index = 0 }) => {
  const navigate = useNavigate();
  const [fav, setFav] = useState(false);

  const name = unit.unit_number || `Unit #${unit.id}`;
  const price = unit.price_per_month || unit.price || '—';
  const rating = unit.rating || 4.5;
  const reviews = unit.reviews ?? unit.review_count ?? 0;
  const distance = unit.distance || (unit.location ? `${unit.location}` : 'Near JKUAT');
  const amenities = unit.amenities || ['24/7 Security', 'CCTV', 'Easy Access'];
  const img = unit.image || roomImage(unit.id || index);

  const toggleFav = (e) => { e.stopPropagation(); setFav(!fav); };

  return (
    <article className="storage-card" onClick={() => navigate(`/storage/${unit.id}`)} role="button" tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/storage/${unit.id}`)}>
      <div className="storage-thumb">
        {unit.featured && <span className="storage-featured">Featured</span>}
        <button className={`fav-btn${fav ? ' active' : ''}`} onClick={toggleFav} aria-label="Add to favourites">
          <Heart />
        </button>
        <img src={img} alt={name} />
      </div>

      <div className="storage-body">
        <div className="storage-body-top">
          <div>
            <h3 className="storage-name">{name}</h3>
            <div className="storage-meta">
              <MapPin /> {unit.location || 'Juja'} <span className="dot" /> {distance}
            </div>
            <div className="storage-rating">
              <Star /> {rating} <span>({reviews} reviews)</span>
            </div>
          </div>
          <div className="storage-price">
            <div className="amt">KSh {price}</div>
            <div className="per">/month</div>
          </div>
        </div>

        <div className="storage-amenities">
          {amenities.slice(0, 4).map((a) => (
            <span className="chip" key={a}><ShieldCheck /> {a}</span>
          ))}
        </div>
      </div>
    </article>
  );
};

export default StorageCard;
