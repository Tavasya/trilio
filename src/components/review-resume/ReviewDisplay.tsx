import { CheckCircle2, AlertTriangle, Zap, TrendingUp, AlertCircle, Target, Briefcase, GraduationCap, Award, Code, FolderGit2, Mail, Phone, Globe } from 'lucide-react';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import CircularProgress from './CircularProgress';
import type { ResumeReviewResult } from '@/features/resume-review/resumeReviewTypes';

interface ReviewDisplayProps {
  result: ResumeReviewResult;
  onReset: () => void;
}

export default function ReviewDisplay({ result, onReset }: ReviewDisplayProps) {
  const categories = [
    { name: 'Technical Skills', data: result.technical_skills, icon: Code },
    { name: 'Project Impact', data: result.project_impact, icon: Target },
    { name: 'Experience Quality', data: result.experience_quality, icon: Briefcase },
    { name: 'Education', data: result.education_credentials, icon: GraduationCap },
    { name: 'Formatting', data: result.resume_formatting, icon: Award },
    { name: 'Tech Credibility', data: result.tech_credibility, icon: FolderGit2 },
  ];

  return (
    <>
      {/* Full Width - Overall Score Banner */}
      <div className="lg:col-span-3">
        <div className="bg-gradient-to-br from-indigo-50 via-white to-blue-50 rounded-lg border border-indigo-200 p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <CircularProgress value={result.overall_score} size={120} strokeWidth={10} />
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{result.candidate_name}</h2>
                <p className="text-base text-gray-600">
                  Overall Resume Score: <span className="font-semibold text-indigo-600">{result.overall_score}/100</span>
                </p>
                <div className="flex items-center gap-3 text-sm text-gray-600 mt-2">
                  <span className="capitalize">{result.experience_level.replace('-', ' ')}</span>
                  <span>•</span>
                  <span>{result.target_roles.join(', ')}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onReset}
              className="flex items-center gap-2 px-6 py-3 text-base font-semibold text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
            >
              Analyze Another
            </button>
          </div>
        </div>
      </div>

      {/* Two Column Layout - Resume Content vs Feedback */}
      <div className="lg:col-span-3 grid lg:grid-cols-2 gap-6">
        {/* LEFT: Resume Content Preview */}
        <div className="space-y-5">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Resume Header */}
            <div className="px-8 py-6 bg-gradient-to-r from-indigo-50 to-blue-50">
              <h3 className="text-2xl font-semibold text-black">{result.resume_data?.name || result.candidate_name}</h3>

              {/* Contact Info */}
              <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                {result.resume_data?.email && (
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-4 h-4" />
                    <span>{result.resume_data.email}</span>
                  </div>
                )}
                {result.resume_data?.phone && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-4 h-4" />
                    <span>{result.resume_data.phone}</span>
                  </div>
                )}
                {result.resume_data?.linkedin && (
                  <div className="flex items-center gap-1.5">
                    <FaLinkedin className="w-4 h-4" />
                    <span className="truncate max-w-[150px]">{result.resume_data.linkedin}</span>
                  </div>
                )}
                {result.resume_data?.github && (
                  <div className="flex items-center gap-1.5">
                    <FaGithub className="w-4 h-4" />
                    <span className="truncate max-w-[150px]">{result.resume_data.github}</span>
                  </div>
                )}
                {result.resume_data?.portfolio && (
                  <div className="flex items-center gap-1.5">
                    <Globe className="w-4 h-4" />
                    <span className="truncate max-w-[150px]">{result.resume_data.portfolio}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Resume Sections */}
            <div className="border-t border-gray-200">
              {/* Summary Section */}
              {result.resume_data?.summary && (
                <div className="p-8 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <h4 className="text-base font-semibold text-black mb-3">Summary</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">{result.resume_data.summary}</p>
                </div>
              )}

              {/* Technical Skills Section */}
              {result.resume_data?.technical_skills && result.resume_data.technical_skills.length > 0 && (
                <div className="p-8 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-2 mb-3">
                    <Code className="w-5 h-5 text-gray-600" />
                    <h4 className="text-base font-semibold text-black">Technical Skills</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.resume_data.technical_skills.map((skill, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-indigo-100 text-indigo-700 text-sm rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience Section */}
              {result.resume_data?.experience && result.resume_data.experience.length > 0 && (
                <div className="p-8 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-2 mb-4">
                    <Briefcase className="w-5 h-5 text-gray-600" />
                    <h4 className="text-base font-semibold text-black">Experience</h4>
                  </div>
                  <div className="space-y-5">
                    {result.resume_data.experience.map((exp, idx) => (
                      <div key={idx}>
                        <p className="text-base font-semibold text-black">{exp.title}</p>
                        <p className="text-sm text-gray-700 mt-1">{exp.company}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <span>{exp.duration}</span>
                          {exp.location && (
                            <>
                              <span>•</span>
                              <span>{exp.location}</span>
                            </>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 mt-2 leading-relaxed">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects Section */}
              {result.resume_data?.projects && result.resume_data.projects.length > 0 && (
                <div className="p-8 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-2 mb-4">
                    <FolderGit2 className="w-5 h-5 text-gray-600" />
                    <h4 className="text-base font-semibold text-black">Projects</h4>
                  </div>
                  <div className="space-y-4">
                    {result.resume_data.projects.map((project, idx) => (
                      <div key={idx}>
                        <div className="flex items-start justify-between">
                          <p className="text-base font-semibold text-black">{project.name}</p>
                          {project.link && (
                            <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 hover:underline">
                              View
                            </a>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 mt-1">{project.description}</p>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {project.technologies.map((tech, techIdx) => (
                            <span key={techIdx} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education Section */}
              {result.resume_data?.education && result.resume_data.education.length > 0 && (
                <div className="p-8 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-2 mb-4">
                    <GraduationCap className="w-5 h-5 text-gray-600" />
                    <h4 className="text-base font-semibold text-black">Education</h4>
                  </div>
                  <div className="space-y-4">
                    {result.resume_data.education.map((edu, idx) => (
                      <div key={idx}>
                        <p className="text-base font-semibold text-black">{edu.degree}</p>
                        <p className="text-sm text-gray-700 mt-1">{edu.institution}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <span>{edu.year}</span>
                          {edu.gpa && (
                            <>
                              <span>•</span>
                              <span>GPA: {edu.gpa}</span>
                            </>
                          )}
                        </div>
                        {edu.relevant_coursework && edu.relevant_coursework.length > 0 && (
                          <p className="text-xs text-gray-600 mt-2">
                            Relevant Coursework: {edu.relevant_coursework.join(', ')}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications Section */}
              {result.resume_data?.certifications && result.resume_data.certifications.length > 0 && (
                <div className="p-8 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-2 mb-3">
                    <Award className="w-5 h-5 text-gray-600" />
                    <h4 className="text-base font-semibold text-black">Certifications</h4>
                  </div>
                  <ul className="space-y-2">
                    {result.resume_data.certifications.map((cert, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-indigo-600 mt-1">•</span>
                        <span>{cert}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: AI Feedback & Category Scores */}
        <div className="space-y-5">
          {/* Detailed Feedback for Each Category */}
          {categories.map((category, idx) => {
            const Icon = category.icon;
            return (
              <div key={idx} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      category.data.score >= 8 ? 'bg-green-100' :
                      category.data.score >= 6 ? 'bg-yellow-100' : 'bg-red-100'
                    }`}>
                      <Icon className={`w-5 h-5 ${
                        category.data.score >= 8 ? 'text-green-600' :
                        category.data.score >= 6 ? 'text-yellow-600' : 'text-red-600'
                      }`} />
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-gray-900">{category.name}</h4>
                      <p className="text-sm text-gray-500 mt-0.5">Score: {category.data.score}/10</p>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      category.data.score >= 8 ? 'bg-green-500' :
                      category.data.score >= 6 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${(category.data.score / 10) * 100}%` }}
                  />
                </div>

                {/* Feedback */}
                <p className="text-sm text-gray-700 leading-relaxed">
                  {category.data.feedback}
                </p>
              </div>
            );
          })}

          {/* Quick Wins */}
          {result.quick_wins && result.quick_wins.length > 0 && (
            <div className="bg-gradient-to-br from-yellow-50 to-white rounded-lg border border-yellow-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-6 h-6 text-yellow-600" />
                <h4 className="text-base font-semibold text-gray-900">Quick Wins</h4>
              </div>
              <div className="space-y-3">
                {result.quick_wins.slice(0, 3).map((tip, idx) => (
                  <div key={idx} className="flex gap-3 text-sm text-gray-700">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-600 text-white flex items-center justify-center font-semibold text-xs">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed pt-0.5">{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Role Fit Analysis - Full Width */}
      <div className="lg:col-span-3">
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="flex items-start gap-3 mb-4">
            <Target className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Role Fit Analysis</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{result.role_fit_analysis}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Feedback Columns */}
      <div className="lg:col-span-3 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Critical Issues */}
        {result.critical_issues.length > 0 && (
          <div className="bg-red-50 rounded-lg border-2 border-red-200 p-6">
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-bold text-red-900 mb-1">Critical Issues</h3>
                <p className="text-sm text-red-700">Fix immediately</p>
              </div>
            </div>
            <ul className="space-y-2">
              {result.critical_issues.map((issue, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-red-800">
                  <span className="text-red-600 flex-shrink-0 mt-1">•</span>
                  <span>{issue}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Strengths */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start gap-3 mb-4">
            <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
            <h3 className="text-lg font-bold text-gray-900">Strengths</h3>
          </div>
          <ul className="space-y-2">
            {result.strengths.map((strength, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-green-600 flex-shrink-0 mt-1">✓</span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Improvements */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" />
            <h3 className="text-lg font-bold text-gray-900">Improvements</h3>
          </div>
          <ul className="space-y-2">
            {result.improvements.slice(0, 5).map((improvement, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-indigo-600 flex-shrink-0 mt-1">→</span>
                <span>{improvement}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ATS Issues */}
        {result.ats_issues.length > 0 && (
          <div className="bg-orange-50 rounded-lg border-2 border-orange-200 p-6">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-bold text-orange-900 mb-1">ATS Issues</h3>
                <p className="text-sm text-orange-700">May cause parsing problems</p>
              </div>
            </div>
            <ul className="space-y-2">
              {result.ats_issues.map((issue, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-orange-800">
                  <span className="text-orange-600 flex-shrink-0 mt-1">!</span>
                  <span>{issue}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Missing Tech Elements */}
        {result.missing_tech_elements.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Missing Tech Elements</h3>
            <ul className="space-y-2">
              {result.missing_tech_elements.map((element, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-gray-400 flex-shrink-0 mt-1">○</span>
                  <span>{element}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Keyword Suggestions */}
        {result.keyword_suggestions.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Keyword Suggestions</h3>
            <ul className="space-y-2">
              {result.keyword_suggestions.map((keyword, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-indigo-600 flex-shrink-0 mt-1">#</span>
                  <span>{keyword}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="lg:col-span-3">
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg p-8 text-white text-center">
          <h3 className="text-xl font-semibold mb-3">Ready to build your LinkedIn presence?</h3>
          <p className="text-base text-indigo-100 mb-6">Use Trilio to create engaging content that showcases your expertise</p>
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 text-base font-semibold rounded-full hover:bg-gray-100 transition-colors"
          >
            Try Trilio Free
          </a>
        </div>
      </div>
    </>
  );
}
