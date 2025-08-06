import { useState, useEffect } from "react";
import agentManager, { AGENT_TYPES, AGENT_STATUS } from "../../agents/AgentManager";
import SkillAssessmentDashboard from "./SkillAssessmentDashboard";
import ResumeUploader from "./ResumeUploader";
import ProgressStepper from "./ProgressStepper";
import LearningPathTable from "./LearningPathTable";
import Leaderboard from "./Leaderboard";

export default function EnhancedUserDashboard() {
  const [userProfile, setUserProfile] = useState(null);
  const [workflowStatus, setWorkflowStatus] = useState({});
  const [activeTab, setActiveTab] = useState("overview");
  const [isWorkflowRunning, setIsWorkflowRunning] = useState(false);
  const [workflowResults, setWorkflowResults] = useState(null);
  const [resumeData, setResumeData] = useState(null);

  useEffect(() => {
    // Subscribe to agent events
    agentManager.subscribe('profile_completed', handleProfileCompleted);
    agentManager.subscribe('assessment_completed', handleAssessmentCompleted);
    agentManager.subscribe('recommender_completed', handleRecommenderCompleted);
    agentManager.subscribe('tracker_completed', handleTrackerCompleted);
    agentManager.subscribe('workflow_error', handleWorkflowError);

    // Load existing user data
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }

    return () => {
      // Cleanup subscriptions
      agentManager.eventListeners.clear();
    };
  }, []);

  const handleProfileCompleted = (profileData) => {
    console.log("Profile completed:", profileData);
    setUserProfile(profileData);
    localStorage.setItem("userProfile", JSON.stringify(profileData));
  };

  const handleAssessmentCompleted = (assessmentData) => {
    console.log("Assessment completed:", assessmentData);
    setWorkflowResults(prev => ({ ...prev, assessment: assessmentData }));
  };

  const handleRecommenderCompleted = (recommenderData) => {
    console.log("Recommender completed:", recommenderData);
    setWorkflowResults(prev => ({ ...prev, recommender: recommenderData }));
  };

  const handleTrackerCompleted = (trackerData) => {
    console.log("Tracker completed:", trackerData);
    setWorkflowResults(prev => ({ ...prev, tracker: trackerData }));
    setIsWorkflowRunning(false);
  };

  const handleWorkflowError = (error) => {
    console.error("Workflow error:", error);
    setIsWorkflowRunning(false);
  };

  const startAgentWorkflow = async (userData) => {
    setIsWorkflowRunning(true);
    setWorkflowResults(null);
    
    try {
      const results = await agentManager.executeWorkflow(userData);
      setWorkflowResults(results);
      console.log("Workflow completed successfully:", results);
    } catch (error) {
      console.error("Workflow failed:", error);
    } finally {
      setIsWorkflowRunning(false);
    }
  };

  const handleResumeUpload = async (resumeFile) => {
    setResumeData(resumeFile);
    
    const userData = {
      resume: resumeFile,
      name: "User", // This could be collected from a form
      email: "user@example.com",
      experience: "beginner"
    };

    await startAgentWorkflow(userData);
  };

  const getWorkflowProgress = () => {
    const status = agentManager.getWorkflowStatus();
    const totalAgents = Object.keys(AGENT_TYPES).length;
    const completedAgents = Object.values(status).filter(
      agent => agent.status === AGENT_STATUS.COMPLETED
    ).length;
    
    return Math.round((completedAgents / totalAgents) * 100);
  };

  const getCurrentStep = () => {
    if (!userProfile) return 1;
    if (!workflowResults?.assessment) return 2;
    if (!workflowResults?.recommender) return 3;
    if (!workflowResults?.tracker) return 4;
    return 5;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Mavericks AI Learning Platform
          </h1>
          <p className="text-gray-600">
            Your personalized AI-powered learning journey
          </p>
        </div>

        {/* Workflow Progress */}
        {isWorkflowRunning && (
          <div className="mb-8 bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                🤖 AI Agents Processing...
              </h3>
              <div className="text-sm text-gray-600">
                {getWorkflowProgress()}% Complete
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${getWorkflowProgress()}%` }}
              ></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
              {Object.entries(agentManager.getWorkflowStatus()).map(([type, agent]) => (
                <div key={type} className="text-center">
                  <div className={`w-3 h-3 rounded-full mx-auto mb-1 ${
                    agent.status === AGENT_STATUS.COMPLETED ? 'bg-green-500' :
                    agent.status === AGENT_STATUS.PROCESSING ? 'bg-yellow-500' :
                    agent.status === AGENT_STATUS.ERROR ? 'bg-red-500' : 'bg-gray-300'
                  }`}></div>
                  <div className="text-xs text-gray-600 capitalize">
                    {type.replace('_', ' ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Progress Stepper */}
        <ProgressStepper currentStep={getCurrentStep()} />

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6 overflow-x-auto">
              <button
                onClick={() => setActiveTab("overview")}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === "overview"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                📊 Overview
              </button>
              <button
                onClick={() => setActiveTab("profile")}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === "profile"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                👤 Profile & Resume
              </button>
              <button
                onClick={() => setActiveTab("assessments")}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === "assessments"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                📝 Skill Assessments
              </button>
              <button
                onClick={() => setActiveTab("learning")}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === "learning"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                🎯 Learning Path
              </button>
              <button
                onClick={() => setActiveTab("hackathons")}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === "hackathons"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                🏆 Hackathons
              </button>
              <button
                onClick={() => setActiveTab("leaderboard")}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === "leaderboard"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                🏅 Leaderboard
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                    <div className="flex items-center">
                      <div className="p-3 bg-white bg-opacity-20 rounded-full">
                        <span className="text-2xl">👤</span>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm opacity-90">Skills Identified</p>
                        <p className="text-2xl font-bold">
                          {userProfile?.skills?.length || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                    <div className="flex items-center">
                      <div className="p-3 bg-white bg-opacity-20 rounded-full">
                        <span className="text-2xl">📝</span>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm opacity-90">Assessments</p>
                        <p className="text-2xl font-bold">
                          {workflowResults?.assessment?.generatedAssessments || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                    <div className="flex items-center">
                      <div className="p-3 bg-white bg-opacity-20 rounded-full">
                        <span className="text-2xl">🎯</span>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm opacity-90">Recommendations</p>
                        <p className="text-2xl font-bold">
                          {workflowResults?.recommender?.totalRecommendations || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
                    <div className="flex items-center">
                      <div className="p-3 bg-white bg-opacity-20 rounded-full">
                        <span className="text-2xl">🏆</span>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm opacity-90">Active Hackathons</p>
                        <p className="text-2xl font-bold">
                          {workflowResults?.hackathon?.activeHackathons?.length || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {!userProfile && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🚀</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      Welcome to Mavericks AI Learning Platform
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Upload your resume to start your personalized learning journey
                    </p>
                    <button
                      onClick={() => setActiveTab("profile")}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                    >
                      Get Started
                    </button>
                  </div>
                )}

                {userProfile && (
                  <div className="space-y-6">
                    <div className="bg-white border rounded-lg p-6">
                      <h4 className="text-lg font-semibold mb-4">🎯 Your Skills Profile</h4>
                      <div className="flex flex-wrap gap-2">
                        {userProfile.skills?.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {workflowResults?.recommender && (
                      <div className="bg-white border rounded-lg p-6">
                        <h4 className="text-lg font-semibold mb-4">📚 Learning Recommendations</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl mb-2">📺</div>
                            <div className="font-semibold">Videos</div>
                            <div className="text-sm text-gray-600">
                              {workflowResults.recommender.recommendations.filter(r => r.type === 'video').length}
                            </div>
                          </div>
                          <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl mb-2">📖</div>
                            <div className="font-semibold">Courses</div>
                            <div className="text-sm text-gray-600">
                              {workflowResults.recommender.recommendations.filter(r => r.type === 'course').length}
                            </div>
                          </div>
                          <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <div className="text-2xl mb-2">🛠️</div>
                            <div className="font-semibold">Projects</div>
                            <div className="text-sm text-gray-600">
                              {workflowResults.recommender.recommendations.filter(r => r.type === 'project').length}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-6">👤 Profile & Resume Analysis</h3>
                <ResumeUploader onResumeUpload={handleResumeUpload} />
                
                {userProfile && (
                  <div className="mt-8 bg-white border rounded-lg p-6">
                    <h4 className="text-lg font-semibold mb-4">✅ Profile Created Successfully</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-medium mb-2">Personal Information</h5>
                        <div className="space-y-2 text-sm">
                          <div><span className="font-medium">Name:</span> {userProfile.name}</div>
                          <div><span className="font-medium">Email:</span> {userProfile.email}</div>
                          <div><span className="font-medium">Experience:</span> {userProfile.experience}</div>
                          <div><span className="font-medium">Created:</span> {new Date(userProfile.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Skills Identified ({userProfile.skills?.length || 0})</h5>
                        <div className="flex flex-wrap gap-2">
                          {userProfile.skills?.map((skill, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Assessments Tab */}
            {activeTab === "assessments" && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-6">📝 Skill Assessments</h3>
                <SkillAssessmentDashboard />
              </div>
            )}

            {/* Learning Path Tab */}
            {activeTab === "learning" && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-6">🎯 Personalized Learning Path</h3>
                {workflowResults?.tracker ? (
                  <div className="space-y-6">
                    <div className="bg-white border rounded-lg p-6">
                      <h4 className="text-lg font-semibold mb-4">📊 Progress Overview</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {workflowResults.tracker.progress.videosCompleted}
                          </div>
                          <div className="text-sm text-gray-600">Videos Completed</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {workflowResults.tracker.progress.coursesCompleted}
                          </div>
                          <div className="text-sm text-gray-600">Courses Completed</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            {workflowResults.tracker.progress.projectsCompleted}
                          </div>
                          <div className="text-sm text-gray-600">Projects Completed</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-600">
                            {workflowResults.tracker.progress.assessmentsTaken}
                          </div>
                          <div className="text-sm text-gray-600">Assessments Taken</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border rounded-lg p-6">
                      <h4 className="text-lg font-semibold mb-4">🎯 Learning Phases</h4>
                      <div className="space-y-4">
                        {workflowResults.tracker.learningPath.phases.map((phase, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-medium">{phase.name}</h5>
                              <span className={`px-2 py-1 rounded text-xs ${
                                phase.completed 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                {phase.completed ? 'Completed' : 'In Progress'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{phase.description}</p>
                            <div className="text-sm text-gray-500">
                              {phase.items.length} items available
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <LearningPathTable />
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4">📚</div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">
                      Learning Path Not Generated Yet
                    </h4>
                    <p className="text-gray-600">
                      Complete your profile and assessments to generate your personalized learning path.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Hackathons Tab */}
            {activeTab === "hackathons" && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-6">🏆 Hackathons & Challenges</h3>
                {workflowResults?.hackathon ? (
                  <div className="space-y-6">
                    <div className="bg-white border rounded-lg p-6">
                      <h4 className="text-lg font-semibold mb-4">🔥 Active Hackathons</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {workflowResults.hackathon.activeHackathons.map((hackathon) => (
                          <div key={hackathon.id} className="border rounded-lg p-4">
                            <h5 className="font-semibold mb-2">{hackathon.name}</h5>
                            <p className="text-sm text-gray-600 mb-3">{hackathon.description}</p>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-green-600 font-medium">{hackathon.prize}</span>
                              <span className="text-gray-500">{hackathon.participants} participants</span>
                            </div>
                            <button className="w-full mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                              Join Hackathon
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white border rounded-lg p-6">
                      <h4 className="text-lg font-semibold mb-4">🎯 Recommended Challenges</h4>
                      <div className="space-y-4">
                        {workflowResults.hackathon.challenges.map((challenge) => (
                          <div key={challenge.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="font-semibold">{challenge.title}</h5>
                              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                                {challenge.points} points
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex gap-2">
                                {challenge.skills.map((skill) => (
                                  <span key={skill} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                              <span className="text-gray-500">{challenge.estimatedTime}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4">🏆</div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">
                      Hackathon System Not Initialized
                    </h4>
                    <p className="text-gray-600">
                      Complete your profile to access hackathons and challenges.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Leaderboard Tab */}
            {activeTab === "leaderboard" && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-6">🏅 Leaderboard & Achievements</h3>
                <Leaderboard user={user} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}