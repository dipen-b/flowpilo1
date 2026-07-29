import { Check, X } from "lucide-react";

interface PricingCardProps {
  name: string;
  price: number | null;
  billingPeriod: string;
  annualSavings?: string;
  description?: string;
  limits: {
    maxProjects: number | null;
    maxTeamMembers: number | null;
    maxStorage: number | null;
    maxActivityEntries: number | null;
  };
  features: Record<string, boolean>;
  buttonText: string;
  buttonDisabled?: boolean;
  onUpgrade: () => void;
  highlighted?: boolean;
}

export function PricingCard({
  name,
  price,
  billingPeriod,
  annualSavings,
  description,
  limits,
  features,
  buttonText,
  buttonDisabled = false,
  onUpgrade,
  highlighted = false,
}: PricingCardProps) {
  return (
    <div
      className={`rounded-lg border p-8 space-y-6 transition-all hover:shadow-lg relative ${
        highlighted
          ? "border-blue-600 bg-blue-600/5 ring-2 ring-blue-600 md:scale-105"
          : "border-border hover:border-primary-text/20"
      }`}
    >
      {highlighted && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
            Most Popular
          </span>
        </div>
      )}

      <div>
        <h3 className="text-2xl font-bold text-primary-text">{name}</h3>
        {description && (
          <p className="text-sm text-secondary-text mt-1">{description}</p>
        )}
      </div>

      <div>
        {price !== null ? (
          <>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-primary-text">
                ${price}
              </span>
              <span className="text-secondary-text">{billingPeriod}</span>
            </div>
            {annualSavings && (
              <p className="text-xs text-green-600 mt-1">{annualSavings}</p>
            )}
          </>
        ) : (
          <p className="text-xl text-secondary-text">Custom pricing available</p>
        )}
      </div>

      <button
        onClick={onUpgrade}
        disabled={buttonDisabled}
        className={`w-full py-3 rounded-lg font-semibold transition-colors ${
          highlighted
            ? "bg-blue-600 hover:bg-blue-700 text-white"
            : buttonDisabled
            ? "bg-secondary-bg text-secondary-text cursor-not-allowed"
            : "border border-border text-primary-text hover:bg-secondary-bg"
        }`}
      >
        {buttonText}
      </button>

      <div className="space-y-4 pt-4 border-t border-border">
        <div>
          <p className="font-semibold text-primary-text mb-2 text-sm">Limits:</p>
          <ul className="space-y-1 text-sm text-secondary-text">
            <li className="flex justify-between">
              <span>Projects</span>
              <span className="font-medium text-primary-text">
                {limits.maxProjects === null ? "Unlimited" : limits.maxProjects}
              </span>
            </li>
            <li className="flex justify-between">
              <span>Team Members</span>
              <span className="font-medium text-primary-text">
                {limits.maxTeamMembers === null
                  ? "Unlimited"
                  : limits.maxTeamMembers}
              </span>
            </li>
            <li className="flex justify-between">
              <span>Storage</span>
              <span className="font-medium text-primary-text">
                {limits.maxStorage === null
                  ? "Unlimited"
                  : `${Math.round(limits.maxStorage / 1024 / 1024 / 1024)}GB`}
              </span>
            </li>
            <li className="flex justify-between">
              <span>Activity Entries</span>
              <span className="font-medium text-primary-text">
                {limits.maxActivityEntries === null
                  ? "Unlimited"
                  : limits.maxActivityEntries.toLocaleString()}
              </span>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-semibold text-primary-text mb-3 text-sm">Features:</p>
          <ul className="space-y-2">
            {Object.entries(features).map(([featureName, enabled]) => (
              <li
                key={featureName}
                className={`flex items-center gap-2 text-sm ${
                  enabled ? "text-green-600" : "text-secondary-text"
                }`}
              >
                {enabled ? (
                  <Check size={16} className="flex-shrink-0" />
                ) : (
                  <X size={16} className="flex-shrink-0" />
                )}
                <span>
                  {featureName
                    .replace(/([A-Z])/g, " $1")
                    .trim()
                    .replace(/^./, (c) => c.toUpperCase())}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
