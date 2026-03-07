## ADDED Requirements

### Requirement: Email/password sign up
The app SHALL allow users to create an account using an email address and password via Supabase Auth.

#### Scenario: Successful sign up
- **WHEN** a user enters a valid email and password and taps "Sign Up"
- **THEN** a new account is created in Supabase Auth and the user is signed in

#### Scenario: Sign up with existing email
- **WHEN** a user attempts to sign up with an email that is already registered
- **THEN** an error message is displayed indicating the email is already in use

### Requirement: Email/password sign in
The app SHALL allow existing users to sign in with their email and password.

#### Scenario: Successful sign in
- **WHEN** a user enters valid credentials and taps "Sign In"
- **THEN** the user is authenticated and navigated to the main app (Home tab)

#### Scenario: Invalid credentials
- **WHEN** a user enters incorrect email or password
- **THEN** an error message is displayed without revealing which field is wrong

### Requirement: Sign out
The app SHALL allow authenticated users to sign out.

#### Scenario: Successful sign out
- **WHEN** an authenticated user taps "Sign Out"
- **THEN** the user's session is cleared and they are returned to the sign-in screen

### Requirement: Auth state persistence
The app SHALL persist the auth session across app restarts using AsyncStorage. The user SHALL NOT need to sign in again after closing and reopening the app.

#### Scenario: Session persists across restart
- **WHEN** an authenticated user closes and reopens the app
- **THEN** the user remains signed in and sees the main app

#### Scenario: Expired session
- **WHEN** the auth token has expired and cannot be refreshed
- **THEN** the user is returned to the sign-in screen

### Requirement: Auth-gated navigation
The app SHALL show the auth screens (sign in / sign up) to unauthenticated users and the main tab navigator to authenticated users.

#### Scenario: Unauthenticated user sees auth screen
- **WHEN** the app loads with no active session
- **THEN** the sign-in screen is displayed

#### Scenario: Authenticated user sees main app
- **WHEN** the app loads with an active session
- **THEN** the Home tab is displayed
