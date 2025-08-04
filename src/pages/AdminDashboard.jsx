import { useState, useEffect } from "react";
import agentManager, { AGENT_TYPES, AGENT_STATUS } from "../agents/AgentManager";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [activeTab, setActiveTab] = useState("overview");
  const [agentStatus, setAgentStatus] = useState({});
  const [hackathons, setHackathons] = useState([]);

  useEffect(() => {
    // Load mock data
    loadMockData();
    
    // Update agent status periodically
    const interval = setInterval(() => {
      setAgentStatus(agentManager.getWorkflowStatus());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const loadMockData = () => {
    // Mock users data
    setUsers([
      {
        id: 1,
        name: "Alex Johnson",
        email: "alex@example.com",
        skills: ["JavaScript", "React", "Node.js"],
        progress: 85,
        assessmentsTaken: 8,
        videosCompleted: 12,
        projectsCompleted: 3,
        lastActive: "2024-01-15T10:30:00Z",
        status: "active"
      },
      {
        id: 2,
        name: "Sarah Chen",
        email: "sarah@example.com",
        skills: ["Python", "Machine Learning", "Data Science"],
        progress: 72,
        assessmentsTaken: 6,
        videosCompleted: 8,
        projectsCompleted: 2,
        lastActive: "2024-01-14T15:45:00Z",
        status: "active"
      },
      {
        id: 3,
        name: "Mike Rodriguez",
        email: "mike@example.com",
        skills: ["Java", "Spring Boot", "Docker"],
        progress: 45,
        assessmentsTaken: 3,
        videosCompleted: 5,
        projectsCompleted: 1,
        lastActive: "2024-01-13T09:20:00Z",
        status: "inactive"
      }
    ]);

    // Mock analytics
    setAnalytics({
      totalUsers: 156,
      activeUsers: 89,
      totalAssessments: 1247,
      totalVideosWatched: 3421,
      totalProjectsCompleted: 234,
      averageProgress: 68,
      topSkills: ["JavaScript", "Python", "React", "Node.js", "Machine Learning"],
      userGrowth: [
        { month: "Jan", users: 120 },
        { month: "Feb", users: 135 },
        { month: "Mar", users: 142 },
        { month: "Apr", users: 156 }
      ]
    });

    // Mock hackathons
    setHackathons([
      {
        id: 1,
        name: "AI Innovation Challenge",
        participants: 45,
        submissions: 23,
        status: "active",
        startDate: "2024-01-15",
        endDate: "2024-02-15",
        prize: "$5000"
      },
      {
        id: 2,
        name: "Web Development Sprint",
        participants: 32,
        submissions: 18,
        status: "active",
        startDate: "2024-01-20",
        endDate: "2024-02-20",
        prize: "$3000"
      }
    ]);
  };

  const getAgentStatusColor = (status) => {
    switch (status) {
      case AGENT_STATUS.COMPLETED: return "text-green-600";
      case AGENT_STATUS.PROCESSING: return "text-yellow-600";
      case AGENT_STATUS.ERROR: return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getAgentStatusIcon = (status) => {
    switch (status) {
      case AGENT_STATUS.COMPLETED: return "✅";
      case AGENT_STATUS.PROCESSING: return "🔄";
      case AGENT_STATUS.ERROR: return "❌";
      default: return "⏸️";
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Mavericks AI Learning Platform - Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage users, monitor AI agents, and track platform analytics
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-blue-600">{analytics.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-green-600">{analytics.activeUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <span className="text-2xl">📝</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Assessments</p>
                <p className="text-2xl font-bold text-purple-600">{analytics.totalAssessments}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-full">
                <span className="text-2xl">🎯</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Progress</p>
                <p className="text-2xl font-bold text-orange-600">{analytics.averageProgress}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("overview")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "overview"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                📊 Overview
              </button>
              <button
                onClick={() => setActiveTab("users")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "users"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                👥 User Management
              </button>
              <button
                onClick={() => setActiveTab("agents")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "agents"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                🤖 AI Agents
              </button>
              <button
                onClick={() => setActiveTab("hackathons")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "hackathons"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                🏆 Hackathons
              </button>
              <button
                onClick={() => setActiveTab("analytics")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "analytics"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                📈 Analytics
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border rounded-lg p-6">
                    <h4 className="text-lg font-semibold mb-4">📈 User Growth</h4>
                    <div className="space-y-2">
                      {analytics.userGrowth?.map((data, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">{data.month}</span>
                          <span className="font-medium">{data.users} users</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white border rounded-lg p-6">
                    <h4 className="text-lg font-semibold mb-4">🎯 Top Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {analytics.topSkills?.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-white border rounded-lg p-6">
                  <h4 className="text-lg font-semibold mb-4">📊 Platform Statistics</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {analytics.totalVideosWatched}
                      </div>
                      <div className="text-sm text-gray-600">Videos Watched</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {analytics.totalProjectsCompleted}
                      </div>
                      <div className="text-sm text-gray-600">Projects Completed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {hackathons.length}
                      </div>
                      <div className="text-sm text-gray-600">Active Hackathons</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {hackathons.reduce((sum, h) => sum + h.participants, 0)}
                      </div>
                      <div className="text-sm text-gray-600">Hackathon Participants</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === "users" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-800">👥 User Management</h3>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Export Users
                  </button>
                </div>

                <div className="bg-white border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Skills
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Progress
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Activity
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-wrap gap-1">
                              {user.skills.slice(0, 3).map((skill, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                                >
                                  {skill}
                                </span>
                              ))}
                              {user.skills.length > 3 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                  +{user.skills.length - 3}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${user.progress}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-900">{user.progress}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.lastActive).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                            <button className="text-red-600 hover:text-red-900">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Agents Tab */}
            {activeTab === "agents" && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-6">🤖 AI Agent Management</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(agentStatus).map(([type, agent]) => (
                    <div key={type} className="bg-white border rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold capitalize">
                          {type.replace('_', ' ')} Agent
                        </h4>
                        <span className={`text-lg ${getAgentStatusColor(agent.status)}`}>
                          {getAgentStatusIcon(agent.status)}
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium">Status:</span> {agent.status}
                        </div>
                        {agent.lastResult && (
                          <div>
                            <span className="font-medium">Last Result:</span> 
                            <div className="text-xs text-gray-600 mt-1">
                              {JSON.stringify(agent.lastResult, null, 2)}
                            </div>
                          </div>
                        )}
                        {agent.error && (
                          <div>
                            <span className="font-medium text-red-600">Error:</span> 
                            <div className="text-xs text-red-600 mt-1">{agent.error}</div>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 flex gap-2">
                        <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
                          Restart
                        </button>
                        <button className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700">
                          Logs
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 bg-white border rounded-lg p-6">
                  <h4 className="text-lg font-semibold mb-4">🔄 Agent Workflow</h4>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        1
                      </div>
                      <div className="ml-4">
                        <div className="font-medium">Profile Agent</div>
                        <div className="text-sm text-gray-600">Extract skills from resume</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        2
                      </div>
                      <div className="ml-4">
                        <div className="font-medium">Assessment Agent</div>
                        <div className="text-sm text-gray-600">Generate skill assessments</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        3
                      </div>
                      <div className="ml-4">
                        <div className="font-medium">Recommender Agent</div>
                        <div className="text-sm text-gray-600">Generate learning recommendations</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        4
                      </div>
                      <div className="ml-4">
                        <div className="font-medium">Tracker Agent</div>
                        <div className="text-sm text-gray-600">Track user progress</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Hackathons Tab */}
            {activeTab === "hackathons" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-800">🏆 Hackathon Management</h3>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Create Hackathon
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {hackathons.map((hackathon) => (
                    <div key={hackathon.id} className="bg-white border rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-semibold text-lg">{hackathon.name}</h4>
                        <span className={`px-2 py-1 rounded text-xs ${
                          hackathon.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {hackathon.status}
                        </span>
                      </div>
                      
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Participants:</span>
                          <span className="font-medium">{hackathon.participants}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Submissions:</span>
                          <span className="font-medium">{hackathon.submissions}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Prize:</span>
                          <span className="font-medium text-green-600">{hackathon.prize}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Duration:</span>
                          <span className="font-medium">
                            {hackathon.startDate} - {hackathon.endDate}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
                          View Details
                        </button>
                        <button className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700">
                          Manage
                        </button>
                        <button className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700">
                          End
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === "analytics" && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-6">📈 Detailed Analytics</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border rounded-lg p-6">
                    <h4 className="text-lg font-semibold mb-4">📊 User Engagement</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Daily Active Users</span>
                        <span className="font-medium">89</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Weekly Active Users</span>
                        <span className="font-medium">134</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Monthly Active Users</span>
                        <span className="font-medium">156</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Average Session Duration</span>
                        <span className="font-medium">24 min</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border rounded-lg p-6">
                    <h4 className="text-lg font-semibold mb-4">🎯 Learning Metrics</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Average Assessment Score</span>
                        <span className="font-medium">76%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Video Completion Rate</span>
                        <span className="font-medium">68%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Project Completion Rate</span>
                        <span className="font-medium">45%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>User Retention (30 days)</span>
                        <span className="font-medium">78%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-white border rounded-lg p-6">
                  <h4 className="text-lg font-semibold mb-4">📈 Performance Trends</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">+15%</div>
                      <div className="text-sm text-gray-600">User Growth</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">+8%</div>
                      <div className="text-sm text-gray-600">Assessment Scores</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">+12%</div>
                      <div className="text-sm text-gray-600">Video Engagement</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 