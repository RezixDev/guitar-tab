import React from "react";
import ScaleViewer from "@/components/ScaleViewer";
import { majorScale } from "../../app/utils/noteUtils";

export default function Page() {
	return (
		<div className="min-h-screen bg-gradient-to-r from-blue-100 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto">
				<header className="text-center mb-8">
					<h1 className="text-4xl font-bold text-indigo-800 mb-2">
						Scale Viewer
					</h1>
					<p className="text-lg text-gray-600">
						Explore guitar scales and improve your playing
					</p>
				</header>
				<div className="bg-white shadow-xl rounded-lg overflow-hidden">
					<div className="p-6">
						<ScaleViewer width={800} height={300} />
					</div>
				</div>
				<footer className="mt-8 text-center text-gray-500 text-sm">
					© 2023 Guitar Scale Viewer. All rights reserved.
				</footer>
			</div>
		</div>
	);
}
