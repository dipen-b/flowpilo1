import { Check, X } from "lucide-react";

interface FeatureComparisonProps {
  plans: Record<string, any>;
}

export function FeatureComparison({ plans }: FeatureComparisonProps) {
  const allFeatures = plans.free.features;

  return (
    <div className="max-w-6xl mx-auto w-full space-y-8">
      <h2 className="text-3xl font-bold text-center text-primary-text">
        Feature Comparison
      </h2>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-secondary-bg">
              <th className="px-6 py-4 text-left font-semibold text-primary-text">
                Feature
              </th>
              <th className="px-6 py-4 text-center font-semibold text-primary-text">
                Free
              </th>
              <th className="px-6 py-4 text-center font-semibold text-blue-600">
                Pro
              </th>
              <th className="px-6 py-4 text-center font-semibold text-primary-text">
                Enterprise
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Limits Section */}
            <tr className="border-b border-border bg-secondary-bg/50">
              <td colSpan={4} className="px-6 py-3 font-semibold text-primary-text text-sm">
                LIMITS
              </td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary-bg/30">
              <td className="px-6 py-3 text-primary-text">Projects</td>
              <td className="px-6 py-3 text-center text-secondary-text">5</td>
              <td className="px-6 py-3 text-center text-primary-text font-semibold">
                ∞
              </td>
              <td className="px-6 py-3 text-center text-primary-text font-semibold">
                ∞
              </td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary-bg/30">
              <td className="px-6 py-3 text-primary-text">Team Members</td>
              <td className="px-6 py-3 text-center text-secondary-text">3</td>
              <td className="px-6 py-3 text-center text-primary-text font-semibold">
                50
              </td>
              <td className="px-6 py-3 text-center text-primary-text font-semibold">
                ∞
              </td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary-bg/30">
              <td className="px-6 py-3 text-primary-text">Storage</td>
              <td className="px-6 py-3 text-center text-secondary-text">500MB</td>
              <td className="px-6 py-3 text-center text-primary-text font-semibold">
                10GB
              </td>
              <td className="px-6 py-3 text-center text-primary-text font-semibold">
                ∞
              </td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary-bg/30">
              <td className="px-6 py-3 text-primary-text">Activity Log</td>
              <td className="px-6 py-3 text-center text-secondary-text">100 entries</td>
              <td className="px-6 py-3 text-center text-primary-text font-semibold">
                10K entries
              </td>
              <td className="px-6 py-3 text-center text-primary-text font-semibold">
                ∞
              </td>
            </tr>

            {/* Features Section */}
            <tr className="border-b border-border bg-secondary-bg/50">
              <td colSpan={4} className="px-6 py-3 font-semibold text-primary-text text-sm">
                FEATURES
              </td>
            </tr>

            {Object.entries(allFeatures).map(([featureName]) => {
              const freeHas = plans.free.features[featureName];
              const proHas = plans.pro.features[featureName];
              const enterpriseHas = plans.enterprise.features[featureName];

              return (
                <tr key={featureName} className="border-b border-border hover:bg-secondary-bg/30">
                  <td className="px-6 py-3 text-primary-text">
                    {featureName
                      .replace(/([A-Z])/g, " $1")
                      .trim()
                      .replace(/^./, (c) => c.toUpperCase())}
                  </td>
                  <td className="px-6 py-3 text-center">
                    {freeHas ? (
                      <Check size={20} className="mx-auto text-green-600" />
                    ) : (
                      <X size={20} className="mx-auto text-secondary-text" />
                    )}
                  </td>
                  <td className="px-6 py-3 text-center">
                    {proHas ? (
                      <Check size={20} className="mx-auto text-green-600" />
                    ) : (
                      <X size={20} className="mx-auto text-secondary-text" />
                    )}
                  </td>
                  <td className="px-6 py-3 text-center">
                    {enterpriseHas ? (
                      <Check size={20} className="mx-auto text-green-600" />
                    ) : (
                      <X size={20} className="mx-auto text-secondary-text" />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
