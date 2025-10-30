import { PrismaClient, Role } from '../generated/prisma/index.js';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seeding...');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
            email: 'admin@example.com',
            name: 'Admin',
            password: adminPassword,
            role: Role.ADMIN,
            isEmailVerified: true
        }
    });

    console.log('✅ Created admin user:', admin.email);

    // Create regular user
    const userPassword = await bcrypt.hash('user123', 12);
    const user = await prisma.user.upsert({
        where: { email: 'user@example.com' },
        update: {},
        create: {
            email: 'user@example.com',
            name: 'Regular User',
            password: userPassword,
            role: Role.USER,
            isEmailVerified: true
        }
    });

    console.log('✅ Created regular user:', user.email);

    // Create sample summaries
    void (await prisma.summary.upsert({
        where: { id: 1 },
        update: {},
        create: {
            title: 'AI Technology Overview',
            originalText:
                'Artificial Intelligence (AI) has transformed numerous industries by enabling machines to perform tasks that traditionally required human intelligence. From natural language processing to computer vision, AI technologies are revolutionizing how we interact with technology and process information. Machine learning algorithms can now analyze vast amounts of data to identify patterns, make predictions, and automate complex decision-making processes.',
            summaryText:
                'AI has revolutionized industries through machine learning and automation, enabling pattern recognition and complex decision-making.',
            options: JSON.stringify({ length: 'medium', style: 'paragraph', extractKeywords: true }),
            wordCount: 18,
            originalWordCount: 72,
            compressionRatio: 4.0,
            confidence: 0.92,
            keywords: JSON.stringify(['AI', 'machine learning', 'automation', 'technology']),
            processingTime: 1250,
            userId: user.id
        }
    }));

    void (await prisma.summary.upsert({
        where: { id: 2 },
        update: {},
        create: {
            title: 'Climate Change Impact',
            originalText:
                'Climate change represents one of the most pressing challenges of our time. Rising global temperatures, melting ice caps, and changing weather patterns are affecting ecosystems worldwide. Scientists have documented increased frequency of extreme weather events, sea level rise, and shifts in agricultural productivity. The consequences extend beyond environmental impacts to economic and social disruption.',
            summaryText:
                'Climate change causes rising temperatures, extreme weather, and environmental disruption with economic consequences.',
            options: JSON.stringify({ length: 'short', style: 'paragraph', extractKeywords: false }),
            wordCount: 14,
            originalWordCount: 58,
            compressionRatio: 4.14,
            confidence: 0.88,
            keywords: null,
            processingTime: 980,
            userId: user.id
        }
    }));

    console.log('✅ Created sample summaries for user:', user.email);
}

main()
    .catch(e => {
        console.error('❌ Error during seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
