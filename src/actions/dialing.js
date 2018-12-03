import ZAF from '../misc/ZAFClient';

export const actions = {
  SET_NUMBER: 'SET_NUMBER',
  SET_COUNTRY_CODE: 'SET_COUNTRY_CODE',
  SET_DIALING: 'SET_DIALING'
}

export const setNumber = (number) => dispatch => {
  dispatch({
    type: actions.SET_NUMBER,
    number,
  });
};

export const setCountryCode = (countryCode) => dispatch => {
  dispatch({
    type: actions.SET_COUNTRY_CODE,
    countryCode: countryCode
  });
};

export const setDialing = (dialing) => dispatch => {
  dispatch({
    type: actions.SET_DIALING,
    isDialing: dialing 
  });
};
