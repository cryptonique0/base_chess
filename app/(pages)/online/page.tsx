import MobileAppLayout from '../../components/common/MobileAppLayout';

export default function OnlinePage() {
  return (
    <MobileAppLayout>
      <div className="p-4">
        <h1 className="text-xl font-bold mb-2">Tournament Lobby</h1>
        <div className="rounded-xl bg-background-light dark:bg-background-dark p-4 shadow-md">
          {/* TODO: Implement mobile-first tournament lobby using design */}
          <span className="text-zinc-400">[Tournament Lobby]</span>
        </div>
      </div>
    </MobileAppLayout>
  );
}
