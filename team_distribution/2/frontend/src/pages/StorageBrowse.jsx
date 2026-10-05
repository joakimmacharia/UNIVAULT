import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, MapPin, X } from 'lucide-react';
import { getStorageUnits } from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import StorageCard from '../components/StorageCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { DEMO_UNITS } from '../data/assets';

const StorageBrowse = () => {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [usingDemo, setUsingDemo] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 9, total: 0, totalPages: 1 });
  const [filters, setFilters] = useState({ search: '', size: '', location: '', available: '', minPrice: '', maxPrice: '' });

  const fetchUnits = async (page = 1, activeFilters = filters) => {
    setLoading(true);
    try {
      const response = await getStorageUnits({ ...activeFilters, page, limit: pagination.limit });
      const fetched = response.data.units || response.data.storage_units || [];
      const list = Array.isArray(fetched) ? fetched : [];
      if (list.length === 0 && page === 1 && !hasActiveFilters(activeFilters)) {
        setUnits(DEMO_UNITS);
        setUsingDemo(true);
      } else {
        setUnits(list);
        setUsingDemo(false);
      }
      if (response.data.pagination) setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to fetch units:', error);
      setUnits(DEMO_UNITS);
      setUsingDemo(true);
    } finally {
      setLoading(false);
    }
  };

  const hasActiveFilters = (f) => Object.values(f).some(Boolean);

  useEffect(() => { fetchUnits(1); /* eslint-disable-next-line */ }, []);

  const handleFilterChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });
  const handleSearch = (e) => { e.preventDefault(); fetchUnits(1); };
  const handleClear = () => {
    const cleared = { search: '', size: '', location: '', available: '', minPrice: '', maxPrice: '' };
    setFilters(cleared);
    fetchUnits(1, cleared);
  };

  return (
    <DashboardLayout>
      {/* Top bar: location + search */}
      <div className="browse-topbar">
        <span className="loc-select"><MapPin /> Juja</span>
        <form className="searchbar" onSubmit={handleSearch} style={{ flex: 1 }}>
          <Search />
          <input name="search" placeholder="Search location, area or landlord..."
            value={filters.search} onChange={handleFilterChange} />
        </form>
      </div>

      {/* Header */}
      <div className="browse-head">
        <div>
          <h1>Available Storage Near <span className="gradient-text">JKUAT</span></h1>
          <p>{units.length} space{units.length !== 1 ? 's' : ''} available{usingDemo ? ' (showing featured demo listings)' : ''}</p>
        </div>
        <button className="filter-btn" onClick={() => setShowFilters(!showFilters)}>
          <SlidersHorizontal /> Filters
        </button>
      </div>

      {/* Collapsible filters */}
      {showFilters && (
        <div className="detail-card" style={{ marginBottom: 20 }}>
          <div className="detail-header" style={{ marginBottom: 16 }}>
            <h3 className="detail-section-title" style={{ margin: 0 }}>Refine results</h3>
            <button className="btn-ghost" onClick={() => setShowFilters(false)} aria-label="Close"><X size={18} /></button>
          </div>
          <div className="form-row" style={{ marginBottom: 16 }}>
            <div className="field">
              <label className="field-label">Size</label>
              <select name="size" className="form-select" value={filters.size} onChange={handleFilterChange}>
                <option value="">All Sizes</option>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
            <div className="field">
              <label className="field-label">Availability</label>
              <select name="available" className="form-select" value={filters.available} onChange={handleFilterChange}>
                <option value="">All Units</option>
                <option value="true">Available</option>
                <option value="false">Occupied</option>
              </select>
            </div>
          </div>
          <div className="form-row" style={{ marginBottom: 16 }}>
            <div className="field">
              <label className="field-label">Min Price (KSh)</label>
              <input type="number" name="minPrice" className="form-input" placeholder="Min" value={filters.minPrice} onChange={handleFilterChange} />
            </div>
            <div className="field">
              <label className="field-label">Max Price (KSh)</label>
              <input type="number" name="maxPrice" className="form-input" placeholder="Max" value={filters.maxPrice} onChange={handleFilterChange} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-primary" onClick={handleSearch}>Apply Filters</button>
            <button className="btn btn-outline" onClick={handleClear}>Clear</button>
          </div>
        </div>
      )}

      {/* Listings */}
      {loading ? (
        <LoadingSpinner />
      ) : units.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><Search /></div>
          <h3>No storage units found</h3>
          <p>Try adjusting your search criteria or price range.</p>
          <button className="btn btn-primary" onClick={handleClear}>Reset filters</button>
        </div>
      ) : (
        <>
          <div className="storage-list">
            {units.map((unit, i) => <StorageCard key={unit.id} unit={unit} index={i} />)}
          </div>

          {pagination.totalPages > 1 && !usingDemo && (
            <div className="pagination-container">
              <button className="btn btn-outline btn-sm" disabled={pagination.page === 1}
                onClick={() => fetchUnits(pagination.page - 1)}>← Previous</button>
              <span className="pagination-info">Page <strong className="gradient-text">{pagination.page}</strong> of {pagination.totalPages}</span>
              <button className="btn btn-outline btn-sm" disabled={pagination.page === pagination.totalPages}
                onClick={() => fetchUnits(pagination.page + 1)}>Next →</button>
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
};

export default StorageBrowse;
