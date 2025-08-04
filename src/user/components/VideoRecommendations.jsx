import { useState, useEffect } from "react";

export default function VideoRecommendations({ weakSkills, onVideoComplete }) {
  const [recommendedVideos, setRecommendedVideos] = useState([]);
  const [completedVideos, setCompletedVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Sample video recommendations based on weak skills
  const videoDatabase = {
    "JavaScript": [
      {
        id: "js-1",
        title: "JavaScript Fundamentals for Beginners",
        description: "Learn the basics of JavaScript including variables, functions, and DOM manipulation",
        url: "https://www.youtube.com/watch?v=W6NZfCO5SIk",
        duration: "3:12:00",
        skill: "JavaScript",
        difficulty: "beginner"
      },
      {
        id: "js-2",
        title: "Advanced JavaScript Concepts",
        description: "Master closures, promises, async/await, and modern ES6+ features",
        url: "https://www.youtube.com/watch?v=Mus_vwhTCq0",
        duration: "2:45:30",
        skill: "JavaScript",
        difficulty: "advanced"
      }
    ],
    "Python": [
      {
        id: "py-1",
        title: "Python for Beginners - Full Course",
        description: "Complete Python tutorial for beginners with hands-on projects",
        url: "https://www.youtube.com/watch?v=_uQrJ0TkZlc",
        duration: "4:26:00",
        skill: "Python",
        difficulty: "beginner"
      },
      {
        id: "py-2",
        title: "Python Data Structures and Algorithms",
        description: "Learn data structures and algorithms in Python",
        url: "https://www.youtube.com/watch?v=pkYVOmU3MgA",
        duration: "1:55:20",
        skill: "Python",
        difficulty: "intermediate"
      }
    ],
    "React": [
      {
        id: "react-1",
        title: "React Tutorial for Beginners",
        description: "Learn React from scratch with practical examples",
        url: "https://www.youtube.com/watch?v=w7ejDZ8SWv8",
        duration: "2:25:00",
        skill: "React",
        difficulty: "beginner"
      },
      {
        id: "react-2",
        title: "Advanced React Patterns",
        description: "Master advanced React concepts like hooks, context, and performance optimization",
        url: "https://www.youtube.com/watch?v=dpw9EHDh2bM",
        duration: "1:45:30",
        skill: "React",
        difficulty: "advanced"
      }
    ],
    "Node.js": [
      {
        id: "node-1",
        title: "Node.js and Express.js - Full Course",
        description: "Build REST APIs and web applications with Node.js and Express",
        url: "https://www.youtube.com/watch?v=Oe421EPjeBE",
        duration: "2:15:00",
        skill: "Node.js",
        difficulty: "intermediate"
      }
    ],
    "Database Design": [
      {
        id: "db-1",
        title: "Database Design for Beginners",
        description: "Learn database design principles and SQL fundamentals",
        url: "https://www.youtube.com/watch?v=ztHopE5Wnpc",
        duration: "1:30:00",
        skill: "Database Design",
        difficulty: "beginner"
      }
    ]
  };

  useEffect(() => {
    if (weakSkills && weakSkills.length > 0) {
      generateRecommendations();
    }
  }, [weakSkills]);

  const generateRecommendations = () => {
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const recommendations = [];
      
      weakSkills.forEach(skill => {
        const skillVideos = videoDatabase[skill] || [];
        recommendations.push(...skillVideos);
      });
      
      setRecommendedVideos(recommendations);
      setLoading(false);
    }, 1000);
  };

  const markVideoComplete = (videoId) => {
    const video = recommendedVideos.find(v => v.id === videoId);
    if (video && !completedVideos.find(v => v.id === videoId)) {
      setCompletedVideos(prev => [...prev, video]);
      if (onVideoComplete) {
        onVideoComplete(video);
      }
    }
  };

  const getProgressPercentage = () => {
    if (recommendedVideos.length === 0) return 0;
    return Math.round((completedVideos.length / recommendedVideos.length) * 100);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Generating video recommendations...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800">📚 Recommended Learning Videos</h3>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">{getProgressPercentage()}%</div>
          <div className="text-sm text-gray-600">Complete</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
        <div 
          className="bg-blue-600 h-3 rounded-full transition-all duration-300"
          style={{ width: `${getProgressPercentage()}%` }}
        ></div>
      </div>

      {/* Progress Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{recommendedVideos.length}</div>
          <div className="text-sm text-gray-600">Total Videos</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{completedVideos.length}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">{recommendedVideos.length - completedVideos.length}</div>
          <div className="text-sm text-gray-600">Remaining</div>
        </div>
      </div>

      {/* Video List */}
      <div className="space-y-4">
        {recommendedVideos.map((video) => {
          const isCompleted = completedVideos.find(v => v.id === video.id);
          
          return (
            <div 
              key={video.id} 
              className={`border rounded-lg p-4 transition-all duration-200 ${
                isCompleted 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-gray-800">{video.title}</h4>
                    {isCompleted && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✓ Completed
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3">{video.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <span className="mr-1">🎯</span>
                      {video.skill}
                    </span>
                    <span className="flex items-center">
                      <span className="mr-1">⏱️</span>
                      {video.duration}
                    </span>
                    <span className="flex items-center">
                      <span className="mr-1">📊</span>
                      {video.difficulty}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 ml-4">
                  <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                  >
                    Watch Video
                  </a>
                  
                  {!isCompleted && (
                    <button
                      onClick={() => markVideoComplete(video.id)}
                      className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                    >
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {recommendedVideos.length === 0 && (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🎉</div>
          <h4 className="text-lg font-semibold text-gray-800 mb-2">No Weak Skills Detected!</h4>
          <p className="text-gray-600">Great job! Your assessment shows strong skills across all areas.</p>
        </div>
      )}
    </div>
  );
} 