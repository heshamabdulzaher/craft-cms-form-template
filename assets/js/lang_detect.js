const getNavigatorLanguage = () => {
  if (navigator.languages && navigator.languages.length) {
    return navigator.languages[0];
  } else {
    return navigator.userLanguage || navigator.language || navigator.browserLanguage || 'en';
  }
}

const languagesPath = {
  ar: 'ar',
}

const lng = getNavigatorLanguage().split('-')[0]
const path = languagesPath[lng] || 'en'

const currentLocation = window.location
window.location = `${currentLocation}${path}`