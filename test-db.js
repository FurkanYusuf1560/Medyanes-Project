
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('Testing MongoDB connection...');
    try {
        await prisma.$connect();
        console.log('✅ Connection SUCCESSFUL!');
        console.log('Database is reachable correctly.');
    } catch (e) {
        console.error('❌ Connection FAILED');
        console.error('---------------------------------------------------');
        console.error(e.message);
        console.error('---------------------------------------------------');
        console.log('\nPossible causes:');
        console.log('1. IP Address not allowed in MongoDB Atlas (Network Access -> Allow 0.0.0.0/0)');
        console.log('2. Incorrect Username/Password in .env');
        console.log('3. Database name missing in connection string');
    } finally {
        await prisma.$disconnect();
    }
}

main();
