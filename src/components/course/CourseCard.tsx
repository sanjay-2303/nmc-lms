
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { BookOpen, Clock, FileText } from "lucide-react";

interface CourseCardProps {
  id: string;
  title: string;
  type: string;
  totalModules: number;
  totalLessons: number;
  progress?: number;
  imageUrl?: string;
  path: string;
}

const CourseCard = ({
  id,
  title,
  type,
  totalModules,
  totalLessons,
  progress = 0,
  imageUrl,
  path,
}: CourseCardProps) => {
  return (
    <Link to={path}>
      <Card className="overflow-hidden card-hover">
        <div className="relative h-48 bg-gray-200">
          {imageUrl ? (
            <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-lms-blue to-lms-darkBlue">
              <span className="text-xl font-bold text-white">{title}</span>
            </div>
          )}
          <div className="absolute top-2 right-2 bg-lms-red text-white text-xs uppercase font-bold py-1 px-2 rounded">
            {type}
          </div>
        </div>
        <CardContent className="pt-4">
          <h3 className="font-bold text-lg mb-2 line-clamp-2">{title}</h3>
          <div className="flex justify-between text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>{totalModules} modules</span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>{totalLessons} lessons</span>
            </div>
          </div>
          {progress > 0 && (
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="bg-gray-50 border-t px-4 py-3">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="h-3 w-3" />
            <span>Last accessed: Today</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default CourseCard;
