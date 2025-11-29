import AuthForm from '@/components/AuthForm';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-gray-light p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-green-dark">South Flowers Members</h1>
        </div>
        <AuthForm />
      </div>
    </div>
  );
}
