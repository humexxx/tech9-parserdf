"use client";

import { useState, useEffect } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import Image from "next/image";
import { ResumeData, EditableSection } from "@/app/types/resume";

interface EditableResumeProps {
  data: ResumeData;
  format: string;
  onDataChange?: (data: ResumeData) => void;
  onHiddenSectionsChange?: (sections: string[]) => void;
}

export default function EditableResume({ data, format, onDataChange, onHiddenSectionsChange }: EditableResumeProps) {
  const [editingSection, setEditingSection] = useState<EditableSection>(null);
  const [editedData, setEditedData] = useState<ResumeData>(data);
  const [originalData, setOriginalData] = useState<ResumeData>(data);
  const [prevData, setPrevData] = useState<ResumeData>(data);
  
  // Function to calculate which sections should be hidden
  const calculateHiddenSections = (resumeData: ResumeData) => {
    const initialHidden = new Set<keyof ResumeData>();
    
    // Check each section and hide if empty
    if (!resumeData.location || resumeData.location.trim() === '' || resumeData.location === 'Location:') {
      initialHidden.add('location');
    }
    if (!resumeData.linkedIn || resumeData.linkedIn.trim() === '' || resumeData.linkedIn === 'LinkedIn Profile:') {
      initialHidden.add('linkedIn');
    }
    if (!resumeData.summary || resumeData.summary.length === 0) {
      initialHidden.add('summary');
    }
    if (!resumeData.skills || resumeData.skills.length === 0) {
      initialHidden.add('skills');
    }
    if (!resumeData.experience || resumeData.experience.length === 0) {
      initialHidden.add('experience');
    }
    if (!resumeData.education || resumeData.education.length === 0) {
      initialHidden.add('education');
    }
    if (!resumeData.awards || resumeData.awards.trim() === '') {
      initialHidden.add('awards');
    }
    if (!resumeData.projects || resumeData.projects.trim() === '') {
      initialHidden.add('projects');
    }
    
    return initialHidden;
  };
  
  const [hiddenSections, setHiddenSections] = useState<Set<keyof ResumeData>>(() => calculateHiddenSections(data));
  
  // Detect when data prop changes (when switching between files)
  // This pattern is recommended by React to avoid cascading renders in useEffect
  if (data !== prevData) {
    setPrevData(data);
    setEditedData(data);
    setOriginalData(data);
    setEditingSection(null);
    setHiddenSections(calculateHiddenSections(data));
  }

  // Notify parent of initially hidden sections
  useEffect(() => {
    if (hiddenSections.size > 0) {
      onHiddenSectionsChange?.(Array.from(hiddenSections));
    }
  }, []);

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

  const handleDeleteSection = (section: keyof ResumeData) => {
    if (section === 'name') return;

    const newHiddenSections = new Set(hiddenSections);
    newHiddenSections.add(section);
    setHiddenSections(newHiddenSections);
    setEditingSection(null);
    onHiddenSectionsChange?.(Array.from(newHiddenSections));
  };

  const handleRestoreSection = (section: keyof ResumeData) => {
    const newHiddenSections = new Set(hiddenSections);
    newHiddenSections.delete(section);
    setHiddenSections(newHiddenSections);
    onHiddenSectionsChange?.(Array.from(newHiddenSections));
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
        className={`cursor-pointer relative group ${
          hiddenSections.has("location") 
            ? "opacity-40 bg-gray-100 dark:bg-zinc-900 rounded p-2 mb-1" 
            : editingSection === "location" 
              ? "ring-2 ring-[#3CBCEC] rounded p-2 mb-1" 
              : "hover:bg-gray-50 dark:hover:bg-zinc-700 rounded p-2 mb-1"
        }`}
        onClick={(e) => { e.stopPropagation(); !hiddenSections.has("location") && handleSectionClick("location"); }}
      >
        {editingSection !== "location" && !hiddenSections.has("location") && (
          <div className="absolute right-2 top-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Pencil className="w-4 h-4 text-gray-400" />
            <Trash2
              className="w-4 h-4 text-red-400 hover:text-red-500 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteSection("location");
              }}
            />
          </div>
        )}
        {hiddenSections.has("location") && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRestoreSection("location");
            }}
            className="absolute right-2 top-2 px-3 py-1 text-xs bg-[#3CBCEC] text-white rounded hover:bg-[#2da5cc] transition-colors"
          >
            Show
          </button>
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
          <p className="text-sm">
            {displayData.location?.startsWith('Location:') 
              ? displayData.location 
              : `Location: ${displayData.location}`}
          </p>
        )}
      </div>

      {/* LinkedIn */}
      <div
        className={`mb-6 cursor-pointer relative group ${
          hiddenSections.has("linkedIn") 
            ? "opacity-40 bg-gray-100 dark:bg-zinc-900 rounded p-2" 
            : editingSection === "linkedIn" 
              ? "ring-2 ring-[#3CBCEC] rounded p-2" 
              : "hover:bg-gray-50 dark:hover:bg-zinc-700 rounded p-2"
        }`}
        onClick={(e) => { e.stopPropagation(); !hiddenSections.has("linkedIn") && handleSectionClick("linkedIn"); }}
      >
        {editingSection !== "linkedIn" && !hiddenSections.has("linkedIn") && (
          <div className="absolute right-2 top-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Pencil className="w-4 h-4 text-gray-400" />
            <Trash2
              className="w-4 h-4 text-red-400 hover:text-red-500 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteSection("linkedIn");
              }}
            />
          </div>
        )}
        {hiddenSections.has("linkedIn") && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRestoreSection("linkedIn");
            }}
            className="absolute right-2 top-2 px-3 py-1 text-xs bg-[#3CBCEC] text-white rounded hover:bg-[#2da5cc] transition-colors"
          >
            Show
          </button>
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
          <p className="text-sm">
            {displayData.linkedIn?.startsWith('LinkedIn Profile:') 
              ? displayData.linkedIn 
              : `LinkedIn: ${displayData.linkedIn}`}
          </p>
        )}
      </div>

      {/* Summary */}
      <section
        className={`mb-6 cursor-pointer relative group ${
          hiddenSections.has("summary") 
            ? "opacity-40 bg-gray-100 dark:bg-zinc-900 rounded p-2" 
            : editingSection === "summary" 
              ? "ring-2 ring-[#3CBCEC] rounded p-2" 
              : "hover:bg-gray-50 dark:hover:bg-zinc-700 rounded p-2"
        }`}
        onClick={() => !hiddenSections.has("summary") && handleSectionClick("summary")}
      >
        {editingSection !== "summary" && !hiddenSections.has("summary") && (
          <div className="absolute right-2 top-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Pencil className="w-4 h-4 text-gray-400" />
            <Trash2
              className="w-4 h-4 text-red-400 hover:text-red-500 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteSection("summary");
              }}
            />
          </div>
        )}
        {hiddenSections.has("summary") && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRestoreSection("summary");
            }}
            className="absolute right-2 top-2 px-3 py-1 text-xs bg-[#3CBCEC] text-white rounded hover:bg-[#2da5cc] transition-colors"
          >
            Show
          </button>
        )}
        <h2 className="text-lg font-bold text-[#3CBCEC] mb-2">SUMMARY</h2>
        {editingSection === "summary" ? (
          <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="space-y-4">
              {editedData.summary.map((point, idx) => (
                <div key={idx} className="bg-[#f8f7f3] p-3 rounded flex gap-2">
                  <textarea
                    value={point}
                    onChange={(e) => {
                      const newSummary = [...editedData.summary];
                      newSummary[idx] = e.target.value;
                      setEditedData(prev => ({ ...prev, summary: newSummary }));
                    }}
                    className="flex-1 text-[10px] text-[#52525b] bg-white border border-[#d4d4d4] rounded-sm px-2 py-2 focus:outline-none focus:border-[#3CBCEC] min-h-[60px] resize-y"
                    placeholder="Enter summary point..."
                  />
                  <button
                    onClick={() => {
                      const newSummary = editedData.summary.filter((_, i) => i !== idx);
                      setEditedData(prev => ({ ...prev, summary: newSummary }));
                    }}
                    className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors self-start"
                    title="Remove"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Summary Point Button */}
            <div className="border-b border-[rgba(62,190,237,0.18)] pb-4 flex justify-center">
              <button
                onClick={() => {
                  setEditedData(prev => ({
                    ...prev,
                    summary: [...prev.summary, ""]
                  }));
                }}
                className="border-2 border-dashed border-gray-300 rounded flex items-center justify-center gap-1.5 px-4 py-1.5 hover:border-[#3CBCEC] hover:bg-gray-50 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span className="text-sm">Add Point</span>
              </button>
            </div>

            {/* Cancel and Save Buttons */}
            <div className="flex justify-end gap-2">
              <button
                onClick={handleCancel}
                className="px-4 py-1.5 text-[10px] bg-white border border-[#d4d4d4] rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-1.5 text-[10px] bg-[#3CBCEC] text-white rounded hover:bg-[#2da5cc] transition-colors font-medium"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          displayData.summary && displayData.summary.length > 0 && (
            displayData.summary.length === 1 ? (
              <p className="text-sm">{displayData.summary[0]}</p>
            ) : (
              <ul className="list-disc list-inside text-sm space-y-1">
                {displayData.summary.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            )
          )
        )}
      </section>

      {/* Skills - Top position */}
      {format === "skill-at-top" && (
        <section
          className={`mb-6 cursor-pointer relative group ${
            hiddenSections.has("skills") 
              ? "opacity-40 bg-gray-100 dark:bg-zinc-900 rounded p-2" 
              : editingSection === "skills" 
                ? "ring-2 ring-[#3CBCEC] rounded p-2" 
                : "hover:bg-gray-50 dark:hover:bg-zinc-700 rounded p-2"
          }`}
          onClick={() => !hiddenSections.has("skills") && handleSectionClick("skills")}
        >
          {editingSection !== "skills" && !hiddenSections.has("skills") && (
            <div className="absolute right-2 top-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Pencil className="w-4 h-4 text-gray-400" />
              <Trash2
                className="w-4 h-4 text-red-400 hover:text-red-500 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteSection("skills");
                }}
              />
            </div>
          )}
          {hiddenSections.has("skills") && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRestoreSection("skills");
              }}
              className="absolute right-2 top-2 px-3 py-1 text-xs bg-[#3CBCEC] text-white rounded hover:bg-[#2da5cc] transition-colors"
            >
              Show
            </button>
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
                  <span key={idx} className="bg-white dark:bg-zinc-600 text-[#18181b] dark:text-zinc-200 text-sm px-3 py-1.5 rounded-md border border-gray-200 dark:border-zinc-500">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Experience */}
      <section
        className={`mb-6 cursor-pointer relative group ${
          hiddenSections.has("experience") 
            ? "opacity-40 bg-gray-100 dark:bg-zinc-900 rounded p-2" 
            : editingSection === "experience" 
              ? "border border-[#3CBCEC] rounded p-2" 
              : "hover:bg-gray-50 dark:hover:bg-zinc-700 rounded p-2"
        }`}
        onClick={() => !hiddenSections.has("experience") && handleSectionClick("experience")}
      >
        {editingSection !== "experience" && !hiddenSections.has("experience") && (
          <div className="absolute right-2 top-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Pencil className="w-4 h-4 text-gray-400" />
            <Trash2
              className="w-4 h-4 text-red-400 hover:text-red-500 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteSection("experience");
              }}
            />
          </div>
        )}
        {hiddenSections.has("experience") && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRestoreSection("experience");
            }}
            className="absolute right-2 top-2 px-3 py-1 text-xs bg-[#3CBCEC] text-white rounded hover:bg-[#2da5cc] transition-colors"
          >
            Show
          </button>
        )}
        <h2 className="text-lg font-bold text-[#3CBCEC] mb-2 tracking-[2px]">EXPERIENCE</h2>
        {editingSection === "experience" ? (
          <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="space-y-4">
              {editedData.experience.map((exp, idx) => (
                <div key={idx} className="bg-[#f8f7f3] p-3 rounded flex flex-col gap-2">
                  {/* Company Name with Delete */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => {
                        const newExp = [...editedData.experience];
                        newExp[idx] = { ...newExp[idx], company: e.target.value };
                        setEditedData(prev => ({ ...prev, experience: newExp }));
                      }}
                      className="flex-1 font-bold text-[11px] text-[#52525b] bg-white border border-[#d4d4d4] rounded-sm px-2 py-2 focus:outline-none focus:border-[#3CBCEC]"
                      placeholder="[Company Name]"
                    />
                    <button
                      onClick={() => {
                        const newExp = [...editedData.experience];
                        newExp.splice(idx, 1);
                        setEditedData(prev => ({ ...prev, experience: newExp }));
                      }}
                      className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Location and Job Title */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={exp.location}
                      onChange={(e) => {
                        const newExp = [...editedData.experience];
                        newExp[idx] = { ...newExp[idx], location: e.target.value };
                        setEditedData(prev => ({ ...prev, experience: newExp }));
                      }}
                      className="flex-1 text-[10px] text-[#52525b] bg-white border border-[#d4d4d4] rounded-sm px-2 py-2 focus:outline-none focus:border-[#3CBCEC]"
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
                      className="flex-1 text-[10px] text-[#52525b] italic bg-white border border-[#d4d4d4] rounded-sm px-2 py-2 focus:outline-none focus:border-[#3CBCEC]"
                      placeholder="Job Title"
                    />
                  </div>

                  {/* Period */}
                  <input
                    type="text"
                    value={exp.period}
                    onChange={(e) => {
                      const newExp = [...editedData.experience];
                      newExp[idx] = { ...newExp[idx], period: e.target.value };
                      setEditedData(prev => ({ ...prev, experience: newExp }));
                    }}
                    className="w-full text-[10px] text-[#52525b] bg-white border border-[#d4d4d4] rounded-sm px-2 py-2 focus:outline-none focus:border-[#3CBCEC]"
                    placeholder="MONTH 20XX - PRESENT"
                  />

                  {/* Description */}
                  <textarea
                    value={exp.description}
                    onChange={(e) => {
                      const newExp = [...editedData.experience];
                      newExp[idx] = { ...newExp[idx], description: e.target.value };
                      setEditedData(prev => ({ ...prev, experience: newExp }));
                    }}
                    className="w-full text-[10px] text-[#52525b] bg-white border border-[#d4d4d4] rounded-sm px-2 py-2 focus:outline-none focus:border-[#3CBCEC] min-h-[80px] resize-y"
                    placeholder="[Insert 4-5 bullet points detailing a problem, action, and result of that action]\nTechnologies Used"
                  />

                  {/* Technologies */}
                  <input
                    type="text"
                    value={exp.technologies}
                    onChange={(e) => {
                      const newExp = [...editedData.experience];
                      newExp[idx] = { ...newExp[idx], technologies: e.target.value };
                      setEditedData(prev => ({ ...prev, experience: newExp }));
                    }}
                    className="w-full text-[10px] text-[#52525b] bg-white border border-[#d4d4d4] rounded-sm px-2 py-2 focus:outline-none focus:border-[#3CBCEC]"
                    placeholder="[Insert 5-6 main technologies you used during your time here separated by comma]"
                  />
                </div>
              ))}
            </div>

            {/* Add Experience Button */}
            <div className="border-b border-[rgba(62,190,237,0.18)] pb-4 flex justify-center">
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
                className="border-2 border-dashed border-gray-300 rounded flex items-center justify-center gap-1.5 px-4 py-1.5 hover:border-[#3CBCEC] hover:bg-gray-50 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span className="text-[11px] text-[#18181b]">Add Experience</span>
              </button>
            </div>

            {/* Cancel and Save Buttons */}
            <div className="flex justify-end gap-2">
              <button
                onClick={handleCancel}
                className="px-4 py-1.5 text-[10px] bg-white border border-[#d4d4d4] rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-1.5 text-[10px] bg-[#3CBCEC] text-white rounded hover:bg-[#2da5cc] transition-colors font-medium"
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
        className={`mb-6 cursor-pointer relative group ${
          hiddenSections.has("education") 
            ? "opacity-40 bg-gray-100 dark:bg-zinc-900 rounded p-2" 
            : editingSection === "education" 
              ? "border border-[#3CBCEC] rounded p-2" 
              : "hover:bg-gray-50 dark:hover:bg-zinc-700 rounded p-2"
        }`}
        onClick={() => !hiddenSections.has("education") && handleSectionClick("education")}
      >
        {editingSection !== "education" && !hiddenSections.has("education") && (
          <div className="absolute right-2 top-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Pencil className="w-4 h-4 text-gray-400" />
            <Trash2
              className="w-4 h-4 text-red-400 hover:text-red-500 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteSection("education");
              }}
            />
          </div>
        )}
        {hiddenSections.has("education") && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRestoreSection("education");
            }}
            className="absolute right-2 top-2 px-3 py-1 text-xs bg-[#3CBCEC] text-white rounded hover:bg-[#2da5cc] transition-colors"
          >
            Show
          </button>
        )}
        <h2 className="text-lg font-bold text-[#3CBCEC] mb-2 tracking-[2px]">EDUCATION</h2>
        {editingSection === "education" ? (
          <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="space-y-4">
              {editedData.education.map((edu, idx) => (
                <div key={idx} className="bg-[#f8f7f3] p-3 rounded flex flex-col gap-2">
                  {/* School Name with Delete */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={edu.school}
                      onChange={(e) => {
                        const newEdu = [...editedData.education];
                        newEdu[idx] = { ...newEdu[idx], school: e.target.value };
                        setEditedData(prev => ({ ...prev, education: newEdu }));
                      }}
                      className="flex-1 font-bold text-[11px] text-[#52525b] bg-white border border-[#d4d4d4] rounded-sm px-2 py-2 focus:outline-none focus:border-[#3CBCEC]"
                      placeholder="School Name - Location"
                    />
                    <button
                      onClick={() => {
                        const newEdu = [...editedData.education];
                        newEdu.splice(idx, 1);
                        setEditedData(prev => ({ ...prev, education: newEdu }));
                      }}
                      className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Degree */}
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => {
                      const newEdu = [...editedData.education];
                      newEdu[idx] = { ...newEdu[idx], degree: e.target.value };
                      setEditedData(prev => ({ ...prev, education: newEdu }));
                    }}
                    className="w-full text-[11px] text-[#52525b] italic bg-white border border-[#d4d4d4] rounded-sm px-2 py-2 focus:outline-none focus:border-[#3CBCEC]"
                    placeholder="Degree"
                  />

                  {/* Period */}
                  <input
                    type="text"
                    value={edu.period}
                    onChange={(e) => {
                      const newEdu = [...editedData.education];
                      newEdu[idx] = { ...newEdu[idx], period: e.target.value };
                      setEditedData(prev => ({ ...prev, education: newEdu }));
                    }}
                    className="w-full text-[10px] text-[#52525b] bg-white border border-[#d4d4d4] rounded-sm px-2 py-2 focus:outline-none focus:border-[#3CBCEC]"
                    placeholder="YEAR - YEAR"
                  />
                </div>
              ))}
            </div>

            {/* Add Education Button */}
            <div className="border-b border-[rgba(62,190,237,0.18)] pb-4 flex justify-center">
              <button
                onClick={() => {
                  const newEdu = [...editedData.education];
                  newEdu.push({
                    school: "[School Name]",
                    location: "Location",
                    degree: "Degree",
                    period: "YEAR - YEAR"
                  });
                  setEditedData(prev => ({ ...prev, education: newEdu }));
                }}
                className="border-2 border-dashed border-gray-300 rounded flex items-center justify-center gap-1.5 px-4 py-1.5 hover:border-[#3CBCEC] hover:bg-gray-50 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span className="text-[11px] text-[#18181b]">Add Education</span>
              </button>
            </div>

            {/* Cancel and Save Buttons */}
            <div className="flex justify-end gap-2">
              <button
                onClick={handleCancel}
                className="px-4 py-1.5 text-[10px] bg-white border border-[#d4d4d4] rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-1.5 text-[10px] bg-[#3CBCEC] text-white rounded hover:bg-[#2da5cc] transition-colors font-medium"
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
        className={`mb-6 cursor-pointer relative group ${
          hiddenSections.has("awards") 
            ? "opacity-40 bg-gray-100 dark:bg-zinc-900 rounded p-2" 
            : editingSection === "awards" 
              ? "ring-2 ring-[#3CBCEC] rounded p-2" 
              : "hover:bg-gray-50 dark:hover:bg-zinc-700 rounded p-2"
        }`}
        onClick={() => !hiddenSections.has("awards") && handleSectionClick("awards")}
      >
        {editingSection !== "awards" && !hiddenSections.has("awards") && (
          <div className="absolute right-2 top-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Pencil className="w-4 h-4 text-gray-400" />
            <Trash2
              className="w-4 h-4 text-red-400 hover:text-red-500 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteSection("awards");
              }}
            />
          </div>
        )}
        {hiddenSections.has("awards") && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRestoreSection("awards");
            }}
            className="absolute right-2 top-2 px-3 py-1 text-xs bg-[#3CBCEC] text-white rounded hover:bg-[#2da5cc] transition-colors"
          >
            Show
          </button>
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
        className={`mb-6 cursor-pointer relative group ${
          hiddenSections.has("projects") 
            ? "opacity-40 bg-gray-100 dark:bg-zinc-900 rounded p-2" 
            : editingSection === "projects" 
              ? "ring-2 ring-[#3CBCEC] rounded p-2" 
              : "hover:bg-gray-50 dark:hover:bg-zinc-700 rounded p-2"
        }`}
        onClick={() => !hiddenSections.has("projects") && handleSectionClick("projects")}
      >
        {editingSection !== "projects" && !hiddenSections.has("projects") && (
          <div className="absolute right-2 top-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Pencil className="w-4 h-4 text-gray-400" />
            <Trash2
              className="w-4 h-4 text-red-400 hover:text-red-500 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteSection("projects");
              }}
            />
          </div>
        )}
        {hiddenSections.has("projects") && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRestoreSection("projects");
            }}
            className="absolute right-2 top-2 px-3 py-1 text-xs bg-[#3CBCEC] text-white rounded hover:bg-[#2da5cc] transition-colors"
          >
            Show
          </button>
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
          className={`mb-6 cursor-pointer relative group ${
            hiddenSections.has("skills") 
              ? "opacity-40 bg-gray-100 dark:bg-zinc-900 rounded p-2" 
              : editingSection === "skills" 
                ? "ring-2 ring-[#3CBCEC] rounded p-2" 
                : "hover:bg-gray-50 dark:hover:bg-zinc-700 rounded p-2"
          }`}
          onClick={() => !hiddenSections.has("skills") && handleSectionClick("skills")}
        >
          {editingSection !== "skills" && !hiddenSections.has("skills") && (
            <div className="absolute right-2 top-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Pencil className="w-4 h-4 text-gray-400" />
              <Trash2
                className="w-4 h-4 text-red-400 hover:text-red-500 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteSection("skills");
                }}
              />
            </div>
          )}
          {hiddenSections.has("skills") && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRestoreSection("skills");
              }}
              className="absolute right-2 top-2 px-3 py-1 text-xs bg-[#3CBCEC] text-white rounded hover:bg-[#2da5cc] transition-colors"
            >
              Show
            </button>
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
                  <span key={idx} className="bg-white dark:bg-zinc-600 text-[#18181b] dark:text-zinc-200 text-sm px-3 py-1.5 rounded-md border border-gray-200 dark:border-zinc-500">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
