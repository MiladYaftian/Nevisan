const AlertMessage = ({ severity, error, clearError }) => {
    if (!error) return null;

    const handleClose = () => {
        if (clearError) {
            clearError();
        }
    };

    let backgroundColor;
    let textColor;

    switch (severity) {
        case "error":
            backgroundColor = "#f8d7da"; 
            textColor = "#721c24"; 
            break;
        case "success":
            backgroundColor = "#d4edda"; 
            textColor = "#155724"; 
            break;
        default:
            backgroundColor = "#f8d7da"; 
            textColor = "#721c24"; 
    }

    return (
        <div className="alert-container" style={{ backgroundColor, color: textColor }}>
            <p className="error-title">خطا</p>
            <p className="error-message">{error}</p>
            {clearError && (
                <button className="close-button" onClick={handleClose}>
                    &times;
                </button>
            )}
        </div>
    );
};

export default AlertMessage;