const INITIAL_STATE = {
  startDate: "",
  endDate: "",
  dob: "",
};

export const dateReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case `SET_DOB`:
      return { ...state, ...action.payload };
    case `CLEAR_DOB`:
      return { ...state, dob: "" };
    default:
      return state;
  }
};
