import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { Plus, BookOpen, Users, TrendingUp, Edit, Trash2 } from 'lucide-react';

const Modules = () => {
  const { appData, addCourse } = useApp();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newModule, setNewModule] = useState({
    name: '',
    subject: '',
    description: '',
    level: 'beginner'
  });

  const handleCreateModule = () => {
    if (newModule.name && newModule.subject) {
      addCourse({
        name: newModule.name,
        subject: newModule.subject,
        level: newModule.level,
        createdBy: 'admin',
        chapters: []
      });
      setNewModule({ name: '', subject: '', description: '', level: 'beginner' });
      setShowCreateModal(false);
    }
  };

  // Calculate module effectiveness
  const getModuleStats = (course) => {
    const studentsUsing = appData.students.filter(s => 
      s.subjects.includes(course.subject)
    );
    
    const avgImprovement = studentsUsing.length > 0
      ? Math.round(studentsUsing.reduce((sum, s) => sum + s.progress, 0) / studentsUsing.length)
      : 0;

    return {
      studentsUsing: studentsUsing.length,
      avgImprovement
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Learning Modules</h1>
          <p className="text-gray-500 mt-1">Content management and effectiveness</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Module
        </Button>
      </div>

      {/* Module List */}
      <div className="grid grid-cols-1 gap-4">
        {appData.courses.map((course) => {
          const stats = getModuleStats(course);
          const mentor = appData.mentors.find(m => m.id === course.createdBy);

          return (
            <Card key={course.id}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">{course.name}</h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
                      {course.subject}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">
                    Created by: {mentor?.name || 'Admin'} • Level: {course.level}
                  </p>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="w-4 h-4 text-gray-500" />
                        <p className="text-xs text-gray-500">Students Using</p>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{stats.studentsUsing}</p>
                    </div>

                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <p className="text-xs text-gray-500">Avg Improvement</p>
                      </div>
                      <p className="text-2xl font-bold text-green-600">+{stats.avgImprovement}%</p>
                    </div>

                    <div className="p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <BookOpen className="w-4 h-4 text-purple-600" />
                        <p className="text-xs text-gray-500">Chapters</p>
                      </div>
                      <p className="text-2xl font-bold text-purple-600">{course.chapters.length}</p>
                    </div>
                  </div>

                  {/* Effectiveness Indicator */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm text-gray-600">Module Effectiveness</p>
                      <p className="text-sm font-semibold text-gray-900">{stats.avgImprovement}%</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          stats.avgImprovement >= 70 ? 'bg-green-600' :
                          stats.avgImprovement >= 40 ? 'bg-yellow-600' :
                          'bg-red-600'
                        }`}
                        style={{ width: `${Math.min(stats.avgImprovement, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button variant="secondary" className="flex-1">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Content
                    </Button>
                    <Button className="flex-1">
                      View Details
                    </Button>
                    {stats.avgImprovement < 40 && (
                      <Button variant="danger" className="flex-1">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Archive
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Create Module Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Module"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Module Name</label>
            <input
              type="text"
              value={newModule.name}
              onChange={(e) => setNewModule({ ...newModule, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Advanced Mathematics"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Subject</label>
            <input
              type="text"
              value={newModule.subject}
              onChange={(e) => setNewModule({ ...newModule, subject: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Math"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Level</label>
            <select
              value={newModule.level}
              onChange={(e) => setNewModule({ ...newModule, level: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Description</label>
            <textarea
              value={newModule.description}
              onChange={(e) => setNewModule({ ...newModule, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
              placeholder="Brief description of the module..."
            />
          </div>

          <Button
            onClick={handleCreateModule}
            disabled={!newModule.name || !newModule.subject}
            className="w-full"
          >
            Create Module
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Modules;
