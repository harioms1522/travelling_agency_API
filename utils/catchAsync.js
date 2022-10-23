/*
    It takes an async function 

    Takes a function then returns a function like middleware to be called by route
    and this returned function then called the parameter function and the catch is used on this and transferred to the error handling route
*/

module.exports = fn => (req, res, next) => {
      fn(req, res, next).catch(next);
    };
  ;