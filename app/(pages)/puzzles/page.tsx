import MobileAppLayout from '../../components/common/MobileAppLayout';

export default function PuzzlesPage() {
  return (
    <MobileAppLayout>
      <div className="p-4">
        <h1 className="text-xl font-bold mb-2">Tactical Puzzles</h1>
        <div className="rounded-xl bg-background-light dark:bg-background-dark p-4 shadow-md">
          {/* TODO: Implement mobile-first puzzles hub using design */}
          <span className="text-zinc-400">[Puzzles Hub]</span>
        </div>
      </div>
    </MobileAppLayout>
  );
}
