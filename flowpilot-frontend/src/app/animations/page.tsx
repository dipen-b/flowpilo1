"use client";

import { AppLayout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from "@/components/ui";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Star, Heart, Share2, Download, Eye } from "lucide-react";
import { useState } from "react";

interface AnimationDemo {
  id: string;
  name: string;
  description: string;
  category: "micro" | "data" | "transition" | "feedback";
}

const ANIMATION_DEMOS: AnimationDemo[] = [
  {
    id: "hover-button",
    name: "Button Hover Effects",
    description: "Smooth scale and color transitions on hover",
    category: "micro",
  },
  {
    id: "loading-skeleton",
    name: "Skeleton Loading States",
    description: "Pulsing skeleton placeholders for content loading",
    category: "feedback",
  },
  {
    id: "smooth-numbers",
    name: "Number Counter Animation",
    description: "Smooth animated transitions for numeric values",
    category: "data",
  },
  {
    id: "list-entrance",
    name: "List Item Entrance",
    description: "Staggered fade-in animation for list items",
    category: "transition",
  },
  {
    id: "modal-entrance",
    name: "Modal Scale Animation",
    description: "Smooth scale and opacity entrance for modals",
    category: "transition",
  },
  {
    id: "card-hover",
    name: "Card Hover Lift",
    description: "Elevation and shadow effect on card hover",
    category: "micro",
  },
  {
    id: "progress-animation",
    name: "Progress Bar Fill",
    description: "Animated progress bars with smooth width transitions",
    category: "data",
  },
  {
    id: "badge-pulse",
    name: "Badge Pulse",
    description: "Attention-grabbing pulse effect for badges",
    category: "feedback",
  },
];

