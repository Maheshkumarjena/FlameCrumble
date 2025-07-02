import { Suspense } from 'react';
import Head from 'next/head';
import ResetPasswordForm from './ResetPasswordForm';

export default function ResetPasswordPage() {
  return (
    <>
      <Head>
        <title>Reset Password | flame&crumble</title>
      </Head>

      <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl bg-[#FFF5F7] min-w-screen flex flex-row justify-center items-center mx-auto">
        <Suspense fallback={<div>Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </main>
    </>
  );
}
