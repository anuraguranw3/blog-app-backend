const { PrismaClient } = require('../prisma/generated/index.js');

const prisma = new PrismaClient();

module.exports = prisma;