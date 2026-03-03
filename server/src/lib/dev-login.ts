import { prisma } from './prisma.js';

// Quick dev login - bypass password for development
export async function devLogin(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
        therapistProfile: true,
        settings: true,
      }
    });

    if (!user) {
      throw new Error(`User not found: ${email}`);
    }

    // Generate tokens directly for development
    const accessToken = generateDevToken(user);
    const refreshToken = generateDevRefreshToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role.toLowerCase(),
      },
      accessToken,
      refreshToken,
      profile: user.profile,
      therapistProfile: user.therapistProfile,
      settings: user.settings,
    };
  } catch (error) {
    console.warn('Database connection failed, please run npm run seed:test to create test accounts:', error);
    throw new Error(`Database connection failed. Please run 'npm run seed:test' to create test accounts in the database.`);
  }
}

// Simple token generation for development
function generateDevToken(user: any) {
  const payload = {
    sub: user.id,
    role: user.role,
    jti: crypto.randomUUID(),
    iss: 'soul-yatri-api',
    aud: 'soul-yatri-client',
  };
  
  // For development, use a simple base64 encoded token (not secure for production!)
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

function generateDevRefreshToken(userId: string) {
  const payload = {
    sub: userId,
    familyId: crypto.randomUUID(),
    type: 'refresh',
    jti: crypto.randomUUID(),
  };
  
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

// Development API endpoint helper
export async function createDevLoginEndpoint() {
  console.warn('\n Creating dev login shortcuts...');
  
  // Get current host for dynamic URLs
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const host = process.env.NODE_ENV === 'production' 
    ? process.env.VERCEL_URL || 'your-app.vercel.app'
    : 'localhost:3000';
  
  const devEndpoints = {
    user: `${protocol}://${host}/api/v1/dev-login/user@test.com`,
    therapist: `${protocol}://${host}/api/v1/dev-login/therapist@test.com`, 
    astrologer: `${protocol}://${host}/api/v1/dev-login/astrologer@test.com`,
    admin: `${protocol}://${host}/api/v1/dev-login/admin@test.com`,
  };

  console.warn('\n One-Click Dev Login URLs:');
  console.warn('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  Object.entries(devEndpoints).forEach(([role, url]) => {
    console.warn(`\n ${role.toUpperCase()}:`);
    console.warn(`   ${url}`);
    console.warn(`   (Open in browser or use with curl/postman)`);
  });

  console.warn('\n Usage Examples:');
  console.warn('   # Browser: Just click the links above');
  console.warn(`   # Curl: curl -X GET ${protocol}://${host}/api/v1/dev-login/user@test.com`);
  console.warn('   # Postman: Import URLs as GET requests');
  
  return devEndpoints;
}
