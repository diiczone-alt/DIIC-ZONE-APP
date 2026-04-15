'use client';

import { useState } from 'react';
import AcademyDashboard from '@/components/academy/AcademyDashboard';
import CourseView from '@/components/academy/CourseView';

export default function AcademyPage() {
    const [view, setView] = useState('dashboard');
    const [selectedCourse, setSelectedCourse] = useState(null);

    const handleSelectCourse = (course) => {
        setSelectedCourse(course);
        setView('course');
    };

    return (
        <div className="bg-[#050511] min-h-screen">
            {view === 'dashboard' && (
                <AcademyDashboard onSelectCourse={handleSelectCourse} />
            )}

            {view === 'course' && (
                <CourseView
                    course={selectedCourse}
                    onBack={() => setView('dashboard')}
                />
            )}
        </div>
    );
}
