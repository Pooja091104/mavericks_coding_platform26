import { useState } from "react";
import SkillChart from "./SkillChart";
import SkillAssessment from "./SkillAssessment";
import VideoRecorder from "./VideoRecorder";

export default function ResumeUploader() {
  const [files, setFiles] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAssessment, setShowAssessment] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [assessmentResults, setAssessmentResults] = useState({});
  const [generatingAssessment, setGeneratingAssessment] = useState(false);
  const [generatingSkill, setGeneratingSkill] = useState(null);
  const [showVideoRecorder, setShowVideoRecorder] = useState(false);
  const [recordedVideos, setRecordedVideos] = useState([]);

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
    setError(""); // Clear previous errors
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setError("Please select files first!");
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      const uploadedProfiles = [];

      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);

        // === Change BASE_URL if running backend on different port ===
        const BASE_URL = "http://127.0.0.1:8002/analyze_resume";

        const res = await fetch(BASE_URL, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log("Backend Response:", data);

        if (data.error) {
          throw new Error(data.error);
        }

        // Handle the improved backend response
        let skills = [];
        if (data.skills && Array.isArray(data.skills)) {
          // Backend returns proper array - use it directly
          skills = data.skills.filter(skill => skill && skill.trim().length > 0);
          console.log('✅ Received skills array from backend:', skills);
        } else if (data.skills) {
          console.log('⚠️ Received non-array skills:', data.skills, typeof data.skills);
          // Fallback for string format
          try {
            skills = JSON.parse(data.skills);
            console.log('✅ Parsed JSON skills:', skills);
          } catch (err) {
            console.log('⚠️ JSON parse failed, using string split');
            // Only use string splitting as last resort
            if (typeof data.skills === 'string') {
              skills = data.skills
                .replace(/[\[\]"']/g, "")
                .split(/,|\n/)
                .map((s) => s.trim())
                .filter((s) => s.length > 0);
              console.log('📝 Split skills:', skills);
            }
          }
        } else {
          console.log('❌ No skills data received');
        }

        uploadedProfiles.push({
          filename: data.filename || file.name,
          skills,
          textLength: data.text_length || 0,
          skillsCount: data.skills_count || skills.length,
          processingTime: Date.now()
        });
      }

      setProfiles(uploadedProfiles);
    } catch (err) {
      const errorMessage = err.message || "Upload failed, check console";
      setError(errorMessage);
      console.error("Error uploading resume:", err);
    } finally {
      setLoading(false);
    }
  };

  const generateSkillScores = (idx) => {
    setProfiles((prev) =>
      prev.map((profile, profileIndex) =>
        profileIndex === idx
          ? {
              ...profile,
              skillScores: profile.skills.map((s) => ({
                name: s,
                score: Math.floor(Math.random() * 10) + 1,
              })),
            }
          : profile
      )
    );
  };

  const clearResults = () => {
    setProfiles([]);
    setFiles([]);
    setError("");
    setAssessmentResults({});
  };

  const startSkillAssessment = (skill) => {
    setSelectedSkill(skill);
    setShowAssessment(true);
  };

  const generateAssessmentForAllSkills = async () => {
    if (profiles.length === 0) {
      setError("Please extract skills from a resume first!");
      return;
    }

    // Get all unique skills from all profiles
    const allSkills = new Set();
    profiles.forEach(profile => {
      profile.skills.forEach(skill => allSkills.add(skill));
    });

    const skillsArray = Array.from(allSkills);
    
    if (skillsArray.length === 0) {
      setError("No skills found to assess!");
      return;
    }

    setGeneratingAssessment(true);
    setError("");

    try {
              const response = await fetch("http://127.0.0.1:8002/generate_all_skill_assessments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          skills: skillsArray,
          difficulty: "intermediate"
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      if (!data.success || !data.assessments) {
        throw new Error("Failed to generate assessments");
      }

      // Store all assessments for individual access
      data.assessments.forEach(assessmentData => {
        if (assessmentData.assessment_id) {
          // You can store these in state if needed
          console.log(`Assessment generated for ${assessmentData.skill}: ${assessmentData.assessment_id}`);
        }
      });

      // Start assessment with the first skill
      setSelectedSkill(skillsArray[0]);
      setShowAssessment(true);
      
    } catch (err) {
      setError(`Failed to generate assessments: ${err.message}`);
      console.error("Error generating assessments:", err);
    } finally {
      setGeneratingAssessment(false);
    }
  };

  const generateIndividualSkillAssessment = async (skill) => {
    setGeneratingAssessment(true);
    setGeneratingSkill(skill);
    setError("");

    try {
      console.log(`🎯 Generating assessment for skill: ${skill}`);
      
      const response = await fetch("http://127.0.0.1:8002/generate_skill_assessment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          skills: [skill],
          difficulty: "intermediate"
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Assessment generation response:", data);
      
      if (data.error) {
        throw new Error(data.error);
      }

      if (!data.success || !data.assessment) {
        throw new Error("Failed to generate assessment");
      }

      console.log(`✅ Assessment generated successfully for ${skill}`);
      
      // Start assessment for this skill
      setSelectedSkill(skill);
      setShowAssessment(true);
      
    } catch (err) {
      setError(`Failed to generate assessment for ${skill}: ${err.message}`);
      console.error("Error generating assessment:", err);
    } finally {
      setGeneratingAssessment(false);
      setGeneratingSkill(null);
    }
  };

  const handleAssessmentComplete = (result) => {
    setAssessmentResults(prev => ({
      ...prev,
      [result.skill]: result
    }));
    setShowAssessment(false);
    setSelectedSkill("");
  };

  const closeAssessment = () => {
    setShowAssessment(false);
    setSelectedSkill("");
  };

  return (
    <div className="card">
      <h2>Resume Skill Extractor</h2>
      <p className="text-sm text-gray-600 mb-4">
        Upload your resume (PDF or TXT) to extract technical skills using AI
      </p>
      
      <div className="mb-4">
        <input
          type="file"
          multiple
          accept=".txt,.pdf"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {files.length > 0 && (
          <p className="text-sm text-gray-600 mt-2">
            Selected {files.length} file(s): {files.map(f => f.name).join(", ")}
          </p>
        )}
      </div>

      <div className="flex gap-2 mb-4">
        <button 
          onClick={handleUpload} 
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Extract Skills"}
        </button>
        {profiles.length > 0 && (
          <button 
            onClick={clearResults}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Clear Results
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {profiles.length > 0 && (
        <div>
          <h3>Extracted Skills</h3>
          {profiles.map((p, idx) => (
            <div key={idx} className="mb-6 p-4 border rounded-lg">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-medium text-lg">{p.filename}</p>
                  <p className="text-sm text-gray-600">
                    Extracted {p.skillsCount} skills from {p.textLength} characters
                  </p>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(p.processingTime).toLocaleTimeString()}
                </span>
              </div>
              
              {p.skills.length > 0 ? (
                <div>
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-700">Skills Found ({p.skills.length})</h4>
                      <span className="text-xs text-gray-500">Click any skill to take an assessment</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {p.skills.map((skill, i) => {
                        const hasAssessment = assessmentResults[skill];
                        const isGenerating = generatingSkill === skill;
                        
                        return (
                          <div key={i} className="relative group">
                            <button
                              className={`px-3 py-2 text-sm rounded-full cursor-pointer transition-all duration-200 flex items-center gap-1 ${
                                hasAssessment 
                                  ? 'bg-green-100 text-green-800 border border-green-300 hover:bg-green-200' 
                                  : isGenerating
                                  ? 'bg-yellow-100 text-yellow-800 border border-yellow-300 cursor-wait'
                                  : 'bg-blue-100 text-blue-800 hover:bg-blue-200 border border-blue-300'
                              }`}
                              onClick={() => !isGenerating && generateIndividualSkillAssessment(skill)}
                              disabled={isGenerating}
                              title={hasAssessment ? `Assessed: ${hasAssessment.score}%` : isGenerating ? 'Generating assessment...' : 'Click to assess this skill'}
                            >
                              {isGenerating && (
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-yellow-600"></div>
                              )}
                              {skill}
                              {hasAssessment && (
                                <span className="ml-1 text-xs font-bold bg-green-200 px-1 rounded">
                                  {hasAssessment.score}%
                                </span>
                              )}
                            </button>
                            {hasAssessment && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">✓</span>
                              </div>
                            )}
                            
                            {/* Video recording button for low scores */}
                            {hasAssessment && hasAssessment.score < 80 && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedSkill(skill);
                                  setShowVideoRecorder(true);
                                }}
                                className="absolute -bottom-1 -right-1 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center hover:bg-purple-600"
                                title="Record video demonstration"
                              >
                                <span className="text-white text-xs">🎬</span>
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <button 
                      onClick={() => generateSkillScores(idx)}
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                    >
                      Generate Skill Chart
                    </button>
                    <button 
                      onClick={() => {
                        if (p.skills.length > 0) {
                          generateIndividualSkillAssessment(p.skills[0]); // Start with first skill
                        }
                      }}
                      className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
                      disabled={p.skills.length === 0}
                    >
                      Start Assessment
                    </button>
                  </div>
                  {p.skillScores && <SkillChart skills={p.skillScores} />}
                </div>
              ) : (
                <p className="text-gray-500">No skills found in resume</p>
              )}
            </div>
          ))}
          
          {/* Assessment Results Summary */}
          {Object.keys(assessmentResults).length > 0 && (
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
              <h4 className="font-semibold mb-3 text-purple-800">🎯 Assessment Results Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.entries(assessmentResults).map(([skill, result]) => (
                  <div key={skill} className="bg-white p-3 rounded-lg border">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-sm">{skill}</span>
                      <span className={`font-bold text-sm ${
                        result.score >= 80 ? 'text-green-600' : 
                        result.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {result.score}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full ${
                          result.score >= 80 ? 'bg-green-500' : 
                          result.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${result.score}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {result.results?.weak_skills?.length > 0 ? 
                        `${result.results.weak_skills.length} areas to improve` : 
                        'Strong performance'
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Individual Skill Assessment Instructions */}
          {profiles.length > 0 && (
            <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold mb-3 text-green-800">🎯 Individual Skill Assessments</h4>
              <div className="text-sm text-green-700 mb-3">
                <p className="mb-2"><strong>How it works:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Click on any skill to generate a personalized assessment for that specific skill</li>
                  <li>Each assessment is tailored to the skill you select</li>
                  <li>Complete the assessment to get your score and improvement recommendations</li>
                  <li>Assessed skills will show your score and a green checkmark</li>
                </ul>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button 
                  onClick={generateAssessmentForAllSkills}
                  disabled={generatingAssessment}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {generatingAssessment ? "Generating..." : "Generate All Skill Assessments"}
                </button>
                <span className="text-xs text-gray-600 self-center">
                  Or click individual skills above for targeted assessments
                </span>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Skill Assessment Modal */}
      {showAssessment && selectedSkill && (
        <SkillAssessment
          skill={selectedSkill}
          onComplete={handleAssessmentComplete}
          onClose={closeAssessment}
        />
      )}
      
      {/* Video Recorder Modal */}
      {showVideoRecorder && selectedSkill && (
        <VideoRecorder
          skill={selectedSkill}
          onVideoRecorded={(videoData) => {
            setRecordedVideos(prev => [...prev, videoData]);
            setShowVideoRecorder(false);
            setSelectedSkill("");
          }}
          onClose={() => {
            setShowVideoRecorder(false);
            setSelectedSkill("");
          }}
        />
      )}
    </div>
  );
}
