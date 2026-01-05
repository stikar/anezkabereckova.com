# Admin System Documentation

## Overview

The admin system allows authorized users to manage the gallery content. It uses Supabase Authentication and a custom `admins` table to manage access permissions.

## Login & Access Control

- **Login URL**: `/admin`
- **Dashboard URL**: `/admin/dashboard`
- **Access Requirement**: To access the dashboard, a user must:
  1.  Be authenticated via Supabase (email/password).
  2.  Have an entry in the `public.admins` table with `is_approved = true`.

## Creating a New Admin User

The system implements a "Request Access" workflow. New users cannot simply sign up and immediately access the admin area; they must be approved by an existing administrator.

### Step 1: Sign Up

1.  Navigate to `/admin/signup`.
2.  Enter a valid email and password (minimum 6 characters).
3.  Click "Sign Up".
4.  Upon success, the user is created in Supabase Auth, and a corresponding entry is automatically created in the `public.admins` table with `is_approved = false`.

### Step 2: Approval (Required)

1.  An **existing** approved administrator must log in to `/admin/dashboard`.
2.  Navigate to the **"User Approval"** tab.
3.  Review the list of pending users.
4.  Click **"Approve"** next to the user's email.
5.  The user's account is now active, and they can log in at `/admin`.

### Database Structure

The system relies on the `public.admins` table:

```sql
create table public.admins (
  id uuid primary key references auth.users(id),
  email text,
  is_approved boolean default false,
  ...
);
```

RLS policies ensure:

- Anyone can read the `admins` table (needed for login checks).
- Users can only insert/update their own profile data (though `is_approved` is typically managed by admins). _Note: The current implementation allows users to insert their profile via trigger, and potentially update non-sensitive fields if allowed by policy._

## Troubleshooting

- **"Your account is pending approval"**: This means you have successfully authenticated with password, but an admin has not yet clicked "Approve" for your account.
- **Login Loop**: If you are redirected back to login without an error, ensure cookies are enabled and Supabase session is persisting.
