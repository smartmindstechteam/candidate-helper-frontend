"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";

import { useSupporter } from "@/hooks/api/useSupporters";
import { SupporterProfilePage } from "@/components/supporters/supporter-view-page";

// Mock data - in a real app, this would come from an API

export default function SupporterViewPageRoute() {
  const params = useParams();
  const router = useRouter();
  const { data, isLoading } = useSupporter(Number(params.id));
  const supporter = data?.supporter;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading supporter details...
          </p>
        </div>
      </div>
    );
  }
  const handleBack = () => {
    router.push('/admin/supporters');
  }
  if (!supporter) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Supporter Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The supporter you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Back to Supporters
          </button>
        </div>
      </div>
    );
  }

  return <SupporterProfilePage supporterId={params?.id?.toString() || "0"} />;
}
