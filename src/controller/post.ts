import { Router } from 'express';
import { auth } from '../middleware/authenticate';

const router = Router();

router.post('/', auth, (req, res) => {
  res.status(200).json({
    message: 'Hello Authenticated!',
  });
});

export { router };
