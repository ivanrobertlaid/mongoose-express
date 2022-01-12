
export function ensureToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  console.log('ok');

  if(typeof bearerHeader !== undefined) {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    
    req.token = bearerHeader;
    console.log('ok');
    next();
  } else {
    console.log('er');
    res.send({er:'field auth'}); 
  }
};