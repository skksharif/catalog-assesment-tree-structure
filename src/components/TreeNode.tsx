import React, { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import ScoreIcon from "@mui/icons-material/Score";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import StarOutlineIcon from "@mui/icons-material/StarOutline";

interface Metrics {
  target_achievement: string;
  engagement_score: string;
  rating: number;
  feedback: string;
}

export interface Employee {
  name: string;
  position: string;
  department: string;
  image: string;
  metrics: Metrics;
  reports: Employee[] | null;
  isHighlighted?: boolean;
  isExactMatch?: boolean;
}

interface TreeNodeProps {
  node: Employee;
  isRoot: boolean;
  searchTerm: string;
}

const TreeNode: React.FC<TreeNodeProps> = ({ node, isRoot, searchTerm }) => {
  const [isExpandedByUser, setIsExpandedByUser] = useState<boolean | null>(
    null
  );

  const toggleExpand = () => {
    setIsExpandedByUser((prev) => (prev === null ? !isRoot : !prev));
  };

  const isExpanded =
    isExpandedByUser !== null
      ? isExpandedByUser
      : isRoot || node.isExactMatch || node.isHighlighted || searchTerm !== "";

  return (
    <li>
      <div>
        <div className={`card ${node.isExactMatch ? "exact-match" : ""}`}>
          <img src={node.image} alt={node.name} />
          <div>
            <p>
              <strong>{node.name}</strong>
            </p>
            <p className="position">
              {node.position} - {node.department}
            </p>
            <div className="metrics">
              <p>
                <TrackChangesIcon />
                {node.metrics.target_achievement}
              </p>

              <p>
                <ScoreIcon />
                {node.metrics.engagement_score}
              </p>
              <p>
                <CompareArrowsIcon />
                {node.metrics.rating}
              </p>
              <p>
                <StarOutlineIcon />
                {node.metrics.feedback}
              </p>
            </div>
          </div>
        </div>
        {node.reports && node.reports.length > 0 && (
          <button
            id="expand"
            className={isExpanded ? "expanded" : ""}
            onClick={toggleExpand}
          >
            {node.reports.length}
            {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </button>
        )}
      </div>
      {isExpanded && node.reports && (
        <ul>
          {node.reports
            .sort((a, b) => (b.isExactMatch ? 1 : 0) - (a.isExactMatch ? 1 : 0))
            .map((child, index) => (
              <TreeNode
                key={index}
                node={child}
                isRoot={false}
                searchTerm={searchTerm}
              />
            ))}
        </ul>
      )}
    </li>
  );
};

export default TreeNode;
