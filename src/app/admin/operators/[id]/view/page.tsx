"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";

import { useOperator } from "@/hooks/api/useOperators";
import { OperatorProfilePage } from "@/components/operators/operator-view-page";

// Mock data - in a real app, this would come from an API

export default function OperatorViewPage() {
  const params = useParams();
  const router = useRouter();
  const { data, isLoading } = useOperator(Number(params.id));
  const operator = data?.operator;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading operator details...
          </p>
        </div>
      </div>
    );
  }
  const handleBack = () => {
    router.push("/admin/operators");
  };
  if (!operator) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            operator Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The operator you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Back to operators
          </button>
        </div>
      </div>
    );
  }

  return <OperatorProfilePage operatorId={params?.id?.toString() || "0"} />;
}
