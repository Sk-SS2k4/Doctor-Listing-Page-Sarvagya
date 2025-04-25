import React, { useState } from 'react';


function FilterPanel({
  availableSpecialties,
  selectedSpecialties,
  consultType,
  sortBy,
  onConsultTypeChange,
  onSpecialtyChange,
  onSortChange
}) {
  const [searchSpecialty, setSearchSpecialty] = useState('');

  // Format specialty ID for test cases
  const formatSpecialtyId = (specialty) => {
    return `filter-specialty-${specialty.replace(/\//g, '-')}`;
  };

  // Filter specialties based on search input
  const filteredSpecialties = availableSpecialties.filter((specialty) =>
    specialty.toLowerCase().includes(searchSpecialty.toLowerCase())
  );

  // Select all specialties
  const handleSelectAllSpecialties = () => {
    availableSpecialties.forEach((specialty) => {
      if (!selectedSpecialties.includes(specialty)) {
        onSpecialtyChange(specialty, true);
      }
    });
  };

  // Clear all filters
  const handleClearAll = () => {
    onConsultTypeChange('');
    onSortChange('');
    selectedSpecialties.forEach((specialty) => onSpecialtyChange(specialty, false));
  };

  return (
    <div className="filter-panel">
      
      {/* Consultation Mode */}
      <div className="filter-section">
        <h3 className="filter-title" data-testid="filter-header-moc">Consultation Mode</h3>
        <div className="filter-options">
          <label className="filter-option">
            <input
              type="radio"
              name="consultType"
              checked={consultType === 'Video Consult'}
              onChange={() => onConsultTypeChange('Video Consult')}
              data-testid="filter-video-consult"
            />
            Video Consult
          </label>
          <label className="filter-option">
            <input
              type="radio"
              name="consultType"
              checked={consultType === 'In Clinic'}
              onChange={() => onConsultTypeChange('In Clinic')}
              data-testid="filter-in-clinic"
            />
            In Clinic
          </label>
          <label className="filter-option">
            <input
              type="radio"
              name="consultType"
              checked={consultType === ''}
              onChange={() => onConsultTypeChange('')}
            />
            All
          </label>
        </div>
      </div>

      {/* Specialities */}
      <div className="filter-section">
        <h3 className="filter-title" data-testid="filter-header-speciality">Speciality</h3>

        {/* Search box */}
        <div className="specialty-search">
          <input
            type="text"
            placeholder="Search specialties"
            value={searchSpecialty}
            onChange={(e) => setSearchSpecialty(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Select All Button */}
        <div className="select-all-container">
          <button className="select-all-btn" onClick={handleSelectAllSpecialties}>
            Select All
          </button>
        </div>

        {/* Speciality options */}
        <div className="filter-options specialties">
          {filteredSpecialties.map((specialty) => (
            <label className="filter-option" key={specialty}>
              <input
                type="checkbox"
                checked={selectedSpecialties.includes(specialty)}
                onChange={(e) => onSpecialtyChange(specialty, e.target.checked)}
                data-testid={formatSpecialtyId(specialty)}
              />
              {specialty}
            </label>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div className="filter-section">
        <h3 className="filter-title" data-testid="filter-header-sort">Sort</h3>
        <div className="filter-options">
          <label className="filter-option">
            <input
              type="radio"
              name="sort"
              checked={sortBy === 'fees'}
              onChange={() => onSortChange('fees')}
              data-testid="sort-fees"
            />
            Fees (Low to High)
          </label>
          <label className="filter-option">
            <input
              type="radio"
              name="sort"
              checked={sortBy === 'experience'}
              onChange={() => onSortChange('experience')}
              data-testid="sort-experience"
            />
            Experience (High to Low)
          </label>
        </div>
      </div>

      {/* Clear All Button */}
      <div className="clear-filters">
        <button className="clear-all-btn" onClick={handleClearAll}>
          Clear All Filters
        </button>
      </div>

    </div>
  );
}

export default FilterPanel;
