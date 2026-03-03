import { prisma } from './prisma.js';

// Quick dev login - bypass password for development
export async function devLogin(email: string) {
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
  console.log('\n🚀 Creating dev login shortcuts...');
  
  const devEndpoints = {
    user: 'http://localhost:3000/api/v1/dev-login/user@test.com',
    therapist: 'http://localhost:3000/api/v1/dev-login/therapist@test.com', 
    astrologer: 'http://localhost:3000/api/v1/dev-login/astrologer@test.com',
    admin: 'http://localhost:3000/api/v1/dev-login/admin@test.com',
  };

  console.log('\n📱 One-Click Dev Login URLs:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  Object.entries(devEndpoints).forEach(([role, url]) => {
    console.log(`\n🔗 ${role.toUpperCase()}:`);
    console.log(`   ${url}`);
    console.log(`   (Open in browser or use with curl/postman)`);
  });

  console.log('\n💡 Usage Examples:');
  console.log('   # Browser: Just click the links above');
  console.log('   # Curl: curl -X GET http://localhost:3000/api/v1/dev-login/user@test.com');
  console.log('   # Postman: Import the URLs as GET requests');
  
  return devEndpoints;
}