function AnimationsContent() {
  const [selectedCategory, setSelectedCategory] = useState<"all" | AnimationDemo["category"]>("all");
  const [hoverCount, setHoverCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [animatedNumber, setAnimatedNumber] = useState(0);

  const filteredDemos = ANIMATION_DEMOS.filter(
    (demo) => selectedCategory === "all" || demo.category === selectedCategory
  );

  const handleNumberAnimation = () => {
    setAnimatedNumber(Math.floor(Math.random() * 10000));
  };

  return (
    <AppLayout>
      <div className="h-full flex flex-col space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Animations & Polish</h1>
          <p className="text-secondary-text">Interactive animations and micro-interactions showcase</p>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2">
          <span className="text-sm text-secondary-text">Category:</span>
          {(["all", "micro", "data", "transition", "feedback"] as const).map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300 capitalize ${
                selectedCategory === category
                  ? "bg-black text-white shadow-lg scale-105"
                  : "bg-secondary-bg text-secondary-text hover:text-primary-text"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Micro Interactions Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Micro Interactions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Button Hover */}
            <div>
              <h3 className="font-semibold text-primary-text mb-3">Button Hover Effects</h3>
              <div className="flex gap-3 flex-wrap">
                <button className="px-4 py-2 bg-black text-white rounded-lg transition-all duration-200 hover:scale-110 hover:shadow-lg active:scale-95">
                  Scale & Shadow
                </button>
                <button className="px-4 py-2 border-2 border-primary-text text-primary-text rounded-lg transition-all duration-200 hover:bg-black hover:text-white">
                  Color Shift
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg transition-all duration-200 hover:translate-y-[-2px] hover:shadow-lg active:translate-y-[2px]">
                  Lift Effect
                </button>
                <button className="px-4 py-2 bg-black text-white rounded-lg transition-all duration-200 hover:brightness-110 active:brightness-90">
                  Brightness
                </button>
              </div>
            </div>

            {/* Card Hover */}
            <div>
              <h3 className="font-semibold text-primary-text mb-3">Card Hover Lift</h3>
              <div className="grid grid-cols-3 gap-4">
                {["New Feature", "Bug Fix", "Enhancement"].map((title) => (
                  <div
                    key={title}
                    className="p-4 bg-secondary-bg rounded-lg border border-border transition-all duration-300 hover:translate-y-[-8px] hover:shadow-xl cursor-pointer"
                  >
                    <p className="font-semibold text-primary-text mb-2">{title}</p>
                    <p className="text-sm text-secondary-text">
                      Smooth elevation effect on hover
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Icon Animations */}
            <div>
              <h3 className="font-semibold text-primary-text mb-3">Icon Animations</h3>
              <div className="flex gap-4">
                <button className="p-3 rounded-lg bg-secondary-bg transition-all duration-200 hover:scale-125 hover:text-red-600">
                  <Heart size={24} />
                </button>
                <button className="p-3 rounded-lg bg-secondary-bg transition-all duration-200 hover:scale-125 hover:text-yellow-600 hover:rotate-0">
                  <Star size={24} />
                </button>
                <button className="p-3 rounded-lg bg-secondary-bg transition-all duration-200 hover:scale-125 hover:text-blue-600">
                  <Share2 size={24} />
                </button>
                <button className="p-3 rounded-lg bg-secondary-bg transition-all duration-200 hover:scale-125 hover:text-green-600">
                  <Download size={24} />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Animations Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Data Animations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Number Counter */}
            <div>
              <h3 className="font-semibold text-primary-text mb-3">Smooth Number Transitions</h3>
              <div className="flex items-end gap-4">
                <div className="text-6xl font-bold text-primary-text transition-all duration-700 ease-out">
                  {animatedNumber.toLocaleString()}
                </div>
                <Button onClick={handleNumberAnimation} className="mb-2">
                  Animate
                </Button>
              </div>
            </div>

            {/* Progress Bars */}
            <div>
              <h3 className="font-semibold text-primary-text mb-3">Animated Progress Bars</h3>
              <div className="space-y-4">
                {[45, 72, 88, 95].map((percent) => (
                  <div key={percent}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-secondary-text">Task Completion</span>
                      <span className="text-sm font-semibold text-primary-text">{percent}%</span>
                    </div>
                    <div className="w-full h-3 bg-secondary-bg rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gray-600 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* List Animation */}
            <div>
              <h3 className="font-semibold text-primary-text mb-3">Staggered List Entrance</h3>
              <div className="space-y-2">
                {["Item One", "Item Two", "Item Three", "Item Four"].map((item, idx) => (
                  <div
                    key={item}
                    className="p-3 bg-secondary-bg rounded-lg border border-border animate-in fade-in slide-in-from-left-2 duration-500"
                    style={{
                      animationDelay: `${idx * 100}ms`,
                      opacity: 1,
                      transform: "translateX(0)",
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feedback Animations Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Feedback Animations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Skeleton Loading */}
            <div>
              <h3 className="font-semibold text-primary-text mb-3">Skeleton Loading States</h3>
              <div className="space-y-3">
                {[1, 2, 3].map((idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-secondary-bg space-y-3">
                    <div className="h-4 bg-gray-700 rounded-full w-3/4 animate-pulse"></div>
                    <div className="h-3 bg-gray-700 rounded-full w-1/2 animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Badge Pulse */}
            <div>
              <h3 className="font-semibold text-primary-text mb-3">Badge Pulse Effects</h3>
              <div className="flex gap-3">
                <Badge
                  variant="default"
                  className="animate-pulse bg-red-600/20 text-red-600 border-red-600/30"
                >
                  Attention Needed
                </Badge>
                <Badge
                  variant="default"
                  className="animate-pulse bg-green-600/20 text-green-600 border-green-600/30"
                  style={{ animationDuration: "2s" }}
                >
                  In Progress
                </Badge>
                <Badge
                  variant="default"
                  className="animate-pulse bg-yellow-600/20 text-yellow-600 border-yellow-600/30"
                  style={{ animationDuration: "3s" }}
                >
                  Pending
                </Badge>
              </div>
            </div>

            {/* Interaction Feedback */}
            <div>
              <h3 className="font-semibold text-primary-text mb-3">Click Feedback</h3>
              <button
                onClick={() => setHoverCount(hoverCount + 1)}
                className="px-4 py-2 bg-black text-white rounded-lg transition-all active:scale-95 active:brightness-90"
              >
                Click me! ({hoverCount})
              </button>
              <p className="text-sm text-secondary-text mt-3">
                Feel the active scale-down effect for satisfying feedback
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Transition Animations Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Transition Animations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Modal Demo */}
            <div>
              <h3 className="font-semibold text-primary-text mb-3">Modal Entrance Animation</h3>
              <Button onClick={() => setShowModal(true)}>Open Modal</Button>

              {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200">
                  <Card className="w-96 animate-in scale-in-95 zoom-in-95 duration-300">
                    <CardHeader>
                      <CardTitle>Animated Modal</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-secondary-text">
                        This modal has a smooth scale and fade entrance animation.
                      </p>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => setShowModal(false)}
                          className="flex-1"
                        >
                          Close
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => setShowModal(false)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>

            {/* Page Transitions */}
            <div>
              <h3 className="font-semibold text-primary-text mb-3">Page Transition Effects</h3>
              <p className="text-sm text-secondary-text mb-3">
                All page navigations include smooth fade and slide transitions
              </p>
              <div className="space-y-2">
                {["Fade In", "Slide In (Left)", "Slide In (Up)", "Zoom In"].map(
                  (effect) => (
                    <div
                      key={effect}
                      className="p-3 bg-secondary-bg rounded-lg border border-border animate-in fade-in slide-in-from-bottom-2 duration-500"
                    >
                      {effect}
                    </div>
                  )
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Animation Best Practices */}
        <Card>
          <CardHeader>
            <CardTitle>Animation Best Practices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  title: "Duration",
                  content: "Keep animations between 200-500ms for snappy feel",
                },
                {
                  title: "Easing",
                  content: "Use ease-out for entrances, ease-in for exits",
                },
                {
                  title: "Accessibility",
                  content: "Respect prefers-reduced-motion for user preference",
                },
                {
                  title: "Performance",
                  content: "Use transform and opacity for GPU acceleration",
                },
                {
                  title: "Feedback",
                  content: "Animate interactive elements for user confirmation",
                },
                {
                  title: "Consistency",
                  content: "Use same animation timings across the app",
                },
              ].map((practice) => (
                <div
                  key={practice.title}
                  className="p-4 bg-secondary-bg rounded-lg border border-border"
                >
                  <p className="font-semibold text-primary-text mb-2">{practice.title}</p>
                  <p className="text-sm text-secondary-text">{practice.content}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

export default function Animations() {
  return (
    <ProtectedRoute>
      <AnimationsContent />
    </ProtectedRoute>
  );
}
