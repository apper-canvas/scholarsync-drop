import React from 'react';
import Badge from '@/components/atoms/Badge';

const GradeCell = ({ score, maxScore, assignment }) => {
  const percentage = score ? (score / maxScore) * 100 : 0;
  const letterGrade = percentage >= 90 ? 'A' : 
                     percentage >= 80 ? 'B' : 
                     percentage >= 70 ? 'C' : 
                     percentage >= 60 ? 'D' : 'F';
  
  const gradeColor = letterGrade === 'A' ? 'success' :
                    letterGrade === 'B' ? 'primary' :
                    letterGrade === 'C' ? 'warning' :
                    'danger';

  if (!score && score !== 0) {
    return (
      <div className="text-center py-2">
        <span className="text-gray-400 text-sm">—</span>
      </div>
    );
  }

  return (
    <div className="text-center py-2">
      <div className="font-semibold text-gray-900">
        {score}/{maxScore}
      </div>
      <div className="mt-1">
        <Badge variant={gradeColor} size="xs">
          {letterGrade}
        </Badge>
      </div>
    </div>
  );
};

export default GradeCell;