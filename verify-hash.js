const bcrypt = require('bcryptjs');

const password = 'admin123';
const hash = '$2b$10$ioRz/7d8diqs/76VUZUzROPjXMb.yiXmgYL9zN3H83bRKTjITPEx2';

bcrypt.compare(password, hash).then(match => {
  console.log('Password:', password);
  console.log('Hash:', hash);
  console.log('Match:', match);
});
