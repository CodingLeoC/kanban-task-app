import Image from "next/image";
import KanbanBoard from '@/components/KanbanBoard';

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="min-h-screen p-8 row-start-2">
        <h1 className="text-3xl font-bold mb-8">Kanban Task Manager</h1>
        <KanbanBoard />
      </main>
      <footer className="row-start-3 text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Kanban Task Manager
      </footer>
    </div>
  );
}
