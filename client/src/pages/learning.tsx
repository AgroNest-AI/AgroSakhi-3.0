import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/context/UserContext";
import LearningCard, { RecommendedCourses } from "@/components/ui/LearningCard";
import CommunityLearning from "@/components/ui/CommunityLearning";
import { LearningModule } from "@shared/schema";

// Sample community groups data
const communityGroups = [
  {
    id: 1,
    icon: "groups",
    iconColor: "secondary",
    title: "Organic Farming Group",
    description: "Join weekly discussions on organic farming practices and techniques",
    schedule: "Every Thursday, 4:00 PM",
    memberCount: 42,
    badgeColor: "secondary",
    badgeText: "members",
    actionText: "join"
  },
  {
    id: 2,
    icon: "event",
    iconColor: "accent",
    title: "Climate-Resilient Farming Workshop",
    description: "Expert-led workshop on farming techniques to adapt to changing climate",
    schedule: "March 15, 2023 • 10:00 AM",
    memberCount: 35,
    badgeColor: "accent",
    badgeText: "In-person + Online",
    actionText: "register"
  }
];

export default function Learning() {
  const { t } = useTranslation();
  const { user } = useUser();
  const userId = user?.id || 1;

  // Fetch learning modules
  const { data: modules, isLoading: isModulesLoading } = useQuery({
    queryKey: ['/api/learning/modules'],
  });

  // Fetch user learning progress
  const { data: progress, isLoading: isProgressLoading } = useQuery({
    queryKey: [`/api/learning/progress/${userId}`],
  });

  // Get stats
  const getCompletedCourses = () => {
    if (!progress) return 0;
    return progress.filter(p => p.completed).length;
  };

  const getTopicsMastered = () => {
    return getCompletedCourses() * 3; // Assuming 3 topics per course for demo
  };

  const getLearningPoints = () => {
    if (!progress) return 0;
    return progress.reduce((sum, p) => sum + (p.progress || 0), 0) * 10;
  };

  // Get current progress
  const getCurrentProgress = () => {
    if (!progress || progress.length === 0) return null;
    
    // Find the progress that is not completed
    const currentCourse = progress.find(p => !p.completed);
    return currentCourse || null;
  };

  // Handler for starting a course
  const handleStartCourse = (moduleId: number) => {
    // In a real app, this would navigate to the course or enroll the user
    console.log("Start course clicked for module:", moduleId);
  };

  // Handler for joining a community group
  const handleJoinGroup = (groupId: number) => {
    // In a real app, this would join the user to the group
    console.log("Join group clicked for group:", groupId);
  };

  // Handler for viewing all community activities
  const handleViewAllCommunity = () => {
    // In a real app, this might navigate to a community page
    console.log("View all community activities clicked");
  };

  return (
    <div className="p-4 pb-16">
      <h1 className="text-2xl font-display font-bold mb-4">{t('learning_title')}</h1>
      
      {/* Learning Progress Card */}
      <LearningCard
        currentProgress={getCurrentProgress()}
        completedCourses={getCompletedCourses()}
        topicsMastered={getTopicsMastered()}
        learningPoints={getLearningPoints()}
        isLoading={isProgressLoading}
      />
      
      {/* Recommended Courses */}
      <RecommendedCourses
        courses={modules || []}
        isLoading={isModulesLoading}
        onStartCourse={handleStartCourse}
      />
      
      {/* Community Learning */}
      <CommunityLearning
        groups={communityGroups}
        isLoading={false}
        onJoinClick={handleJoinGroup}
        onViewAllClick={handleViewAllCommunity}
      />
    </div>
  );
}
