import { Guitar } from "lucide-react";
import { SheetMusicComposer } from "@/components/sheet/SheetMusicComposer";

export default function Page() {
    return (
        <div className="container mx-auto p-4 md:p-8 space-y-6">
            {/* Page Header */}
            <div className="flex items-center gap-2 mb-8">
                <Guitar className="w-8 h-8" />
                <h1 className="text-4xl font-bold">Sheet</h1>
            </div>

            <SheetMusicComposer />
        </div>
    );
}
