import express from 'express';
import * as catalogCtrl from '../../controllers/items';
import auth from '../auth';
import multer from 'multer';

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
 
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 15
  },
  fileFilter: fileFilter
});

const router = express.Router();

router.post('/', async (req, res, next) => {
  console.log('request')
  const loadItems = await catalogCtrl.loadItems(req.body, next);

  await res.send(loadItems);
});

router.post('/update', auth.required, async (req, res, next) => {
  const createItem = await catalogCtrl.updateItem(req.body, next);

  await res.send(createItem);
});

router.get('/info/:id', (req, res, next) => {
  let i = 0;
  i++;
  console.log('request ' + i);
  // const detailItem = await catalogCtrl.detailItem(req.params.id, next);
  return res.send({hello: 'hello'});
  // await res.send(detailItem);
});

router.post('/search', async (req, res, next) => {
  const searchItems = await catalogCtrl.searchItems(req.body, next);

  await res.send(searchItems);
});
 
router.post('/create', auth.required, upload.array('images'), async (req, res, next) => {
  const createItem = await catalogCtrl.createItem(req.body, req.files, next);

  await res.send(createItem);
});

router.delete('/:id', auth.required, async (req, res, next) => {
  const removeItem = await catalogCtrl.removeItem(req.params.id, next);

  await res.send(removeItem); 
});

export default router;