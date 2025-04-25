// src/components/SearchBar.jsx
import React, { useState, useEffect, useRef } from 'react';

function SearchBar({ doctors, onSearch, searchTerm }) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState(searchTerm || '');
  const searchRef = useRef(null);

  useEffect(() => {
    setInputValue(searchTerm || '');
  }, [searchTerm]);

  useEffect(() => {
    // Close suggestions when clicking outside
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchRef]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    
    if (value.trim() === '') {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    
    // Find matching doctors
    const matches = doctors
      .filter(doctor => 
        doctor.name.toLowerCase().includes(value.toLowerCase())
      )
      .slice(0, 3)
      .map(doctor => doctor.name);
    
    setSuggestions(matches);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(inputValue);
    setShowSuggestions(false);
  };

  return (
    <div className="search-bar" ref={searchRef}>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search Symptoms, Doctors, Specialists, Clinics"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => inputValue.trim() !== '' && suggestions.length > 0 && setShowSuggestions(true)}
          data-testid="autocomplete-input"
        />
        <button type="submit">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </form>
      {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((suggestion, index) => (
            <li 
              key={index} 
              onClick={() => handleSuggestionClick(suggestion)}
              data-testid="suggestion-item"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;