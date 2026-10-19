const weatherApi = "https://api.weather.gov/alerts/active?area=";

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('state-input');
  const button = document.getElementById('fetch-alerts');
  const alertsDisplay = document.getElementById('alerts-display');
  const errorMessage = document.getElementById('error-message');

  button.addEventListener('click', async () => {
    const stateAbbr = input.value.trim().toUpperCase();
    
    if (!stateAbbr) {
      displayError('Please enter a state abbreviation');
      return;
    }

    errorMessage.textContent = '';
    errorMessage.classList.add('hidden');
    alertsDisplay.textContent = '';

    try {
      const response = await fetch(`${weatherApi}${stateAbbr}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const alerts = data.features || [];
      const title = data.title || 'Weather Alerts';
      
      alertsDisplay.textContent = `${title}: ${alerts.length}`;
      
      alerts.forEach(alert => {
        const headline = alert.properties?.headline;
        if (headline) {
          const alertElement = document.createElement('div');
          alertElement.textContent = headline;
          alertsDisplay.append(alertElement);
        }
      });

      input.value = '';
    } catch (error) {
      displayError(error.message);
    }
  });

  function displayError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    alertsDisplay.textContent = '';
  }
});