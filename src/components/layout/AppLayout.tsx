import { Sidebar } from './Sidebar';

interface AppLayoutProps {
    children: React.ReactNode;
    selectedId: string | null;
    onSelect: (id: string) => void;
}

export function AppLayout({ children, selectedId, onSelect }: AppLayoutProps) {
    return (
        <div className="min-h-screen bg-background text-foreground flex">
            <Sidebar selectedId={selectedId} onSelect={onSelect} />
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
                {/* Background Gradients */}
                <div className="absolute top-0 left-0 w-full h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 pointer-events-none" />

                <div className="flex-1 overflow-y-auto relative z-10">
                    {children}
                </div>
            </main>
        </div>
    );
}
