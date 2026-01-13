import MobileAppLayout from '../../components/common/MobileAppLayout';

export default function CoachesPage() {
  return (
    <MobileAppLayout>
      <div className="p-4">
        <h1 className="text-xl font-bold mb-2">Grandmaster Marketplace</h1>
        <div className="rounded-xl bg-background-light dark:bg-background-dark p-4 shadow-md">
          {/* TODO: Implement mobile-first coach marketplace using design */}
          <span className="text-zinc-400">[Coach Marketplace]</span>
        </div>
      </div>
    </MobileAppLayout>
  );
}
