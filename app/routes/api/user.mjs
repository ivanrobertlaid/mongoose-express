import express from 'express';
import passport from 'passport';
import * as user from '../../controllers/user';
import auth from '../auth';

const router = express.Router();

router.get('/info/:username', auth.required, async (req, res, next) => {  
  const getInfoUser = await user.getInfo(req.params.username, next);

  await res.send(getInfoUser);
});

router.post('/update',  async (req, res, next) => {
  const saveInfoUser = await user.update(req.body, next);

  await res.send(saveInfoUser);
});

router.post('/signup', async (req, res, next) => {
  const signUpUser = await user.signUp(req.body, next);

  await res.send(signUpUser);
});

router.post('/signin', async (req, res, next) => {
  passport.authenticate('local', {session: false}, (err, user, info) => {
    if (err) { 
      return next(err);
    }

    if (user) {
      user.token = user.generateJWT();
      return res.json({success: true, user: user.toAuthJSON()});
    } else {
      return res.json(info);
    }
  })(req, res, next);
});

export default router;

// auth user
// router.get('/auth/facebook', passport.authenticate('facebook'), (req) => {
//   console.log(req);
// });

// router.get('/auth/facebook/callback',
//   passport.authenticate('facebook', { failureRedirect: '/login' }),
//   (req, res) => {
//     console.log(req);
//     // Successful authentication, redirect home.
//     res.send({success: true});
//   });