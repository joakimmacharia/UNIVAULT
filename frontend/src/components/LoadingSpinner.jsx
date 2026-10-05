const LoadingSpinner = ({ fullScreen = false, size = 'md' }) => {
  return (
    <div className={`spinner-container ${fullScreen ? 'spinner-fullscreen' : ''}`} id="loading-spinner">
      <div className={`spinner spinner-${size}`}>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <span className="spinner-logo">◈</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
