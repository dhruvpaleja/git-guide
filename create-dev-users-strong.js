// Quick script to create dev users with strong passwords
const users = [
  { email: 'user@test.com', password: 'User123!@#', name: 'Test User' },
  { email: 'therapist@test.com', password: 'Therapist123!@#', name: 'Dr. Test Therapist' },
  { email: 'astrologer@test.com', password: 'Astrologer123!@#', name: 'Test Astrologer' },
  { email: 'admin@test.com', password: 'Admin123!@#', name: 'Test Admin' }
];

console.log('🚀 Creating development users with strong passwords...');

// Create users one by one with longer delays to avoid rate limiting
users.forEach(async (user, index) => {
  setTimeout(async () => {
    try {
      console.log(`Creating ${user.email}...`);
      const response = await fetch('http://localhost:3000/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user)
      });
      
      const result = await response.json();
      if (result.success) {
        console.log(`✅ Created ${user.email}`);
      } else {
        console.log(`❌ Failed to create ${user.email}:`, result.error?.message || result.error);
      }
    } catch (error) {
      console.error(`❌ Failed to create ${user.email}:`, error.message);
    }
  }, index * 3000); // Stagger requests by 3 seconds to avoid rate limiting
});

console.log('📋 New Development Credentials:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
users.forEach(user => {
  console.log(`${user.email}: ${user.password}`);
});
