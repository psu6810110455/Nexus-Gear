import { Strategy } from 'passport-google-oauth20';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const strategy = new Strategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    scope: ['email', 'profile'],
  },
  (accessToken, refreshToken, profile, done) => {
    done(null, profile);
  }
);

console.log('--- Google OAuth Config Check ---');
console.log('Client ID:', process.env.GOOGLE_CLIENT_ID);
console.log('Client Secret (masked):', process.env.GOOGLE_CLIENT_SECRET ? '***' + process.env.GOOGLE_CLIENT_SECRET.slice(-4) : 'undefined');
console.log('Callback URL:', process.env.GOOGLE_CALLBACK_URL);
console.log('---------------------------------');

// Mock request to trigger authorization URL generation
const req: any = {
  url: '/auth/google',
  method: 'GET',
  session: {},
  query: {}
};

try {
  strategy.authenticate(req, { scope: ['email', 'profile'] });
} catch (e: any) {
    console.error('Error during authenticate simulation:', e);
}

// Intercept the redirect to see the URL
strategy.redirect = function(url: string) {
  console.log('Generated Redirect URL:');
  console.log(url);
  
  try {
      const parsedUrl = new URL(url);
      console.log('\n--- Parsed Redirect URI Parameter ---');
      console.log(parsedUrl.searchParams.get('redirect_uri'));
  } catch (e) {
      console.error('Failed to parse URL:', e);
  }
};

// re-run after overriding redirect
try {
  strategy.authenticate(req, { scope: ['email', 'profile'] });
} catch (e: any) {
    console.error('Error during authenticate simulation:', e);
}
