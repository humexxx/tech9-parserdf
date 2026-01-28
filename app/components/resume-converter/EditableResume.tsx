"use client";

import { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import Image from "next/image";
import { ResumeData, EditableSection } from "@/app/types/resume";

interface EditableResumeProps {
  data: ResumeData;
  format: string;
  onDataChange?: (data: ResumeData) => void;
}

export default function EditableResume({ data, format, onDataChange }: EditableResumeProps) {
  const [editingSection, setEditingSection] = useState<EditableSection>(null);
  const [editedData, setEditedData] = useState<ResumeData>(data);
  const [originalData, setOriginalData] = useState<ResumeData>(data);

  const displayData = editedData;

  const handleSectionClick = (section: EditableSection) => {
    if (editingSection === section) {
      setEditingSection(null);
    } else {
      setEditingSection(section);
      if (!originalData) {
        setOriginalData({ ...editedData });
      }
    }
  };

  const handleCancel = () => {
    if (originalData && editedData && editingSection) {
      // Restore only the field being edited
      setEditedData({
        ...editedData,
        [editingSection]: originalData[editingSection as keyof ResumeData]
      });
    }
    setEditingSection(null);
  };

  const handleSave = () => {
    setEditingSection(null);
    // Update original data to current edited data
    setOriginalData({ ...editedData });
    // Notify parent of changes
    onDataChange?.(editedData);
  };

  return (
    <div className="w-full max-w-175 p-12 bg-white dark:bg-zinc-800">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="h-9 w-32 relative" style={{ aspectRatio: '32/9' }}>
          <Image
            src="/logo.svg"
            alt="Tech9 Logo"
            fill
            className="object-contain"
            style={{ filter: 'brightness(0) saturate(100%) invert(65%) sepia(94%) saturate(1761%) hue-rotate(161deg) brightness(93%) contrast(91%)' }}
            unoptimized
          />
        </div>
      </div>

      <hr className="border-t border-gray-300 mb-8" />

      {/* Name */}
      <div 
        className={`mb-2 cursor-pointer relative group ${editingSection === "name" ? "ring-2 ring-[#3CBCEC] rounded p-2" : "hover:bg-gray-50 dark:hover:bg-zinc-700 rounded p-2"}`}
        onClick={() => handleSectionClick("name")}
      >
        {editingSection !== "name" && (
          <Pencil className="absolute right-2 top-2 w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
        {editingSection === "name" ? (
          <div onClick={(e) => e.stopPropagation()}>
            <input
              type="text"
              value={editedData?.name || ""}
              onChange={(e) => setEditedData(prev => ({ ...prev, name: e.target.value }))}
              className="text-3xl font-bold w-full border-b border-[#3CBCEC] focus:outline-none mb-2"
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={handleCancel}
                className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-2 py-1 text-xs bg-[#3CBCEC] text-white rounded hover:bg-[#2da5cc] transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <h1 className="text-3xl font-bold">{displayData.name}</h1>
        )}
      </div>
      
      {/* Location */}
      <div 
        className={`cursor-pointer relative group ${editingSection === "location" ? "ring-2 ring-[#3CBCEC] rounded p-2 mb-1" : "hover:bg-gray-50 dark:hover:bg-zinc-700 rounded p-2 mb-1"}`}
        onClick={(e) => { e.stopPropagation(); handleSectionClick("location"); }}
      >
        {editingSection !== "location" && (
          <Pencil className="absolute right-2 top-2 w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
        {editingSection === "location" ? (
          <div onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-1 mb-2">
              <span className="text-sm font-semibold">Location:</span>
              <input
                type="text"
                value={editedData?.location.replace('Location:', '').trim() || ""}
                onChange={(e) => setEditedData(prev => ({ ...prev, location: `Location: ${e.target.value}` }))}
                className="text-sm flex-1 border-b border-[#3CBCEC] focus:outline-none"
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={handleCancel}
                className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-2 py-1 text-xs bg-[#3CBCEC] text-white rounded hover:bg-[#2da5cc] transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm">{displayData.location}</p>
        )}
      </div>

      {/* LinkedIn */}
      <div 
        className={`mb-6 cursor-pointer relative group ${editingSection === "linkedIn" ? "ring-2 ring-[#3CBCEC] rounded p-2" : "hover:bg-gray-50 dark:hover:bg-zinc-700 rounded p-2"}`}
        onClick={(e) => { e.stopPropagation(); handleSectionClick("linkedIn"); }}
      >
        {editingSection !== "linkedIn" && (
          <Pencil className="absolute right-2 top-2 w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
        {editingSection === "linkedIn" ? (
          <div onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-1 mb-2">
              <span className="text-sm font-semibold">LinkedIn Profile:</span>
              <input
                type="text"
                value={editedData?.linkedIn.replace('LinkedIn Profile:', '').trim() || ""}
                onChange={(e) => setEditedData(prev => ({ ...prev, linkedIn: `LinkedIn Profile: ${e.target.value}` }))}
                className="text-sm flex-1 border-b border-[#3CBCEC] focus:outline-none"
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={handleCancel}
                className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-2 py-1 text-xs bg-[#3CBCEC] text-white rounded hover:bg-[#2da5cc] transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm">{displayData.linkedIn}</p>
        )}
      </div>

      {/* Summary */}
      <section 
        className={`mb-6 cursor-pointer relative group ${editingSection === "summary" ? "ring-2 ring-[#3CBCEC] rounded p-2" : "hover:bg-gray-50 dark:hover:bg-zinc-700 rounded p-2"}`}
        onClick={() => handleSectionClick("summary")}
      >
        {editingSection !== "summary" && (
          <Pencil className="absolute right-2 top-2 w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
        <h2 className="text-lg font-bold text-[#3CBCEC] mb-2">SUMMARY</h2>
        {editingSection === "summary" ? (
          <div onClick={(e) => e.stopPropagation()}>
            <textarea
              value={editedData?.summary || ""}
              onChange={(e) => setEditedData(prev => ({ ...prev, summary: e.target.value }))}
              className="text-sm w-full border border-[#3CBCEC] rounded p-2 focus:outline-none min-h-[80px]"
              autoFocus
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={handleCancel}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-1 text-sm bg-[#3CBCEC] text-white rounded hover:bg-[#2da5cc] transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm">{displayData.summary}</p>
        )}
      </section>

      {/* Skills - Top position */}
      {format === "skill-at-top" && (
        <section 
          className={`mb-6 cursor-pointer relative group ${editingSection === "skills" ? "ring-2 ring-[#3CBCEC] rounded p-2" : "hover:bg-gray-50 dark:hover:bg-zinc-700 rounded p-2"}`}
          onClick={() => handleSectionClick("skills")}
        >
          {editingSection !== "skills" && (
            <Pencil className="absolute right-2 top-2 w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
          <h2 className="text-lg font-bold text-[#3CBCEC] mb-2">SKILLS</h2>
          {editingSection === "skills" ? (
            <div onClick={(e) => e.stopPropagation()}>
              <div className="bg-[#E6F7FC] dark:bg-zinc-700 p-4 rounded">
                <input
                  type="text"
                  value={editedData?.skills.join(", ") || ""}
                  onChange={(e) => setEditedData(prev => ({ ...prev, skills: e.target.value.split(",").map(s => s.trim()) }))}
                  className="w-full border-b border-[#3CBCEC] bg-transparent focus:outline-none text-sm"
                  placeholder="Skill 1, Skill 2, Skill 3..."
                  onClick={(e) => e.stopPropagation()}
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={handleCancel}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-3 py-1 text-sm bg-[#3CBCEC] text-white rounded hover:bg-[#2da5cc] transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-[#E6F7FC] dark:bg-zinc-700 p-4 rounded">
              <div className="flex flex-wrap gap-2">
                {displayData.skills.map((skill, idx) => (
                  <span key={idx} className="text-sm">{skill}</span>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Experience */}
      <section 
        className={`mb-6 cursor-pointer relative group ${editingSection === "experience" ? "ring-2 ring-[#3CBCEC] rounded p-2" : "hover:bg-gray-50 dark:hover:bg-zinc-700 rounded p-2"}`}
        onClick={() => handleSectionClick("experience")}
      >
        {editingSection !== "experience" && (
          <Pencil className="absolute right-2 top-2 w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
        <h2 className="text-lg font-bold text-[#3CBCEC] mb-2">EXPERIENCE</h2>
        {editingSection === "experience" ? (
          <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
            {editedData.experience.map((exp, idx) => (
              <div key={idx} className="mb-4 p-3 border border-[#3CBCEC] rounded relative">
                <button
                  onClick={() => {
                    const newExp = [...editedData.experience];
                    newExp.splice(idx, 1);
                    setEditedData(prev => ({ ...prev, experience: newExp }));
                  }}
                  className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) => {
                    const newExp = [...editedData.experience];
                    newExp[idx] = { ...newExp[idx], company: e.target.value };
                    setEditedData(prev => ({ ...prev, experience: newExp }));
                  }}
                  className="font-bold text-sm w-full border-b border-gray-300 mb-1 focus:outline-none"
                  placeholder="Company Name"
                />
                <input
                  type="text"
                  value={exp.location}
                  onChange={(e) => {
                    const newExp = [...editedData.experience];
                    newExp[idx] = { ...newExp[idx], location: e.target.value };
                    setEditedData(prev => ({ ...prev, experience: newExp }));
                  }}
                  className="text-sm w-full border-b border-gray-300 mb-1 focus:outline-none"
                  placeholder="Location"
                />
                <input
                  type="text"
                  value={exp.title}
                  onChange={(e) => {
                    const newExp = [...editedData.experience];
                    newExp[idx] = { ...newExp[idx], title: e.target.value };
                    setEditedData(prev => ({ ...prev, experience: newExp }));
                  }}
                  className="text-sm w-full border-b border-gray-300 mb-1 focus:outline-none italic"
                  placeholder="Job Title"
                />
                <input
                  type="text"
                  value={exp.period}
                  onChange={(e) => {
                    const newExp = [...editedData.experience];
                    newExp[idx] = { ...newExp[idx], period: e.target.value };
                    setEditedData(prev => ({ ...prev, experience: newExp }));
                  }}
                  className="text-xs text-gray-600 dark:text-zinc-400 w-full border-b border-gray-300 mb-1 focus:outline-none"
                  placeholder="MONTH 20XX - PRESENT"
                />
                <textarea
                  value={exp.description}
                  onChange={(e) => {
                    const newExp = [...editedData.experience];
                    newExp[idx] = { ...newExp[idx], description: e.target.value };
                    setEditedData(prev => ({ ...prev, experience: newExp }));
                  }}
                  className="text-sm w-full border border-gray-300 rounded p-2 mb-1 focus:outline-none min-h-[60px]"
                  placeholder="Description"
                />
                <input
                  type="text"
                  value={exp.technologies}
                  onChange={(e) => {
                    const newExp = [...editedData.experience];
                    newExp[idx] = { ...newExp[idx], technologies: e.target.value };
                    setEditedData(prev => ({ ...prev, experience: newExp }));
                  }}
                  className="text-sm w-full border-b border-gray-300 focus:outline-none"
                  placeholder="Technologies Used"
                />
              </div>
            ))}
            <button
              onClick={() => {
                const newExp = [...editedData.experience];
                newExp.push({
                  company: "[Company Name]",
                  location: "Location",
                  title: "Job Title",
                  period: "MONTH 20XX - PRESENT",
                  description: "[Description]",
                  technologies: "[Technologies]"
                });
                setEditedData(prev => ({ ...prev, experience: newExp }));
              }}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded text-sm text-gray-600 hover:border-[#3CBCEC] hover:text-[#3CBCEC] transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add New Experience
            </button>
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={handleCancel}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-1 text-sm bg-[#3CBCEC] text-white rounded hover:bg-[#2da5cc] transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          displayData.experience.map((exp, idx) => (
            <div key={idx} className="mb-4">
              <h3 className="font-bold text-sm">
                {exp.company}, {exp.location} - <span className="italic">{exp.title}</span>
              </h3>
              <p className="text-xs text-gray-600 dark:text-zinc-400 mb-1">{exp.period}</p>
              <p className="text-sm mb-1">{exp.description}</p>
              <p className="text-sm">Technologies Used: {exp.technologies}</p>
            </div>
          ))
        )}
      </section>

      {/* Education */}
      <section 
        className={`mb-6 cursor-pointer relative group ${editingSection === "education" ? "ring-2 ring-[#3CBCEC] rounded p-2" : "hover:bg-gray-50 dark:hover:bg-zinc-700 rounded p-2"}`}
        onClick={() => handleSectionClick("education")}
      >
        {editingSection !== "education" && (
          <Pencil className="absolute right-2 top-2 w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
        <h2 className="text-lg font-bold text-[#3CBCEC] mb-2">EDUCATION</h2>
        {editingSection === "education" ? (
          <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
            {editedData.education.map((edu, idx) => (
              <div key={idx} className="p-3 border border-[#3CBCEC] rounded relative">
                <button
                  onClick={() => {
                    const newEdu = [...editedData.education];
                    newEdu.splice(idx, 1);
                    setEditedData(prev => ({ ...prev, education: newEdu }));
                  }}
                  className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <input
                  type="text"
                  value={edu.school}
                  onChange={(e) => {
                    const newEdu = [...editedData.education];
                    newEdu[idx] = { ...newEdu[idx], school: e.target.value };
                    setEditedData(prev => ({ ...prev, education: newEdu }));
                  }}
                  className="font-bold text-sm w-full border-b border-gray-300 mb-1 focus:outline-none"
                  placeholder="School Name"
                />
                <input
                  type="text"
                  value={edu.location}
                  onChange={(e) => {
                    const newEdu = [...editedData.education];
                    newEdu[idx] = { ...newEdu[idx], location: e.target.value };
                    setEditedData(prev => ({ ...prev, education: newEdu }));
                  }}
                  className="text-sm w-full border-b border-gray-300 mb-1 focus:outline-none"
                  placeholder="Location"
                />
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => {
                    const newEdu = [...editedData.education];
                    newEdu[idx] = { ...newEdu[idx], degree: e.target.value };
                    setEditedData(prev => ({ ...prev, education: newEdu }));
                  }}
                  className="text-sm w-full border-b border-gray-300 mb-1 focus:outline-none italic"
                  placeholder="Degree"
                />
                <input
                  type="text"
                  value={edu.period}
                  onChange={(e) => {
                    const newEdu = [...editedData.education];
                    newEdu[idx] = { ...newEdu[idx], period: e.target.value };
                    setEditedData(prev => ({ ...prev, education: newEdu }));
                  }}
                  className="text-xs text-gray-600 dark:text-zinc-400 w-full border-b border-gray-300 focus:outline-none"
                  placeholder="MONTH 20XX - MONTH 20XX"
                />
              </div>
            ))}
            <button
              onClick={() => {
                const newEdu = [...editedData.education];
                newEdu.push({
                  school: "[School Name]",
                  location: "Location",
                  degree: "Degree",
                  period: "MONTH 20XX - MONTH 20XX"
                });
                setEditedData(prev => ({ ...prev, education: newEdu }));
              }}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded text-sm text-gray-600 hover:border-[#3CBCEC] hover:text-[#3CBCEC] transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add New Education
            </button>
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={handleCancel}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-1 text-sm bg-[#3CBCEC] text-white rounded hover:bg-[#2da5cc] transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          displayData.education.map((edu, idx) => (
            <div key={idx} className="mb-2">
              <h3 className="font-bold text-sm">
                {edu.school}, {edu.location} - <span className="italic">{edu.degree}</span>
              </h3>
              <p className="text-xs text-gray-600 dark:text-zinc-400">{edu.period}</p>
            </div>
          ))
        )}
      </section>

      {/* Awards */}
      <section 
        className={`mb-6 cursor-pointer relative group ${editingSection === "awards" ? "ring-2 ring-[#3CBCEC] rounded p-2" : "hover:bg-gray-50 dark:hover:bg-zinc-700 rounded p-2"}`}
        onClick={() => handleSectionClick("awards")}
      >
        {editingSection !== "awards" && (
          <Pencil className="absolute right-2 top-2 w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
        <h2 className="text-lg font-bold text-[#3CBCEC] mb-2">SPECIAL AWARDS/CERTIFICATIONS</h2>
        {editingSection === "awards" ? (
          <div onClick={(e) => e.stopPropagation()}>
            <textarea
              value={editedData?.awards || ""}
              onChange={(e) => setEditedData(prev => ({ ...prev, awards: e.target.value }))}
              className="text-sm w-full border border-[#3CBCEC] rounded p-2 focus:outline-none min-h-[60px]"
              autoFocus
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={handleCancel}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-1 text-sm bg-[#3CBCEC] text-white rounded hover:bg-[#2da5cc] transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm">{displayData.awards}</p>
        )}
      </section>

      {/* Projects */}
      <section 
        className={`mb-6 cursor-pointer relative group ${editingSection === "projects" ? "ring-2 ring-[#3CBCEC] rounded p-2" : "hover:bg-gray-50 dark:hover:bg-zinc-700 rounded p-2"}`}
        onClick={() => handleSectionClick("projects")}
      >
        {editingSection !== "projects" && (
          <Pencil className="absolute right-2 top-2 w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
        <h2 className="text-lg font-bold text-[#3CBCEC] mb-2">PROJECT SPECIFICATIONS</h2>
        {editingSection === "projects" ? (
          <div onClick={(e) => e.stopPropagation()}>
            <textarea
              value={editedData?.projects || ""}
              onChange={(e) => setEditedData(prev => ({ ...prev, projects: e.target.value }))}
              className="text-sm w-full border border-[#3CBCEC] rounded p-2 focus:outline-none min-h-[80px]"
              placeholder="Enter project details..."
              autoFocus
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={handleCancel}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-1 text-sm bg-[#3CBCEC] text-white rounded hover:bg-[#2da5cc] transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        ) : displayData.projects ? (
          <p className="text-sm">{displayData.projects}</p>
        ) : null}
      </section>

      {/* Skills - Bottom position */}
      {format === "skill-at-bottom" && (
        <section 
          className={`mb-6 cursor-pointer relative group ${editingSection === "skills" ? "ring-2 ring-[#3CBCEC] rounded p-2" : "hover:bg-gray-50 dark:hover:bg-zinc-700 rounded p-2"}`}
          onClick={() => handleSectionClick("skills")}
        >
          {editingSection !== "skills" && (
            <Pencil className="absolute right-2 top-2 w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
          <h2 className="text-lg font-bold text-[#3CBCEC] mb-2">SKILLS</h2>
          {editingSection === "skills" ? (
            <div onClick={(e) => e.stopPropagation()}>
              <div className="bg-[#E6F7FC] dark:bg-zinc-700 p-4 rounded">
                <input
                  type="text"
                  value={editedData?.skills.join(", ") || ""}
                  onChange={(e) => setEditedData(prev => ({ ...prev, skills: e.target.value.split(",").map(s => s.trim()) }))}
                  className="w-full border-b border-[#3CBCEC] bg-transparent focus:outline-none text-sm"
                  placeholder="Skill 1, Skill 2, Skill 3..."
                  onClick={(e) => e.stopPropagation()}
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={handleCancel}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-3 py-1 text-sm bg-[#3CBCEC] text-white rounded hover:bg-[#2da5cc] transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-[#E6F7FC] dark:bg-zinc-700 p-4 rounded">
              <div className="flex flex-wrap gap-2">
                {displayData.skills.map((skill, idx) => (
                  <span key={idx} className="text-sm">{skill}</span>
                ))}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
