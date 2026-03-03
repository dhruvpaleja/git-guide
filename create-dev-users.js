// Quick script to create dev users
const users = [
  { email: 'user@test.com', password: 'user123', name: 'Test User' },
  { email: 'therapist@test.com', password: 'therapist123', name: 'Dr. Test Therapist' },
  { email: 'astrologer@test.com', password: 'astrologer123', name: 'Test Astrologer' },
  { email: 'admin@test.com', password: 'admin123', name: 'Test Admin' }
];

// Create users one by one
users.forEach(async (user, index) => {
  setTimeout(async () => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user)
      });
      
      const result = await response.json();
      console.log(`✅ Created ${user.email}:`, result);
    } catch (error) {
      console.error(`❌ Failed to create ${user.email}:`, error);
    }
  }, index * 1000); // Stagger requests by 1 second
});

console.log('🚀 Creating development users...');
