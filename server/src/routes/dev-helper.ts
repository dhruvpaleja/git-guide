import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import bcrypt from 'bcrypt';
import { tokensService } from '../services/tokens.service.js';
import { config } from '../config/index.js';

const router = Router();

// Enable in development and production for testing
if (config.isDevelopment || config.isProduction) {
  
  // Create dev user endpoint
  router.get('/dev-create-user/:email/:password/:name', async (req, res) => {
    try {
      const { email, password, name } = req.params;
      
      // Check if user exists
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.json({
          success: true,
          data: {
            message: `✅ User ${email} already exists`,
            user: {
              id: existingUser.id,
              email: existingUser.email,
              name: existingUser.name,
              role: existingUser.role,
            }
          }
        });
      }

      // Create new user
      const passwordHash = await bcrypt.hash(password, 12);
      const user = await prisma.user.create({
        data: {
          email,
          passwordHash,
          name: name.replace(/%20/g, ' '), // Replace %20 with space
          isVerified: true,
        },
      });

      // Create profiles based on email
      if (email.includes('therapist')) {
        await prisma.therapistProfile.create({
          data: {
            userId: user.id,
            specializations: ['anxiety', 'depression', 'relationships'],
            approach: 'MIXED',
            languages: ['english', 'hindi'],
            qualifications: ['M.Phil Clinical Psychology', 'RCI Licensed'],
            experience: 5,
            bio: 'Experienced therapist specializing in anxiety and relationship counseling.',
            pricePerSession: 1500,
            isVerified: true,
            isAvailable: true,
          }
        });
      } else if (email.includes('user')) {
        await prisma.userProfile.create({
          data: {
            userId: user.id,
            dateOfBirth: new Date('1990-01-01'),
            gender: 'PREFER_NOT_TO_SAY',
            city: 'Mumbai',
            country: 'India',
            struggles: ['anxiety', 'stress'],
            therapyHistory: 'CONSIDERING',
            goals: ['reduce-anxiety', 'better-sleep'],
            therapistLanguages: ['english'],
            therapistApproach: 'MIXED',
            interests: ['meditation', 'journaling'],
            onboardingStep: 10,
            onboardingComplete: true,
          }
        });
      }

      // Create user settings
      await prisma.userSettings.create({
        data: {
          userId: user.id,
          darkMode: true,
          animations: true,
          pushNotifs: true,
          profileVisible: true,
        }
      });

      res.json({
        success: true,
        data: {
          message: `✅ Created ${user.role}: ${email}`,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        }
      });

    } catch {
      res.status(500).json({
        success: false,
        error: { message: 'Failed to create user' }
      });
    }
  });

  // Enhanced dev login with user creation fallback
  router.get('/dev-login/:email', async (req, res) => {
    try {
      const { email } = req.params;
      
      let user = await prisma.user.findUnique({
        where: { email },
        include: {
          profile: true,
          therapistProfile: true,
          settings: true,
        }
      });

      // Auto-create user if doesn't exist
      if (!user) {
        const passwords = {
          'user@test.com': 'user123',
          'therapist@test.com': 'therapist123', 
          'astrologer@test.com': 'astrologer123',
          'admin@test.com': 'admin123'
        };
        
        const names = {
          'user@test.com': 'Test User',
          'therapist@test.com': 'Dr. Test Therapist',
          'astrologer@test.com': 'Test Astrologer', 
          'admin@test.com': 'Test Admin'
        };

        const password = passwords[email as keyof typeof passwords] || 'password123';
        const name = names[email as keyof typeof names] || 'Test User';
        
        const passwordHash = await bcrypt.hash(password, 12);
        
        user = await prisma.user.create({
          data: {
            email,
            passwordHash,
            name,
            isVerified: true,
          },
          include: {
            profile: true,
            therapistProfile: true,
            settings: true,
          }
        });

        // Create appropriate profiles
        if (email.includes('therapist')) {
          await prisma.therapistProfile.create({
            data: {
              userId: user.id,
              specializations: ['anxiety', 'depression', 'relationships'],
              approach: 'MIXED',
              languages: ['english', 'hindi'],
              qualifications: ['M.Phil Clinical Psychology', 'RCI Licensed'],
              experience: 5,
              bio: 'Experienced therapist specializing in anxiety and relationship counseling.',
              pricePerSession: 1500,
              isVerified: true,
              isAvailable: true,
            }
          });
        } else if (email.includes('user')) {
          await prisma.userProfile.create({
            data: {
              userId: user.id,
              dateOfBirth: new Date('1990-01-01'),
              gender: 'PREFER_NOT_TO_SAY',
              city: 'Mumbai',
              country: 'India',
              struggles: ['anxiety', 'stress'],
              therapyHistory: 'CONSIDERING',
              goals: ['reduce-anxiety', 'better-sleep'],
              therapistLanguages: ['english'],
              therapistApproach: 'MIXED',
              interests: ['meditation', 'journaling'],
              onboardingStep: 10,
              onboardingComplete: true,
            }
          });
        }

        // Create user settings
        await prisma.userSettings.create({
          data: {
            userId: user.id,
            darkMode: true,
            animations: true,
            pushNotifs: true,
            profileVisible: true,
          }
        });
      }

      // Generate tokens
      const accessToken = tokensService.generateAccessToken(user.id, user.role);
      const refreshToken = tokensService.generateRefreshToken(user.id, crypto.randomUUID());

      const roleMessages = {
        'USER': '👤 User Dashboard - Full therapy experience',
        'THERAPIST': '👨‍⚕️ Therapist Dashboard - Manage sessions & earnings',
        'ASTROLOGER': '🔮 Astrologer Dashboard - Consultations & predictions',
        'ADMIN': '👑 Admin Dashboard - Platform management'
      };

      res.json({
        success: true,
        data: {
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
          message: roleMessages[user.role as keyof typeof roleMessages] || 'Dashboard access'
        }
      });

    } catch {
      res.status(500).json({
        success: false,
        error: { message: 'Failed to login user' }
      });
    }
  });

  // List all dev users
  router.get('/dev-users', async (req, res) => {
    try {
      const users = await prisma.user.findMany({
        where: {
          email: {
            contains: '@test.com'
          }
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        }
      });

      res.json({
        success: true,
        data: {
          users,
          count: users.length,
          message: '🎯 Development users ready for testing!'
        }
      });

    } catch {
      res.status(500).json({
        success: false,
        error: { message: 'Failed to fetch users' }
      });
    }
  });

  // Create all dev users at once
  router.get('/dev-create-all', async (req, res) => {
    try {
      const DEV_USERS = [
        { email: 'user@test.com', password: 'User123!@#', name: 'Test User', role: 'USER' },
        { email: 'therapist@test.com', password: 'Therapist123!@#', name: 'Dr. Test Therapist', role: 'THERAPIST' },
        { email: 'astrologer@test.com', password: 'Astrologer123!@#', name: 'Test Astrologer', role: 'ASTROLOGER' },
        { email: 'admin@test.com', password: 'Admin123!@#', name: 'Test Admin', role: 'ADMIN' },
      ];

      const results = [];

      for (const user of DEV_USERS) {
        try {
          // Check if user exists
          const existingUser = await prisma.user.findUnique({ where: { email: user.email } });
          if (existingUser) {
            results.push({ email: user.email, status: 'exists', role: user.role });
            continue;
          }

          // Create new user
          const passwordHash = await bcrypt.hash(user.password, 12);
          const createdUser = await prisma.user.create({
            data: {
              email: user.email,
              passwordHash,
              name: user.name,
              role: user.role as any,
              isVerified: true,
            },
          });

          // Create profiles based on role
          if (user.role === 'THERAPIST') {
            await prisma.therapistProfile.create({
              data: {
                userId: createdUser.id,
                specializations: ['anxiety', 'depression', 'relationships'],
                approach: 'MIXED',
                languages: ['english', 'hindi'],
                qualifications: ['M.Phil Clinical Psychology', 'RCI Licensed'],
                experience: 5,
                bio: 'Experienced therapist specializing in anxiety and relationship counseling.',
                pricePerSession: 1500,
                isVerified: true,
                isAvailable: true,
              }
            });
          } else if (user.role === 'USER') {
            await prisma.userProfile.create({
              data: {
                userId: createdUser.id,
                dateOfBirth: new Date('1990-01-01'),
                gender: 'PREFER_NOT_TO_SAY',
                city: 'Mumbai',
                country: 'India',
                struggles: ['anxiety', 'stress'],
                therapyHistory: 'CONSIDERING',
                goals: ['reduce-anxiety', 'better-sleep'],
                therapistLanguages: ['english'],
                therapistApproach: 'MIXED',
                interests: ['meditation', 'journaling'],
                onboardingStep: 10,
                onboardingComplete: true,
              }
            });
          }

          // Create user settings
          await prisma.userSettings.create({
            data: {
              userId: createdUser.id,
              darkMode: true,
              animations: true,
              pushNotifs: true,
              profileVisible: true,
            }
          });

          results.push({ email: user.email, status: 'created', role: user.role });
        } catch (err) {
          results.push({ email: user.email, status: 'error', error: (err as Error).message, role: user.role });
        }
      }

      res.json({
        success: true,
        data: {
          message: '🎉 Development users setup complete!',
          results,
          credentials: DEV_USERS.map(u => ({
            email: u.email,
            password: u.password,
            role: u.role
          }))
        }
      });

    } catch {
      res.status(500).json({
        success: false,
        error: { message: 'Failed to create dev users' }
      });
    }
  });

}

export default router;
