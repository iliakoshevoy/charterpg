// src/app/page.tsx
import ProposalForm from '@/components/ProposalForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <ProposalForm />
      </div>
    </main>
  );
}