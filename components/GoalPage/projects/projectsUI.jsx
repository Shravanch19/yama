"use client";
import React, { useState, useEffect } from 'react';
import Add_Project from './projectsModal';
import ProjectCard from './projectCard';

const ProjectsUI = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleEditProject = (project) => {
    setEditingProject(project);
    setShowModal(true);
  };

  const onProjectSaved = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/projects');
      const data = await response.json();
      setProjects(Array.isArray(data) ? data : []);
      setError(null);
      setEditingProject(null);
      setShowModal(false);
    } catch (err) {
      console.error('Error refreshing projects:', err);
      setError('Failed to refresh projects');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    //  refresh the project list after deletion
    try {
      setLoading(true);
      const response = await fetch('/api/projects');
      const data = await response.json();
      setProjects(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error('Error refreshing projects after deletion:', err);
      setError('Failed to refresh projects');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/projects');
        const data = await response.json();
        setProjects(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects');
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <section className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-purple-300">Projects</h2>
        <Add_Project 
          isOpen={showModal}
          setIsOpen={setShowModal}
          existingProject={editingProject}
          onSave={onProjectSaved}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-2 text-center py-8">
            <div className="animate-pulse text-gray-600 dark:text-purple-300">Loading projects...</div>
          </div>
        ) : error ? (
          <div className="col-span-2 text-center py-8">
            <div className="text-red-500">{error}</div>
          </div>
        ) : projects.length === 0 ? (
          <div className="col-span-2 text-center py-8">
            <div className="text-gray-600 dark:text-purple-300">No projects found. Create your first project!</div>
          </div>
        ) : (
          projects.map((project) => (
            <ProjectCard 
              key={project._id} 
              project={project} 
              onEdit={handleEditProject}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default ProjectsUI;