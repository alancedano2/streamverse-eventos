// src/app/register/[[...rest]]/page.tsx
import { SignUp } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <SignUp path="/register" routing="path" signInUrl="/login" />
    </div>
  );
}
