import React, { useState, useEffect } from 'react';

function DoctorCard({ doctor }) {
  const [imageState, setImageState] = useState({
    loading: true,
    error: false,
    src: doctor.image || ''
  });

  // Generate backup image with doctor's initials if the main image fails
  const generateBackupImage = (name) => {
    const doctorName = name || "Unknown";
    const initials = doctorName.split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    // Use a reliable service for generating avatar images
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=random&color=fff&size=80`;
  };

  useEffect(() => {
    // Reset image state when doctor changes
    setImageState({
      loading: true,
      error: false,
      src: doctor.image || ''
    });
  }, [doctor.id, doctor.image]);

  const handleImageError = () => {
    // When image fails to load, switch to backup
    setImageState({
      loading: false,
      error: true,
      src: generateBackupImage(doctor.name)
    });
  };

  const handleImageLoad = () => {
    setImageState(prevState => ({
      ...prevState,
      loading: false
    }));
  };

  // Display doctor name appropriately
  const displayName = doctor.name || "Unknown";
  const nameWithPrefix = displayName.startsWith("Dr. ")
    ? displayName
    : `Dr. ${displayName}`;

  // Generate random price of either 400 or 600
  const randomPrice = doctor.price !== undefined ? doctor.price : (Math.random() > 0.5 ? 600 : 400);

  return (
    <div className="doctor-card" data-testid="doctor-card">
      <div className="doctor-image">
        {imageState.loading && (
          <div className="image-loading-placeholder">
            <span className="loading-spinner"></span>
          </div>
        )}
        <img
          src={imageState.src}
          alt={`${nameWithPrefix}`}
          onError={handleImageError}
          onLoad={handleImageLoad}
          loading="lazy"
          className={`doctor-profile-pic ${imageState.loading ? 'hidden' : ''}`}
        />
      </div>
      <div className="doctor-info">
        <h2 data-testid="doctor-name">{nameWithPrefix}</h2>
        <p className="doctor-specialty">
          {doctor.specialties && doctor.specialties.length > 0
            ? doctor.specialties[0]
            : "General Physician"}
        </p>
        <p className="doctor-credentials">
          {doctor.qualifications || "MBBS"}
          {doctor.subspecialty && `, ${doctor.subspecialty}`}
        </p>
        <p className="experience" data-testid="doctor-experience">
          {doctor.experience || 0} yrs exp.
        </p>

        <div className="doctor-location">
          <span className="location-icon">🏥</span>
          <span className="clinic-name">
            {doctor.clinic || "Not specified"}
          </span>
        </div>

        <div className="doctor-address">
          <span className="address-icon">📍</span>
          <span className="location-name">
            {doctor.location || "Location not specified"}
          </span>
        </div>
      </div>
      <div className="doctor-booking">
        <div className="fee" data-testid="doctor-fee">₹ {randomPrice}</div>
        <button className="book-btn">Book Appointment</button>
      </div>
    </div>
  );
}

export default DoctorCard;
//hello