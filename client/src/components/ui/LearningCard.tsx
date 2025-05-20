import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { 
  LearningModule, 
  UserLearningProgress 
} from "@shared/schema";

interface LearningCardProps {
  currentProgress?: UserLearningProgress;
  completedCourses?: number;
  topicsMastered?: number;
  learningPoints?: number;
  isLoading?: boolean;
}

export default function LearningCard({
  currentProgress,
  completedCourses = 0,
  topicsMastered = 0,
  learningPoints = 0,
  isLoading = false,
}: LearningCardProps) {
  const { t } = useTranslation();

  // Loading state
  if (isLoading) {
    return (
      <Card className="bg-white rounded-lg shadow-md mb-4">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-3 animate-pulse">
            <div className="h-6 bg-neutral-200 rounded w-1/3"></div>
            <div className="h-5 bg-neutral-200 rounded w-1/4"></div>
          </div>
          
          <div className="flex items-center mb-3 animate-pulse">
            <div className="w-12 h-12 rounded-full bg-neutral-200 mr-3"></div>
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-neutral-200 rounded w-3/4"></div>
              <div className="h-2.5 bg-neutral-200 rounded-full w-full"></div>
            </div>
          </div>
          
          <div className="flex justify-between text-center border-t border-neutral-200 pt-3 animate-pulse">
            {[1, 2, 3].map((n) => (
              <div key={n} className="w-1/3 space-y-2">
                <div className="h-6 bg-neutral-200 rounded mx-auto w-10"></div>
                <div className="h-4 bg-neutral-200 rounded mx-auto w-16"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate user level based on points
  const getUserLevel = (): number => {
    if (learningPoints <= 0) return 1;
    return Math.floor(learningPoints / 200) + 1;
  };

  return (
    <Card className="bg-white rounded-lg shadow-md mb-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">{t('your_learning')}</h2>
          <div className="flex items-center text-xs font-medium text-primary-500">
            {t('Level')} {getUserLevel()}
            <span className="material-icons text-sm ml-1">emoji_events</span>
          </div>
        </div>
        
        {currentProgress ? (
          <div className="flex items-center mb-3">
            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mr-3">
              <span className="material-icons text-primary-500">school</span>
            </div>
            <div className="flex-1">
              <p className="font-medium">
                {t('current_course')}: {currentProgress.moduleId}
              </p>
              <div className="flex items-center mt-1">
                <div className="w-full bg-neutral-200 rounded-full h-2.5 mr-2">
                  <div 
                    className="bg-primary-500 h-2.5 rounded-full" 
                    style={{ width: `${currentProgress.progress}%` }}
                  ></div>
                </div>
                <span className="text-xs text-neutral-600">{currentProgress.progress}%</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center mb-3">
            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mr-3">
              <span className="material-icons text-primary-500">school</span>
            </div>
            <div className="flex-1">
              <p className="font-medium">{t('No active course')}</p>
              <p className="text-xs text-neutral-600 mt-1">
                {t('Browse courses to start learning')}
              </p>
            </div>
          </div>
        )}
        
        <div className="flex justify-between text-center border-t border-neutral-200 pt-3">
          <div>
            <p className="text-2xl font-bold text-primary-500">{completedCourses}</p>
            <p className="text-xs text-neutral-600">
              {t('courses_completed')}
            </p>
          </div>
          <div>
            <p className="text-2xl font-bold text-secondary-500">{topicsMastered}</p>
            <p className="text-xs text-neutral-600">
              {t('topics_mastered')}
            </p>
          </div>
          <div>
            <p className="text-2xl font-bold text-accent-500">{learningPoints}</p>
            <p className="text-xs text-neutral-600">
              {t('learning_points')}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface RecommendedCourseProps {
  courses: LearningModule[];
  isLoading?: boolean;
  onStartCourse?: (moduleId: number) => void;
}

export function RecommendedCourses({
  courses,
  isLoading = false,
  onStartCourse,
}: RecommendedCourseProps) {
  const { t } = useTranslation();

  // Format duration
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours} ${t('hours')}${mins > 0 ? ` ${mins} min` : ''}`;
  };

  // Loading state
  if (isLoading) {
    return (
      <Card className="bg-white rounded-lg shadow-md mb-4">
        <CardContent className="p-4">
          <div className="h-6 bg-neutral-200 rounded w-1/2 mb-3 animate-pulse"></div>
          
          <div className="space-y-4">
            {[1, 2].map((n) => (
              <div key={n} className="border border-neutral-200 rounded-lg overflow-hidden animate-pulse">
                <div className="h-36 bg-neutral-200 w-full"></div>
                <div className="p-3 space-y-2">
                  <div className="h-5 bg-neutral-200 rounded w-3/4"></div>
                  <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
                  <div className="h-4 bg-neutral-200 rounded w-full"></div>
                  <div className="flex justify-between items-center mt-3">
                    <div className="h-6 bg-neutral-200 rounded w-1/3"></div>
                    <div className="h-8 bg-neutral-200 rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white rounded-lg shadow-md mb-4">
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-3">{t('recommended_for_you')}</h2>
        
        <div className="space-y-4">
          {courses.length === 0 ? (
            <p className="text-neutral-600 text-sm">{t('No recommended courses available')}</p>
          ) : (
            courses.map((course) => (
              <div key={course.id} className="border border-neutral-200 rounded-lg overflow-hidden">
                <img 
                  src={`https://images.unsplash.com/photo-${course.id === 1 ? '1569025690938-a00729c9e1f9' : '1622383563227-04401ab4e5ea'}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=250`}
                  alt={course.title} 
                  className="w-full h-36 object-cover"
                />
                <div className="p-3">
                  <h3 className="font-medium">{course.title}</h3>
                  <div className="flex items-center mt-1 text-sm text-neutral-600">
                    <span className="material-icons text-sm mr-1">schedule</span>
                    {course.lessonCount} {t('lessons')} ({formatDuration(course.durationMinutes || 0)})
                  </div>
                  <p className="text-sm text-neutral-600 mt-2">{course.description}</p>
                  
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex items-center">
                      <div className="flex -space-x-2">
                        <div className="w-6 h-6 rounded-full bg-neutral-200 flex items-center justify-center text-xs font-medium">
                          {course.id === 1 ? 'RS' : 'AK'}
                        </div>
                        <div className="w-6 h-6 rounded-full bg-neutral-300 flex items-center justify-center text-xs font-medium">
                          {course.id === 1 ? 'PK' : 'BP'}
                        </div>
                        <div className="w-6 h-6 rounded-full bg-neutral-400 flex items-center justify-center text-xs font-medium text-white">
                          +{course.id === 1 ? '18' : '24'}
                        </div>
                      </div>
                      <span className="text-xs text-neutral-600 ml-2">
                        {course.id === 1 ? '21' : '27'} {t('farmers_enrolled')}
                      </span>
                    </div>
                    <button 
                      className="py-1.5 px-3 bg-primary-500 text-white rounded-lg text-sm"
                      onClick={() => onStartCourse && onStartCourse(course.id)}
                    >
                      {t('start_course')}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
