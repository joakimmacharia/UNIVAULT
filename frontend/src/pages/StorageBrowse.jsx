import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStorageUnits } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const StorageBrowse = () => {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 1,
  });
  
  const [filters, setFilters] = useState({
    search: '',
    size: '',
    location: '',
    available: '',
    minPrice: '',
    maxPrice: '',
  });

  const fetchUnits = async (page = 1) => {
    setLoading(true);
    try {
      const queryParams = { ...filters, page, limit: pagination.limit };
      const response = await getStorageUnits(queryParams);
      
      const fetchedUnits = response.data.units || response.data.storage_units || [];
      setUnits(Array.isArray(fetchedUnits) ? fetchedUnits : []);
      
      if (response.data.pagination) {
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch units:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnits(1);
    // eslint-disable-next-line
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchUnits(1); // Reset to page 1 on new search
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      size: '',
      location: '',
      available: '',
      minPrice: '',
      maxPrice: '',
    });
    // Need to wait for state to clear before fetching, or just pass empty obj
    setTimeout(() => {
      // Create a dummy event to call submit, or just fetch directly
      getStorageUnits({ page: 1, limit: pagination.limit }).then(response => {
        setUnits(response.data.units || []);
        if (response.data.pagination) setPagination(response.data.pagination);
      });
    }, 0);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchUnits(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="page-container">
      <div className="container">
        <div className="page-header">
          <div>
            <h1 className="page-title" id="browse-title">
              Browse <span className="gradient-text">Storage Units</span>
            </h1>
            <p className="page-subtitle">Find the perfect storage space for your needs in Juja</p>
          </div>
        </div>

        {/* Advanced Filter Bar */}
        <div className="search-container">
          <form className="advanced-filter-bar" id="filter-bar" onSubmit={handleFilterSubmit}>
            
            {/* Top Row: Search & Availability */}
            <div className="filter-row">
              <div className="filter-group search-group">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  name="search"
                  className="form-input search-input"
                  placeholder="Search by building, description, or location..."
                  value={filters.search}
                  onChange={handleFilterChange}
                />
              </div>
            </div>

            {/* Bottom Row: Detailed Filters */}
            <div className="filter-row detailed-filters">
              <div className="filter-group">
                <label className="filter-label">Size</label>
                <select name="size" className="form-select" value={filters.size} onChange={handleFilterChange}>
                  <option value="">All Sizes</option>
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">Location</label>
                <input
                  type="text"
                  name="location"
                  className="form-input"
                  placeholder="e.g., Gate A"
                  value={filters.location}
                  onChange={handleFilterChange}
                />
              </div>

              <div className="filter-group price-group">
                <label className="filter-label">Price Range (KES)</label>
                <div className="price-inputs">
                  <input
                    type="number"
                    name="minPrice"
                    className="form-input"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                  />
                  <span>-</span>
                  <input
                    type="number"
                    name="maxPrice"
                    className="form-input"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                  />
                </div>
              </div>

              <div className="filter-group">
                <label className="filter-label">Status</label>
                <select name="available" className="form-select" value={filters.available} onChange={handleFilterChange}>
                  <option value="">All Units</option>
                  <option value="true">Available</option>
                  <option value="false">Occupied</option>
                </select>
              </div>
            </div>

            <div className="filter-actions-row">
              <button type="submit" className="btn btn-primary" id="apply-filters">
                Search
              </button>
              <button type="button" className="btn btn-outline" id="clear-filters" onClick={handleClearFilters}>
                Clear
              </button>
            </div>
          </form>
        </div>

        {/* Units Grid */}
        {loading ? (
          <LoadingSpinner />
        ) : units.length === 0 ? (
          <div className="empty-state" id="no-units">
            <div className="empty-icon">🏛️</div>
            <h3>No storage units found</h3>
            <p>Try adjusting your search criteria or price range</p>
          </div>
        ) : (
          <>
            <div className="units-grid" id="units-grid">
              {units.map((unit) => (
                <Link
                  to={`/storage/${unit.id}`}
                  key={unit.id}
                  className="unit-card"
                  id={`unit-${unit.id}`}
                >
                  <div className="unit-card-header">
                    <span className="unit-label">{unit.unit_number || `Unit #${unit.id}`}</span>
                    <span className={`badge ${unit.is_available ? 'badge-active' : 'badge-cancelled'}`}>
                      {unit.is_available ? 'Available' : 'Occupied'}
                    </span>
                  </div>
                  <div className="unit-card-body">
                    <div className="unit-detail">
                      <span className="unit-detail-icon">📐</span>
                      <span>Size: <strong>{unit.size || 'N/A'}</strong></span>
                    </div>
                    <div className="unit-detail">
                      <span className="unit-detail-icon">📍</span>
                      <span>Location: <strong>{unit.location || 'N/A'}</strong></span>
                    </div>
                    {unit.description && (
                      <p className="unit-description">{unit.description}</p>
                    )}
                  </div>
                  <div className="unit-card-footer">
                    <span className="unit-price">
                      KES {unit.price_per_month || unit.price || '—'}<span className="price-period">/mo</span>
                    </span>
                    <span className="unit-view-link">View Details →</span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="pagination-container">
                <button 
                  className="btn btn-outline btn-sm"
                  disabled={pagination.page === 1}
                  onClick={() => handlePageChange(pagination.page - 1)}
                >
                  ← Previous
                </button>
                
                <span className="pagination-info">
                  Page <strong className="gradient-text">{pagination.page}</strong> of {pagination.totalPages}
                </span>

                <button 
                  className="btn btn-outline btn-sm"
                  disabled={pagination.page === pagination.totalPages}
                  onClick={() => handlePageChange(pagination.page + 1)}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StorageBrowse;
