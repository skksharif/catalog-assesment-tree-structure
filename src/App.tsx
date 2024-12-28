import React, { useState, ChangeEvent } from "react";
import "./App.css";
import SearchIcon from "@mui/icons-material/Search";
import employeeData from "./data.json";
import TreeNode, { Employee } from "./components/TreeNode.tsx";
interface Data {
  employees: Employee[];
};
const data: Data = {
  employees: employeeData.employees,
};
interface Metrics {
  target_achievement: string;
  engagement_score: string;
  rating: number;
  feedback: string;
}
const getGrade = (rating: number): string => {
  if (rating >= 4.0) return "A";
  if (rating >= 3.0) return "B";
  if (rating >= 2.0) return "C";
  return "D";
};
const searchTree = (
  node: Employee,
  searchTerm: string,
  departmentFilter: string,
  gradeFilter: string
): Employee | null => {
  const isNameMatch =
    !searchTerm || node.name.toLowerCase().includes(searchTerm.toLowerCase());

  const isDepartmentMatch =departmentFilter === "All" || node.department.toLowerCase() === departmentFilter.toLowerCase();

  const isGradeMatch = gradeFilter === "All" || getGrade(node.metrics.rating) === gradeFilter;

  const filteredReports =
    node.reports
      ?.map((report) =>searchTree(report, searchTerm, departmentFilter, gradeFilter)).filter((child) => child) || [];

  const isMatch = isNameMatch && isDepartmentMatch && isGradeMatch;

  return isMatch || filteredReports.length > 0
    ? {
        ...node,
        isHighlighted: searchTerm ? isNameMatch : false,
        isExactMatch: searchTerm && isMatch,
        reports: filteredReports,
      }
    : null;
};

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("All");
  const [gradeFilter, setGradeFilter] = useState<string>("All");
  const [scale, setScale] = useState<number>(1);

  const filteredData = data.employees
    .map((employee) =>
      searchTree(employee, searchTerm, departmentFilter, gradeFilter)
    )
    .filter((employee) => employee);

  const zoomIn = () => {
    setScale((prevScale) => Math.min(prevScale + 0.1, 2));
  };

  const zoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.1, 0.5));
  };

  const clearFilters = () => {
    setSearchTerm("");
    setDepartmentFilter("All");
    setGradeFilter("All");
  };

  return (
    <div className="container">
      <header>
        <div className="headerSearch">
          <input
            type="text"
            name="search"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(e.target.value)
            }
          />
          <button id="search-icon">
            <SearchIcon />
          </button>
        </div>
        <div style={{ display: "flex" }}>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
          >
            <option value="All">All Departments</option>
            <option value="Marketing">Marketing</option>
            <option value="Design">Design</option>
            <option value="Sales">Sales</option>
            <option value="Development">Development</option>
            <option value="Operations">Operations</option>
          </select>
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
          >
            <option value="All">All Grades </option>
            <option value="A">Grade A(4-5)</option>
            <option value="B">Grade B(3-4)</option>
            <option value="C">Grade C(2-3)</option>
            <option value="D">Grade D({'<'}2)</option>
          </select>
          <button onClick={clearFilters} id="clear-button">
            Clear Filters
          </button>
        </div>
      </header>
      <div className="tree">
        {filteredData.length === 0 ? (
          <p>No results found</p>
        ) : (
          <ul
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          >
            {filteredData.map((employee, index) => (
              <TreeNode
                key={index}
                node={employee}
                isRoot={true}
                searchTerm={searchTerm}
                gradeFilter={gradeFilter}
              />
            ))}
          </ul>
        )}
      </div>
      <div className="zoom-buttons">
        <div className="inner-zoom-buttons">
          <button onClick={zoomOut}>-</button>
          <span>{(scale * 100).toFixed(0)}%</span>
          <button onClick={zoomIn}>+</button>
        </div>
      </div>
    </div>
  );
};

export default App;
