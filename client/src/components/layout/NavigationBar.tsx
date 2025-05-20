import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";

export default function NavigationBar() {
  const [location, setLocation] = useLocation();
  const { t } = useTranslation();

  const isActive = (path: string) => location === path;

  // Navigation items configuration
  const navItems = [
    { path: "/", icon: "home", label: t("nav_home") },
    { path: "/iot", icon: "sensors", label: t("nav_devices") },
    { path: "/market", icon: "shopping_bag", label: t("nav_market") },
    { path: "/learn", icon: "school", label: t("nav_learn") },
    { path: "/dashboard", icon: "dashboard", label: t("nav_dashboard") },
  ];

  // Handle tab change
  const handleTabChange = (path: string) => {
    setLocation(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-10">
      <div className="flex justify-between px-2">
        {navItems.map((item) => (
          <button
            key={item.path}
            className={`flex flex-col items-center py-2 px-3 ${
              isActive(item.path) ? "text-primary-500" : "text-neutral-600"
            }`}
            onClick={() => handleTabChange(item.path)}
          >
            <span className="material-icons">{item.icon}</span>
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
