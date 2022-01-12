import express from 'express';
import User from './user';
import Items from './items';

const router = express.Router();

router.use('/user', User);
router.use('/items', Items);

router.use((err, req, res, next) => {
  console.log('router index', err);
  if(err.name === 'ValidationError') {
    // const error = {
    //   errors: Object.keys(err.errors).reduce((errors, key) => {
    //     errors[key] = err.errors[key].message;

    //     return errors;
    //   }, {})
    // };
    const error = {
      error: err,
      code: 422,
      success: false
    }

    return res.json(error);
  }

  return next(err);
});

export default router;