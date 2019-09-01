
const sessions = [

  // ############# recquesting session ################

  // 0 Correct user info
  {
    mentorid: 1,
    questions: 'business',
  },

  // 1 Correct user info
  {
    mentorid: 1,
    questions: 'business',
  },

  // 2 User with invalid mentor id
  {
    mentorid: 'k',
    questions: 'business',
  },

  // 3 User with no mentor id
  {
    questions: 'business',
  },
  // 4 User with no questions
  {
    mentorid: 1,

  },

];
export default sessions;
