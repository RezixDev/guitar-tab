import { Guitar } from "lucide-react";
import { PageTuner } from "@/components//PageTuner";

export default function Page() {
	return (
		<div className="container mx-auto p-4 md:p-8 space-y-6">
			{/* Page Header */}
			<div className="flex items-center gap-2 mb-8">
				<Guitar className="w-8 h-8" />
				<h1 className="text-4xl font-bold">Guitar Tuner</h1>
			</div>

			<PageTuner />
		</div>
	);
}
