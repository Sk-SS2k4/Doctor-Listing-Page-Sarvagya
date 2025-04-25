// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import FilterPanel from './components/FilterPanel';
import DoctorList from './components/DoctorList';

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [consultType, setConsultType] = useState('');
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [availableSpecialties, setAvailableSpecialties] = useState([]);

  // Better image preloading with timeout
  const preloadImage = (url) => {
    return new Promise((resolve, reject) => {
      if (!url || url.trim() === '') {
        reject(new Error('Invalid image URL'));
        return;
      }

      // Set a timeout to avoid long waits for slow images
      const timeout = setTimeout(() => {
        reject(new Error('Image loading timed out'));
      }, 5000); // 5 second timeout

      const img = new Image();
      img.src = url;
      
      img.onload = () => {
        clearTimeout(timeout);
        resolve(url);
      };
      
      img.onerror = () => {
        clearTimeout(timeout);
        reject(new Error('Failed to load image'));
      };
    });
  };

  // Generate placeholder with doctor's initials
  const generateInitialsPlaceholder = (doctorName) => {
    const name = doctorName || 'Unknown Doctor';
    const initials = name.split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
    
    // Use a more reliable placeholder service with doctor initials
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=random&color=fff&size=80`;
  };

  // Process doctor data with proper field formatting
  const processDoctorData = (doctorData) => {
    return doctorData.map(async (doctor, index) => {
      // Handle image loading with better error handling
      let finalImageUrl;
      
      try {
        if (doctor.image) {
          finalImageUrl = await preloadImage(doctor.image);
        } else {
          finalImageUrl = generateInitialsPlaceholder(doctor.name);
        }
      } catch (error) {
        console.warn(`Using placeholder for ${doctor.name}: ${error.message}`);
        finalImageUrl = generateInitialsPlaceholder(doctor.name);
      }
      
      // Extract qualifications from text if available
      const qualificationsMatch = doctor.qualifications || 
        (typeof doctor.education === 'string' && doctor.education.match(/[A-Z]+(?:,\s*[A-Z]+)*/)) || 
        'MBBS';
      
      // Format qualification text
      const qualifications = Array.isArray(qualificationsMatch) 
        ? qualificationsMatch[0] 
        : (typeof qualificationsMatch === 'string' ? qualificationsMatch : 'MBBS');
      
      // Extract subspecialty if available (e.g., "MD-General Medicine")
      let subspecialty = '';
      if (doctor.subspecialty) {
        subspecialty = doctor.subspecialty;
      } else if (typeof doctor.education === 'string' && doctor.education.includes('in')) {
        const subspecialtyMatch = doctor.education.match(/in\s+([A-Za-z\s]+)/);
        if (subspecialtyMatch && subspecialtyMatch[1]) {
          subspecialty = subspecialtyMatch[1];
        }
      }
      
      // Return properly structured doctor data
      return {
        ...doctor,
        id: doctor.id || `doctor-${index + 1}`,
        name: doctor.name || 'Unknown Doctor',
        image: finalImageUrl,
        specialties: Array.isArray(doctor.specialties) ? doctor.specialties : [],
        experience: typeof doctor.experience === 'number' ? doctor.experience : 0,
        fee: typeof doctor.fee === 'number' ? doctor.fee : 0,
        consultType: doctor.consultType || 'In Clinic',
        clinic: typeof doctor.clinic === 'object' ? doctor.clinic.name || '' : (doctor.clinic || ''),
        location: typeof doctor.location === 'object' ? doctor.location.address || '' : (doctor.location || ''),
        qualifications: qualifications,
        subspecialty: subspecialty
      };
    });
  };

  // Fetch doctors data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json');
        
        if (!response.ok) {
          throw new Error(`API responded with status ${response.status}`);
        }
        
        const data = await response.json();
        
        // Process all doctor data in parallel
        const doctorPromises = processDoctorData(data);
        const processedData = await Promise.all(doctorPromises);
        
        setDoctors(processedData);
        
        // Extract unique specialties for filter panel
        const specialtiesList = Array.from(
          new Set(
            processedData.flatMap(doctor => 
              Array.isArray(doctor.specialties) ? doctor.specialties : []
            )
          )
        ).sort();
        
        setAvailableSpecialties(specialtiesList);
        setFilteredDoctors(processedData);
        setLoading(false);
      } catch (error) {
        console.error('Error in data fetching:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let result = [...doctors];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(doctor => 
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply specialty filter
    if (selectedSpecialties.length > 0) {
      result = result.filter(doctor => 
        selectedSpecialties.some(specialty => 
          doctor.specialties && doctor.specialties.includes(specialty)
        )
      );
    }
    
    // Apply consultation type filter
    if (consultType) {
      result = result.filter(doctor => 
        doctor.consultType === consultType
      );
    }
    
    // Apply sorting
    if (sortBy === 'fees') {
      result.sort((a, b) => a.fee - b.fee);
    } else if (sortBy === 'experience') {
      result.sort((a, b) => b.experience - a.experience);
    }
    
    setFilteredDoctors(result);
  }, [doctors, searchTerm, selectedSpecialties, consultType, sortBy]);

  // Handle search
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  // Handle specialty filter change
  const handleSpecialtyChange = (specialty, isChecked) => {
    if (isChecked) {
      setSelectedSpecialties([...selectedSpecialties, specialty]);
    } else {
      setSelectedSpecialties(selectedSpecialties.filter(s => s !== specialty));
    }
  };

  // Handle consultation type change
  const handleConsultTypeChange = (type) => {
    setConsultType(type);
  };

  // Handle sort change
  const handleSortChange = (sort) => {
    setSortBy(sort);
  };

  // Loading state with a better UI
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading doctors data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error">
          <p>Sorry, we couldn't load the doctors data.</p>
          <p>Error: {error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="header">
        <SearchBar 
          doctors={doctors} 
          onSearch={handleSearch} 
          searchTerm={searchTerm}
        />
      </div>
      
      <div className="content">
        <div className="sidebar">
          <FilterPanel 
            availableSpecialties={availableSpecialties}
            selectedSpecialties={selectedSpecialties}
            consultType={consultType}
            sortBy={sortBy}
            onConsultTypeChange={handleConsultTypeChange}
            onSpecialtyChange={handleSpecialtyChange}
            onSortChange={handleSortChange}
          />
        </div>
        
        <div className="main">
          <div className="results-count">
            {filteredDoctors.length} {filteredDoctors.length === 1 ? 'doctor' : 'doctors'} found
          </div>
          <DoctorList doctors={filteredDoctors} />
        </div>
      </div>
    </div>
  );
}

export default App;