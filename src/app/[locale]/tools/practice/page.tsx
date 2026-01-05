import { Dumbbell } from "lucide-react";
import { DailyPracticeGenerator } from "@/components/practice/DailyPracticeGenerator";

export default function Page() {
    return (
        <div className="container mx-auto p-4 md:p-8 space-y-6">
            {/* Page Header */}
            <div className="flex items-center gap-2 mb-8">
                <Dumbbell className="w-8 h-8" />
                <h1 className="text-4xl font-bold">Daily Practice</h1>
            </div>

            <DailyPracticeGenerator />
        </div>
    );
}
