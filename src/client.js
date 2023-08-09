import { PrismaClient } from '@prisma/client';
// import config from './config';
// const logger = require('./config/logger');

const prisma = global.prisma || new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    }
  ],
});

if (process.env.NODE_ENV === 'development') {
  global.prisma = prisma;
  prisma.$on('query', (e) => {
    // logger.info(`Query: ${e.query}\nParams: ${e.params}\nDuration: ${e.duration}ms`, { label: 'prisma' })
  })
};

export default prisma;