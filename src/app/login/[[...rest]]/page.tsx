// src/app/login/[[...rest]]/page.tsx
import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <SignIn path="/login" routing="path" signUpUrl="/register" />
    </div>
  );
}
