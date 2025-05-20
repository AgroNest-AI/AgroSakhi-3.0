import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";

// Define interface for community group
interface CommunityGroup {
  id: number;
  icon: string;
  iconColor: string;
  title: string;
  description: string;
  schedule: string;
  memberCount: number;
  badgeColor: string;
  badgeText: string;
  actionText: string;
}

interface CommunityLearningProps {
  groups: CommunityGroup[];
  isLoading?: boolean;
  onJoinClick?: (groupId: number) => void;
  onViewAllClick?: () => void;
}

export default function CommunityLearning({
  groups,
  isLoading = false,
  onJoinClick,
  onViewAllClick,
}: CommunityLearningProps) {
  const { t } = useTranslation();

  // Get color class based on color name
  const getColorClass = (color: string): string => {
    switch (color) {
      case "primary":
        return "text-primary-500";
      case "secondary":
        return "text-secondary-500";
      case "accent":
        return "text-accent-500";
      case "success":
        return "text-success";
      case "warning":
        return "text-warning";
      case "error":
        return "text-error";
      default:
        return `text-${color}-500`;
    }
  };

  // Get badge background color
  const getBadgeBgClass = (color: string): string => {
    switch (color) {
      case "primary":
        return "bg-primary-100 text-primary-800";
      case "secondary":
        return "bg-secondary-100 text-secondary-800";
      case "accent":
        return "bg-accent-100 text-accent-800";
      case "success":
        return "bg-success/10 text-success";
      case "warning":
        return "bg-warning/10 text-warning";
      case "error":
        return "bg-error/10 text-error";
      default:
        return `bg-${color}-100 text-${color}-800`;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Card className="bg-white rounded-lg shadow-md mb-4">
        <CardContent className="p-4">
          <div className="h-6 bg-neutral-200 rounded w-1/2 mb-3 animate-pulse"></div>
          
          <div className="space-y-4">
            {[1, 2].map((n) => (
              <div key={n} className="border border-neutral-200 rounded-lg p-3 animate-pulse">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-neutral-200 rounded-full mr-3"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-neutral-200 rounded w-3/4"></div>
                    <div className="h-4 bg-neutral-200 rounded w-full"></div>
                    <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
                    <div className="flex justify-between items-center mt-3">
                      <div className="h-5 bg-neutral-200 rounded w-1/3"></div>
                      <div className="h-8 bg-neutral-200 rounded w-16"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="h-10 bg-neutral-200 rounded-lg w-full mt-4 animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white rounded-lg shadow-md mb-4">
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-3">{t('community_learning')}</h2>
        
        <div className="space-y-4">
          {groups.length === 0 ? (
            <p className="text-neutral-600 text-sm">{t('No community groups available')}</p>
          ) : (
            groups.map((group) => (
              <div key={group.id} className="border border-neutral-200 rounded-lg p-3">
                <div className="flex items-start">
                  <span className={`material-icons text-2xl ${getColorClass(group.iconColor)} mr-3`}>
                    {group.icon}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-medium">{group.title}</h3>
                    <p className="text-sm text-neutral-600 mt-1">{group.description}</p>
                    
                    <div className="flex items-center mt-2 text-xs text-neutral-600">
                      <span className="material-icons text-xs mr-1">schedule</span>
                      {group.schedule}
                    </div>
                    
                    <div className="flex justify-between items-center mt-3">
                      <span className={`text-xs ${getBadgeBgClass(group.badgeColor)} px-2 py-0.5 rounded-full`}>
                        {group.memberCount} {t('members')}
                      </span>
                      <button 
                        className="py-1 px-3 bg-primary-500 text-white rounded-lg text-sm"
                        onClick={() => onJoinClick && onJoinClick(group.id)}
                      >
                        {t(group.actionText)}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          
          {onViewAllClick && (
            <button
              className="w-full py-2 border border-primary-500 text-primary-500 rounded-lg flex items-center justify-center"
              onClick={onViewAllClick}
            >
              {t('view_all_community')}
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
